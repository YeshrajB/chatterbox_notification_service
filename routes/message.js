const express = require('express');
const messageRouter = express.Router()
const { initializeApp, applicationDefault, } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const messagingApp = initializeApp({credential: applicationDefault()}, "MessagingApp")
const messaging = getMessaging(messagingApp)
const messagingTokenModel = require('../schemas/token_schema');
const { singleNotificationModel } = require('../schemas/single_notification');
const { groupNotificationModel } = require('../schemas/group_notification');
const { errorLogger } = require("../logger")

messageRouter.post("/single", async (req, res) => {
    try {
        const userId = req.body.user;
        const tokenInfo = await messagingTokenModel.findOne({ userId: userId })
        if(tokenInfo){
            const id = await messaging.send(getSingleNotification(req.body, tokenInfo.token))
            const notif = new singleNotificationModel({
                notifId: id,
                reciever: userId, 
            })
            await notif.save()
            res.status(200).send();
        }
    } catch (error) {
        res.status(500).send()
        errorLogger({ err: error, endpoint: '/messages/single', method: 'POST'})
    }
})

messageRouter.post('/group', async (req, res) => {
    try {
        const users = req.body.users;
        const tokens = await getTokens(users);
        const message = getGroupNotification(req.body, tokens);
        messaging.sendMulticast(message).then((response) => {
            console.log("total " +  tokens.length +  "failed " + response.failureCount + " success " + response.successCount);
            const notif = new groupNotificationModel({
                recievers: users,
                responses: response.responses,
                failedCount: response.failureCount,
                successCount: response.successCount
            })
            notif.save()
            res.status(200).send()
        });
    } catch (error) {
        res.status(500).send()
        errorLogger({ err: error, endpoint: '/messages/group', method: 'POST'})
    }
})

function getGroupNotification(data, registrationTokens){
    return {
        data: {
            content_type: data.content_type,
        },
        notification: {},
        android: {
            notification: {
                // imageUrl: "",
                title: data.title,
                body: data.body,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                tag: data.tag,
                icon: '@mipmap/ic_launcher',
                color: '#7e55c3'
            }
        },
        tokens: registrationTokens
    };
}

async function getTokens(userIds){
    let messagingTokens = []
    for await(const userId of userIds) {
        const tokenInfo = await messagingTokenModel.findOne({ userId: userId })
        if(tokenInfo){
            messagingTokens.push(tokenInfo.token);
        }
    }
    return messagingTokens;
}

function getSingleNotification(data, notificationToken){
    return {
        data: {
            content_type: data.content_type,
        },
        notification: {},
        android: {
            notification: {
                imageUrl: "",
                title: data.title,
                body: data.body,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                tag: data.tag,
                icon: '@mipmap/ic_launcher',
                color: '#00ff00'
            }
        },
        token: notificationToken
    };
}

module.exports = { messageRouter }