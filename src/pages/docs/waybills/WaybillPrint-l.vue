<template>
	<q-layout id="wb">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" 
				@click.native="$router.push({name: 'WaybillList'})"  />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		
		<div class="page" size="A4" v-if="waybill" id="waybill">
			<div class="row justify-between small">
				<span clas="col">Место для штампа<br/> организации</span>
				<span clas="col">Типовая межотраслевая форма № 3<br />
					Утверждена постановлением Госкомстата России<br />
					от 28.11.97 № 78
				</span>
			</div>
			<div class="row justify-center text-bold q-pa-sm text-center">
				ПУТЕВОЙ ЛИСТ ЛЕГКОВОГО АВТОМОБИЛЯ
				<span class="bb col-1 q-mx-sm">{{waybill.station.series}}<span class="under-text">серия</span></span>
				№<span class="bb col-1 q-mx-sm">{{waybill.number}}</span>
			</div>
			<div class="row justify-center">
				<div>
					"<span class="underline pre">  {{ new Date(waybill.date).getDay() }}  </span>"
					<span class="underline pre">  {{new Date(waybill.date).toLocaleString('ru-RU',{ month: "long" })}}  </span>
					<span class="underline pre">  {{new Date(waybill.date).getFullYear()}}  </span>г.
				</div>
			</div>
			<div class="row">
				<div class="col self-end flex justify-between">
					Организация:
					<span class="bb col text-center">{{waybill.organization.name}}<span class="under-text">наименование, адрес, номер телефона</span></span>
				</div>
				<div class="col-auto">
					<table class="text-center" cellspacing="0" style="border-collapse: collapse; width: 270px;">
						<tr><td></td><td style="border: 1px solid">Код</td></tr>
						<tr><td class="text-right">Форма по ОКУД</td><td style="border: 2px solid; border-bottom: 1px solid;">0345001</td></tr>
						<tr><td class="text-right">по ОКПО</td><td style="border: 2px solid; border-top: 0"></td></tr>
					</table>
				</div>
			</div>
			<div class="row q-py-md">
				<div class="col q-pr-sm">
					<div class="row">
						Марка автомобиля:&nbsp;
						<span class="bb col text-center">{{waybill.car.name}}</span>
					</div>
					<div class="row">
						Государственный номерной знак:&nbsp;
						<span class="bb col text-center">{{waybill.car.number}}</span>
					</div>
					<div class="row">
						Водитель:&nbsp;
						<span class="bb col text-center">{{waybill.driver.full_name}}<span class="under-text">фамилия, имя, отчество</span></span>
					</div>
					<div class="row q-py-md">
						Удостоверение №:&nbsp;
						<span class="bb col text-center">&nbsp;</span>&nbsp;&nbsp;Класс
					</div>
					<div class="row">
						Лицензионная карточка:&nbsp;
						<span class="bb">стандартная, <strike>ограниченая</strike><span class="under-text">ненужное зачеркнуть</span></span>
					</div>
				</div>
				<div class="col-auto">
					<table cellspacing="0">
						<tr><td>&nbsp;</td><td style="border:2px solid; width: 90px;">&nbsp;</td></tr>
						<tr><td>Гаражный номер</td><td style="border:2px solid;">&nbsp;</td></tr>
						<tr><td>Табельный номер</td><td style="border:2px solid;">&nbsp;</td></tr>
					</table>
				</div>
			</div>
			<div class="row q-pr-xl">
				Регистрационный №:
				<span class="bb col q-mx-sm""></span>
				Серия:
				<span class="bb col q-mx-sm"></span>
				№:
				<span class="bb col q-mx-sm""></span>
			</div>
			<div class="row q-pt-xl text-center">
				<div class="col text-bold">Задание водителю</div>
				<div class="col">Автомобиль технически исправен</div>
			</div>
			<div class="row justify-between q-pt-md">
				<div class="col self-end flex justify-between">
					<div class="col-auto">В распоряжение:&nbsp;</div>
					<div class="bb col text-center">{{waybill.organization.name}}<span class="under-text">наименование</span></div>
					
				</div>
				<div class="col text-center">
					<table class="fit"><tr><td>Показания спидометра, км:</td><td style="border: 2px solid; width: 75px">{{waybill.dep_km}}</td></tr></table>
				</div>
			</div>
			<div class="row q-py-md">
				<div class="col flex flex-center">
					<div class="col bb">&nbsp;<span class="under-text">организация</span></div>
					<div class="col" style="border: 2px solid">&nbsp;</div>
				</div>
				<div class="col q-pl-xl">
					<div class="row">Выезд разрешен</div>
					<div class="row">
						Механик:&nbsp;
						<span class="bb col q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
						<span class="bb col q-mx-sm text-center">{{waybill.check_out_allow.full_name}}<span class="under-text">расшифровка подписи</span></span>
					</div>
				</div>
			</div>
			<div class="row">Автомобиль в технически <br/>исправном состоянии принял</div>
			<div class="row q-pt-md">
				Адрес подачи:
				<span class="bb col text-center q-mx-sm">{{waybill.station.name}}</span>
				Водитель:
				<span class="bb col-2 q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
				<span class="bb col-2 q-mx-sm text-center">{{waybill.car_took.full_name}}<span class="under-text">расшифровка подписи</span></span>
			</div>
			<div class="row q-py-lg flex-center">
				<div class="col flex justify-between">
					Время выезда из гаража, ч. мин:
					<span class="col-auto q-px-md" style="border: 2px solid;">
						{{ new Date(waybill.dep_date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}) }},
						{{ new Date(waybill.dep_date).toLocaleDateString()}}
					</span>
				</div>
				<div class="col text-center">
					Горючее: 
					<table border="1" style="width: 150px;" class="float-right">
						<tr><td>марка</td><td>код</td></tr>
						<tr><td>{{waybill.car.fuel.mark}}</td><td style="border: 2px solid; width: 50%;">{{waybill.car.fuel.code}}</td></tr>
					</table>
				</div>
			</div>
			<div class="row">
				<div class="col-7 flex">
					Диспетчер-нарядчик:&nbsp;
					<span class="col bb q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
					<span class="col bb q-mx-sm">{{ waybill.dispatcher ? waybill.dispatcher.full_name : ''}}<span class="under-text">расшифровка подписи</span></span>
				</div>
				<div class="col text-bold text-center">
					Движение горючего
				</div>
			</div>
			<div class="row q-pt-xl">
				<div class="col-7 q-pr-xl">
					<div class="row justify-between">
						Время возвращения в гараж, ч. мин:&nbsp;
						<span class="col-auto q-px-md" style="border: 2px solid;">
							{{ new Date(waybill.ret_date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}) }},
							{{ new Date(waybill.ret_date).toLocaleDateString()}}
						</span>
					</div>
					<div class="row q-pt-sm">
						Диспетчер-нарядчик:&nbsp;
						<span class="col bb q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
						<span class="col bb q-mx-sm">{{ waybill.dispatcher ? waybill.dispatcher.full_name : ''}}<span class="under-text">расшифровка подписи</span></span>
					</div>
					<div class="row q-pt-md">
						<div class="bb col-12">
						{{waybill.comments || '&nbsp;'}}
						<span class="under-text">
							Опоздания, ожидания, простои, заезды в гараж и прочее
						</span>
						</div>
						<div class="bb col-12 q-mt-md">&nbsp;</div>
						<div class="bb col-12 q-mt-xs">&nbsp;</div>
					</div>
					<div class="row q-pt-md flex-center">
						<span class="text-bold col-auto">Автомобиль сдал <br/>водитель</span>
						<span class="col bb q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
						<span class="col bb q-mx-sm text-center">{{ waybill.auto_passed.full_name }}<span class="under-text">расшифровка подписи</span></span>
					</div>
					<div class="row q-pt-xl">
						<span class="col-5 bb">М.П.</span>
					</div>
				</div>
				<div class="col">
					<table class="full-width fuel-table">
						<tr><td>Выдано:</td><td style="border-top: 2px solid;">количество, л.</td></tr>
						<tr><td>по заправочному листу №</td><td>{{waybill.fuel_issued}}</td></tr>
						<tr><td>Остаток: при выезде</td><td>{{waybill.fuel_balance_on_dep}}</td></tr>
						<tr><td>при возвращении</td><td>{{waybill.fuel_balance_on_ret}}</td></tr>
						<tr><td>Расход: по норме</td><td>&nbsp;</td></tr>
						<tr><td>фактически</td><td>&nbsp;</td></tr>
						<tr><td>Экономия</td><td>&nbsp;</td></tr>
						<tr><td>Перерасход</td><td style="border-bottom: 2px solid;">&nbsp;</td></tr>
					</table>
					<div class="row q-pt-md flex-center">
						<span class="col">Автомобиль приял. Показания спи-<br/>дометра при возвращении в гараж, км:</span>
						<div class="col-3 text-center" style="border: 2px solid;">{{waybill.ret_km}}</div>
					</div>
					<div class="row">
						<span class="col bb q-mx-sm">&nbsp;<span class="under-text">подпись</span></span>
						<span class="col bb q-mx-sm text-center">{{waybill.auto_accept.full_name}}<span class="under-text">расшифровка подписи</span></span>
					</div>
				</div>
			</div>
		</div>
		<div style="page-break-after: always;"></div>

		<div class="page waybill" size="A4" v-if="waybill">
			<table class="full-width text-center" border="1" cellspacing="0" cellpadding="1">
				<thead>
					<tr>
						<td rowspan="3" width="4%">Номер по порядку</td>
						<td rowspan="3" width="4%">Код заказчика</td>
						<td rowspan="1" colspan="2" width="15%">Место</td>
						<td rowspan="1" colspan="4" width="10%">Время</td>
						<td rowspan="3" width="5%">Пройдено, км</td>
						<td rowspan="3" width="5%">Подпись лица, пользовавшегося автомобилем</td>
					</tr>
					<tr>
						<td rowspan="2" width="5%">отправления</td>
						<td rowspan="2" width="5%">прибытия</td>
						<td colspan="2">выезда</td>
						<td colspan="2">возвращения</td>
					</tr>
					<tr>
						<td width="5%">ч</td>
						<td width="5%">мин</td>
						<td width="5%">ч</td>
						<td width="5%">мин</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(task, index) in waybill.tasks" :key="task.id">
						<td>{{index + 1}}</td>
						<td>&nbsp;</td>
						<td>{{task.from_dest}}</td>
						<td>{{task.to_dest}}</td>
						<td>{{ new Date(task.departure).getHours() }}</td>
						<td>{{ new Date(task.departure).getMinutes() }}</td>
						<td>{{ new Date(task.arrival).getHours() }}</td>
						<td>{{ new Date(task.arrival).getMinutes() }}</td>
						<td>{{ task.distance }}</td>
						<td>&nbsp;</td>
					</tr>
					<tr v-for="i in 26 - waybill.tasks.length">
						<td v-for="i in 10">&nbsp;</td>
					</tr>
				</tbody>
			</table>
			<div class="row q-pt-xl gutter-xs">
				<div class="col">
					<span class="text-bold row">Результат работы автомобиля за смену:</span>
					<div class="row q-pt-sm">
						<span class="col">всего в наряде, ч:</span>
						<span class="col text-center" style="border: 2px solid;">{{waybill.total_hours}}</span>
					</div>
				</div>
				<div class="col">
					<span class="text-bold row">Расчет зароботной платы:</span>
					<div class="row q-pt-sm">
						<span class="col">за километраж, руб. коп:</span>
						<span class="col text-center" style="border: 2px solid;">&nbsp</span>
					</div>
				</div>
			</div>
			<div class="row q-pt-sm gutter-xs">
				<div class="col">
					<div class="row q-pt-sm">
						<span class="col">пройдено, км:</span>
						<span class="col text-center" style="border: 2px solid;">{{waybill.total_km}}</span>
					</div>
				</div>
				<div class="col">
					<div class="row q-pt-sm">
						<span class="col">за часы, руб. коп:</span>
						<span class="col text-center" style="border: 2px solid;">&nbsp</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-6 offset-6">
					<div class="row q-pt-sm">
						<span class="col">Итого, руб. коп:</span>
						<span class="col text-center" style="border: 2px solid;">&nbsp</span>
					</div>
				</div>
			</div>
			<div class="row q-pt-xl text-center">
				<span class="col-auto">Расчет произвел:</span>
				<span class="col bb q-mx-sm">{{waybill.author.position}}<span class="under-text">дожность</span></span>
				<span class="col bb q-mx-sm"><span class="under-text">подпись</span></span>
				<span class="col bb q-mx-sm">{{waybill.author.full_name}}<span class="under-text">расшифровка подписи</span></span>
			</div>
		</div>
	</q-layout>
