<template>
	<q-layout id="recycling-list">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="reply" round color="primary" @click.native="$router.push({name: 'RecyclingList'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page text-center" v-if="list">
			<div class="text-bold">Ведомость переработки № <span class="bb q-px-sm">{{ list.id }}</span></div>
			<div class="text-bold q-my-sm">за
				<span class="bb q-px-sm">{{ new Date(list.date).toLocaleDateString('RU', {month: 'long'}) }}</span>&nbsp;
				<span class="bb q-px-sm">{{ new Date(list.date).getFullYear() }}</span>г.
			</div>
			<div class="text-bold">по <span class="bb q-px-sm">{{ list.station.name }}</span></div>
			<div class="row q-mt-xl">
				<table class="col-6" border="1" cellspacing="0" cellpadding="5">
					<thead>
						<tr>
							<th colspan="4">ПРИХОД</th>
						</tr>
						<tr>
							<th>Наименование изготовленного<br/> изделия</th>
							<th>Ед.изм.</th>
							<th>Кол-во</th>
							<th>Сумма</th>
						</tr>
					</thead>
					<tbody>
						<template v-for="outfit in list.outfits">
							<tr v-for="posting in outfit.postings" :key="posting.id">
								<td>{{ posting.material.name }}</td>
								<td>{{ posting.material.units_full }}</td>
								<td>{{ posting.quantity }}</td>
								<td></td>
							</tr>
						</template>
						<template v-if="list.outfits.map(of => of.postings.length)[0] < 10">
							<tr v-for="i in (10 - list.outfits.map(of => of.postings.length)[0])">
								<td v-for="i in 4">&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot>
						<tr class="text-bold">
							<td>Итого</td>
							<td></td>
							<td>
								{{
									list.outfits.map(of => of.postings.map(p => p.quantity)
									.reduce((a,b) => parseFloat(a) + parseFloat(b), 0))[0]
	    						}}
							</td>
							<td></td>
						</tr>
					</tfoot>
				</table>
				<table class="col-6" border="1" cellspacing="0" cellpadding="5">
					<thead>
						<tr>
							<th colspan="4">РАСХОД</th>
						</tr>
						<tr>
							<th>Наименование израсходованного<br/>материала</th>
							<th>Ед.изм.</th>
							<th>Кол-во</th>
							<th>Сумма</th>
						</tr>
					</thead>
					<tbody>
						<template v-for="outfit in list.outfits">
							<tr v-for="expense in outfit.expenses" :key="expense.id">
								<td>{{ expense.material.name }}</td>
								<td>{{ expense.material.units_full }}</td>
								<td>{{ expense.quantity_fact }}</td>
								<td></td>
							</tr>
						</template>
						<template v-if="list.outfits.map(of => of.expenses.length)[0] < 10">
							<tr v-for="i in (10 - list.outfits.map(of => of.expenses.length)[0])">
								<td v-for="i in 4">&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot>
						<tr class="text-bold">
							<td></td>
							<td></td>
							<td>
								{{
									list.outfits.map(of => of.expenses.map(e => e.quantity_fact)
									.reduce((a,b) => parseFloat(a) + parseFloat(b), 0))[0]
	    						}}
							</td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row justify-between group q-mt-xl">
				<div class="col-3">
					<span class="bb full-width relative-position block">
						{{ list.author.position }}
						<span class="under-text">(должность составителя)</span>
					</span>
				</div>
				<div class="col-2">
					<span class="bb full-width relative-position block">&nbsp;
						<span class="under-text">(подпись)</span>
					</span>
				</div>
				<div class="col-2">
					<span class="bb full-width relative-position block">
						{{ list.author.full_name}}
						<span class="under-text">(Ф.И.О.)</span>
					</span>
				</div>
			</div>
		</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'RecyclingListPrintPage',
		props: { id: {required: true} },
		data() {
			return {
				list: null,
			}
		},
		methods: {
			// HTTP-GET recycling list
			getRecyclingList() {
				this.$axios.get('/api/v1/recycling-lists/' + this.id + '/')
				.then(response => {
					this.list = response.data;
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
				this.getRecyclingList();
			}
		},
	}
</script>

<style>
body #recycling-list{
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