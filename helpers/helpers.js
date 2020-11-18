const errorHandler = (promise, req, res) => {
  promise
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFoundUsers') {
        res.status(404).send({ message: 'Пользователи не найдены' });
      } else if (err.message === 'NotFoundCards') {
        res.status(404).send({ message: 'Карточки не найдены' });
      } else if (err.message === 'NotFoundUser') {
        res.status(404).send({ message: 'Пользователь не найлен, авторизуйтесь' });
      } else if (err.message === 'NotFoundId') {
        res.status(404).send({ message: 'Такого ID не существует' });
      } else if (err.message === 'NotDeletedCard') {
        res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const promiseHandler = (promise, req, res) => {
  errorHandler(
    promise
      .then((object) => {
        res.send({ data: object });
      }), req, res,
  );
};

const deleteHandler = (promise, req, res) => {
  errorHandler(
    promise
      .then((object) => {
        const userId = req.user._id;

        if (object.owner.equals(userId)) {
          object.deleteOne().then(() => res.send({ data: object }));
        } else {
          throw new Error('NotDeletedCard');
        }
      }), req, res,
  );
};

module.exports = {
  promiseHandler,
  deleteHandler,
};
