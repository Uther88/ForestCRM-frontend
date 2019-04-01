<template>
  <div class="container bg-white">
    <div class="row justify-start q-pa-sm bg-grey-2 justify-center">
      <div class="col-sx-4">
          <q-datetime
            v-model="date"
            placeholder="Дата"
            format="D/MM/YYYY"
            hide-underline
            color="green"
            :before="[{icon:'today'}]"
          />
        </div>
        <div class="col-sx-5">
          <q-select
            placeholder="Сотрудник"
            hide-underline
            v-model="user"
            :options="getStatsUsers"
            filter
          />
        </div>
    </div>
    <div class="row justify-center">
      <div class="col">
        <q-table
          :columns="columns"
          :data="tableData"
          row-key="id"
          :loading="loading"
          :pagination="{rowsPerPage: 0}"
          :table-style="{'min-height': $store.state.main.screen.height - 230 + 'px'}"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
   name: 'TasksMainPage',
   data() {
     return {
       loading: false,
       date: new Date().toISOString(),
       user: this.$user.id,
       tableData: [],
       columns: [
         {name: 'username', label: 'Ф.И.О.', field: 'username', align: 'center'},
         {name: 'position', label: 'Должность', field: 'position', align: 'center'},
         {name: 'completed', label: 'Выполненых', field: 'completed', align: 'center'},
         {name: 'uncompleted', label: 'Не выполненых', field: 'uncompleted', align: 'center'},
         {name: 'overdue', label: 'Просроченных', field: 'overdue', align: 'center'}
       ],
     }
   },

   methods: {
     getStatistic(){
       if (this.date && this.user) {
         var params = { performer: this.user, to_complete__contains: this.date.split('T')[0]};
         this.$axios.get('/api/v1/task/',  {params})
         .then(response => {
           this.handleData(response.data);
         }).catch(e => {
            this.$handleError(e);
         })
       }
     },

     handleData(data) {
      this.tableData = [];
       if (data && data.meta.total_count) {
         var tableRow = {};
         tableRow.username = data.tasks[0].performer.full_name;
         tableRow.position = data.tasks[0].performer.position;
         tableRow.completed = data.tasks.filter(t => {return t.is_completed}).length;
         tableRow.uncompleted = data.tasks.filter(t => {
           if (!t.is_completed) {
             return new Date(t.to_complete) > new Date();
           }
         }).length;
         tableRow.overdue = data.tasks.filter(t => {
           if (!t.is_completed) {
             return new Date(t.to_complete) < new Date();
           }
         }).length;
         this.tableData.push(tableRow);

       }
     },
   },

   mounted: function(){
     this.getStatistic();
   },
   watch: {
     user: function(id) {
       if (id) {
         this.getStatistic();
       }
     },
     date: function(date) {
       if(date) {
         this.getStatistic();
       }
     }
   },

   computed: {

     getStatsUsers() {
       if (this.$user.is_staff) {
         var usersList = this.$store.state.main.users.slice();
         return usersList.map(u => {return {label: u.full_name, value: u.id} });
       } else {
         return [this.$user].map(u => {return {label: u.full_name, value: u.id} });
       }
     }
   }
}
</script>
