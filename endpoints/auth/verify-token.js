const { verifyToken } = require('../../utils/jwt');

module.exports = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await verifyToken(token);
    res.send({
      userId: decodedToken.userId
    });
  } catch (err) {
    res.status(403).send({
      message: 'Invalid token'
    });
  }
};
