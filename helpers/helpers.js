const ForbiddenError = require('../errors/forbidden-err');

const promiseHandler = (promise, req, res, next) => {
  promise
    .then((object) => res.send({ data: object }))
    .catch(next);
};

const deleteHandler = (promise, req, res, next) => {
  promise
    .then((object) => {
      const userId = req.user._id;

      if (object.owner.equals(userId)) {
        object.deleteOne().then(() => res.send({ data: object }));
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch(next);
};

module.exports = {
  promiseHandler,
  deleteHandler,
};
