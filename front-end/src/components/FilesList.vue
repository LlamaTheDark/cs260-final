<template>
    <div id='FilesList'>
        <h2 class='title'>
            Notes
        </h2>
        <ul id='files'>
            <li v-for="n in notes" :key="n.id" @click='selectNote(n)'>
                <h4 :class="{selected: (n._id === note._id), 'note-title': true}">
                    {{ n.name }}{{ n.extension }}
                </h4>
                <hr>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: 'FilesList',
    props: {
        notes: Array,
    },
    computed: {
        note(){
            return (this.$root.$data.note !== null)?this.$root.$data.note:{name: '', extension: ''};
        }
    },
    methods: {
        selectNote(n){
            this.$root.$data.note = n;
            console.log(`selecting note: ${this.$root.$data.note.name}${this.$root.$data.note.extension}`);
        }
    },
}

</script>

<style scoped>

* {
    font-family: 'Source Sans Pro', sans-serif;
}

.title {
    text-decoration: underline;
}


#files {
    list-style: none;
    padding: 5px;

    overflow: hidden;
    overflow-y: auto;

    width: 100%;
    height: 85%;
}
#files li {
    margin: 10px 0px;
    padding: 0 10px;
}
#files li * {
    padding: 0;
    margin: 0;
}
#files li:hover {
    cursor: pointer;
}

#files li>h4 {
    padding: 2px;
}

.selected {
    color: green;
    background-color: rgb(238, 255, 238);
}
.note-title {
    /* border: 1px dotted red; */
    padding: 0;
    text-align: left;
}

</style>