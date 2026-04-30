// Import core Node.js modules for networking and file systems
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002; // Use port 3002 to avoid conflicts with previous servers

// We must explicitly tell the browser what type of file we are sending.
// This is called a MIME type. If we don't do this, CSS won't load!
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
};

const server = http.createServer((req, res) => {
    // 1. If the user just goes to "/", default to "/index.html"
    let urlPath = req.url === '/' ? '/index.html' : req.url;
    
    // 2. Map the URL to the 'public' directory on our hard drive
    let filePath = path.join(__dirname, 'public', urlPath);
    
    // 3. Extract the file extension (e.g. '.css') to find the correct MIME type
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 4. Read the file from the hard drive
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') { // Error NO ENTity (File not found)
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>Sorry, that page does not exist!</p>', 'utf-8');
            } else { // Some other server error
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            // Success! Send the file content and the correct Content-Type header
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start listening for requests
server.listen(PORT, () => {
    console.log(`Static Website Server running at: http://localhost:${PORT}/`);
    console.log(`Serving all files inside the 'public' directory.`);
});
