const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

function createApp() {
	const app = express();

	app.use(helmet());
	app.use(cors({ origin: true, credentials: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(morgan('dev'));

	return app;
}

module.exports = { createApp };


