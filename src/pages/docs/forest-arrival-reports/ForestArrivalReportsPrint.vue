<template>
	<q-layout id="report">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="reply" round color="primary" @click.native="$router.push({name: 'ForestArrivalReports'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
	<div class="page" id="forest-arrival-report" v-if="report">
		<div class="text-center">
			<p>АКТ ПРИЕМКИ ЛЕСОПРОДУКЦИИ №<span class="bb q-px-md">{{ report.id }}</span></p>
			<p>по
				<span class="text-bold bb q-px-lg">{{ report.station.name }}</span>
				за
				<span class="bb q-px-lg">{{ new Date(report.date).toLocaleDateString('RU', { month: 'long' }) }}</span>&nbsp;
				<span class="bb q-px-lg">{{ new Date(report.date).toLocaleDateString('RU', { year: 'numeric'}) }}</span>года
			</p>
		</div>
		<div>
			МОЛ
			<span class="bb q-px-lg">{{ report.author.full_name }}</span>
		</div>
		<div class="q-mt-lg">
			<table cellspacing="0" border="1" class="full-width report-table text-center">
				<thead>
					<tr class="text-bold">
						<td>Наименование</td>
						<td>порода</td>
						<td>сорт</td>
						<td>№ наряда</td>
						<td>дата наряда</td>
						<td>Количество</td>
						<td>План. стоимость</td>
						<td>Сумма</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="posting in report.postings">
						<td>{{ posting.material.name }}</td>
						<td></td><td></td>
						<td>{{ posting.outfit.id }}</td>
						<td>{{ new Date(posting.outfit.begin).toLocaleDateString('RU') }}</td>
						<td>{{ posting.quantity }}</td>
						<td></td><td></td>
					</tr>
					<template v-if="report.postings.length < 23">
						<tr v-for="i in (23 - report.postings.length)" :key="i">
							<td v-for="i in 8" >&nbsp;</td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
		<div class="q-mt-xl">
			МОЛ
			<span class="bb q-px-xl"></span>&nbsp;
			<span class="bb q-px-lg">{{ report.author.full_name }}</span>
		</div>
	</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'ForestArrivalReportsPrint',
		props: { id: {required: true} },
		data() {
			return {
				report: null,
			}
		},
		methods: {
			getReport() {
				if (this.id) {
					this.$axios.get('/api/v1/forest-arrival-reports/' + this.id + '/')
					.then(response => {
						this.getOutfits(response.data);
					}).catch(e => {
						this.$handleError(e);
					})
				}
			},
			getOutfits(report) {
				report.postings.forEach(posting => {
					this.$axios.get(posting.outfit)
					.then(response => {
						posting.outfit = response.data;
					}).catch(e => {
						this.$handleError(e);
					})
				})
				this.report = report;
			},
			print() {
				window.print();
			},
		},
		mounted() {
			this.getReport();
		},
	}
</script>

<style>
	body #report{
	  background: rgb(204,204,204); 
	  font:  14px Times New Roman, serif;
	}

	#forest-arrival-report .bb {border-bottom: 1px solid black;}
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