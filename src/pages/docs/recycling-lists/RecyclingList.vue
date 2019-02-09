<template>
	<div>
		<div class="row justify-between group bg-indigo glossy">
			<div class="col-auto group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'RecyclingListNew'})"
		            glossy
		            label="Создать"
		          />
		          <searching-panel :options="options" :search="getRecyclingLists" />
			</div>
    	</div>
    	<q-table 
    		:data="lists"
    		:columns="columns"
    		:pagination="{ rowsPerPage: 0 }"
    		dense
    		:loading="loading"
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<q-btn icon="print" dense flat color="primary" @click.native="$router.push({name: 'RecyclingListPrint', params: {id: props.row.id}})"></q-btn>
     	 		<q-btn icon="edit" dense flat color="primary" @click.native="viewList(props.row)" />
			</q-td>
   		</q-table>
   		<q-modal ref="listViewModal" 
   		@hide="viewedList = null" 
   		content-css="max-height:100%;"
   		content-classes="flex column justify-between"
   		>
    			<q-toolbar color="indigo" glossy>
    				<q-toolbar-title>Ведомость переработки</q-toolbar-title>
    				<q-btn flat v-close-overlay icon="close" />
    			</q-toolbar>
    			<template v-if="viewedList">
    				<div class="q-pa-xs q-table-container">
	    				<table border="1" cellspacing="0" cellpadding="5" class="full-width text-center">
	    					<caption class="text-bold text-primary">Информация</caption>
	    					<tr>
	    						<td>Участок</td>
	    						<td>{{ viewedList.station.name }}</td>
	    					</tr>
	    					<tr>
	    						<td>Дата</td>
	    						<td>{{ new Date(viewedList.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}</td>
	    					</tr>
	    					<tr>
	    						<td>Составил</td>
	    						<td>{{ viewedList.author.full_name }}</td>
	    					</tr>
	    				</table>
	    				<table border="1" cellspacing="0" class="text-center full-width">
	    					<caption class="text-bold text-primary">Приход</caption>
	    					<thead>
	    						<tr>
	    							<th>Наименование</th>
	    							<th>Ед.изм.</th>
	    							<th>Количество</th>
	    						</tr>
	    					</thead>
	    					<tbody>
	    						<template v-for="outfit in viewedList.outfits">
	    							<tr v-for="posting in outfit.postings">
	    								<td>{{ posting.material.name }}</td>
	    								<td>{{ posting.material.units_full }}</td>
	    								<td>{{ posting.quantity }}</td>
	    							</tr>
	    						</template>
	    						<tr>
	    							<td>Итого:</td><td></td>
	    							<td>
	    								{{ viewedList.outfits.map(of => of.postings.map(p => p.quantity).reduce((a,b) => parseFloat(a) + parseFloat(b), 0))[0]
	    								 }}
	    							</td>
	    						</tr>
	    					</tbody>
	    				</table>
	    				<table border="1" cellspacing="0" class="text-center full-width">
	    					<caption class="text-bold text-primary">Расход</caption>
	    					<thead>
	    						<tr>
	    							<th>Наименование</th>
	    							<th>Ед.изм.</th>
	    							<th>Количество</th>
	    						</tr>
	    					</thead>
	    					<tbody>
	    						<template v-for="outfit in viewedList.outfits">
	    							<tr v-for="expense in outfit.expenses">
	    								<td>{{ expense.material.name }}</td>
	    								<td>{{ expense.material.units_full }}</td>
	    								<td>{{ expense.quantity_fact }}</td>
	    							</tr>
	    						</template>
	    						<td>Итого:</td><td></td>
	    							<td>
	    								{{ viewedList.outfits.map(of => of.expenses.map(e => e.quantity_fact).reduce((a,b) => parseFloat(a) + parseFloat(b), 0))[0]
	    								 }}
	    							</td>
	    					</tbody>
	    				</table>
	    			</div>
    			</template>
    			<q-toolbar class="justify-around" color="indigo">
    				<q-btn icon="print" color="positive" label="Печать" v-close-overlay glossy
    				@click.native="$router.push({name: 'RecyclingListPrint', params: {id: viewedList.id}})" />
    				<q-btn icon="close" color="negative" label="Закрыть" v-close-overlay glossy />
    			</q-toolbar>
    		</q-modal>
	</div>
</template>

<script>
	import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'RecyclingListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				loading: false,
				viewedList: null,
				lists: [],
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id' },
					{ name: 'number', label: 'Номер', align: 'center', field: 'id' },
					{ name: 'author', label: 'Составил', align: 'center', field: list => list.author.full_name },
					{ name: 'station', label: 'Участок', align: 'center', field: list => list.station.name },
					{
						name: 'date', 
						label: 'Период', 
						align: 'center', 
						field: list => new Date(list.date).toLocaleDateString('RU', { month: 'long', year: 'numeric' })
					},
				],
				options: [
					{ name: 'station', type: 'station' },
					{ name: 'date__month', type: 'month' },
				]
			}
		},
		methods: {
			getRecyclingLists(params) {
				this.loading = true;
				this.$axios.get('/api/v1/recycling-lists/', { params })
				.then(response => {
					this.lists = response.data.lists;
				})
				.catch(e => {
					this.$handleError(e);
				}).finally(() => {
					this.loading = false;
				})
			},
			viewList(list) {
				this.viewedList = list;
				this.$refs['listViewModal'].show();
		},
		},
	}
</script>