import Vue from 'vue'


export const setAccount = ({commit}) => {
	var user = Vue.ls.get('user')
	commit('setAccount', user)
}

export const fetchUsers = ({commit}, context) => {
        context.$axios.get('/api/v1/users/')
        .then(response => {
        	commit('addUsers', response.data.users)
        }).catch(e => {
          context.$handleError(e);
        })
}

export const fetchUnits = ({commit}, context) => {
        context.$axios.get('/api/v1/units/')
        .then(response => {
            commit('addUnits', response.data.units);
        }).catch(e => {
          context.$handleError(e);
        })
}

export const showNewMessage = ({commit}, user) => {
	commit('showNewMessage', true);
	commit('setRecipient', user);
}