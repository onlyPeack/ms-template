<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container">
                <el-form :model="addList" label-position="right" label-width="200px" size="medium" :rules="rules" ref="addList">
                    <div style="height: 40px"></div>
                    <el-form-item label="订单超过：" prop="autoAuditTime">
                        <el-input v-model.number="addList.autoAuditTime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入分钟"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">分</span><span>未审核,订单自动审核</span>
                    </el-form-item>
                    <div style="height: 40px"></div>
                    <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
                        <el-input v-model.number="addList.flashOrderOvertime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入分钟"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">分</span><span>未付款,订单自动关闭</span>
                    </el-form-item>
                    <div style="height: 40px"></div>
                    <el-form-item label="正常订单超过：" prop="normalOrderOvertime">
                        <el-input v-model.number="addList.normalOrderOvertime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入分钟"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">分</span><span>未付款,订单自动关闭</span>
                    </el-form-item>
                    <div style="height: 40px"></div>
                    <el-form-item label="发货超过：" prop="confirmOvertime">
                        <el-input v-model.number="addList.confirmOvertime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入天数"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">天</span><span>未收货,订单自动完成</span>
                    </el-form-item>
                    <div style="height: 40px"></div>
                    <el-form-item label="订单完成超过：" prop="commentOvertime">
                        <el-input v-model.number="addList.commentOvertime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入天数"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">天</span><span>自动5星好评</span>
                    </el-form-item>
                    <div style="height: 40px"></div>
                    <el-form-item label="订单完成超过：" prop="finishOvertime">
                        <el-input v-model.number="addList.finishOvertime" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入天数"></el-input><span style="color: red;font-size: 18px;margin-right: 5px;margin-left: 5px;">天</span><span>自动结束交易,不能申请售后</span>
                    </el-form-item>
                    <div style="height: 80px"></div>
                    <el-form-item>
                        <el-button type="primary" @click="doUpdate">保存设置</el-button>
                    </el-form-item>
                    <div style="height: 180px"></div>
                </el-form>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectOrderSetting,updateOrderSetting} from '@/api/erp/saas/orderControl/orderSetting';
    export default {
        props: ['timeStamp'],
        name: "orderSetting",
        data() {
            return {
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑物流快递',
                    create: '新建物流快递'
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否显示添加商品系列对话框
                addList:{status:'0'},//添加商品系列数据存储对象
                sourceClassifyVisible:false,//是否显示关联分类对话框
                sourceBrandVisible:false,//是否显示关联品牌对话框
                showSpecification:false,//是否显示规格参数对话框
                nowRow:Object,//当前行中值集合
                specificationTags:[],//当前行规格参数存储对象
                publicTitle:'',
                inputVisible: false,//规格参数是否显示输入框
                rules: {//新增&编辑商品表单验证
                    'flashOrderOvertime': [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                    'normalOrderOvertime':  [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                    'confirmOvertime': [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                    'commentOvertime': [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                    'finishOvertime':  [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                    'autoAuditTime':  [{required: true, message: '时间设置不能为空', trigger: 'blur'}, {type: 'number',min:0, message: '时间只能为数字', trigger: 'blur'}],
                },
                inputValue: '',
                isSingle: true,
                option: [],
                typeName: '',
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: true,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
            }
        },
        created() {
            this.getList()
        },
        methods: {

            //获取数据
            getList() {
                selectOrderSetting().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        if(res.data.data){
                            this.addList=res.data.data
                        }
                    }else{
                        this.showError('获取订单设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取订单设置信息失败,'+error))
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
                        updateOrderSetting(this.addList).then(res => {
                            if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                                this.showSuccess('更新订单设置成功!')
                            } else {
                                this.showError('更新订单设置失败,' + res.data.msg || res.data.data, res.data.code)
                            }
                        }, error => this.showError('更新订单设置失败,' + error))
                    }
                })
            }

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
