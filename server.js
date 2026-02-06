/**
 * Root Entry Point (v1.0.2)
 * Redirects execution to the backend server.
 */
console.log('--- ROOT BOOTING v1.0.2 ---');
console.log('Timestamp:', new Date().toISOString());

// Require the backend entry point
require('./backend/server.js');
