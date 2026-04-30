const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Stop other Node servers before running this!

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB configuration
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'bookstore';

let db, collection;

// Connect to MongoDB
MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        collection = db.collection('books'); 
    })
    .catch(err => console.error("Database Connection Error:", err));


// ==========================================
// REST API ROUTES
// ==========================================

// 1. Retrieve a list of all books
// Test in Postman/Browser: GET http://localhost:3000/books
app.get('/books', async (req, res) => {
    const books = await collection.find({}).toArray();
    res.json(books);
});

// 2. Add a new book
// Test in Postman: POST http://localhost:3000/books
// Body (JSON): { "title": "The Great Gatsby", "author": "F. Scott", "price": 10.99, "genre": "Fiction" }
app.post('/books', async (req, res) => {
    await collection.insertOne(req.body);
    res.send("Book added successfully!");
});

// 3. Update book details
// Test in Postman: PUT http://localhost:3000/books/The Great Gatsby
// Body (JSON): { "price": 15.99 }
app.put('/books/:title', async (req, res) => {
    await collection.updateOne(
        { title: req.params.title }, 
        { $set: req.body }
    );
    res.send(`Book '${req.params.title}' updated successfully!`);
});

// 4. Delete a book from the collection
// Test in Postman: DELETE http://localhost:3000/books/The Great Gatsby
app.delete('/books/:title', async (req, res) => {
    await collection.deleteOne({ title: req.params.title });
    res.send(`Book '${req.params.title}' deleted successfully!`);
});


// Start the Express Server
app.listen(port, () => {
    console.log(`Backend Server running at http://localhost:${port}`);
});
