/* Logging configuration */
exports.log = {
    'level':  process.env.LOG_LEVEL || 'info',
    'colors': !!process.env.LOG_COLORS,
    'pretty': !!process.env.LOG_PRETTY
};

/* HTTP configuration */
exports.http = {
    'port': process.env.PORT
};

/* Keen.IO configuration */
exports.keenio = {
    'apiUrl':    process.env.KEEN_API_URL,
    'projectId': process.env.KEEN_PROJECT_ID,
    'readKey':   process.env.KEEN_READ_KEY,
    'writeKey':  process.env.KEEN_WRITE_KEY,
};