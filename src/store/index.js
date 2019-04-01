import Vue from 'vue'
import Vuex from 'vuex'

import main from './main'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main
  }
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./main'], () => {
    const newMain = require('./main').default
    store.hotUpdate({ modules: { main: newMain } })
  })
}

export default store
