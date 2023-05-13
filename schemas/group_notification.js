const mongoose = require('mongoose');
const url = process.env.NOTIF_DB_URL;
const notifDB = mongoose.createConnection(url || '');

const groupNotificationSchema = new mongoose.Schema({
    recievers: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true
    },
    failedCount: Number,
    successCount: Number,
    responses: [],
    sentOn: {
        type: Date,
        default: () => Date.now()
    }
})

const groupNotificationModel = notifDB.model("groupnotifications", groupNotificationSchema)
module.exports = { groupNotificationModel, notifDB }