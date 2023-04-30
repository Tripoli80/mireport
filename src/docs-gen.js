import swaggerAutogen from "swagger-autogen";
const outputFile = "./swagger.json";
const endpointsFiles = ["./app.js"];

// swaggerAutogen(outputFile, endpointsFiles).then(() => {
//   import ("./app.js");
// });

const doc = {
  info: {
    title: "BeFlow CRM API",
    description: "Description",
  },
  host: "localhost:3008",
  schemes: ["http"],
  basePath:'/',
};

swaggerAutogen()(outputFile, endpointsFiles, doc);
