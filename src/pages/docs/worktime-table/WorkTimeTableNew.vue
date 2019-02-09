<template>
	<div id="wt-table">
		<q-inner-loading dark :visible="loading">
      		<q-spinner-hourglass size="50px" color="primary"></q-spinner-hourglass>
    	</q-inner-loading>
		<div class="row bg-indigo q-pa-sm full-width">
				<q-field label="Участок" class="col-md-4 col-xs-12 q-pa-xs" label-width="3">
					<q-select 
					 v-model="form.station"
					 :options="options.stations.map(s => {return {label: s.name, value: s.id}})" 
					 class="bg-white round-borders" 
					 separator
					 hide-underline
					 style="padding: 5px;"
					 :disable="form.__entries.length > 0"
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
					 :disable="form.__entries.length > 0"
				/>
				</q-field>
				<q-field label="Дата" class="col-md-2 col-xs-12 q-pa-xs"  >
					<q-datetime 
					type="date" 
					:value="form.date" 
					@input="val => {form.date = new Date(val).toDateString()}" 
					format-model="date" 
					format="MM.YYYY" 
					class="bg-white round-borders" 
					align="center" 
					hide-underline 
					style="padding: 5px;" 
					default-view="month" 
					modal 
					:disable="form.__entries.length > 0"
					 />
				</q-field>
				<div class="col-md col-xs-12 flex flex-center group">
					<q-btn icon="search" color="positive" glossy label="Заполнить" @click="getDocuments"
					:disabled="!is_valid" />
					<q-btn icon="clear" color="negative" glossy label="Отчистить" @click="clearForm" />
				</div>
		</div>
		<div class="row justify-around group items-center bg-tertiary">
				<span class="col text-center">
					<q-chip title="Путевые листы" square icon="directions_car" class="glossy" :color="docs.waybills.length ? 'positive' : 'negative'">{{ docs.waybills.length }}</q-chip>
				</span>
				<span class="col text-center">
					<q-chip title="Наряд-акты" icon="gavel" square class="glossy" :color="docs.outfits.length ? 'positive' : 'negative'">{{ docs.outfits.length }}</q-chip>
				</span>
				<span class="col text-center">
					<q-chip title="Учетные листы тракториста-машиниста" icon="settings" square class="glossy" :color="docs.regforms.length ? 'positive' : 'negative'">{{ docs.regforms.length }}</q-chip>
				</span>
			</div>
		<div class="row q-table-dense q-table-separator" style="overflow: scroll; min-height: 50vh">
			<table class="q-table entries-table" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>№</th>
						<th>Ф.И.О.</th>
						<th>Должность</th>
						<th v-for="i in 31">{{i}}</th>
						<th>Всего часов</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(entry, index) in form.__entries" row-key="__index">
						<td>{{ index + 1 }}</td>
						<td>{{ options.workers.find(w => w.id == entry.worker).full_name }}</td>
						<td>{{ options.workers.find(w => w.id == entry.worker).position }}</td>
						<td v-for="i in 31">{{ entry.workdays[i] }}</td>
						<td style="font-weight: bold;">{{ entry.hours }}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="row">
			<table class="full-width" style="border: 1px solid lightgrey" cellspacing="0" >
				<tfoot >
					<tr class="text-center text-bold" style="font-size: 9pt; height: 25px;">
						<td colspan="33" class="q-px-sm" style="text-align: left; border: 1px solid lightgrey;">Итого, часов:</td>
						<td width="5%" style="border: 1px solid lightgrey;">
							{{ form.hours }}
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="row group flex-center q-toolbar bg-indigo" style="min-height: 25vh">
			<q-field class="col-md-3 col-xs-8" label="Ответственный">
				<q-select 
				:options="options.workers.map(w => {return {label: w.full_name, value: w.id}})" 
				v-model="form.responsible" align="center"
				separator
				class="bg-white round-borders"
				hide-underline 
				filter />
			</q-field>
			<q-field class="col-md-3 col-xs-8" label="Исполняющий" >
				<q-select 
				:options="options.workers.map(w => {return {label: w.full_name, value: w.id}})" 
				v-model="form.performer" 
				separator align="center"
				hide-underline
				class="bg-white round-borders" 
				filter />
			</q-field>
			<div class="col-auto text-center">
				<q-btn icon="save" label="Сохранить" color="positive" :disabled="!is_complete" @click="save" />
			</div>
		</div>
	</div>
