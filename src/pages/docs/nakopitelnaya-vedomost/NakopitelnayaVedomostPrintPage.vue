<template>
	<q-layout v-if="nv" id="nv">
		<q-page-sticky position="top-left" class='print-hide z-max'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" 
				@click.native="$router.push({name: 'NakopitelnayaVedomost'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page">
			<div class="row justify-end" style="line-height: 1.7">
				Утверждаю<br/>
				{{ nv.station.organization.head.position }}<br/>
				___________ {{ nv.station.organization.head.full_name }}<br/>
				"_____" ___________  20___ г.
			</div>
			<div class="row justify-center">
				Накопительная ведомость по заработной плате за  
				<span class="bb text-bold">&nbsp;{{ new Date(nv.date).toLocaleDateString('ru', {month: 'long'}) }}&nbsp;</span>месяц
				<span class="bb text-bold">&nbsp;{{ new Date(nv.date).toLocaleDateString('ru', {year: 'numeric'}) }}&nbsp;</span>года
			</div>
			<div class="row q-pt-sm">
				<span>Участок: &nbsp;
					<span class="bb q-px-sm">
					{{ nv.station.name }}
					</span> &nbsp;
				</span> &nbsp;
				<span>Отдел: &nbsp;
					<span class="bb q-px-sm">
					{{ nv.departament_full }}
					</span>
				</span>

			</div>
			<div class="row text-left q-pt-xs">
				<span>Вид работ:<span style="text-decoration: underline; white-space: pre">    {{ nv.event.full_name }}</span>
				</span>
			</div>
			<div class="row q-pt-md">
				<table border="1" cellpadding="0" cellspacing="0" class="calcs-table full-width" style="page-break-inside: avoid;">
					<thead align="center">
					<tr>
						<th rowspan="2" width="4%">№ п/п</th>
						<th rowspan="2">Ф.И.О.</th>
						<th rowspan="2" width="3%">№<br/>наряда</th>
						<th rowspan="2" width="5%"><div class="rotated">Чел-дни<br/>машино-смен</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Сложность<br/>(условия труда)<br/>%</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Ответств.<br/>работы<br/>%</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Премия<br/>%</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Коэффициент</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Классность %</div></th>
						<th colspan="10">Оплата</th>
					</tr>
					<tr>
						<th width="5%"><div class="rotated">Начислено</div></th>
						<th width="5%"><div class="rotated">Сложность<br/>(усл. труда)</div></th>
						<th width="5%"><div class="rotated">Ответств.<br/>работы</div></th>
						<th width="5%"><div class="rotated">Переработка<br/>в 1,5 раза</div></th>
						<th width="5%"><div class="rotated">Переработка<br/>в 2 раза</div></th>
						<th width="5%"><div class="rotated">Выходные</div></th>
						<th width="5%"><div class="rotated">Премия</div></th>
						<th width="5%"><div class="rotated">Коэффициент</div></th>
						<th width="5%"><div class="rotated">Классность</div></th>
						<th width="5%"><div class="rotated">Всего</div></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(rf, index) in nv.regforms">
						<td>{{index + 1}}</td>
						<td>{{ rf.driver.full_name }}</td>
						<td>{{ rf.id }}</td>
						<td>{{ rf.total_hours }}</td>
						<td>{{ rf.complexity }}</td>
						<td>{{ rf.importance }}</td>
						<td>{{ rf.bonus }}</td>
						<td>{{ rf.coefficient }}</td>
						<td>{{ rf.classines }}</td>
						<td>{{ rf.amount }}</td>
						<td>{{ rf.amount_complexity }}</td>
						<td>{{ rf.amount_importance }}</td>
						<td>{{ rf.recast_half }}</td>
						<td>{{ rf.recast_double }}</td>
						<td>{{ rf.holydays }}</td>
						<td>{{ rf.amount_bonus }}</td>
						<td>{{ rf.amount_coefficient }}</td>
						<td>{{ rf.amount_classines }}</td>
						<td>{{ rf.amount_total }}</td>
					</tr>
					<template v-for="(of, ix) in nv.outfits">
						<tr v-for="(tab, index) in of.tables">
						<td>{{ nv.regforms.length + ix + 1 }}</td>
						<td>{{ tab.worker.full_name }}</td>
						<td>{{ of.id }}</td>
						<td>{{ tab.hours }}</td>
						<td>{{ parseFloat(of.conditions) || null }}</td>
						<td>{{ parseFloat(of.importance) || null }}</td>
						<td>{{ parseFloat(of.bonus) || null }}</td>
						<td>{{ parseFloat(of.coefficient) || null }}</td>
						<td>{{ parseFloat(of.classines) || null }}</td>
						<td>{{ tab.tariff_rate }}</td>
						<td>{{ tab.by_conditions }}</td>
						<td>{{ tab.importance }}</td>
						<td>{{ tab.recast_half }}</td>
						<td>{{ tab.recast_double }}</td>
						<td>{{ tab.holydays }}</td>
						<td>{{ tab.bonus }}</td>
						<td>{{ tab.by_coefficient }}</td>
						<td>{{ tab.amount_classines }}</td>
						<td>{{ tab.total }}</td>
					</tr>
					<template v-if="nv.calcs < 23" >
						<tr v-for="i in (23 - nv.calcs)">
							<td v-for="i in 19">&nbsp;</td>
						</tr>
					</template>
				</template>
				</tbody>
				<tfoot>
					<tr>
						<th>{{ nv.calcs }}</th>
						<th>ИТОГО:</th><th></th>
						<th>{{ nv.man_days }}</th>
						<th></th><th></th><th></th><th></th><th></th>
						<th>{{ nv.amount }}</th>
						<th>{{ nv.complexity > 0 ? nv.complexity : null }}</th>
						<th>{{ nv.importance> 0 ? nv.importance : null }}</th>
						<th>{{ nv.recast_half > 0 ? nv.recast_half : null }}</th>
						<th>{{ nv.recast_double> 0 ? nv.recast_double : null }}</th>
						<th>{{ nv.holydays > 0 ? nv.holydays : null }}</th>
						<th>{{ nv.bonus> 0 ? nv.bonus : null }}</th>
						<th>{{ nv.coefficient > 0 ? nv.coefficient : null }}</th>
						<th>{{ nv.classines > 0 ? nv.classines : null }}</th>
						<th>{{ nv.amount_total }}</th>
					</tr>
				</tfoot>
				</table>
			</div>
			<div class="row q-pt-md">
			 	<span>Составил:
			 		<span class="bb q-mx-sm q-px-md relative-position">
			 			{{ nv.author.position }}<span class="sig">(должность)</span>
			 		</span>
			 		<span class="bb q-px-lg q-mx-sm relative-position">
			 			&nbsp;&nbsp;&nbsp;&nbsp;
			 			<span class="sig">(подпись)</span>
			 		</span>
			 		<span class="bb q-mx-sm relative-position" style="width: 150px; display: inline-block;">
			 			{{nv.author.full_name}}
			 			<span class="sig">(расшифровка подписи)</span>
			 		</span>
			 	</span>
			 </div>
		</div>
	</q-layout>
