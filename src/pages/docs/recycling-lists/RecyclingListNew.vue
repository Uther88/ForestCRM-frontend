<template>
	<div id="recycling-list">
		<div class="row bg-indigo glossy group full-width flex-center q-px-xs">
			<q-field label="Участок" class="col-md-4 col-xs-12" label-width="3">
				<q-select
				v-model="form.station"
				placeholder="Выберите участок"
				:options="options.stations.map(s => { return { label: s.name, value: s.id }})"
				class="bg-white" align="center"
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
			<div class="col-md-auto col-xs-12 text-center group">
				<q-btn icon="search" color="primary" glossy label="Сформировать" @click.native="getOutfits" :disabled="!(form.station && form.date)" />
				<q-btn icon="save" label="Сохранить" :disabled="!form.outfits.length" :color="form.outfits.length ? 'positive' : 'negative' " glossy @click.naive="saveList" />
			</div>
		</div>
		<div class="row q-pa-xs">
			<table border="1" cellspacing="0" class="col-6 text-center">
				<caption class="text-bold">Приход</caption>
				<tbody>
					<template v-for="outfit in options.outfits">
						<tr v-for="posting in outfit.postings" :key="posting.id">
							<td>
								{{ posting.material.name }}
							</td>
							<td>
								{{ posting.material.units_full }}
							</td>
							<td>
								{{ posting.quantity }}
							</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr class="text-bold">
						<td>Итого:</td>
						<td></td>
						<td>{{ 
								getSummaryPostings
							}}
						</td>
					</tr>
				</tfoot>
			</table>
			<table border="1" cellspacing="0" class="col-6 text-center">
				<caption class="text-bold">Расход</caption>
				<tbody>
					<template v-for="outfit in options.outfits">
						<tr v-for="expense in outfit.expenses" :key="expense.id">
							<td>
								{{ expense.material.name }}
							</td>
							<td>
								{{ expense.material.units_full }}
							</td>
							<td>
								{{ expense.quantity_fact }}
							</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr class="text-bold">
						<td>Итого:</td>
						<td></td>
						<td>{{ getSummaryExpenses }}
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'RecyclingListNewPage',
		data() {
			return {
				loading: false,
				form: {
					station: null,
					date: null,
					outfits: [],
				},
				options: {
					stations: [],
					outfits: [],
				}
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
			// HTTP-GET outfits
			getOutfits() {
				if (this.form.station && this.form.date) {
					this.options.outfits = [];
					this.form.outfits = [];
					this.loading = true;
					const params = {
						postings__isnull: false,
						expenses__isnull: false,
						recycling_list__isnull: true,
						station: this.form.station,
						begin__month: new Date(this.form.date).getMonth() + 1,
					};
					this.$axios.get('/api/v1/outfit/', { params })
					.then(response => {
						this.options.outfits = response.data.outfits;
						this.options.outfits.forEach(o => this.form.outfits.push(o.id))
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.loading = false;
					})
				}
			},
			// Save recycling list
			saveList() {
				if (this.form.date && this.form.station && this.form.outfits.length) {
					this.loading = true;
					const data = JSON.parse(JSON.stringify(this.form));
					this.$axios.post('/api/v1/recycling-lists/', data)
					.then(response => {
						this.done(response.data.id);
					}).catch(e => {
						this.$handleError(e);
					}).finally(() => {
						this.loading = false;
					})
				}
			},
			done(id) {
				this.$q.dialog({
					title: 'Готово',
					message: 'Открыть печатную форму?',
					ok: true, cancel: true
				}).then(() => {
					this.$router.push({name: 'RecyclingListPrint', params: { id }});
				}).catch(() => {
					this.$router.push({name: 'RecyclingList'});
				})
			},
		},
		computed: {
			getSummaryPostings() {
				var val = 0;
				this.options.outfits.forEach(of => {
					of.postings.forEach(p => {
						val += parseFloat(p.quantity);
					})
				})
				return val;
			},
			getSummaryExpenses() {
				var val = 0;
				this.options.outfits.forEach(of => {
					of.expenses.forEach(e => {
						val += parseFloat(e.quantity_fact);
					})
				})
				return val;
			}
		},
		mounted() {
			this.getStations();
		},
	}
</script>
<style>
	#recycling-list .q-field-label-inner { color: white; justify-content: center; font-weight: bold;}
</style>