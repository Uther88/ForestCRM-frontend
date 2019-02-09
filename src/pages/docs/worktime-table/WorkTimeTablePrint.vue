<template>
	<q-layout id="wt-print" v-if="table">
		<q-page-sticky position="top-left" class='print-hide z-max'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" @click.native="$router.push({name: 'WorkTimeTable'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page">
			<div class="row">
				<div class="col-9" style="font-size: 11px">
					<div class="row justify-center">
						<span class="text-bold">
							Табель № <span class="q-px-md" style="border-bottom: 1px solid">{{ table.id }}</span><br/><br/>
							учета использования рабочего времени
						</span>
					</div>
					<div class="row justify-center q-pt-md">
						<span>за
							<span class="bb q-mx-sm q-px-sm">{{ new Date(table.date).toLocaleDateString('RU', {month: 'long'}) }}</span>
							<span class="bb q-px-sm">{{ new Date(table.date).getFullYear() }}</span>г.
						</span>
					</div>
					<div class="row q-pt-md">
						<div class="col-3 text-left q-pt-xs">Учреждение</div>
						<div class="col-9 bb q-pt-xs">{{ table.organization.name }}</div>
						<div class="col-3 text-left q-pt-xs">Структурное подразделение</div>
						<div class="col-9 bb q-pt-xs">{{ table.station.name }}</div>
						<div class="col-3 text-left q-pt-xs">Отдел</div>
						<div class="col-9 bb q-pt-xs">{{ table.departament_full }}</div>
						<div class="col-3 text-left q-pt-xs">Вид табеля</div>
						<div class="col-9 bb q-mt-xs">0<span class="ut q-mt-xs">(первичный - 0, коректирующий - 1, 2 и т.д.)</span></div>
					</div>
				</div>
				<div class="col-3 flex items-end justify-end">
					<table style="font-size: 9px;" class="mini-table" align="right" cellspacing="0">
						<tbody>
						<tr>
							<td>&nbsp;</td>
							<td style="border: 1px solid;">Коды</td>
						</tr>
						<tr>
							<td class="text-right">Форма по ОКУД</td>
							<td>0504421</td>
						</tr>
						<tr>
							<td class="text-right">Дата</td>
							<td>{{ new Date(table.created_date).toLocaleDateString('RU') }}</td>
						</tr>
						<tr>
							<td class="text-right">по ОКПО</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td class="text-right">Номер коректировки</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td class="text-right">Дата формирования документа</td>
							<td>{{ new Date(table.created_date).toLocaleDateString('RU') }}</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="row q-pt-lg">
				<table class="full-width worktime-table" cellspacing="0" border="1">
					<thead>
						<tr>
							<th rowspan="2">Фамилия, имя,<br/>отчество</th>
							<th rowspan="2" width="45px">Учетный<br/>номер</th>
							<th rowspan="2" width="80px">Должность<br/>(профессия)</th>
							<th colspan="32">Числа месяца</th>
						</tr>
						<tr>
							<th width="25px" v-for="i in 31">{{ i }}</th>
							<th width="45px">
								Всего дней (часов) явок (неявок) за месяц
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(entry, index) in table.entries.slice(0,25)" row-key="id">
							<td>{{ entry.worker.full_name }}</td>
							<td>{{ index + 1 }}</td>
							<td width="10%">{{ entry.worker.position }}</td>
							<td v-for="i in 31">{{ entry.workdays[i] }}</td>
							<td>{{ Object.values(entry.workdays).reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}</td>
						</tr>
						<template v-if="table.entries.length < 25">
							<tr v-for="i in (25 - table.entries.length)" :row-key="i">
								<td v-for="c in 35" >&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot v-if="table.entries.length < 26">
						<tr>
							<th>Итого:</th>
							<th>{{ table.entries.length }}</th>
							<th v-for="i in 32"></th>
							<th>{{ table.hours }}</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row q-pt-md" v-if="table.entries.length < 26">
				<div class="col">
					<div class="row">
						<span class="inline-block text-left q-px-sm">
							Ответственный<br/>
							исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.responsible.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.responsible.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md">
						<span class="inline-block text-left q-px-sm">
							Исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.performer.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.performer.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md q-px-sm">
						"<span class="bb q-px-sm">{{ new Date(table.created_date).getDate() }}</span>"
						<span class="bb q-px-sm q-mx-sm">{{ new Date(table.created_date).toLocaleDateString('RU', {month: 'long'}) }}</span>
						<span class="bb q-px-sm">{{ new Date(table.created_date).getFullYear() }}</span>г.
					</div>
				</div>
				<div class="col">
					<div class="row justify-center">
						<span class="text-bold" style="font-size: 10px">Отметка бухгалтерии о принятии настоящего табеля</span>
					</div>
					<div class="row q-pt-md">
						<span class="inline-block text-left q-px-sm">
							Исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.performer.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.performer.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md q-px-sm">
						"<span class="bb q-px-sm">{{ new Date(table.created_date).getDate() }}</span>"
						<span class="bb q-px-sm q-mx-sm">{{ new Date(table.created_date).toLocaleDateString('RU', {month: 'long'}) }}</span>
						<span class="bb q-px-sm">{{ new Date(table.created_date).getFullYear() }}</span>г.
					</div>
				</div>
			</div>
		</div>
		<div class="page" v-if="table.entries.length > 25">
			<div class="row q-pt-lg">
				<table class="full-width worktime-table q-mt-md" cellspacing="0" border="1">
					<thead>
						<tr>
							<th rowspan="2">Фамилия, имя,<br/>отчество</th>
							<th rowspan="2" width="45px">Учетный<br/>номер</th>
							<th rowspan="2" width="80px">Должность<br/>(профессия)</th>
							<th colspan="32">Числа месяца</th>
						</tr>
						<tr>
							<th width="25px" v-for="i in 31">{{ i }}</th>
							<th width="45px">
								Всего дней (часов) явок (неявок) за месяц
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(entry, index) in table.entries.slice(25,70)" row-key="id">
							<td>{{ entry.worker.full_name }}</td>
							<td>{{ index + 31 }}</td>
							<td>{{ entry.worker.position }}</td>
							<td v-for="i in 31">{{ entry.workdays[i] }}</td>
							<td>{{ Object.values(entry.workdays).reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}</td>
						</tr>
					</tbody>
					<tfoot v-if="table.entries.length < 26">
						<tr>
							<th>Итого:</th>
							<th>{{ table.entries.length }}</th>
							<th v-for="i in 32"></th>
							<th>{{ table.hours }}</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row q-pt-md" v-if="table.entries.length > 25">
				<div class="col">
					<div class="row">
						<span class="inline-block text-left q-px-sm">
							Ответственный<br/>
							исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.responsible.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.responsible.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md">
						<span class="inline-block text-left q-px-sm">
							Исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.performer.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.performer.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md q-px-sm">
						"<span class="bb q-px-sm">{{ new Date(table.created_date).getDate() }}</span>"
						<span class="bb q-px-sm q-mx-sm">{{ new Date(table.created_date).toLocaleDateString('RU', {month: 'long'}) }}</span>
						<span class="bb q-px-sm">{{ new Date(table.created_date).getFullYear() }}</span>г.
					</div>
				</div>
				<div class="col">
					<div class="row justify-center">
						<span class="text-bold" style="font-size: 10px">Отметка бухгалтерии о принятии настоящего табеля</span>
					</div>
					<div class="row q-pt-md">
						<span class="inline-block text-left q-px-sm">
							Исполнитель
						</span>
						<span class="bb q-px-sm" style="min-width: 100px;">{{ table.performer.position }}<span class="ut">(должность)</span>
						</span>
						<span class="bb q-px-lg q-mx-sm" style="min-width: 100px;">&nbsp;<span class="ut">(подпись)</span></span>
						<span class="bb" style="min-width: 100px;">{{ table.performer.full_name }}<span class="ut">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md q-px-sm">
						"<span class="bb q-px-sm">{{ new Date(table.created_date).getDate() }}</span>"
						<span class="bb q-px-sm q-mx-sm">{{ new Date(table.created_date).toLocaleDateString('RU', {month: 'long'}) }}</span>
						<span class="bb q-px-sm">{{ new Date(table.created_date).getFullYear() }}</span>г.
					</div>
				</div>
			</div>
		</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'WorkTimeTablePrint',
		props: {id: { required: true }},
		data() {
			return {
				table: null,
			}
		},
		methods: {
			getTable() {
				this.$axios.get('/api/v1/worktime_tables/' + this.id + '/')
				.then(response => {
					this.table = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			print() {
				window.print();
			},
		},
		mounted() {
			this.getTable();
		},
	}
</script>

<style>
	.bb {border-bottom: 1px solid black; position: relative; display: inline-block; height: 100%}
	.ut {position: absolute; width: 100%; left: 0; top:12px; font-size: 8px;}
	#wt-print {font: 8px Arial;}
	#wt-print .mini-table td:nth-child(even) {border: 1px solid; text-align: center;}
	#wt-print .mini-table td {padding: 2px 5px;}
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
</style>