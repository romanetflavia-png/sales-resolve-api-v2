const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', '..', 'my-site-backend', 'data');

function ensureDir() {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}
}

function dataFile(filename) {
	ensureDir();
	return path.join(DATA_DIR, filename);
}

function readJson(filename, fallback) {
	const file = dataFile(filename);
	if (!fs.existsSync(file)) return fallback;
	const raw = fs.readFileSync(file, 'utf8');
	try {
		return JSON.parse(raw);
	} catch (e) {
		return fallback;
	}
}

function writeJson(filename, value) {
	const file = dataFile(filename);
	fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

module.exports = { readJson, writeJson };


