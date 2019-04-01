// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'vue-ls',
      'auth',
      'error-handler',
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
       //'ionicons',
       //'mdi',
       'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
      }
    },
    devServer: {
      // https: true,
      //port: 8080,
      //host: 'localhost',
      open: true, // opens browser window automatically
      /*
      proxy: {
          '/api': {
              target: "http://localhost:8081/",
              //pathRewrite: {"^/api/v1": ""}
          },
          '/media': {
            target: "http://localhost:8081/"
          },
          '/messages/new':{target: 'http://localhost:8081/'},
          '/login/': 'http://localhost:8081/'
      }
      */
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
    	i18n: 'ru',
      components: [
        'QAutocomplete',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemTile',
        'QItemMain',
        'QItemSide',
        'QSelect',
        'QField',
        'QInput',
        'QCheckbox',
        'QSearch',
        'QChip',
        'QChipsInput',
        'QTabs',
        'QToggle',
        'QTable',
        'QTd',
        'QTr',
        'QRouteTab',
        'QTab',
        'QTabPane',
        'QUploader',
        'QDatetime',
        'QTooltip',
        'QPopover',
        'QWindowResizeObservable',
        'QResizeObservable',
        'QChatMessage',
        'QScrollObservable',
        'QScrollArea',
        'QInfiniteScroll',
        'QSpinnerHourglass',
        'QSpinnerGrid',
        'QSpinnerComment',
        'QPageSticky',
        'QInnerLoading',
        'QModal',
        'QModalLayout',
        'QDialog',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        
      ],
      directives: [
        'Ripple',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'Cookies',
        'ActionSheet',
      ],
      iconSet: 'fontawesome',
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
