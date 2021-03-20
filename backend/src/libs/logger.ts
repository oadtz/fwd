import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: {
    colorize: true,
    translateTime: `SYS:yyyy-mm-dd HH:MM:ssTT Z`,
    messageKey: 'msg',
    errorLikeObjectKeys: ['err', 'error'],
    crlf: true,
  },
})

export default logger
