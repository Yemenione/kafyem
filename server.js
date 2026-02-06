/**
 * Root Entry Point (v1.0.3)
 * Redirects execution to the backend server.
 */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Immediate health check at root level
app.get('/health', (req, res) => res.status(200).send('OK - ROOT ALIVE - v1.0.3'));

console.log('--- ROOT BOOTING v1.0.3 ---');
console.log('Timestamp:', new Date().toISOString());
console.log('Starting backend server...');

// Start server first
const server = app.listen(PORT, () => {
    console.log(`Root server listening on port ${PORT}`);
});

// Then require the backend (which will add more routes)
require('./backend/server.js');
