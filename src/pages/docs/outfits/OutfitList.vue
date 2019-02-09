<template>
  <q-page class="fit">
      <div class="row justify-between group">
        <div class="col-md-auto col-xs-12 text-center group">
          <q-btn
            icon="add"
            color="positive"
            type="button"
            @click.native="$router.push({name: 'OutfitNew'})"
            glossy
            label="Создать"
          />
          <searching-panel :options="options" :search="getDocuments" />
        </div>
      </div>
    <q-table
      table-style="min-height: calc(100vh - 233px);"
      table-class="outfitsTable"
      :data="outfits"
      :columns="columns"
      row-key="id"
      dense
      :loading="loading"
      loading-label="Идет поиск..."
      :pagination="{rowsPerPage: 0}"
      no-data-label="Документов нет"
    >
    <q-td slot="body-cell-options" slot-scope="props" :props="props">
      <q-btn-dropdown icon="menu" dense split color="primary">
        <q-list separator link>
          <q-item @click.native="$router.push({name: 'OutfitPrint', params: {id: props.row.id}})" >
            <q-item-side icon="print" color="primary" />
            <q-item-main label="Печать" />
          </q-item>
          <q-item @click.native="$router.push({name: 'OutfitNew',query: {template: props.row.id}})" >
            <q-item-side icon="fas fa-copy" color="primary" />
            <q-item-main label="Создать на основе" />
          </q-item>
          <q-item @click.native="deleteOutfit(props.row)" v-if="$user.is_staff">
            <q-item-side icon="delete" color="primary" />
            <q-item-main label="Удалить" />
          </q-item>
      </q-list>
    </q-btn-dropdown>
    </q-td>
  </q-table>

  </q-page>
</template>

<script>
import SearchingPanel from 'components/SearchingPanel'

export default {
  name: 'OutfitsList',
  components: {'searching-panel': SearchingPanel},
  data() {
    return {
      loading: false,
      // Outfits array
      outfits: [],
      // Search options
      options: [
          {name: 'station', type: 'station'},
          {name: 'event', type: 'event'},
          {name: 'departament', type: 'departament'},
          {name: 'begin__month', type: 'month'},
        ],
      // Columns for outfits table
      columns: [
        {name: 'options', label: 'Опции', field: 'id', align: 'center'},
        {name: 'number', label: 'Номер', field: 'id', align: 'center'},
        {name: 'begin', label: 'Начало', field: of => new Date(of.begin).toLocaleDateString(), align: 'center'},
        {name: 'end', label: 'Конец', field: of => new Date(of.end).toLocaleDateString(), align: 'center'},
        {name: 'station', label: 'Участок', field: of => of.station.name, align: 'center'},
        {name: 'departament', label: 'Отдел', field: 'departament_full', align: 'center'},
        {name: 'forestry', label: 'Лесничество', field: 'forestry', align: 'center'},
        {name: 'event', label: 'Мероприятие', field: of => of.event.full_name, align: 'center'},
        {name: 'brigadier', label: 'Бригадир', field: of => of.brigadier.full_name, align: 'center'}

      ]
    }
  },
  methods: {
    // HTTP-GET outfits
    getDocuments(attrs) {
        this.loading = true;
        var params = {};
        this.options.forEach(o => {
          params[o.name] = attrs[o.name];
        })
        this.$axios.get('/api/v1/outfit/', { params })
        .then(response => {
          this.outfits = response.data.outfits;
        }).catch(e => {
          this.$handleError(e);
        }).finally(() => {
          this.loading = false;
        })
      },
    deleteOutfit(outfit) {
      this.loading = true;
      this.$axios.delete(outfit.resource_uri)
      .then(response => {
        this.outfits =this.outfits.filter(o => o.id != outfit.id);
      }).catch(e => {
        this.$handleError(e);
      }).finally(() => {
        this.loading = false;
      })
    },
  },
}
</script>

<style>
.outfitsTable tr td {white-space: pre-line;}
.q-popover {max-width: 400px;}
</style>
