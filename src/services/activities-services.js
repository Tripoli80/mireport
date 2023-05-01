import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const activitiesService = {};
const webhookUrl = process.env.BX_API;

async function getDealsInPipeline(category, closed) {
  let filter = category ? { CATEGORY_ID: category } : {};
  if (closed) filter = { ...filter, CLOSED: closed };

  const response = await axios.get(`${webhookUrl}/crm.deal.list`, {
    params: {
      filter,
      select: ["ID", "TITLE", "ASSIGNED_BY_ID"],
    },
  });

  return response.data;
}

async function getAllDealsWithBatch(category, closed) {
  // Получите общее количество сделок
  const firstResponse = await getDealsInPipeline(category, closed);
  const totalDeals = firstResponse.total;
  const batchSize = 50;

  // Рассчитайте количество батчей
  const batchCount = Math.ceil(totalDeals / batchSize);

  // Формирование запросов батча
  const calls = {};
  for (let i = 0; i < batchCount; i++) {
    let value = `crm.deal.list?start=${
      i * batchSize
    }&order[ID]=ASC&select[]=ID&select[]=TITLE&select[]=ASSIGNED_BY_ID`;
    value = category ? `${value}&filter[CATEGORY_ID]=${category}` : value;
    value = closed ? `${value}&filter[CLOSED]=${closed}` : value;

    calls[`deals_batch_${i}`] = value;
  }

  // Выполните батч-запрос
  const batchResults = await batchRequest(calls);

  // Объедините результаты всех запросов
  const allDeals = [];
  for (const key in batchResults) {
    allDeals.push(...batchResults[key]);
  }

  allDeals.forEach((deal) => {
    if (deal.ID == "672")
      console.log("🚀 ~ file: activities-services.js:165 ~ activity:");
  });

  return allDeals;
}

async function getActivitiesForDeals(deals) {
  const calls = {};

  deals.forEach((deal, index) => {
    calls[
      `call_${index}`
    ] = `crm.activity.list?filter[OWNER_TYPE_ID]=2&filter[OWNER_ID]=${deal.ID}&select="*"&select="COMMUNICATIONS"&select="ORIGIN_VERSION"`;
  });

  const activities = await batchRequest(calls);

  for (const key in activities) {
    const index = parseInt(key.split("_")[1]);
    deals[index].activities = activities[key];
  }
}

async function getManagerNames(deals) {
  const userIds = Array.from(new Set(deals.map((deal) => deal.ASSIGNED_BY_ID)));
  const calls = {};

  userIds.forEach((userId, index) => {
    if (userId) {
      calls[`call_${index}`] = `user.get?ID=${userId}`;
    }
  });

  const userResults = await batchRequest(calls);
  const users = {};

  for (const key in userResults) {
    const user = userResults[key][0];

    users[user.ID] = `${user.NAME} ${user.LAST_NAME}`;
  }

  deals.forEach((deal) => {
    deal.managerName = users[deal.ASSIGNED_BY_ID];
  });
}

async function batchRequest(calls) {
  const callsArray = Object.entries(calls);
  const chunkedCallsArray = chunkArray(callsArray, 50);
  const result = {};

  for (const chunk of chunkedCallsArray) {
    const chunkCalls = Object.fromEntries(chunk);
    const response = await axios.post(`${webhookUrl}/batch`, {
      halt: 0,
      cmd: chunkCalls,
    });

    Object.assign(result, response.data.result.result);
  }

  return result;
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function groupDealsByManager(deals) {
  const managers = {};

  deals.forEach((deal) => {
    if (!managers[deal.ASSIGNED_BY_ID]) {
      managers[deal.ASSIGNED_BY_ID] = {
        id: deal.ASSIGNED_BY_ID,
        name: deal.managerName,
        deals: [],
      };
    }
    const {
      activeToday,
      activeOverdue,
      hasActivities,
      notOverdueButModified,
      lastActivityDate,
      TITLE,
      ID,
      activities,
    } = deal;

    managers[deal.ASSIGNED_BY_ID].deals.push({
      id: ID,
      TITLE,
      activeToday,
      activeOverdue,
      hasActivities,
      notOverdueButModified,
      lastActivityDate,
      activity: activities,
    });
  });

  return Object.values(managers);
}

async function processDeals(deals) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Установить время на начало текущего дня

  deals.forEach((deal) => {
    let activeToday = 0;
    let activeOverdue = 0;
    let hasActivities = false;
    let notOverdueButModified = 0;
    let lastActivityDate = null;

    deal.activities.forEach((activity) => {
      const endTime = new Date(activity.END_TIME);

      if (activity.COMPLETED === "N") {
        hasActivities = true;

        if (endTime >= currentDate) {
          activeToday++;
        } else {
          activeOverdue++;
        }

        // if (activity.LAST_UPDATED > activity.CREATED) { if (deal.ID == "672")
        //     console.log(
        //       "🚀 ~ file: activities-services.js:165 ~ activity:",
        //       activity
        //     );
        //   notOverdueButModified++;
        // }
      }

      if (!lastActivityDate || activity.LAST_UPDATED > lastActivityDate) {
        lastActivityDate = activity.LAST_UPDATED;
      }
    });

    deal.activeToday = activeToday;
    deal.activeOverdue = activeOverdue;
    deal.hasActivities = hasActivities;
    deal.notOverdueButModified = notOverdueButModified;
    deal.lastActivityDate = lastActivityDate;
  });

  // console.log("🚀 ~ file: activities-services.js:180 ~ deals:", deals);
  return deals;
}

activitiesService.getActivities = async ({ category, closed }) => {
  const deals = await getAllDealsWithBatch(category, closed);

  await getActivitiesForDeals(deals);
  await getManagerNames(deals);
  const deals2 = await processDeals(deals);
  const groupedDeals = groupDealsByManager(deals2);

  return { totalDeal: deals.length, groupedDeals };
  // console.log("managers: ", managers);
};

export default activitiesService;
