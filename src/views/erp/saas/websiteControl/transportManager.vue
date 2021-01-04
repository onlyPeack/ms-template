<template>
    <basic-container>
        <div class="avue-crud-container">
            <h2 style="margin-bottom: 30px;">运费管理<span style="font-weight: normal;font-size: 14px;margin-left: 15px;">运费计算方式设置</span></h2>
            <el-form :model="addList" :rules="rules" label-width="150px" label-position="right" size="medium">
                <el-form-item label="订单运费计算方式：" prop="type">
                    <el-radio-group v-model="addList.type">
                        <el-radio :label="0">固定金额</el-radio>
                        <el-radio :label="1">订单金额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="固定运费：" v-if="addList.type===0">
                    <span>所有订单统一一个运费</span>
                </el-form-item>
                <el-form-item label="运费设置：" prop="monty" v-if="addList.type===0">
                    <el-input placeholder="请输入运费" v-model="addList.monty" style="width: 300px">
                        <template slot="append">元/单</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="订单金额：" v-if="addList.type===1">
                    <span>根据订单的收货地址以及订单金额匹配相应的收费模板</span>
                </el-form-item>
                <el-form-item v-if="addList.type===1">
                    <el-table :data="addList.umsTransportItemList" border cell-class-name="transport">
                        <el-table-column label="操作" width="100" align="center" >
                            <template slot="header" slot-scope="scope">
                               <span style="color: #333">操作</span>
                            </template>
                            <template slot-scope="scope">
                                <i class="el-icon-plus" style="cursor: pointer;color:rgb(42,140,254);float: left;margin-top: 6px" @click="addAssData"></i><i class="el-icon-minus" style="float: right;margin-top: 6px;cursor: pointer;color:rgb(42,140,254)" @click="deleteAssData(scope.$index)"  v-if="scope.row.areas!=='全国默认地区'"></i>
                            </template>
                        </el-table-column>
                        <el-table-column label="配送区域" prop="areas" align="center">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">配送区域</span>
                            </template>
                            <template slot-scope="scope">
                                <el-link type="success" :underline="false" v-if="!scope.row.areas||scope.row.areas===''" @click="showAreaSelector=true">为指定地区设置运费</el-link>
                                <span v-else-if="scope.row.areas==='全国默认地区'">{{scope.row.areas.toString()}}</span>
                                <el-link type="success" :underline="false" @click="showAreaSelector=true" v-else>{{scope.row.areas.toString()}}</el-link>
                                <el-dialog :visible.sync="showAreaSelector" width="70%" title="选择地区" append-to-body class="public-dialog">
                                    <div style="height: 400px">
                                        <el-transfer
                                                filterable
                                                :filter-method="filterMethod"
                                                filter-placeholder="请输入城市拼音"
                                                v-model="scope.row.areas"
                                                :titles="['未选择', '已选择']"
                                                style="height: 100%"
                                                :data="data">
                                        </el-transfer>
                                    </div>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="showAreaSelector=false">关 闭</el-button>
                                    </div>
                                </el-dialog>
                            </template>
                        </el-table-column>
                        <el-table-column label="小于N元" align="center">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">小于N元</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.lessThan"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="费用(￥)" align="center" class-name="transportMoney">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">费用(￥)</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.lessMoney" style="color:red;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="大于N元小于M元费用(￥)" align="center" class-name="transportMoney">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">大于N元小于M元费用(￥)</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.midMoney" style="color:red!important;"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="大于M元" align="center">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">大于M元</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.moreThen"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="费用(￥)" align="center" class-name="transportMoney">
                            <template slot="header" slot-scope="scope">
                                <span style="color: #333">费用(￥)</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.moreMoney" style="color:red;"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </div>


    </basic-container>
</template>

<script>
    import {updateTransportManager,selectTransportManager} from '@/api/erp/saas/websiteControl/websiteSetting';
    import { provinceAndCityData } from 'element-china-area-data'

    export default {
        props: [],
        name: "paySetting",
        components:{
            'buttonBar': () => import('@/components/setting/button_bar'),
        },
        data() {
            const generateData = _ => {
                const data = [];
                const province=provinceAndCityData
                province.forEach((item,index) => {
                    data.push({
                        label: item.label,
                        key: item.label,
                        value:item.value
                    });
                });
                return data;
            };
            return {
                data: generateData(),
                value: [],
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1;
                },
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑物流快递',
                    create: '新建物流快递'
                },
                showAreaSelector:false,//展示地区选择框
                activeName:'first',
                isShow: true,
                searchDisable: false,
                addList:{
                    type:0,
                    umsTransportItemList:[{
                        areas:'全国默认地区'
                    }]
                },//设置网站数据存储对象
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
                    'monty': [{required: true, message: '运费不能为空', trigger: 'blur'}]
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
                selectTransportManager().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        if(!res.data.data.umsTransportItemList||res.data.data.umsTransportItemList.length<1){
                            res.data.data.umsTransportItemList=[{areas:'全国默认地区'}]
                        }
                        this.addList=res.data.data||{}

                    }else{
                        this.showError('获取运费设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取运费设置信息失败,'+error))
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

            submit(){
                let params=Object.assign({},this.addList)
                for (let i = 0; i < params.umsTransportItemList.length; i++) {
                    if (params.umsTransportItemList[i] == null || params.umsTransportItemList[i] == "" || JSON.stringify(params.umsTransportItemList[i]) == "{}") {
                        params.umsTransportItemList.splice(i, 1);
                        i = i - 1;
                    }
                }
                for (let i = 0; i <params.umsTransportItemList.length ; i++) {
                    if(params.umsTransportItemList[i].areas){
                        params.umsTransportItemList[i].areas=params.umsTransportItemList[i].areas.toString()
                    }else{

                    }

                }
                updateTransportManager(params).then(res=>{
                    if(Number(res.data.code)===200||Number(res.data.code)===2000){
                        this.showSuccess('更新运费设置成功!')
                    }else{
                        this.showError('更新运费设置失败!'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('更新运费设置失败!'+error))
            },

            /**
             * 新增关联商品行
             */
            addAssData(){
                this.addList.umsTransportItemList.push({})
            },

            /**
             * 删除地区选择行
             * @param index 当前行索引
             */
            deleteAssData(index){
                this.addList.umsTransportItemList.splice(index,1)
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
    .box-card{
        height: 300px;
        width: 300px;
    }
    .transport .el-input__inner{
        border: 0!important;
        text-align: center;
    }
    .el-transfer-panel__list.is-filterable{
        height: 296px!important;
    }
    .transportMoney .el-input__inner{
        color: red;
    }
</style>
