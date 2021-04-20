<template>
<div class='file-view'>
    <div class='note-content-rendered' v-if="rendered" v-html="renderedText">
    </div>
    <div id='note-content' v-else>
        <textarea id='note-content-textarea' v-model='noteContent'>
        </textarea>
    </div> 
</div>
    
</template>

<script>

import marked from 'marked';
import axios from 'axios';

export default {
    name: 'FileView',
    props: {
        rendered: Boolean,
        note: Object,
        folder: Object,
    },
    data() {
        return {
            noteContent: '',
        }
    },
    computed: {
        renderedText() {
            if(this.note === null){
                return '';
            }
            return marked(this.note.content);
        },
    },
    watch: {
        note: function(newvalue){
            if(newvalue === null){
                this.noteContent = '';
            }else{
                this.noteContent = newvalue.content;
            }
        },
        noteContent: async function(newvalue){
            if(this.note === null || this.folder === null)
                return;

            this.note.content = newvalue;
            try{
                await axios.put(`/api/folders/${this.folder._id}/notes/${this.note._id}`, this.note);
            } catch(error) {
                console.log('error in noteContent listener.');
            }
        },
        // noteContent: function(newvalue) {
            
        //     let data = this.$root.$data;
        //     let i = data.notes.indexOf(this.note);
        //     if(i != -1){
        //         data.notes[i].content = newvalue;
        //     }
        // }
    }
}

</script>

<style scoped>

#note-content {
    font-family: 'Source Sans Pro', sans-serif;

    text-align: left;
    padding: 20px;

    width: 100%;
    height: 95%;
    /* border: 1px solid red; */
}
.note-content-rendered {
    height: 95%;
    width: 98%;

    margin: 0 auto;
    
    overflow: hidden;
    overflow-y: auto;

    text-align: left;
    padding: 10px;
}


#note-content textarea {
    font-family: 'Source Sans Pro', sans-serif;

    overflow: hidden;
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    resize: none;

    border: none;
    /* border: 1px solid blue; */
}

.file-view {
    width: 70%;
    /* border: 1px solid black; */
    
}

</style>