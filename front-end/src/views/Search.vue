<template>
<div id='main-search'>
    <div v-if="user">
        <p>
            This will select a note for you, but you'll have to go back to the edit files screen to edit it
        </p>
        <div id='filter'>
            Narrow By Tag: 
            <select id='tag-query' v-model="tagFilter">
                <option value='none'>none</option>
                <option v-for="tag in tags" :value="tag" :key="tag">{{ tag }}</option>
            </select>
            <br />
            Narrow By Keyword
            <input type='text' placeholder='enter search query' v-model="keywordFilter" />
        </div>
        <FilesList id='files-list' :notes="filteredNotes" :options="true" />
    </div>
    <div v-else>
        <router-link to="/">
            Return To Login Page
        </router-link>
    </div>
</div>
</template>

<script>

import FilesList from '@/components/FilesList'
import axios from 'axios';

export default {
    name: 'Search',
    components: {
        FilesList
    },
    data() {
        return {
            tags: [],
            keywordFilter: '',
            tagFilter: 'none',
            notes: [],
        }
    },
    async created() {
        try {
            let response = await axios.get(`/api/users/`);
            this.$root.$data.user = response.data.user;
        } catch(err) {
            this.$root.$data.user = null;
        }
        try{
            let result = [];
            let notes = [];

            // get all folders for a singe user
            let response = await axios.get('/api/folders');
            for(let f of response.data){
                let responseNotes = await axios.get(`/api/folders/${f._id}/notes`);
                console.log(responseNotes);
                for(let n of responseNotes.data){
                    notes.push(n);
                }
                for(let t of f.tags){
                    if(!result.includes(t))
                            result.push(t);
                }
            }
            this.notes = notes;
            this.tags = result;

        } catch(err) { console.log(err); }
        
    },
    computed: {
        filteredNotes() {
            // ya know it woulda been so much easier to just make a schema for tags... oof
            let tmp = [];
            if(this.keywordFilter != ''){
                if(this.tagFilter != 'none'){
                    for (let el of this.notes){
                        if(el.tags.includes(this.tagFilter) && el.name.toLowerCase().search(this.keywordFilter.toLowerCase()) >= 0){
                            tmp.push(el);
                        }
                    }
                    return tmp;
                }else{
                    for(let el of this.notes){
                        if(el.name.toLowerCase().search(this.keywordFilter.toLowerCase()) >= 0)
                            tmp.push(el);
                    }
                    return tmp;
                }
            }else if (this.tagFilter != 'none'){
                for (let el of this.notes){
                    if(el.tags.includes(this.tagFilter)){
                        tmp.push(el);
                    }
                }
                return tmp;
            }
            return this.notes;
        },
        user(){
            return this.$root.$data.user;
        }
    }
}

</script>

<style scoped>

* {
    font-family: 'Source Sans Pro', sans-serif;
    box-sizing: border-box;
}

#filter {
    text-align: left;
    margin-left: 3%;
}
#filter * {
    margin: 3px;
}


#files-list {
    height: 800px;
}

#main-search {
    width: 80%;
    margin: 0 auto;
}
#main-search {
    padding: 50px;
}

</style>