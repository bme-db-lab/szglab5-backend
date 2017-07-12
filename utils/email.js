"use strict";
const nodemailer = require('nodemailer');


function sendMail(to, content) {
	// TODO: get hardcoded values out to the config, make this async
	let transporter = nodemailer.createTransport({
		host: 'szaszm.tk',
		port: 25,
		secure: false,
		auth: {
			user: 'szglab5',
			pass: 'szglab5pass'
		}
	});

	let mailOptions = {
		from: 'Adatbazisok labor adminisztracios rendszer <marci@szaszm.tk>',
		to: to,
		subject: 'Adatbazisok labor rendszeruzenet',
		text: content,
		html: content
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if(error) {
			console.log(error);
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
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
