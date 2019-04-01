import Router from '../router/index.js'
import Vue from 'vue'


    // Authentication
    const Auth = {
        // Check for a user instance exists
        authenticated() {
        	if (Vue.ls.get('user')) { 	
                Vue.prototype.$user = Vue.ls.get('user');	
        		return true;
        	} else {
        		return false;
        	}
        },
        // Login to backend
        login(context, username, password, redirect) {
            context.loading = true;
            var token = username + ":" + password;
            var basic_auth = 'Basic ' + btoa(token);
            var headers = {
                "Authorization": basic_auth,
            };
            var params = {
                auth: true
            };
            context.$axios.get('/api/v1/users/' + username + '/', { params, headers })
            .then(response => {
                context.$ls.set('user', response.data);
                context.$axios.defaults.headers.common["Authorization"] = "ApiKey " + username + ":" + response.data.api_key;

                if (redirect) {
                    Router.push(redirect)
                } else {
                    Router.push('/')
                }

            }).catch(e => {
                context.$handleError(e);
            }).finally(() => {
                context.loading = false;
            })
        },

        // Logout from system
        logout: function(context) {
            context.$ls.clear();
            Router.replace('/auth');
        }
    }
 Vue.prototype.$auth = Auth;

export default ( {app, Vue } ) => {
    Vue.prototype.$auth = Auth;
}