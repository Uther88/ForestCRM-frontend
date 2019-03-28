<template>
	<q-layout id="act">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="reply" round color="primary" @click.native="$router.push({name: 'ActSpisanyaList'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
	<div class="page" id="act-spisanya-print" v-if="act">
		<div class="row q-mt-xl">
			<div class="col">
				Вид затрат:
				<span>&nbsp;{{ act.outfit.event.full_name }}&nbsp;</span>
			</div>
			<div class="col text-right">
				<span>УТВЕРЖДАЮ</span><br/>
				<span>{{ act.organization.head.position }}</span><br/>
				<span>
					<span>_____________</span>{{ act.organization.head.full_name }}
				</span><br/>
				<span>
					"<span class="bb q-px-md">
					</span>"
					<span class="bb q-px-xl">
					</span>&nbsp;
					<span class="bb q-px-sm">
						20&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</span> г.
				</span>
			</div>
		</div>
		<div class="text-center">
			<span class="text-bold">АКТ О СПИСАНИИ МАТЕРИАЛЬНЫХ ЗАПАСОВ №<span class="bb q-px-md">{{ act.id }}</span></span><br/>
			<span>
				<span class="bb q-px-lg">{{ new Date(act.date).toLocaleDateString('RU', { month: 'long' }) }}</span>&nbsp;
				<span class="bb q-px-lg">{{ new Date(act.date).toLocaleDateString('RU', { year: 'numeric'}) }}</span>года
			</span>
		</div>
		<div class="q-mt-sm">
			Учреждение (централизованная бухгалтерия) 
			<span class="bb q-px-xl">{{ act.organization.name }}</span>
		</div>
		<div>
			Структурное подразделение
			<span class="bb q-px-md">{{ act.station.name }}</span>
		</div>
		<div>
			Материально-ответственное лицо
			<span class="bb q-px-md">{{ act.author.full_name }}</span>
		</div>
		<div>
			Номер наряд-акта
			<span class="bb q-px-md">{{ act.outfit.id }}</span>
			Дата наряд-акта
			<span class="bb q-px-md">{{ new Date(act.outfit.begin).toLocaleDateString() }}</span>
			Бригадир
			<span class="bb q-px-md">{{ act.outfit.brigadier.full_name }}</span>
		</div>
		<div>
			Комиссия в составе Председателя - начальника производственного участка 
			{{ act.station.head.full_name }},
			<template v-for="worker in act.comission">
				{{ worker.position }} {{ worker.full_name }},
			</template>
			назначенная приказом распоряжением от {{ act.order }},
			произвела проверку выданных со склада в подразделения материальных запасов и установила
			фактическое расходование следующих материалов:
		</div>
		<div class="q-mt-sm row">
			<table cellspacing="0" border="1" class="act-table text-center col">
				<thead>
					<tr>
						<th colspan="2">Материальные запасы</th>
						<th rowspan="2">Ед.<br/>изм.</th>
						<th rowspan="2">Норма<br/>расход</th>
						<th colspan="3">Фактически израсходовано</th>
					</tr>
					<tr>
						<th>Наименование</th>
						<th>код</th>
						<th>К-во</th>
						<th>Цена руб.</th>
						<th>Сумма руб.</th>
					</tr>
					<tr>
						<th v-for="i in 7">{{ i }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="expense in act.outfit.expenses" :key="expense.id">
						<td class="text-left">
							{{ expense.material.name }}
						</td><td></td>
						<td>
							{{ expense.material.units.short }}
						</td><td></td>
						<td>
							{{ expense.quantity_fact }}
						</td>
						<td></td><td></td>
					</tr>
					<template v-if="act.outfit.expenses.length < 10">
						<tr v-for="i in (10 - act.outfit.expenses.length)">
							<td v-for="i in 7" >&nbsp;</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr>
						<td>ИТОГО:</td>
						<td></td><td></td><td></td>
						<td>
							{{ act.outfit.expenses.map(e => e.quantity_fact).reduce((a,b) => parseFloat(a) + parseFloat(b), 0).toFixed(2) }}
						</td>
						<td></td><td></td>
					</tr>
				</tfoot>
			</table>
			<table cellspacing="0" border="1" class="act-table text-center col">
				<thead>
					<tr>
						<th rowspan="2">Направление<br/>расхода</th>
						<th colspan="2">Бухгалтерская запись</th>
					</tr>
					<tr>
						<th>Дебет</th>
						<th>Кредит</th>
					</tr>
					<tr>
						<th v-for="i in 3">{{ i + 7 }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="work in act.outfit.works" :key="work.id">
						<td>
							{{ work.name }}
						</td>
						<td></td>
						<td></td>
					</tr>
					<template v-if="act.outfit.works.length < 10">
						<tr v-for="i in (act.outfit.expenses.length - act.outfit.works.length)">
							<td v-for="i in 3">&nbsp;</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
				</tfoot>
			</table>
		</div>
		<div class="q-mt-xs row">
			<div class="col-auto">
				Всего по настоящему акту списано материалов на общую сумму:
			</div>
			<div class="col bb">&nbsp;</div>
			<div class="col-12 bb">&nbsp;</div>
			<div class="col-auto q-mt-xs">
				Заключение комиссии
			</div>
			<div class="col bb">&nbsp;</div>
		</div>
		<div class="row q-mt-sm">
			<div class="col-6 text-right">
				Председатель комиссии Начальник участка
			</div>
			<div class="col-6">
				<span class="bb inline-block" style="width: 150px;">&nbsp;</span>
				{{ act.station.head.full_name }}
			</div>
			<template v-for="worker in act.comission">
				<div class="col-6 text-right">{{worker.position}}</div>
				<div class="col-6">
					<span class="bb inline-block" style="width: 150px;">&nbsp;</span>
					{{ worker.full_name }}
				</div>
			</template>
		</div>
	</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'ActSpisnyaPrint',
		props: { id: {required: true} },
		data() {
			return {
				act: null,
			}
		},
		methods: {
			getAct() {
				if (this.id) {
					this.$axios.get('/api/v1/act-spisanya/' + this.id + '/')
					.then(response => {
						this.act = response.data;
					}).catch(e => {
						this.$handleError(e);
					})
				}
			},
			print() {
				window.print();
			},
		},
		mounted() {
			this.getAct();
		},
	}
</script>

<style>
	body #act{
	  background: rgb(204,204,204); 
	  font:  12px Times New Roman, serif;
	  height: 100%;
	}

	#act-spisanya-print .bb {border-bottom: 1px solid black;}
.page {
	  background: white;
	  margin: 0 auto;
	  padding: 1cm;
	  margin-bottom: 0.5cm;
	  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
	  width: 29.7cm;
  	min-height: 21cm; 
  
}

@media print {
	html,body{height:100%;width:100%;margin:0;padding:0;}
   .page {
    margin: 0;
    box-shadow: none;
  }
}
  @page {
  	margin: 0 1cm;
  	padding: 0;
  	size: A4 landscape;
  	
  }

</style>