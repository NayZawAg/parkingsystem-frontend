export default {
  target: 'static', // default is 'server'
  srcDir: 'src/',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - 三次市　駐車場混雑表示サービス',
    title: 'Not Found',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/vue2-google-maps", ssr: true }, // vue2-google-maps
    { src: '~/plugins/axios' },
    { src: '~/plugins/app_utils' },
    { src: '~/plugins/datetime_format' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // env
  // env: {
  //   baseUrl: process.env.BASE_URL || 'http://localhost'
  // },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    ['@nuxtjs/dotenv', { filename: `.env.${process.env.NODE_ENV}` }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['@nuxtjs/moment', ['ja']],
    ['@nuxtjs/google-gtag',
      {
        id: 'G-CNB8C9DLRT',
        debug: false,
        disableAutoPageTrack: true,
        config:{
          // this are the config options for `gtag
          // check out official docs: https://developers.google.com/analytics/devguides/collection/gtagjs/
          anonymize_ip: true, // anonymize IP 
          send_page_view: true, // might be necessary to avoid duplicated page track on page reload
          linker:{
            domains:[`${process.env.PUBLIC_URL}`]
          }
        }
      }
    ]
  ],
  axios: {},
  // Auth
  auth:{
    redirect: {
      home: '/' ,// ログイン後のリダイレクトURL
      login: '/', // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
      logout: '/login', // ログアウト時のリダイレクトURL
    },
    localStorage: false,
    strategies:{
      local: {
        token: {
          property: 'token',
          global: true,
          type: 'Bearer'
        },
        user: {
          property: '',
          autoFetch: true
        },
        endpoints:{
          login:{
            url:'/api/v1/users/login',
            method:'post'
          },
          logout:{
            url:'/api/v1/users/logout',
            method:'delete'
          },
          user:{
            url:'/api/v1/users/me',
            method:'get'
          }
        }
      }
    },
  },
  router: {
    middleware: ['auth']
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    optionsPath: './vuetify.options.js',
    customVariables: ['~/assets/variables.scss'],
  },
  // google map
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
