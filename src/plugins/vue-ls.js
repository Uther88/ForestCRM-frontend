import Storage from 'vue-ls';
import Vue from 'vue';
	const options = {
		  namespace: 'vuejs__', // key prefix
		  name: 'ls', // name variable Vue.[ls] or this.[$ls],
		  storage: 'local', // storage name session, local, memory
	}
export default ({ app, Vue }) => {
  	Vue.use(Storage, options)
}