<template>
	<q-layout id="reg-form" v-if="regform">
		<q-page-sticky position="top-left" class='print-hide z-max'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" 
				@click.native="$router.push({name: 'TractorRegFormList'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page">
			<div class="row justify-end small">Подготовлено с использованием системы &nbsp;<b>КонсультантПлюс</b></div>
			<div class="row q-pt-lg">
				<div class="col-auto">
					Согласовано<br/>
					Письмом Госкомстата России<br/>
					от 10.04.2003 № КЛ-01-21.1381
				</div>
				<div class="col text-bold">
					УЧЕТНЫЙ ЛИСТ № <span class="bb q-px-md">{{ regform.id }}</span><br/><br/>
					ТРАКТОРИСТА - МАШИНИСТА
				</div>
				<div class="col-auto">
					<span>Утверждено<br/>Приказом Минсельхоза России<br/> от 16.05.2003 № 750</span>
				</div>
			</div>
			<div class="row q-pt-md">
				<div class="col-8 row">
					<div class="col-8">
						<div class="row q-pt-sm">
							Организация: <span class="col bb q-mx-sm"> {{ regform.organization.name }}</span>
						</div>
						<div class="row q-pt-md">
							Водитель: <span class="col bb q-mx-sm"> {{ regform.driver.full_name }}
								<span class="under-text">(фамилия, имя, отчество)</span>
							</span>
							Бригадир: <span class="col bb q-mx-sm"> {{ regform.brigadier.full_name }}
							<span class="under-text">(фамилия, имя, отчество)</span>
							</span>
						</div>
						<div class="row q-pt-sm">
							Профессия: <span class="col bb q-mx-sm"> {{ regform.driver.position }}</span>
							Разряд: <span class="col-2 bb q-mx-sm">{{ regform.driver.rank }}</span>
						</div>
						<div class="row q-pt-sm">
							Марка машины: <span class="col-auto bb q-mx-sm q-px-xs"> {{ regform.car.name }}</span>
							Регистрационный номер: <span class="col-auto bb q-mx-sm q-px-xs"> {{ regform.car.number }}</span>
						</div>
						<div class="row q-pt-sm">
							Прицепщик: <span class="col bb q-mx-sm">
								{{ regform.trailerman ? regform.trailerman.full_name : '' }}
								<span class="under-text">(фамилия, имя, отчество)</span></span>
						</div>
						<div class="row q-pt-md">
							Участок: <span class="col bb q-mx-sm"> {{ regform.station.name }}</span>
							Отдел: <span class="col-2 bb q-mx-sm"> {{ regform.departament_full }}</span>
						</div>
						<div class="row q-pt-sm">
							Мероприятие: 
							<span class="col q-mx-sm text-left" style="text-decoration: underline;"> {{ regform.event.full_name }}
							
							</span>
						</div>
						<div class="row q-pt-md">
							Прицепное устройство: <span class="col q-mx-sm" style="border: 1px solid;"> {{ regform.trailer }}</span>
						</div>
					</div>
					<div class="col">
						<table class="full-width mini-table">
							<tr><td></td><td width="50%">Коды</td></tr>
							<tr><td>Форма по ОКУД</td><td></td></tr>
							<tr><td>Дата (месяц,год)</td>
								<td>{{ new Date(regform.date).toLocaleDateString('ru', {month: '2-digit', year: 'numeric'}) }}</td></tr>
							<tr><td>по ОКПО</td><td></td></tr>
							<tr><td>Табельный номер</td><td>{{ regform.table_number }}</td></tr>
							<tr><td>Премия</td><td>{{ regform.bonus ? regform.bonus + ' %' : '' }}</td></tr>
							<tr><td>Сложность</td><td>{{ regform.complexity ? regform.complexity + ' %' : '' }}</td></tr>
							<tr><td>Классность</td><td>{{ regform.classines ? regform.classines + ' %' : '' }}</td></tr>
							<tr><td>&nbsp;</td><td>&nbsp;</td></tr>
							<tr><td>&nbsp;</td><td>&nbsp;</td></tr>
							<tr><td>Бригада</td><td>{{ regform.brigade }}</td></tr>
							<tr><td>&nbsp;</td><td>&nbsp;</td></tr>
						</table>
					</div>
				</div>
				<div class="col offset-1">
					<div class="row justify-end">Форма № 411-АПК</div>
					<div class="row justify-center">Утверждаю</div>
					<div class="row q-pt-md">
						<span class="col-4 bb q-mx-sm">&nbsp;<span class="under-text">(личная подпись)</span></span>
						<span class="col bb">{{ regform.organization.head.full_name }}<span class="under-text">(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md justify-center">
						"<span class="col-2 bb">&nbsp;</span>"
						<span class="col-3 bb q-mx-sm">&nbsp;</span>
						20<span class="col-1 bb">&nbsp;</span>г.
					</div>
				</div>
			</div>
			<div class="row q-pt-md">
				<table class="fit works-table" border="1" >
					<thead align="center">
						<tr>
							<td rowspan="3" width="4%"><div class="vert">Числа месяца</div></td>
							<td rowspan="3" width="3%">№<br/>поля</td>
							<td rowspan="3">Наименование выполненных работ</td>
							<td colspan="3">Адресная часть, площадь</td>
							<td colspan="2">Справочник</td>
							<td rowspan="3" width="4%" valign="top" class="q-pt-md">
								<div class="vert">Единица измерения<br/>по ОКЕИ</div>
							</td>
							<td rowspan="3" width="4%"><div class="vert">Отработано часов</div></td>
							<td rowspan="3" width="4%"><div class="vert">Километров</div></td>
							<td rowspan="3" width="4%"><div class="vert">Норма выработки</div></td>
							<td rowspan="3" width="4%"><div class="vert">Расценка</div></td>
							<td colspan="2">Фактически выполнено</td>
							<td colspan="5">Оплата труда тракториста-машиниста, руб.</td>
							<td colspan="3">Расход горючего</td>
						</tr>
						<tr >
							<td rowspan="2" width="4%"><div class="vert">квартал</div></td>
							<td rowspan="2" width="4%"><div class="vert">выдел</div></td>
							<td rowspan="2" width="4%"><div class="vert">площадь,<br/>расстояние</div></td>
							<td rowspan="2" width="4%"><div class="vert">Наименование</div></td>
							<td rowspan="2" width="4%"><div class="vert">страница</div></td>
							<td rowspan="2" width="4%"><div class="vert">в натуре</div></td>
							<td rowspan="2" width="4%"><div class="vert">сменных норм</div></td>
							<td rowspan="2" width="4%"><div class="vert">основная</div></td>
							<td colspan="3" width="10%">дополнительная</td>
							<td rowspan="2"><div class="vert">всего</div></td>
							<td colspan="2"><div>по норме</div></td>
							<td rowspan="2" width="4%"><div class="vert">фактически</div></td>
						</tr>
						<tr>
							<td width="4%"><div class="vert">премия</div></td><td width="4%"><div class="vert">сложность</div></td><td width="4%"><div class="vert">классность</div></td><td width="4%"><div class="vert">на еденицу<br/> работы</div></td><td width="4%"><div class="vert">всего</div></td>
						</tr>
					</thead>
					<tbody align="center">
						<tr v-for="(work, index) in regform.works.slice(0, 7)" :key="work.id">
							<td>{{ new Date(work.date).toLocaleDateString('ru', {day: '2-digit', month: '2-digit'}) }}</td>
							<td>{{ index + 1 }}</td>
							<td>{{ work.event }}</td>
							<td>{{ work.quarter }}</td>
							<td>{{ work.allotment }}</td>
							<td>{{ work.area }}</td>
							<td>{{ work.ref_name }}</td>
							<td>{{ work.ref_page }}</td>
							<td>{{ work.units.short }}</td>
							<td>{{ work.hours }}</td>
							<td>{{ work.distance }}</td>
							<td>{{ work.rate }}</td>
							<td>{{ work.pricing }}</td>
							<td>{{ work.complete_nature }}</td>
							<td>{{ work.complete_norms }}</td>
							<td>{{ work.amount }}</td>
							<td>{{ work.bonus }}</td>
							<td>{{ work.complexity }}</td>
							<td>{{ work.classines }}</td>
							<td>{{ work.amount_total }}</td>
							<td>{{ work.fuel_per_unit }}</td>
							<td>{{ work.fuel }}</td>
							<td>{{ work.fuel }}</td>
						</tr>
						<template v-if="regform.works.length < 7" >
							<tr v-for="row in (7 - regform.works.length)">
								<td v-for="i in 23">&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot v-if="regform.works.length < 8">
						<tr class="text-bold">
							<td colspan="3">Итого:</td>
							<td></td><td></td><td></td><td></td><td></td><td></td>
							<td>{{ regform.total_hours }}</td><td></td><td></td><td></td>
							<td>{{ regform.total_complete_nature }}</td><td>{{ regform.total_complete_norms }}</td>
							<td>{{ regform.amount }}</td><td>{{ regform.amount_bonus }}</td>
							<td>{{ regform.amount_complexity }}</td><td>{{ regform.amount_classines }}</td>
							<td>{{ regform.amount_total }}</td><td></td><td>{{ regform.total_fuel }}</td><td>{{ regform.total_fuel }}</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div class="page">
			<div class="row justify-end small">Подготовлено с использованием системы &nbsp;<b>КонсультантПлюс</b></div>
			<div class="row justify-end q-pt-md">Обратная сторона формы № 411-АПК</div>
			<div class="row q-pt-sm" style="height: 70%;">
				<table class="fit works-table" border="1">
					<thead align="center">
						<tr>
							<td rowspan="3" width="4%"><div class="vert">Числа месяца</div></td>
							<td rowspan="3" width="3%">№<br/>поля</td>
							<td rowspan="3">Наименование выполненных работ</td>
							<td colspan="3">Адресная часть, площадь</td>
							<td colspan="2">Справочник</td>
							<td rowspan="3" width="4%" valign="top" class="q-pt-md">
								<div class="vert">Единица измерения<br/>по ОКЕИ</div>
							</td>
							<td rowspan="3" width="4%"><div class="vert">Отработано часов</div></td>
							<td rowspan="3" width="4%"><div class="vert">Километров</div></td>
							<td rowspan="3" width="4%"><div class="vert">Норма выработки</div></td>
							<td rowspan="3" width="4%"><div class="vert">Расценка</div></td>
							<td colspan="2">Фактически выполнено</td>
							<td colspan="5">Оплата труда тракториста-машиниста, руб.</td>
							<td colspan="3">Расход горючего</td>
						</tr>
						<tr >
							<td rowspan="2" width="4%"><div class="vert">квартал</div></td>
							<td rowspan="2" width="4%"><div class="vert">выдел</div></td>
							<td rowspan="2" width="4%"><div class="vert">площадь,<br/>расстояние</div></td>
							<td rowspan="2" width="4%"><div class="vert">Наименование</div></td>
							<td rowspan="2" width="4%"><div class="vert">страница</div></td>
							<td rowspan="2" width="4%"><div class="vert">в натуре</div></td>
							<td rowspan="2" width="4%"><div class="vert">сменных норм</div></td>
							<td rowspan="2" width="4%"><div class="vert">основная</div></td>
							<td colspan="3" width="10%">дополнительная</td>
							<td rowspan="2"><div class="vert">всего</div></td>
							<td colspan="2"><div>по норме</div></td>
							<td rowspan="2" width="4%"><div class="vert">фактически</div></td>
						</tr>
						<tr>
							<td width="4%"><div class="vert">премия</div></td><td width="4%"><div class="vert">сложность</div></td><td width="4%"><div class="vert">классность</div></td><td width="4%"><div class="vert">на еденицу<br/> работы</div></td><td width="4%"><div class="vert">всего</div></td>
						</tr>
					</thead>
					<tbody align="center">
						<tr v-for="(work, index) in regform.works.slice(7, regform.works.length)" :key="work.id">
							<td>{{ new Date(work.date).toLocaleDateString('ru', {day: '2-digit', month: '2-digit'}) }}</td>
							<td>{{ index + 8 }}</td>
							<td>{{ work.event }}</td>
							<td>{{ work.quarter }}</td>
							<td>{{ work.allotment }}</td>
							<td>{{ work.area }}</td>
							<td>{{ work.ref_name }}</td>
							<td>{{ work.ref_page }}</td>
							<td>{{ work.units.short }}</td>
							<td>{{ work.hours }}</td>
							<td>{{ work.distance }}</td>
							<td>{{ work.rate }}</td>
							<td>{{ work.pricing }}</td>
							<td>{{ work.complete_nature }}</td>
							<td>{{ work.complete_norms }}</td>
							<td>{{ work.amount }}</td>
							<td>{{ work.bonus }}</td>
							<td>{{ work.complexity }}</td>
							<td>{{ work.classines }}</td>
							<td>{{ work.amount_total }}</td>
							<td>{{ work.fuel_per_unit }}</td>
							<td>{{ work.fuel }}</td>
							<td>{{ work.fuel }}</td>
						</tr>
						<template v-if="regform.works.length < 18" >
							<tr v-for="row in (18 - regform.works.length)">
								<td v-for="i in 22">&nbsp;</td>
							</tr>
						</template>
					</tbody>
					<tfoot>
						<tr class="text-bold">
							<td colspan="3">Итого:</td>
							<td colspan="6"></td>
							<td>{{ regform.total_hours }}</td><td></td>
							<td colspan="2"></td>
							<td>{{ regform.total_complete_nature }}</td>
							<td>{{ regform.total_complete_norms }}</td>
							<td>{{ regform.amount }}</td>
							<td>{{ regform.amount_bonus }}</td>
							<td>{{ regform.amount_complexity }}</td>
							<td>{{ regform.amount_classines }}</td>
							<td>{{ regform.amount_total }}</td>
							<td></td>
							<td>{{ regform.total_fuel }}</td>
							<td>{{ regform.total_fuel }}</td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="row q-pt-lg">
				<div class="col offset-1">
					<div class="row">
						<span class="col text-left">Движение горючего:</span>
						<span class="col-3">кг (код по ОКЕИ - 166)</span>
					</div>
					<div class="row q-pt-md">
						<span class="col text-left">Остаток горючего на дату выдачи учетного листа</span>
						<span class="col-3 cell">{{ regform.fuel_dep }}</span>
					</div>
					<div class="row">
						<span class="col text-left">Получено (заправлено)</span>
						<span class="col-3 cell">{{ regform.fuel_issued }}</span>
					</div>
					<div class="row">
						<span class="col text-left">Остаток горючего на дату сдачи учетного листа</span>
						<span class="col-3 cell" style="border-bottom: 1px solid;">{{ regform.fuel_ret }}</span>
					</div>
				</div>
				<div class="col">
					<div class="row justify-end">
						Отработано: машино-дней
						<span class="cell col-2 q-ml-md">&nbsp;</span>
					</div>
					<div class="row justify-end">
						машино-смен
						<span class="cell col-2 q-ml-md" style="border-bottom: 1px solid;">{{ regform.total_hours }}</span>
					</div>
				</div>
			</div>
			<div class="row q-pt-lg">
				<span class="text-bold">Тракторист-машинист</span>
				<span class="col bb q-mx-sm">&nbsp;<span class="under-text">(личная подпись)</span></span>
				<span class="col bb q-mx-sm">{{ regform.driver.full_name }}
					<span class="under-text">(расшифровка подписи)</span>
				</span>
				<span class="text-bold">Агроном</span>
				<span class="col bb q-mx-sm">&nbsp;<span class="under-text">(личная подпись)</span></span>
				<span class="col bb q-mx-sm">&nbsp;<span class="under-text">(расшифровка подписи)</span></span>
				<span class="text-bold">Бригадир</span>
				<span class="col bb q-mx-sm">&nbsp;<span class="under-text">(личная подпись)</span></span>
				<span class="col bb q-mx-sm">{{ regform.brigadier.full_name }}
					<span class="under-text">(расшифровка подписи)</span>
				</span>
			</div>
		</div>
	</q-layout>
</template>

<script>
	export default {
		name: 'TractorRegFormPrintPage',
		props: {
			id: { required: true }
		},
		data() {
			return {
				regform: null
			}
		},
		methods: {
			// Document print
			print(){
				window.print();
			},
			// HTTP-GET
			getRegForm() {
				this.$axios.get('/api/v1/tractor-regform/' + this.id + '/')
				.then(response => {
					this.regform = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			}
		},
		mounted() {
			this.getRegForm();
		},
	}
</script>

<style>

 #reg-form{
  background: rgb(204,204,204); 
  font:  12px Times New Roman, serif;
  margin: 0;
  padding: 0;
}

* {position: relative; padding: 0; margin: 0;}

#reg-form .page {
	  text-align: center;
	  background: white;
	  margin: 0 auto;
	  padding: 1cm;
	  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
	  width: 297mm; 
	  height: 210mm;
	  margin-bottom: -1px;
}

  .small {font-size: 10px;}
  .cell { border: 1px solid; border-bottom: 0;}
  .underline {text-decoration: underline;}
  .pre {white-space: pre;}
  .bb {border-bottom: 1px solid;}
  .under-text {position: absolute; left: 0; top: 15px; text-align: center; width: 100%; font-size: 9px;}
  .vert{
  	-webkit-writing-mode: vertical-rl ;
 	 writing-mode: vertical-rl;
  	 height: 75px;
  	white-space: nowrap;
  }

  #reg-form table {
  	border-collapse: collapse;
  	text-align: center;
  }
   #reg-form .mini-table td:nth-child(even){
   		border: 1px solid;
   		border-left: 2px solid;
   		border-right: 2px solid;
   		
   }
   #reg-form .mini-table td:nth-child(odd){
   	text-align: right;
   	padding-right: 5px;
   }

</style>
<style media="print" scoped>
  @page {
  	size: A4 landscape;
  	margin: 0;
  }
</style>
