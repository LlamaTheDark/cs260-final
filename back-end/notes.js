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

router.get('/api/notes', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.get('/:tag', async (req, res) => {
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
router.get('/:noteID', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.delete('/:noteID', async (req, res) => {
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
router.put('/:noteID', async(req, res) => {
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