<template>
	<q-page class="row flex-center bg-faded">
	<q-stepper ref="stepper" v-model="step" class="justify-between bg-white col-md-11" contractable color="indigo">
		<q-step name="main" title="Основные данные" icon="assignment" active-icon="assignment">
			<div class="row justify-around q-pa-sm">
				<div class="col-md-7 col-xs-12">
					<q-field label="Организация">
						<q-select 
							placeholder="Выберите из списка" 
							v-model="form.organization" 
							:options="options.organizations.map(o => { return {label: o.name, value: o.id}})" 
						/>
					</q-field>
					<q-field label="Участок">
						<q-select 
						placeholder="Выберите из списка" 
						v-model="form.station" 
						:options="options.stations.map(s => { return {label: s.name, value: s.id}})" 
						separator
						/>
					</q-field>
					<q-field label="Отдел">
						<q-select 
							placeholder="Выберите из списка" 
							separator
							v-model="form.departament" 
							:options="$store.state.main.departaments" 
						/>
					</q-field>
					<q-field label="Мероприятие">
						<q-select 
							separator 
							filter 
							autofocus-filter
							v-model="form.event" 
							:options="options.events.map(e => {return {label: e.full_name, value: e.id}})" 
							placeholder="Выберите мероприятие" 
							:before="[{
								icon: 'add',
								color: 'positive',
								handler: addEvent,
								class: 'bg-positive text-white round-borders',
							}]"
						/>
					
					</q-field>
					<q-field label="Трактор">
						<q-select 
						placeholder="Выберите из списка" 
						filter 
						v-model="form.car" 
						:options="options.cars.map(c => {return {label: c.full_name, value: c.id}})" 
						
						/>
					</q-field>
					<q-field label="Тракторист">
						<q-select 
							:disable="!form.station" 
							placeholder="Выберите из списка" 
							filter 
							v-model="form.driver" 
							:options="options.workers.map(w => {return {label: w.full_name, value: w.id}})" 
						/>
					</q-field>
					<q-field label="Бригадир">
						<q-select 
							:disable="!form.station" 
							placeholder="Выберите из списка" 
							filter 
							v-model="form.brigadier" 
							:options="options.workers.map(w => {return {label: w.full_name, value: w.id}})" 
						/>
					</q-field>
					<q-field label="Дата" class="text-center">
						<q-datetime 
							placeholder="Выберите дату" 
							default-view="month" 
							type="date" 
							:value="form.date" 
							format="MM.YYYY" 
							ok-label='Выбрать' 
							modal 
							@change="val => {form.date = new Date(val).toDateString()}" 
						/>
					</q-field>
				</div>
				<div class="col-md-4 col-xs-12">
					<q-field label="Табельный номер">
						<q-input type="text" v-model="form.table_number" />
					</q-field>
					<q-field label="Премия">
						<q-input type="number" v-model="form.bonus" />
					</q-field>
					<q-field label="Сложность">
						<q-input type="number" v-model="form.complexity" />
					</q-field>
					<q-field label="Классность">
						<q-input type="number" v-model="form.classines" />
					</q-field>
					<q-field label="Бригада">
						<q-input type="text" v-model="form.brigade" />
					</q-field>
					<q-field label="Прицепщик">
						<q-select 
							:disable="!form.station" 
							placeholder="Выберите из списка" 
							filter 
							v-model="form.trailerman" 
							:options="options.workers.map(w => {return {label: w.full_name, value: w.id}})" 
						/>
					</q-field>
					<q-field label="Прицепное устройство">
						<q-input 
							type="text" 
							v-model="form.trailer"
						/>
					</q-field>
				</div>
			</div>
		</q-step>
		<q-step class="work-stepper" name="works" title="Работы" icon="border_all">
			<q-table
				:data="form.works"
				:columns="columns"
				dense hide-bottom
				class="work-table fit" 
				table-style="min-height: 55vh;"
				:pagination="{rowsPerPage: 0}"
			>
				<template slot="top" slot-scope="props">
					<q-btn icon="add" color='positive' label="Добавить" @click.native="workDialog = !workDialog" glossy />
					<q-modal v-model="workDialog" no-backdrop-dismiss @hide="resetWorkForm" content-classes="col-md-6" content-css="max-height: 100%;">
						<q-toolbar color="indigo" glossy>
							<q-toolbar-title align="center">
								Работа тракториста
							</q-toolbar-title>
							<q-btn flat icon="close" v-close-overlay />
						</q-toolbar>
						<div class="work-form q-px-xs scroll-y">
							<div class="row justify-around">
								<q-input 
								type="text"
								v-model="work_form.event" 
								stack-label="Наименование работы" 
								class="col-8"
								:error="!work_form.event">
									<q-autocomplete
									 :static-data="{
									 	field: 'value', 
									 	list: form.works.map(w => {return {value: w.event, label: w.event}})
									 }"
									 />
								</q-input>
								<q-datetime 
								align="center" 
								class="col-3" 
								type="date" 
								format="DD.MM" 
								:value="work_form.date" 
								stack-label="Дата" 
								modal 
								@change="val => {work_form.date = new Date(val).toDateString()}"
								:error="!work_form.date"
								/>
							</div>
							<div class="row justify-around">
								<div class="col-12 text-center round-borders text-white glossy q-py-sm shadow-1 q-my-sm bg-indigo">Адресная часть, площадь, справочник</div>
								<q-input 
									class="col-2" 
									align="center" 
									stack-label="Квартал" 
									type="number" 
									v-model="work_form.quarter"
									:error="!work_form.quarter"
								/>
								<q-input 
									class="col-2" 
									align="center" 
									stack-label="Выдел" 
									type="number" 
									v-model="work_form.allotment" 
									:error="!work_form.allotment"
								/>
								<q-input 
									class="col-3" 
									align="center" 
									stack-label="Площадь" 
									type="number" 
									v-model="work_form.area"
									:error="!work_form.area"
								/>
								<q-input 
									class="col-3" 
									type="text" 
									align="center" 
									stack-label="Наименование" 
									v-model="work_form.ref_name" 
									:error="!work_form.ref_name"
								>
									<q-autocomplete
									 	:static-data="{
									 		field: 'value', 
									 		list: form.works.map(w => {return {value: w.ref_name, label: w.ref_name}})
									 	}"
									 />
								</q-input>
								<q-input 
									class="col-3" 
									type="text" 
									align="center" 
									stack-label="Страница" 
									v-model="work_form.ref_page" 
									:error="!work_form.ref_page"
								/>
								<q-select 
									class="col-3" 
									align="center" 
									v-model="work_form.units" 
									stack-label="Ед. изм"
									:options="$store.state.main.units.map(u => {return {label: u.name, value: u.id}})" 
									separator 
									:error="!work_form.units"
								/>
								<q-input 
									class="col-3" 
									type="number"
									:decimals="2"
									align="center" 
									v-model="work_form.pricing" 
									stack-label="Расценка" 
									:error="!work_form.pricing"
								/>
							</div>
							<div class="row justify-around items-center">
								<div class="col-12 round-borders text-center text-white glossy q-py-sm shadow-1 q-my-sm bg-indigo">
									Выполнение
								</div>
								<q-input 
									class="col-md-2 col-xs-5" 
									type="number"
									:decimals="2"
									align="center" 
									v-model="work_form.rate" 
									stack-label="Норма выработки" 
									:error="!work_form.rate"
								/>
								<q-input 
									class="col-md-2 col-xs-5" 
									type="number" 
									:decimals="2"
									align="center" 
									v-model="work_form.complete_nature" 
									stack-label="В натуре" 
									:error="!work_form.complete_nature"
								/>
								<q-input 
									readonly 
									hide-underline 
									class="col-md-2 col-xs-5 shadow-1" 
									type="number" 
									align="center" 
									v-model="work_form.complete_norms" 
									stack-label="Сменных норм" 
								/>
								<q-input 
									:error="!work_form.hours"
									class="col-md-2 col-xs-5" 
									type="number" 
									align="center" 
									v-model="work_form.hours" 
									stack-label="Отработано часов" 
								/>
							</div>
							<div class="row justify-around items-center">
								<div class="col-12 round-borders text-center text-white glossy q-py-sm shadow-1 q-my-sm bg-indigo">
									Оплата
								</div>
								<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="col-2 shadow-1" 
								align="center" 
								v-model="work_form.amount" 
								stack-label="Основная" 
								/>
								<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="col-2 shadow-1" 
								align="center" 
								v-model="work_form.bonus" 
								stack-label="Премия" 
								/>
								<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="col-2 shadow-1" 
								align="center" 
								v-model="work_form.complexity" 
								stack-label="Сложность" 
								/>
								<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="col-2 shadow-1" 
								align="center" 
								v-model="work_form.classines" 
								stack-label="Классность" 
								/>
								<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="col-2 shadow-1" 
								align="center" 
								v-model="work_form.amount_total" 
								stack-label="Всего" 
								/>
							</div>
							<div class="row justify-around items-center">
								<div class="col-12 round-borders text-center text-white glossy q-py-sm shadow-1 q-my-sm bg-indigo">
									Расход горючего
								</div>
								<q-input 
									type="number" 
									:decimals="2"
									class="col-3" 
									align="center" 
									v-model="work_form.distance" 
									stack-label="Расстояние" 
								/>
								<q-input 
									type="number"
									:decimals="2" 
									class="col-3" 
									align="center" 
									v-model="work_form.fuel_per_unit" 
									stack-label="На ед. работы" 
									:error="!work_form.fuel_per_unit"
								/>
								<q-input 
									type="number" 
									readonly 
									hide-underline 
									class="col-2 shadow-1" 
									align="center" 
									v-model="work_form.fuel" 
									stack-label="Всего" 
								/>
								<q-input 
									type="number" 
									readonly 
									hide-underline 
									class="col-2 shadow-1" 
									align="center" 
									v-model="work_form.fuel" 
									stack-label="Фактически" 
								/>
							</div><br/>
						</div>
						<q-toolbar color="indigo" class="justify-around">
							<q-btn 
							 icon="save" 
							 label="Сохранить" 
							 @click.native="saveWork(false)" 
							 :disabled="!workFormIsValid" 
							 glossy 
							 color="positive"
							 dense
							 class="q-px-sm"
							 />
							<q-btn 
							icon="fas fa-copy"
							label="Копия" 
							dense
							class="q-px-sm"
							glossy
							color="primary"
							:disabled="!workFormIsValid" 
							@click.native="saveWork(true)" 
							/>
							<q-btn 
							icon="close" 
							label="Отмена" 
							color="negative" 
							dense 
							class="q-px-sm"
							glossy 
							v-close-overlay 
							/>
						</q-toolbar>
					</q-modal>		
				</template>
	            <q-td slot="body-cell-options" slot-scope="props" :props="props" style="padding: 5px !important;">
	              <q-btn-dropdown icon="menu" dense color="primary" glossy style="width: 60px;">
	                <q-list link separator>
	                    <q-item @click.native="editWork(props.row)" v-close-overlay>
	                      <q-item-side icon="edit" color="primary" />
	                      <q-item-main label="Редактировать"/>
	                    </q-item>
	                  <q-item @click.native="form.works = form.works.filter(w => w !== props.row)">
	                    <q-item-side icon="delete" color="negative" />
	                    <q-item-main label="Удалить"/>
	                  </q-item>
	                </q-list>
	              </q-btn-dropdown>
	            </q-td>
	           
				<template slot="bottom-row" slot-scope="props" v-if="form.works.length > 0">
					<q-tr class="text-bold footr">
						<q-td colspan="9">Итого:</q-td>
						<q-td>{{ form.total_hours }}</q-td>
						<q-td colspan="2"></q-td>
						<q-td>{{ form.total_complete_nature }}</q-td>
						<q-td>{{ form.total_complete_norms }}</q-td>
						<q-td>{{ form.amount }}</q-td>
						<q-td>{{ form.amount_bonus }}</q-td>
						<q-td>{{ form.amount_complexity }}</q-td>
						<q-td>{{ form.amount_classines }}</q-td>
						<q-td>{{ form.amount_total }}</q-td>
						<q-td></q-td><q-td></q-td>
						<q-td>{{ form.total_fuel }}</q-td>
					</q-tr>
				</template>
			</q-table>
		</q-step>
		<q-step name="summary" title="Итоги" icon="assignment_turned_in" class="fit" active-icon="assignment_turned_in">
			<div class="row text-center flex-center">
				<div class="col-md-10">
					<q-toolbar color="indigo" glossy class="round-borders">
						<q-toolbar-title>Итоги</q-toolbar-title>
					</q-toolbar>
					<table cellspacing="0" cellpadding="2" class="full-width summary-table">
						<tr>
							<td width="50%">Отработано часов:</td>
							<td>{{ form.total_hours }}</td>
						</tr>
						<tr>
							<td>Выполнено в натуре:</td>
							<td>{{ form.total_complete_nature }}</td>
						</tr>
						<tr>
							<td>Выполнено норм:</td>
							<td>{{ form.total_complete_norms }}</td>
						</tr>
						<tr>
							<td>Оплата, основная:</td>
							<td>{{ form.amount }}</td>
						</tr>
						<tr>
							<td>Оплата, премия:</td>
							<td>{{ form.amount_bonus }}</td>
						</tr>
						<tr>
							<td>Оплата, сложность:</td>
							<td>{{ form.amount_complexity }}</td>
						</tr>
						<tr>
							<td>Оплата, классность:</td>
							<td>{{ form.amount_classines }}</td>
						</tr>
						<tr>
							<td>Оплата, Всего:</td>
							<td>{{ form.amount_total }}</td>
						</tr>
						<tr>
							<td>Расход горючего:</td>
							<td>{{ form.total_fuel }}</td>
						</tr>
						<tr>
							<td>Остаток горючего при выдаче листа:</td>
							<td>{{ form.fuel_dep }}</td>
						</tr>
						<tr>
							<td>Получено (заправлено) горючего:</td>
							<td align="center" class="q-pa-xs">
								<q-input 
									type="number" 
									:decimals="2"
									align="center"
									:value="form.fuel_issued"
									@input="val => { form.fuel_issued = val.toFixed(2) }"
									hide-underline
									style="width: 150px; border: 1px solid"
									placeholder="Введите значение"
									class="text-center" 
								/>
							</td>
						</tr>
						<tr>
							<td>Остаток горючего при сдаче листа:</td>
							<td>{{ form.fuel_ret }}</td>
						</tr>
					</table>
				</div>
			</div>
		</q-step>
		<q-stepper-navigation class="bg-indigo no-margin glossy">
			<div class="group q-pa-sm row fit justify-center">
				<q-btn glossy label="Назад" :disabled="step == 'main'" @click.native="$refs.stepper.previous()" color="primary" icon="arrow_left" />
				<q-btn :disabled="!formIsValid" v-if="step == 'summary'" label="Сохранить" @click.native="saveRegForm()" color="positive" glossy />
				<q-btn :disabled="!stepIsComplete" glossy v-else label="Далее" @click.native="$refs.stepper.next()" color="positive" icon-right="arrow_right" />
			</div>
		</q-stepper-navigation>

	</q-stepper>
