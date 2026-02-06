/**
 * Root Entry Point (v1.0.1)
 * This file is executed by Hostinger Node.js Selector.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. IMMEDIATE FILE LOG (To verify Hostinger is running this file)
try {
    fs.appendFileSync('root_boot.txt', `BOOT ATTEMPT at ${new Date().toISOString()} on port ${PORT}\n`);
} catch (e) { }

// 2. IMMEDIATE HEALTH CHECK
app.get('/health', (req, res) => res.status(200).send('OK - ROOT ALIVE v1.0.2 - UPDATED: 2026-02-06 02:58'));
app.get('/debug-root', (req, res) => {
    res.json({
        source: 'ROOT_ENTRY_POINT',
        version: '1.0.2',
        time: new Date().toISOString(),
        dir: __dirname,
        node: process.version
    });
});

// 3. DELEGATE TO BACKEND
// We require the backend server but we must ensure it doesn't conflict if it tries to listen.
// However, the best way on Hostinger is often to have ONE file that defines the app and listens.
// Since the backend is a complex file, we will try to start the backend's logic.
require('./backend/server.js');

// 4. FALLBACK LISTEN (If backend/server.js didnt start it)
if (!app._listening) {
    app.listen(PORT, () => {
        console.log(`Root listener active on port ${PORT}`);
    });
}
