const pdf = require('pdfjs');
const pdfFontFile = require('pdfjs/font/Helvetica.json');
const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    if (!req.query.questionId || !Array.isArray(req.query.questionId)) {
      throw new Error('No questionids specified');
    }
    const { token } = req.body;
    let userInfo = null;

    try {
      userInfo = await verifyToken(token);
    } catch (err) {
      res.status(403).send(genErrorObj('Invalid token'));
    }
    const questionIds = req.query.questionId;

    const { roles } = userInfo;
    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }
    // get questions from db

    const db = getDB();
    const questions = await db.Questions.findAll({
      where: {
        id: questionIds
      }
    });

    const doc = new pdf.Document({
      font: new pdf.Font(pdfFontFile),
      padding: 10
    });
    doc.pipe(res);
    for (let i = 0; i < 1; i++) {
      const table = doc.table({ widths: [350, 300], paddingBottom: 10 }).row();
      table.cell().text('Adatbázisok labor beugró', { fontSize: 20 });
      table.cell().table({ widths: [200] }).row()
        .cell('Név:', { fontSize: 14 })
        .cell('Neptun:', { fontSize: 14 });
      doc.text('     ', { fontSize: 14 });
      questions.forEach((question) => {
        doc.text(question.text, { fontSize: 16 });
        doc.text('                 ', { fontSize: 24 });
        doc.text('                 ', { fontSize: 24 });
        doc.text('                 ', { fontSize: 24 });
      });
    }
    await doc.end();
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
