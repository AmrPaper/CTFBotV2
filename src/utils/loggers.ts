import fs from "fs";
import path from "path";
import winston from "winston";
const {combine, timestamp, json, prettyPrint, errors} = winston.format;

const logDir = path.resolve(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function setUpLogger(name: string, filename: string) {
    return winston.loggers.add(name, {
    level: "info",
    format: combine(
      errors({ stack: true }),
      timestamp(),
      json(),
      prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logDir, filename) }),
    ],
    defaultMeta: { service: name },
  });
}

setUpLogger("dbLogger", "db.log");
setUpLogger("playerLogger", "player.log");
setUpLogger("adminLogger", "admin.log");
/*
as of now all of the loggers are info level, but should be manually set depending on the situation
info - normal operations just to keep track of things from the console
warn - bigger operations like resetting, deleting and removing teams/members
error - self-explanatory
*/