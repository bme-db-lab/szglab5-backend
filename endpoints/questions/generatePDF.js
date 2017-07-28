const pdf = require('pdfjs');
const pdfFontFile = require('pdfjs/font/Helvetica.json');
const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    if (!req.query.questionId || !Array.isArray(req.query.questionId)) {
      throw new Error('No questionids specified');
    }
    const questionIds = req.query.questionId;
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
    doc.text('Laboradmin questions', {
      fontSize: 16
    });
    questions.forEach((question) => {
      doc.text(question.text);
    });
    await doc.end();
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
