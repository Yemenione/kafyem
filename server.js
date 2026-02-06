/**
 * Root Entry Point
 * Redirects execution to the backend/server.js
 */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- ROOT ENTRY POINT STARTED (v1.0.1) ---');

// Root Health Check (redundant)
app.get('/health', (req, res) => res.status(200).send('OK - ROOT ALIVE'));
app.get('/', (req, res) => res.status(200).send('Yemeni Market Backend Root v1.0.1 - OK'));

// Forward all other requests to the backend server logic
// However, since server.js also creates an app and listens, we might have a conflict.
// Standard pattern for Hostinger's node selector: require the main file.
require('./backend/server.js');
