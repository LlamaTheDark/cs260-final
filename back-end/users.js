const express = require('express');
const mongoose = require('mongoose');
const argon2 = require('argon2');

const router = express.Router();

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
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
userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch(err) {
        return false;
    }
}
userSchema.methods.toJSON = function() {
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

// create a new user (registration endpoint)
router.post('/', async (req, res) => {
    // check for 
    if(!req.body.username || !req.body.password)
        return res.status(400).send({
            message: 'username and password are required'
        });
    try{
        // check for existing user
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if(existingUser)
            return res.status(403).send({
                message: 'username already exists'
            });
        
        // create a user and save it to the database
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        });
        await user.save(); // automatically calls salt and hash password stuff from the save hook

        // set user session info
        req.session.userID = user._id;
        
        // send 200 OK along with the newly created user
        return res.send({
            user: user
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login a user
// this uses post because we want to reserve put for modifying a user. Since there's already '/' we'll use '/login'
router.post('/login', async (req, res) => {
    // make sure we have username and password
    if(!req.body.username || !req.body.password)
        return res.sendStatus(400);
    
    try {
        // lookup user record
        const user = await User.findOne({
            username: req.body.username
        });
        if(!user){
            return res.status(403).send({
                message: 'username or password is wrong'
            });
        }

        // return the SAME error if the password is wrong.
        // This way we don't leak our users' information.
        if(!await user.comparePassword(req.body.password))
            return req.status(403).send({
                message: 'username or password is wrong'
            });
        
        // set user session info
        req.session.userID = user._id;
        
        return res.send({
            user: user
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get logged in user
// this uses the middleware 'validUser' to set req.user
router.get('/', validUser, async (req, res) => {
    try {
        res.send({
            user: req.user
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

// log a user out
router.delete('/', validUser, async(req, res) => {
    try{
        req.session = null;
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

// now we gotta export our modules

module.exports = {
    routes: router,
    model: User,
    valid: validUser, // allows other modulues to use th emiddleware to check for valid users
}