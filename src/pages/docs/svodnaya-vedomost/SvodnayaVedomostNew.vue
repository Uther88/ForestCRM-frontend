<template>
	<div id="svodnaya-vedomost" class="full-height bg-grey-4 items-start">
		<div class="row bg-indigo glossy q-pa-sm full-width flex-center">
				<q-field label="Участок" class="col-md col-sm-12 q-pa-xs" label-width="3">
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
				<q-field label="Отдел" class="col-md-2 col-sm-12 q-pa-xs" label-width="3">
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
				<q-field label="Дата" class="col-md-2 col-sm-12 q-pa-xs" label-width="3" >
					<q-datetime 
					type="date" :value="form.date" 
					@input="val => {form.date = new Date(val).toDateString()}" 
					format-model="date" format="MM.YYYY" 
					class="bg-white round-borders" align="center" 
					hide-underline style="padding: 5px;" 
					default-view="month" modal :disable="!is_editable" />
				</q-field>
				<q-field label="Вид работ" class="col-md col-sm-12 q-pa-xs" label-width="3">
					<q-select 
					v-model="form.event" 
					:options="options.events.map(e => {return {label: e.full_name, value: e.id }})" 
					class="bg-white round-borders"
					hide-underline style="padding: 5px;"
					separator
					clearable
					filter
				/>
				</q-field>
				<div class="col-md-1 col-sm-12 flex flex-center q-pa-xs">
					<q-btn @click="getWaybills" label="Поиск" color="positive" glossy 
					:disabled="!(this.form.date && this.form.station && this.form.departament && !form.calcs.length)" />
				</div>
		</div>
		<div class="row col-12 q-pa-xs">
			<div class="col-12 bg-white shadow-1">
				<q-table
				:data="options.waybills"
				:columns="waybill_columns"
				hide-bottom
				dense
				table-style="min-height: 25vh;"
				table-class="text-center calcs-table"
				:pagination="pagination"
				separator="cell"
				grid
				>
					<template slot="top" slot-scope="props">
						<span>Путевые листы</span>
					</template>
				  	<q-td slot="body-cell-options" slot-scope="props" :props="props">
	            		<q-btn icon="add" dense color="positive" @click.native="calcWaybill(props.row)" />
	            	</q-td>
				</q-table>
			</div>
			<div class="col-12 q-mt-sm shadow-1 bg-white">
				<q-table
					:data="form.calcs"
					:columns="columns"
					dense
					table-class="calcs-table bg-white"
					hide-bottom
					separator="cell"
					table-style="min-height: 25vh;"
					:pagination="pagination"
					grid
				>
					<template slot="top" slot-scope="props">
						<span >Расчеты</span>
					</template>
					<q-td slot="body-cell-options" slot-scope="props">
						<q-btn icon="edit" flat dense color="primary" @click.native="editCalc(props.row)" />
						<q-btn icon="delete" flat dense color="negative" @click.native="removeCalc(props.row)" />
					</q-td>
					<template slot="bottom-row" slot-scope="props" >
						<tr style=" bottom: 0;" class="table-bottom text-center">
							<td>ИТОГО:</td>
							<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
							<td>{{ form.hours }}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
							<td>{{ form.amount }}</td>
							<td>{{ form.recast_half }}</td>
							<td>{{ form.recast_double }}</td>
							<td>{{ form.holydays }}</td>
							<td>{{ form.classines }}</td>
							<td>{{ form.bonus }}</td>
							<td>{{ form.coefficient }}</td>
							<td>{{ form.amount_total }}</td>
						</tr>
					</template>
				</q-table>
			</div>
		</div>
		<div class="row col-12 q-pa-md flex-center justify-center group">
			<q-btn label="Отчистить" color="negative" @click="resetAll" />
			<q-btn label="Сохранить" color="positive" @click.native="saveVedomost" glossy :disabled="!form.calcs.length > 0" />
		</div>
		<q-modal
			ref="add-calc"
			@hide="resetCalcForm"
			id="calc-modal"
			content-css="max-height: 100%; max-width: 500px;">
			<div>
				<q-toolbar glossy>
					<q-toolbar-title class="text-center">Добавить расчет</q-toolbar-title>
					<q-btn flat icon="close" v-close-overlay />
				</q-toolbar>
				<div v-if="this.calc_form.__instance" class="q-pa-xs">
					<table class='fit text-center calc_table' cellspacing="0" cellpadding="5">
						<tr>
							<td>Водитель:</td>
							<td>{{ calc_form.__instance.driver.full_name }}</td>
						</tr>
						<tr>
							<td>№:</td>
							<td>{{ calc_form.__instance.number }}</td>
						</tr>
						<tr>
							<td>Дата:</td>
							<td>{{ new Date(calc_form.__instance.date).toLocaleDateString() }}</td>
						</tr>
						<tr>
							<td>Часы:</td>
							<td>{{ calc_form.__instance.total_hours }}</td>
						</tr>
						<tr>
							<td>Ставка:</td>
							<td>{{ calc_form.data.rate }}</td>
						</tr>
					</table>
					<div class="row justify-between group q-py-sm text-center">
						<q-field label="Классность" orientation="vertical" class="col" >
							<input :min="0" class="text-center" type="number" style="width: 100px;" v-model="calc_form.data.classines" align="center" @input="calcSummary" />
						</q-field>
						<q-field label="Премия" orientation="vertical" class="col">		
							<input :min="0" class="text-center" type="number" style="width: 100px;" v-model="calc_form.data.bonus" align="center" @input="calcSummary"  />
						</q-field>
						<q-field label="Коэффициент" orientation="vertical" class="col">
							<input :min="0" class="text-center" type="number" style="width: 100px;" v-model="calc_form.data.coefficient" align="center" @input="calcSummary" />
						</q-field>
					</div>
					<table class="fit text-center calc_table" cellspacing="0" cellpadding="5">
						<tr>
							<td width="75%">Основная зарплата</td><td>{{ calc_form.data.amount }}</td>
						</tr>
						<tr>
							<td>Переработка в 1,5 раз</td><td>{{ calc_form.data.recast_half }}</td>
						</tr>
						<tr>
							<td>Переработка в 2 раза</td><td>{{ calc_form.data.recast_double }}</td>
						</tr>
						<tr>
							<td>Праздничные</td><td>{{ calc_form.data.amount_holydays }}</td>
						</tr>
						<tr>
							<td>Классность</td><td>{{ calc_form.data.amount_classines }}</td>
						</tr>
						<tr>
							<td>Премия</td><td>{{ calc_form.data.amount_bonus }}</td>
						</tr>
						<tr>
							<td>Коэффициент</td><td>{{ calc_form.data.amount_coefficient }}</td>
						</tr>
						<tr>
							<td>Итого</td><td>{{ calc_form.data.amount_total }}</td>
						</tr>
					</table>
				</div>
				<q-toolbar class="justify-center group">
					<q-btn icon="save" label="Сохранить" glossy @click.native="saveCalc" color="positive" />
					<q-btn icon="close" label="Отмена" glossy color="negative" v-close-overlay />
				</q-toolbar>
			</div>	
		</q-modal>
	</div>
