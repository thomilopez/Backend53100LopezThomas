import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors:{    
        fatal: "red",
        error: "magenta",
        warn: "yellow",
        info: "blue",
        http: "green",
        debug: "white",
        }
    }

const devLogger = winston.createLogger({
        levels: customLevelOptions.levels,
        format: winston.format.combine(
            winston.format.colorize({ colors: customLevelOptions.colors }),
            winston.format.simple()
        ),
        transports: [
            new winston.transports.Console({ level: "debug" })
        ]
    });
    
const prodLogger = winston.createLogger({
        levels: customLevelOptions.levels,
        format: winston.format.combine(
            winston.format.simple()
        ),
        transports: [
            new winston.transports.Console({ level: "info" }),
            new winston.transports.File({ filename: "errors.log", level: "error" })
        ]
    });

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
        req.logger = logger;
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
        next();
    };
    
export default logger;