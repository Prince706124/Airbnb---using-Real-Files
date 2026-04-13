const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usertype: { type: String, required: true, enum: ['host', 'guest'] },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }]
});

module.exports = mongoose.model('User', userSchema);