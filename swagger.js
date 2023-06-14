const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Product Catalog Management",
    description: "A Product Catalog Management API",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["app/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
