<template>
	<div>
		<div class="row justify-between group">
			<div class="col-auto group">
				<q-btn
		            icon="add"
		            color="positive"
		            type="button"
		            @click.native="$router.push({name: 'ActSpisanyaNew'})"
		            glossy
		            label="Создать"
		          />
		          <searching-panel :options="options" :search="getActs" />
			</div>
    	</div>
    	<q-table 
    		:data="acts"
    		:columns="columns"
    		:pagination="{rowsPerPage: 0}"
    	>
    		<q-td slot="body-cell-options" slot-scope="props" :props="props">
     	 		<router-link :to="'/print/act-spisanya/' + props.row.id" target="_blank" style="text-decoration: none;" >
                <q-btn
                 icon="print" 
                 flat type="a"
                 dense
                 color="primary"
                />
                </router-link>
     	 		<q-btn 
                 icon="zoom_in" 
                 dense
                 flat color="primary" 
                 @click.native="viewAct(props.row)" 
                />
                <q-btn 
                 icon="delete" 
                 dense
                 flat color="primary" 
                 @click.native="deleteAct(props.row)" 
                />
   			</q-td>
    	</q-table>
    		<q-modal 
                ref="reportActModal" 
                @hide="viewedAct = null" 
                content-css="max-height:100%;" 
                content-classes="flex no-wrap column justify-between col-5">
    			<q-toolbar color="indigo" glossy class="self-start">
    				<q-toolbar-title>Акт списания материальных запасов</q-toolbar-title>
    				<q-btn flat v-close-overlay icon="close" />
    			</q-toolbar>
    			<template v-if="viewedAct">
    				<div class="q-pa-xs">
    				<table cellspacing="1" cellpadding="5" class="full-width text-center mini-tables">
    					<caption class="text-primary text-bold">Общие сведения</caption>
    					<tr>
    						<td>Организация</td>
    						<td>{{ viewedAct.organization.name }}</td>
    					</tr>
    					<tr>
    						<td>Участок</td>
    						<td>{{ viewedAct.station.name }}</td>
    					</tr>
    					<tr>
    						<td>Дата</td>
    						<td>{{ new Date(viewedAct.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'}) }}</td>
    					</tr>
    					<tr>
    						<td>Составил</td>
    						<td>{{ viewedAct.author.full_name }}</td>
    					</tr>
    				</table>
    				<table cellspacing="1" class="full-width text-center mini-tables">
    					<caption class="text-primary text-bold">Наряд-акт</caption>
    					<tr>
    						<td>Номер</td>
    						<td>{{ viewedAct.outfit.id }}</td>
    					</tr>
    					<tr>
    						<td>Дата</td>
    						<td>
    							{{ new Date(viewedAct.outfit.begin).toLocaleDateString() }}
    						</td>
    					</tr>
    					<tr>
    						<td>Бригадир</td>
    						<td>{{ viewedAct.outfit.brigadier.full_name }}</td>
    					</tr>
    					<tr>
    						<td>Мероприятие</td>
    						<td>{{ viewedAct.outfit.event.full_name }}</td>
    					</tr>
    				</table>
    				<table cellspacing="1" class="full-width text-center mini-tables">
    					<caption class="text-primary text-bold">Материалы</caption>
    					<thead>
    						<tr>
    							<th>Наименование</th>
    							<th>Количество</th>
    						</tr>
    					</thead>
    					<tr v-for="expense in viewedAct.outfit.expenses">
    						<td>{{ expense.material.name }}</td>
    						<td>{{ expense.quantity_fact }}</td>
    					</tr>
    					<tr>
    						<td>Итого</td>
    						<td>
    							{{ viewedAct.outfit.expenses.map(e => e.quantity_fact)
    								.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) 
    							}}
    						</td>
    					</tr>
    				</table>
    				<table cellspacing="1" class="full-width text-center mini-tables">
    					<caption class="text-primary text-bold">Работы</caption>
    					<tr v-for="(work, indx) in viewedAct.outfit.works" :key="work.id">
    						<td>{{ indx + 1 }}</td>
    						<td>{{ work.name }}</td>
    					</tr>
    				</table>
    			</div>
    			</template>
    			<q-toolbar class="justify-around self-end" color="indigo">
    				<q-btn
                     icon="print" 
                     color="positive" 
                     label="Печать" 
                     v-close-overlay 
                     glossy
    				 @click.native="$router.push({name: 'ActSpisanyaPrint', params: {id: viewedAct.id}})" 
                     />
    				<q-btn icon="close" color="negative" label="Закрыть" v-close-overlay glossy />
    			</q-toolbar>
    		</q-modal>
	</div>
</template>
<script>
	import SearchingPanel from 'components/SearchingPanel'

	export default {
		name: 'ActSpisanyaListPage',
		components: {'searching-panel': SearchingPanel},
		data() {
			return {
				acts: [],
				viewedAct: null,
				columns: [
					{ name: 'options', label: 'Опции', align: 'center', field: 'id' },
					{ name: 'number', label: 'Номер', align: 'center', field: 'id' },
					{ name: 'author', label: 'Составитель', align: 'center', field: act => act.author.full_name },
					{ name: 'station', label: 'Участок', align: 'center', field: act => act.station.name },
					{
						name: 'date', 
						label: 'Период', 
						align: 'center', 
						field: act => new Date(act.date).toLocaleDateString('RU', {month: 'long', year: 'numeric'})
					},
				],
				options: [
					{name: 'station', type: 'station'},
					{name: 'date__month', type: 'month'},
				]
			}
		},
		methods: {
			// HTTP-GET acts
			getActs(params) {
				this.$axios.get('/api/v1/act-spisanya/', { params })
				.then(response => {
					this.acts = response.data.acts;
				})
				.catch(e => {
					this.$handleError(e);
				})
			},
			viewAct(act) {
				this.$axios.get(act.resource_uri)
				.then(response => {
					this.viewedAct = response.data;
					this.$refs['reportActModal'].show();
				}).catch(e => {
					this.$handleError(e);
				})
			},
            deleteAct(act) {
                this.$q.dialog({message: 'Удалить акт?', ok: true, cancel: true})
                .then(() => {
                    this.$axios.delete(act.resource_uri)
                    .then(response => {
                        this.acts = this.acts.filter(a => a != act)
                    }).catch(e => {
                        this.$handleError(e);
                    })
                }).catch(() => {})
            },
		}
	}
</script>
<style>
.mini-tables {border-radius: 4px;}
	.mini-tables td, .mini-tables th, .mini-tables{border: 1px solid lightgrey;}
	.mini-tables td{border-radius: 0;}
</style>