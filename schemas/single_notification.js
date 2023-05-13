const mongoose = require('mongoose');
const { notifDB } = require('./group_notification');

const singleNotificationSchema = new mongoose.Schema({
    reciever: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    notifId: {
        type: String,
        required: true,
    },
    sentOn: {
        type: Date,
        default: () => Date.now()
    }
})

const singleNotificationModel = notifDB.model("singlenotifications", singleNotificationSchema)
module.exports = { singleNotificationModel }