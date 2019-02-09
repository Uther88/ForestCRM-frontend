<template>
	<div id="handout">
		<div class="bg-indigo q-pa-sm shadow-1">
			<div class="shadow-1 row grou flex-center">
				<q-field label="Участок" class="col-md-5 col-xs-12" label-width="4">
					<q-select
					v-model="form.station"
					placeholder="Выберите участок"
					:options="options.stations.map(s => { return { label: s.name, value: s.id }})"
					class="bg-white" align="center"
					separator
					/>
				</q-field>
				<q-field label="Автомобиль" class="col-md col-xs-12">
					<q-select
					v-model="form.car"
					placeholder="Выберите автомобиль"
					:options="options.cars.map(c => { return { label: c.full_name, value: c.id }})"
					class="bg-white" align="center"
					filter
					separator

					/>
				</q-field>
			</div>
			<div class="shadow-1 row flex-center">
				<q-field label="Работник" class="col-md-5 col-xs-12" label-width="4">
					<q-select
					v-model="form.worker"
					placeholder="Выберите работника"
					:options="options.workers.map(w => { return { label: w.full_name, value: w.id }})"
					class="bg-white" align="center"
					filter
					separator
					/>
				</q-field>
				<q-field label="Период" class="col-md-3 col-xs-12">
					<q-datetime
					type="date"
					default-view="month"
					:value="form.date"
					placeholder="Выберите месяц"
					modal
					format="MM-YYYY"
					class="bg-white" align="center"
					@input="val => {form.date = new Date(val).toLocaleDateString('EU')}" 
					/>
				</q-field>
				<div class="col-md text-center group">
					<q-btn icon="search" :color="is_valid ? 'primary' : 'negative'" :disabled="!is_valid" glossy label="Поиск" @click.native="getWaybills" />
					<q-btn icon="save" label="Сохранить" :color="is_completed ? 'positive' : 'negative'" :disabled="!is_completed" glossy @click.naive="saveHandout" />
				</div>
			</div>
		</div>
		<div class="row q-pa-xs">
			<q-table 
			:data="options.waybills"
			:columns="columns"
			separator="cell"
			class="full-width"
			hide-bottom
			:pagination="{rowsPerPage: 0}"
			table-class="outfits-table"
			>
				<q-tr slot="bottom-row" slot-scope="props" class="text-center">

					<q-td style="font-weight: bold; text-align: left;" colspan="5">Итого</q-td>
					<q-td style="font-weight: bold;">
						{{ options.waybills.map(wb => wb.fuel_issued).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)}}
					</q-td>
				</q-tr>
			</q-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'HandoutNewPage',
		data() {
			return {
				form: {
					station: null,
					date: null,
					worker: null,
					car: null,
					waybills: [],
				},
				options: {
					stations: [],
					workers: [],
					cars: [],
					waybills: [],
				},
				columns: [
					{ name: 'count', label: 'п/п', align: 'center', field: wb => wb.__index + 1 },
					{ 
						name: 'date', label: 'Дата', align: 'center', 
						field: wb => new Date(wb.date).toLocaleDateString('RU', { day: '2-digit', month: '2-digit' }) 
					},
					{ name: 'number', label: '№', align: 'center', field: 'number' },
					{
						name: 'driver', label: 'Водитель', align: 'center', 
						field: wb => wb.driver.full_name 
					},
					{ name: 'fuel', label: 'Тип топлива', align: 'center', field: 'fuel' },
					{ name: 'fuel_issued', label: 'Выдано топлива', align: 'center', field: 'fuel_issued' }
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
			getCars() {
				var params = {kind__in: 'H,L' };
				this.$axios.get('/api/v1/car/', { params })
				.then(response => {
					this.options.cars = response.data.cars;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET waybills
			getWaybills() {
				if (this.is_valid) {
					this.$q.loading.show();
					this.form.waybills = [];
					this.options.waybills = [];
					const params = {
						station: this.form.station,
						driver: this.form.worker,
						date__month: new Date(this.form.date).getMonth() + 1,
						car: this.form.car,
						fuel_issued__gt: 0,
					}
					this.$axios.get('/api/v1/waybill/', { params })
					.then(response => {
						this.options.waybills = response.data.waybills;
						this.options.waybills.forEach(wb => this.form.waybills.push(wb.id));
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.$q.loading.hide();
					})
				}
			},
			saveHandout() {
				if (this.is_completed) {
					const data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/handouts/', data)
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
					this.$router.push({name: 'HandoutPrint', params: { id }});
				}).catch(() => {
					this.$router.push({name: 'HandoutList'});
				})
			},
		},
		computed: {
			is_completed() {
				return this.form.waybills.length;
			},
			is_valid() {
				return (
					this.form.date && this.form.station &&
					this.form.car && this.form.worker 
					)
			},
		},
		mounted() {
			this.getStations();
			this.getWorkers();
			this.getCars();
		},
	}
</script>
<style>
	#handout .q-field-label-inner { color: white; justify-content: center; font-weight: bold;}
	#handout .outfits-table th {white-space: pre-wrap;}
</style>