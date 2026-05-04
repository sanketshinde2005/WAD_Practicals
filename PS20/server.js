const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

app.use(express.json());

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'company';

let db, collection;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        collection = db.collection('employees'); 
    })
    .catch(err => console.error("Database Connection Error:", err));

app.get('/view', async (req, res) => {
    const employees = await collection.find({}).toArray();
    res.json(employees);
});

app.post('/add', async (req, res) => {
    await collection.insertOne(req.body); 
    res.send("Employee added successfully!");
});

app.put('/update/:name', async (req, res) => {
    
    await collection.updateOne(
        { name: req.params.name }, 
        { $set: req.body }
    );
    res.send(`Employee '${req.params.name}' updated successfully!`);
});

app.delete('/delete/:name', async (req, res) => {
    await collection.deleteOne({ name: req.params.name });
    res.send(`Employee '${req.params.name}' deleted successfully!`);
});

app.listen(port, () => {
    console.log(`Backend Server running at http://localhost:${port}`);
});
