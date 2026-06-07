const express = require('express');
const connectDB=require('./config/db.js')
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const workspaceRoutes = require('./routes/workspace.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express();

require('dotenv').config()

app.use(cors());

const PORT=process.env.PORT;

connectDB()

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/workspaces',workspaceRoutes);

app.use(errorHandler)

app.get('/',(req,res)=>{
    console.log("API is running..")
});

app.listen(PORT,(error)=>{
    if(!error){
        console.log(`Successfully log in app at PORT ${PORT}`)
    }
    else{
        console.log('Error starting express app.')
    }
})