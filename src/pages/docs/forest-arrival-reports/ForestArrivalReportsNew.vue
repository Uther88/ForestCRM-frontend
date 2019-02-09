<template>
	<div id="forest-arrival-report">
		<div class="row bg-indigo glossy group full-width flex-center q-px-xs">
			<q-field label="Участок" class="col-md-4 col-xs-12" label-width="3">
				<q-select
				v-model="form.station"
				placeholder="Выберите участок"
				:options="options.stations.map(s => { return { label: s.name, value: s.id }})"
				class="bg-white" align="center"
				/>
			</q-field>
			<q-field label="Период" class="col-md-2 col-xs-12">
				<q-datetime
				type="date"
				default-view="month"
				:value="form.date"
				placeholder="Выбрать"
				modal
				format="MM-YYYY"
				class="bg-white" align="center"
				@input="val => {form.date = new Date(val).toLocaleDateString('EU')}" 
				/>
			</q-field>
			<div class="col-md-auto col-xs-12 text-center group">
				<q-btn icon="search" color="primary" glossy label="Сформировать" @click.native="getPostings" :disabled="!(form.station && form.date)" />
				<q-btn icon="save" label="Сохранить" :disabled="!form.postings.length" :color="form.postings.length ? 'positive' : 'negative' " glossy @click.naive="saveReport" />
			</div>
		</div>
		<q-table
		 :data="options.postings"
		 :columns="columns"
		 :loading="loading"
		 separator="cell"
		 dense
		 :pagination="{rowsPerPage:0}"
		>
		</q-table>
	</div>
</template>

<script>
	export default {
		name: 'ForestArrivalReportNew',
		data() {
			return {
				loading: false,
				form: {
					station: null,
					date: null,
					postings: [],
				},
				options: {
					stations: [],
					postings: [],
					outfits: [],
				},
				columns: [
					{name: 'number', label: 'п/п №', align: 'center', field: ps => ps.__index + 1},
					{name: 'material', label: 'Наименование', align: 'center', field: posting => posting.material.name},
					{name: 'quantity', label: 'Количество', align: 'center', field: 'quantity'},
					{name: 'outfit_id',
					 label: '№ наряда', 
					 align: 'center', 
					 field: posting => posting.outfit.id
					},
					{
						name: 'outfit_date',
						label: 'Дата наряда', 
						align: 'center', 
						field: posting => new Date(posting.outfit.begin).toLocaleDateString()},
				]
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
			// HTTP-GET postings 
			getPostings() {
				if (this.form.station && this.form.date) {
					this.form.postings = [];
					this.options.postings = [];
					this.loading = true;
					const params = {
						material__category__name: 'Лесоматериалы',
						outfit__station: this.form.station,
						outfit__begin__month: new Date(this.form.date).getMonth() + 1,
						forest_arrival_reports__isnull: true,
					}
					this.$axios.get('/api/v1/outfit_posting/', { params })
					.then(response => {
						this.options.postings = response.data.outfit_postings;
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.loading = false;
					})
				}
			},
			// HTTP-GET outfits
			getOutfits() {
				if (this.form.station && this.form.date) {
					this.form.postings = [];
					this.options.postings = [];
					this.options.outfits = [];
					this.loading = true;
					const params = {
						postings__material__category__name: 'Лесоматериалы',
						postings__isnull: false,
						postings__forest_arrival_reports__isnull: true,
						station: this.form.station,
						begin__month: new Date(this.form.date).getMonth() + 1,
					}
					this.$axios.get('/api/v1/outfit/', { params })
					.then(response => {
						this.options.outfits = response.data.outfits;
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.loading = false;
					})
				}
			},

			// Save report form
			saveReport() {
				if (this.form.station && this.form.date && this.form.postings.length) {
					const data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/forest-arrival-reports/', data)
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
					this.$router.push({name: 'ForestArrivalReportPrint', params: { id }});
				}).catch(() => {
					this.$router.push({name: 'ForestArrivalReports'});
				})
			},
		},
		mounted() {
			this.getStations();
		},
		watch: {
			'options.postings': function(postings) {
				this.form.postings = [];
				this.options.outfits = [];
				postings.forEach(posting => {
					this.form.postings.push(posting.id);
					this.$axios.get(posting.outfit)
					.then(response => {
						posting.outfit = response.data;
					}).catch(e => {
						this.$handleError(e);
					})
				})
			}
		},
	}
</script>

<style>
	#forest-arrival-report .q-field-label-inner { color: white; justify-content: center; font-weight: bold;}
</style>