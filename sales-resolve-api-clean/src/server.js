const { createApp } = require('./setup/app');
const { router: authRouter } = require('./routes/auth');
const { router: messagesRouter } = require('./routes/messages');
const { router: healthRouter } = require('./routes/health');
const { router: projectsRouter } = require('./routes/projects');
const { router: tasksRouter } = require('./routes/tasks');
const { router: usersRouter } = require('./routes/users');

const PORT = process.env.PORT || 4000;

const app = createApp();

app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api', healthRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});


