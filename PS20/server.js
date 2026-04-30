const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Stop other Node servers before running this!

// Middleware is required to parse JSON data sent in POST/PUT requests
app.use(express.json());

// MongoDB configuration
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'company';

let db, collection;

// Connect to MongoDB
MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        collection = db.collection('employees'); 
    })
    .catch(err => console.error("Database Connection Error:", err));


// ==========================================
// CRUD OPERATIONS (Backend API Routes)
// ==========================================

// 1. View all employee records (Read)
// Test in browser or Postman: GET http://localhost:3000/view
app.get('/view', async (req, res) => {
    const employees = await collection.find({}).toArray();
    res.json(employees);
});

// 2. Add a new employee (Create)
// Test in Postman: POST http://localhost:3000/add
// Body (JSON): { "name": "John Doe", "department": "IT", "designation": "Developer", "salary": 60000, "joining_date": "2024-01-15" }
app.post('/add', async (req, res) => {
    await collection.insertOne(req.body); // req.body contains the JSON sent by the user
    res.send("Employee added successfully!");
});

// 3. Update an existing employee’s details (Update)
// Test in Postman: PUT http://localhost:3000/update/John Doe
// Body (JSON): { "salary": 75000, "designation": "Senior Developer" }
app.put('/update/:name', async (req, res) => {
    // Finds employee by name in URL, updates fields provided in JSON body
    await collection.updateOne(
        { name: req.params.name }, 
        { $set: req.body }
    );
    res.send(`Employee '${req.params.name}' updated successfully!`);
});

// 4. Delete an employee record (Delete)
// Test in Postman: DELETE http://localhost:3000/delete/John Doe
app.delete('/delete/:name', async (req, res) => {
    await collection.deleteOne({ name: req.params.name });
    res.send(`Employee '${req.params.name}' deleted successfully!`);
});


// Start the Express Server
app.listen(port, () => {
    console.log(`Backend Server running at http://localhost:${port}`);
});
