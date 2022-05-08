const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
    sharedSec: {
        type: Array,
        default: null,
        id: {
            type: String,
            default: '',
        },
        secKey: {
            type: String,
            default: '',
        },
    },
    pubKey: {
        type: Buffer,
        default: null,
    },
});

module.exports = mongoose.model('Users', userSchema);