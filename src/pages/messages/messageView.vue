<template>
  <div class="row justify-center bg-faded fit scroll-y"  :style="$q.platform.is.desktop ? 'align-items: center;' : ''">
    <div class="bg-indigo col-md-6 col-xs-12 row shadow-5 q-pa-xs round-borders">
      <q-toolbar color="indigo" class="no-padding self-start">
        <q-toolbar-title style="font-size: 12px;">
          Участники: 
          <span v-for="member in chat.members">
            <img :src="member.avatar || 'statics/anon.png'"
             class="avatar" 
             style="width: 20px; height: 20px" 
             />
            {{ member.full_name }}
          </span>
        </q-toolbar-title>
        <q-btn icon="reply" flat color="white" class="q-mx-xs" @click="$router.go(-1)" title="Входящие" />
      </q-toolbar>
      <div
       class="full-width round-borders scroll-y bg-white" 
       style="height: 55vh;" 
       id="messagesList" 
       ref="messagesList">
       	<template v-if="chat_messages.length">
          <q-chat-message
            v-for="message in chat_messages"
            :sent="message.sender.id == $user.id"
            :key="message.id"
            :name="message.sender.full_name"
            :text="handleMessageText(message.text, message.files)"
            :avatar="message.sender.avatar || 'statics/anon.png'"
            :stamp="parseDate(message.created_date)"
            size="10"
            class="q-px-sm chat">
            <q-icon 
            name="new_releases" 
            title="Не прочитанное" 
            v-if="message.sender.id == $user.id && message.is_new" 
            color="positive"
            class="float-right" style="bottom: 0;"
            />
          </q-chat-message>
          </template>
          <div v-else class="fit flex flex-center">
          	<q-spinner-hourglass size="30px" color="primary" />
          </div>
          <q-scroll-observable @scroll="getMoreMessages" />
			</div>
      <div class="full-width row q-py-xs bg-indigo items-center">
        <div class="col-10">
          <q-input 
	          hide-underline
	          type="textarea" 
	          class="q-pa-sm bg-white" 
	          style="border: 1px solid lightgrey; border-radius: 3px;" 
	          clearable 
	          max-length="200"
	          rows="1"
	          v-model="form.text" 
	          placeholder="Введите сообщение" 
          />
        </div>
        <div class="col text-center">
          <q-btn icon="send" push glossy color="positive" @click="sendMessage" />
        </div>
      </div>
      <div class="full-width row justify-center q-pt-xs">
          <q-uploader
           ref="fileField"
           url=""
           multiple
           dark inverted
           color="indigo-5" 
           class="col"
           :before="[{icon: 'attachment'}]"
           float-label="Прикрепить файлы"
           :hide-upload-button="true"
           hide-underline
           hide-upload-progress
           @add="addFile" 
           @remove:cancel="removeFile"
          />
      </div>
    </div>
  </div>
</template>

<style>
  .file-link {text-decoration: none;}
</style>

<script>
import { debounce } from 'quasar'
import { throttle } from 'quasar'

