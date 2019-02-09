
export default [
    {
      path: '/auth', name: 'login', component: () => import('pages/loginPage')
    },
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index')},
      { 
        path: '/messages/', component: () => import('pages/messages/messagesIncoming'),
      },
      { path: '/messages/view/:id', name: 'ViewChat', component: () => import('pages/messages/messageView'), props: true},
      {
        path: '/tasks/', component: () => import('layouts/tasks'),
        children: [
          { path: '', component: () => import('pages/tasks/tasksMain')},
          { path: 'view/inbox', component: () => import('pages/tasks/tasksList'), props: {path: 'inbox'}},
          { path: 'view/outbox', component: () => import('pages/tasks/tasksList'), props: {path: 'outbox'}},
          { path: 'create', name: 'newTask', component: () => import('pages/tasks/tasksCreate'), props: true},
        ]
      },
        {
          path: '/users/', component: () => import('pages/UsersPage')
        },
        // Documents pages

        // Waybills
        {
          path: '/docs/waybills/', name: 'WaybillList', component: () => import('pages/docs/waybills/WaybillList'),
        },
        {
          path: '/docs/waybills/detail/:id', name: 'WaybillEdit', component: () => import('pages/docs/waybills/WaybillNew'), props: true
        },
        {
          path: '/docs/waybills/new', name: 'WaybillNew', component: () => import('pages/docs/waybills/WaybillNew')
        },

        // Outfits
        {
          path: '/docs/outfits/', name: 'OutfitList', component: () => import('pages/docs/outfits/OutfitList')
        },
        {
          path: '/docs/outfits/new', 
          name: 'OutfitNew', 
          component: () => import('pages/docs/outfits/OutfitNew'),
          props: (route) => ({ template: route.query.template })
        },

        // Tractor registration form
        {
          path: '/docs/tractor-regform/', name: 'TractorRegFormList', component: () => import('pages/docs/tractor-regform/TractorRegFormList')
        },
        {
          path: '/docs/tractor-regform/new/', name: 'TractorRegFormNew', component: () => import('pages/docs/tractor-regform/TractorRegFormNew.vue')
        },

        // Svodnie vedomosti
        {
          path: '/docs/svodnaya-vedomost/', name: 'SvodnayaVedomost', component: () => import('pages/docs/svodnaya-vedomost/SvodnayaVedomost')
        },
        {
          path: '/docs/svodnaya-vedomost/new/', name: 'SvodnayaVedomostNew', component: () => import('pages/docs/svodnaya-vedomost/SvodnayaVedomostNew')
        },

        // Nakopitelnye vedomosti
        {
          path: '/docs/nakopitelnaya-vedomost/', name: 'NakopitelnayaVedomost', component: () => import('pages/docs/nakopitelnaya-vedomost/NakopitelnayaVedomostList')
        },
        {
          path: '/docs/nakopitelnaya-vedomost/new/', name: 'NakopitelnayaVedomostNew', component: () => import('pages/docs/nakopitelnaya-vedomost/NakopitelnayaVedomostNew')
        },

        // Worktime tables
        {
          path: '/docs/worktime-table/', name: 'WorkTimeTable', component: () => import('pages/docs/worktime-table/WorkTimeTableList')
        },
        {
          path: '/docs/worktime-table/new/', name: 'WorkTimeTableNew', component: () => import('pages/docs/worktime-table/WorkTimeTableNew')
        },
        // Forest arrival reports
        {
          path: '/docs/forest-arrival-reports/', name: 'ForestArrivalReports', component: () => import('pages/docs/forest-arrival-reports/ForestArrivalReportsList')
        },
        {
          path: '/docs/forest-arrival-reports/new/', name: 'ForestArrivalReportsNew', component: () => import('pages/docs/forest-arrival-reports/ForestArrivalReportsNew')
        },
        // Recycling lists
        {
          path: '/docs/recycling-lists/', name: 'RecyclingList', component: () => import('pages/docs/recycling-lists/RecyclingList')
        },
        {
          path: '/docs/recycling-lists/new/', name: 'RecyclingListNew', component: () => import('pages/docs/recycling-lists/RecyclingListNew')
        },
        // Handouts
        {
          path: '/docs/handouts/', name: 'HandoutList', component: () => import('pages/docs/handouts/HandoutList')
        },
        {
          path: '/docs/handouts/new/', name: 'HandoutNew', component: () => import('pages/docs/handouts/HandoutNew')
        },
        // Fuel distribution
        {
          path: '/docs/fuel-distribution/', name: 'FuelDistributionList', component: () => import('pages/docs/fuel-distribution/FuelDistributionList')
        },
        {
          path: '/docs/fuel-distribution/new/', name: 'FuelDistributionNew', component: () => import('pages/docs/fuel-distribution/FuelDistributionNew')
        },
        // Act of cancellation
        {
          path: '/docs/act-spisanya/', name: 'ActSpisanyaList', component: () => import('pages/docs/act-spisanya/ActSpisanyaList')
        },
        {
          path: '/docs/act-spisanya/new/', name: 'ActSpisanyaNew', component: () => import('pages/docs/act-spisanya/ActSpisanyaNew')
        },
      ]},

      // Print pages
      {path: '/print/outfit/:id', name: 'OutfitPrint', component: () => import('pages/docs/outfits/OutfitsPrintPage'), props: true},
      {
        path: '/print/waybill-l/:id', name: 'Waybill-lPrint', component: () => import('pages/docs/waybills/WaybillPrint-l'), props: true
      },
      {
        path: '/print/waybill-h/:id', name: 'Waybill-hPrint', component: () => import('pages/docs/waybills/WaybillPrint-h'), props: true
      },
      {
        path: '/print/regform/:id', name: 'RegFormPrint', component: () => import('pages/docs/tractor-regform/TractorRegFormPrintPage'), props: true
      },
      {
        path: '/print/svodnaya-vedomost/:id', name: 'SvodnayaVedomostPrint', component: () => import('pages/docs/svodnaya-vedomost/SvodnayaVedomostPrintPage'), props: true
      },
       {
        path: '/print/nakopitelnaya-vedomost/:id', name: 'NakopitelnayaVedomostPrint', component: () => import('pages/docs/nakopitelnaya-vedomost/NakopitelnayaVedomostPrintPage'), props: true
      },
      {
        path: '/print/worktime-table/:id', name: 'WorkTimeTablePrint', component: () => import('pages/docs/worktime-table/WorkTimeTablePrint'), props: true
      },
      {
        path: '/print/forest-arrival-reports/:id', name: 'ForestArrivalReportPrint', component: () => import('pages/docs/forest-arrival-reports/ForestArrivalReportsPrint'), props: true
      },
      {
        path: '/print/recycling-lists/:id', name: 'RecyclingListPrint', component: () => import('pages/docs/recycling-lists/RecyclingListPrint'), props: true
      },
      {
        path: '/print/handouts/:id', name: 'HandoutPrint', component: () => import('pages/docs/handouts/HandoutPrint'), props: true
      },
       {
        path: '/print/fuel-distribution/:id', name: 'FuelDistributionPrint', component: () => import('pages/docs/fuel-distribution/FuelDistributionPrint'), props: true
      },
      {
        path: '/print/act-spisanya/:id', name: 'ActSpisanyaPrint', component: () => import('pages/docs/act-spisanya/ActSpisanyaPrint'), props: true
      },

  { // Always leave this as last one
    path: '*', name: 'NotFound',
    component: () => import('pages/404')
  }
]
