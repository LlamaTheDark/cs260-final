const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const users = require('./users.js');
const User = users.model;
const validUser = users.valid;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['secretvalue'],
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

mongoose.connect('mongodb://localhost:27017/cs260-final', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
    name: String,
    extension: String,
    content: String,
    tags: Array,
    folder: {
        type: mongoose.Schema.ObjectId,
        ref: 'Folder'
    }
});

const folderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: String,
    description: String,
    noteCount: {
        type: Number,
        default: 0,
    },
    tags: Array, // the accumulation of all the tags of its notes
});

const Note   = mongoose.model('Note'  , noteSchema  );
const Folder = mongoose.model('Folder', folderSchema);

// ########### //
//  ENDPOINTS  //
// ########### //

// get a list of all notes
app.get('/api/notes', async (req, res) => {
    try{
        let notes = await Note.find();
        if(!notes){
            res.sendStatus(404);
            return;
        }
        res.send(notes);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// get a list of all notes for a given folder
app.get('/api/folders/:folderID/notes', async (req, res) => {
    try{
        let notes = await Note.find({folder: req.params.folderID});
        if(!notes){
            res.sendStatus(404);
            return;
        }
        res.send(notes);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});


// get all notes with a certain tag
app.get('/api/folders/:folderID/notes/:tag', async (req, res) => {
    try{
        let note = await Note.find({tags: req.params.tag});
        if(!note){
            res.sendStatus(404);
            return;
        }
        res.send(note);
    } catch(error) {
        console.log(error);
        return;
    }
});

// get a specific note by id
app.get('/api/folders/:folderID/notes/:noteID', async (req, res) => {
    try{
        let note = await Note.findOne({_id: req.params.noteID, folder: req.params.folderID});
        if(!note){
            res.sendStatus(404);
            return;
        }
        res.send(note);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// create a new note - in a given folder (post)
app.post('/api/folders/:folderID/notes', async (req, res) => {
    const note = new Note({
        name: req.body.name,
        extension: req.body.extension,
        content: req.body.content,
        tags: req.body.tags,
        selected: req.body.selected,
        folder: req.body.folder._id,
    });
    try{
        await note.save();
        res.send(note);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// delete a note (delete)
app.delete('/api/folders/:folderID/notes/:noteID', async (req, res) => {
    try{
        let note = await Note.findOne({_id: req.params.noteID, folder: req.params.folderID});
        if(!note){
            res.sendStatus(404);
            return;
        }
        await note.delete();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// edit a note (put)
app.put('/api/folders/:folderID/notes/:noteID', async(req, res) => {
    try{
        let note = await Note.findOne({_id: req.params.noteID, folder: req.params.folderID});
        if(!note){
            res.sendStatus(404);
            return;
        }
        note.name =  req.body.name;
        note.extension =  req.body.extension;
        note.content =  req.body.content;
        note.tags =  req.body.tags;
        note.folder =  req.params.folderID;
        await note.save();
        res.send(note);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// ########### //
//  ENDPOINTS  //
// ########### //

// get a list of all folders for a given user
app.get('/api/folders', validUser, async (req, res) => {
    try{
        let folders = await Folder.find({user: req.user._id});
        if(!folders){
            res.sendStatus(404);
            return;
        }
        res.send(folders);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// get a folder by its id
app.get('/api/folders/:folderID', async (req, res) => {
    try {
        let folder = await Folder.findOne({_id: req.params.folderID});
        if(!folder){
            res.sendStatus(404);
            console.log('BIG NONO');
            return;
        }
        res.send(folder);
    } catch(err) { 
        console.log(error);
        res.sendStatus(500);
    }
});

// create a new folder
app.post('/api/folders', validUser, async (req, res) => {
    const folder = new Folder({
        user: req.user._id,
        name: req.body.name,
        description: req.body.description,
        noteCount: 0,
    });
    try{
        await folder.save();
        res.send(folder);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// delete a folder (and it's contents)
app.delete('/api/folders/:folderID', async (req, res) => {
    try{
        let folder = await Folder.findOne({_id: req.params.folderID});
        if(!folder){
            req.sendStatus(404);
            return;
        }
        // delete all notes under this folder
        let result = await Note.deleteMany({folder: folder});
        if(!result){
            req.sendStatus(500);
            return;
        }
        await folder.delete();
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// edit a folder (name and color)
app.put('/api/folders/:folderID', async (req, res) => {
    try{
        let folder = await Folder.findOne({_id: req.params.folderID});
        if(!folder){
            res.sendStatus(404);
            return;
        }
        folder.user = req.body.user;
        folder.name = req.body.name;
        folder.tags = req.body.tags;
        folder.noteCount = req.body.noteCount;
        folder.description = req.body.description;
        await folder.save();
        res.send(folder);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.use('/api/users', users.routes);

app.listen(3003, () => { console.log('Server listening on port 3003') });