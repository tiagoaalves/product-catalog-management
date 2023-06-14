const app = require("./app");
const logger = require("./app/logger.js");
const PORT = process.env.PORT || "3000";
const HOST = "0.0.0.0";
app.listen(PORT, HOST);
logger.info(`Running on http://${HOST}:${PORT}`);