</q-page>
</template>

<script>
export default {
	name: 'TractorRegFormNewPage',
	data() {
		return {
			step: 'main',
			workDialog: false,
			// Main form
			form: {
				organization: null,
				event: null,
				driver: null,
				car: null,
				trailerman: null,
				station: null,
				departament: null,
				brigadier: null,
				trailer: null,
				date: null,
				table_number: null,
				bonus: null,
				complexity: null,
				classines: null,
				brigade: null,
				works: [],
				total_hours: null,
				total_complete_nature: null,
				total_complete_norms: null,
				amount: null,
				amount_bonus: null,
				amount_complexity: null,
				amount_classines: null,
				amount_total: null,
				fuel_dep: null,
				fuel_issued: null,
				fuel_ret: null,
				total_fuel: null
			},
			// Work form
			work_form: {
				date: null,
				event: null,
				quarter: null,
			    allotment: null,
			    area: null,
			    ref_name: null,
			    ref_page: null,
			    units: null,
			    hours: null,
			    rate: null,
			    pricing: null,
			    complete_nature: null,
			    complete_norms: null,
			    amount: null,
			    bonus: null,
			    complexity: null,
			    classines: null,
			    amount_total: null,
			    distance: null,
			    fuel_per_unit: null,
			    fuel: null,
			},
			// Fetched options
			options: {
				workers: [],
				cars: [],
				organizations: [],
				stations: [],
				events: []
			},
			// Required fields
			required: [
				'organization', 'station', 'event', 'car', 'driver', 'brigadier',
				'date',
			],
			// Columns for work table
			columns: [
				{name: 'options', label: 'Опции', field: '__index'},
				{name: 'date', label: 'Дата', 
					field: work => new Date(work.date).toLocaleDateString('ru', {day: '2-digit', month: '2-digit'})
				},
				{name: 'event', label: 'Наименование', field: 'event'},
				{name: 'quarter', label: 'Квартал', field: 'quarter'},
				{name: 'allotment', label: 'Выдел', field: 'allotment'},
				{name: 'area', label: 'Площадь', field: 'area'},
				{name: 'ref_name', label: 'Справочник:\n наименование', field: 'ref_name'},
				{name: 'ref_page', label: 'Справочник:\n страница', field: 'ref_page'},
				{name: 'units', label: 'Ед.\n измерения',
					field: work => this.$store.state.main.units.find(u => u.id == work.units).short
				},
				{name: 'hours', label: 'Часы', field: 'hours'},
				{name: 'rate', label: 'Нормы\n выработки', field: 'rate'},
				{name: 'pricing', label: 'Расценка', field: 'pricing'},
				{name: 'complete_nature', label: 'Выполнено:\n в натуре', field: 'complete_nature'},
				{name: 'complete_norms', label: 'Выполнено:\n норм', field: 'complete_norms'},
				{name: 'amount', label: 'Оплата:\n основная', field: 'amount'},
				{name: 'bonus', label: 'Оплата:\n премия', field: 'bonus'},
				{name: 'complexity', label: 'Оплата:\n сложность', field: 'complexity'},
				{name: 'classines', label: 'Оплата:\n классность', field: 'classines'},
				{name: 'amount_total', label: 'Оплата:\n всего', field: 'amount_total'},
				{name: 'distance', label: 'Км', field: 'distance'},
				{name: 'fuel_per_unit', label: 'Расход горючего:\n на еденицу работы', field: 'fuel_per_unit'},
				{name: 'fuel', label: 'Расход горючего:\n всего', field: 'fuel'},
			]
		}
	},
	methods: {
		// HTTP-GET organizations
		getOrganizations() {
			this.$axios.get('/api/v1/organizations/')
			.then(r => { this.options.organizations = r.data.organizations })
			.catch(e => {
				this.$handleError(e);
			})
		},
		// HTTP-GET stations
		getStations() {
			this.$axios.get('/api/v1/stations/')
			.then(r => { this.options.stations = r.data.stations })
			.catch(e => {
				this.$handleError(e);
			})
		},
		// HTTP-GET cars by kind
		getCars() {
			var params = {kind: 'T'};
			this.$axios.get('/api/v1/car/', { params })
			.then(r => {
		 		this.options.cars = r.data.cars;
			  })
			.catch(e => {
				this.$handleError(e);
			})
		},
		// HTTP-GET workers by station
		getWorkers() {
			const params = {station: this.form.station};
			this.$axios.get('/api/v1/workers/', { params })
			.then(r => { 
				this.options.workers = r.data.workers;
			 }).catch(e => {
				this.$handleError(e);
			})
		},
		// HTTP-GET events
		getEvents() {
			this.$axios.get('/api/v1/outfit_events/')
			.then(r => { 
				this.options.events = r.data.outfit_events;
			 }).catch(e => {
				this.$handleError(e);
			})
		},
		addEvent() {
			this.$q.dialog({
				message: 'Введите название',
				prompt: {
					model: '',
					type: 'text'
				},
				ok: { label: 'Сохранить', color: 'positive'},
				cancel: { label: 'Отмена', color: 'negative'},
			}).then(data => {
				if (data.trim() != '') {
					this.$axios.post('/api/v1/outfit_events/', { name: data.trim()})
					.then(response => {
						this.options.events.push(response.data);
						this.form.event = response.data.id;
					}).catch(e => {
						this.$handleError(e);
					})
				}
			}).catch(() => {})
		},
		// Clear work form fields
		resetWorkForm() {
			delete this.work_form['__index'];
			Object.keys(this.work_form).forEach(v => this.work_form[v] = null);
		},
		calcFuel() {
			const distance = this.work_form.distance || this.work_form.complete_nature,
			fuel_per_unit = this.work_form.fuel_per_unit;
			if (fuel_per_unit && distance) {
				this.work_form.fuel = (parseFloat(fuel_per_unit) * parseFloat(distance)).toFixed(2);
			}
		},
		// Calculate work
		calcWork() {
			const main_bonus = this.form.bonus,
			main_complexity = this.form.complexity,
			main_classines = this.form.classines,
			
			rate = this.work_form.rate,
			pricing = this.work_form.pricing,
			done = this.work_form.complete_nature;

			if (rate && pricing && done) {
				var done_norms = done / rate,
				amount = pricing * done_norms,
				bonus = amount * main_bonus / 100,
				complexity = amount * main_complexity / 100,
				classines = amount * main_classines / 100;

				this.work_form.complete_norms = done_norms.toFixed(2);
				this.work_form.amount = amount.toFixed(2);
				this.work_form.bonus = bonus.toFixed(2);
				this.work_form.complexity = complexity.toFixed(2);
				this.work_form.classines = classines.toFixed(2);
				this.work_form.amount_total = (amount + bonus + complexity + classines).toFixed(2);
			}

		},
		// Save form of added/edited work
		saveWork(copy) {
			if (this.workFormIsValid) {
				const data = JSON.parse(JSON.stringify(this.work_form));
		        if (data.hasOwnProperty('__index') && data['__index'] != null && !copy) {
		          this.form.works[data['__index']] = data;
		          this.form.works.sort();
		        } else {
		          this.form.works.push(data);
		        }
		        if (!copy) {
		        	this.workDialog = false;
		        }
			}
		},
		// Set work instance to work form
		editWork(work) {
			Object.keys(work).forEach(k => this.work_form[k] = work[k]);
			this.workDialog = true;
		},
		// HTTP-POST regform and print out if needed
		saveRegForm(print) {
			if (this.formIsValid) {
				const data = JSON.stringify(this.form);
				this.$axios.post('/api/v1/tractor-regform/', data)
				.then(response => {
					this.done(response.data.id);
				}).catch(e => {
					this.$handleError(e);
				})
			}
		},
		done(id) {
        this.$q.dialog({
          title: 'Готово',
          message: 'Открыть печатную форму?',
          ok: true, cancel: true
        }).then(() => {
          this.$router.push({name: 'RegFormPrint', params: { id }});
        }).catch(() => {
          this.$router.push({name: 'TractorRegFormList'});
        })
      },
	},
	mounted() {
		this.getOrganizations();
		this.getStations();
		this.getCars();
		this.getEvents();
	},
	watch: {
		// On change station - reset workers and get workers
		'form.station': function(st) {
			if (st) {
				this.form.driver = this.form.brigadier = this.form.trailerman = null;
				this.getWorkers();
			}
		},
		'form.fuel_issued': function(val) {
			if (val) {
				this.form.works.sort();
			}
		},
		// On change car - set fuel balance on departure
		'form.car': function(id) {
			if (id) {
				var car = this.options.cars.find(c => c.id == id);
				this.form.fuel_dep = car.fuel_balance;
				this.form.works.sort();
			}
		},
		// On change rate, complete, pricing and fuel per unit - recalculate works
		'work_form.rate': function(val) {
			if (val) {
				this.calcWork()
			}
		},
		'work_form.complete_nature': function(val) {
			if (val) {
				this.calcWork();
				if (!this.work_form.distance) {
					this.calcFuel();
				}
			}
		},
		'work_form.pricing': function(val) {
			if (val) {
				this.calcWork();
			}
		},
		'work_form.fuel_per_unit': function(val) {
			if (val) {
				this.calcFuel();
			}
		},
		'work_form.distance': function(val) {
				this.calcFuel();
		},
		// On add/remove works - recalculate total form data
		'form.works': function() {
			var total_hours = 0,
			total_complete_nature = 0,
			total_complete_norms = 0,
			amount = 0,
			amount_bonus = 0,
			amount_complexity = 0,
			amount_classines = 0,
			amount_total = 0,
			total_fuel = 0;

			this.form.works.forEach(work => {
				total_hours += parseFloat(work.hours);
				total_complete_nature += parseFloat(work.complete_nature);
				total_complete_norms += parseFloat(work.complete_norms);
				amount += parseFloat(work.amount);
				amount_bonus += parseFloat(work.bonus);
				amount_complexity += parseFloat(work.complexity);
				amount_classines += parseFloat(work.classines);
				amount_total += parseFloat(work.amount_total);
				total_fuel += parseFloat(work.fuel);
			})
			var fuel_issued = this.form.fuel_issued || 0;
			this.form.fuel_ret = (parseFloat(this.form.fuel_dep) + parseFloat(fuel_issued) - total_fuel).toFixed(2);
			this.form.total_hours = total_hours.toFixed(2);
			this.form.total_complete_nature = total_complete_nature.toFixed(2);
			this.form.total_complete_norms = total_complete_norms.toFixed(2);
			this.form.amount = amount.toFixed(2);
			this.form.amount_bonus = amount_bonus.toFixed(2);
			this.form.amount_complexity = amount_complexity.toFixed(2);
			this.form.amount_classines = amount_classines.toFixed(2);
			this.form.amount_total = amount_total.toFixed(2);
			this.form.total_fuel = total_fuel.toFixed(2);
		},
	},
	computed: {
		// Checker for work form completing
		workFormIsValid() {
			return Object.keys(this.work_form)
			.filter(k => k != 'distance')
			.every(field => this.work_form[field] !== null && this.work_form[field] !== '');
			//return Object.values(this.work_form).every(v => v !== null && v !== '');
		},
		// Checker for main form completing
		formIsValid() {
			if (this.form.works.length > 0 && this.required.every(field => this.form[field] != null)) {
				return true;
			}
		},
		// Check for current step completing
		stepIsComplete() {
			switch(this.step) {
				case 'main':
					return this.required.every(field => this.form[field] !== null);
				case 'works':
					return this.form.works.length > 0;
				default:
					return false;
			}
		}
	}
}
</script>

<style>
	.work-table th{ white-space: pre; text-align: center; padding: 0 5px !important;}
	.work-table td{ text-align: center; padding: 0 !important;}
	.work-table {width: 100%; table-layout: fixed}
	.summary-table td {border: 1px solid lightgrey;}
	.summary-table td:nth-child(odd) {font-weight: bold}
	 .q-stepper-step-inner { padding: 5px !important; }
	.text-bold td {font-weight: bold !important; text-align: center;}
	.work-form	.q-if-label {  text-align: center; width: 100%;}
	.q-popover.column {max-width: 400px !important;}
	
</style>