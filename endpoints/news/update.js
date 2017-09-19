const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;

    const { data } = req.body;
    const db = getDB();

    const { roles } = req.userInfo;
    if (!roles.includes('ADMIN')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const newsToUpdate = await db.News.findById(reqId);
    checkIfExist(newsToUpdate);
    await updateResource(db, 'News', data, newsToUpdate);
    res.status(204).send();
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

