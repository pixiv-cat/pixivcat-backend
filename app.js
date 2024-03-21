const express = require('express');
const path = require('path');
require('dotenv').config();

const showVersion = require('./src/middlewares/headerMiddleware');
const pixivRoutes = require('./src/routes/pixivRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', showVersion, pixivRoutes);

// Error handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
