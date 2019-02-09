<template>
	<div>
		<div class="row justify-between group bg-indigo glossy">
			<div class="col-auto group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'HandoutNew'})"
		            glossy
		            label="Создать"
		          />
		          <searching-panel :options="options" :search="getHandouts" />
			</div>
    	</div>
    	<q-table 
    		:data="handouts"
    		:columns="columns"
    		:pagination="{ rowsPerPage: 0 }"
    		dense
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'HandoutPrint', params: {id: props.row.id}})"></q-btn>
     	 		<q-btn icon="edit" dense flat color="primary" @click.native="viewHandout(props.row)" />
			</q-td>
   		</q-table>
   		<q-modal ref="handoutViewModal" 
   		@hide="handout = null" 
   		content-css="max-height:100%;"
   		content-classes="flex justify-center col-6"
   		>
    			<q-toolbar color="indigo" class="self-start" glossy >
    				<q-toolbar-title>Раздаточная ведомость</q-toolbar-title>
    				<q-btn flat v-close-overlay icon="close" />
    			</q-toolbar>
    			<template v-if="handout">
    				<div class="q-pa-xs q-table-container flex">
	    				<table border="1" cellspacing="0" cellpadding="2" class="full-width text-center">
	    					<caption class="text-bold text-primary">Информация</caption>
	    					<tr>
	    						<td>Участок</td>
	    						<td>{{ handout.station.name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Автомобиль</td>
	    						<td>{{ handout.car.full_name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Работник</td>
	    						<td>{{ handout.worker.full_name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Дата</td>
	    						<td>{{ new Date(handout.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}</td>
	    					</tr>
	    					<tr>
	    						<td>Составил</td>
	    						<td>{{ handout.author.full_name }}</td>
	    					</tr>
	    				</table>
	    				<table border="1" cellspacing="0" cellpadding="2" class="full-width text-center">
	    					<caption class="text-bold text-primary">Путевые листы</caption>
	    					<thead>
	    						<tr>
	    							<th>№</th>
	    							<th>Дата</th>
	    							<th>Тип<br/>топлива</th>
	    							<th>Кол-во<br/>топлива</th>
	    						</tr>
	    					</thead>
	    					<tbody>
	    						
	    						<tr v-for="waybill in handout.waybills" :key="waybill.id">
	    							<td>{{ waybill.number }}</td>
	    							<td>
	    								{{ new Date(waybill.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}
	    							</td>
	    							<td>{{ waybill.fuel }}</td>
	    							<td>{{ waybill.fuel_issued }}</td>
	    						</tr>
	    						
	    					</tbody>
	    					<tfoot>
	    						<tr class="text-bold">
	    							<td colspan="3">Итого</td>
	    							<td>
	    								{{ handout.waybills.map(wb => wb.fuel_issued)
	    								.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}
	    							</td>
	    						</tr>
	    					</tfoot>
	    				</table>
	    			</div>
    			</template>
    			<q-toolbar class="justify-around self-end" color="indigo">
    				<q-btn icon="print" color="positive" label="Печать" v-close-overlay glossy
    				@click.native="$router.push({name: 'HandoutPrint', params: {id: handout.id}})" />
    				<q-btn icon="close" color="negative" label="Закрыть" v-close-overlay glossy />
    			</q-toolbar>
    		</q-modal>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'HandoutListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				handout: null,
				handouts: [],
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id' },
					{ name: 'number', label: 'Номер', align: 'center', field: 'id' },
					{ name: 'author', label: 'Составил', align: 'center', field: ho => ho.author.full_name },
					{ name: 'station', label: 'Участок', align: 'center', field: ho => ho.station.name },
					{ name: 'car', label: 'Автомобиль', align: 'center', field: ho => ho.car.full_name },
					{ name: 'worker', label: 'Работник', align: 'center', field: ho => ho.worker.full_name },
					{
						name: 'date', 
						label: 'Период', 
						align: 'center', 
						field: ho => new Date(ho.date).toLocaleDateString('RU', { month: 'long', year: 'numeric' })
					},
				],
				options: [
					{ name: 'station', type: 'station' },
					{ name: 'date__month', type: 'month' },
					{ name: 'worker', type: 'worker' },
					{ name: 'car', type: 'car' }
				]
			}
		},
		methods: {
			getHandouts(params) {
				this.$axios.get('/api/v1/handouts/', { params })
				.then(response => {
					this.handouts = response.data.handouts;
				})
				.catch(e => {
					this.$handleError(e);
				})
			},
			viewHandout(handout) {
				this.handout = handout;
				this.$refs['handoutViewModal'].show();
		},
		},
	}
</script>