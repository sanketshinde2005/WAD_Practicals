const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'music'; 

let db, collection;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB successfully!');
        db = client.db(dbName);
        
        
        
        collection = db.collection('songdetails'); 
        
        
        return collection.deleteMany({}); 
    })
    .then(() => {
        
        const songs = [
            { Songname: "Tum Hi Ho", Film: "Aashiqui 2", Music_director: "Mithoon", singer: "Arijit Singh" },
            { Songname: "Channa Mereya", Film: "Ae Dil Hai Mushkil", Music_director: "Pritam", singer: "Arijit Singh" },
            { Songname: "Kun Faya Kun", Film: "Rockstar", Music_director: "A.R. Rahman", singer: "Mohit Chauhan" },
            { Songname: "Kabira", Film: "YJHD", Music_director: "Pritam", singer: "Arijit Singh" },
            { Songname: "Dil Diyan Gallan", Film: "Tiger Zinda Hai", Music_director: "Vishal-Shekhar", singer: "Atif Aslam" }
        ];
        return collection.insertMany(songs);
    })
    .then(() => console.log('Successfully inserted 5 songs into collection!'))
    .catch(err => console.error("Database Error:", err));

app.get('/', async (req, res) => {
    const count = await collection.countDocuments();
    const songs = await collection.find({}).toArray();
    res.send(`
        <h1>Total Songs: ${count}</h1>
        <p>Go to <a href="/table">/table</a> to see tabular format.</p>
        <pre>${JSON.stringify(songs, null, 2)}</pre>
    `);
});

app.get('/director/:name', async (req, res) => {
    const songs = await collection.find({ Music_director: req.params.name }).toArray();
    res.json(songs);
});

app.get('/director/:director/singer/:singer', async (req, res) => {
    const songs = await collection.find({ 
        Music_director: req.params.director, 
        singer: req.params.singer 
    }).toArray();
    res.json(songs);
});

app.get('/delete/:songname', async (req, res) => {
    await collection.deleteOne({ Songname: req.params.songname });
    res.send(`<h1>Deleted song: ${req.params.songname}</h1> <a href="/">Back to Home</a>`);
});

app.get('/add', async (req, res) => {
    const newSong = { Songname: "Apna Bana Le", Film: "Bhediya", Music_director: "Sachin-Jigar", singer: "Arijit Singh" };
    await collection.insertOne(newSong);
    res.send(`<h1>Added Favorite Song!</h1> <a href="/">Back to Home</a>`);
});

app.get('/singer/:singer/film/:film', async (req, res) => {
    const songs = await collection.find({ 
        singer: req.params.singer, 
        Film: req.params.film 
    }).toArray();
    res.json(songs);
});

app.get('/update/:songname', async (req, res) => {
    await collection.updateOne(
        { Songname: req.params.songname },
        { $set: { Actor: "Aditya Roy Kapur", Actress: "Shraddha Kapoor" } }
    );
    res.send(`<h1>Updated '${req.params.songname}' with Actor & Actress!</h1> <a href="/table">View Table</a>`);
});

app.get('/table', async (req, res) => {
    const songs = await collection.find({}).toArray();
    
    
    let html = `
    <h2>Songs Tabular Data</h2>
    <table border="1" cellpadding="10" style="border-collapse: collapse; font-family: Arial;">
        <tr style="background-color: #f2f2f2;">
            <th>Song Name</th>
            <th>Film Name</th>
            <th>Music Director</th>
            <th>Singer</th>
            <th>Actor</th>
            <th>Actress</th>
        </tr>`;
    
    songs.forEach(s => {
        
        html += `<tr>
            <td>${s.Songname || '-'}</td>
            <td>${s.Film || '-'}</td>
            <td>${s.Music_director || '-'}</td>
            <td>${s.singer || '-'}</td>
            <td>${s.Actor || '-'}</td>
            <td>${s.Actress || '-'}</td>
        </tr>`;
    });
    
    html += '</table><br><a href="/">Back to Home</a>';
    
    res.send(html); 
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
