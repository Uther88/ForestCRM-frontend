<template>
	<div>
		<div class="row justify-between group bg-indigo glossy">
			<div class="col-auto group">
				<q-btn
          icon="add"
          color="positive"
          type="button"
          @click.native="$router.push({name: 'FuelDistributionNew'})"
          glossy
          label="Создать"
        />
        <searching-panel :options="options" :search="getFuelDistributions" />
			</div>
    	</div>
    	<q-table 
    		:data="fuel_distributions"
    		:columns="columns"
    		:pagination="{ rowsPerPage: 0 }"
    		dense
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<router-link target="_blank" :to="'/print/fuel-distribution/' + props.row.id" >
     	 			<q-btn icon="print" dense flat color="primary" />
     	 		</router-link>
     	 		<q-btn icon="edit" dense flat color="primary" @click.native="viewFuelDistribution(props.row)" />
			</q-td>
   		</q-table>
   		<q-modal ref="fuelDistributionViewModal" 
   		@hide="fuel_distribution = null" 
   		content-css="max-height:100%;"
   		content-classes="flex justify-center col-6"
   		>
    			<q-toolbar color="indigo" class="self-start" glossy >
    				<q-toolbar-title>Распределение ГСМ</q-toolbar-title>
    				<q-btn flat v-close-overlay icon="close" />
    			</q-toolbar>
    			<template v-if="fuel_distribution">
    				<div class="q-pa-xs flex">
	    				<table border="1" style="border-color: lightgrey"  cellspacing="0" cellpadding="2" class="full-width text-center">
	    					<caption class="text-bold text-primary">Информация</caption>
	    					<tr>
	    						<td>Участок</td>
	    						<td>{{ fuel_distribution.station.name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Тип</td>
	    						<td>{{ fuel_distribution.kind_full }}</td>
	    					</tr>
	    					<tr v-if="fuel_distribution.car">
	    						<td>Автомобиль</td>
	    						<td>{{ fuel_distribution.car.full_name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Работник</td>
	    						<td>{{ fuel_distribution.worker.full_name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Дата</td>
	    						<td>{{ new Date(fuel_distribution.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}</td>
	    					</tr>
	    					<tr>
	    						<td>Составил</td>
	    						<td>{{ fuel_distribution.author.full_name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Всего ГСМ</td>
	    						<td>{{ fuel_distribution.total_fuel }}</td>
	    					</tr>
	    				</table>
	    				<template v-if="fuel_distribution.kind == 'WB'">
		    				<table border="1" style="border-color: lightgrey"  cellspacing="0" cellpadding="2" class="full-width text-center">
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
		    						<tr v-for="waybill in fuel_distribution.waybills" :key="waybill.id">
		    							<td>{{ waybill.number }}</td>
		    							<td>
		    								{{ new Date(waybill.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}
		    							</td>
		    							<td>{{ waybill.fuel }}</td>
		    							<td>{{ waybill.total_fuel }}</td>
		    						</tr>
		    					</tbody>
		    					<tfoot>
		    						<tr class="text-bold">
		    							<td colspan="3">Итого</td>
		    							<td>
		    								{{ fuel_distribution.waybills.map(wb => wb.total_fuel)
		    								.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}
		    							</td>
		    						</tr>
		    					</tfoot>
		    				</table>
	    				</template>
	    				<template v-if="fuel_distribution.kind == 'TR'">
	    					<table border="1" style="border-color: lightgrey" cellspacing="0" cellpadding="2" class="full-width text-center">
	    						<caption class="text-bold text-primary">Учетные листы тракториста</caption>
	    						<thead>
	    							<tr>
		    							<th>№</th>
		    							<th>Дата</th>
		    							<th>Кол-во<br/>топлива</th>
		    						</tr>
	    						</thead>
	    						<tbody>
	    							<tr v-for="regform in fuel_distribution.regforms" :key="regform.id">
	    								<td>{{ regform.id }}</td>
	    								<td>{{
	    									new Date(regform.date).toLocaleDateString('RU')
	    								}}</td>
	    								<td>{{ regform.total_fuel }}</td>
	    							</tr>
	    						</tbody>
	    						<tfoot>
	    							<tr>
	    								<td colspan="2">Итого</td>
	    								<td>
	    									{{ fuel_distribution.total_fuel }}
	    								</td>
	    							</tr>
	    						</tfoot>
	    					</table>
	    				</template>
	    				<template v-if="fuel_distribution.kind == 'OF'">
	    					<table border="1" cellspacing="0" cellpadding="2" class="full-width text-center">
	    						<caption class="text-bold text-primary">Наряд-акты</caption>
	    						<thead>
	    							<tr>
		    							<th>№</th>
		    							<th>Дата</th>
		    							<th>Кол-во<br/>топлива</th>
		    						</tr>
	    						</thead>
	    						<tbody>
	    							<tr v-for="outfit in fuel_distribution.outfits" :key="outfit.id">
	    								<td>{{ outfit.id }}</td>
	    								<td>{{ new Date(outfit.begin).toLocaleDateString('RU') }}</td>
	    								<td>{{ outfit.total_fuel }}</td>
	    							</tr>
	    						</tbody>
	    						<tfoot>
	    							<tr>
	    								<td colspan="2">Итого</td>
	    								<td>
	    									{{ fuel_distribution.total_fuel }}
	    								</td>
	    							</tr>
	    						</tfoot>
	    					</table>
	    				</template>
	    			</div>
    			</template>
    			<q-toolbar class="justify-around self-end" color="indigo">
    				<q-btn icon="print" color="positive" label="Печать" v-close-overlay glossy
    				@click.native="$router.push({name: 'FuelDistibutionPrint', params: {id: fuel_distribution.id}})" />
    				<q-btn icon="close" color="negative" label="Закрыть" v-close-overlay glossy />
    			</q-toolbar>
    		</q-modal>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'FuelDistibutionListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				fuel_distribution: null,
				fuel_distributions: [],
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id' },
					{ name: 'number', label: 'Номер', align: 'center', field: 'id' },
					{ name: 'author', label: 'Составил', align: 'center', field: fd => fd.author.full_name },
					{ name: 'station', label: 'Участок', align: 'center', field: fd => fd.station.name },
					{ name: 'kind', label: 'Тип', align: 'center', field: 'kind_full'},
					{ name: 'worker', label: 'Работник', align: 'center', field: fd => fd.worker.full_name },
					{
						name: 'date', 
						label: 'Период', 
						align: 'center', 
						field: fd => new Date(fd.date).toLocaleDateString('RU', { month: 'long', year: 'numeric' })
					},
				],
				options: [
					{ name: 'station', type: 'station' },
					{ name: 'date__month', type: 'month' },
					{ name: 'worker', type: 'worker' },
					{ name: 'car', type: 'car' },
					{ name: 'kind', type: 'kind'}
				]
			}
		},
		methods: {
			getFuelDistributions(params) {
				this.$axios.get('/api/v1/fuel-distributions/', { params })
				.then(response => {
					this.fuel_distributions = response.data.fuel_distributions;
				})
				.catch(e => {
					this.$handleError(e);
				})
			},
			viewFuelDistribution(fuel_distribution) {

				this.$axios.get(fuel_distribution.resource_uri)
				.then(response => {
					this.fuel_distribution = response.data;
				})
			},
		},
		watch: {
			'fuel_distribution': function(val) {
				if (val) {
					this.$refs['fuelDistributionViewModal'].show();
				}
			}
		},
	}
</script>
