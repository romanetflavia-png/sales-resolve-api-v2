const { Router } = require('express');
const { readJson, writeJson } = require('../storage/json');
const { authMiddleware, requireAdmin } = require('./auth');

const router = Router();
const USERS_FILE = 'users.json';

function getUsers() {
	const data = readJson(USERS_FILE, []);
	return Array.isArray(data) ? data : [];
}

// List all users (admin only)
router.get('/', authMiddleware, requireAdmin, (req, res) => {
	const users = getUsers().map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
	return res.json(users);
});

// Update role (admin only)
router.patch('/:id/role', authMiddleware, requireAdmin, (req, res) => {
	const { id } = req.params;
	const { role } = req.body;
	if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
	const users = getUsers();
	const idx = users.findIndex(u => u.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	users[idx].role = role;
	writeJson(USERS_FILE, users);
	return res.json({ id: users[idx].id, role: users[idx].role });
});

module.exports = { router };


