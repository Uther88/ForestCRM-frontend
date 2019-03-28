<template>
		<q-btn icon="search" color="primary" glossy label="Поиск" @click="showSearchDialog = true">
			<q-modal
				v-model="showSearchDialog"
				v-if="showSearchDialog"
				content-css="min-width: 40vw; min-height: 35vh; max-height: 100%;"
				content-classes="flex column justify-between"
				@hide="clearForm"
			>
				<q-toolbar>
					<q-toolbar-title>
						Поиск документов
					</q-toolbar-title>
					<q-btn flat v-close-overlay icon="close" />
				</q-toolbar>
				<div class="q-px-sm">
					<q-field label="Номер" v-if="options.some(o => o.type == 'number')" label-width="3">
						<q-input clearable type="number" v-model="form.number" />
					</q-field>
					<q-field label="Дата" v-if="options.some(o => o.type == 'date')" label-width="3">
						<q-datetime 
						clearable 
						type="date" 
						:value="form.date"
						@input="val => {val ? form.date = new Date(val).toLocaleDateString('EU') : form.date = null}"
						format="DD.MM.YYYY" />
					</q-field>
					<q-field label="Период" v-if="options.some(o => o.type == 'month')" label-width="3">
						<q-datetime 
						clearable 
						type="date" 
						:value="form.month"
						@change="val => {val ? form.month = new Date(val).toLocaleDateString('EU') : form.month = null }"
						format="MM.YYYY" 
						modal
						default-view="month" />
					</q-field>
					<q-field label="Участок" v-if="options.some(o => o.type == 'station')" label-width="3">
						<q-select 
						:options="stations.map(s => {return {label: s.name, value: s.id}})" 
						separator 
						clearable
						v-model="form.station" />
					</q-field>
					<q-field label="Отдел" v-if="options.some(o => o.type == 'departament')" label-width="3">
						<q-select :options="$store.state.main.departaments" clearable separator v-model="form.departament" />
					</q-field>
					<q-field label="Вид работ" v-if="options.some(o => o.type == 'event')" label-width="3">
						<q-select 
						:options="events.map(e => {return {label: e.full_name, value: e.id}})"
						separator
						clearable
						v-model="form.event" />
					</q-field>
					<q-field label="Работник" v-if="options.some(o => o.type == 'worker')" label-width="3">
						<q-select 
						:options="workers.map(w => {return {label: w.full_name, value: w.id}})" 
						separator
						clearable
						v-model="form.worker" />
					</q-field>
					<q-field label="Автомобиль" v-if="options.some(o => o.type == 'car')" label-width="3">
						<q-select 
						:options="cars.map(c => {return {label: c.full_name, value: c.id}})" 
						separator 
						clearable
						v-model="form.car" />
					</q-field>
					<q-field label="Тип" v-if="options.some(o => o.type == 'kind')" label-width="3">
						<q-select 
						:options="$store.state.main.fd_kinds" 
						separator 
						clearable
						v-model="form.kind" />
					</q-field>
				</div>
				<q-toolbar class="justify-center group self-end">
					<q-btn icon="search" label="Поиск" color="positive" @click="searchDocument" :disabled="!is_valid" v-close-overlay />
					<q-btn v-close-overlay icon="close" label="Отмена" color="negative" />
				</q-toolbar>
			</q-modal>
		</q-btn>
</template>

<script>
	export default {
		name: 'SearchingPanel',
		props: {
			search: {required: true, type: Function},
			options: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				form: {
					number: null,
					car: null,
					station: null,
					event: null,
					worker: null,
					departament: null,
					date: null,
					month: null,
					kind: null,
				},
				stations: [],
				events: [],
				workers: [],
				cars: [],
				showSearchDialog: false,
				field: null,
				value: null,
				fetched_data: [],
			}
		},
		computed: {
			// Check for completing some field
			is_valid() {
				return Object.values(this.form).some(v => v != null && v != '');
			},
		},
		methods: {
			// Call-back function on press Search
			searchDocument() {
				if (this.is_valid) {
					var params = {};
					this.options.forEach(o => {
						if (this.form[o.type] != null && this.form[o.type] != '') {
							if (o.type == 'month') {
								params[o.name] = new Date(this.form[o.type]).getMonth() + 1;
							} else {
								params[o.name] = this.form[o.type];
							}
						}
					})
					this.search(params);
				}
			},
			// HTTP-GET stations
			getStations() {
				this.$axios.get('/api/v1/stations/')
				.then(response => {
					this.stations = response.data.stations;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET cars
			getCars() {
				this.$axios.get('/api/v1/car/')
				.then(response => {
					this.cars = response.data.cars;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET workers
			getWorkers() {
				this.$axios.get('/api/v1/workers/')
				.then(response => {
					this.workers = response.data.workers;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET events
			getEvents() {
				this.$axios.get('/api/v1/outfit_events/')
				.then(response => {
					this.events = response.data.outfit_events;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// Reset search form
			clearForm() {
				Object.keys(this.form).forEach(k => this.form[k] = null);
			},
		},
		mounted() {
			// Get data from backend by props
			if (this.options.find(o => o.type == 'station')) {
				this.getStations();
			}
			if (this.options.find(o => o.type == 'worker')) {
				this.getWorkers();
			}
			if (this.options.find(o => o.type == 'car')) {
				this.getCars();
			}
			if (this.options.find(o => o.type == 'event')) {
				this.getEvents();
			}
		},
	}
</script>

<style>
	
</style>