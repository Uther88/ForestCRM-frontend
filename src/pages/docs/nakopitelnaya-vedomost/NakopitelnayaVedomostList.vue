<template>
	<div>
		<q-toolbar glossy color="indigo">
			<q-toolbar-title class="group">
				<q-btn icon="add" color="positive" glossy label="Создать" 
				@click.native="$router.push({name: 'NakopitelnayaVedomostNew'})" />
				<searching-panel :search="getDocuments" :options="options" />
			</q-toolbar-title>
		</q-toolbar>
		<q-table
			:data="vedomosti"
			:columns="columns"
			no-data-label="Документов нет"
			no-results-label="По вашему запросу ведомостей не найдено"
			row-key="id"
			:pagination="{rowsPerPage: 0}"
		>
			<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'NakopitelnayaVedomostPrint', params: {id: props.row.id}})"></q-btn>
   			</q-td>
		</q-table>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'
	export default {
		name: 'NakopitelnieVedomostiPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				// Search options
				options: [
					{name: 'station', type: 'station'},
					{name: 'departament', type: 'departament'},
					{name: 'date__month', type: 'month'},
					{name: 'event', type: 'event'}
				],
				// Table columns
				columns: [
					{name: 'options', label: 'Опции', align: 'center',field: 'id'},
					{ name: 'number', label: 'Номер', align: 'center', field: 'id', sortable: true },
					{ name: 'station', label: 'Участок', align: 'center', field: nv => nv.station.name },
					{ name: 'departament', label: 'Отдел', align: 'center', field: nv => this.$store.state.main.departaments.find(d => d.value == nv.departament).label },
					{ name: 'event', label: 'Мероприятие', align: 'center', field: nv => nv.event.full_name.slice(0, 100) },
					{ name: 'created_date', label: 'Дата создания', align: 'center', field: nv => new Date(nv.created_date).toLocaleDateString() },
					{ name: 'date', label: 'Период', align: 'center', field: nv => new Date(nv.date).toLocaleDateString('RU',{month: 'long', year: 'numeric'}) },
				],
				vedomosti: [],
			}
		},
		methods: {
			// HTTP-GET nakopitelnie vedomosti
			getDocuments(params) {
				this.$axios.get('/api/v1/nakopitelnie_vedomosti', { params })
				.then(response => {
					this.vedomosti = response.data.nakopitelnie_vedomosti;
				}).catch(e => {
					this.$handleError(e);
				})
			}
		},
	}
</script>