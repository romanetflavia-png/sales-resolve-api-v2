const { Router } = require('express');
const { readJson, writeJson } = require('../storage/json');
const { authMiddleware, requireAdmin } = require('./auth');
const { nanoid } = require('nanoid/non-secure');

const router = Router();

const MESSAGES_FILE = 'messages.json';

// Public: anyone can create a message
router.post('/', (req, res) => {
	const { name, email, message } = req.body;
	if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
	const messages = readJson(MESSAGES_FILE, []);
	messages.push({ id: nanoid(), name, email, message, createdAt: new Date().toISOString() });
	writeJson(MESSAGES_FILE, messages);
	return res.status(201).json({ status: 'ok' });
});

// Protected: list all messages
router.get('/', authMiddleware, requireAdmin, (req, res) => {
	const messages = readJson(MESSAGES_FILE, []);
	return res.json(messages);
});

module.exports = { router };


