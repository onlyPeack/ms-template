<template>
    <div slot="reference">
        <el-badge is-dot v-if="sum>0">
            <i class="el-icon-bell" @click="noticeBtn"></i>
        </el-badge>
        <i class="el-icon-bell" v-else @click="noticeBtn"></i>
    </div>
</template>

<script>
    import {findUnread} from "@/api/erp/config/index";

    export default {
        name: "top-notice",
        data() {
            return {
                activeName: 'first',
                sum: 0,
                option: {
                    props: {
                        img: 'img',
                        title: 'title',
                        subtitle: 'subtitle',
                        tag: 'tag',
                        status: 'status'
                    },
                },
            }
        },
        created() {
        this.findUnreadList();
        },
        methods: {
            findUnreadList(){
                findUnread().then(res => {
                    this.sum = Number(res.data.data)
                })
            },
            noticeBtn() {
                this.$router.push({
                    path: '/notice',
                    name: '消息中心',
                    meta: {
                        i18n: 'notice'
                    },
                    query: {
                        timeStamp: new Date().getTime()
                    },
                });
            },
            pageChange(page, done) {
                setTimeout(() => {
                    this.$message.success('页码' + page)
                    this.data = this.data.concat(list);
                    done();
                }, 1000)

            },
        }
    };
</script>

<style lang="scss" scoped>
</style>
