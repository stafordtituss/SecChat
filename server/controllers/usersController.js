const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Console } = require('console');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if(usernameCheck) {
            return res.json({ msg: 'Username already exists', status: false });
        }
        const emailCheck = await User.findOne({ email });
        if(emailCheck) {
            return res.json({ msg: 'Email already exists', status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const allUsers = await User.find({_id:{$ne:req.params.id}}).select([
            '_id',
            'username'
        ]);
        sharedSec = [];
        sharedSecret = '';
        for(i in allUsers) {
            console.log(i);
            const userDH = crypto.getDiffieHellman('modp15');
            const user2DH = crypto.getDiffieHellman('modp15');
            userDH.generateKeys();
            user2DH.generateKeys();
            const userPub = userDH.getPublicKey();
            const user2Pub = user2DH.getPublicKey();
            console.log(userPub);
            console.log(user2Pub);
            const sharedKey1 = userDH.computeSecret(user2Pub, null, 'hex');
            const sharedKey2 = user2DH.computeSecret(userPub, null, 'hex');
            username1 = allUsers[i].username;
            if(sharedKey1 === sharedKey2) {
                console.log("Success");
                item = {name: username1, secKey: sharedKey1}
                sharedSec.push(item);
            }
            const mUser = await User.updateMany({username: username1}, {$push: {
                sharedSec: {
                    name: username,
                    secKey: sharedKey2,
                }
            }})
        }
        console.log(sharedSec);
        // for(i in sharedSec) {
        //     const mUser = await User.updateMany({name: })
        // }
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            sharedSec,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            return res.json({ msg: 'Incorrect Username or Password', status: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({ msg: 'Incorrect Username or Password', status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({isSet: userData.isAvatarImageSet, image:userData.avatarImage});
    } catch (ex) {
        next(ex);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            'email',
            'username',
            'avatarImage',
            '_id',
            'sharedSec',
        ]);
        const userDH = crypto.getDiffieHellman('modp15');
        for(i in users) {
            console.log(users[i].sharedSec[0]);
        }
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};