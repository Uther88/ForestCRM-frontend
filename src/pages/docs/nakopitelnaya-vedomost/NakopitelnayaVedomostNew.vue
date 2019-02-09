<template>
	<div id="nakopitelnaya-vedomost">
		<div class="row bg-indigo q-pa-sm full-width justify-between">
				<q-field label="Участок" class="col-md-3 items-center col-xs-12 q-pa-xs" label-width="3">
					<q-select 
					 v-model="form.station"
					 :options="options.stations.map(s => {return {label: s.name, value: s.id}})" 
					 class="bg-white round-borders" 
					 separator
					 hide-underline
					 style="padding: 5px;"
					 :disable="!is_editable"
				/>
				</q-field>
				<q-field label="Отдел" class="col-md-2 col-xs-12 q-pa-xs">
					<q-select 
					 v-model="form.departament"
					 :options="$store.state.main.departaments" 
					 class="bg-white round-borders" 
					 separator
					 hide-underline
					 style="padding: 5px;"
					 :disable="!is_editable"
				/>
				</q-field>
				<q-field label="Дата" class="col-md-2 col-xs-12 q-pa-xs"  >
					<q-datetime type="date" :value="form.date" 
					@input="val => {form.date = new Date(val).toLocaleDateString('EU')}" 
					format-model="date" format="MM.YYYY" 
					class="bg-white round-borders" align="center"
					hide-underline style="padding: 5px;" 
					default-view="month" modal 
					:disable="!is_editable"
					/>
				</q-field>
				<q-field label="Вид работ" class="col-md-4 col-xs-12 q-pa-xs" label-width="3">
					<q-select 
					v-model="form.event" 
					:options="options.events.map(e => {return {label: e.full_name, value: e.id }})" 
					class="bg-white round-borders"
					hide-underline style="padding: 5px;"
					separator
					clearable
					filter
					:disable="!is_editable"
				/>
				</q-field>
				<div class="col-md-1 col-xs-12 text-center q-pa-xs">
					<q-btn color="positive" glossy icon="search" @click="getDocuments" :disabled="!filter_is_valid" />
				</div>
		</div>
		<div class="row group">
			<q-table
			class="col-md col-xs-12"
			:loading="outfit_loading"
			:data="docs.outfits"
			:columns="outfit_columns"
			:pagination="{rowsPerPage: 0}"
			dense separator="cell"
			table-style="min-height: 30vh;"
			no-data-label="Не найдено ни одного наряд-акта"
			loading-label="Идет поиск.."
			>
				<template slot="top"  slot-scope="props">
					<div class="full-width text-center">
						Наряд-Акты
					</div>
				</template>
				<tr slot="bottom-row" slot-scope="props" class="bg-grey-2 tfoot">
					<td>Всего: {{docs.outfits.length}}</td>
					<td></td><td></td>
					<td>{{ docs.outfits.map(o => o.days_total).reduce((a,b) => parseFloat(a) + parseFloat(b),0) }}</td>
					<td>{{ docs.outfits.map(o => o.hours_total).reduce((a,b) => parseFloat(a) + parseFloat(b),0) }}</td>
					<td>{{ docs.outfits.map(o => o.amount_total).reduce((a,b) => parseFloat(a) + parseFloat(b),0) }}</td>
				</tr>
			</q-table>
			<q-table
			table-style="min-height: 30vh;"
			:loading="regform_loading"
			class="col-md col-xs-12"
			:data="docs.regforms"
			:columns="regform_columns"
			:pagination="{rowsPerPage: 0}"
			dense separator="cell"
			no-data-label="Не найдено ни одного учетного листа"
			loading-label="Идет поиск.."
			>
				<template slot="top"  slot-scope="props">
					<div class="full-width text-center">
						Учетные листы тракториста
					</div>
				</template>
				<tr slot="bottom-row" slot-scope="props" class="bg-grey-2 tfoot">
					<td>Всего: {{docs.regforms.length}}</td>
					<td></td><td></td>
					<td>{{ docs.regforms.map(rf => rf.total_hours).reduce((a,b) => parseFloat(a) + parseFloat(b),0) }}</td>
					<td>{{ docs.regforms.map(rf => rf.amount_total).reduce((a,b) => parseFloat(a) + parseFloat(b),0) }}</td>
				</tr>
			</q-table>
		</div>
		<div class="row q-px-xs" style="overflow: scroll; min-height: 27vh; max-height: 50vh;">
			<table class="q-table calcs-table">
				<caption class="bg-grey-3 q-py-xs" style="position: relative;">
					<q-btn glossy style="font-weight: bold;" label="Расчитать" color="positive" class="float-left q-ml-sm"
					:disabled="!is_calculable" @click="calculate" />
					<span style="vertical-align: middle; line-height: 2" class="absolute-center">Расчеты</span>
				</caption>
				<thead>
					<tr>
						<th rowspan="2" width="3%">№<br/>п/п</th>
						<th rowspan="2" w>Ф.И.О.</th>
						<th rowspan="2" width="5%">Чел-дни<br/>машино-смен</th>
						<th rowspan="2" width="3%">№<br/>наряда</th>
						<th rowspan="2" width="5%">Сложность<br/>(усл. труда)<br/>%</th>
						<th rowspan="2" width="5%">Ответств.<br/>работы<br/>%</th>
						<th rowspan="2" width="5%">Премия<br/>%</th>
						<th rowspan="2" width="5%">Коэффи-<br/>циент</th>
						<th rowspan="2" width="5%">Классность<br/>%</th>
						<th colspan="10" class="bg-blue-2 text-black">Оплата</th>
					</tr>
					<tr>
						<th width="5%">Начислено</th>
						<th width="5%">Сложность<br/>(усл. труда)</th>
						<th width="5%">Ответств.<br/>работы</th>
						<th width="5%">Переработка<br/>в 1,5 раза</th>
						<th width="5%">Переработка<br/>в 2 раза</th>
						<th width="5%">Выходные</th>
						<th width="5%">Премия</th>
						<th width="5%">Коэффи-<br/>циент</th>
						<th width="5%">Классность</th>
						<th width="5%">Всего</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(calc, index) in docs.calcs">
						<td>{{ index + 1 }}</td>
						<td>{{calc.worker}}</td>
						<td>{{ calc.man_days }}</td>
						<td>{{ calc.number }}</td>
						<td>{{ calc.complexity }}</td>
						<td>{{ calc.importance }}</td>
						<td>{{ calc.bonus }}</td>
						<td>{{ calc.coefficient }}</td>
						<td>{{ calc.classines }}</td>
						<td>{{ calc.amount }}</td>
						<td>{{ calc.amount_complexity }}</td>
						<td>{{ calc.amount_importance }}</td>
						<td>{{ calc.recast_half }}</td>
						<td>{{ calc.recast_double }}</td>
						<td>{{ calc.holydays }}</td>
						<td>{{ calc.amount_bonus }}</td>
						<td>{{ calc.amount_coefficient }}</td>
						<td>{{ calc.amount_classines }}</td>
						<td>{{ calc.amount_total }}</td>
					</tr>
				</tbody>
				<tfoot style="font-size: 10pt;" v-if="docs.calcs.length">
					<tr class="bg-grey-2" style="font-weight: bold;">
						<td>{{ docs.calcs.length }}</td><td></td>
						<td>{{ form.man_days }}</td>
						<td></td><td></td><td></td><td></td><td></td><td></td>
						<td>{{ form.amount }}</td>
						<td>{{ form.complexity }}</td>
						<td>{{ form.importance }}</td>
						<td>{{ form.recast_half }}</td>
						<td>{{ form.recast_double }}</td>
						<td>{{ form.holydays }}</td>
						<td>{{ form.bonus }}</td>
						<td>{{ form.coefficient }}</td>
						<td>{{ form.classines }}</td>
						<td>{{ form.amount_total }}</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="row justify-center group bg-indigo glossy">
			<q-btn icon="clear" color="negative" label="Отчистить" @click="resetAll" />
			<q-btn icon="save" label="Сохранить" color="positive" :disabled="!docs.calcs.length" @click="save" />
		</div>
	</div>
