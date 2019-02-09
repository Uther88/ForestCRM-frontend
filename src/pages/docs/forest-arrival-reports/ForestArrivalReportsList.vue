<template>
	<div>
		<div class="row justify-between group">
			<div class="col-auto group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'ForestArrivalReportsNew'})"
		            glossy
		            label="Создать"
		          />
		          <searching-panel :options="options" :search="getReports" />
			</div>
    	</div>
    	<q-table 
    		:data="reports"
    		:columns="columns"
    		:pagination="{rowsPerPage: 0}"
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'ForestArrivalReportPrint', params: {id: props.row.id}})"></q-btn>
     	 		<q-btn icon="edit" dense flat color="primary" @click.native="viewReport(props.row)" />
   			</q-td>
    	</q-table>
    		<q-modal ref="reportViewModal" @hide="viewedReport = null" content-css="max-height:100%;" content-classes="flex col-5 flex-center">
    			<q-toolbar color="indigo" glossy class="self-start">
    				<q-toolbar-title>Акт приемки лесопродукции</q-toolbar-title>
    				<q-btn flat v-close-overlay icon="close" />
    			</q-toolbar>
    			<div class="row q-pa-xs">
	    			<template v-if="viewedReport">
	    				<table border="1" cellspacing="0" cellpadding="5" class="full-width text-center">
	    					<caption class="text-primary text-bold">Информация</caption>
	    					<tr>
	    						<td>Участок</td>
	    						<td>{{ viewedReport.station.name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Дата</td>
	    						<td>{{ new Date(viewedReport.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}</td>
	    					</tr>
	    					<tr>
	    						<td>Составил</td>
	    						<td>{{ viewedReport.author.full_name }}</td>
	    					</tr>
	    				</table>
	    				<table border="1" cellspacing="0" class="full-width text-center">
	    					<caption class="text-primary text-bold">Материалы</caption>
	    					<thead>
	    						<tr>
	    							<th>Наименование</th>
	    							<th>Количество</th>
	    						</tr>
	    					</thead>
	    					<tr v-for="posting in viewedReport.postings">
	    						<td>{{ posting.material.name }}</td>
	    						<td>{{ posting.quantity }}</td>
	    					</tr>
	    				</table>
	    			</template>
    			</div>
    			<q-toolbar class="justify-around self-end" color="indigo">
    				<q-btn icon="print" color="positive" label="Печать" v-close-overlay glossy
    				@click.native="$router.push({name: 'ForestArrivalReportPrint', params: {id: viewedReport.id}})" />
    				<q-btn icon="close" color="negative" label="Закрыть" v-close-overlay glossy />
    			</q-toolbar>
    		</q-modal>
	</div>
</template>
<script>
	import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'MaterialReportListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				reports: [],
				viewedReport: null,
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id' },
					{ name: 'number', label: 'Номер', align: 'center', field: 'id' },
					{ name: 'author', label: 'Составитель', align: 'center', field: report => report.author.full_name },
					{ name: 'station', label: 'Участок', align: 'center', field: report => report.station.name },
					{
						name: 'date', 
						label: 'Период', 
						align: 'center', 
						field: report => new Date(report.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'})
					},
				],
				options: [
					{name: 'station', type: 'station'},
					{name: 'date__month', type: 'month'},
				]
			}
		},
		methods: {
			// HTTP-GET forest arrival reports
			getReports(params) {
				this.$axios.get('/api/v1/forest-arrival-reports/', { params })
				.then(response => {
					this.reports = response.data.reports;
				})
				.catch(e => {
					this.$handleError(e);
				})
			},
			viewReport(report) {
				this.viewedReport = report;
				this.$refs['reportViewModal'].show();
			},
		}
	}
</script>