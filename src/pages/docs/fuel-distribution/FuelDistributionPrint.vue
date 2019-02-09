<template>
	<q-layout id="fuel-distribution-print">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="reply" round color="primary" @click.native="$router.go(-1)" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page text-center" v-if="fuel_distribution">
			<div class="text-bold">Распределение ГСМ №
				<span class="bb q-px-sm">{{ fuel_distribution.id }}</span><br/><br/>
				по
				<span v-if="fuel_distribution.kind == 'WB' ">путевым листам</span>
				<span v-if="fuel_distribution.kind == 'OF' ">наряд-актам</span>
				<span v-if="fuel_distribution.kind == 'TR' ">учетным листам тракториста-машиниста</span>
				<br/><br/>
			За <span class="bb q-px-md">
				{{ new Date(fuel_distribution.date).toLocaleDateString('RU', { month: 'long'}) }}
				</span>&nbsp;
				<span class="bb q-px-md">{{ new Date(fuel_distribution.date).toLocaleDateString('RU', { year: 'numeric'}) }}</span>года
			</div>
			<div class="text-left q-mt-md">
				Участок
				<span class="bb q-px-md">{{ fuel_distribution.station.name }}</span>
				Работник
				<span class="bb q-px-md">{{ fuel_distribution.worker.full_name }}</span>
				<template v-if="fuel_distribution.car">
					Автомобиль 
					<span class="bb q-px-md">{{ fuel_distribution.car.full_name }}</span>
				</template>
			</div>
			<div class="row q-mt-md">
				<table border="1" cellspacing="0" class="full-width">
					<thead>
						<tr>
							<th rowspan="2">Дата</th>
							<th rowspan="2">№</th>
							<th rowspan="2">Вид работ</th>
							<th rowspan="2">счет</th>
							<th rowspan="2">км</th>
							<th rowspan="2">тн</th>
							<th colspan="3">ГСМ</th>
						</tr>
						<tr>
							<th>Норма, литр</th>
							<th>Факт, литр</th>
							<th>Сумма, руб</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="waybill in fuel_distribution.waybills" :key="waybill.id">
							<td>
								{{ new Date(waybill.date).toLocaleDateString('RU', {day: '2-digit', month: '2-digit'}) }}
							</td>
							<td>{{ waybill.number }}</td>
							<td>{{ waybill.event.full_name }}</td>
							<td></td><td></td><td></td><td></td>
							<td>{{ waybill.total_fuel }}</td>
							<td></td>
						</tr>
						<tr v-for="outfit in fuel_distribution.outfits" :key="outfit.id">
							<td>
								{{ new Date(outfit.begin).toLocaleDateString('RU', {day: '2-digit', month: '2-digit'}) }}
							</td>
							<td>{{ outfit.id }}</td>
							<td>{{ outfit.event.full_name }}</td>
							<td></td><td></td><td></td><td></td>
							<td>{{ outfit.total_fuel }}</td>
							<td></td>
						</tr>
						<tr v-for="regform in fuel_distribution.regforms" :key="regform.id">
							<td>
								{{ new Date(regform.date).toLocaleDateString('RU', {day: '2-digit', month: '2-digit'}) }}
							</td>
							<td>{{ regform.id }}</td>
							<td>{{ regform.event.full_name }}</td>
							<td></td><td></td><td></td><td></td>
							<td>{{ regform.total_fuel }}</td>
							<td></td>
						</tr>
						<tr v-for="r in emptyRows">
							<td v-for="i in 9">&nbsp;</td>
						</tr>
					</tbody>
					<tfoot>
						<tr class="text-bold">
							<td>Итого</td>
							<td></td><td></td><td></td><td></td><td></td><td></td>
							<td>{{ fuel_distribution.total_fuel }}</td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row justify-around group q-mt-xl">
				<div class="col-3">
					<span class="bb full-width relative-position block">
						{{ fuel_distribution.author.position }}
						<span class="under-text">(должность)</span>
					</span>
				</div>
				<div class="col-2">
					<span class="bb full-width relative-position block">
						{{ fuel_distribution.author.full_name }}
						<span class="under-text">(Ф.И.О.)</span>
					</span>
				</div>
				<div class="col-2">
					<span class="bb full-width relative-position block">&nbsp;
						<span class="under-text">(подпись)</span>
					</span>
				</div>
			</div>
		</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'FuelDistributionPrintPage',
		props: { id: {required: true} },
		data() {
			return {
				fuel_distribution: null,
			}
		},
		methods: {
			// HTTP-GET recycling list
			getFuelDistribution() {
				this.$axios.get('/api/v1/fuel-distributions/' + this.id + '/')
				.then(response => {
					this.fuel_distribution = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			print() {
				window.print();
			},
		},
		mounted() {
			if (this.id) {
				this.getFuelDistribution();
			}
		},
		computed: {
			emptyRows() {
				var rows = (
				this.fuel_distribution.waybills.length ||
				this.fuel_distribution.outfits.length || 
				this.fuel_distribution.regforms.length
				);
				if (rows < 18) {
					return 18 - rows;
				} else {
					return 0;
				}
			},
		},
	}
</script>

<style>
body #fuel-distribution-print {
	  background: rgb(204,204,204); 
	  font:  14px Times New Roman, serif;
	}

	.bb {border-bottom: 1px solid black;}
	.under-text { position: absolute;  top: 25px; left:0; width: 100%;}
	.page {
	  background: white;
	  margin: 0 auto;
	  padding: 1cm;
	  margin-bottom: 0.5cm;
	  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  
}
.page {  
 	width: 29.7cm;
  	height: 21cm; 
}

@media print {
	html,body{height:100%;width:100%;margin:0;padding:0;}
   .page {
    margin: 0;
    box-shadow: none;
  }
}
  @page {
  	margin: -1px;
  	size: A4 landscape;
  	
  }
</style>