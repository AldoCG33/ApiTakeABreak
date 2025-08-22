const mongosee = require('mongoose');

const avatarSchema = new mongosee.Schema({
    name: String,
    url: String
});

module.exports = mongosee.model('Avatar', avatarSchema);