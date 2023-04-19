require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const { PORT, DBLINK } = require('./appConfig');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/handleErrors');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');

const app = express();

mongoose.connect(DBLINK);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
