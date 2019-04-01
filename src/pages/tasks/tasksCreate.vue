<template>
  <div class="row justify-center bg-faded scroll-y" style="min-height: calc(100vh - 136px);">
    <div 
      class="col-md-4 col-xs-12 bg-white flex round-borders shadow-5" 
      :style="$q.platform.is.desktop ? {'margin': 'auto'} : '' "
    >
      <div class="full-width q-pa-xs flex column">
        <q-field icon="account box" :icon-color="form.performer ? 'positive' : 'negative'">
          <q-select
          separator
          float-label="Выполняющий"
          v-model="form.performer"
          :options="$store.state.main.users.map(usr => ({label: usr.full_name, value: usr.id, avatar: usr.avatar}))"
          />
        </q-field>
        <q-field icon="warning" :icon-color="form.importance ? 'positive' : 'negative'">
          <q-select
          float-label="Важность" radio
          v-model="form.importance"
          :options="importances"
          />
        </q-field>
        <q-field icon="date range" :icon-color="form.to_complete ? 'positive' : 'negative'">
          <q-datetime
          float-label="Выполнить до"
          :value="form.to_complete"
          @change="val => {form.to_complete = new Date(val).toString().split('GMT')[0]}" 
          type="datetime"
          format="DD.MM.YYYY, HH:mm"
          :min="new Date()"
          modal
          />
        </q-field>
        <q-field icon="title" :icon-color="form.title ? 'positive' : 'negative'">
          <q-input
            v-model="form.title"
            float-label="Название"
          />
        </q-field>
        <q-field icon="edit" :icon-color="form.text ? 'positive' : 'negative'">
          <q-input
            type="textarea" rows="4"
            v-model="form.text"
            float-label="Описание"
            class="q-pa-xs"
            :max-height="10"
          />
        </q-field>
        <q-field icon="attachment" icon-color="secondary">
          <q-uploader ref="task_files"
           url=""
           float-label="Файлы:"
           multiple
           clearable
           class="generic-margin"
           :hide-upload-button="true"
           @add="addFile"
           @remove:cancel="removeFile"
           auto-expand hide-upload-progress
          />
        </q-field>
      </div>
      <q-toolbar color="indigo" glossy class="justify-around self-end">
        <q-btn
          color="negative"
          label="Отчистить"
          @click.native="resetForm"
        />
        <q-btn
          :color="is_valid ? 'positive' : 'warning'"
          label="Сохранить"
          :disabled="!is_valid"
          @click.native="saveTask"
        />
      </q-toolbar>
  </div>
  </div>
</template>

<script>
export default {
  name: 'TaskCreatePage',
  props: ['user'],
  data() {
    return {
      importances: [
        {label: 'Низкая', value: 'success'},
        {label: 'Средняя', value: 'warning'},
        {label: 'Высокая', value: 'danger'}
      ],

      form: {
        performer: null,
        importance: null,
        to_complete: null,
        title: null,
        text: null,
        files: [],
      }
    }
  },
  methods: {
    // Clear form fields
    resetForm(){
      this.form.title = this.form.text = this.form.to_complete = this.form.performer = this.form.importance = null;
      this.form.files = [];
      this.$refs['task_files'].reset();
    },
    // Check for valid and save task
    saveTask(){
        if (this.is_valid) {
          // Create form data and append data from fields
          const form = new FormData();
          form.append('title', this.form.title);
          form.append('text', this.form.text);
          form.append('performer', this.form.performer);
          form.append('importance', this.form.importance);
          form.append('to_complete', this.form.to_complete);
          // Add files to form filelist
          for (var i=0; i < this.form.files.length; i++) {
              let file = this.form.files[i];
              form.append('files', file);
          }
          // HTTP-POST data
          this.$axios.post('/api/v1/task/', form)
          .then(response => {
            this.resetForm();
            this.$q.notify(
              { message: 'Готово!', color: 'positive', type: 'positive', detail: 'Созданно новое задание'}
              )
          }).catch(e => {
              this.$handleError(e);
          })
        }
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
        this.form.files = this.form.files.filter(function(item) {return item !== file;})
    },
  },
  mounted(){
    // Set task performer from props
    if (this.user) {
      this.form.performer = this.user;
    }
  },
  computed: {
    // Check for valid fields complete
    is_valid() {
      return Object.values(this.form).every(item => { return item;});
    }
  }
}
</script>
