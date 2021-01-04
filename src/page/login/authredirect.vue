<template>
  <div></div>
</template>

<script>
export default {
  name: 'authredirect',
  created () {
    window.close()
    const params = this.$route.query
    const state = params.state
    const code = params.code
      window.location.href="http://erp.msebc.com/msycs.html" ;
  }
}
</script>


<style>
</style>
