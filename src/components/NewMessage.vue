<template>
	<q-modal 
	  ref="newMessageModal" 
	  v-model="$store.state.main.showNewMessage" 
	  content-css="border-radius: 4px; max-height:100%;" 
	  @hide="clearMSGForm" content-classes="col-4 flex"
	  @show="setRecipient">
    	<q-toolbar color="indigo" glossy>
	    	<q-toolbar-title class="col">Новое сообщение</q-toolbar-title>
	    	<q-btn icon="close" flat v-close-overlay />
	    </q-toolbar>
   		<div class="row q-pa-sm ">       
		        <q-select
		            float-label="Кому"
		            filter
		            filter-placeholder="Поиск" class="full-width"
		            autofocus-filter
                	multiple
		            chips
		            v-model="form.recipient"
		            :options="$store.state.main.users.filter(u => u.id != $user.id)
		            .map(opt => ({label: opt.full_name, value: opt.id}))">
		        </q-select>
		       <q-input v-model="form.title" float-label="Тема" clearable class="q-my-sm full-width"/>
		       <q-input
		          v-model.trim="form.text"
		          type="textarea"
		          float-label="Tекст сообщения"
		          :max-height="100"
		          :rows="8"
		          class="full-width shadow-1 block q-px-sm"
		        />
	           <q-uploader 
		           	ref="message_form"
		            url=""
		            float-label="Файлы:"
		            multiple
		            clearable
		            class="generic-margin full-width"
		            :before="[{icon: 'attachment'}]"
		            :hide-upload-button="true"
		            @add="addFile"
		            @remove:cancel="removeFile"
		            auto-expand
	           />       
			 </div>
     	<q-toolbar color="indigo" glossy class="justify-around group">
	            <q-btn icon="backspace" label="Отчистить" type="button" color="deep-orange" @click.native="clearMSGForm"></q-btn>
	            <q-btn icon="send" type="button" @click.native="sendMessage" :disabled="!validateMSGForm"  :color="validateMSGForm ? 'positive' : 'negative'" label="Отправить"></q-btn>
     	</q-toolbar>	 
	</q-modal>
</template>
	
<script>
export default {
	data() {
		return {
            form: {
              recipient: [],
              title: null,
              text: null,
              files: []
            }
		}
	},        
	methods: {
    // Set recipient from store
    setRecipient() {
      if (this.$store.state.main.recipient) {
        this.form.recipient.push(this.$store.state.main.recipient);
      }
    },
    // Reset message form
    clearMSGForm() {
        this.form.recipient = [];
        this.form.files = [];
        this.form.title = null;
        this.form.text = null;
        this.$refs['message_form'].reset();
        this.$store.commit('main/setRecipient', null);
    },
    // Add files to form
    addFile(files){
        var vm = this;
        files.forEach(function(file) {
            vm.form.files.push(file);
        })
    },
    // Remove file from form
    removeFile(file){
        this.form.files = this.form.files.filter(f => f !== file);
    },
    // Send message
    sendMessage() {
        const form = new FormData();
        const config = {headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'multipart/form-data'}};
        form.append('title', this.form.title);
        form.append('text', this.form.text);
        form.append('recipient', this.form.recipient);
        // Add files to form
        for (var i=0; i < this.form.files.length; i++) {
            let file = this.form.files[i];
            form.append('files', file);
        }
        this.$axios.post('/api/v1/messages/', form, config)
        .then(response => {
          this.$refs.newMessageModal.hide()
        })
        .catch(e => {
        	this.$handleError(e);
        })
    	},
    },
    computed: {
      // Check for from complete
      validateMSGForm() {
          if (this.form.title && this.form.text && this.form.recipient.length) {
            return true;
          }
          return false;
      },
    },
}

</script>
