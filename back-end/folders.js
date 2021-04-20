const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const notes = require('./notes.js');
const Note = notes.model;

const folderSchema = new mongoose.Schema({
    name: String,
    description: String,
    noteCount: {
        type: Number,
        default: 0,
    },
    tags: Array, // the accumulation of all the tags of its notes
});

const Folder = mongoose.model('Folder', folderSchema);

// ########### //
//  ENDPOINTS  //
// ########### //

// get a list of all folders
router.get('/api/folders', async (req, res) => {
    try{
        let folders = await Folder.find();
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
router.get('/api/folders/:folderID', async (req, res) => {
    console.log('getting a folder by its id...');
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
router.post('/api/folders', async (req, res) => {
    const folder = new Folder({
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
router.delete('/api/folders/:folderID', async(req, res) => {
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
router.put('/api/folders/:folderID', async (req, res) => {
    try{
        let folder = await Folder.findOne({_id: req.params.folderID});
        if(!folder){
            res.sendStatus(404);
            return;
        }
        folder.name = req.body.name;
        folder.tags = req.body.tags;
        folder.noteCount = req.body.noteCount;
        await folder.save();
        res.send(folder);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = {
    routes: router,
    model: Folder,
}