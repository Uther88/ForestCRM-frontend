<template>
  <div>
    <div class="row justify-between q-pa-xs">
        <div class="col-auto group ">
          <q-btn
            icon="add"
            color="positive"
            label="Создать"
            glossy
            type="button"
            @click.native="$router.push({name: 'WaybillNew'})"
          />
          <searching-panel ref="search" :options="options" :search="getDocuments" />
        </div>
    </div>
    <q-table
      :data="waybills"
      :columns="columns"
      :loading="loading"
      row-key="name"
      :pagination="pagination"
      hide-bottom dense separator="cell"
    >
    <q-td slot="body-cell-options" slot-scope="props" :props="props">
      <q-btn icon="arrow_drop_down" glossy dense color="primary" >
        <q-popover>
        <q-list link separator>
          <q-item @click.native="$router.push({name: 'WaybillEdit', params: {id:props.row.id}})">
            <q-item-side :icon="props.row.is_completed ? 'zoom_in' : 'edit'" color="primary" />
            <q-item-main :label="props.row.is_completed ? 'Просмотр' : 'Редактировать'" />
          </q-item>

          <q-item v-if="props.row.is_completed" @click.native="print(props.row)">
            <q-item-side icon="print" color="primary" />
            <q-item-main label="Печать" />
          </q-item>
          <q-item v-if="$user.is_staff" @click.native="deleteWaybill(props.row)">
            <q-item-side icon="delete" color="negative" />
            <q-item-main label="Удалить" />
          </q-item>
        </q-list>
        </q-popover>
      </q-btn>
    </q-td>
    <q-td slot="body-cell-is_completed" slot-scope="props" :props="props">
      <q-icon v-if="props.row.is_completed" name="check_circle" color="positive" size="25px" />
      <q-spinner-hourglass v-else name="hour_glass" color="warning" size="25px" title="Не завершено" />
    </q-td>
  </q-table>
</div>
</template>

<style>
</style>

<script>
import SearchingPanel from 'components/SearchingPanel'

export default {
  name: 'WaybillsPage',
  components: {'searching-panel': SearchingPanel},
  data() {
    return {
      options: [
          {name: 'station', type: 'station'},
          {name: 'car', type: 'car'},
          {name: 'departament', type: 'departament'},
          {name: 'date__month', type: 'month'},
        ],
      loading: false,
      pagination: {
        rowsPerPage: 50,
      },
      waybills: [],
      columns: [
        {name: 'options', label: 'Опции', field: 'id'},
        {name: 'number', label: 'Номер', field: 'number', align: 'center'},
        {name: 'is_completed', label: 'Статус', field: 'is_completed', align: 'center'},
        {name: 'station', label: 'Участок', field: waybill => waybill.station.name, align: 'center'},
        {name: 'departament', label: 'Отдел', field: 'departament_full', align: 'center'},
        {name: 'date', label: 'Дата', field: (wb) => new Date(wb.date).toLocaleDateString(), align: 'center'},
        {name: 'type_of', label: 'Тип', field: 'type_display', align: 'center'},
        {name: 'car', label: 'Автомобиль', field: waybill => waybill.car.name + '/' + waybill.car.number, align: 'center'},
        {name: 'driver', label: 'Водитель', field: waybill => waybill.driver.full_name, align: 'center'},
      ]
    }
  },
  methods: {
    // Print waybill
    print(waybill) {
      if (waybill.is_completed) {
        if (waybill.type_of == 'L') {
          this.$router.push({name: 'Waybill-lPrint', params: {id: waybill.id} });
        } else {
          this.$router.push({name: 'Waybill-hPrint', params: {id: waybill.id} });
        }
      }
    },
    deleteWaybill(waybill) {
    	this.$q.dialog({
    		message: 'Удалить путевой лист?',
    		ok: 'Удалить',
    		cancel: 'Отмена',
    	}).then(() => {
    		this.$axios.delete(waybill.resource_uri)
    		.then(response => {
    			this.waybills = this.waybills.filter(wb => wb.id !== waybill.id);
    		}).catch(e => {
    			this.$handleError(e);
    		})
    	}).catch(() => {})
    },
    // HTTP-GET waybills
    getDocuments(params) {
        this.loading = true;
        this.$axios.get('/api/v1/waybill/', { params })
        .then(response => {
          this.waybills = response.data.waybills;
        }).catch(e => {
          this.$handleError(e);
        }).finally(() => {
          this.loading = false;
        })
      },
  },
}
</script>
