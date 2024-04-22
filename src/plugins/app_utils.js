import Vue from 'vue'

Vue.mixin({
  methods: {
    // host image url
    hostImageUrl: function(srcUrl) {
      return `${process.env.NUXT_ENV_STATIC_URL}${srcUrl}`;
    }
  }
})
