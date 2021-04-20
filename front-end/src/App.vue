<template>
    <div id="app">
        <div id="nav" v-if="user">
            <router-link to="/">
                Edit Files</router-link>
            <router-link to="/search">
                Search Files</router-link>
        </div>
        <div v-else>
            <div id='spacer'>
            </div>
            <h1>
                Note App Login & Signup
            </h1>
        </div>
        <router-view/>
        <div id="footer">
            <a href='https://github.com/LlamaTheDark/cs260-final'>
                <div>
                    GitHub Link
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    // created() {
    //     let data = this.$root.$data;
    //     data.notes.forEach(
    //         note => note.tags.forEach(
    //             tag => {
    //                 if(!data.tags.includes(tag)) 
    //                     data.tags.push(tag);
    //             }
    //         )
    //     );
    //     data.tags.sort();
    // }
    computed: {
        user() {
            return this.$root.$data.user;
        }
    }
}
</script>


<style>

/* @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');

#spacer {
    width: 50%;
    padding-bottom: 10%;
}

body {
    background-color: rgb(255, 255, 252);
}

* {
    box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  width: 90%;
  margin: 0 auto;
}

#footer {
    font-family: 'Source Sans Pro', sans-serif;

    width: 100%;
    background-color:rgb(207, 255, 231);;
    padding: 10px;
    margin-top: 10px;
}

#nav {
    font-family: 'Source Sans Pro', sans-serif;
    padding: 30px;
    display: flex;
    justify-content: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 5px;

}

#nav a.router-link-exact-active {
    color: green;
    background-color: rgb(238, 255, 238);
}
</style>
