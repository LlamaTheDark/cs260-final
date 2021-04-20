const express = require('express');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const router = express.Router();

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    role: {
        type: String,
        default: ''
    }
});

// before we call save, we create this hook to make sure that we salt and hash the password
// so we're not saving the password as plaintext
userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    try{
        const hash = await argon2.hash(this.password); // hashes and salts for us
        this.password = hash;
        next();
    } catch(err) {
        console.log(err);
        next(error);
    }
});


/*
 * @param password: the password to be compared with the correct password
 * @return: boolean, whether or not the passwords match (true for 'yes they match')
 * 
 */
userSchema.methods.comparePassword = async (password) => {
    try {
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch(err) {
        return false;
    }
}
userSchema.methods.toJSON = () => {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const User = mongoose.model('User', userSchema);

// ############ //
//  MIDDLEWARE  //
// ############ //
// valid user is middleware to check to see if there is an existing logged-in user session
// if there is, it gives subsequent requests/endpoints access to that user
const validUser = async (req, res, next) => {
    if(!req.session.userID) // if there's no existing session info proving a user was logged in,
        return res.status(403).send({
            message: 'not logged in' 
        });
    try{
        const user = await User.findOne({
            _id: req.session.userID
        });
        if(!user){
            return res.status(403).send({
                message: 'note logged in'
            });
        }
        req.user = user;
    } catch(err) {
        return res.status(403).send({
            message: 'not logged in',
        });
    }
    next(); // move to the next middleware
}

// ########### //
//  ENDPOINTS  //
// ########### //