</template>
<script>
	export default {
		name: 'NakopitelnayaVedomostPrintPage',
		props: {id: {required: true}},
		data() {
			return {
				nv: null,
			}
		},
		methods: {
			// HTTP-GET nakopitelnaya vedomost
			getDocument() {
				this.$axios.get('/api/v1/nakopitelnie_vedomosti/' + this.id + '/')
				.then(response => {
					this.nv = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// Print document
			print() {
				window.print();
			},
		},
		mounted() {
			this.getDocument();
		},
	}
</script>
<style>
	#nv { background: rgb(204,204,204); 
	font:  12px Times New Roman, serif;
 }
 	#nv .calcs-table th {text-align: center; vertical-align: middle;}

.page {  
  width: 29.7cm; 
  min-height: 19cm; 
  overflow: hidden;
  text-align: center;
  background: white;
  margin: 0 auto;
  padding: 1cm;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}

@media print {
	html, body{height:100%;width:100%;margin:0;padding:0;}
   .page {
    box-shadow: none;
    padding: 0;
  }
}
  @page {
  	size: A4 landscape;
  	
  	margin: 1.2cm;
  }
  .bb { border-bottom: 1px solid; }
  .rotated {  	
  	-webkit-writing-mode: vertical-rl ;
 	 writing-mode: vertical-rl;
  	 min-height: 85px;
  	 margin: auto;
  	 white-space: nowrap;}
.sig {position: absolute; left: 0; width: 100%; font-size: 9px; top: 15px;}
</style>