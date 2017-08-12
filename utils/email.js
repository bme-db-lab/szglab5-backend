const nodemailer = require('nodemailer');
const config = require('../config/config.js');
const { promisify } = require('util');

async function sendMail(to, content) {
  const transporter = nodemailer.createTransport({
    host: config.mailer.host,
    port: config.mailer.port,
    secure: config.mailer.forcetls,
    auth: {
      user: config.mailer.user,
      pass: config.mailer.pass
    }
  });

  const mailOptions = {
    from: `${config.mailer.defaultFromDisplayName} <${config.mailer.user}@${config.mailer.host}>`,
    to,
    subject: config.mailer.defaultSubject,
    text: content,
    html: content
  };

  const result = await promisify(transporter.sendMail).call(transporter, mailOptions);
  return result;
}

module.exports = {
  sendMail
};