</template>
<script>
	const WorkersSet = function() {
		var set = this;
		set.items = [];
		set.add = function(worker) {
			if (!set.items.find(w => w.id == worker.id)) {
				set.items.push(worker);
			}
		}
	}

	const WdSet = function() {
		var set = this;
		set.items = {};
		set.add = function(val) {
			Object.keys(val).forEach(k => {
				if (set.items.hasOwnProperty(k)) {
					set.items[k] += parseFloat(val[k]);
				} else {
					set.items[k] = parseFloat(val[k]);
				}
			})
		}
		set.sum = function() {
			return Object.values(set.items).reduce((a,b) => parseFloat(a) + parseFloat(b), 0).toFixed(2);
		}
	}

	export default {
		name: 'WorkTimeTableNew',
		data() {
			return {
				loading: false,
				form: {
					date: null,
					organization: this.$user.organization.id || null,
					station: this.$user.station.id,
					departament: null,
					responsible: null,
					performer: null,
					__entries: [],
					hours: null,
					outfits: [],
					waybills: [],
					regforms: [],
				},
				options: {
					stations: [],
					organizations: [],
					workers: [],
				},
				docs: {
					outfits: [],
					waybills: [],
					regforms: [],
				},
			}
		},
		methods: {
			save() {
				this.docs.outfits.forEach(of => this.form.outfits.push(of.id));
				this.docs.waybills.forEach(wb => this.form.waybills.push(wb.id));
				this.docs.regforms.forEach(rf => this.form.regforms.push(rf.id));
				var data = JSON.parse(JSON.stringify(this.form));
				this.$axios.post('/api/v1/worktime_tables/', data)
				.then(response => {
					this.done(response.data.id);
				}).catch(e => {
					this.$handleError(e);
				})
			},
			done(id) {
				this.$q.dialog({
					title: 'Готово',
					message: 'Открыть печатную форму?',
					ok: true, cancel: true
				}).then(() => {
					this.$router.push({name: 'WorkTimeTablePrint', params: { id }})
				}).catch(() => {
					this.$router.push({name: 'WorkTimeTable'})
				})
			},
			getData(resource, params) {
				this.$axios.get('/api/v1/' + resource + '/', { params })
				.then(response => { 
					this.options[resource] = response.data[resource] 
				})
				.catch(e => {
					this.$handleError(e);
				})
			},
			async getDocuments() {
				this.loading = true;
				var vm = this;
				var params = {};
				params.station = this.form.station;
				params.departament = this.form.departament;
				this.getWaybills(params);
			},
			clearForm() {
				this.form.date = null;
				this.form.departament = null;
				this.form.responsible = null;
				this.form.performer = null;
				this.form.hours = null;
				this.form.__entries = [];
				this.docs.outfits = [];
				this.docs.regforms = [];
				this.docs.waybills = [];
			},
			processData() {
				var workers = new WorkersSet();
				this.docs.waybills.forEach(wb => {workers.add(wb.driver)});
				this.docs.regforms.forEach(rf => {workers.add(rf.driver)});
				this.docs.outfits.forEach(of => {
					of.tables.forEach(tb => {
						workers.add(tb.worker)
					})
				})
				workers.items.forEach(worker => {
					var workdays = new WdSet();
					var entry = {};
					entry.worker = worker.id;
					entry.position = worker.position;
					this.docs.outfits.forEach(of => {
						of.tables.filter(t => t.worker.id == worker.id).forEach(tb => {
							workdays.add(tb.workdays);
						})
					})
					this.docs.waybills.filter(w => w.driver.id == worker.id).forEach(wb => {
						var wd = {};
						wd[new Date(wb.date).getDate()] = wb.total_hours;
						workdays.add(wd);
					})
					this.docs.regforms.filter(r => r.driver.id == worker.id).forEach(rf => {
						rf.works.forEach(w => {
							var wd = {};
							wd[new Date(w.date).getDate()] = w.hours;
							workdays.add(wd);
						})
						
					})
					entry.workdays = workdays.items;
					entry.hours = workdays.sum();
					this.form.__entries.push(entry);
				})
				this.loading = false
			},
			getWaybills(attrs) {
				var params = JSON.parse(JSON.stringify(attrs));
				params.date__month = new Date(this.form.date).getMonth() + 1;
				this.$axios.get('/api/v1/waybill/', { params })
				.then(response => {
					this.docs.waybills = response.data.waybills;
				})
				.catch(e => { 
					this.$handleError(e);
				})
				.finally(() => {
					this.getOutfits(attrs);
				})
			},
			getOutfits(attrs) {
				var params = JSON.parse(JSON.stringify(attrs));
				params.begin__month = new Date(this.form.date).getMonth() + 1;
				params.end__month = new Date(this.form.date).getMonth() + 1;
				this.$axios.get('/api/v1/outfit/', { params })
				.then(response => {
					this.docs.outfits = response.data.outfits;
				})
				.catch(e => { 
					this.$handleError(e);
				})
				.finally(() => {
					this.getRegforms(attrs);
				})
			},
			getRegforms(attrs) {
				var params = JSON.parse(JSON.stringify(attrs));
				params.date__month = new Date(this.form.date).getMonth() + 1;
				this.$axios.get('/api/v1/tractor-regform/', { params })
				.then(response => {
					this.docs.regforms = response.data.regforms;
				})
				.catch(e => { 
					this.$handleError(e);
					 })
				.finally(() => {
					this.processData();
				})
			},
		},
		computed: {
			is_valid() {	
				return this.form.date && this.form.station && this.form.departament && !this.form.__entries.length;
			},
			is_complete() {
				return this.form.__entries.length && this.form.performer && this.form.responsible;
			},
		},
		mounted() {
			this.getData('stations');
			this.getData('workers');
		},
		watch: {
			'form.__entries': function(val) {
				var hours = this.form.__entries.map(e => e.hours).reduce((a,b) => parseFloat(a) + parseFloat(b),0);
				this.form.hours = hours.toFixed(2);
			}
		},
		
	}
</script>
<style>
	#wt-table .q-field-label-inner {justify-content: center; color: white; text-shadow: 0 1px black; font-weight: bold;}
	#wt-table .entries-table th, #wt-table .entries-table td { font-size: 8pt; border: 1px solid lightgrey; text-align: center;}
</style>