import axios from 'axios'

axios.defaults.baseURL = 'http://hostyng.ru:81/'
axios.default.withCreditnails = true

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
}
