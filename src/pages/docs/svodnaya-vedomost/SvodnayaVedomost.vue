<template>
	<div>
		<div class="row justify-between group">
			<div class="col-auto group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'SvodnayaVedomostNew'})"
		            glossy
		            label="Создать"
		          />
		          <searching-panel :options="options" :search="getSvodnayaVedomost" />
			</div>
    	</div>
    	<q-table 
    		:data="vedomosti"
    		:columns="columns"
    		:pagination="pagination"
    		:loading="loading"
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'SvodnayaVedomostPrint', params: {id: props.row.id}})"></q-btn>
   			</q-td>
    	</q-table>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'
	export default {
		name: 'SvodnayaVedomostPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				loading: false,
				vedomosti: [],
				pagination: { rowsPerPage: 0 },
				// Search options
				options: [
		          {name: 'number', type: 'id'},
		          {name: 'date__month', type: 'month'},
		          {name: 'station', type: 'station'},
		          {name: 'departament', type: 'departament'}
		        ],
		        // Columns for table
				columns: [
					{name: 'options', label: 'Опции', field: 'id', align: 'center'},
					{name: 'number', label: 'Номер', field: 'id', align: 'center'},
					{name: 'date', label: 'Дата', field: sv => new Date(sv.date).toLocaleDateString(), align: 'center'},
					{name: 'prep_date', label: 'Дата создания', field: sv => new Date(sv.created_date).toLocaleDateString(), align: 'center'},
					{name: 'station', label: 'Участок', field: sv => sv.station.name, align: 'center'},
					{name: 'departament', label: 'Отдел', field: 'departament_full', align: 'center'},
				]
			}
		},
		methods: {
			// HTTP-GET svodnie vedomosti
			getSvodnayaVedomost(params) {
				this.loading = true;
				this.$axios.get('/api/v1/svodnie_vedomosti/', { params })
				.then(response => {
					this.vedomosti = response.data.svodnie_vedomosti;
				}).catch(e => {
					this.$handleError(e);
				}).finally(() => {
					this.loading = false;
				})
			}
		}
	}
</script>