</template>

<script>
	export default {
		name: 'SvodnayaVedomostPrintPage',
		data() {
			return {
				pagination: {
					rowsPerPage: 0,
				},
				addNewEntryDialog: false,
				// Main form
				form: {
					date: null,
					station: this.$user.station,
					departament: null,
					event: null,
					calcs: [],
					hours: 0,
					amount: 0,
					classines: 0,
					recast_half: 0,
					recast_double: 0,
					holydays: 0,
					bonus: 0,
					coefficient: 0,
					amount_total: 0
				},
				// Calculations form
				calc_form: {
					__instance: null,
					data: {
						waybill: null,
						rate: null,
						classines: null,
						coefficient: null,
						bonus: null,
						amount: null,
						amount_classines: null,
						recast_half: null,
						recast_double: null,
						amount_holydays: null,
						amount_bonus: null,
						amount_coefficient: null,
						amount_total: null
					},

				},
				// Fetched data options
				options: {
					stations: [],
					events: [],
					waybills: [],
				},
				// Columns for main table
				columns: [
					{name: 'options', label: 'Опции', field: '__index', align: 'center'},
					{name: 'driver', label: 'ФИО', field: c => c.__instance.driver.full_name, align: 'center'},
					{name: 'date', label: 'Дата', field: c => new Date(c.__instance.date).toLocaleDateString(), align: 'center'},
					{name: 'number', label: 'Номер', field: c => c.__instance.number, align: 'center'},
					{name: 'hours', label: 'Часы.', field: c => c.__instance.total_hours, align: 'center'},
					{name: 'rate', label: 'Ставка', field: c => this.$store.state.main.rates[c.__instance.driver.rank], align: 'center'},
					{name: 'classines', label: 'Классность', field: c => c.data.classines, align: 'center'},
					{name: 'coefficient', label: 'Коэффициент', field: c => c.data.coefficient, align: 'center'},
					{name: 'bonus', label: 'Премия', field: c => c.data.bonus, align: 'center'},
					{name: 'amount', label: 'Оплата: основная', field: c => c.data.amount, align: 'center'},
					{name: 'recast_half', label: 'Оплата: переработка в 1,5 раз', field: c => c.data.recast_half, align: 'center'},
					{name: 'recast_double', label: 'Оплата: переработка в 2 раза', field: c => c.data.recast_double, align: 'center'},
					{name: 'amount_holydays', label: 'Оплата: праздничные', field: c => c.data.amount_holydays, align: 'center'},
					{name: 'amount_classines', label: 'Оплата: Классность', field: c => c.data.amount_classines, align: 'center'},
					{name: 'amount_bonus', label: 'Оплата: премия', field: c => c.data.amount_bonus, align: 'center'},
					{name: 'amount_coefficient', label: 'Оплата: коэффициент', field: c => c.data.amount_coefficient, align: 'center'},
					{name: 'amount_total', label: 'Оплата: итого', field: c => c.data.amount_total, align: 'center'},
				],
				// Columns for waybills table
				waybill_columns: [
					{name: 'options', label: 'Опции', field: 'id', align: 'center'},
					{name: 'driver', label: 'Водитель', field: w => w.driver.full_name, align: 'center'},
					{name: 'number', label: 'Номер', field: w => w.number, align: 'center'},
					{name: 'hours', label: 'Часы', field: w => w.total_hours, align: 'center'},
					{name: 'date', label: 'Дата', field: w => new Date(w.date).toLocaleDateString(), align: 'center'},
				],
			}
		},
		computed: {
			// Check for possible edit of form
			is_editable() {
				if (this.form.calcs.length > 0 || this.options.waybills.length > 0) {
					return false;
				} else {
					return true;
				}
			},
		},

		methods: {
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
			// Check for valid completing of filter form and HTTP-GET waybills by filter params
			getWaybills() {
				if (this.form.date && this.form.station && this.form.departament) {
					var date = new Date(this.form.date);
					var params = {
						station: this.form.station, 
						date__year: date.getFullYear(), 
						date__month: date.getMonth() + 1,
						departament: this.form.departament,
						is_completed: true,
						conducted: false
					};
					this.$axios.get('/api/v1/waybill/', { params })
					.then(response => {
						this.options.waybills = response.data.waybills;
					}).catch(e => {
						this.$handleError(e);
					})
				}
			},
			// Calculate waybill data
			calcWaybill(waybill) {
				this.calc_form.__instance = waybill;
				this.calc_form.data.waybill = waybill.id;
				this.calc_form.data.rate = this.$store.state.main.rates[waybill.driver.rank];
				this.calc_form.data.amount = (
					parseFloat(waybill.total_hours) * parseFloat(this.calc_form.data.rate)
					).toFixed(2);
				this.recastCalc(waybill.date, waybill.total_hours);
				this.calcSummary();
				this.$refs['add-calc'].show();
			},
			// Calculate summary data
			calcSummary() {
				var amount_coefficient, amount_bonus, amount_classines, amount_total,
				rate = parseFloat(this.calc_form.data.rate),
				classines = parseFloat(this.calc_form.data.classines) || 0,
				bonus = parseFloat(this.calc_form.data.bonus) || 0,
				coefficient = parseFloat(this.calc_form.data.coefficient) || 0,

				recast_half = parseFloat(this.calc_form.data.recast_half) || 0,
				recast_double = parseFloat(this.calc_form.data.recast_double) || 0,
				amount = parseFloat(this.calc_form.data.amount),
				amount_holydays = parseFloat(this.calc_form.data.amount_holydays) || 0;

				classines ? amount_classines = amount * classines / 100 : amount_classines = 0;
				bonus ? amount_bonus = amount * bonus / 100 : amount_bonus = 0;
				coefficient ? amount_coefficient = amount * coefficient : amount_coefficient = 0;

				amount_total = (
					amount + recast_half + recast_double + 
					amount_holydays + amount_bonus + amount_classines + amount_coefficient)
				amount_holydays ? this.calc_form.data.amount_holydays = amount_holydays.toFixed(2) : null;
				this.calc_form.data.amount_bonus = amount_bonus.toFixed(2);
				this.calc_form.data.amount_classines = amount_classines.toFixed(2);
				this.calc_form.data.amount_coefficient = amount_coefficient.toFixed(2);
				this.calc_form.data.amount_total = amount_total.toFixed(2);
			},
			// Calculate recast of work
			recastCalc(date, hours) {
				// Remove X-CSRFToken from header
				var config = {
					params:{ pre: 1 },
					transformRequest: [(data, headers) => {
						delete headers.common["X-CSRFToken"];
						return data;
						}]
				};
				// Formate date list
				var date_list = new Date(date).toLocaleDateString().split('.').reverse();
				// HTTP-GET to external resource to find out the recasting of work by date params
				this.$axios.get('https://isdayoff.ru/' + date_list[0] + date_list[1] + date_list[2], config)
				.then(response => {
					// If workdays is holydays - set amount holydays
					if (response.data == 1) {
						this.calc_form.data.amount_holydays = this.calc_form.data.amount;
					}
				}).catch(e => {
					this.$handleError(e);
				})
				// If worktime is more than 8 hours - set recast half
				if (parseFloat(hours) > 8) {
					this.calc_form.data.recast_half = this.calc_form.data.rate;
					// If worktime is more than 10 hours - set recast double
					if (parseFloat(hours) > 10) {
						this.calc_form.data.recast_double = (parseFloat(this.calc_form.data.rate) * 2).toFixed(2);
					}
				}
			},
			// Save calculation
			saveCalc() {
				var data = JSON.parse(JSON.stringify(this.calc_form));
				if (this.form.calcs.some(c => c.__instance.id == data.__instance.id)) {
					this.form.calcs[data.__index] = data;
				} else {
					this.form.calcs.push(data);
					this.options.waybills.splice(data.__instance.__index, 1);
				}
				this.form.calcs.sort();
				this.$refs['add-calc'].hide();
			},
			// Edit calculation
			editCalc(calc) {
				this.calc_form.__instance = calc.__instance;
				this.calc_form = JSON.parse(JSON.stringify(calc));
				this.$refs['add-calc'].show();
			},
			// Remove calculation
			removeCalc(calc){
				this.options.waybills.push(calc.__instance);
				this.form.calcs.splice(calc.__index, 1);
				this.options.waybills.sort((a, b) => {return a.id > b.id});
			},
			// Reset calculation form
			resetCalcForm() {
				Object.keys(this.calc_form.data).forEach(k => this.calc_form.data[k] = null);
				this.calc_form.__instance = null;
			},
			// Reset all data
			resetAll(){
				this.options.waybills = [];
				this.form.calcs = [];
				this.form.departament = null;
				this.form.date = null;
				this.form.event = null;
			},
			// HTTP-POST to save svodnaya vedomos
			saveVedomost() {
				if (this.form.calcs.length > 0) {
					const data = JSON.stringify(this.form);
					this.$axios.post('/api/v1/svodnie_vedomosti/', data)
					.then(response => {
						this.done(response.data.id);
					}).catch(e => {
						this.$handleError(e);
					})
				}
			},
			// When form is succesfully saved - ask for print this document
			done(id) {
				this.$q.dialog({
					title: 'Готово',
					message: 'Открыть печатную форму?',
					ok: true, cancel: true
				}).then(() => {
					// Yes, print it
					this.$router.push({name: 'SvodnayaVedomostPrint', params: {id}})
				}).catch(() => {
					// Not print
					this.$router.push({name: 'SvodnayaVedomost'})
				})
			},
		},
		mounted() {
			// Launch stations and events getters on mount page
			this.getStations();
			this.getEvents();
		},
		watch: {
			// Watcher for calculations
			'form.calcs': function() {
				// Define base data
				var hours = 0,
				amount = 0,
				classines = 0,
				recast_half = 0,
				recast_double = 0,
				holydays = 0,
				bonus = 0,
				coefficient = 0,
				amount_total = 0;
				// Summary data by calculations
				this.form.calcs.forEach(c => {
					hours += parseFloat(c.__instance.total_hours);
					amount += parseFloat(c.data.amount);
					classines += parseFloat(c.data.amount_classines) || 0;
					recast_half += parseFloat(c.data.recast_half) || 0;
					recast_double += parseFloat(c.data.recast_double) || 0;
					holydays += parseFloat(c.data.amount_holydays) || 0;
					bonus += parseFloat(c.data.amount_bonus) || 0;
					coefficient += parseFloat(c.data.amount_coefficient) || 0;
					amount_total += parseFloat(c.data.amount_total);
				})
				// Set data to form
				this.form.hours = hours;
				this.form.amount = amount;
				this.form.classines = classines;
				this.form.recast_half = recast_half;
				this.form.recast_double = recast_double;
				this.form.holydays = holydays;
				this.form.bonus = bonus;
				this.form.coefficient = coefficient;
				this.form.amount_total = amount_total;
			}
		}
	}
</script>

<style>
	#svodnaya-vedomost .calcs-table thead {outline: 1px solid lightgray;}
	#svodnaya-vedomost .calcs-table tbody {}
	#svodnaya-vedomost .calcs-table th{white-space: pre-wrap;}
	#svodnaya-vedomost .q-field-label-inner {justify-content: center; color: white; text-shadow: 0 1px black; font-weight: bold;}
	 #calc-modal .q-popover {max-width: 400px;}
	 #svodnaya-vedomost .q-table-top { outline: 1px solid lightgray; text-align: center; justify-content: center; font-weight: bold;}
	#calc-modal .q-field-label-inner { justify-content: center; font-size: 10pt; color:green; }
	.calc_table td{border: 1px solid lightgray;}
	 #svodnaya-vedomost .table-bottom td {font-weight: bold;}
</style>