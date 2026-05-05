const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(express.static(__dirname));

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'bookstore';

let db, collection;

async function seedData(col) {
    const count = await col.countDocuments();
    if (count === 0) {
        await col.insertMany([
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 350, year: 1925 },
            { title: "To Kill a Mockingbird", author: "Harper Lee", price: 420, year: 1960 },
            { title: "1984", author: "George Orwell", price: 299, year: 1949 },
            { title: "Pride and Prejudice", author: "Jane Austen", price: 275, year: 1813 },
            { title: "The Alchemist", author: "Paulo Coelho", price: 310, year: 1988 }
        ]);
        console.log('Seeded 5 books into the database.');
    }
}

MongoClient.connect(url)
    .then(async client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        collection = db.collection('books');
        await seedData(collection);
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
