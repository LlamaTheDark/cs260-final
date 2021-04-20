# CS260 Final Project
I'm using my previous two creative projects and just adding more functionality such as authentication.

## Functionality Overview
### Users
First and foremost, you will be greeted with a page to register for an account or login. This is pretty self-explanatory. Folders and notes you create as a user will be accessible only to that user.

### Folders
Folders are just a way to organize notes. You can include a description with them, and they display the number of notes in the folder.

### Notes
Notes are just plaintext files. It is required to enter an extension because I thought about implementing some sort of style marking depending on the file type (e.g. `.md` `.js` `.css` `.html` `.java` `.cpp` `.h` `.py` etc.). They can be rendered via the check box in the toolbar (next to the buttons to add and delete notes/folders).

### Markdown
I used `marked.js` to parse plaintext markdown / html into the DOM of the page.

### Tags
You can add tags to files, but not to information in the files. You can then search by these tags and by keyphrase (and any combination of tags/keywords).

## Project Requirements
### Vue CLI and Vue Router
The front end of the site uses Vue CLI and the Vue Router. There are 2 pages:
1. Edit Files
2. Search Files

### Node, Express, and Mongo
The back end uses Node, Express, and Mongo, and the information is persistent.

### REST API
There are three main collections in the Mongo Database: folders, notes, and users. They have the following schema:

#### Folders
```js
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
```

#### Notes
```js
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
```

#### Users
```js
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
});
```

### User Authentication
You can create a user and login with a username and password. Passwords are salted and hashed using `argon2`. `cookie-session` and `cookie-parser` were used to create persistent data (keep users logged in).

### Robust Data Model
The aforementioned schema were used to create the mongoose data models.

### Security
As previously mentioned, passwords are salted and hashed. The only way to access a users files is to know that users login information (which cannot feasibly be determined once salted and hashed).