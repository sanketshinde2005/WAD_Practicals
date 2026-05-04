const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

app.use(express.json());

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'bookstore';

let db, collection;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        collection = db.collection('books'); 
    })
    .catch(err => console.error("Database Connection Error:", err));

app.get('/books', async (req, res) => {
    const books = await collection.find({}).toArray();
    res.json(books);
});

app.post('/books', async (req, res) => {
    await collection.insertOne(req.body);
    res.send("Book added successfully!");
});

app.put('/books/:title', async (req, res) => {
    await collection.updateOne(
        { title: req.params.title }, 
        { $set: req.body }
    );
    res.send(`Book '${req.params.title}' updated successfully!`);
});

app.delete('/books/:title', async (req, res) => {
    await collection.deleteOne({ title: req.params.title });
    res.send(`Book '${req.params.title}' deleted successfully!`);
});

app.listen(port, () => {
    console.log(`Backend Server running at http://localhost:${port}`);
});
