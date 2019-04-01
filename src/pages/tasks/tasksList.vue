<template>
  <div class="row bg-white">
    <div class="col">
      <q-table
        :data="tasks"
        :columns="tasksColums"
        :visible-columns="visibleColumns"
        row-key="id"
        table-class="tasksTable"
        dense
        :pagination="pagination"
        :loading="loading"
        :table-style="{'min-height': $store.state.main.screen.height - 180 + 'px'}"
      >
        <q-td slot="body-cell-options" slot-scope="props" :props="props">
            <q-btn rounded color="primary" icon="menu">
              <q-popover>
                <q-list separator link>
                  <q-item v-close-overlay @click.native="detailTask = props.row">
                    <q-item-side color="primary" icon="zoom in"></q-item-side>
                    <q-item-main>Просмотр</q-item-main>
                  </q-item>
                  <q-item 
                    v-if="!props.row.is_completed && props.row.performer.id == $user.id" 
                    v-close-overlay 
                    @click.native="completeTask(props.row)"
                  >
                    <q-item-side color="primary" icon="check"></q-item-side>
                    <q-item-main>Выполнено</q-item-main>
                  </q-item>
                  <q-item 
                    v-if="props.row.assigner.id == $user.id" 
                    v-close-overlay 
                    @click.native="removeTask(props.row)"
                  >
                    <q-item-side color="red" icon="remove"></q-item-side>
                    <q-item-main>Удалить</q-item-main>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
        </q-td>
        <q-td slot="body-cell-importance" slot-scope="props" :props="props">
          <q-chip small square v-if="props.value == 'warning'" color="orange">Средняя</q-chip>
          <q-chip small square v-if="props.value == 'danger'" color="red">Высокая</q-chip>
          <q-chip small square v-if="props.value == 'success'" color="positive">Низкая</q-chip>
        </q-td>
        <q-td slot="body-cell-status" slot-scope="props" :props="props">
          <q-icon v-if="props.value" name="check circle" color="positive" size="1.5rem"><q-tooltip>Выполнено</q-tooltip></q-icon>
          <q-spinner-hourglass v-else-if="!props.value && new Date(props.row.to_complete) > new Date()" color="orange" size="25"><q-tooltip>В процессе</q-tooltip></q-spinner-hourglass>
          <q-icon v-else name="alarm off" size="1.5rem" color="red"><q-tooltip>Просроченно</q-tooltip></q-icon>
        </q-td>
        <q-td slot="body-cell-viewed" slot-scope="props" :props="props">
          <q-icon v-if="props.value" name="visibility" color="positive" size="1.5rem"><q-tooltip>Просмотренно</q-tooltip></q-icon>
          <q-icon v-else name="visibility_off" size="1.5rem" color="red"><q-tooltip>Не просмотренно</q-tooltip></q-icon>
        </q-td>

        <div slot="bottom" slot-scope="props" class="row justify-end items-center q-pa-sm fit">
         <q-btn
           round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
           :disable="!prev"
           @click="prevPage"
         />
         <div class="q-mr-sm" style="font-size: small">
           Страница {{ props.pagination.page }} / {{ props.pagesNumber }}
         </div>
         <q-btn
           round dense size="sm" icon="redo" color="secondary"
           :disable="!next"
           @click="nextPage"
         />
       </div>
   </q-table>
    </div>
    <task-detail v-if="detailTask" :task="detailTask" :hide="() => {detailTask = null}"/>
  </div>

</template>

<script>
  import DetailTaskPage from './taskDetail.vue' 

