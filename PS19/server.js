const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'student'; 

let db, collection;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        
        
        collection = db.collection('studentmarks'); 
        
        
        return collection.deleteMany({}); 
    })
    .then(() => {
        
        
        
        const students = [
            { Name: "Alice", Roll_No: 101, WAD_Marks: 26, CC_Marks: 28, DSBDA_Marks: 22, CNS_Marks: 27, AI_marks: 29, Maths_Marks: 35, Science_Marks: 38 },
            { Name: "Bob", Roll_No: 102, WAD_Marks: 21, CC_Marks: 22, DSBDA_Marks: 19, CNS_Marks: 20, AI_marks: 21, Maths_Marks: 45, Science_Marks: 42 },
            { Name: "Charlie", Roll_No: 103, WAD_Marks: 28, CC_Marks: 29, DSBDA_Marks: 26, CNS_Marks: 27, AI_marks: 28, Maths_Marks: 50, Science_Marks: 48 },
            { Name: "David", Roll_No: 104, WAD_Marks: 15, CC_Marks: 18, DSBDA_Marks: 12, CNS_Marks: 16, AI_marks: 14, Maths_Marks: 30, Science_Marks: 32 }
        ];
        return collection.insertMany(students);
    })
    .then(() => console.log('Successfully inserted student documents!'))
    .catch(err => console.error("Database Error:", err));

app.get('/', async (req, res) => {
    const count = await collection.countDocuments();
    const students = await collection.find({}).toArray();
    res.send(`
        <h1>Total Students: ${count}</h1>
        <p>Go to <a href="/table">/table</a> to see tabular format.</p>
        <pre>${JSON.stringify(students, null, 2)}</pre>
    `);
});

app.get('/dsbda-gt-20', async (req, res) => {
    
    const students = await collection.find({ DSBDA_Marks: { $gt: 20 } }).project({ Name: 1, _id: 0 }).toArray();
    res.json({ "Students with > 20 in DSBDA": students });
});

app.get('/update/:name', async (req, res) => {
    
    await collection.updateOne(
        { Name: req.params.name }, 
        { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } }
    );
    res.send(`<h1>Updated all marks for ${req.params.name} by +10!</h1> <a href="/table">View Table</a>`);
});

app.get('/all-gt-25', async (req, res) => {
    const students = await collection.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_marks: { $gt: 25 }
    }).project({ Name: 1, _id: 0 }).toArray();
    
    res.json({ "Students with > 25 in ALL subjects": students });
});

app.get('/maths-science-lt-40', async (req, res) => {
    
    const students = await collection.find({
        Maths_Marks: { $lt: 40 },
        Science_Marks: { $lt: 40 }
    }).project({ Name: 1, _id: 0 }).toArray();
    
    res.json({ "Students with < 40 in Maths & Science": students });
});

app.get('/delete/:name', async (req, res) => {
    await collection.deleteOne({ Name: req.params.name });
    res.send(`<h1>Deleted student: ${req.params.name}</h1> <a href="/">Back to Home</a>`);
});

app.get('/table', async (req, res) => {
    const students = await collection.find({}).toArray();
    
    let html = `
    <h2>Student Marks Tabular Data</h2>
    <table border="1" cellpadding="10" style="border-collapse: collapse; font-family: Arial; text-align: center;">
        <tr style="background-color: #f2f2f2;">
            <th>Name</th>
            <th>Roll No</th>
            <th>WAD</th>
            <th>DSBDA</th>
            <th>CNS</th>
            <th>CC</th>
            <th>AI</th>
            <th>Maths</th>
            <th>Science</th>
        </tr>`;
    
    students.forEach(s => {
        html += `<tr>
            <td>${s.Name}</td>
            <td>${s.Roll_No}</td>
            <td>${s.WAD_Marks}</td>
            <td>${s.DSBDA_Marks}</td>
            <td>${s.CNS_Marks}</td>
            <td>${s.CC_Marks}</td>
            <td>${s.AI_marks}</td>
            <td>${s.Maths_Marks}</td>
            <td>${s.Science_Marks}</td>
        </tr>`;
    });
    
    html += '</table><br><a href="/">Back to Home</a>';
    res.send(html);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
