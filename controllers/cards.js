const Card = require('../models/card');
const { promiseHandler, deleteHandler } = require('../helpers/helpers');

const errorNotFoundCards = new Error('NotFoundCards');
const errorNotFoundId = new Error('NotFoundId');

function getCards(req, res) {
  promiseHandler(Card.find({}).orFail(errorNotFoundCards), req, res);
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  promiseHandler(Card.create({ name, link, owner }), req, res);
}

function deleteCardById(req, res) {
  const { cardId } = req.params;
  deleteHandler(Card.findById(cardId).orFail(errorNotFoundId), req, res);
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
};
