<template>
  <q-stepper 
    color="positive" 
    v-model="currentSection" 
    class="outfit" 
    ref="stepper" 
    contractable 
    alternative-labels >
    <q-step name="main" title="Главное" subtitle="Основные данные" :order="1" active-icon="assignment" icon="assignment">
      <div class="row outfit-form flex-center group q-py-sm full-height">
        <div class="col-md-5 col-xs-12 q-pa-md shadow-3 full-height">
          <q-field label="Участок:" icon="location_city" :icon-color="form.station ? 'positive' : 'negative'" orientation="horizontal"> 
            <q-select
              v-model="form.station"
              :options="options.stations.map(st => {return {label: st.name, value: st.id}})"
              separator 
              placeholder="Выберите участок"
            />
          </q-field>
          <q-field label="Отдел:" icon="stars" :icon-color="form.departament ? 'positive' : 'negative'" orientation="horizontal">
            <q-select 
              v-model="form.departament"
              :options="$store.state.main.departaments"
              separator 
              placeholder="Выберите отдел"
            />
          </q-field>
          <q-field label="Лесничество:" icon="panorama" :icon-color="form.forestry ? 'positive' : 'negative'" orientation="horizontal">
            <q-input 
            type="text" 
            autocomplete="on" 
            v-model="form.forestry" 
            placeholder="Укажите лесничество" 
            />
          </q-field>
          <q-field label="Место работы:" icon="place" :icon-color="form.place ? 'positive' : 'primary'" orientation="horizontal">
            <q-input 
            type="text" 
            v-model="form.place"
            placeholder="Укажите место" 
            />
          </q-field>
          <q-field label="Мероприятие:" icon="gavel" :icon-color="form.event ? 'positive' : 'negative'" orientation="horizontal">
            <q-select
            :options="options.outfit_events.map(ev => {return {label: ev.full_name, value: ev.id}})"
            filter
            v-model="form.event"
            placeholder="Выберите мероприятие"
            filter-placeholder="Поиск"
            separator 
            :autofocus-filter="false"
            :before="[{
                icon: 'add',
                color: 'positive',
                handler: addEvent,
                class: 'bg-positive text-white round-borders',
              }]"
            />
          </q-field>
          <q-field label="Оценка качества:" icon="thumbs_up_down" :icon-color="form.quality ? 'positive' : 'negative'" orientation="horizontal">
            <q-select
            :options="options.quality"
            v-model="form.quality"
            placeholder="Выберите оценку качества работы"
            />
          </q-field>
          <q-field label="Начало работы:" icon="today" :icon-color="form.begin ? 'positive' : 'negative'" orientation="horizontal">
            <q-datetime type="date" format="DD.MM.YYYY" :value="form.begin" @change="val => {form.begin = new Date(val).toDateString()}" :max="form.end" placeholder="Укажите дату начала работы" />
          </q-field>
          <q-field label="Окончание работы:" icon="date_range" :icon-color="form.end ? 'positive' : 'negative'" orientation="horizontal">
            <q-datetime type="date" format="DD.MM.YYYY" :value="form.end" @change="val => {form.end = new Date(val).toDateString()}"  :disable="!form.begin" :min="form.begin" placeholder="Укажите дату окончания работы" />
          </q-field>
            <div class="row justify-between q-py-md group q-my-sm round-borders">
              <q-input 
              type="number" 
              hide-underline 
              class="col shadow-1 justify-center"  
              align="center" 
              v-model="form.conditions" 
              stack-label="Условия труда" 
              />
              <q-input 
              type="number" 
              hide-underline  
              class="col shadow-1" 
              align="center" 
              v-model="form.bonus" 
              stack-label="Качество" 
              />
             <q-input 
             type="number" 
             hide-underline 
             class="col shadow-1" 
             align="center" 
             v-model="form.coefficient" 
             stack-label="Интенсивность" 
             />
            </div>
          <q-field label="Вид механизма:" icon-color="green" icon="settings" orientation="horizontal">
            <q-input type="text" autocomplete="on" v-model="form.mechanism" placeholder="Укажите вид механизма" />
          </q-field>
          <q-field label="Задание на месяц:" icon="event_note" icon-color="green" orientation="horizontal">
            <q-input type="text" autocomplete="on" v-model="form.task" placeholder="Укажите задание на месяц" />
          </q-field>
        </div>
      </div>
    </q-step>
    <q-step name="works" title="Работы" subtitle="Перечень работ" :order="2" active-icon="gavel" icon="gavel">
      <div class="row fit" style="min-height: 66vh">
      <q-table 
        :data="form.works" 
        :columns="columns.works"
        table-class="workTable" 
        class="fit" 
        dense hide-bottom
        :pagination="{rowsPerPage: 0}" >
        <template slot="top-left" slot-scope="props">
          <q-btn icon="add" color="positive" glossy label="Добавить" @click.native="dialogs.work_form = !dialogs.work_form"/>
        </template>
        <q-td slot="body-cell-options" slot-scope="props" :props="props">
          <q-btn-dropdown icon="menu" dense color="primary" split glossy>
            <q-list link separator>
                <q-item @click.native="editObject(props.row, 'work_form')" v-close-overlay>
                  <q-item-side icon="edit" color="primary" />
                  <q-item-main label="Редактировать"/>
                </q-item>
              <q-item @click.native="form.works = form.works.filter(work => work !== props.row)">
                <q-item-side icon="delete" color="negative" />
                <q-item-main label="Удалить"/>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
        <template slot="bottom-row" slot-scope="props" v-if="form.works.length > 0">
          <q-tr align="center" class="bg-grey-2">
            <q-td><strong>Итого:</strong></q-td>
            <q-td colspan="7"></q-td>
            <q-td><strong>{{form.amount}}</strong></q-td>
            <q-td colspan="3"></q-td>
          </q-tr>
          <q-tr align="center" class="bg-grey-2">
            <q-td><strong>Условия труда:</strong></q-td>
            <q-td colspan="7" align="left"><strong>{{form.conditions}}%</strong></q-td>
            <q-td><strong>{{form.amount_conditions}}</strong></q-td>
            <q-td colspan="3"></q-td>
          </q-tr>
          <q-tr align="center" v-if="form.coefficient"  class="bg-grey-2">
            <q-td><strong>Коэффициент:</strong></q-td>
            <q-td colspan="7" align="left"><strong>{{form.coefficient}}%</strong></q-td>
            <q-td><strong>{{form.amount_coefficient}}</strong></q-td>
            <q-td colspan="3"></q-td>
          </q-tr>
          <q-tr align="center" v-if="form.bonus"  class="bg-grey-2">
            <q-td><strong>Премия:</strong></q-td>
            <q-td colspan="7" align="left"><strong>{{form.bonus}}%</strong></q-td>
            <q-td><strong>{{form.amount_bonus}}</strong></q-td>
            <q-td colspan="3"></q-td>
          </q-tr>
          <q-tr align="center"  class="bg-grey-5">
            <q-td><strong>Всего:</strong></q-td>
            <q-td colspan="5"></q-td>
            <q-td><strong>{{form.done_total}}</strong></q-td>
            <q-td></q-td>
            <q-td><strong>{{form.amount_total}}</strong></q-td>
            <q-td><strong>
              {{ form.works.map(w => w.man_days)
                .reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}
            </strong></q-td>
            <q-td><strong>
              {{ form.works.map(w => w.auto_days)
                .reduce((a,b) => parseFloat(a) + parseFloat(b), 0) || '' }}
            </strong></q-td>
            <q-td><strong>
              {{ form.works.map(w => w.days)
                .reduce((a,b) => parseFloat(a) + parseFloat(b), 0) }}
            </strong></q-td>
          </q-tr><q-tr></q-tr>
        </template>
      </q-table>
      </div>
    </q-step>
    <q-step
     name="tables" 
     title="Табель" 
     subtitle="Использование рабочего времени" 
     :order="3" 
     active-icon="grid_on" 
     icon="grid_on">
      <div class="row" style="min-height: 66vh;">
        <q-table
          :data="form.tables"
          :columns="columns.tables"
          dense
          hide-bottom
          class="full-width tables"
          :pagination="{ rowsPerPage: 0 }"
          >
          <template slot="top-left" slot-scope="props">
            <q-btn icon="add" color="positive" glossy label="Добавить" @click.native="dialogs.table_form = !dialogs.table_form"/>
          </template>
          <q-td slot="body-cell-options" slot-scope="props" :props="props">
            <q-btn-dropdown icon="menu" dense color="primary" glossy>
              <q-list link separator>
                  <q-item @click.native="editObject(props.row, 'table_form')" v-close-overlay>
                    <q-item-side icon="edit" color="primary" />
                    <q-item-main label="Редактировать" />
                  </q-item>
                <q-item @click.native="form.tables = form.tables.filter(table => table !== props.row)">
                  <q-item-side icon="delete" color="negative" />
                  <q-item-main label="Удалить"/>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
          <q-tr slot="bottom-row" class="bg-grey-5" slot-scope="props" align="center" v-if="form.tables.length > 0">
            <q-td><strong>Итого:</strong></q-td>
            <q-td colspan="2"></q-td>
            <q-td><strong>{{ form.hours_total }}</strong></q-td>
            <q-td><strong>{{ form.days_total }}</strong></q-td>
            <q-td><strong>{{ form.done_total }}</strong></q-td>
            <q-td><strong>{{ form.amount }}</strong></q-td>
            <q-td><strong>{{ form.amount_coefficient }}</strong></q-td>
            <q-td><strong>{{ form.amount_conditions }}</strong></q-td>
            <q-td><strong>{{ form.amount_bonus }}</strong></q-td>
            <q-td><strong>{{ form.amount_total }}</strong></q-td>
          </q-tr>
        </q-table>
      </div>
    </q-step>
    <q-step 
      name="materials" 
      title="Материалы" 
      subtitle="Приходы и расходы материалов" 
      :order="4" 
      active-icon="swap_horiz" 
      icon="swap_horiz">
      <div class="row" style="min-height: 65vh">
        <div class="col-md-6 col-xs-12 flex">
          <q-table
            :data="form.expenses"
            :columns="columns.expenses"
            hide-bottom
            dense
            :pagination="{rowsPerPage: 0}"
            class="fit"
            >
            <div slot="top" slot-scope="props" class="row fit shadow-1 items-center q-pa-xs  bg-tertiary glossy text-white round-borders">
              <q-btn 
              icon="add" 
              color="positive" 
              dense  
              glossy 
              label="Добавить" 
              @click.native="dialogs.expense_form = !dialogs.expense_form" 
              />
              <span class="col text-center q-pa-sm">Расход материалов</span>
            </div>
            <q-td slot="body-cell-options" slot-scope="props" :props="props">
              <q-btn-dropdown icon="menu" dense color="primary" glossy>
                <q-list link separator>
                    <q-item @click.native="editObject(props.row, 'expense_form')">
                      <q-item-side icon="edit" color="primary" />
                      <q-item-main label="Редактировать"/>
                    </q-item>
                  <q-item @click.native="form.expenses = form.expenses.filter(ex => ex !== props.row)">
                    <q-item-side icon="delete" color="negative" />
                    <q-item-main label="Удалить"/>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </q-table>
        </div>
        <div class="col-md-6 col-xs-12 flex">
          <q-table
            :data="form.postings"
            :columns="columns.postings"
            hide-bottom
            dense
            :pagination="{rowsPerPage: 0}"
            class="fit"
            >
            <div 
            slot="top" 
            slot-scope="props" 
            class="row fit shadow-1 items-center q-pa-xs bg-tertiary glossy text-white round-borders">
              <q-btn 
                icon="add" 
                color="positive" 
                dense 
                glossy 
                label="Добавить" 
                @click.native="dialogs.posting_form = !dialogs.posting_form" 
              />
              <span class="col text-center q-pa-sm">Приход материалов</span>
            </div>
            <q-td slot="body-cell-options" slot-scope="props" :props="props">
              <q-btn-dropdown icon="menu" dense color="primary" glossy>
                <q-list link separator>
                    <q-item @click.native="editObject(props.row, 'posting_form')">
                      <q-item-side icon="edit" color="primary" />
                      <q-item-main label="Редактировать"/>
                    </q-item>
                  <q-item @click.native="form.postings = form.postings.filter(pst => pst !== props.row)">
                    <q-item-side icon="delete" color="negative" />
                    <q-item-main label="Удалить"/>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </q-table>
        </div>
      </div>
    </q-step>
    <q-step name="personal" title="Перосонал" subtitle="Ответственные лица" :order="5" active-icon="people" icon="people">
      <div class="row flex-center" style="min-height: 63vh;">
        <div class="col-md-5 shadow-1 q-pa-sm">
          <q-field
            label="Бригадир:"
            label-width="5"
            orientation="horizontal"
            :icon="form.brigadier ? 'check_circle' : 'error'" 
            :icon-color="form.brigadier ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.brigadier"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Наряд выдан:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.issued ? 'check_circle' : 'error'" 
            :icon-color="form.issued ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.issued"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="К исполнению принял:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.accepted ? 'check_circle' : 'error'" 
            :icon-color="form.accepted ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.accepted"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Работу сдал:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.work_passed ? 'check_circle' : 'error'" 
            :icon-color="form.work_passed ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.work_passed"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Работу принял:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.work_accept ? 'check_circle' : 'error'" 
            :icon-color="form.work_accept ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.work_accept"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Ответственный за ведение табеля:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.responsible ? 'check_circle' : 'error'" 
            :icon-color="form.responsible ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.responsible"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Расчет составил:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.calculated ? 'check_circle' : 'error'" 
            :icon-color="form.calculated ? 'positive' : 'negative'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.calculated"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
          <q-field 
            label="Принял на ответственное хранение:" 
            label-width="5" 
            orientation="horizontal" 
            :icon="form.deposited ? 'check_circle' : 'check_circle'" 
            :icon-color="form.deposited ? 'positive' : 'grey'"
            >
            <q-select
            :options="options.workers.map(w => {return {label: w.full_name, value: w.id}})"
            filter
            v-model="form.deposited"
            float-label="Выберите работника"
            filter-placeholder="Поиск"
            />
          </q-field>
        </div>
      </div>
    </q-step>
    <q-stepper-navigation class="bg-tertiary q-pa-sm glossy" style="margin: 0; height: 10vh">
      <div class="row justify-center col-12 group">
            <q-btn
              :disabled="currentSection =='main'"
              @click="$refs.stepper.previous()"
              label="Назад"
              color="primary"
              icon="arrow_back"
              class="text-bold"
              glossy
            />
            <q-btn
              v-if="currentSection =='personal'"
              :disabled="!stepIsComplete"
              @click="saveOutfit"
              label="Сохранить"
              color="positive"
              icon="save"
              class="text-bold"
              glossy
            />
            <q-btn
              v-else
              @click="$refs.stepper.next()"
              label="Далее"
              :color="stepIsComplete ? 'positive' : 'negative'"
              icon="arrow_forward"
              class="text-bold"
              glossy
              :disabled="!stepIsComplete"
            />
      </div>
    </q-stepper-navigation>

                                    <!-- Add works dialog -->
    <q-modal 
        v-model="dialogs.work_form"  
        no-backdrop-dismiss 
        @hide="resetForm('work_form')" 
        content-css="max-height:100%;"
        content-classes="row col-4 justify-around" >
          <q-toolbar class="row justify-end self-start" color="indigo" glossy>
            <q-toolbar-title>Добавить работу</q-toolbar-title>
            <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
          </q-toolbar>
          <div class="q-pa-sm full-width">
            <q-field label="Наименование:">
              <q-input type="textarea" v-model="work_form.name" :max-height="10" rows="3" />
            </q-field>
            <q-field label="Ед. измерения:">
              <q-select
                :options="$store.state.main.units.map(u => {return {label: u.name, value: u.id }})"
                v-model="work_form.units"
              />
            </q-field>
            <q-field label="Нормы выработки:">
              <q-input type="number" :decimals="1" :step="0.1" :min="0" v-model="work_form.rate" />
            </q-field>
            <q-field label="Выполнено:">
              <q-input type="number" :decimals="1" :step="0.1" :min="0" v-model="work_form.done" :readonly="!work_form.rate"/>
            </q-field>
            <q-field label="Параграф:">
              <q-input type="text" v-model="work_form.paragraph" />
            </q-field>
            <q-field label="Расценка, руб:">
              <q-input type="number" :decimals="2" :step="0.1" :min="0" v-model="work_form.pricing" />
            </q-field>
            <q-field label="Отработано:">
              <q-input type="number" :decimals="1" :step="0.1" :min="0" v-model="work_form.man_days" float-label="Человеко-дней" />
              <q-input type="number" :step="0.1" :min="0" v-model="work_form.auto_days" float-label="Машино-смен" />
              <q-input type="number" :step="0.1" :min="0" v-model="work_form.days" float-label="Дней"/>
            </q-field>
            <div class="row justify-around group">
              <q-chip square color="primary">Выполнено норм: {{work_form.done_norms}}</q-chip>
              <q-chip square color="primary">Сумма, руб: {{work_form.amount}}</q-chip>
            </div>
          </div>
          <q-toolbar class="justify-around"  color="indigo" glossy>
            <q-btn 
            label="Сохранить" 
            color="positive" 
            @click.native="saveObject('work_form', 'works', false)" 
            :disabled="!formIsValid('work_form')"
            />
            <q-btn 
            label="Копия" 
            color="primary" 
            @click.native="saveObject('work_form', 'works', true)" 
            :disabled="!formIsValid('work_form')"
            />
            <q-btn
            label="Закрыть" 
            color="negative" 
            v-close-overlay 
            />
          </q-toolbar>
    </q-modal>
                                    <!-- Add tables dialog -->
    <q-modal 
        v-model="dialogs.table_form" 
        no-backdrop-dismiss 
        @hide="resetForm('table_form')"
        content-classes="row col-4 justify-center"
        content-css="max-height:100%;">
        <q-toolbar class="row justify-end self-start" color="indigo" glossy>
          <q-toolbar-title>Добавить табель</q-toolbar-title>
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
        </q-toolbar>
        <div class="q-pa-sm full-width" :style="$q.platform.is.desktop ? 'max-width: 500px;' : 'min-height:83vh;'">
          <q-field label="Работник:" 
            :helper="table_form.worker ? options.workers.find(w => w.id == table_form.worker).position : ''" >
            <q-select
              :options="options.workers.map(w => { return { label: w.full_name, value: w.id }})"
              filter
              autofocus-filter
              float-label="Выберите работника"
              filter-placeholder="Поиск"
              v-model="table_form.worker"
            />
          </q-field>
          <q-field label="Разряд:">
            <q-input 
            type="number" 
            :decimals="0" 
            v-model="table_form.rank" 
            float-label="Укажите разряд"
            />
          </q-field>
          <div class="row group items-center justify-between">
            <span class="text-bold">Отработано по числам месяца</span>
            <q-btn 
              icon="add"
              color="positive" 
              dense
              glossy
              @click.native="dialogs.workdays = true" 
            />
            </div>
            <div class="shadow-1 q-pa-xs q-mt-sm flex justify-around items-center" style="min-height: 100px;">
              <table class="text-center fit" cellspacing="0" cellpadding="0" border="1" style="font-size: 1em">
                <thead>
                  <tr>
                    <th>Удалить</th>
                    <th>Число</th>
                    <th>Часы</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in Object.keys(table_form.workdays)" :key="d">
                    <td>
                      <q-btn 
                      @click.native="$root.$delete(table_form.workdays, d)"
                      icon="delete"
                      flat
                      dense
                      color="negative"
                      />
                    </td>
                    <td>{{ d }}</td>
                    <td>{{ table_form.workdays[d] }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>Итого:</td>
                    <td>{{ table_form.days }}</td>
                    <td>{{ table_form.hours }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <q-dialog 
              v-model="dialogs.workdays" 
              no-backdrop-dismiss 
              @hide="resetForm('workdays_form')">
              <div slot="body">
                <q-datetime 
                type="datetime" 
                modal 
                v-model="workdays_form.workdays" 
                float-label="Выберите дату и часы" 
                format="DD.MM.YYYY - HH:mm" 
                clearable 
                />
              </div>
              <template slot="buttons" slot-scope="props">
                <div class="row full-width justify-between">
                <q-btn 
                label="Добавить" 
                color="positive" 
                @click.native="saveWorkdays" 
                :disabled="!formIsValid('workdays_form')"
                />
                <q-btn 
                label="Закрыть" 
                color="negative" 
                v-close-overlay 
                />
              </div>
              </template>
            </q-dialog>
        </div>
        <q-toolbar class="justify-around self-end" color="indigo" glossy>
          <q-btn 
            label="Сохранить" 
            color="positive" 
            @click.native="saveObject('table_form', 'tables', false)" 
            :disabled="!formIsValid('table_form')"
          />
          <q-btn 
            label="Копия" 
            color="primary" 
            @click.native="saveObject('table_form', 'tables', true)" 
            :disabled="!formIsValid('table_form')"
          />
          <q-btn 
            label="Закрыть" 
            color="negative" 
            v-close-overlay 
          />
        </q-toolbar>
    </q-modal>

                                    <!--   Add expenses dialog  -->
    <q-modal 
      v-model="dialogs.expense_form" 
      no-backdrop-dismiss 
      @hide="resetForm('expense_form')" 
      content-css="max-height:100%;" 
      content-classes="flex flex-center col-4">
      <q-toolbar class="row justify-end self-start" color="indigo" glossy>
        <q-toolbar-title>Добавить расход</q-toolbar-title>
        <q-btn
        flat
        round
        dense
        v-close-overlay
        icon="close"
      />
      </q-toolbar>
      <div class="q-pa-md full-width">
        <q-field label="Материал:">
          <q-select 
          :options="options.materials.map(m => {return { label: m.name, value: m.id }})" 
          v-model="expense_form.material" 
          filter 
          />
          <q-btn
           dense
           glossy 
           icon="add" 
           label="Создать" 
           color="positive"
           class="float-right q-mt-sm" 
           @click.native="dialogs.material_form = true"
          />
        </q-field>
        <q-field label="Количество:">
          <q-input 
          type="number" 
          v-model="expense_form.quantity_norm" 
          float-label="По норме" 
          />
          <q-input 
          type="number" 
          v-model="expense_form.quantity_fact" 
          float-label="Фактически" 
          />
        </q-field>
        <q-field label="Стоимость, руб:">
          <q-input 
          type="number" 
          v-model="expense_form.cost" 
          :decimals="2" 
          float-label="Введите сумму" 
          />
        </q-field>
      </div>
      <q-toolbar class="justify-around self-end" color="indigo" glossy>
        <q-btn 
        label="Сохранить" 
        color="positive" 
        @click.native="saveObject('expense_form', 'expenses')" 
        :disabled="!formIsValid('expense_form')"
        />
        <q-btn label="Закрыть" 
        color="negative" 
        v-close-overlay 
        />
      </q-toolbar> 
    </q-modal>

                                    <!--   Add postings dialog  -->
    <q-modal 
      v-model="dialogs.posting_form" 
      no-backdrop-dismiss 
      @hide="resetForm('posting_form')" 
      content-css="max-height:100%;" 
      content-classes="flex flex-center col-4">
      <q-toolbar class="row justify-end self-start" color="indigo" glossy>
        <q-toolbar-title>Добавить приход</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          v-close-overlay
          icon="close"
        />
      </q-toolbar>
      <div class="q-pa-md full-width">
        <q-field label="Материал:">
          <q-select 
          :options="options.materials.map(m => {return { label: m.name, value: m.id }})" 
          v-model="posting_form.material" 
          filter />
        </q-field>
        <q-btn
           dense
           glossy 
           icon="add" 
           label="Создать" 
           color="positive"
           class="float-right q-mt-sm" 
           @click.native="dialogs.material_form = true"
          />
        <q-field label="Количество:">
          <q-input 
          type="number" 
          v-model="posting_form.quantity" 
          float-label="Введите количество" 
          />
        </q-field>
      </div>
      <q-toolbar class="justify-around self-end" color="indigo" glossy>
        <q-btn 
        label="Сохранить" 
        color="positive" 
        @click.native="saveObject('posting_form', 'postings')" 
        :disabled="!formIsValid('posting_form')"
        />
        <q-btn 
        label="Закрыть" 
        color="negative" 
        v-close-overlay 
        />
      </q-toolbar>
    </q-modal>

                                    <!--   Add materials dialog  -->
    <q-dialog
      v-model="dialogs.material_form"
      @hide="resetForm('material_form')"
      >
      <div slot="body">
        <q-select 
          :options="options.categories.map(c => { return {label: c.name, value: c.resource_uri} })"
          float-label="Категория"
          separator
          v-model="material_form.category"
        />
        <q-input 
          type="text"
          v-model="material_form.name"
          float-label="Название"
        />
        <q-select 
          :options="$store.state.main.units.map(c => { return {label: c.name, value: c.resource_uri} })"
          float-label="Еденицы измерения"
          separator
          v-model="material_form.units"
        />
        <q-input
          type="number"
          :decimals="2"
          :value="material_form.quantity"
          @input="val => { material_form.quantity = val.toFixed(2) }"
          float-label="Количество"
        />
      </div>
      <template slot="buttons" slot-scope="props">
        <div class="row full-width justify-between">
          <q-btn 
          label="Добавить" 
          color="positive" 
          @click.native="saveMaterial" 
          :disabled="!(material_form.name && material_form.units && material_form.category)"
          glossy
          />
          <q-btn 
          label="Закрыть" 
          color="negative" 
          v-close-overlay 
          glossy
          />
        </div>
      </template>
    </q-dialog>
  </q-stepper>
</template>

<script>

export default {
   name: 'NewOutfit',
   props: ['template'],
   data() {
     return {
       currentSection: 'main',

       // Forms
       form: {

         // Main data
         station: null,
         place: null,
         departament: null,
         forestry: null,
         mechanism: null,
         event: null,
         conditions: 0,
         bonus: 0,
         coefficient: 0,
         task: null,
         begin: null,
         end: null,
         quality: null,

         // Summary data
         done_total: 0,
         amount: 0,
         amount_conditions: 0,
         amount_coefficient: 0,
         amount_bonus: 0,
         amount_total: 0,
         hours_total: 0,
         days_total: 0,

         // Related data
         works: [],
         expenses: [],
         postings: [],
         tables: [],

         // Personal
         brigadier: null,
         issued: null,
         accepted: null,
         work_passed: null,
         work_accept: null,
         responsible: null,
         calculated: null,
         deposited: null
       },
      // Form for add works
       work_form: {
          name: null,
          units: null,
          rate: null,
          done: null,
          paragraph: null,
          done_norms: null,
          pricing: null,
          amount: null,
          man_days: null,
          auto_days: null,
          days: null,
       },
       // Form for add tables
       table_form: {
         worker: null,
         rank: null,
         workdays: {},
         hours: null,
         days: null,
         tariff_rate: null,
         by_coefficient: null,
         by_conditions: null,
         done: null,
         bonus: null,
         total: null
       },
       // Form for add workdays
       workdays_form: {
         workdays: null,
       },
       // Form for add expenses
       expense_form: {
         name: null,
         units: null,
         quantity_norm: null,
         quantity_fact: null,
         cost: null,
       },
       // Form for add postings
       posting_form: {
         name: null,
         units: null,
         quantity: null,
       },
       // Add material form
       material_form: {
        name: null,
        category: null,
        quantity: null,
        units: null,
       },
       // Form selection options
       options: {
         workers: [],
         outfit_events: [],
         stations: [],
         materials: [],
         categories: [],
         // Choices of quality of work
         quality: [
              { label: 'Удовлетворительно', value: 'good', icon:"thumb_up", leftColor: 'positive'},
              { label: 'Неудовлетворительно', value: 'bad', icon:"thumb_down", leftColor: 'negative'},
         ],
       },
       // Required fields
       required: {
           work_form: [
             'name', 'units', 'rate', 'done', 'paragraph', 'done_norms',
             'pricing', 'amount', 'man_days', 'days'
           ],
           table_form: [
             'worker', 'rank', 'workdays', 'hours', 'days',
           ],
           workdays_form: ['workdays'],
           expense_form: [
             'material', 'quantity_norm', 'quantity_fact'
           ],
           posting_form: [
             'material', 'quantity'
           ],
           main: [
             'station', 'departament', 'forestry', 'event', 'quality', 'begin', 'end'
           ],
           personal: [
             'brigadier', 'issued', 'accepted','work_passed',
             'work_accept', 'responsible', 'calculated',
           ]
       },
       // Dialogs
       dialogs: {
         work_form: false,
         table_form: false,
         workdays: false,
         expense_form: false,
         posting_form: false,
         material_form: false,
       },
       // Columns for tables
       columns: {
         works: [
           {name: 'options', label: 'Опции', align: 'center'},
           {name: 'name', label: 'Наименование', field: 'name', align: 'center'},
           {name: 'units', label: 'Ед. изм.', 
            field: work => 
            this.$store.state.main.units.find(u => u.id == work.units).short, align: 'center'
            },
           {name: 'rate', label: 'Нормы выработки', field: 'rate', align: 'center'},
           {name: 'done', label: 'Выполнено', field: 'done', align: 'center'},
           {name: 'paragraph', label: 'Параграф', field: 'paragraph', align: 'center'},
           {name: 'done_norms', label: 'Выполнено норм', field: 'done_norms', align: 'center'},
           {name: 'pricing', label: 'Расценка, руб.', field: 'pricing', align: 'center'},
           {name: 'amount', label: 'Сумма, руб.', field: 'amount', align: 'center'},
           {name: 'man_days', label: 'Человеко-дней', field: 'man_days', align: 'center'},
           {name: 'auto_days', label: 'Машино-смен', field: 'auto_days', align: 'center'},
           {name: 'days', label: 'Дней', field: 'days', align: 'center'},
         ],
         expenses: [
           {name: 'options', label: 'Опции', align: 'center'},
           {
            name: 'material', 
            label: 'Материал', 
            field: ex => this.options.materials.find(m => m.id == ex.material).name, 
            align: 'center'
            },
           {name: 'units', label: 'Ед. изм.', 
            field: ex => this.options.materials.find(m => m.id == ex.material).units.short, align: 'center'
            },
           {name: 'quantity_norm', label: 'По норме', field: 'quantity_norm', align: 'center'},
           {name: 'quantity_fact', label: 'По факту', field: 'quantity_fact', align: 'center'},
           {name: 'cost', label: 'Стоимость, руб.', field: 'cost', align: 'center'},
         ],
         postings: [
           {name: 'options', label: 'Опции', align: 'center'},
           {name: 'material', label: 'Материал', 
            field: pst => this.options.materials.find(m => m.id == pst.material).name, align: 'center'
          },
           {name: 'units', label: 'Ед. изм.', 
           field: pst => this.options.materials.find(m => m.id == pst.material).units.short, align: 'center'
         },
           {name: 'quantity', label: 'Количество', field: 'quantity', align: 'center'},
         ],
         tables: [
           {name: 'options', label: 'Опции', align: 'center'},
           {
            name: 'worker', 
            label: 'Работник', 
            field: table => this.options.workers.find(w => w.id == table.worker).full_name, 
            align: 'center'    
           },
           {name: 'rank', label: 'Разряд', field: 'rank', align: 'center'},
           {name: 'hours', label: 'Часов', field: 'hours', align: 'center'},
           {name: 'days', label: 'Дней', field: 'days', align: 'center'},
           {name: 'done', label: 'Выполнено норм', field: 'done', align: 'center'},
           {name: 'tariff_rate ', label: 'Тарифная ставка', field: 'tariff_rate', align: 'center'},
           {name: 'by_coefficient ', label: 'По коэффициенту', field: 'by_coefficient', align: 'center'},
           {name: 'by_conditions ', label: 'По условиям труда', field: 'by_conditions', align: 'center'},
           {name: 'bonus', label: 'Премия', field: 'bonus', align: 'center'},
           {name: 'total', label: 'Всего', field: 'total', align: 'center'},
         ],
       }
     }
   },

   methods: {
    // HTTP-GET outfit instance
    getOutfitInstance() {
      if (this.template) {
        this.$axios.get('/api/v1/outfit/' + this.template + '/')
        .then(response => {
          this.setInstance(response.data);
        }).catch(e => {
          this.$handleError(e);
        })
      }
    },
    // Set outfit instance to form
    setInstance(instance) {
      Object.keys(instance).forEach(k => {
        if (typeof instance[k] !== null) {
          if (typeof instance[k] == 'object' && !Array.isArray(instance[k]) && instance[k]) {
            this.form[k] = instance[k].id;
          } else {
              this.form[k] = instance[k];
          }
        }
      })
      this.form.works.forEach(w => w.units = w.units.id);
      this.form.tables.forEach(t => t.worker = t.worker.id);
      this.form.expenses.forEach(e => e.material = e.material.id);
      this.form.postings.forEach(p => p.material = p.material.id);
    },
    addEvent() {
      this.$q.dialog({
        message: 'Введите название',
        prompt: {
          model: '',
          type: 'text'
        },
        ok: { label: 'Сохранить', color: 'positive' },
        cancel: { label: 'Отмена', color: 'negative' },
      }).then(data => {
        if (data.trim() != '') {
          this.$axios.post('/api/v1/outfit_events/', { name: data.trim()})
          .then(response => {
            this.options.outfit_events.push(response.data);
            this.form.event = response.data.id;
          }).catch(e => {
            this.$handleError(e);
          })
        }
      }).catch(() => {})
    },
    // POST new material
    saveMaterial() {
      var data = this.material_form;
      this.$axios.post('/api/v1/materials/', data)
      .then(response => {
        this.options.materials.push(response.data);
        if (this.dialogs.expense_form) {
          this.expense_form.material = response.data.id;
        } else if (this.dialogs.posting_form) {
          this.posting_form.material = response.data.id;
        }
        this.dialogs.material_form = false;
      }).catch(e => {
        this.$handleError(e);
      })
    },

    // HTTP-GET data by resource name
    getData(resource, params) {
      this.$axios.get('/api/v1/' + resource + '/', { params })
      .then(response => {
        // Set options resource
        this.options[resource] = response.data[resource];
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // Edit object in form
    editObject(instance, form) {
      Object.keys(instance).forEach(field => this[form][field] = instance[field]);
      this.dialogs[form] = true;
    },
    // Check for valid form completing, add object to array, hide form dialog
    saveObject(form, array, copy) {
      if (this.formIsValid(form)) {
        const data = JSON.parse(JSON.stringify(this[form]));
        // If edit exists object
        if (data.hasOwnProperty('__index') && data['__index'] != null && !copy) {
          this.form[array][data['__index']] = data;
          this.form[array].sort();
        } else {
          // If object is new
          this.form[array].push(data);
        }
        // Hide dialog
        if (!copy) {
          this.dialogs[form] = false;
        }
      }
    },
    // Parse day and hours and set it to workdays into table form
    saveWorkdays() {
      var day = new Date(this.workdays_form.workdays).getDate();
      var hours = new Date(this.workdays_form.workdays).getHours();
      this.$root.$set(this.table_form.workdays, day, hours);
      this.dialogs.workdays = false;
    },
    // Check for validate completing form
    formIsValid(form) {
      if (this.required[form].every(field => this[form][field] !== null && this[form][field] !== '')) {
        return true;
      } else {
        return false;
      }
    },
    // Clear form fields
    resetForm(form) {
      var vm = this;
      if (form && vm[form]) {
        Object.keys(vm[form]).forEach(function(field) {
          if (Array.isArray(vm[form][field])) {
            vm[form][field] = [];
          } else if (vm[form][field] && typeof vm[form][field] === 'object' && vm[form][field].constructor === Object) {
            vm[form][field] = {};
          } else {
            vm[form][field] = null;
          }
        });
      }
    },
    // HTTP-POST outfit form
    saveOutfit() {
      const data = JSON.stringify(this.form);
      this.$axios.post('/api/v1/outfit/', data)
      .then(response => {
        this.done(response.data.id)
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
          this.$router.push({name: 'OutfitPrint', params: { id }});
        }).catch(() => {
          this.$router.push({name: 'OutfitList'});
        })
      },
   },

   computed: {
    // Check a validate completing of current step
     stepIsComplete: function() {
       var result = false;
       switch (this.currentSection) {
         case 'main':
           if (this.required.main.every(field => this.form[field] !== null && this.form[field] !== '')) {
             result = true;
           }
           break;
         case 'works':
         if (this.form.works.length > 0) {
           result = true;
         }
         break;
         case 'tables':
           if (this.form.tables.length > 0) {
             result = true;
           }
           break;
         case 'materials':
           result = true;
           break;
         case 'personal':
           if (this.required.personal.every(field => this.form[field] !== null && this.form[field] !== '')) {
             result = true;
           }
           break;
       }
       return result;
     },
   },

   mounted() {
    // Launch data getters on mount page
    this.getData('outfit_events');
    this.getData('stations');
    this.getData('materials');
    this.getData('categories');
    if (this.template) {
      this.getOutfitInstance();
    }
   },

   watch: {
    // Watcher of workdays
     'table_form.workdays': function(wd) {
       var hours = 0;
       this.table_form.days = Object.keys(wd).length || null;
       // Summary hours
       for (var i=0; i < Object.values(wd).length; i++) {
         hours += Object.values(wd)[i];
       }
       this.table_form.hours = hours || null;
     },
     // Refresh works array for recalculating data
     'form.bonus': function(bonus) {
       this.form.works.sort();
     },
     'form.conditions': function(bonus) {
       this.form.works.sort();
     },
     'form.coefficient': function(bonus) {
       this.form.works.sort();
     },
     // Watcher of works array
     'form.works': function(works) {
       if (works.length > 0) {
         var done_total = 0;
         var amount = 0;
         const conditions = this.form.conditions || 0;
         const coefficient = this.form.coefficient || 0;
         const bonus = this.form.bonus || 0;
         // Summary of done_total and amount
         for (var i=0; i < works.length; i++) {
           done_total += parseFloat(works[i].done_norms);
           amount += parseFloat(works[i].amount);
         }
         // Set form data
         this.form.done_total = done_total.toFixed(2);
         this.form.amount = amount.toFixed(2);
         this.form.amount_conditions = (amount * conditions / 100).toFixed(2);
         this.form.amount_coefficient = coefficient ? (amount * coefficient / 100).toFixed(2) : 0;
         this.form.amount_bonus = (amount * bonus / 100).toFixed(2);
         this.form.amount_total = (amount + parseFloat(this.form.amount_conditions) +
         parseFloat(this.form.amount_coefficient) + parseFloat(this.form.amount_bonus)).toFixed(2);
       } else {
         this.form.done_total = this.form.amount = this.form.amount_conditions =
         this.form.amount_coefficient = this.form.amount_bonus = this.form.amount_total = 0;
       }
       this.form.tables.sort();
     },
     // Watcher for rate, calculate done norms
    'work_form.rate': function(val) {
      if (val) {
        this.work_form.done_norms = (this.work_form.done / val).toFixed(2);
      }
    },
    // Watcher for pricing, calculate amount
    'work_form.pricing': function(val) {
      if(val) {
        this.work_form.amount = (val * this.work_form.done_norms).toFixed(2);
      }
    },
    // Watcher for done, calculate done norms
    'work_form.done': function(val) {
      if (val) {
        this.work_form.done_norms = (val / this.work_form.rate).toFixed(2);
      }
    },
    // Watcher for done norm, calculate amount
    'work_form.done_norms': function(val) {
      if (val) {
        this.work_form.amount = (this.work_form.pricing * val).toFixed(2);
      }
    },
    // Watcher for station, fetch workers by station id
    'form.station': function(st_id) {
      if (st_id) {
        this.getData('workers', {station: st_id});
      }
    },
    // Watcher for tables
    'form.tables': function(tables) {
      var hours = 0;
      var days = 0;
      // Summary hours and days
      for (var i=0; i < tables.length; i++) {
        hours += parseFloat(tables[i].hours);
        days += parseFloat(tables[i].days);
      }
      this.form.hours_total = hours.toFixed(1);
      this.form.days_total = days.toFixed(1);

      // Calculate tariff rate, conditions, coefficient, done, bonus and total
      for (var i=0; i < tables.length; i++) {
        var percent = tables[i].hours / hours;
        tables[i].tariff_rate = (parseFloat(this.form.amount) * percent).toFixed(2);
        tables[i].by_conditions = (parseFloat(this.form.amount_conditions) * percent).toFixed(2);
        tables[i].by_coefficient = (parseFloat(this.form.amount_coefficient) * percent).toFixed(2);
        tables[i].done = (parseFloat(this.form.done_total) * percent).toFixed(2);
        tables[i].bonus = (parseFloat(this.form.amount_bonus) * percent).toFixed(2);
        tables[i].total = (parseFloat(this.form.amount_total) * percent).toFixed(2);

      }
    },
   }
}
</script>

<style>
.outfit .q-stepper-step-inner {padding: 0 !important;}

.outfit .step-active {color: #027be3;}

.outfit .q-stepper-dot {
    font-size: 19pt;
    font-weight: bold;
    width: 35px;
    height: 35px;
}
.workTable td {white-space: pre-line;}

@media screen and (min-width: 600px) {
  .outfit .q-stepper-step-inner {padding: 0;}
}
  .outfit .q-if-label {width: 100%; text-align: center; color: #21BA45;}
  .q-popover.column {max-width: 400px !important;}
</style>
