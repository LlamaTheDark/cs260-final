<template>
<div id='login-page'>
    <div>
        <form>
            <fieldset>
                <legend>
                    Register for an account
                </legend>
                <input placeholder="first name" v-model="firstName">
                <input placeholder="last name" v-model="lastName">
            </fieldset>
            <fieldset>
                <input placeholder="username" v-model="username">
                <input type="password" placeholder="password" v-model="password">
            </fieldset>
            <fieldset>
                <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">
                    Register
                </button>
            </fieldset>
        </form>
        <p v-if="error" class="error">
            {{error}}
        </p>
        <form>
        <fieldset>
            <legend>
                Login
            </legend>
            <input placeholder="username" v-model="usernameLogin">
            <input type="password" placeholder="password" v-model="passwordLogin">
        </fieldset>
        <fieldset>
            <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">
                Login
            </button>
        </fieldset>
        </form>
        <p v-if="errorLogin" class="error">{{errorLogin}}</p>
    </div>
</div>
</template>


<script>

import axios from 'axios';

export default {
    name: 'LoginPage',
    props: {},
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            password: '',

            usernameLogin: '',
            passwordLogin: '',

            error: '',
            errorLogin: '',
        }
    },
    methods: {
        async register() {
            this.error = '';
            this.errorLogin = '';

            if(!this.firstName || !this.lastName || !this.username || !this.password)
                return;
            try {
                let response = await axios.post(`/api/users`, {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    password: this.password,
                });
                this.$root.$data.user = response.data.user;
                console.log(response.data.user);
            } catch(err) {
                this.error = err.response.data.message;
            }
        },
        async login() {
            this.error = '';
            this.errorLogin = '';

            if(!this.usernameLogin || !this.passwordLogin)
                return;
            try {
                let response = await axios.post(`/users/api/login`, {
                    username: this.usernameLogin,
                    password: this.passwordLogin,
                });
                this.$root.$data.user = response.data.user;
                console.log(response.data.user);
            } catch(err) {
                this.errorLogin = err.response.data.message;
            }
        }
    }
}

</script>


<style scoped>

#login-page {
    width: 60%;
}

input {
    padding: 5px;
    margin: 10px;
    border: none;
    border-radius: 3px;
}
input:focus {
    border: none;
    border-radius: 3px;
    outline: none;
}

fieldset {
    border: none;
    background-color: rgb(222, 247, 222);
}

legend {
    padding: 5px;
    background-color: lightgreen;
    border: 2px lightgreen;
    border-radius: 5px;
}

form {
    margin: 10px;
}

button {
    border: none;
    padding: 5px;
    margin: 5px;
    background-color: lightgreen;
}
button:hover {
    cursor:pointer;
}
button:active {
    background-color: rgb(91, 150, 91);
}

.error {
    color: red;
}

</style>