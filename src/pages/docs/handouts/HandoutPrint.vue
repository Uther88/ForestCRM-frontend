<template>
	<q-layout id="handout">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="reply" round color="primary" @click.native="$router.go(-1)" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page text-center" v-if="handout">
			<div class="text-bold">Раздаточная ведомость №
				<span class="bb q-px-sm">{{ handout.id }}</span>

			</div>
			<div class="text-left q-mt-xl">
				Участок
				<span class="bb q-px-md">{{ handout.station.name }}</span>
				Автомобиль 
				<span class="bb q-px-md">{{ handout.car.full_name }}</span>
				Дата <span class="bb q-px-md">
				{{ new Date(handout.date).toLocaleDateString('RU', { month: 'long', year: 'numeric'}) }}
				</span>
			</div>
			<div class="row q-mt-md">
				<table border="1" cellspacing="0" class="full-width">
					<thead>
						<tr>
							<td rowspan="2">Дата</td>
							<td rowspan="2">№ путевого<br/>листа</td>
							<td rowspan="2">Ф.И.О. шофера</td>
							<td colspan="4">Заправлено в автомобиль (в литрах)</td>
							<td rowspan="2">Роспись в получении</td>
						</tr>
						<tr>
							<td>Бензин</td>
							<td>ДТ</td>
							<td>Масло</td>
							<td>Солидол</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="waybill in handout.waybills" :key="waybill.id">
							<td>
								{{ new Date(waybill.date).toLocaleDateString('RU', { day: '2-digit', month: '2-digit' }) }}
							</td>
							<td>{{ waybill.number }}</td>
							<td>{{ waybill.driver.full_name }}</td>
							<template v-if="waybill.fuel != 'ДТ'">
								<td>{{ waybill.fuel_issued }}</td>
								<td></td>
							</template>
							<template v-else>
								<td></td>
								<td>{{ waybill.fuel_issued }}</td>
							</template>
							<td></td><td></td><td></td>
						</tr>
						<template v-if="handout.waybills.length < 21">
							<tr v-for="i in 20">
								<td v-for="i in 8">&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot>
						<tr class="text-bold">
							<td>Итого</td><td></td><td></td>
							<template v-if="handout.car.fuel.mark != 'ДТ'">
								<td>
									{{ 
										handout.waybills.map(wb => wb.fuel_issued)
										.reduce((a,b) => parseFloat(a) + parseFloat(b),0) 
									}}
								</td>
								<td></td>
							</template>
							<template v-else>
								<td></td>
								<td>{{ 
										handout.waybills.map(wb => wb.fuel_issued)
										.reduce((a,b) => parseFloat(a) + parseFloat(b),0) 
									}}
								</td>
							</template>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row justify-around group q-mt-xl">
				<div class="col-2">
					<span class="bb full-width relative-position block">
						{{ handout.author.full_name }}
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
		name: 'HandoutPrintPage',
		props: { id: {required: true} },
		data() {
			return {
				handout: null,
			}
		},
		methods: {
			// HTTP-GET recycling list
			getHandout() {
				this.$axios.get('/api/v1/handouts/' + this.id + '/')
				.then(response => {
					this.handout = response.data;
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
				this.getHandout();
			}
		},
	}
</script>

<style>
body #handout{
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