<template>
    <div class="tab-container" style="background: white;margin:  0px 20px;">
        <tab-pane :type='activeName'></tab-pane>
    </div>
</template>

<script>
    import tabPane from './components/groupDetail';
    import {
        getAllGroupTypes
    } from '@/api/admin/group/index';
    export default {
        name: 'groupManager',
        components: {
            tabPane
        },
        data() {
            return {
                tabMapOptions: [
                ],
                activeName: 'role'
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                getAllGroupTypes().then(data => {
                    this.tabMapOptions = data.data;
                });
            }
        }
    }
</script>

<style scoped>
    .tab-container {
        margin: 30px;
    }
</style>
