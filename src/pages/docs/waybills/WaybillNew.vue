<template>
  <div class="flex row flex-center bg-faded fit" id="waybill-new">
    <form class="col-xs-12 col-md-9 animate-pop bg-white">
      <q-stepper ref="stepper" v-model="step" color="primary" contractable style="border-radius: 0;">
        <q-step
         default 
         title="Главное" 
         class="shadow-1"
         subtitle="Основные данные" 
         active-icon="assignment" 
         :order="1"
         name="main">
         <div class="row flex-center full-height" :style="$q.platform.is.desktop ? 'padding: 15px;' : ''"> 
           <div class="col-md-8 col-xs-12 q-pa-md shadow-3 full-height">
             <q-field label="Номер" icon="№" label-width="3"
             :icon-color="form.number ? 'positive' : 'negative'" class="items-center">
               <q-input
                 type="text" 
                 v-model="form.number" 
                 :disable="!is_editable" 
                 align="center" 
                />
             </q-field>
             <q-field label="Дата" icon="today" class="items-center" label-width="3"
             :icon-color="form.date ? 'positive' : 'negative'">
               <q-datetime
               type="date" 
               align="center" 
               :value="form.date" 
               @change="val => {form.date = new Date(val).toDateString()}" 
               :disable="!is_editable" 
               format="DD.MM.YYYY" 
              />
             </q-field>
             <q-field 
              label-width="3"
              class="items-center"
              label="Период" 
              icon="date_range" 
              :icon-color="periodic ? 'positive' : 'grey'" >
                <q-toggle 
                  :disable="!is_editable" 
                  v-model="periodic"
                />
              <q-datetime
               align="center" 
               type="date" 
               format="DD.MM.YYYY" 
               v-if="periodic" 
               :disable="!is_editable" 
               :value="form.period_from" 
               :readonly="!is_editable" 
               clearable 
               @change="val => { form.period_from = new Date(val).toDateString()} "
              />
              <q-datetime 
                align="center" 
                type="date" 
                format="DD.MM.YYYY"  
                v-if="periodic" 
                :disable="!is_editable" 
                :value="form.period_to" 
                :readonly="!is_editable" 
                clearable 
                :min="form.period_from"
                @change="val => { form.period_to = new Date(val).toDateString() }" 
              />
            </q-field>
            <q-field label="Организация" icon="fas fa-building" class="items-center" label-width="3"
            :icon-color="form.organization ? 'positive' : 'negative'">
              <q-select
               align="center" 
               v-model="form.organization" 
               :disable="!is_editable" 
               :options="options.organizations.map(opt => ({label: opt.name, value: opt.id}))" 
              />
            </q-field>
            <q-field label="Участок" icon="place" class="items-center" label-width="3"
            :icon-color="form.station ? 'positive' : 'negative'">
              <q-select
               align="center" 
               v-model="form.station" 
               :disable="!is_editable"
               :readonly="!form.organization" 
               :options="options.stations.map(opt => ({ label: opt.name, value: opt.id }))"
              />
            </q-field>
            <q-field label="Отдел" icon="star" class="items-center" label-width="3"
            :icon-color="form.departament ? 'positive' : 'negative' ">
              <q-select
               align="center" 
               v-model="form.departament" 
               :disable="!is_editable" 
               :options="$store.state.main.departaments"
              />
            </q-field>
            <q-field label="Вид работ" icon="fas fa-gavel" class="items-center" label-width="3"
            :icon-color="form.event ? 'positive' : 'grey' ">
              <q-select
               align="center" 
               v-model="form.event" 
               :disable="!is_editable" 
               separator 
               filter
               clearable
               :options="options.events.map(e => ({label: e.full_name, value: e.id}))"
               :before="[{
                  icon: 'add',
                  color: 'positive',
                  handler: addEvent,
                  class: 'bg-positive text-white round-borders',
                }]"
              />
            </q-field>
            <q-field label="Тип" icon="fas fa-car-side" class="items-center" label-width="3"
            :icon-color="form.type_of? 'positive' : 'negative' ">
              <q-select
               align="center" 
               v-model="form.type_of" 
               :disable="!is_editable" 
               :options="options.types" 
               @input="val => { form.car = null }" 
              />
            </q-field>
            <q-field label="Автомобиль" icon="fas fa-car" class="items-center" label-width="3"
            :icon-color="form.car ? 'positive' : 'negative' ">
              <q-select
               align="center" 
               v-model="form.car" 
               filter 
               separator 
               :disable="!is_editable" 
               :options="options.cars.map(opt => ({label: opt.full_name, value: opt.id}))" 
               @input="changeCar" 
              />
            </q-field>
           </div>
          </div>
        </q-step>
        <q-step 
          title="Персонал" 
          class="full-width" 
          name="personal" 
          subtitle="Водитель, диспетчер и т.д." 
          icon="person" 
          active-icon="person" 
          :order="2">
          <div class="row justify-center" :style="$q.platform.is.desktop ? 'padding: 15px;' : ''">
            <div class="col-md-5 col-xs-12 shadow-1 q-pa-sm group" style="min-height: 400px;">
              <q-field label="Водитель" orientation="vertical">
                <q-select
                 align="center" 
                 v-model="form.driver" 
                 separator 
                 :disable="!is_editable" 
                 :options="options.workers.map(opt => ({label: opt.full_name, value: opt.id}))" 
                 filter 
                />
                </q-select>
              </q-field>
              <q-field label="Диспетчер" orientation="vertical">
                <q-select 
                  align="center" 
                  clearable 
                  v-model="form.dispatcher" 
                  filter 
                  separator 
                  :disable="!is_editable" 
                  :options="options.workers.map(opt => ({label: opt.full_name, value: opt.id}))"
                />
              </q-field>
              <q-field label="Выезд разрешен, механик" orientation="vertical">
                <q-select 
                  align="center" 
                  v-model="form.check_out_allow" 
                  filter 
                  separator 
                  :disable="!is_editable" 
                  :options="options.workers.map(opt => ({label: opt.full_name, value: opt.id}))"
                />
              </q-field>
              <q-field label="Автомобиль принял, водитель" orientation="vertical">
                <q-select
                 align="center" 
                 v-model="form.car_took" 
                 filter separator 
                 :disable="!is_editable" 
                 :options="options.workers.map(opt => ({label: opt.full_name, value: opt.id}))"
                />
              </q-field>
              <q-field label="Автомобиль сдал, водитель" orientation="vertical">
                <q-select
                 align="center" 
                 v-model="form.auto_passed" 
                 filter 
                 separator 
                 :disable="!is_editable" 
                 :options="options.workers.map(opt => ({label: opt.full_name, value: opt.id}))"
                />
              </q-field>
              <q-field label="Автомобиль принял, механик" orientation="vertical">
                <q-select
                 align="center" 
                 v-model="form.auto_accept" 
                 filter 
                 separator 
                 :disable="!is_editable" 
                 :options="options.workers.map(opt => ({ label: opt.full_name, value: opt.id }))"
                />
              </q-field>
            </div>
          </div>
        </q-step>
        <q-step
         title="Задания" 
         class="tasks-table" 
         name="tasks" 
         subtitle="Задания для водителя" 
         icon="event_note" 
         active-icon="event_note" 
         :order="3">
          <q-table 
            :data="form.tasks" 
            :columns="options.taskColumns" 
            hide-bottom 
            dense
            style="min-height: 65vh;"
            :pagination="{ rowsPerPage: 0 }">
            <template slot="top-left" slot-scope="props">
              <q-btn 
                icon="add"
                :color="form.is_completed ? 'negative' : 'positive'"
                glossy
                class="q-ma-sm"
                @click.native="addDriverTask"
                :disabled="instance && instance.is_completed"
                label="Добавить"
              />
            </template>
            <q-td slot="body-cell-options" slot-scope="props" :props="props" class="group">
              <q-btn
                :disabled="props.row.id"
                icon="edit"
                dense
                color="primary"
                @click.native="editTask(props.row)"
              />
              <q-btn
                :disabled="props.row.id"
                icon="remove"
                dense
                color="negative"
                @click.native="form.tasks = form.tasks.filter(i => i !== props.row)"
              />
            </q-td>
          </q-table>
        </q-step>
        <q-step
         class="tasks-table" 
         title="Перемещение" 
         name="motions" 
         subtitle="Топливо, даты и прочее" 
         icon="local_shipping" 
         active-icon="local_shipping" 
         :order="4">
          <div class="row q-pa-x scroll-x">
            <table class="q-table q-table-horizontal-separator text-center shadow-1">
                <thead class="bg-tertiary">
                  <tr>
                    <th>
                      <q-icon name="compare_arrows" color="primary" size="18pt"/>
                      <q-tooltip>Направление</q-tooltip>
                    </th>
                    <th>
                      <q-icon name="local_gas_station" color="negative" size="18pt" />
                      <q-tooltip>Баланс топлива</q-tooltip>
                    </th>
                    <th>
                      <q-icon name="network_check" color="positive" size="18pt" />
                      <q-tooltip>Показания спидометра</q-tooltip>
                    </th>
                    <th align="center">
                    <q-icon name="date_range" color="secondary" size="18pt"/>
                    <q-tooltip>Дата</q-tooltip>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <q-icon
                       name="local_shippingarrow_forward" 
                       color="primary" 
                       size="18pt"
                      />
                      <q-tooltip class="bg-primary">Выезд</q-tooltip>
                    </td>
                    <td>
                      <q-chip color="negative">
                        {{form.fuel_balance_on_dep}}
                      </q-chip>
                    </td>
                    <td>
                      <q-chip color="positive">
                        {{form.dep_km}}
                      </q-chip>
                    </td>
                    <td>
                      <q-chip v-if="form.dep_date" square class="q-pa-xs" color="secondary">
                      {{ new Date(form.dep_date).toLocaleDateString() }}<br />
                      {{ new Date(form.dep_date).toLocaleTimeString() }}
                      </q-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <q-icon
                       name="local_shippingarrow_forward" 
                       color="primary" 
                       class="rotate-180 flip-horizontal" 
                       size="18pt"
                      />
                      <q-tooltip class="bg-primary">Возвращение</q-tooltip>
                    </td>
                    <td>
                      <q-chip color="negative">
                        {{form.fuel_balance_on_ret}}
                      </q-chip>
                    </td>
                    <td>
                      <q-chip color="positive">
                        {{form.ret_km}}
                      </q-chip>
                    </td>
                    <td>
                      <q-chip v-if="form.ret_date" square class="q-pa-xs" color="secondary">
                      {{ new Date(form.ret_date).toLocaleDateString() }}<br />
                      {{ new Date(form.ret_date).toLocaleTimeString() }}
                      </q-chip>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="text-bold" style="font-size: 10pt;">
                    <td class="bg-primary text-white">
                      Итого:
                    </td>
                    <td class="bg-negative text-white">
                      Топлива: {{form.total_fuel}}
                    </td>
                    <td class="bg-positive text-white">
                      Км: {{form.total_km}}
                    </td>
                    <td class="bg-secondary text-white">
                      Часов: {{form.total_hours}}
                    </td>
                  </tr>
                </tfoot>
            </table>
          </div>
          <div class="row q-pa-sm group justify-around">
            <q-field label="Топлива выданно:" label-width="6" class="text-bold" align="center">
              <input
               type="number" 
               class="text-center" 
               v-model.sync="form.fuel_issued" 
               min="0" 
               step="1" 
               :disabled="instance && instance.is_completed" 
              />
            </q-field>
            <q-toggle
             v-model="form.is_completed" 
             label="Завершено" 
             :disable="instance && instance.is_completed"
            />
            <div class="col-12">
              <q-input
               type="textarea" 
               rows="3" 
               v-model="form.comment" 
               stack-label="Комментарий" 
               class="shadow-1 q-pa-xs" 
               hide-underline 
               :disable="instance && instance.is_completed" 
              />
            </div>
          </div>
        </q-step>
        <q-stepper-navigation class="bg-indigo glossy no-margin">
          <div class="col-12 flex flex-center group q-py-xs">
            <q-btn
              @click="$refs.stepper.previous()"
              label="Назад"
              color="orange"
              icon="arrow_left"
              glossy
              :disabled="step == 'main' ? true : false"
            />
            <q-btn
              v-if="step == 'motions'"
              @click.native="saveWaybill"
              :color="is_valid ? 'positive' : 'negative'"
              :disabled="!is_valid"
              :label="instance && instance.is_completed ? 'Закрыть' : 'Сохранить'"
              glossy 
            />
            <q-btn
              v-else
              @click="$refs.stepper.next()"
              label="Далее"
              :color="sectionComplete ? 'positive' : 'negative'"
              :disabled="!sectionComplete"
              glossy
              icon-right="arrow_right"
            />
          </div>
        </q-stepper-navigation>
      </q-stepper>
      <q-modal
       v-model="showTaskdialog" 
       no-backdrop-dismiss 
       content-classes="flex col-5 justify-center" 
       content-css="max-height: 100%;" 
       @hide="clearTaskForm">
        <q-toolbar align="center" color="indigo" glossy class="self-start">
          <q-toolbar-title>Задание для водителя</q-toolbar-title>
          <q-btn 
            icon="close" 
            flat 
            v-close-overlay 
          />
        </q-toolbar>
        <div class="q-pa-sm full-width">
          <q-field label="Пункт отправления" label-width="4">
            <q-input
             type="text" 
             v-model="taskForm.from_dest" 
            />
          </q-field>
          <q-field label="Пункт назначения" label-width="4">
            <q-input
             type="text"
             v-model="taskForm.to_dest" 
            />
          </q-field>
          <q-field label="Выезд" label-width="4">
            <q-datetime
             type="datetime" 
             modal 
             :value="taskForm.departure" 
             @change="val => { taskForm.departure = new Date(val).toString().split('GMT')[0] }" 
             format="DD.MM.YYYY, HH:mm" 
             :max="taskForm.arrival" 
            />
          </q-field>
          <q-field label="Прибытие" label-width="4">
            <q-datetime
             type="datetime" 
             modal 
             :value="taskForm.arrival"
             @change="val => { taskForm.arrival = new Date(val).toString().split('GMT')[0] }" 
             :min="taskForm.departure" 
             format="DD.MM.YYYY, HH:mm" 
            />
          </q-field>
          <q-field label="Расстояние" label-width="4">
            <q-input
             type="number" 
             v-model.number="taskForm.distance" 
             @input="calcTotalFuel" 
            />
          </q-field>
          <q-field label="Вид работы" label-width="4">
            <q-input
             type="text" 
             v-model="taskForm.kind" 
            />
          </q-field>
          <q-field label="Условия" label-width="4">
            <q-select
             :options="options.conditions" 
             v-model="taskForm.conditions" 
             @input="calcTotalFuel" 
            />
          </q-field>
          <q-field label="Итого топлива" label-width="4" class="text-bold q-pa-sm" orientation="horizontal">
            <q-input
             type="text" 
             align="center" 
             v-model="taskForm.total_fuel" 
             readonly 
             hide-underline 
             class="shadow-1" 
             style="width: 70px; margin: auto;" 
             />
          </q-field>
        </div>
        <q-toolbar class="justify-around self-end" color="indigo" glossy>
          <q-btn
             icon="save" 
             label="Сохранить" 
             color="positive" 
             @click.native="saveTask" 
             :disabled="!taskFormIsValid"
            />
            <q-btn
             icon="delete" 
             label="Отчистить" 
             color="negative" 
             @click.native="clearTaskForm" 
            />
        </q-toolbar>
      </q-modal>
    </form>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'WaybillDetailPage',
  props: ['id'],
  data(){
    return {
      showTaskdialog: false,
      selectedCar: null,
      instance: null,
      periodic: false,
      step: 'main',
      form: {
        // Main
        number: null,
        organization: null,
        station: null,
        departament: null,
        event: null,
        type_of: null,
        car: null,
        date: null,
        period_from: null,
        period_to: null,
        //Departure
        dep_date: null,
        dep_km: null,
        //Return
        ret_date: null,
        ret_km: null,
        // Fuel
        fuel: null,
        fuel_issued: 0,
        fuel_balance_on_dep: null,
        fuel_balance_on_ret: null,
        // Personal
        driver: null,
        dispatcher: null,
        check_out_allow: null,
        car_took: null,
        auto_accept: null,
        auto_passed: null,
        // Total
        total_km: null,
        total_hours: null,
        total_fuel: null,
        // Other
        comment: null,
        is_completed: false,
        tasks: [],
      },
      taskForm: {
        from_dest: null,
        to_dest: null,
        departure: null,
        arrival: null,
        distance: null,
        kind: null,
        conditions: null,
        total_fuel: null,
      },

      options: {
        organizations: [],
        stations: [],
        events: [],
        types: [
          {label: 'Легковой автомобиль', value: 'L'},
          {label: 'Грузовой автомобиль', value: 'H'}
        ],
        cars: [],
        workers: [],
        conditions: [
          {label: 'Лето, нормальные', value: 'SN'},
          {label: 'Лето, тяжелые', value: 'SH'},
          {label: 'Зима, нормальные', value: 'WN'},
          {label: 'Зима, тяжелые', value: 'WH'},
        ],
        taskColumns: [
          {name: 'options', label: 'Опции', field: 'id'},
          {name: 'from_dest', label: 'Из', field: 'from_dest', align:'center'},
          {name: 'to_dest', label: 'В', field: 'to_dest', align:'center'},
          {name: 'departure', label: 'Выезд', field: 'departure', format: val => new Date(val).toLocaleDateString() + ' - ' +  new Date(val).toLocaleTimeString(), align:'center'},
          {name: 'arrival', label: 'Прибытие', field: 'arrival', format: val => new Date(val).toLocaleDateString() + ' - ' +  new Date(val).toLocaleTimeString(), align:'center'},
          {name: 'distance', label: 'Расстояние', field: 'distance', align:'center'},
          {name: 'kind', label: 'Вид работы', field: 'kind', align:'center'},
          {name: 'conditions', label: 'Условия', field: task => this.options.conditions.find(item => item.value == task.conditions).label, align:'center'},
        ],
        required_fields: [
          'number', 'date', 'organization', 'station', 'type_of', 'car',
          'driver', 'car_took', 'check_out_allow', 'auto_accept', 'auto_passed',
          'dep_date', 'dep_km', 'fuel_balance_on_dep', 'ret_date', 'ret_km', 'fuel_balance_on_ret',
          'total_fuel', 'total_km', 'total_hours', 'fuel_issued'
        ],
      }
    }
  },
  methods: {
    addEvent() {
      this.$q.dialog({
        message: 'Введите название',
        prompt: {
          model: '',
          type: 'text'
        },
        ok: { label: 'Сохранить', color: 'positive'},
        cancel: { label: 'Отмена', color: 'negative'},
      }).then(data => {
        if (data.trim() != '') {
          this.$axios.post('/api/v1/outfit_events/', { name: data.trim()})
          .then(response => {
            this.options.events.push(response.data);
            this.form.event = response.data.id;
          }).catch(e => {
            this.$handleError(e);
          })
        }
      }).catch(() => {})
    },
  	// Check for valid complete form and save waybill
    saveWaybill() {
      if (this.instance && this.instance.is_completed) {
        return this.$router.go(-1);
      }
      if (this.is_valid) {
        const form = JSON.stringify(this.form);
        // If edit exists waybill
        if (this.instance) {
          this.$axios.put('/api/v1/waybill/' + this.instance.id + '/', form)
          .then(response => {
            if (this.form.is_completed) {
              this.done(response.data.id)
            } else {
              this.$router.push({name: 'WaybillList'});
            }
          }).catch(e => {
            this.$handleError(e);
          })
        } else {
          // If new waybill
          this.axios.post('/api/v1/waybill/', form)
          .then(response => {
            if (this.form.is_completed) {
              this.done(response.data.id);
            } else {
              this.$router.push({name: 'WaybillList'});
            }
          }).catch(e => {
            this.$handleError(e);
          })
        }
      }
    },
    done(id) {
        this.$q.dialog({
          title: 'Готово',
          message: 'Открыть печатную форму?',
          ok: true, cancel: true
        }).then(() => {
          var path;
          this.form.type_of == 'H' ? path = 'Waybill-hPrint' : 
          this.form.type_of == 'L' ? path = 'Waybill-lPrint' : ''
          this.$router.push({name: path, params: { id }});
        }).catch(() => {
          this.$router.push({name: 'WaybillList'});
        })
      },
    // Open dialog for adding new driver task
    addDriverTask() {
      this.showTaskdialog = true;
    },
    // Open dialog for editing exists task
    editTask(task) {
      Object.keys(task).forEach(k => {this.taskForm[k] = task[k]});
      this.showTaskdialog = true;
    },
    // Check for valid complete task form, push it to tasks list or replace exists task if edit
    saveTask(){
        if (this.taskFormIsValid) {
          this.taskForm.car = this.form.car;
          this.taskForm.customer = this.form.station;
          const task = JSON.parse(JSON.stringify(this.taskForm));
          if (Object(task).hasOwnProperty('__index') && task.__index != null) {
            var indx = this.form.tasks.findIndex(t => t.__index == task.__index);
            this.form.tasks[indx] = task;
            this.form.tasks.sort();
          } else {
            this.form.tasks.push(task);
          }
          
          this.showTaskdialog = false;
        }
    },
    // Reset task form
    clearTaskForm() {
      Object.keys(this.taskForm).forEach(k => this.taskForm[k] = null);
    },
    // When car is changed - change fuel and km attrs in form
    changeCar(car_id) {
      if (car_id) {
        const car = this.options.cars.find(c => c.id == car_id);
        this.selectedCar = car;
        this.form.fuel = car.fuel.name;
        this.form.fuel_balance_on_dep = car.fuel_balance;
        this.form.dep_km = car.mileage;
      }
    },
    // Calculate fuel rate by conditions
    calcTotalFuel(val) {
      if (val) {
        var rate;
        var total_fuel;
        const car = this.options.cars.find(c => c.id == this.form.car);
        const conditions = this.taskForm.conditions;
        const distance = this.taskForm.distance;
        // Define rate
        if (conditions) {
          switch (conditions) {
            case 'SN':
              rate = car.rate_normal_s;
              break;
            case 'SH':
              rate = car.rate_hard_s;
              break;
            case 'WN':
              rate = car.rate_normal_w;
              break;
            case 'WH':
              rate = car.rate_hard_w;
              break;
          }
          // Define total fuel rate
          if (distance) {
            total_fuel = rate * distance / 100;
            this.taskForm.total_fuel = total_fuel.toFixed(2);
          }
        }
      }
    },
    // HTTP-GET waybill instance for editing of exists waybill
    getWaybill() {
      this.$axios.get('/api/v1/waybill/' + this.id + '/')
      .then(response => {
        this.instance = response.data;
        this.getOrganizations();
        this.getStations();
        this.getEvents();
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // HTTP-GET organizations
    getOrganizations() {
      this.$axios.get('/api/v1/organizations/')
      .then(response => {
        this.options.organizations = response.data.organizations;
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // HTTP-GET cars by type
    getCars(type){
      const params = {kind: type};
      this.$axios.get('/api/v1/car/', { params })
      .then(response => {
        this.options.cars = response.data.cars;
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // HTTP-GET stations by organization
    getStations(org) {
      const params = {organization: org};
      this.$axios.get('/api/v1/stations/', {params})
      .then(response => {
        this.options.stations = response.data.stations;
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // HTTP-GET workers by station
    getWorkers(station) {
      const params = {station: station};
      this.$axios.get('/api/v1/workers/', {params})
      .then(response => {
        this.options.workers = response.data.workers;
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // HTTP-GET events
    getEvents() {
      this.$axios.get('/api/v1/outfit_events/')
      .then(response => {
        this.options.events = response.data.outfit_events;
      }).catch(e => {
        this.$handleError(e);
      })
    },

  },

  mounted() {
  	// If edit exists waybill get instance or get organizations
    if (this.id) {
      this.getWaybill();
    } else {
      this.getOrganizations();
      this.getEvents();
    }
  },
  watch: {
  	// Set instance at editing exists waybill
    instance: function(waybill) {
      if (waybill) {
        this.form.id = waybill.id;
        this.form.number = waybill.number;
        this.form.station = waybill.station.id;
        this.form.organization = waybill.organization.id;
        this.form.type_of = waybill.type_of;
        this.form.date = waybill.date
        this.form.period_from = waybill.period_from;
        this.form.period_to = waybill.period_to;
        this.form.car = waybill.car.id;
        this.form.departament = waybill.departament;
        this.form.event = waybill.event.id;
        this.selectedCar = waybill.car;
        this.form.fuel = waybill.car.fuel.name;
        waybill.period_to && waybill.period_from ? this.periodic = true : this.periodic = false;
        this.form.dispatcher = waybill.dispatcher ? waybill.dispatcher.id : null;
        this.form.driver = waybill.driver.id;
        this.form.car_took = waybill.car_took.id;
        this.form.check_out_allow = waybill.check_out_allow.id;
        this.form.auto_accept = waybill.auto_accept.id;
        this.form.auto_passed = waybill.auto_passed.id;
        this.form.comment = waybill.comment;
        this.form.is_completed = waybill.is_completed;
        this.form.tasks = waybill.tasks;

        this.form.fuel_balance_on_dep = waybill.fuel_balance_on_dep;
        this.form.fuel_balance_on_ret = waybill.fuel_balance_on_ret;
        this.form.fuel_issued = waybill.fuel_issued;

        this.form.dep_km = waybill.dep_km;
        this.form.ret_km = waybill.ret_km;

        this.form.dep_date = waybill.dep_date;
        this.form.ret_date = waybill.ret_date;
        this.form.dep_fact = waybill.dep_fact;
        this.form.ret_fact = waybill.ret_fact;

        this.form.total_fuel = waybill.total_fuel;
        this.form.total_km = waybill.total_km;
        this.form.total_hours = waybill.total_hours;

      }
    },
    // When change type of car - get cars from backend
    'form.type_of': function(type) {
        if (type) {
          this.getCars(type);
        }
    },
    // Then add/remove tasks - calculate km, hours, fuel, etc.
    'form.tasks': function(tasks) {
      if (tasks.length > 0) {
        var total_km = 0;
        var total_fuel = 0;
        const startDate = tasks[0].departure;
        const endDate = tasks[tasks.length -1].arrival;
        const total_hours = date.getDateDiff(new Date(endDate), new Date(startDate), 'hours')

        for (var i=0; i < tasks.length; i++) {
          total_km += tasks[i].distance;
          total_fuel += parseFloat(tasks[i].total_fuel);
        }
        this.form.total_km = total_km;
        this.form.total_fuel = total_fuel.toFixed(2);
        this.form.total_hours = total_hours;
        this.form.fuel_balance_on_ret = (parseFloat(this.form.fuel_balance_on_dep) - parseFloat(total_fuel) + parseFloat(this.form.fuel_issued)).toFixed(2);
        this.form.ret_km = this.form.dep_km + total_km;
        this.form.dep_date = startDate;
        this.form.ret_date = endDate;

      } else {
        this.form.dep_date = this.form.ret_date = this.form.ret_km =
        this.form.fuel_balance_on_ret = this.form.total_km = this.form.total_fuel =
        this.form.total_hours = null;
      }
    },
 	// On chabging fuel issued - calculate fuel balance on return
    'form.fuel_issued': function(val) {
      if (val) {
        this.form.fuel_balance_on_ret = (parseFloat(this.form.fuel_balance_on_dep) - parseFloat(this.form.total_fuel) + parseFloat(val)).toFixed(2);
      }
    },
    // On changing organization - get stations
    'form.organization': function(org) {
      if (org) {
        this.getStations(org);
      }
    },
    // On changing station - get workers
    'form.station': function(station) {
      if (station) {
        this.getWorkers(station);
      }
    },
    // Setter for factical date of departure
    'form.dep_date': function(val) {
        this.form.dep_fact = val;
    },
    // Setter for factical date of return
    'form.ret_date': function(val) {
        this.form.ret_fact = val;
    },
    periodic: function(val) {
      if (!val) {
        this.form.period_from = null;
        this.form.period_to = null;
      }
    },
  },
  computed: {
  	// Checker for completing form sections
    sectionComplete() {
      var result = false;
      switch(this.step) {
        case 'main':
          if (this.form.number && this.form.date && this.form.organization && this.form.station && this.form.car && this.form.type_of) {
           result = true;
           break; 
          }
        case 'personal':
          if (this.form.driver && this.form.check_out_allow && this.form.car_took && this.form.auto_accept && this.form.auto_passed) {
            result = true;
            break;
          }
        case 'tasks':
          if (this.form.tasks.length > 0) {
            result = true;
            break;
          }
      }
      return result;
    },
    // Checking for editable some fields
    is_editable(){
      if (this.instance) {
        return false;
      } else {
        return true;
      }
    },
    // Checking for completing required fields
    is_valid() {
      if (this.options.required_fields.every(item => this.form[item] !== null) && this.form.tasks.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // Check for task fields completing
    taskFormIsValid() {
        if (
          this.taskForm.from_dest && this.taskForm.to_dest &&
          this.taskForm.departure && this.taskForm.arrival &&
          this.taskForm.distance && this.taskForm.kind && this.taskForm.conditions
        ) {
          return true;
        } else {
          return false;
        }
    }
  },
}
</script>
<style>
  .q-stepper-step-inner {padding: 0 !important; min-height: 450px;}
  .q-popover.column {max-width: 400px !important;}
  #waybill-new .q-field-label-inner {justify-content: center; color: #027be3;}
</style>
