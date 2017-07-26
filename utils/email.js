"use strict";

const nodemailer = require('nodemailer');
const config = require('../config/config.js');


function sendMail(to, content) {
  return new Promise((resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: config.mailer.port,
        secure: config.mailer.forcetls,
        auth: {
          user: config.mailer.user,
          pass: config.mailer.pass
        }
      });

      let mailOptions = {
        from: config.mailer.defaultFromDisplayName + ' <' + config.mailer.user +'@'+config.mailer.host+'>',
        to: to,
        subject: config.mailer.defaultSubject,
        text: content,
        html: content
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          reject(error);
        } else {
          resolve(info);
          // console.log('Message %s sent: %s', info.messageId, info.response);
        }
      });
    } catch(err) {
      reject(err);
    }
  });
}

function subscribeToMailList(address, list) {
  // TODO
}

function unSubscribeToMailList(address, list) {
  // TODO
}

module.exports = {
  sendMail,
  subscribeToMailList,
  unSubscribeToMailList
};
