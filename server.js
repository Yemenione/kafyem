/**
 * Root Entry Point (v1.0.4)
 * Loads and integrates the backend server.
 */
console.log('--- ROOT BOOTING v1.0.4 ---');
console.log('Timestamp:', new Date().toISOString());
console.log('Loading backend...');

// Load the backend app (which exports the Express app with all routes)
const backendApp = require('./backend/server.js');

console.log('Backend loaded successfully');
console.log('Server should be running on port:', process.env.PORT || 5000);
