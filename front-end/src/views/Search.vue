<template>
<div id='main-search'>
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
        try{
            let tmp = [];
            let response = (await axios.get(`/api/notes`)).data;
            for(let e of response){
                for(let t of e.tags){
                    if(!tmp.includes(t))
                        tmp.push(t);
                }
            }
            this.tags = tmp;
            this.notes = response;

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