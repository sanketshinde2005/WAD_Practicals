const express=require('express')
const app=express();
app.use(express.json())
app.use(express.static(__dirname))

let users=[];
app.post('/register',(req,res)=>{
    users.push(req.body);
    res.send('Registration succesffull!');
})

app.get('/user-list',(req,res)=>{
    res.json(users);
})

app.post('/login', (req, res) => {
    const { email, pass } = req.body;

    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        res.send("Login successful");
    } else {
        res.send("Invalid credentials");
    }
});

app.listen(3000,()=>{
    console.log("Server is running");
})
