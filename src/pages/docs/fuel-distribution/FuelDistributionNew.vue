<template>
	<div id="fuel-distribution">
		<div class="bg-indigo q-pa-xs">
			<div class="row group flex-center">
				<q-field label="Тип" class="col-md-4 col-xs-12" label-width="4">
					<q-select
					v-model="form.kind"
					placeholder="Выберите тип"
					:options="$store.state.main.fd_kinds"
					class="bg-white" align="center"
					filter
					separator
					:disable="form.documents.length > 0"
					/>
				</q-field>
				<q-field label="Участок" class="col-md col-xs-12" label-width="4">
					<q-select
					v-model="form.station"
					placeholder="Выберите участок"
					:options="options.stations.map(s => { return { label: s.name, value: s.id }})"
					class="bg-white" align="center"
					separator
					:disable="form.documents.length > 0"
					/>
				</q-field>
				<q-field v-if="form.kind !== 'OF'" :label="form.kind == 'TR' ? 'Трактор' : 'Автомобиль'" class="col-md col-xs-12">
					<q-select
					v-model="form.car"
					placeholder="Выберите автомобиль"
					:options="options.cars.map(c => { return { label: c.full_name, value: c.id }})"
					class="bg-white" align="center"
					filter
					separator
					:disable="form.documents.length > 0"
					/>
				</q-field>
			</div>
			<div class="row group flex-center">
				<q-field 
				:label="form.kind == 'WB' ? 'Водитель' : 
				form.kind == 'OF' ? 'Бригадир' : form.kind == 'TR' ? 
				'Тракторист' : 'Работник'" 
				class="col-md-4 col-xs-12" label-width="4">
					<q-select
					v-model="form.worker"
					placeholder="Выберите работника"
					:options="options.workers.map(w => { return { label: w.full_name, value: w.id }})"
					class="bg-white" align="center"
					filter
					separator
					:disable="form.documents.length > 0"
					/>
				</q-field>
				<q-field label="Период" class="col-md col-xs-12" label-width="4">
					<q-datetime
					type="date"
					default-view="month"
					:value="form.date"
					placeholder="Выберите месяц"
					modal
					format="MM-YYYY"
					class="bg-white" align="center"
					@input="val => {form.date = new Date(val).toLocaleDateString('EU')}" 
					:disable="form.documents.length > 0"
					/>
				</q-field>
				<div class="col-md text-center group">
					<q-btn icon="search" :color="is_valid ? 'primary' : 'negative'" :disabled="!is_valid" glossy label="Поиск" @click.native="getDocuments" />
					<q-btn icon="save" label="Сохранить" :color="is_completed ? 'positive' : 'negative'" :disabled="!is_completed" glossy @click.naive="saveFuelDistribution" />
					<q-btn icon="clear" @click.native="resetForm" color="primary" label="сброс" glossy />
				</div>
			</div>
		</div>
		<div class="row q-pa-xs">
			<q-table 
			:data="options.documents"
			:columns="columns"
			separator="cell"
			class="full-width"
			hide-bottom
			:pagination="{rowsPerPage: 0}"
			table-class="fuel-distribution-table"
			>
				<q-tr slot="bottom-row" slot-scope="props" class="text-center">

					<q-td style="font-weight: bold; text-align: left;" colspan="3">Итого</q-td>
					<q-td style="font-weight: bold;">
						{{ form.total_fuel }}
					</q-td>
				</q-tr>
			</q-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'FuelDistributionNewPage',
		data() {
			return {
				form: {
					kind: null,
					station: null,
					date: null,
					worker: null,
					car: null,
					documents: [],
					total_fuel: 0,
				},
				options: {
					stations: [],
					workers: [],
					cars: [],
					documents: [],
				},
				columns: [
					{ 
						name: 'date', label: 'Дата', align: 'center', 
						field: doc => new Date(doc.begin || doc.date).toLocaleDateString('RU') 
					},
					{ name: 'number', label: '№', align: 'center', field: doc => doc.number || doc.id },
					{ name: 'event', label: 'Вид работ', align: 'center', field: doc => doc.event.full_name },
					{ name: 'total_fuel', label: 'Всего ГСМ', align: 'center', field: 'total_fuel' }
				],
			}
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
			// HTTP-GET workers
			getWorkers() {
				this.$axios.get('/api/v1/workers/')
				.then(response => {
					this.options.workers = response.data.workers;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET cars
			getCars(params) {
				this.$axios.get('/api/v1/car/', { params })
				.then(response => {
					this.options.cars = response.data.cars;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			resetForm() {
				this.form.car = null;
				this.form.station = null;
				this.form.date = null;
				this.form.kind = null;
				this.form.worker = null;
				this.form.total_fuel = 0;
				this.form.documents = [];
				this.options.documents = [];
			},

			// HTTP-GET waybills
			getDocuments() {
				if (this.is_valid) {
					this.$q.loading.show();
					this.form.documents = [];
					this.options.documents = [];
					var url, resource;
					var params = {
						station: this.form.station,
						'fuel_distribution__isnull': true,
					};
					switch (this.form.kind) {
						case 'WB':
							url = 'waybill';
							resource = 'waybills';
							params['date__month'] = new Date(this.form.date).getMonth() + 1;
							params['car'] = this.form.car;
							params['driver'] = this.form.worker;
							break;
						case 'OF':
							url = 'outfit';
							resource = 'outfits';
							params['begin__month'] = new Date(this.form.date).getMonth() + 1;
							params['brigadier'] = this.form.worker;
							params['gsm'] = true;
							params['expenses__quantity_fact__gt'] = 0;
							break;
						case 'TR':
							url = 'tractor-regform';
							resource = 'regforms';
							params['date__month'] = new Date(this.form.date).getMonth() + 1;
							params['car'] = this.form.car;
							params['driver'] = this.form.worker;
							break;
					};
					this.$axios.get('/api/v1/' + url + '/', { params })
					.then(response => {
						response.data[resource].forEach(d => {
							this.options.documents.push(d);
							this.form.documents.push(d.id);
						})
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.$q.loading.hide();
					})
				}
			},
			saveFuelDistribution() {
				if (this.is_completed) {
					const data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/fuel-distributions/', data)
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
					this.$router.push({name: 'FuelDistributionPrint', params: { id }});
				}).catch(() => {
					this.$router.push({name: 'FuelDistributionList'});
				})
			},
		},
		computed: {
			is_completed() {
				return this.form.documents.length;
			},
			is_valid() {
				if (this.form.kind == 'OF') {
					return (
						this.form.date && this.form.station &&
						this.form.worker && this.form.kind
						)
				} else {
					return (
						this.form.date && this.form.station &&
						this.form.car && this.form.worker && this.form.kind
						)
				}
			},
		},
		mounted() {
			this.getStations();
			this.getWorkers();
		},
		watch: {
			'form.kind': function(kind) {
				if (kind == 'TR') {
					this.getCars({kind: 'T'});
				} else if (kind == 'WB') {
					this.getCars({kind__in: 'H,L'});
				}
			},
			'options.documents': function(documents) {
				var total_fuel = 0;
				documents.forEach(doc => {
					total_fuel += parseFloat(doc.total_fuel);
				})
				this.form.total_fuel = total_fuel.toFixed(2);
			}	
		},
	}
</script>
<style>
	#fuel-distribution .q-field-label-inner { color: white; justify-content: center; font-weight: bold;}
	#handout .outfits-table th {white-space: pre-wrap;}
</style>