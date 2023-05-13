const mongoose = require('mongoose');
const url = process.env.TOKEN_DB_URL;
const tokensDB = mongoose.createConnection(url || '');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const messagingTokenModel = tokensDB.model("MessagingTokens", tokenSchema)
module.exports = messagingTokenModel