export default {
   name: 'TasksPage',
   props: ['path'],
   components: {'task-detail': DetailTaskPage},
   data() {
     return {
       url: '/api/v1/task/',
       loading: false,
       next: null,
       prev: null,
       detailTask: null,
       pagination: {
         page: 1,
         rowsPerPage: 20,
         rowsNumber: 0
       },
       tasksColums: [
         {name: 'options', label: 'Опции', field: 'id'},
         {name: 'importance', label: 'Важность', field: 'importance', align: 'center', sortable: true, sort: (a, b) => a > b},
         {name: 'status', label: 'Статус', field: 'is_completed', align: 'center', sortable: true, sort: (a, b) => a - b},
         {name: 'viewed', label: 'Просмотренно', field: 'viewed', align: 'center', sortable: true, sort: (a, b) => a - b},
         {name: 'to_complete', label: 'Выполнить до', field: 'to_complete', align: 'center', format: val => new Date(val).toLocaleString(), sortable: true},
         {name: 'assigner', label: 'Назначающий', field: task => task.assigner.full_name, align: 'center', sortable: true},
         {name: 'performer', label: 'Выполняющий', field: task => task.performer.full_name, align: 'center', sortable: true},
         {name: 'title', label: 'Название', field: task => task.title.slice(0,20) + '...', align: 'center'},
         {name: 'text', label: 'Описание', field: task => task.text.slice(0, 35) + '...', align: 'center'},
         {name: 'created_date', label: 'Создано', field: 'created_date', align: 'center', format: val => new Date(val).toLocaleString()},
         {name: 'completed_date', label: 'Выполнено', field: 'completed_date', align: 'center', format: val => val ? new Date(val).toLocaleString() : '---'},
         {name: 'files', label: 'Файлы', field: task => task.files.length, align: 'center'},
       ],
       tasks: [],
     }
   },
   methods: {
    // HTTP-PUT to complete task and set is complete
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
              task.is_completed = true;
            }).catch(e => {
              this.$handleError(e);
            })
        }).catch(() => {})
       }
     },
     // HTTP-DELETE to remove task (if task assigner is current user) and remove it from task list
     removeTask(task) {
       if (task && task.assigner.id == this.$user.id) {
         this.$axios.delete('/api/v1/task/' + task.id + '/')
         .then(response => {
           this.tasks = this.tasks.filter(t => {t.id !== task.id});
         }).catch(e => {
          this.$handleError(e);
         })
       }
     },
     // Next page pagination
     nextPage(val) {
        this.pagination.page++;
        this.getTasks(this.next);
     },
     // Previous page pagination
     prevPage(val){
       this.pagination.page--;
       this.getTasks(this.prev);
     },
     // HTTP-GET tasks to inbox or outbox
     getTasks(url) {
       this.loading = true;
       var params = {limit: this.pagination.rowsPerPage};
       this.path == 'inbox' ? params.performer = this.$user.id : params.assigner = this.$user.id;
       this.$axios.get(url || this.url, {params})
       .then(response => {
           this.tasks = response.data.tasks;
           this.pagination.rowsNumber = response.data.meta.total_count;
           this.prev = response.data.meta.previous;
           this.next = response.data.meta.next;

       }).catch(e => {
         this.$handleError(e);
       }).finally(() => {
         this.loading = false;
       })
     },
   },
   mounted() {
    // Launch tasks getter and set it to interval
     this.getTasks();
     this.tasksGetter = setInterval(this.getTasks, 1000*10)
   },

  destroyed: function() {
    // Clear task getter interval on destroying page
    clearInterval(this.tasksGetter);
  },
   watch: {
    // Watcher for path (inbox or outbox) 
     path: function() {
      // Clear tasks array and get tasks
       this.tasks = [];
       this.getTasks();
     }
   },

   computed: {
    // Visible table columns for desktop or mobile device
     visibleColumns() {
       var vTasks = [];
       if (this.$q.platform.is.desktop) {
       vTasks = this.tasksColums.map(col => {return col.name})
     } else {
       vTasks = this.tasksColums.map(col => {return col.name}).filter(col => { return col !='title' && col !='text'})
     };
     if (this.path == 'inbox') {
       return vTasks.filter(col => {return col !== 'performer' });
     } else {
       return vTasks.filter(col => {return col !== 'assigner' });
     }
    }
  },
}
</script>
