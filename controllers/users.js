const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { promiseHandler } = require('../helpers/helpers');

const { JWT_SECRET = 'dev-secret' } = process.env;

const errorNotFoundId = new NotFoundError('Нет пользователя с таким ID');
const errorNotFoundUser = new NotFoundError('Пользователь не найден, авторизуйтесь');
const errorNotFoundUsers = new NotFoundError('Пользователи не найдены');
const errorIncorrectData = new BadRequestError('Переданы некорректные данные');
const updateDate = {
  new: true,
  runValidators: true,
  upsert: false,
};

function getUsers(req, res, next) {
  promiseHandler(User.find({})
    .orFail(errorNotFoundUsers), req, res, next);
}

function getUserById(req, res, next) {
  promiseHandler(User.findById(req.params.userId)
    .orFail(errorNotFoundId)
    .catch((err) => {
      if (err.name === 'CastError') {
        throw errorIncorrectData;
      }
      throw err;
    }), req, res, next);
}

function createUser(req, res, next) {
  const pattern = /^[A-Za-z0-9]{8,}$/;
  const { name, about, avatar } = req.body;

  if (!pattern.test(req.body.password)) {
    next(new BadRequestError('Пароль должен быть не менее 8 символов и состоять из цифр или строчных, заглавных букв латинского алфавита без пробелов'));
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        User.create({
          name,
          about,
          avatar,
          email: req.body.email,
          password: hash,
        })
          .then((user) => res.send({ data: user }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(errorIncorrectData);
            } else if (err.code === 11000) {
              next(new BadRequestError('Введенный email уже существует'));
            }
          });
      });
  }
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  promiseHandler(
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      updateDate,
    )
      .orFail(errorNotFoundUser)
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw errorIncorrectData;
        }
        throw err;
      }), req, res, next,
  );
}

function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  promiseHandler(
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      updateDate,
    )
      .orFail(errorNotFoundUser)
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw errorIncorrectData;
        }
        throw err;
      }), req, res, next,
  );
}

function login(req, res, next) {
  const { email, password } = req.body;

  if (email.length !== 0 && password.length !== 0) {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );

        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });

        res.send({ data: token });
      })
      .catch((err) => {
        next(err);
      });
  }
  return next(new UnauthorizedError('Введите логин и пароль'));
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
};
