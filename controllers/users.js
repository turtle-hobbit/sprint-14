const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { promiseHandler } = require('../helpers/helpers');

const { JWT_SECRET = 'dev-secret' } = process.env;

const errorNotFoundId = new Error('NotFoundId');
const errorNotFoundUser = new Error('NotFoundUser');
const errorNotFoundUsers = new Error('NotFoundUsers');
const updateDate = {
  new: true,
  runValidators: true,
  upsert: false,
};

function getUsers(req, res) {
  promiseHandler(User.find({}).orFail(errorNotFoundUsers), req, res);
}

function getUserById(req, res) {
  promiseHandler(User.findById(req.params.userId).orFail(errorNotFoundId), req, res);
}

function createUser(req, res) {
  const pattern = /^[A-Za-z0-9]{8,}$/;

  User.findOne({ email: req.body.email })
    .orFail()
    .then(() => {
      res.status(400).send({ message: 'Введенный email уже существует' });
    })
    .catch(() => {
      if (!pattern.test(req.body.password)) {
        res
          .status(400)
          .send({ message: 'Пароль должен быть не менее 8 символов и состоять из цифр или строчных, заглавных букв латинского алфавита без пробелов' });
      } else {
        const { name, about, avatar } = req.body;
        bcrypt.hash(req.body.password, 10)
          .then((hash) => promiseHandler(
            User.create({
              name,
              about,
              avatar,
              email: req.body.email,
              password: hash,
            }), req, res,
          ))
          .catch(() => {
            res.status(400).send({ message: 'Переданы некорректные данные' });
          });
      }
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  promiseHandler(
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      updateDate,
    ).orFail(errorNotFoundUser), req, res,
  );
}

function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  promiseHandler(
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      updateDate,
    ).orFail(errorNotFoundUser), req, res,
  );
}

function login(req, res) {
  const { email, password } = req.body;
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
      res.status(401).send({ message: err.message });
    });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
};
