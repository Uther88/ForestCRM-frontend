<template>
  <q-modal
   v-model="opened" 
   content-css="max-height: 100%;" 
   @hide="hide" 
   content-classes="flex col-md-7 justify-center">
      <q-toolbar glossy color="indigo" class="self-start">
        <q-toolbar-title align="center">Просмотр задания</q-toolbar-title>
        <q-btn flat icon="close" v-close-overlay />
      </q-toolbar>
      <div class="text-center q-py-sm full-width">
          <div class="row">
            <div class="col-5 text-bold">
              Назначающий:
            </div>
            <div class="col text-left offset-2">
              <q-chip color="white" class="text-black" :avatar="task.assigner.avatar || '/statics/anon.png'">{{task.assigner.full_name}}</q-chip>
            </div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-5 text-bold">
              Выполняющий:
            </div>
            <div class="col offset-2 text-left">
              <q-chip color="white" class="text-black" :avatar="task.performer.avatar || '/statics/anon.png'">{{task.performer.full_name}}</q-chip>
            </div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-5 text-bold">
              Важность:
            </div>
            <div class="col">
              <q-chip small square class="shadow-1 no-border" v-if="task.importance == 'warning'" color="orange">Средняя</q-chip>
              <q-chip small square class="shadow-1 no-border" v-if="task.importance == 'danger'" color="red">Высокая</q-chip>
              <q-chip small square class="shadow-1 no-border" v-if="task.importance == 'success'" color="positive">Низкая</q-chip>
            </div>
          </div>
          <div class="row q-pa-sm">
            <div class="col-5 text-bold">
              Статус:
            </div>
            <div class="col">
              <q-icon v-if="task.is_completed" name="check circle" color="positive" size="1.5rem"><q-tooltip>Выполнено</q-tooltip></q-icon>
              <q-spinner-hourglass v-else-if="!task.is_completed && new Date(task.to_complete) > new Date()" color="orange" size="25"><q-tooltip>В процессе</q-tooltip></q-spinner-hourglass>
              <q-icon v-else name="alarm off" size="1.5rem" color="red"><q-tooltip>Просроченно</q-tooltip></q-icon>
              <q-icon v-if="!task.viewed" name="visibility_off" color="red" size="1.5rem" />
              <q-icon v-else name="visibility" color="green" size="1.5rem" />
            </div>
          </div>
          <div class="row flex-center">
              <div class="col-5 text-bold">
                Создано:
              </div>
              <div class="col text-bold group">
                <q-chip color="primary" square>
                  {{ new Date(task.created_date).toLocaleTimeString() }}
                </q-chip>
                <q-chip color="primary" square>
                  {{ new Date(task.created_date).toLocaleDateString() }}
                </q-chip>
              </div>
            </div>
            <div class="row flex-center">
              <div class="col-5 text-bold">
                Выполнить до:
              </div>
              <div class="col text-bold group">
                <q-chip square color="negative">{{new Date(task.to_complete).toLocaleTimeString()}}</q-chip>
                <q-chip square color="negative">
                {{new Date(task.to_complete).toLocaleDateString()}}
                </q-chip>
              </div>
            </div>
          <div class="row flex-center" v-if="task.is_completed">
            <div class="col-5 text-bold" v-if="task.is_completed">
              Выполнено:
            </div>
              <div class="col text-bold group" v-if="task.is_completed">
                <q-chip color="positive" square>
                  {{ new Date(task.completed_date).toLocaleTimeString() }}
                </q-chip>
                  <q-chip color="positive" square>
                  {{ new Date(task.completed_date).toLocaleDateString() }}
                </q-chip>
              </div>
            </div>
            <div class="row q-pa-sm" style="">
              <div class="col-5 text-bold">
                Название:
              </div>
              <div class="col text-left shadow-1 q-pa-sm">
                  {{ task.title}}
              </div>
            </div>
            <div class="row q-pa-sm">
              <div class="col-5 text-bold">
                Описание:
              </div>
              <div class="col text-left shadow-1 q-pa-sm">
                {{task.text}}
              </div>
            </div>
          <div class="row q-pa-sm">
            <div class="col-5 text-bold">
              Файлы:
            </div>
            <div class="col text-left shadow-1">
              <ol>
                <li v-for="file in task.files" :key="file.id">
                  <a 
                    :href="file.file" 
                    target="_blank" 
                    style="text-decoration: none;">
                      {{ file.title }}
                    </a>
                  <a :href="file.file" :download="file.file" class="fas fa-download q-px-xs text-primary">
                  </a>
                </li>
              </ol>
              <p v-if="!task.files.length" class="text-center">
                Файлов нет
              </p>
            </div>
          </div>
          <div class="row q-pa-sm">
              <div class="col-5 text-bold">
                Комментарий:
              </div>
              <div class="col text-left shadow-1 q-pa-sm">
                {{task.comment}}
              </div>
            </div>

      </div>
      <q-toolbar glossy class="justify-around self-end" color="indigo">
        <q-btn
          v-if="task.assigner.id == $user.id"
          color="negative"
          label="Удалить"
          icon="remove" 
          class="q-py-sm"
          dense
          @click.native="removeTask(task)"
        />
        <q-btn
	        v-if="!task.is_completed && task.performer.id == $user.id"
	        color="positive"
	        label="Выполнено"
          class="q-py-sm"
          dense
	        icon="check"
	        @click.native="completeTask(task)"
        />
        <q-btn
        icon="close"
        color="deep-orange"
        class="q-py-sm"
        dense
        v-close-overlay
        label="Закрыть"
        />
      </q-toolbar>
  </q-modal>
</template>

<script>
export default {
   name: 'DetailTaskPage',
   props: {
    task: { required: true, type: Object },
    hide: { required: true }
   },
   data() {
     return {
       opened: false,
     }
   },
   methods: {
    // If task is not viewed - set it viewed and HTTP-PUT it
    viewTask() {
      if (this.task && !this.task.viewed && this.task.performer.id == this.$user.id) {
        this.$axios.put('/api/v1/task/' + this.task.id + '/', { viewed: true })
        .then(response => {
          this.task.viewed = true;
        }).catch(e => {
            this.$handleError(e);
        })
      }
    },
    // If task is not completed - set complete and HTTP-PUT it
     completeTask(task) {
       if (task && !task.is_completed) {
        this.$q.dialog({
          message: 'Добавить комментарий?',
          ok: { label: 'Выполнить', color: 'positive'},
          cancel: { label: 'Отмена', color: 'negative'},
          noBackdropDismiss: true,
          prompt: {
            model: '',
            type: 'text',
            rows: '5'
          }
        }).then(data => {
            this.$axios.put('/api/v1/task/' + task.id + '/', { is_completed: true, comment: data })
            .then(response => {
              task.comment = data;
              task.is_completed = true;
              task.completed_date = new Date();
            }).catch(e => {
              this.$handleError(e);
            })
        }).catch(() => {})
       }
     },
     // Remove task (if task assigner is current user)
     removeTask(task) {
       if (task && task.assigner.id == this.$user.id) {
         this.$axios.delete('/api/v1/task/' + task.id + '/')
         .then(response => {
            this.opened = false;
         }).catch(e => {
            this.$handleError(e);
         })
       }
     },
   },
   mounted: function() {
      // Open task view dialog on mount page
      if (this.task) {
        this.opened = true;
        this.viewTask();
      }
   }

}
</script>
