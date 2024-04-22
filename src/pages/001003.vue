<template>
  
</template>
<script>
export default {
  auth: false,
  middleware: 'redirectTopPage',
  data() {
    return {
      title: '三次市チャットボット　FBMトップメッセージから'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
