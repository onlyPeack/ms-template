<template>
    <basic-container>
        <div class="avue-crud-container">
            <button-bar type='form'
                        ref="buttonBar"
                        :marginBottom="10"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="doUpdate"></button-bar>
            <el-tabs v-model="activeName">
                <el-tab-pane label="微信设置" name="first"></el-tab-pane>
                <el-tab-pane label="支付宝设置" name="second"></el-tab-pane>
                <el-tab-pane label="对公账户" name="third"></el-tab-pane>
            </el-tabs>
                    <el-form :model="addList" label-position="right" label-width="200px" size="medium" :rules="rules" :inline="false" ref="addList">
<!--                        <h2>支付设置</h2>-->
                        <div style="height: 20px"></div>
                        <el-form-item label="商户Id：" prop="mchId" v-if="activeName==='first'">
                            <el-input v-model="addList.mchId" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入商户Id"></el-input>
                        </el-form-item>
                        <el-form-item label="微信AppId：" prop="wxAppId" v-if="activeName==='first'">
                            <el-input v-model="addList.wxAppId" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入微信AppId"></el-input>
                        </el-form-item>
                        <el-form-item label="微信秘钥：" prop="wxKey" v-if="activeName==='first'">
                            <el-input v-model="addList.wxKey" style="width: 500px;" placeholder="请输入微信秘钥" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item label="微信异步通知地址：" prop="wxNotifyUrl" v-if="activeName==='first'">
                            <el-input v-model="addList.wxNotifyUrl" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入微信异步通知地址"></el-input>
                        </el-form-item>

                        <el-form-item label="支付宝AppId：" prop="aliAppId" v-if="activeName==='second'">
                            <el-input v-model="addList.aliAppId" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入支付宝AppId"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝私钥：" prop="aliPrivateKey" v-if="activeName==='second'">
                            <el-input v-model="addList.aliPrivateKey" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入支付宝私钥"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝支付公钥：" prop="aliPayPublicKey" v-if="activeName==='second'">
                            <el-input v-model="addList.aliPayPublicKey" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入支付宝支付公钥"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝回调地址：" prop="aliReturnUrl" v-if="activeName==='second'">
                            <el-input v-model="addList.aliReturnUrl" style="width: 500px;" placeholder="请输入支付宝回调地址"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝异步通知地址：" prop="aliNotifyUrl" v-if="activeName==='second'">
                            <el-input v-model="addList.aliNotifyUrl" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入支付宝异步通知地址"></el-input>
                        </el-form-item>

                        <el-form-item label="收款户名：" prop="receivingAccountName" v-if="activeName==='third'">
                            <el-input v-model="addList.receivingAccountName" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入收款户名"></el-input>
                        </el-form-item>
                        <el-form-item label="收款账号：" prop="receivingAccount" v-if="activeName==='third'">
                            <el-input v-model="addList.receivingAccount" autocomplete="off" style="width: 500px" placeholder="请输入收款账号"></el-input>
                        </el-form-item>
                        <el-form-item label="收款银行：" prop="receivingBank" v-if="activeName==='third'">
                            <el-input v-model="addList.receivingBank" autocomplete="off" style="width: 500px" placeholder="请输入收款银行"></el-input>
                        </el-form-item>
                        <div style="height: 40px"></div>
                        <div style="height: 200px"></div>
                    </el-form>
        </div>
    </basic-container>
</template>

<script>
    import {selectWebsiteSetting,updateWebsiteSetting} from '@/api/erp/saas/websiteControl/websiteSetting';
    export default {
        props: [],
        name: "paySetting",
        components:{
            'buttonBar': () => import('@/components/setting/button_bar'),
        },
        data() {
            return {
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑物流快递',
                    create: '新建物流快递'
                },
                activeName:'first',
                isShow: true,
                searchDisable: false,
                addList:{},//设置网站数据存储对象
                publicTitle:'',
                rules: {//新增&编辑商品表单验证
                    // 'mchId': [{required: true, message: '商户Id不能为空', trigger: 'blur'}],
                    // 'aliAppId':  [{required: true, message: '支付宝AppId不能为空', trigger: 'blur'}],
                    // 'aliPayPublicKey': [{required: true, message: '支付宝支付公钥不能为空', trigger: 'blur'}],
                    // 'aliPrivateKey': [{required: true, message: '支付宝私钥不能为空', trigger: 'blur'}],
                    // 'aliReturnUrl': [{required: true, message: '支付宝回调地址不能为空', trigger: 'blur'}],
                    // 'aliNotifyUrl': [{required: true, message: '支付宝异步通知地址不能为空', trigger: 'blur'}],
                    // 'wxAppId': [{required: true, message: '微信AppId不能为空', trigger: 'blur'}],
                    // 'wxKey': [{required: true, message: '微信秘钥不能为空', trigger: 'blur'}],
                    // 'wxNotifyUrl': [{required: true, message: '微信异步通知地址不能为空', trigger: 'blur'}]
                },
                isSingle: true,
                option: [],
                typeName: '',
                defaultSort: {descs: 'create_time'},
                list: [],
                loading: false,
            }
        },
        created() {
            this.getList()
        },
        methods: {

            //获取数据
            getList() {
                selectWebsiteSetting().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=res.data.data||{}
                        //this.workTime=res.data.data.workTime.split(',')
                    }else{
                        this.showError('获取网站设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取网站设置信息失败,'+error))
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message){
                this.$message.error(message)
                this.isLoading=false
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message){
                this.$message.success(message)
                this.init()
            },

            /**
             * 初始化所有状态
             */
            init(){
                this.getList()
            },

            doUpdate(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        updateWebsiteSetting(this.addList).then(res => {
                            if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                                this.showSuccess('更新支付设置成功!')
                            } else {
                                this.showError('更新支付设置失败,' + res.data.msg || res.data.data, res.data.code)
                            }
                        }, error => this.showError('更新支付设置失败,' + error))
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
