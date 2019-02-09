<template>
	<q-layout id="waybill-h">
		<q-page-sticky position="top-left" class='print-hide'>
			<div class="group">
				<q-btn icon="forward" class="rotate-180" round color="primary" 
				@click.native="$router.push({name: 'WaybillList'})" />
				<q-btn icon="print" round color="positive" @click.native="print" />
			</div>
		</q-page-sticky>
		<div class="page" v-if="waybill" size="A4" orientation="landscape">
			<div class="row">
				<div class="col-1">
					<span class="small">Место для штампа <br/>организации</span>
				</div>
				<div class="col">
					<span class="text-bold">ПУТЕВОЙ ЛИСТ</span><br/>
					<span class="text-bold">грузового автомобиля</span>&nbsp;
					<span class="bb q-px-md">{{waybill.station.series}}<span class="under-text">(серия)</span></span>
					№
					<span class="bb q-px-md">{{waybill.number}}</span>
				</div>
				<div class="col-2 text-left">
					<span class="small">
						Типовая межотраслевая форма № 4-С<br/>
						Утверждена постановлением<br/>
						Госкомстата России<br/>
						от 28.11.97 № 78
					</span>
				</div>				
			</div>
			<div class="row">
				<div class="col-9">
					<div class="row justify-center">
						"<span class="bb q-mx-xs q-px-xs">{{ new Date(waybill.date).toLocaleDateString('ru-RU', {day: '2-digit'}) }}</span>"
						<span class="bb q-mx-xs q-px-md">{{ new Date(waybill.date).toLocaleDateString('ru-RU', {month: 'long'}) }}</span>
						<span class="bb q-mx-xs q-px-xs">{{ new Date(waybill.date).getFullYear() }}</span>г.
					</div>
					<div class="row justify-center q-pt-md">
						<span class="col-auto">Организация:</span>
						<span class="col bb q-mx-xs">{{ waybill.organization.name }}
							<span class="under-text">(наименование, адрес и номер телефона)</span>
						</span>
					</div>
				</div>
				<div class="col">
					<table class="fit">
						<tr><td></td><td style="border:1px solid;">Коды</td></tr>
						<tr><td class="text-right q-pr-sm">Форма по ОКУД</td><td style="border:2px solid;">0345004</td></tr>
						<tr><td class="text-right q-pr-sm">по ОКПО</td><td style="border:2px solid;"></td></tr>
					</table>
				</div>
			</div>
			<div class="row q-pt-md">
				<div class="col">
					<div class="row">
						<div class="col-8 self-end">
							<div class="row">
								Марка автомобиля:
								<span class="col bb q-mx-xs">{{waybill.car.name}}</span>
							</div>
							<div class="row">
								Государственный номерной знак:
								<span class="col bb q-mx-xs">{{waybill.car.number}}</span>
							</div>
							<div class="row">
								Водитель:
								<span class="col bb q-mx-xs">{{waybill.driver.surname}}
									{{ waybill.driver.name }}
									{{ waybill.driver.patronymic }}
									<span class="under-text">(фамилия, имя, отчество)</span>
								</span>
							</div>
						</div>
						<div class="col">
							<table class="fit mini-table">
								<tr><td></td><td>Код</td></tr>
								<tr><td>Режим работы</td><td></td></tr>
								<tr><td>Колонна</td><td></td></tr>
								<tr><td>Бригада</td><td></td></tr>
								<tr><td>&nbsp;</td><td></td></tr>
								<tr><td>Гаражный номер</td><td></td></tr>
								<tr><td>Табельный номер</td><td></td></tr>
							</table>
						</div>
					</div>
					<div class="row q-pt-md">
						Удостоверение №: 
						<span class="col-2 bb q-mx-xs"></span>
						Класс
						<span class="col-1 bb q-mx-xs"></span>
						</span>
					</div>
					<div class="row q-pt-xs">
						Лицензионная карточка: 
						<span class="col-5 bb q-mx-xs">стандартная, <strike>ограниченная</strike>
							<span class="under-text">(ненужное зачеркнуть)</span>
						</span>
					</div>
					<div class="row q-pt-md">
						Регистрационный №:
						<span class="col-3 bb q-mx-xs"></span>
						Серия:
						<span class="col-2 bb q-mx-xs"></span>
						№
						<span class="col-1 bb q-mx-xs"></span>
					</div>
					<div class="row q-pt-sm">
						<div class="col-9">
							<div class="row q-pt-xs" v-for="(i, index) in 4">
								Прицеп {{i}}
								<span class="col-1 q-mx-sm bb"><span class="under-text">(марка)</span></span>
								Государственный номерной знак
								<span class="col bb q-mx-xs"></span>
							</div>
						</div>
						<div class="col">
							<table class="fit mini-table">
								<tr v-for="i in 4"><td>Гаражный номер</td><td>&nbsp;</td></tr>
							</table>
						</div>
					</div>
					<div class="row q-pt-md">
						Сопровождающие лица: 
						<span class="col bb q-ml-xs">&nbsp;</span>
						<span class="col-12 bb">&nbsp;</span>
					</div>
				</div>
				<div class="col q-pl-xl flex">
					<table class="full-width wb-tables" style="border: 3px double; border-collapse: collapse;" border="1">
                        <thead>
                            <tr>
                                <td colspan="8" style="font-size: 12px;">Работа для водителя автомобиля</td>
                            </tr>
                            <tr style="border: 1px solid;">
                                <td rowspan="2" width="25%">операция</td>
                                <td colspan="4">время по графику</td>
                                <td rowspan="2" width="7%">нулевой<br> пробег, <br> км</td>
                                <td rowspan="2">показания<br>спидометра,<br>км</td>
                                <td rowspan="2">время фактическое,<br>число, месяц, ч. мин.</td>
                            </tr>
                            <tr>
                                <td>число</td>
                                <td>месяц</td>
                                <td width="7%">ч.</td>
                                <td>мин.</td>
                            </tr>
                            <tr>
                                <td >1</td>
                                <td>2</td>
                                <td>3</td>
                                <td>4</td>
                                <td>5</td>
                                <td>6</td>
                                <td>7</td>
                                <td>8</td>
                            </tr>
                       </thead>
                       <tbody>
                       	<tr>
                       		<td>Выезд из гаража</td>
                       		<td>{{ new Date(waybill.dep_date).toLocaleDateString('ru', {day: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.dep_date).toLocaleDateString('ru', {month: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.dep_date).toLocaleTimeString('en-GB', {hour: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.dep_date).toLocaleTimeString('en-GB', {minute: '2-digit'}) }}</td>
                       		<td>&nbsp;</td>
                       		<td>{{waybill.dep_km}}</td>
                       		<td>
                       		{{ new Date(waybill.dep_date)
                       			.toLocaleString('ru', {
                       				month: '2-digit', day: "2-digit", hour: '2-digit', minute: '2-digit', hour12: false
                       			}) 
                       		}}
                       		</td>
                       	</tr>
                       	<tr>
                       		<td>Возвращение в гараж</td>
                       		<td>{{ new Date(waybill.ret_date).toLocaleDateString('ru', {day: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.ret_date).toLocaleDateString('ru', {month: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.ret_date).toLocaleTimeString('en-GB', {hour: '2-digit'}) }}</td>
                       		<td>{{ new Date(waybill.ret_date).toLocaleTimeString('en-GB', {minute: '2-digit'}) }}</td>
                       		<td>&nbsp;</td>
                       		<td>{{waybill.ret_km}}</td>
                       		<td>{{ new Date(waybill.ret_date).toLocaleString('ru', {month: '2-digit', day: "2-digit", hour: '2-digit', minute: '2-digit'}) }}</td>
                       	</tr>
                       </tbody>
					</table>
					<table class="full-width wb-tables" style="border: 3px double; border-collapse: collapse;" border="1">
                        <thead>
                            <tr>
                                <td colspan="7" style="font-size: 9pt;">Движение горючего</td>                             
                                <!-- fuel act -->
                                <td rowspan="2" colspan="2">Время работы, ч. мин.</td>
                            </tr>
                            <tr>
                                <td colspan="2">горючее</td>
                                <td rowspan="2">выдано,<br> л</td>
                                <td colspan="2">остаток при</td>
                                <td rowspan="2">сдано,<br> л.</td>
                                <td rowspan="2">коэффициент<br> изменения<br> нормы</td>
                               
                            </tr>
                            <tr>
                                <td>марка</td>
                                <td>код<br> марки</td>
                               
                                <td>выезде, л.</td>
                                <td>возвраще-<br>нии, л</td>
                                <td>спецоборудо-<br>вания</td>
                                <td>двигателя</td>  
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>10</td>
                                <td>11</td>
                                <td>12</td>
                                <td>13</td>
                                <td>14</td>
                                <td>15</td>
                                <td>16</td>
                                <td>17</td>
                            </tr>
                        </thead>
                        <tbody>
                        	<tr>
                        		<td>{{waybill.car.fuel.mark}}</td>
                        		<td>{{waybill.car.fuel.code}}</td>
                        		<td>{{waybill.fuel_issued}}</td>
                        		<td>{{waybill.fuel_balance_on_dep}}</td>
                        		<td>{{waybill.fuel_balance_on_ret}}</td>
                        		<td></td><td></td><td></td><td></td>
                        	</tr>
                        	<tr><td v-for="i in 9">&nbsp;</td></tr>
                        </tbody>
					</table>
					<table class="full-width wb-tables" style="border: 1px solid; border-collapse: collapse;" border="1">
						<tr><td colspan="5">&nbsp;</td></tr>
						<tr><td>заправщика</td><td>механика</td><td>механика</td><td>заправщика</td><td>диспетчера</td></tr>
						<tr><td v-for="i in 5">&nbsp;</td></tr>
					</table>
				</div>
			</div>
			<div class="row q-pt-md">
				<table class="full-width wb-tables" style="border: 3px double; border-collapse: collapse; border-bottom: 0; border-right: 0; border-left: 0;">
                    <thead style="border-left: 3px double; border-right: 3px double;">
                        <tr><td colspan="8">ЗАДАНИЕ ВОДИЛЕЛЮ</td></tr>
                        <tr>
                            <td rowspan="2" width="15%">в чье распоряжение (наиме-<br>нование и адрес заказчика)</td>
                            <td rowspan="2" width="15%">время прибытия, ч. мин.</td>
                            <td colspan="2" style="font-size: 9pt;">адрес пункта</td>
                            <td rowspan="2">Вид работ</td>
                            <td rowspan="2" width="5%">количество<br>ездок</td>
                            <td rowspan="2" width="5%">расстояние,<br>км</td>
                            <td rowspan="2" width="5%">перевезти<br> тон</td>
                        </tr>
                        <tr>
                            <td>погрузки</td>
                            <td >разгрузки</td>
                        </tr>
                        <tr>
                            <td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td>
                        </tr>
                    </thead>
                    <tbody style="border-left: 3px double; border-right: 3px double;">
                    	<tr>
                    		<td>{{waybill.organization.name}}</td><td></td>
                    		<td>{{waybill.tasks[0].from_dest}}</td>
                    		<td>{{waybill.tasks[0].to_dest}}</td>
                    		<td>{{waybill.tasks[0].kind}}</td>
                    		<td></td><td></td><td></td>
                    	</tr>
                    	<tr v-for="i in 3"><td v-for="i in 8">&nbsp;</td></tr>
                    </tbody>
                    <tfoot>
                    	<tr style="border: none"><td style="border:0;" colspan="5" class="text-right q-px-sm">Итого</td>
                    		<td v-for="i in 3" style="border: 2px solid;"></td>
                    	</tr>
                    </tfoot>
				</table>
			</div>
			<div class="row">
				Водительское удостоверение проверил, выдал
			</div>
			<div class="row q-pt-sm">
				<div class="col-4">
					<div class="row">
						выдать горючего <span class="col bb">{{ waybill.fuel_issued }}</span> литров
					</div>
					<div class="row q-pt-md">
						<span class="text-bold">Диспетчер</span>
						<span class="col bb q-mx-xs"><span class="under-text">(подпись)</span></span>
						<span class="col bb q-mx-xs">
							{{ waybill.dispatcher ? waybill.dispatcher.full_name : '&nbsp' }}
							<span class="under-text">(расшифровка подписи)</span>
						</span>
					</div>
					<div class="row q-pt-md">
						<span class="text-left col-12">Водитель по состоянию<br/>здоровья к управлению<br/>допущен</span>
						<span class="offset-1 col-3 self-end bb q-mx-xs">&nbsp;<span class="under-text">(должность)</span></span>
						<span class="col-3 self-end bb q-mx-xs">&nbsp;<span class="under-text">(подпись)</span></span>
						<span class="col self-end bb q-mx-xs">&nbsp;<span class="under-text">(расщифровка подписи)</span></span>
					</div>
				</div>
				<div class="col-5 q-pl-xl">
					<div class="row">
						Автомобиль технически исправен <span class="col bb q-mx-xs"></span>
					</div>
					<div class="row q-pt-md">
						<span class="col-3 text-left">Выезд разрешен.</span>
						<span class="text-bold col-2">Механик</span>
						<span class="col-2 bb q-mx-xs">&nbsp;<span class="under-text" >(подпись)</span></span>
						<span class="col bb q-mx-xs">{{ waybill.check_out_allow.full_name }}<span class="under-text" >(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md">
						<span class="col-3 text-left">Автомобиль принял.</span>
						<span class="text-bold col-2">Водитель</span>
						<span class="col-2 bb q-mx-xs">&nbsp;<span class="under-text" >(подпись)</span></span>
						<span class="col bb q-mx-xs">{{ waybill.car_took.full_name }}<span class="under-text" >(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-lg">
						При возвращении автомобиль
						<span class="col-3 bb q-mx-xs">исправен<span class="under-text">неисправен</span></span>
					</div>
					<div class="row q-pt-md">
						<span class="col-3 text-left">Сдал</span>
						<span class="text-bold col-2">Водитель</span>
						<span class="col-2 bb q-mx-xs">&nbsp;<span class="under-text" >(подпись)</span></span>
						<span class="col bb q-mx-xs">{{ waybill.auto_passed.full_name }}<span class="under-text" >(расшифровка подписи)</span></span>
					</div>
					<div class="row q-pt-md">
						<span class="col-3 text-left">Принял</span>
						<span class="text-bold col-2">Механик</span>
						<span class="col-2 bb q-mx-xs">&nbsp;<span class="under-text" >(подпись)</span></span>
						<span class="col bb q-mx-xs">{{ waybill.auto_accept.full_name }}<span class="under-text" >(расшифровка подписи)</span></span>
					</div>
				</div>
				<div class="col q-pl-md flex">
					<div class="row text-left">
						<span class="col-12 bb">Отметки организации-владельца
						автотранспорта</span>
						<span class="col-12 bb">&nbsp;</span>
						<span class="col-12 bb">&nbsp;</span>
						<span class="col-12 bb">&nbsp;</span>
						<span class="col-12 bb">&nbsp;</span>
					</div>
				</div>
			</div>
			<div class="row">
				<span>Место для<br/> штампа</span>
			</div>
		</div>
		<div class="page flex column justify-around"  v-if="waybill">
			<table class="full-width wb-tables" style="border-collapse: collapse;">
				    <thead style="border: 3px double;">
                        <tr>
                            <td colspan="12" class="q-pa-sm" style="font-size: 10pt;">ПОСЛЕДОВАТЕЛЬНОСТЬ ВЫОЛНЕНИЯ ЗАДАНИЯ</td>
                            <td rowspan="3" width="10%">Условия</td>
                            <td rowspan="3" width="10%">Подпись и печать<br>грузоотправителя<br>(грузополучателя)</td>
                        </tr>
                        <tr>
                            <td colspan="2">маршрут</td>
                            <td rowspan="2" width="3%">номер<br>ездки</td>
                            <td colspan="3">убытие</td>
                            <td colspan="2">прибытие</td>
                            <td colspan="3">Расход ГСМ на пройденное</td>
                            <td rowspan="2">Вид работ</td>
                        </tr>
                        <tr>
                            <td width="10%">место отправки</td>
                            <td width="10%">место назначения</td>
                            <td width="4%">число</td>
                            <td width="4%">ч.</td>
                            <td width="4%">мин.</td>
                            <td width="4%">ч.</td>
                            <td width="4%">мин.</td>
                            <td width="4%">км</td>
                            <td width="4%">норма</td>
                            <td width="4%">итого</td>
                        </tr>
                        <tr><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td><td>36</td>
                        <td>37</td><td>38</td><td>39</td></tr>
                    </thead>
                    <tbody>
                    	<tr v-for="(task, i) in waybill.tasks">
                    		<td>{{ task.from_dest }}</td>
                    		<td>{{ task.to_dest }}</td>
                    		<td>{{ i + 1 }}</td>
                    		<td>{{ new Date(task.departure).getDate() }}</td>
                    		<td>{{ new Date(task.departure).getHours() }}</td>
                    		<td>{{ new Date(task.departure).getMinutes() }}</td>
                    		<td>{{ new Date(task.arrival).getHours() }}</td>
                    		<td>{{ new Date(task.arrival).getMinutes() }}</td>
                    		<td>{{ task.distance }}</td>
                    		<td>{{ task.get_rate }}</td>
                    		<td>{{ task.total_fuel }}</td>
                    		<td>{{ task.kind }}</td>
                    		<td>{{ task.conds_full }}</td>
                    		<td class="q-pa-md"></td>
                    	</tr>
                    	<tr v-for="i in (5 - waybill.tasks.length)"><td class="q-pa-sm" v-for="i in 14">&nbsp;</td></tr>
                    </tbody>
                    <tfoot>
                    	<tr>
                    		<td style="border:0">&nbsp;</td><td style="border:0" class="text-right q-pr-sm">Всего</td>
                    		<td style="border: 2px solid;">{{waybill.tasks.length}}</td>
                    		<td style="border:0" class="text-right q-pr-sm" colspan="5">Всего км</td>
                    		<td style="border: 2px solid;">{{ waybill.total_km }}</td>
                    		<td style="border:0">Всего л.</td>
                    		<td style="border: 2px solid;">{{ waybill.total_fuel }}</td>
                    		<td style="border:0" class="text-right">ТДД в количестве <span style="border: 2px solid;" class="q-px-lg">&nbsp;</span></td>
                    		<td style="border:0"><span class="bb q-px-xl">&nbsp;<span class="under-text">(прописью)</span></span></td>
                    		<td style="border:0" class="text-left">шт.</td>
                    	</tr>
                    </tfoot>
			</table>
			<div class="row flex-center q-pt-xl">
				<span class="text-bold col-2 q-body-1">Таксировка</span>
				Сдал водитель <span class="col-1 bb q-mx-xs">&nbsp;<span class="under-text">(подпись)</span></span>
				<span class="col-2 bb q-mx-xs">	{{ waybill.auto_passed.full_name }}
					<span class="under-text">(расшифровка подписи)</span>

				</span>
				Принял диспетчер <span class="col-1 bb q-mx-xs">&nbsp;<span class="under-text">(подпись)</span></span>
				<span class="col-2 bb q-mx-xs"> {{ waybill.dispatcher ? waybill.dispatcher.full_name : '&nbsp' }}
					<span class="under-text">(расшифровка подписи)</span>
				</span>
			</div>
			<div class="row q-pt-md">
            	<div class="col-5 q-pr-sm">
	                <table class="text-left full-width">
	                    <tr>
	                        <td>Особые отметки:</td>
	                        <td style="border-bottom: 1px solid; width: 78%;"></td>
	                    </tr>
	                    <tr><td colspan="2" style="border-bottom: 1px solid; width: 75%;">&nbsp;</td></tr>
	                    <tr><td colspan="2" style="border-bottom: 1px solid; width: 75%;">&nbsp;</td></tr>
	                    <tr><td colspan="2" style="border-bottom: 1px solid; width: 75%;">&nbsp;</td></tr>
	                </table>
            	</div>
	            <div class="col">
	                <table border='1' class="full-width">
	                    <tr>
	                        <td colspan="4">Простои на линии</td>
	                        <td width="15%" rowspan="3">Подпись<br>ответст-<br>венного лица</td>
	                    </tr>
	                    <tr>
	                        <td colspan="2">причина</td>
	                        <td colspan="2">дата (число, месяц), время, ч. мин.</td>
	                    </tr>
	                    <tr>
	                        <td>наименование</td>
	                        <td width="10%">код</td>
	                        <td width="20%">начало</td>
	                        <td width="20%">окончание</td>
	                    </tr>
	                    <tr>
	                        <td>41</td><td>42</td><td>43</td><td>44</td><td>45</td>
	                    </tr>
	                    <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
	                </table>
            	</div>
			</div>
			<div class="row">
                <table class="full-width" style="border-top: 3px double;" border="1">
                    <thead>
                        <tr>
                            <td colspan="21" style="font-size: 12px;">РЕЗУЛЬТАТЫ РАБОТЫ АВТОМОБИЛЯ И ПРИЦЕПОВ</td>
                        </tr>
                        <tr>
                            <td colspan="2">расход горючего, л</td>
                            <td colspan="7">время в наряде, ч. мин.</td>
                            <td colspan="2">количество</td>
                            <td colspan="4">пробег, км</td>
                            <td colspan="2">перевезено, т</td>
                            <td colspan="2">выполнено, ткм</td>
                            <td colspan="2">зарплата</td>
                        </tr>
                        <tr>
                            <td width='4%' rowspan="4">по норме</td>
                            <td width='4%' rowspan="4">факти-<br>чески</td>
                            <td colspan="2">всего</td>
                            <td colspan="5">в том числе автомобиля</td>
                            <td rowspan="4">ездок</td>
                            <td rowspan="4">заездов</td>
                            <td colspan="2">общий</td>
                            <td colspan="2">в том числе с грузом</td>
                            <td rowspan="4">всего</td>
                            <td rowspan="4">в том<br>числе на<br>прице-<br>пах</td>
                            <td rowspan="4">всего</td>
                            <td rowspan="4">в том<br>числе на<br>прице-<br>пах</td>
                            <td>код</td>
                            <td>сумма, руб. коп.</td>
                        </tr>
                        <tr>
                            <td width='4%' rowspan="3">автомо-<br>биля</td>
                            <td width='5%' rowspan="3">прицепа</td>
                            <td width='5%' rowspan="3">в движении</td>
                            <td colspan="4">в простое</td>
                            <td rowspan="3">автомо-<br>биля</td>
                            <td rowspan="3">прицепа</td>
                            <td rowspan="3">автомо-<br>биля</td>
                            <td rowspan="3">прицепа</td>
                            <td>65</td>
                            <td>66</td>
                        </tr>
                        <tr>
                            <td width='4%' rowspan="2">всего</td>
                            <td colspan="2">под погрузкой, разгрузкой</td>
                            <td>по техническим<br>неисправностям</td>
                            <td></td><td></td>
                        </tr>
                        <tr>
                            <td width='4%'>всего</td>
                            <td width='4%'>сверхнормат.</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                      
                        <tr>
                            <td>46</td><td>47</td><td>48</td><td>49</td><td>50</td><td>51</td><td>52</td><td>53</td><td>54</td><td>55</td><td>56</td><td>57</td><td>58</td><td>59</td><td>60</td><td>61</td><td>62</td><td>63</td><td>64</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>{{waybill.total_fuel}}</td><td>{{waybill.total_fuel}}</td><td>{{waybill.total_hours}}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
			</div>
			<div class="row flex-center q-pt-md" style="font-size: 12px; line-height: 100%;">
	           <span class="q-px-md">Коды марок:</span>
	           <span class="q-px-md">Автомобиля</span>
	           <span style="border: 2px solid;" class="q-px-lg q-py-xs">&nbsp;</span>
	           <span class="q-px-md">Прицепов</span>
	           <span style="border: 1px solid;" class="q-px-lg q-py-xs">&nbsp;</span>
	           <span style="border: 1px solid;" class="q-px-lg q-py-xs">&nbsp;</span>
	           <span style="border: 1px solid;" class="q-px-lg q-py-xs">&nbsp;</span>
	           <span class="q-px-md">Автомобиль,<br/>дни в работе</span>
	           <span style="border: 2px solid;" class="q-px-lg q-py-xs">&nbsp;</span>
	           <span class="q-px-md">Таксировщик</span>
	           <span class="bb q-px-lg">&nbsp;<span class="under-text">(подпись)</span></span>
	           <span class="bb q-px-xl q-mx-xs">&nbsp;<span class="under-text">(расшифровка подписи)</span></span>
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

 #waybill-h{
  background: rgb(204,204,204); 
  font:  10px Times New Roman, serif;
}

* {position: relative; padding: 0; margin: 0;}

#waybill-h .page {
	text-align: center;
  background: white;
  margin: 0 auto;
  padding: 1cm;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  
}
#waybill-h .page {  
  width: 29.7cm; 
  height: 21cm; 
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
  #waybill-h .under-text {position: absolute; left: 0; top: 10px; text-align: center; width: 100%; font-size: 9px;}

  #waybill-h table {
  	border-collapse: collapse;
  	text-align: center;
  }
   #waybill-h .mini-table td:nth-child(even){
   		border: 1px solid;
   		border-left: 2px solid;
   		border-right: 2px solid;
   		width: 40px;
   }
   #waybill-h .mini-table td:nth-child(odd){
   	text-align: right;
   	padding-right: 5px;
   }
   #waybill-h .wb-tables td{
   	border: 1px solid;
   }

</style>
<style type="text/css" media="print">
	@media print {
	html, body{height:100%;width:100%;margin:0;padding:0;}
   #waybill-h .page {
    margin: 0;
    box-shadow: none;
  }

}
</style>

<style scoped>
  @page {
  	margin: -1px;
  	max-height:100%; 
  	max-width:100%; 
  	size: A4 landscape;}


</style>