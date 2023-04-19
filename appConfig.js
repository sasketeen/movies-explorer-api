const {
  NODE_ENV, JWT_SECRET = 'secret-key', PORT = 3000, DBLINK = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  DBLINK,
};
