const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT, DBLINK } = require('./appConfig');
const { handleErrors } = require('./middlewares/handleErrors');
const router = require('./routes/index');

const app = express();

mongoose.connect(DBLINK);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(router);
app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
