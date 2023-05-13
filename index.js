const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const { createServer } = require('http');
const PORT = process.env.PORT;
const server = createServer(app)
const bodyParser = require('body-parser');
const { messageRouter } = require('./routes/message');
const tokensRouter = require('./routes/tokens');
const mongoose = require('mongoose');
mongoose.set({'strictQuery': false})
app.use(bodyParser.json())
app.use("/messages", messageRouter)
app.use("/tokens", tokensRouter)

connectToDatabase()

server.on('listening', () => {
    console.log('Express server started %s ', server?.address());
})

server.listen(parseInt(PORT), '127.0.0.1')

async function connectToDatabase(){
    const uri = process.env.TOKEN_DB_URL;
    if(!uri){
        throw Error("no database url found");
    }
    mongoose.connect(uri).then(() => {
        console.log("Connected to database");
    }).catch(error => {
        console.log("Error while connecting to tokens db: " + error);
    })
}
