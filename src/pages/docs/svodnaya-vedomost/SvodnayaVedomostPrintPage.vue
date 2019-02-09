<template>
	<q-layout v-if="sv" id="sv">
		<q-page-sticky position="top-left" class='print-hide z-max'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" 
				@click.native="$router.push({name: 'SvodnayaVedomost'})" 
				/>
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page">
			<div class="row justify-end" style="line-height: 1.7">
				Утверждаю<br/>
				{{ sv.station.organization.head.position }}<br/>
				___________ {{ sv.station.organization.head.full_name }}<br/>
				"_____" ___________  20___ г.
			</div>
			<div class="row justify-center">
				Сводная ведомость по начислению зароботной платы водителям за 
				<span class="bb text-bold">&nbsp;{{ new Date(sv.date).toLocaleDateString('ru', {month: 'long'}) }}&nbsp;</span>месяц
				<span class="bb text-bold">&nbsp;{{ new Date(sv.date).toLocaleDateString('ru', {year: 'numeric'}) }}&nbsp;</span>года
			</div>
			<div class="row q-pt-sm">
				<span>Участок: &nbsp;
					<span class="bb q-px-sm">
					{{ sv.station.name }}
					</span> &nbsp;
				</span> &nbsp;
				<span>Отдел: &nbsp;
					<span class="bb q-px-sm">
					{{ sv.departament_full }}
					</span>
				</span>

			</div>
			<div class="row text-left q-pt-xs">
				<span>Вид работ: &nbsp;<span v-if="sv.event" style="text-decoration: underline;">&nbsp;
				{{ sv.event.full_name }}</span>
				<span v-else class="bb" style="width: 150px; display: inline-block;"></span>
				</span>
			</div>
			<table id="calcs_table" class="full-width q-mt-sm" border="1" cellspacing="0" cellpadding="0">
				<thead align="center">
					<tr>
						<th rowspan="2">Ф.И.О.</th>
						<th rowspan="2" width="10%">Дата</th>
						<th rowspan="2" width="3%">№ пут. л.</th>
						<th rowspan="2" width="4%">часы</th>
						<th rowspan="2" width="5%"><div class="rotated">Ставка</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Классность</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Коэффициент</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Премия</div></th>
						<th colspan="8">Оплата</th>
					</tr>
					<tr>
						<th class="rotated" width="5%"><div class="rotated">Основная<br/> зарплата</div></th>
						<th class="rotated" width="5%"><div class="rotated">Переработка<br/> в 1,5 раз</div></th>
						<th class="rotated" width="5%"><div class="rotated">Переработка<br/> в 2 раза</div></th>
						<th class="rotated" width="5%"><div class="rotated">Праздничные</div></th>
						<th class="rotated" width="5%"><div class="rotated">Классность</div></th>
						<th class="rotated" width="5%"><div class="rotated">Премия</div></th>
						<th class="rotated" width="5%"><div class="rotated">Коэффициент</div></th>
						<th class="rotated" width="5%"><div class="rotated">Итого</div></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="calc in sv.calcs.slice(0, 21)">
						<td>{{ calc.waybill.driver.full_name }}</td>
						<td>{{ new Date(calc.waybill.date).toLocaleDateString() }}</td>
						<td>{{ calc.waybill.id }}</td>
						<td>{{ calc.waybill.total_hours }}</td>
						<td>{{ calc.rate }}</td>
						<td>{{ calc.classines }}</td>
						<td>{{ calc.coefficient }}</td>
						<td>{{ calc.bonus }}</td>
						<td>{{ calc.amount }}</td>
						<td>{{ calc.recast_half }}</td>
						<td>{{ calc.recast_double }}</td>
						<td>{{ calc.amount_holydays }}</td>
						<td>{{ calc.amount_classines }}</td>
						<td>{{ calc.amount_bonus }}</td>
						<td>{{ calc.amount_coefficient }}</td>
						<td>{{ calc.amount_total }}</td>
					</tr>
					<template v-if="sv.calcs.length < 21">
						<tr v-for="i in (20 - sv.calcs.length)">
							<td v-for="i in 16">&nbsp;</td>
						</tr>
					</template>
				</tbody>
				<tfoot v-if="sv.calcs.length < 21">
					<tr class="text-bold">
						<td>ИТОГО:</td><td></td><td></td>
						<td>{{ parseFloat(sv.hours) }}</td>
						<td></td><td></td><td></td><td></td>
						<td>{{ sv.amount }}</td>
						<td>{{ sv.recast_half > 0 ? sv.recast_half : '' }}</td>
						<td>{{ sv.recast_double  > 0 ? sv.recast_double : '' }}</td>
						<td>{{ sv.holydays > 0 ? sv.holydays : '' }}</td>
						<td>{{ sv.classines > 0 ? sv.classines : '' }}</td>
						<td>{{ sv.bonus > 0 ? sv.bonus : '' }}</td>
						<td>{{ sv.coefficient > 0 ? sv.coefficient : '' }}</td>
						<td>{{ sv.amount_total }}</td>
					</tr>
				</tfoot>
			</table>
			 <div class="row q-pt-md" v-if="sv.calcs.length < 21">
			 	<span>Составил:
			 		<span class="bb q-mx-sm q-px-md relative-position">
			 			{{ sv.author.position }}<span class="sig">(должность)</span>
			 		</span>
			 		<span class="bb q-px-lg q-mx-sm relative-position">
			 			&nbsp;&nbsp;&nbsp;&nbsp;
			 			<span class="sig">(подпись)</span>
			 		</span>
			 		<span class="bb q-mx-sm relative-position" style="width: 150px; display: inline-block;">
			 			{{sv.author.full_name}}
			 			<span class="sig">(расшифровка подписи)</span>
			 		</span>
			 	</span>
			 </div>
			 <div class="row q-mt-md" v-if="sv.calcs.length < 21">
			 	<span>Дата составления:
			 		<span class="bb">" {{ new Date(sv.created_date).toLocaleDateString('ru', {day: '2-digit'}) }} "</span>
			 		<span class="bb q-mx-sm q-px-md">{{ new Date(sv.created_date).toLocaleDateString('ru', {month: '2-digit'}) }}</span>
			 		<span class="bb q-px-sm">{{ new Date(sv.created_date).getFullYear() }}</span>г.
			 	</span>
			 </div>
		</div>
		<div class="page" v-if="sv.calcs.length > 20">
			<table id="calcs_table" class="full-width q-mt-sm" border="1" cellspacing="0" cellpadding="0">
				<thead align="center">
					<tr>
						<th rowspan="2">Ф.И.О.</th>
						<th rowspan="2" width="10%">Дата</th>
						<th rowspan="2" width="3%">№ пут. л.</th>
						<th rowspan="2" width="4%">часы</th>
						<th rowspan="2" width="5%"><div class="rotated">Ставка</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Классность</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Коэффициент</div></th>
						<th rowspan="2" width="5%"><div class="rotated">Премия</div></th>
						<th colspan="8">Оплата</th>
					</tr>
					<tr>
						<th class="rotated" width="5%"><div class="rotated">Основная<br/> зарплата</div></th>
						<th class="rotated" width="5%"><div class="rotated">Переработка<br/> в 1,5 раз</div></th>
						<th class="rotated" width="5%"><div class="rotated">Переработка<br/> в 2 раза</div></th>
						<th class="rotated" width="5%"><div class="rotated">Праздничные</div></th>
						<th class="rotated" width="5%"><div class="rotated">Классность</div></th>
						<th class="rotated" width="5%"><div class="rotated">Премия</div></th>
						<th class="rotated" width="5%"><div class="rotated">Коэффициент</div></th>
						<th class="rotated" width="5%"><div class="rotated">Итого</div></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="calc in sv.calcs.slice(20, 50)">
						<td>{{ calc.waybill.driver.full_name }}</td>
						<td>{{ new Date(calc.waybill.date).toLocaleDateString() }}</td>
						<td>{{ calc.waybill.id }}</td>
						<td>{{ calc.waybill.total_hours }}</td>
						<td>{{ calc.rate }}</td>
						<td>{{ calc.classines }}</td>
						<td>{{ calc.coefficient }}</td>
						<td>{{ calc.bonus }}</td>
						<td>{{ calc.amount }}</td>
						<td>{{ calc.recast_half }}</td>
						<td>{{ calc.recast_double }}</td>
						<td>{{ calc.amount_holydays }}</td>
						<td>{{ calc.amount_classines }}</td>
						<td>{{ calc.amount_bonus }}</td>
						<td>{{ calc.amount_coefficient }}</td>
						<td>{{ calc.amount_total }}</td>
					</tr>
					<template v-if="sv.calcs.length < 50">
						<tr v-for="i in (50 - sv.calcs.length)">
							<td v-for="i in 16">&nbsp;</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr class="text-bold">
						<td>ИТОГО:</td><td></td><td></td>
						<td>{{ parseFloat(sv.hours) }}</td>
						<td></td><td></td><td></td><td></td>
						<td>{{ sv.amount }}</td>
						<td>{{ sv.recast_half > 0 ? sv.recast_half : '' }}</td>
						<td>{{ sv.recast_double  > 0 ? sv.recast_double : '' }}</td>
						<td>{{ sv.holydays > 0 ? sv.holydays : '' }}</td>
						<td>{{ sv.classines > 0 ? sv.classines : '' }}</td>
						<td>{{ sv.bonus > 0 ? sv.bonus : '' }}</td>
						<td>{{ sv.coefficient > 0 ? sv.coefficient : '' }}</td>
						<td>{{ sv.amount_total }}</td>
					</tr>
				</tfoot>
			</table>
			 <div class="row q-pt-md">
			 	<span>Составил:
			 		<span class="bb q-mx-sm q-px-md relative-position">
			 			{{ sv.author.position }}<span class="sig">(должность)</span>
			 		</span>
			 		<span class="bb q-px-lg q-mx-sm relative-position">
			 			&nbsp;&nbsp;&nbsp;&nbsp;
			 			<span class="sig">(подпись)</span>
			 		</span>
			 		<span class="bb q-mx-sm relative-position" style="width: 150px; display: inline-block;">
			 			{{sv.author.full_name}}
			 			<span class="sig">(расшифровка подписи)</span>
			 		</span>
			 	</span>
			 </div>
			 <div class="row q-mt-md">
			 	<span>Дата составления:
			 		<span class="bb">" {{ new Date(sv.created_date).toLocaleDateString('ru', {day: '2-digit'}) }} "</span>
			 		<span class="bb q-mx-sm q-px-md">{{ new Date(sv.created_date).toLocaleDateString('ru', {month: '2-digit'}) }}</span>
			 		<span class="bb q-px-sm">{{ new Date(sv.created_date).getFullYear() }}</span>г.
			 	</span>
			 </div>
		</div>
	</q-layout>
</template>
<script>
	export default {
		name: "SvodnayaVedomostPrintPage",
		props: {
			id: { required: true }
		},
		data() {
			return {
				sv: null
			}
		},
		methods: {
			// HTTP-GET svodnaya vedomost
			getSvodnayaVedomost() {
				this.$axios.get('/api/v1/svodnie_vedomosti/' + this.id + '/')
				.then(response => {
					this.sv = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// Print document
			print() {
				window.print();
			}
		},
		mounted() {
			this.getSvodnayaVedomost();
		}
	}
</script>
<style>
#sv { background: rgb(204,204,204); 
	font:  12px Times New Roman, serif;
 }

.page {  
  width: 29.7cm; 
  height: 21cm; 
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
   	margin: 0;
    box-shadow: none;
  }
}
  @page {
  	margin: -1px;
  	size: A4 landscape;
  	max-height:100%; max-width:100%
  }
  .bb { border-bottom: 1px solid; }
  .rotated {  	
  	-webkit-writing-mode: vertical-rl ;
 	 writing-mode: vertical-rl;
  	 height: 85px;
  	white-space: nowrap;}
  	.sig {position: absolute; left: 0; width: 100%; font-size: 9px; top: 15px;}
</style>