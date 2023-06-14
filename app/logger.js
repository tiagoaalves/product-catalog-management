const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), customFormat),
  transports: [new transports.Console()],
});

module.exports = logger;
