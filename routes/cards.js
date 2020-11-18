const routerCards = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
} = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post('/', createCard);
routerCards.delete('/:cardId', deleteCardById);

module.exports = routerCards;
