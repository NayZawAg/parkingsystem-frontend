<template>
  
</template>
<script>
export default {
  auth: false,
  middleware: 'redirectTopPage',
  data() {
    return {
      title: '三次市チャットボット　WEBリッチメニューから'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