export default {
  name: 'MessageView',
  props: ['id'],
  data() {
    return {
      more_messages: null,
      chat_messages: [],
      chat: { members: [] },
      loading: false,
      form: {
        recipient: [],
        title: '',
        text: '',
        files: []
      }
    }
  },
  computed: {
      // Responsive screen size
      getStyle() {
        if (this.$q.platform.is.mobile) {
            return 'height: calc(100vh - 250px); min-width: 100vw;'
        } else {
            return 'height: calc(100vh - 270px); min-width: 60vw;'
        }
    },
  },
  methods: {
    // Add new message to chat
    addNewMessage(message) {
      if (message) {
        this.chat_messages.push(message);
        this.scrollTo();
      }
    },
    // Send new message
    sendMessage() {
        if (this.form.text.length) {
          this.loading = true;
          // Make message title
           this.form.title = this.form.text.slice(0, 25);
           this.form.title += this.form.text.length > 25 ? '...' : '';
           // Create neq form
           var data = new FormData();
           data.append('title', this.form.title);
           data.append('text', this.form.text)
           data.append('recipient', this.chat.members.filter(m => m.id != this.$user.id).map(m => m.id));
           data.append('sender', this.$user.id);
          // Add files to message form
           for (var i=0; i < this.form.files.length; i++) {
               let file = this.form.files[i];
               data.append('files', file);
           }
          this.$axios.post(
            '/api/v1/messages/', data
          ).then(response => {
            this.resetForm();
            this.addNewMessage(response.data);
          }).catch(e => {
            this.$handleError(e);
          }).finally(() => {
            this.loading = false;
          })
        }
    },
    // Add files to form
    addFile(files) {
        for (var i=0; i < files.length; i++) {
          this.form.files.push(files[i]);
        }
        if (this.form.text == '') {
          this.form.text = 'Файлы: ' + files.map(f => f.name);
        }
    },
    // Remove file from form
    removeFile(file){
        this.form.files = this.form.files.filter(f => f !== file);
    },
    // Reset form fields
    resetForm() {
      this.form.title = this.form.text = '';
      this.form.recipient = this.form.files = [];
      this.$refs['fileField'].reset();
    },
    // Debounce get more messages on scroll up
    getMoreMessages: debounce(function(pos) {
      if (this.more_messages && pos.direction == 'up' ) {
        this.getMessages();
      } 
    }, 1000),
    // Debounce scroll messages list
    scrollTo: debounce(function(pos) {
        this.$refs['messagesList'].scrollTop = this.$refs['messagesList'].scrollHeight;
    }, 500), 
    parseDate(date) {
      if (new Date(date).toDateString() == new Date().toDateString()) {
        return 'Сегодня, ' + new Date(date).toLocaleTimeString();
      }
      return new Date(date).toLocaleString();
    },
    // Handle message text to view in chat
    handleMessageText(text, files) {
      // Create array with message text
      const textList = [];
      if (text) {
        textList.push(text);
      }
      // Create hrefs for files to view into chat
      if (files.length) {
        for (var i=0; i < files.length; i++) {
            var view_link = document.createElement('a');
            var download_link = document.createElement('a');
            view_link.href = download_link.href = files[i].file;
            view_link.text = files[i].title;
            view_link.target = '_blank';
            download_link.download = view_link.text;
            download_link.className = 'fas fa-download text-primary q-px-sm';
            download_link.title = 'Скачать файл';
            textList.push([view_link.outerHTML, download_link.outerHTML]);
        }
      }
      return textList;
    },
    // HTTP-GET chat by props id
     getChat() {
      this.$axios.get(
        '/api/v1/chats/' + this.id + '/',
      ).then(response => {
        this.chat = response.data;
      })
      .catch(e => {
        this.$handleError(e);
      });
    },
    // HTTP-GET check outgoing messages for perusal
    checkOutcomming() {
      const params = { limit: 10, chats: this.id, sender: this.$user.id };
      this.$axios.get('/api/v1/messages/', { params })
      .then(response => {
        this.$store.commit('main/setStatus', true);
        response.data.messages.forEach(m => {
          if (!m.is_new) {
            this.chat_messages.find(cm => cm.id == m.id).is_new = false;
          }
        })
      }).catch(e => {

      })
    },
    // HTTP-GET chat messages
    getMessages(start) {
      this.loading = true;
      const params = {limit: 10, chats: this.id};
      this.$axios.get(this.more_messages || '/api/v1/messages/', { params })
      .then(response => {
        response.data.messages.forEach(m => this.chat_messages.unshift(m));
        this.more_messages = response.data.meta.next;
      }).catch(e => {
        this.$handleError(e);
      }).finally(() => {
        this.loading = false;
        if (start) {
        	this.$refs['messagesList'].scrollTop = this.$refs['messagesList'].scrollHeight;
        }
      })
    },
    // HTTP-GET new incoming messages
    getNewMessages() {
      const params = {
        chats: this.id, 
        is_new: true, 
        recipient__id: this.$user.id
      };
      this.$axios.get('/api/v1/messages/', { params })
      .then(response => {
        response.data.messages.forEach(m => this.addNewMessage(m));
      }).catch(e => {

      })
      
    },
  },
  created: function(){
    // Set interval for new messages checker
    this.newMessagesCheker = setInterval(this.getNewMessages, 1000 * 10);
    this.outMessagesChecker = setInterval(this.checkOutcomming, 1000 * 5);
  },
  mounted: function() {
    // Launch chat and messages getters on mounted
    this.getChat();
    this.getMessages(true);

  },
  destroyed: function() {
    // Clear new messages checker interval on destroy
    clearInterval(this.newMessagesCheker);
    clearInterval(this.outMessagesChecker);
  }
}
</script>

<style>
  .chat .q-message-avatar {width: 50px;}
</style>