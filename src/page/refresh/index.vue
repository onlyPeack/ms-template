<template>

</template>

<script>
    export default {
        name: "Refresh",
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.$router.replace({
                    path: from.path,
                    query: JSON.parse(JSON.stringify(from.query))
                });
            })
        }
    }
</script>

<style scoped>

</style>
