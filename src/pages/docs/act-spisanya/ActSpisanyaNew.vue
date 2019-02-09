<template>
	<div id="act-spisanya">
		<div class="row bg-indigo glossy full-width flex-center">
			<div class="col-md-9 col-xs-12 row grou group">
				<q-field label="Организация" class="col-md-5 col-xs-12" label-width="4">
					<q-select
					v-model="form.organization"
					placeholder="Выберите организацию"
					:options="options.organizations.map(s => { return { label: s.name, value: s.id }})"
					class="bg-white" align="center"
					/>
				</q-field>
				<q-field label="Участок" class="col-md-6 col-xs-12" label-width="3">
					<q-select
					v-model="form.station"
					placeholder="Выберите участок"
					:options="options.stations.map(s => { return { label: s.name, value: s.id }})"
					class="bg-white" align="center"
					/>
				</q-field>
				<q-field label="Период" class="col-md-5 col-xs-12">
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
				<q-field label="Комисcия" class="col-md-6 col-xs-12" label-width="3">
					<q-select
					 v-model="form.comission"
					 multiple
					 filter
					 class="bg-white"
					 :options="options.workers.map(w => {return {label: w.full_name, value: w.id} })"
					/>
				</q-field>
			</div>
			<div class="col-md-3 col-xs-12 q-mb-xs">
				<div class="row group justify-center">
					<q-btn icon="search" color="primary" glossy label="Поиск" 
					@click.native="getOutfits" :disabled="!(form.station && form.date)" />
					<q-btn icon="save" color="negative" glossy label="Сброс" 
					@click.native="resetForm" />
			</div>
			</div>
		</div>
		<q-table
		 :data="options.outfits"
		 :columns="columns"
		 :loading="loading"
		 separator="cell"
		 dense
		 :pagination="{ rowsPerPage:0 }"
		>
			<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn
     	 		 v-if="!form.outfit"
     	 		 icon="fas fa-plus" 
     	 		 dense 
     	 		 flat 
     	 		 @click="newCalc(props.row)" 
     	 		 :color="form.comission.length ? 'positive' : 'negative'" 
     	 		 :disabled="!form.comission.length"
     	 		 title="Добавить"
     	 		/>
     	 		<q-icon name="check_circle" color="positive" v-else size="14pt" />
     	 		<router-link
     	 		 class="text-primary" 
     	 		 style="text-decoration: none;" 
     	 		 target="_blank" 
     	 		 :to="'/print/outfit/' + props.row.id">
     	 		 <q-btn icon="print" flat dense title="Открыть печатную форму" />
     	 		</router-link>
			</q-td>
		</q-table>
	</div>
</template>

<script>
	export default {
		name: 'ActSpisanyaNew',
		data() {
			return {
				loading: false,
				form: {
					organization: this.$user.organization.id,
					station: null,
					date: null,
					outfit: null,
					order: null,
					comission: [],
				},
				options: {
					organizations: [],
					stations: [],
					outfits: [],
					workers: [],
				},
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id'},
					{ name: 'outfit_id', label: '№ наряда', align: 'center', field: 'id' },
					{
						name: 'date',
						label: 'Дата', 
						align: 'center', 
						field: outfit => new Date(outfit.begin).toLocaleDateString()
					},
					{ name: 'brigadier', label: 'Бригадир', align: 'center', field: of => of.brigadier.full_name },
					{ name: 'event', label: 'Мероприятие', align: 'center', field: of => of.event.full_name }
				]
			}
		},
		methods: {
			// HTTP-GET organizations
			getOrganizations() {
				this.$axios.get('/api/v1/organizations/')
				.then(response => {
					this.options.organizations = response.data.organizations;
				}).catch(e => {
					this.$handleError(e);
				})
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
			// HTTP-GET workers
			getWorkers(station_id) {
				var params = {station: station_id};
				this.$axios.get('/api/v1/workers/', { params })
				.then(response => {
					this.options.workers = response.data.workers;
				}).catch(e => {
					this.$handleError(e);
				})
			},
			// HTTP-GET outfits
			getOutfits() {
				if (this.form.station && this.form.date) {
					this.options.outfits = [];
					this.loading = true;
					const params = {
						expenses__isnull: false,
						gsm: false,
						act_spisanya__isnull: true,
						station: this.form.station,
						begin__month: new Date(this.form.date).getMonth() + 1,
						limit: 250,
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
			newCalc(outfit) {
				this.$q.dialog({
					message: 'Введите номер и дату приказа распоряжения',
					ok: 'Сохранить', cancel: true,
					prompt: {
						type: 'text'
					}
				}).then(order => {
					if (order.trim()) {
						this.form.order = order;
						this.form.outfit = outfit.id;
						this.saveAct();
					}
				}).catch(() => {})
			},
			// Reset main form
			resetForm() {
				this.form.station = this.form.outfit = this.form.date = null;
				this.form.comission = this.options.outfits = [];
			},

			// Save report form
			saveAct() {
				if (this.form.station && this.form.date 
					&& this.form.outfit && this.form.organization 
					&& this.form.comission.length > 0
					) {
					const data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/act-spisanya/', data)
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
					this.$router.push({name: 'ActSpisanyaPrint', params: { id }});
				}).catch(() => {
					this.options.outfits = this.options.outfits.filter(o => o.id != this.form.outfit);
					this.form.outfit = null;
				})
			},
		},
		mounted() {
			this.getOrganizations();
			this.getStations();
		},
		watch: {
			'form.station': function(station_id) {
				if (station_id) {
					this.getWorkers(station_id);
				}
			}
		}
	}
</script>

<style>
	#act-spisanya .q-field-label-inner { color: white; justify-content: center; font-weight: bold;}
</style>