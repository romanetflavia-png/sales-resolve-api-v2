const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJson, writeJson } = require('../storage/json');
const { nanoid } = require('nanoid/non-secure');

const router = Router();

const USERS_FILE = 'users.json';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function getUsers() {
	const data = readJson(USERS_FILE, []);
	return Array.isArray(data) ? data : [];
}

function findUserByEmail(users, email) {
	return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

	const users = getUsers();
	if (findUserByEmail(users, email)) return res.status(409).json({ error: 'Email already registered' });

	const passwordHash = await bcrypt.hash(password, 10);
	const user = { id: nanoid(), name, email, passwordHash, role: 'user' };
	users.push(user);
	writeJson(USERS_FILE, users);
	return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
	const users = getUsers();
	const user = findUserByEmail(users, email);
	if (!user) return res.status(401).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
	const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
	return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

function authMiddleware(req, res, next) {
	const header = req.headers.authorization || '';
	const [, token] = header.split(' ');
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.user = payload;
		return next();
	} catch (e) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

function requireAdmin(req, res, next) {
	if (!req.user || req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Admin required' });
	}
	return next();
}

module.exports = { router, authMiddleware, requireAdmin };


