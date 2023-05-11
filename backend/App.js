const express = require('express');
const mongoose = require('mongoose');

const app = express(); //create an instance of express application
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

//connect to mongoDB Atlas 
try {
    const connectionString = 'mongodb+srv://test:test@cluster0.<PASSWORD>.mongodb.net/test1?retryWrites=true&w=majority';
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }

//define user schema and model

const userSchema = new mongoose.Schema({   //specifies structure of user document
    username:String, 
    password:String,
});

const User = mongoose.model('User',userSchema);

//create the API endpoints for CRUD operations:
//POST
app.post('/api/users',async(req,res)=>{
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
});

// app.post('/api/users/login',async(req,res)=>{
//     const user = await User.findOne(req.body);
//     if(!user){
//         return res.status(404).send('user not found');
//     }
//     res.send(user);
// })

//PUT

app.put('/api/users/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id,req.body,{new:true});
    if(!updatedUser){
        return res.status(404).send('user not found')
    }
    res.send(updatedUser);
});

//DELETE

app.delete('/api/users/:id',async(req,res)=>{
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if(! deletedUser){
        return res.status(404).send('user not found')
    }
    res.send(deletedUser);
})


const port = 3000;
app.listen(port, ()=> console.log(`server running on port ${port}`));
