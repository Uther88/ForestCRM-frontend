<template>
    <q-layout>
        <q-page-container>
            <q-page class="bg-faded flex flex-center" style="height: 100vh;">
                <div class="bg-white shadow-1 flex column justify-between" :style="getStyle">
                    <q-toolbar color="dark" glossy>
                        <q-toolbar-title class=" text-bold text-positive uppercase text-center">Лесное Дело</q-toolbar-title>
                    </q-toolbar>
                    <form class="group q-pa-md flex column" enctype="multipart/form-data" id="login-form">
                        <q-field 
                        label="Логин:" 
                        icon="check_circle" 
                        :icon-color="checkInput(username) ? 'negative' : 'positive'" 
                        class="q-pa-sm shadow-1 round-borders" 
                        label-width="4"
                        autocomplete="login"
                        orientation="horizontal">
                            <q-input v-model.trim="username" type="text" align="center" lower-case />
                        </q-field>
                        <q-field 
                        label="Пароль:"
                        icon="check_circle" 
                        :icon-color="checkInput(password) ? 'negative' : 'positive'" 
                        class="q-pa-sm shadow-1 round-borders" 
                        label-width="4"
                        autocomplete="password"
                        @keyup.enter.native="doLogin"
                        orientation="horizontal">
                            <q-input v-model.trim="password" type="password" align="center" />
                        </q-field>
                        <q-inner-loading :visible="loading" dark>
                            <q-spinner-hourglass size="35" color="white" />
                        </q-inner-loading>
                    </form>
                    <q-toolbar class="flex-center" color="dark" glossy>
                        <q-btn 
                        label="Авторизация" 
                        form="login-form"  
                        @click.prevent="doLogin" 
                        color="positive" 
                        glossy 
                        :disabled="!is_valid" 
                        />
                    </q-toolbar>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
    
</template>

<script>
    export default {
        name: 'LoginPage',
        data () {
            return {
                username: null,
                password: null,
                loading: false,
            }
        },
        methods: {
            // Login        
            doLogin() {
                if (this.is_valid) {
                    this.$auth.login(this, this.username, this.password);
                    }
                },
            checkInput(text) {
                if (text) {
                    return /[А-Яа-яЁё\s]/i.test(text);
                }
                return true;
            },
        },
        computed: {
            // Get window screen size
            getStyle() {
                if (this.$q.platform.is.mobile) {
                    return 'min-height: 100vh; min-width: 100vw;'
                } else {
                    return 'min-height:40vh; min-width: 30vw;'
                }
            },
            // Check for complete login form
            is_valid: function() {
                return (
                    this.username && this.password && 
                    !this.checkInput(this.username) && 
                    !this.checkInput(this.password)
                    );
            }
        },
    }
</script>

<style>
    
</style>