</template>

<script>
	export default {
		props: ['id'],
		data() {
			return {
				waybill: null,
			}
		},
		methods: {
			// Print function
			print(){
				window.print();
			},
			// HTTP-GET waybill from backend
			getWaybill() {
				this.$axios.get('/api/v1/waybill/' + this.id + '/')
				.then(response => {
					this.waybill = response.data;
				}).catch(e => {
					this.$handleError(e);
				})
			}
		},
		mounted() {
			this.getWaybill();
		},
	}
</script>

<style>
body #wb{
  background: rgb(204,204,204); 
  font:  14px Times New Roman, serif;
}
	* {position: relative; padding: 0; margin: 0;}
 #wb .page {
  background: white;
  display: block;
  margin: 0 auto;
  padding: 1cm;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  
}
.page[size="A4"] {  
  width: 21cm;
  height: 29.7cm; 
}
.page[size="A4"][layout="portrait"] {
  width: 29.7cm;
  height: 21cm;  
}

  .small {font-size: 10px;}
  .underline {text-decoration: underline;}
  .pre {white-space: pre;}
  .bb {border-bottom: 1px solid;}
  .under-text {position: absolute; left: 0; top: 18px; text-align: center; width: 100%; font-size: 10px;}

  #waybill table {
  	border-collapse: collapse;
  	text-align: center;
  }
   #waybill .fuel-table td:nth-child(even){
   		border: 1px solid;
   		border-left: 2px solid;
   		border-right: 2px solid;
   }
   #waybill .fuel-table td:nth-child(odd){
   	text-align: left;
   }
   @media print {
  body, #wb .page {
    margin: 0;
    box-shadow: 0;
  }
}
</style>

<style scoped>
  @page { margin: 0; size: A4 portrait;}


</style>