</template>
<script>
	export default {
		name: 'NakopitelnayaVedomostNewPage',
		data() {
			return {
				// Loading status
				loading: false,
				outfit_loading: false,
				regform_loading: false,
				// Options of fetched stations and events
				options: {
					stations: [],
					events: [],
				},
				// Arrays of fetched documents and calculations
				docs: {
					outfits: [],
					regforms: [],
					calcs: [],
				},
				// Main form
				form: {
					station: this.$user.station || null,
					date: null,
					departament: null,
					event: null,
					outfits: [],
					regforms: [],
					man_days: null,
					amount: null,
					complexity: null,
					importance: null,
					bonus: null,
					coefficient: null,
					classines: null,
					recast_half: null,
					recast_double: null,
					holydays: null,
					amount_total: null
				},
				// Columns for outfit table
				outfit_columns: [
					{label: 'Номер', name: 'id', field: 'id', align: 'center'},
					{label: 'Лесничество', name: 'forestry', field: 'forestry', align: 'center'},
					{label: 'Бригадир', name: 'brigadier', field: o => o.brigadier.full_name, align: 'center'},
					{label: 'Дней', name: 'days_total', field: o => parseFloat(o.days_total), align: 'center'},
					{label: 'Часов', name: 'hours_total', field: o => parseFloat(o.hours_total), align: 'center'},
					{label: 'Оплата', name: 'amount_total', field: 'amount_total', align: 'center'},
				],
				// Columns for regform table
				regform_columns:[
					{label: 'Номер', name: 'id', field: 'id', align: 'center'},
					{label: 'Бригадир', name: 'brigadier', field: rf => rf.brigadier.full_name, align: 'center'},
					{label: 'Тракторист', name: 'driver', field: rf => rf.driver.full_name, align: 'center'},
					{label: 'Часов', name: 'total_hours', field: rf => parseFloat(rf.total_hours), align: 'center'},
					{label: 'Оплата', name: 'amount_total', field: 'amount_total', align: 'center'},
				]
			}
		},
		methods: {
			// HTTP-POST to save form
			save() {
				if (this.docs.calcs.length) {
					this.loading = true;
					var data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/nakopitelnie_vedomosti/', data)
					.then(response => {
						this.done(response.data.id);
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.loading = false;
					})
				}
			},
			// When form is saved - open dialog for printing page
			done(id) {
				this.$q.dialog({
					title: 'Готово',
					message: 'Открыть печатную форму?',
					ok: true, cancel: true
				}).then(() => {
					// Print page
					this.$router.push({name: 'NakopitelnayaVedomostPrint', params: { id }});
				}).catch(() => {
					// No print
					this.$router.push({name: 'NakopitelnayaVedomost'});
				})
			},
			// Calculate total data on add/remove regforms
			calcRegforms() {
				this.docs.regforms.forEach(rf => {
					var calc = {};
					calc.worker = rf.driver.full_name;
					calc.man_days = rf.total_hours;
					calc.number = rf.id;
					calc.importance = rf.importance;
					calc.complexity = rf.complexity;
					calc.classines = rf.classines;
					calc.bonus = rf.bonus;
					calc.amount = rf.amount;
					calc.amount_bonus = rf.amount_bonus;
					calc.amount_complexity = rf.amount_complexity;
					calc.amount_importance = rf.amount_importance;
					calc.amount_classines = rf.amount_classines;
					calc.amount_total = rf.amount_total;
					this.form.regforms.push(rf.id);
					this.docs.calcs.push(calc);
				})

			},
			// Calculate total data on add/remove outfits
			calcOutfits() {
				this.docs.outfits.forEach(of => {
					of.tables.forEach(tab => {
						var calc = {};
						calc.worker = tab.worker.full_name;
						calc.man_days = tab.hours;
						calc.number = of.id;
						calc.complexity = of.conditions;
						calc.bonus = of.bonus;
						calc.importance = of.importance;
						calc.coefficient = of.coefficient;
						calc.amount = tab.tariff_rate;
						calc.amount_bonus = tab.bonus;
						calc.amount_importance = tab.importance;
						calc.amount_complexity = tab.by_conditions;
						calc.amount_coefficient = tab.by_coefficient;
						calc.amount_total = tab.total;
						this.docs.calcs.push(calc);
					})
					this.form.outfits.push(of.id);
				})
			},
			// Launch calculate functions for outfits and regforms
			calculate() {
				if (this.docs.outfits.length) {
					this.calcOutfits();
				}
				if (this.docs.regforms.length) {
					this.calcRegforms();
				}
			},
			// HTTP-GET stations
			getStations() {
				this.$axios.get('/api/v1/stations/')
				.then(response => {
					this.options.stations = response.data.stations;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET events
			getEvents() {
				this.$axios.get('/api/v1/outfit_events/')
				.then(response => {
					this.options.events = response.data.outfit_events;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET outfits
			getOutfits(p) {
				this.outfit_loading = true;
				var params = {};
				params.conducted = false;
				params.station = p.station;
				params.departament = p.departament;
				params.event = p.event;
				params.begin__month = new Date(p.date).getMonth() + 1;
				params.end__month = new Date(p.date).getMonth() + 1;
				this.$axios.get('/api/v1/outfit/', {params})
				.then(response => {
					this.docs.outfits = response.data.outfits;
				}).catch(e => {
					this.$handleError(e);
				}).finally(() => {
					this.outfit_loading = false;
				})
			},
			// HTTP-GET regforms
			getRegforms(p) {
				this.regform_loading = true;
				var params = {};
				params.conducted = false;
				params.station = p.station;
				params.departament = p.departament;
				params.event = p.event;
				params.date__month = new Date(p.date).getMonth() + 1;
				this.$axios.get('/api/v1/tractor-regform/', { params })
				.then(response => {
					this.docs.regforms = response.data.regforms;
				}).catch(e => {
					this.$handleError(e);
				}).finally(() => {
					this.regform_loading = false;
				})
			},
			// HTTP-GET outfits and regforms by selected params
			getDocuments() {
				if (this.filter_is_valid) {
					this.docs.outfits = [];
					this.docs.regforms = [];
					this.docs.calcs = [];
					this.form.regforms = [];
					this.form.outfits = [];
					var params = {
						station: this.form.station,
						departament: this.form.departament,
						date: this.form.date,
						event: this.form.event
					};
					this.getRegforms(params);
					this.getOutfits(params);
				}
			},
			// Resset all fields and clear arrays with outfits and regforms
			resetAll() {
				this.docs.outfits = [];
				this.docs.regforms = [];
				this.docs.calcs = [];
				this.form.event = null;
				this.form.departament = null;
				this.form.date = null;
			},
		},
		mounted() {
			// Launch stations and events getters on mount page
			this.getStations();
			this.getEvents();
		},
		computed: {
			// Check on the ability to edit the form
			is_editable() {
				if (this.docs.regforms.length || this.docs.outfits.length) {
					return false;
				} else {
					return true;
				}
			},
			// Check for filter fields completing
			filter_is_valid() {
				return this.form.station && this.form.departament && this.form.event;
			},
			// Check on the ability to calculate form
			is_calculable() {
				if (this.docs.calcs.length) {
					return false;
				} else {
					return this.docs.outfits.length || this.docs.regforms.length;
				}
			}
		},
		watch: {
			// Watcher for array with calculations
			'docs.calcs': function(val) {
				// Define base data
				var amount = 0,
				coefficient = 0,
				importance = 0,
				classines = 0,
				recast_half = 0,
				recast_double = 0,
				holydays = 0,
				complexity = 0,
				bonus = 0,
				man_days = 0,
				amount_total = 0;
				// Summary data 
				this.docs.calcs.forEach(calc => {
					man_days += parseFloat(calc.man_days);
					amount += parseFloat(calc.amount);
					coefficient += parseFloat(calc.amount_coefficient) || 0;
					importance += parseFloat(calc.amount_importance) || 0;
					classines += parseFloat(calc.amount_classines) || 0;
					recast_half += parseFloat(calc.recast_half) || 0;
					recast_double += parseFloat(calc.recast_double) || 0;
					holydays += parseFloat(calc.holydays) || 0;
					complexity += parseFloat(calc.amount_complexity) || 0;
					bonus += parseFloat(calc.amount_bonus) || 0;
					amount_total += parseFloat(calc.amount_total);
				})
				// Set calculated data to form
				this.form.man_days = man_days.toFixed(2);;
				this.form.amount = amount.toFixed(2);;
				this.form.complexity = complexity.toFixed(2);;
				this.form.classines = classines.toFixed(2);;
				this.form.importance = importance.toFixed(2);;
				this.form.recast_half = recast_half.toFixed(2);;
				this.form.recast_double = recast_double.toFixed(2);;
				this.form.holydays = holydays.toFixed(2);;
				this.form.bonus = bonus.toFixed(2);;
				this.form.coefficient = coefficient.toFixed(2);;
				this.form.amount_total = amount_total.toFixed(2);
			}
		},
	}
</script>
<style>
	#nakopitelnaya-vedomost .q-field-label-inner {
		justify-content: center; color: white; text-shadow: 0 1px black; font-weight: bold;
	}
	 .q-popover.column {max-width: 400px !important;}
	 #nakopitelnaya-vedomost .tfoot td {font-weight: bold; text-align: center;}
	 #nakopitelnaya-vedomost .calcs-table th { padding: 5px 0; border: 1px solid lightgrey; height: 100%; font-weight: bold; font-size: 7pt;}
	  #nakopitelnaya-vedomost .calcs-table td { border: 1px solid lightgrey; padding: 0; text-align: center; }
</style>