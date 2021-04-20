const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const folders = require('./folders.js');
const Folder = folders.model;

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

const Note = mongoose.model('Note'  , noteSchema  );

// ########### //
//  ENDPOINTS  //
// ########### //

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
    })
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


module.exports = {
    routes: router,
    model: Note,
}