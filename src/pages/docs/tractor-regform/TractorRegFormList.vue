<template>
	<div>
		<div class="row justify-between group">
			<div class="col-md-auto col-xs-12 text-center group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'TractorRegFormNew'})"
		            glossy
		            label="Создать"
		          />
	          	<searching-panel :options="options" :search="getRegForms" />
			</div>
    	</div>
		<q-table
			:data="regforms"
			:columns="columns"
			row-key="id"
			:dense="!$q.platform.is.desktop"
	      	:loading="loading"
	      	:rows-per-page-options="[20, 50, 100]" 
	      	separator="cell"
	      	:pagination="pagination"
	      	hide-bottom
		>
	    <q-td slot="body-cell-options" slot-scope="props" :props="props">
	    	<q-btn-dropdown icon="menu" color="primary" split dense>
	    		<q-list link separator>	
		    			<q-item :to="'/print/regform/' + props.row.id" target="_blank">
		    				<q-item-side icon="print" class="text-primary" />
		    				<q-item-main label="Печать" />
		    			</q-item>  			
	    			<q-item v-if="$user.is_staff" @click.native="deleteRegform(props.row)" >
	    				<q-item-side icon="delete" class="text-negative" />
	    				<q-item-main label="Удалить" />
	    			</q-item>
	    		</q-list>
	    	</q-btn-dropdown>
   		</q-td>
		</q-table>
	</div>
	
</template>

<script>
import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'TractorRegFormListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
      			loading: false,
      			pagination: {
      				rowsPerPage: 20
      			},
      			// Array with fetched regforms
				regforms: [],
				// Search options
		        options: [
		          {name: 'id', type: 'number'},
		          {name: 'date', type: 'date'},
		          {name: 'brigadier', type: 'worker'},
		          {name: 'driver', type: 'worker'},
		          {name: 'station', type: 'station'},
		          {name: 'car', type: 'car'},
		        ],
		        // Regforms table columns
				columns: [
					{name: 'options', label: 'Опции', field: 'id', align: 'center'},
					{name: 'number', label: 'Номер', field: 'id', align: 'center'},
					{name: 'date', label: 'Дата', field: rf => new Date(rf.date).toLocaleDateString(), align: 'center'},
					{name: 'brigadier', label: 'Бригадир', field: rf => rf.brigadier.full_name, align: 'center'},
					{name: 'driver', label: 'Тракторист', field: rf => rf.driver.full_name, align: 'center'},
					{name: 'station', label: 'Участок', field: rf => rf.station.name, align: 'center'},
					{name: 'departament', label: 'Отдел', field: rf => rf.departament_full, align: 'center'},
					{name: 'car', label: 'Трактор', field: rf => rf.car.full_name, align: 'center'},
				]
			}
		},

		methods: {
			deleteRegform(regform) {
				this.$q.dialog({
					message: 'Удалить документ?',
					ok: true, cancel: true,
				}).then(() => {
					this.$axios.delete(regform.resource_uri)
					.then(response => {
						this.regforms = this.regforms.filter(rf => rf.id != regform.id);
					}).catch(e => {
						this.$handleError(e);
					})
				}).catch(() => {})
			},
			// HTTP-GET regforms
			getRegForms(params) {
				this.loading = true;
				this.$axios.get('/api/v1/tractor-regform/', {params})
				.then(response => {
					this.regforms = response.data.regforms;
				}).catch(e => {
					this.$handleError(e);
				}).finally(() =>	{
					this.loading = false;
				})
			},
		}
	}
</script>