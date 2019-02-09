<template>
<div class="fit">
  <q-toolbar color="indigo" class="group">
    <q-btn icon="add" label="Новое" color="positive" glossy @click.native="$store.commit('main/showNewMessage', true)" />
  </q-toolbar>
    <q-list link dense multiline separator class="no-padding">
        <q-item v-for="chat in chats" :key="chat.id" style="padding: 5px;" :to="{name: 'ViewChat', params: {id: chat.id}}">
            <q-item-side align="center" class="col-xs-3 col-md-2">
                <q-item-tile avatar><img :src="chat.members.filter(u => u.id != $user.id)[0].avatar || 'statics/anon.png'"></q-item-tile>
                <q-item-tile stamp color="dark">{{ chat.members.filter(u => u.id != $user.id)[0].full_name }}</q-item-tile>
                <q-item-tile stamp>{{parseDate(chat.messages[0].created_date)[0]}}</q-item-tile>
                <q-item-tile stamp>{{parseDate(chat.messages[0].created_date)[1]}}</q-item-tile>
            </q-item-side>
            <q-item-main :class="chat.messages[0].is_new ? 'bg-green-2' : ''">
                <q-item-tile v-if="chat.messages[0].sender.id == $user.id" stamp>
                  <img style="width:25px; height: 25px;" :src="chat.messages[0].sender.avatar || 'statics/anon.png'" class="avatar">
                  <span>{{chat.messages[0].sender.full_name}}</span>
                </q-item-tile>
                <q-item-tile v-else label class="q-pa-xs">{{truncate(chat.messages[0].title, 19)}}</q-item-tile>
                <q-item-tile sublabel class="shadow-1 round-orders q-pa-xs">{{ truncate(chat.messages[0].text, 25) }}</q-item-tile>
                <q-item-tile v-if="chat.messages[0].files.length" icon="attachment" color="primary"><q-tooltip color="red">Прикрепленные файлы: {{ chat.messages[0].files.map(f => f.title) }}</q-tooltip></q-item-tile>
            </q-item-main>

        </q-item>
    </q-list>
    <q-inner-loading :visible="loading" dark>
          <q-spinner-hourglass size="50px" color="primary"></q-spinner-hourglass>
        </q-inner-loading>
    </div>
</template>

<style>
    .new-message {
        -webkit-box-shadow: 0 0 3px green inset;
    }
</style>

<script>
export default {
    name: 'IncomingMessagesPage',
    data() {
      return {
        chats: [],
        loading: false,
      }
    },
    methods: {
        // HTTP-GET chats from backend
        getChats() {
          this.loading = true;
          this.$axios.get('/api/v1/chats/')
          .then(response => {
            this.chats = response.data.chats;
          }).catch(e => {
              this.$handleError(e);  
            }).finally(() => {
              this.loading = false;
            })
        },
        // Parse date to array with locale strings
        parseDate(d) {
            var date = new Date(d);
            return [date.toLocaleDateString(), date.toLocaleTimeString()];
        },
        // Truncate strings
        truncate(str, maxlength) {
          if(this.$store.state.main.screen.width > 360) {
             maxlength *= 5;
         }
          return (str.length > maxlength) ?
            str.slice(0, maxlength - 3) + '...' : str;
        },
    },
    mounted: function() {
      // Get chats on page load
      this.getChats();
    },
}
</script>
