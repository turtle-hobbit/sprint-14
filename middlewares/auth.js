const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
