// Import core Node.js modules (No npm install required!)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create the HTTP Server
const server = http.createServer((req, res) => {
    
    // Add CORS headers so we can access it from anywhere if needed
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Route 1: The API Endpoint (Reads JSON and sends it)
    if (req.url === '/api/users' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'users.json');
        
        // Read the JSON file asynchronously
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read user data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data); // Send the JSON data
            }
        });
    } 
    
    // Route 2: Serve the Front-end HTML Page
    else if (req.url === '/' || req.url === '/index.html') {
        const htmlPath = path.join(__dirname, 'index.html');
        
        // Read the HTML file and serve it
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to load front-end page.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    
    // Route 3: Handle 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Node.js Server is running!`);
    console.log(`Front-end: http://localhost:${PORT}/`);
    console.log(`API URL:   http://localhost:${PORT}/api/users`);
});
