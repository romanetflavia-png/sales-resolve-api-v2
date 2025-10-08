const { Router } = require('express');
const { authMiddleware } = require('./auth');
const { readJson, writeJson } = require('../storage/json');
const { nanoid } = require('nanoid/non-secure');

const router = Router();
const TASKS_FILE = 'tasks.json';

function getTasks() {
	const data = readJson(TASKS_FILE, []);
	return Array.isArray(data) ? data : [];
}

// List tasks
router.get('/', authMiddleware, (req, res) => {
	return res.json(getTasks());
});

// Create task
router.post('/', authMiddleware, (req, res) => {
	const { projectId, title, done } = req.body;
	if (!projectId || !title) return res.status(400).json({ error: 'projectId and title required' });
	const tasks = getTasks();
	const task = { id: nanoid(), projectId, title, done: !!done, createdAt: new Date().toISOString() };
	tasks.push(task);
	writeJson(TASKS_FILE, tasks);
	return res.status(201).json(task);
});

// Toggle done/delete
router.patch('/:id', authMiddleware, (req, res) => {
	const { id } = req.params;
	const { done } = req.body;
	const tasks = getTasks();
	const idx = tasks.findIndex(t => t.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	if (typeof done === 'boolean') tasks[idx].done = done;
	writeJson(TASKS_FILE, tasks);
	return res.json(tasks[idx]);
});

router.delete('/:id', authMiddleware, (req, res) => {
	const { id } = req.params;
	const tasks = getTasks();
	const next = tasks.filter(t => t.id !== id);
	if (next.length === tasks.length) return res.status(404).json({ error: 'Not found' });
	writeJson(TASKS_FILE, next);
	return res.json({ status: 'ok' });
});

module.exports = { router };


