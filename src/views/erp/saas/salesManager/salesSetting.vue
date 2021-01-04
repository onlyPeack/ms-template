<template>
    <list-container class="app-container calendar-list-container goods-list-container" style="margin: 0 auto;width: 99%">
        <div style="background-color: #fff;min-height: 780px;border-radius: 5px">
            <div style="height: 40px"></div>
            <h2 style="margin-left: 55px;">价格设置：对外调价的取值依据</h2>
            <div style="height: 10px"></div>
            <h3 style="margin-left: 75px;">您对客户的加点调价将以以下价格为准：</h3>
            <div style="height: 20px"></div>
            <el-form size="medium" :model="addList" label-width="95px" label-position="right" ref="addList">
                <el-form-item>
                    <el-radio-group v-model="addList.priceSetting">
                        <el-radio :label="0">备货库存调拨价格为准</el-radio><div style='height: 15px'></div>
                        <el-radio :label="1">云仓库存调拨价格为准</el-radio><div style="height: 15px"></div>
                        <el-radio :label="2">云仓库存和备货库存二者平均调拨价格为准</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="isLoading" @click="submit">保存设置</el-button>
                </el-form-item>
            </el-form>
        </div>


    </list-container>
</template>

<script>
    import {selectWebsiteSetting,updateWebsiteSetting} from '@/api/erp/saas/websiteControl/websiteSetting';
    export default {
        name: "salesSetting",
        data(){
            return{
                addList:{},
                isLoading:false,
            }
        },
        created() {
            selectWebsiteSetting().then(res=>{
                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                    this.addList=res.data.data||{}
                }else{
                    this.$message.error('获取价格设置信息失败,'+res.data.msg||res.data.data)
                }
            },error => this.$message.error('获取价格设置信息失败,'+error))
        },
        methods:{
            submit(){
                this.isLoading=true
                updateWebsiteSetting(this.addList).then(res=>{
                    this.isLoading=false
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.$message.success('保存价格设置成功!')
                        this.$router.push({
                            path: '/refresh',
                        })
                    }else{
                        this.$message.error('保存价格设置失败!'+res.data.msg||res.data.data)
                    }
                },error => {
                    this.isLoading=false
                    this.$message.error('保存价格设置失败!'+error)
                })
            }
        }
    }
</script>

<style scoped>

</style>
