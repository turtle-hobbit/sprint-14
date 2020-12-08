const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const { promiseHandler, deleteHandler } = require('../helpers/helpers');

const errorNotFoundCards = new NotFoundError('Карточки не найдены');
const errorNotFoundId = new NotFoundError('Нет карточки с таким ID');
const errorIncorrectData = new BadRequestError('Переданы некорректные данные');

function getCards(req, res, next) {
  promiseHandler(Card.find({})
    .orFail(errorNotFoundCards), req, res, next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(errorIncorrectData);
      } else {
        next(err);
      }
    });
}

function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  deleteHandler(Card.findById(cardId)
    .orFail(errorNotFoundId)
    .catch((err) => {
      if (err.name === 'CastError') {
        throw errorIncorrectData;
      }
      throw err;
    }), req, res, next);
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
};
