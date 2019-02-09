<template>
  <div id="q-app">
    <q-window-resize-observable @resize="onResize" />
    <router-view />
    <new-message-dialog v-if="$auth.authenticated()" ref="newMessageDialog" />
  </div>
</template>

<script>
  import NewMessage from 'components/NewMessage'

export default {
  name: 'App',
  components: {
    'new-message-dialog': NewMessage,
  },

  data() {
      return {
          newMessageDialog: false,
      }

  },
    methods: {
      // Set screen width and hight in store on window resize
      onResize(size) {
        this.$store.commit('main/setScreen', size)
      },
    },
    mounted() {
      if (this.$auth.authenticated()) {
        this.$axios.defaults.headers.common["Authorization"] = "ApiKey " + this.$user.username + ":" + this.$user.api_key;
      }
    }
}

</script>
