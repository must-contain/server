exports.http = {
    'port': process.env.PORT
};

exports.keenio = {
    'apiUrl':    process.env.KEEN_API_URL,
    'projectId': process.env.KEEN_PROJECT_ID,
    'readKey':   process.env.KEEN_READ_KEY,
    'writeKey':  process.env.KEEN_WRITE_KEY,
};