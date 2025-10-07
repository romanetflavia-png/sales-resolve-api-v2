const { Router } = require('express');
const { authMiddleware } = require('./auth');
const { readJson, writeJson } = require('../storage/json');
const { nanoid } = require('nanoid/non-secure');

const router = Router();
const PROJECTS_FILE = 'projects.json';

function getProjects() {
	const data = readJson(PROJECTS_FILE, []);
	return Array.isArray(data) ? data : [];
}

// List projects (protected)
router.get('/', authMiddleware, (req, res) => {
	return res.json(getProjects());
});

// Create project (protected)
router.post('/', authMiddleware, (req, res) => {
	const { name, description } = req.body;
	if (!name) return res.status(400).json({ error: 'Name is required' });
	const projects = getProjects();
	const project = { id: nanoid(), name, description: description || '', createdAt: new Date().toISOString() };
	projects.push(project);
	writeJson(PROJECTS_FILE, projects);
	return res.status(201).json(project);
});

// Delete project (protected)
router.delete('/:id', authMiddleware, (req, res) => {
	const { id } = req.params;
	const projects = getProjects();
	const next = projects.filter(p => p.id !== id);
	if (next.length === projects.length) return res.status(404).json({ error: 'Not found' });
	writeJson(PROJECTS_FILE, next);
	return res.json({ status: 'ok' });
});

module.exports = { router };


