<template>
	<div>
		<q-toolbar glossy color="indigo">
			<q-toolbar-title class="group">
				<q-btn icon="add" color="positive" glossy label="Создать" 
				@click.native="$router.push({name: 'WorkTimeTableNew'})" />
				<searching-panel :search="getDocuments" :options="options" />
			</q-toolbar-title>
		</q-toolbar>
		<q-table
			:data="tables"
			:columns="columns"
			:loading="loading"
			no-data-label="Документов нет"
			no-results-label="По вашему запросу документов не найдено"
			row-key="id"
			:pagination="{rowsPerPage: 0}"
		>
			<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'WorkTimeTablePrint', params: {id: props.row.id}})"></q-btn>
   			</q-td>
		</q-table>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'
	export default {
		name: 'WorkTableListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				loading: false,
				options: [
					{name: 'station', type: 'station'},
					{name: 'departament', type: 'departament'},
					{name: 'date__month', type: 'month'},
				],
				columns: [
					{ name: 'options', label: 'Опции', align: 'center',field: 'id'},
					{ name: 'number', label: 'Номер', align: 'center', field: 'id', sortable: true },
					{ name: 'station', label: 'Участок', align: 'center', field: nv => nv.station.name },
					{ name: 'departament', label: 'Отдел', align: 'center', field: nv => this.$store.state.main.departaments.find(d => d.value == nv.departament).label },
					{ name: 'created_date', label: 'Дата создания', align: 'center', field: nv => new Date(nv.created_date).toLocaleDateString() },
					{ name: 'date', label: 'Период', align: 'center', field: nv => new Date(nv.date).toLocaleDateString('RU',{month: 'long', year: 'numeric'}) },
				],
				tables: []
			}
		},
		methods: {
			getDocuments(attrs) {
				this.loading = true;
				var params = {};
		        this.options.forEach(o => {
		        		params[o.name] = attrs[o.name];
		        })
				this.$axios.get('/api/v1/worktime_tables/', { params })
				.then(response => {
					this.tables = response.data.worktime_tables;
				}).catch(e => {
					this.$handleError(e);
				}).finally(() => {
					this.loading = false;
				})
			}
		}
	}
</script>