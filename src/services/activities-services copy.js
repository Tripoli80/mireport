import axios from "axios";
import * as dotenv from "dotenv";


dotenv.config();

const activitiesService = {};
const webhookUrl = process.env.BX_API;

activitiesService.getActivities = async () => {
 const deals = await getDeals();

 const managers = {};
 for (const deal of deals) {
   if (!managers[deal.ASSIGNED_BY_ID]) {
     managers[deal.ASSIGNED_BY_ID] = [];
   }
   managers[deal.ASSIGNED_BY_ID].push(deal);
 }

 for (const managerId in managers) {
   for (const deal of managers[managerId]) {
     const activities = await getActivities(deal.ID);
     deal.activities = activities;
   }
 }
  
  return { msg: "sucsess", managers };
  // console.log("managers: ", managers);
};

async function getDeals() {
  const response = await axios.get(
    `${webhookUrl}/crm.deal.list.json?select[]=ID&select[]=ASSIGNED_BY_ID`
  );
  return response.data.result;
}

// async function getActivitiesForDeals(dealIds) {
//   const calls = {};

//   for (const dealId of dealIds) {
//     calls[`activities_${dealId}`] = {
//       method: "crm.activity.list",
//       params: {
//         filter: {
//           OWNER_TYPE_ID: 2,
//           OWNER_ID: dealId,
//         },
//         select: ["ID", "SUBJECT", "DESCRIPTION"],
//       },
//     };
//   }

//   const response = await axios.post(`${webhookUrl}/batch.json?halt=0`, {
//     cmd: calls,
//   });
//   return response.data.result;
// }

// async function getActivitiesForDeals(dealIds) {
//   const calls = {};

//   for (const dealId of dealIds) {
//     calls[`activities_${dealId}`] = {
//       method: "crm.activity.list",
//       params: JSON.stringify({
//         filter: {
//           OWNER_TYPE_ID: 2,
//           OWNER_ID: dealId,
//         },
//         select: ["ID", "SUBJECT", "DESCRIPTION"],
//       }),
//     };
//   }

//   const response = await axios.post(`${webhookUrl}/batch.json?halt=0`, {
//     cmd: calls,
//   });
//   return response.data.result;
// }
async function getActivities(dealId) {
  const response = await axios.get(
    `${webhookUrl}/crm.activity.list.json?filter[OWNER_TYPE_ID]=2&filter[OWNER_ID]=${dealId}`
  );
  return response.data.result;
}
export default activitiesService;
