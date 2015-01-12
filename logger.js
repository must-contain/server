/* Logging module */
var winston = require('winston')

/* Application configuration */
var config = require('./config.js');

/* Create and configure the logger */
var logger = new winston.Logger();

/* Configure Everything */
logger.cli();
logger.add(winston.transports.Console, {
  'level':       config.log.level,
  'colorize':    config.log.colors,
  'prettyPrint': config.log.pretty
});

/* Export it */
module.exports = logger;