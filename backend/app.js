const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');
const { validateNewUserData, validateAuthData } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const { centralErrorHandler, NotFoundError } = require('./utils/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Скажем нет захардкоженным данным
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

// Подключение предобработчиков

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем логгер запросов
app.use(requestLogger);

app.use(cors());

app.get('/api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/api/signin', validateAuthData, login);
app.post('/api/signup', validateNewUserData, createUser);

// авторизация
app.use(auth);

// Подключение маршрутизации
app.use('/api/users', require('./routes/users'));
app.use('/api/cards', require('./routes/cards'));

// Обработка неопределенных маршрутов
app.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

// Подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  centralErrorHandler(err, req, res, next);
});

// Подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log({ err }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
