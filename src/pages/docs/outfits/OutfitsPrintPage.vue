<template>
  <q-layout>
      <q-page-container>
        <q-page style="font-family: Times New Roman; font-size: 10px;" v-if="outfit" id="outfit-print">
            <q-page-sticky class="print-hide z-max"  position="top-left" :offset="[18, 18]">
              <div class="group">
               <q-btn round glossy color="primary" size="md" @click="$router.push({name: 'OutfitList'})" icon="reply" title="Назад" />
               <q-btn round glossy color="positive" size="md" @click.native="print" icon="print" title="Печать" />
             </div>
            </q-page-sticky>
            <div class="page">
              <div class="row justify-end">
                Форма № Т-55
              </div>
              <div class="row justify-end">
                <div class="col-auto text-center">
                  <span>УТВЕРЖДАЮ</span><br />
                  <u class="pos ws-pre relative-position"> {{ outfit.organization.head.position }} </u><br /><br />
                  <u class="sign ws-pre relative-position">&nbsp;                    </u>
                  <u class="sign-trans ws-pre relative-position">        {{ outfit.organization.head.full_name }}        </u><br /><br />
                  <pre>"<u>   </u>" <u>           </u> <u>      </u>г.</pre>
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-auto">
                  <span class="ws-pre"><strong>НАРЯД - АКТ</strong> № <u> {{ outfit.id }} </u> от "<u> {{new Date(outfit.date).getDate()}} </u>" <u>  {{new Date(outfit.date).toLocaleDateString('ru-RU', {month: 'long'})}}  </u><u>{{new Date(outfit.date).getFullYear()}}</u> г.</span><br />
                  <span class="self-start">на выполнение работ</span>
                </div>
              </div>
              <div class="row q-pa-sm">
                <div class="col-12">
                  <span>Участок: <u class="ws-pre"> {{outfit.station.name}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Отдел: <u class="ws-pre"> {{outfit.departament_full }} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Бригада: <u class="ws-pre"> {{outfit.brigadier.full_name}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Кол-во чел: <u class="ws-pre"> {{outfit.tables.length}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Лесничество: <u class="ws-pre"> {{outfit.forestry}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Вид механизма: <u class="ws-pre"> {{outfit.mechanism}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div class="col-12">
                  <span>Наименование мероприятия: <u class="ws-pre"> {{outfit.event.full_name}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Место работы: <u class="ws-pre"> {{outfit.place}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Условия труда: <u class="ws-pre"> {{outfit.conditions}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Коэффициент: <u class="ws-pre"> {{outfit.coefficient}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Премия: <u class="ws-pre"> {{outfit.bonus}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Задание на месяц: <u class="ws-pre"> {{outfit.task}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div class="col-12">
                  <span>Начало работы: <u class="ws-pre"> {{new Date(outfit.begin).toLocaleDateString()}} </u></span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>Окончание работы: <u class="ws-pre"> {{new Date(outfit.end).toLocaleDateString()}} </u></span>
                </div>
          </div>
          <div class="row">
            <table class="col-8 tables" border="1" cellspacing="0">
              <thead>
                <tr>
                  <th rowspan="3">Наименование работ(описание)</th>
                  <th rowspan="3">Ед. изм.</th>
                  <th colspan="2">Объем работы</th>
                  <th rowspan="3">Параграф<br />справ.<br />норм</th>
                  <th rowspan="3">Выполнено<br />норм</th>
                  <th rowspan="3">Расценка,<br />руб.</th>
                  <th rowspan="3">Сумма,<br />руб.</th>
                  <th colspan="3">Отработано</th>
                </tr>
                <tr>
                  <th>Нормы<br/>выработки</th>
                  <th>Выполнено</th>
                  <th>Чел-<br />дней</th>
                  <th width="5">Машино-<br />смен</th>
                  <th>Кол-во<br />дней</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="work in outfit.works">
                  <td class="text-left">{{work.name}}</td>
                  <td>{{work.units.short}}</td>
                  <td>{{work.rate}}</td>
                  <td>{{work.done}}</td>
                  <td>{{work.paragraph}}</td>
                  <td>{{work.done_norms}}</td>
                  <td>{{work.pricing}}</td>
                  <td>{{work.amount}}</td>
                  <td>{{work.man_days}}</td>
                  <td>{{parseFloat(work.auto_days) || null}}</td>
                  <td>{{parseFloat(work.days) || null}}</td>
                </tr>
                <template v-if="outfit.works.length < 16">
                  <tr v-for="i in (16 - outfit.works.length)">
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                </template>
              </tbody>
              <tfoot style="font-weight: bold;">
                <tr>
                  <td>Итого:</td>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                  <td>{{outfit.amount}}</td>
                  <td></td><td></td><td></td>
                </tr>
                <tr v-if="outfit.conditions">
                  <td>
                    Условия труда: {{ outfit.conditions }}%
                  </td>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                  <td>{{outfit.amount_conditions}}</td>
                  <td></td><td></td><td></td>
                </tr>
                </tr>
                <tr v-if="outfit.coefficient">
                  <td>
                    Интенсивность: {{ parseFloat(outfit.coefficient) }}%
                  </td>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                  <td>{{outfit.amount_coefficient}}</td>
                  <td></td><td></td><td></td>
                </tr>
                </tr>
                <tr v-if="outfit.bonus">
                  <td>
                    Качество: {{parseFloat(outfit.bonus)}} %
                  </td>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                  <td>{{outfit.amount_bonus}}</td>
                  <td></td><td></td><td></td>
                </tr>
                <tr>
                  <td>
                    Всего:
                  </td>
                  <td></td><td></td><td></td><td></td>
                  <td>{{outfit.done_total}}</td>
                  <td></td>
                  <td>{{outfit.amount_total}}</td>
                  <td>{{outfit.works.map(w => w.man_days)
                    .reduce((a, b) => parseFloat(a) + parseFloat(b),0)}}</td>
                  <td>{{outfit.works.map(w => w.auto_days).reduce((a, b) => a + b)}}</td>
                  <td>{{outfit.works.map(w => w.days)
                    .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)}}
                  </td>
                </tr>
              </tfoot>
            </table>
            <table border="1" cellspacing="0" class="tables col-4">
              <thead>
                <tr>
                  <th colspan="5">РАСХОД СЫРЬЯ, МАТЕРИАЛОВ И ОТХОДОВ ПРОИЗВОДСТВА</th>
                </tr>
                <tr>
                  <th rowspan="2">Наименование сырья, материалов и отходов производства</th>
                  <th rowspan="2">Ед. изм.</th>
                  <th colspan="2">Количество</th>
                  <th rowspan="2">Стоимость, руб.</th>
                </tr>
                <tr>
                  <th>По норме</th>
                  <th>Фактическая</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="expense in outfit.expenses">
                  <td class="text-left">
                    {{expense.material.name}}
                  </td>
                  <td>
                    {{expense.material.units.short}}
                  </td>
                  <td>
                    {{expense.quantity_norm}}
                  </td>
                  <td>
                    {{expense.quantity_fact}}
                  </td>
                  <td>
                    {{expense.cost}}
                  </td>
                </tr>
                <template v-if="outfit.expenses.length < 20 ">
                  <tr v-for="i in (20 - outfit.expenses.length)">
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="row flex-center q-mt-md" style="outline: 1px solid;">
            <div class="col-6">
              <div class="row q-pa-sm">Наряд выдан:&nbsp;<span class="text-center pos relative-position q-mr-sm bor-bot" style="min-width: 100px;">{{outfit.issued.position}}</span>
                <span class="sign relative-position q-mr-sm bor-bot" style="width: 100px;"></span>
                <span class="text-center sign-trans relative-position bor-bot" style="width: 150px;">{{outfit.issued.full_name}}</span>
              </div>
              <div class="row q-pa-sm">Выполненную работу сдал:&nbsp;
                <span class="pos relative-position q-mr-sm bor-bot text-center" style="min-width: 100px;">{{outfit.work_passed.position}}</span>
                  <span class="sign relative-position q-mr-sm bor-bot" style="width: 100px;"></span>
                  <span class="text-center sign-trans relative-position bor-bot" style="width: 150px;">{{outfit.work_passed.full_name}}</span>
              </div>
            </div>
            <div class="col-6" style="outline: 1px solid;">
              <div class="row q-pa-sm">К исполнению принял:&nbsp;
                <span style="min-width: 100px;" class="text-center q-px-sm pos relative-position q-mr-sm bor-bot">{{outfit.accepted.position}}</span>
                <span class="sign relative-position q-mr-sm bor-bot" style="width: 100px;"></span>
                <span class="text-center sign-trans relative-position bor-bot" style="width: 150px;">{{outfit.accepted.full_name}}</span>
              </div>
              <div class="row q-pa-sm">Работу принял:&nbsp;
                <span style="min-width: 100px;" class="pos q-px-sm text-center relative-position q-mr-sm bor-bot">{{outfit.work_accept.position}}</span>
                <span class="sign relative-position q-mr-sm bor-bot" style="width: 100px;"></span>
                <span class="text-center sign-trans relative-position bor-bot" style="width: 150px;">{{outfit.work_accept.full_name}}</span>
              </div>
              <div class="row q-pa-sm"><span class="bor-bot q-px-sm">{{outfit.quality_display}}</span>&nbsp;(оценка качества произведенных работ и продукций)</div>
            </div>
          </div>
        </div>
            <div class="pagebreak"></div>
            <div class="page">
          <div class="row justify-end">
            <span>Обратная сторона формы № Т-55</span>
          </div>
          <div class="row justify-center q-pa-sm">
            <span class="uppercase">Табель использования рабочего времени</span>
          </div>
          <div class="row">
            <table class="fit tables" border="1" cellspacing="0">
              <thead>
                <tr>
                  <th rowspan="3" width="10%">Ф.И.О.</th>
                  <th rowspan="3" width="7%">Профессия</th>
                  <th rowspan="3"  width="5">Разряд</th>
                  <th colspan="16">Отработано часов по числам месяца</th>
                  <th colspan="2">Итого</th>
                  <th rowspan="3" width="5">Выпол<br />нено норм</th>
                  <th colspan="7">Сумма начисления</th>
                </tr>
                <tr>
                  <th v-for="i in 15">{{ i }}</th>
                  <th>&nbsp;</th>
                  <th rowspan="2" width="5">Часов</th>
                  <th rowspan="2" width="5">Дней</th>
                  <th rowspan="2" width="5">тарифная<br />ставка</th>
                  <th rowspan="2" width="5">по<br />интен<br />сивности</th>
                  <th rowspan="2" width="5">по условиям<br /> труда</th>
                  <th rowspan="2" width="5">по сдел. расц.</th>
                  <th rowspan="2" width="5">праздн<br />ичным</th>
                  <th rowspan="2" width="5">премия</th>
                  <th rowspan="2" width="5">всего</th>
                </tr>
                <tr>
                  <th v-for="i in 16">
                    {{ i+15 }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="table in outfit.tables" :key="table.id">
                  <td>{{table.worker.full_name}}</td>
                  <td>{{table.worker.position}}</td>
                  <td>{{table.rank}}</td>
                  <td style="padding:0; white-space:pre-line;" v-for="i in 16">
                    <div class="flex flex-center bor-bot"  style="height: 15px;">{{ i != 16 ? table.workdays[i] : ''}}</div>
                    <div class="flex flex-center" style="height: 15px;">{{table.workdays[i + 15]}}</div>
                  </td>
                  <td>{{table.hours}}</td>
                  <td>{{parseFloat(table.days)}}</td>
                  <td>{{table.done}}</td>
                  <td>{{table.tariff_rate}}</td>
                  <td>{{table.by_coefficient}}</td>
                  <td>{{table.by_conditions}}</td>
                  <td></td>
                  <td></td>
                  <td>{{table.bonus}}</td>
                  <td>{{table.total}}</td>
                </tr>
                <template v-if="outfit.tables.length < 15">
                  <tr v-for="i in (15 - outfit.tables.length)"><td v-for="i in 29">&nbsp;</td></tr>
                </template>
              </tbody>
              <tfoot>
                <tr class="text-bold">
                    <td>Итого:</td>
                    <td colspan="18"></td>
                    <td>{{parseFloat(outfit.hours_total)}}</td>
                    <td>{{parseFloat(outfit.days_total)}}</td>
                    <td>{{outfit.done_total}}</td>
                    <td>{{outfit.amount}}</td>
                    <td>{{outfit.amount_coefficient}}</td>
                    <td>{{outfit.amount_conditions}}</td>
                    <td></td><td></td>
                    <td>{{outfit.amount_bonus}}</td>
                    <td>{{outfit.amount_total}}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <br />
          <div class="row" style="outline: 1px solid;">
            <div class="col-8 q-pa-sm" style="outline: 1px solid;">
                <p>Количество дней, разряд и коэффициент рабочим объявлены.</p>
                <p class="row">
                    <span class="col-auto">Ответственный за ведение табеля:</span>
                    <span class="col-auto q-px-sm text-center pos bor-bot relative-position q-mx-xs">{{outfit.responsible.position}}</span>
                    <span class="col-2 sign text-center bor-bot relative-position q-mx-xs"></span>
                    <span class="col-3 text-center sign-trans relative-position bor-bot">{{outfit.responsible.full_name}}</span>
                </p>
                <p class="row">
                    <span class="col-auto">Расчет составил:</span>
                    <span class="col-auto q-px-sm text-center pos bor-bot relative-position q-mx-xs">{{outfit.calculated.position}}</span>
                    <span class="col-2 sign text-center bor-bot relative-position q-mx-xs"></span>
                    <span class="col-3 text-center sign-trans relative-position bor-bot">{{outfit.calculated.full_name}}</span>
                </p>
                <p class="row">
                  <span class="col-auto">Принял на ответственное хранение:</span>
                    <span class="col-auto q-px-sm text-center dat bor-bot relative-position q-mx-xs">
                    {{new Date(outfit.date).toLocaleDateString()}}
                  </span>
                    <span class="col-auto q-px-sm text-center pos bor-bot relative-position q-mx-xs">{{outfit.deposited.position}}</span>
                    <span class="col-2 sign text-center bor-bot relative-position q-mx-xs"></span>
                    <span class="col text-center sign-trans relative-position bor-bot">{{outfit.deposited.full_name}}</span>
                </p>
            </div>      
            <div class="col-4 q-pa-sm">
                <p>Подлежит оприходыванию следующая лесопродукция (пиломатериалы):</p>
                <table class="tables full-width" border="1" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Ед. изм.</th>
                            <th>Количество</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="posting in outfit.postings">
                            <td>{{ posting.material.name }}</td>
                            <td>{{ posting.material.units.short }}</td>
                            <td>{{ posting.quantity }}</td>
                        </tr>
                        <template v-if="outfit.postings.length < 6 ">
                          <tr v-for="i in 6 - outfit.postings.length">
                            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                          </tr>
                        </template>
                    </tbody>
                </table>

            </div>   
          </div>
        </div>
      </q-page>
      </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'OutfitsList',
  props:{ id: { required: true } },
  data() {
    return {
      outfit: null,
    }
  },
  methods:{
    // HTTP-GET outfit
    getOutfit() {
      this.$axios.get('/api/v1/outfit/' + this.id + '/')
      .then(response => {
        this.outfit = response.data;
      }).catch(e => {
        this.$handleError(e);
      })
    },
    // Print document
    print() {
      window.print();
    }
  },
  mounted() {
    this.getOutfit();
  }
}
</script>

<style>
  .bor-bot {border-bottom: 1px solid black;}

  .pos:before {
    content: '(должность)';
    position: absolute;
    top:12px;
    font-size: 9px;
    width: 100%;
    text-align: center;
    left:0;
  }
  .dat:before {
    content: '(дата)';
    position: absolute;
    top:12px;
    font-size: 9px;
    width: 100%;
    text-align: center;
    left:0;
  }
  .sign:before {
    content: '(подпись)';
    position: absolute;
    top:12px;
    font-size: 9px;
    width: 100%;
    text-align: center;
    left: 0;
  }
  .sign-trans:before {
    content: '(расшифровка подписи)';
    position: absolute;
    top:12px;
    font-size: 9px;
    width: 100%;
    text-align: center;
    left: 0;
  }
  .ws-pre {white-space: pre;}

  .tables {
    text-align: center;
  }
  .tables tr td {line-height: 13px;}
  @page {
    size: A4 landscape !important;
    margin: 1.1cm;
  }
  .pagebreak {
    page-break-after: always;
}
  #outfit-print .page {
    width: 297mm;
    height: 210mm;
    margin: 0 auto;
}

</style>
<style scoped media="print">
  @media print {
   #outfit-print .page {
        width: initial;
        height: initial;
        margin: 1.1cm;
        border: initial;
        border-radius: initial;
        width: initial;
        min-height: initial;
        box-shadow: initial;
        background: initial;
        page-break-after: always;
    }
    @page {
      size: landscape;
      margin: 0;
    }

}
</style>
