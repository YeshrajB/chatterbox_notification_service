const express = require('express');
const messagingTokenModel = require('../schemas/token_schema');
const tokenRouter = express.Router()
const { errorLogger } = require("../logger")

tokenRouter.put("/", async (req, res) => {
    try {
        const { userId, messagingToken } = req.body;
        const tokenModel = await messagingTokenModel.findOne({ $or: [ { userId: userId }, { token: messagingToken } ]});
        if(tokenModel){
            //Update the userId or token depending upon the change.
            if(tokenModel.token == messagingToken){
                await tokenModel.updateOne({
                    $set: { userId: userId }
                })
            } else {
                await tokenModel.updateOne({
                    $set: { token: messagingToken }
                })
            }
        } else {
            const newTokenModel = new messagingTokenModel({
                userId: userId,
                token: messagingToken
            })
            await newTokenModel.save()
        }
        return res.status(201).send()
    } catch (error) {
        res.status(500).send()
        errorLogger({ err: error, endpoint: '/tokens/', method: 'PUT'})
    }
})

tokenRouter.delete("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        await messagingTokenModel.findOneAndDelete({ userId: userId })
        return res.status(200).send()
    } catch (error) {
        res.status(500).send()
        errorLogger({ err: error, endpoint: '/tokens/:userId', method: 'DELETE'})
    }
})

module.exports = tokenRouter