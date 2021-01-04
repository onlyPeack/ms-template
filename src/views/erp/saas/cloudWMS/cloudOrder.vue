<template>
    <div>即将跳转至云订货</div>
</template>

<script>
    export default {
        name: "cloudOrder",
        created() {
            window.location.href = 'http://co-test.520mro.com/#/login';
            // window.open('http://co-test.520mro.com/#/login', '_blank');
            // this.$router.replace('/wel/index')
        }
    }
</script>

<style scoped>

</style>
