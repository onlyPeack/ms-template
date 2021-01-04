<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: true}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"></button-bar>
            <div style="line-height: 30px;color: #F56C6C;font-size: 14px;">说明：常规流程第一步必须配&lt;业务员审批&gt;，否则将影响流程驳回再流转</div>
            <div style="line-height: 30px;color: #F56C6C;font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &lt;动态用户审批&gt;只支持采购入库，采购退货，销售出库，销售退货四个单据，审核人为相关仓库负责人</div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="formData" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="billPrefix">
                        <el-select v-model="formData.billPrefix" @change="handleChangeBillPrefix"
                                   :disabled="type=='view'?true:false">
                            <el-option
                                    v-for="item in billOptions"
                                    :key="item.value"
                                    :label="item.labelDefault"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="logicList">
                        <avue-crud :option="itemsOption" :data="logicList">
                            <template slot-scope="scope" slot="operate">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="step">
                                <div>
                                    <el-input v-model="scope.row.step" :disabled="type=='view'?true:false"
                                              readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="user">
                                <div @click="userbtn(scope.row.$index)">
                                    <el-input v-model="scope.row.user" readonly :disabled="type=='view'?true:false" placeholder="请选择流转用户"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note" :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="logicKey">
                                <div>
                                    <el-select v-model="scope.row.logicKey"
                                               @change="handleSelectChange($event,scope.row.$index)"
                                               :disabled="type=='view'?true:false">
                                        <el-option
                                                v-for="item in taskAuditOptions"
                                                :key="item.value"
                                                :label="item.labelDefault"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="url">
                                <div>
                                    <el-input v-model="scope.row.url" :disabled="type=='view'?true:false"
                                              readonly></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departId && formData.departId.indexOf('{') !== -1">制单人部门：{{JSON.parse(formData.departId).name}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addObj, getObj, putObj} from '@/api/erp/oa/task/taskBill';
    import {getTypeValue} from '@/api/dict/dictValue/index';
    import {userOption} from '@/util/table';
    export default {
        name: "process_configuration_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                isShow: true,
                loading: false,
                formData: {},
                viewUrl: undefined,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "流程ID",
                            prop: "processId",
                            span: 12,
                            readonly: true,
                            placeholder: '自动生成'
                        },
                        {
                            label: "单据名称",
                            prop: "billPrefix",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请选择单据名称",
                                trigger: "change"
                            }],
                            formslot: true
                        },
                        {
                            prop: "logicList",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        }
                    ]
                },
                publicVisible: false,
                publicTitle: undefined,
                typeName: undefined,
                isSingle: false,
                option: {},
                itemsOption: {
                    border: true,
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    maxHeight: 500,
                    height: 'auto',
                    calcHeight: 350,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 80,
                            slot: true
                        },
                        {
                            label: "流程阶段",
                            prop: "step",
                            minWidth: 100,
                            overHidden:true,
                            placeholder: ' ',
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "流程备注",
                            prop: "note",
                            minWidth: 150,
                            overHidden:true,
                            placeholder: '请输入',
                            slot: true
                        },
                        {
                            label: "流程说明",
                            prop: "logicKey",
                            minWidth: 160,
                            overHidden:true,
                            slot: true
                        },
                        {
                            label: "流转用户",
                            prop: "user",
                            minWidth: 220,
                            slot: true
                        },
                        {
                            label: "页面路径",
                            prop: "url",
                            minWidth: 180,
                            overHidden:true,
                            slot: true
                        },
                    ]
                },
                index: 0,
                logicList: [],
                billOptions: [],
                taskAuditOptions: [],
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;

            getTypeValue('root_bill').then(response => {
                this.billOptions = response.data.data.rows;
            });
            getTypeValue('task_audit').then(response => {
                this.taskAuditOptions = response.data.data.rows;
            });
        },
        methods: {
            userbtn(index){
                if(!this.logicList[index].logicKey){
                    this.vueMessage('warning','请先选择流程说明!');
                    return
                }
                console.log(this.logicList[index])
                if(this.logicList[index].note == "自定义用户审批"){
                    this.isSingle = true;
                    this.publicTitle = '请选择流转用户';
                    this.typeName = 'userType';
                    this.option = userOption;
                    this.publicVisible = true;
                    this.index = index;
                }
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {

                    if (this.typeName == 'userType') {
                        this.vueSet(this.logicList[this.index], 'user', list[0].no);
                    }
                    this.$refs.publicSelector.selectionClear();
                    this.publicVisible = false;
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            reload() {
                this.loading = true;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.init();
                        this.isShow = true;
                        this.loading = false;
                    })
                }, 17)
            },
            init() {
                this.vueSet(this, 'formData', {});
                this.vueSet(this, 'logicList', []);
                this.viewUrl = '';
                if(this.$refs.form){
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getObj, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    this.handleAddRow();
                }
            },
            handleChangeBillPrefix(val) {
                for (var i in this.billOptions) {
                    if (this.billOptions[i].value == val) {
                        this.viewUrl = this.billOptions[i].labelEnUs;
                    }
                }
                for (var j in this.logicList) {
                    this.logicList[j].url = this.viewUrl;
                }
            },
            handleSelectChange(val, index) {
                if (val != 'other') {
                    this.vueSet(this.logicList[index], 'user', val);
                }
                for (let i in  this.taskAuditOptions) {
                    if (this.taskAuditOptions[i].value == val) {
                        const str = JSON.parse(JSON.stringify(this.taskAuditOptions[i]));
                        this.vueSet(this.logicList[index], 'note', str.labelDefault);
                        if(str.labelDefault == "自定义用户审批"){
                            this.vueSet(this.logicList[index], 'user','');
                        }
                    }
                }
            },
            handleAddRow() {
                const d = {
                    url: this.viewUrl,
                    step: this.logicList.length + 1,
                };
                this.logicList.push(d);
            },
            handleRemoveRow(index) {
                let ValueIndex = this.logicList.length;
                if (ValueIndex === 1) {
                    return
                }
                this.logicList.splice(index, 1);
                for (var i in this.logicList) {
                    this.logicList[i].step = i * 1 + 1;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/process_configuration_form',
                    name: '流程配置制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'process_configuration_form'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if (res.status == 200 && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
                        this.viewUrl = formData.logicList[0].url;
                        this.logicList = formData.logicList;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/process_configuration_form',
                            name: '流程配置制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            }
                        });
                        this.$refs.billContainer.refreshId(this.formData.id);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            checkItemFuc() {
                for (var i in this.logicList) {
                    if (!this.logicList[0].step || this.logicList[0].step === '') {
                        this.$message.error('第一行的页面路径为必填项，请填写了再提交');
                        return;
                    }
                    if (!this.logicList[i].step || this.logicList[i].step == '') {
                        this.$message.error('第' + (i * 1 + 1) + '行的流程阶段为必填项，请填写了再提交');
                        return;
                    }
                    if (this.logicList[i].step && this.logicList[i].step * 1 != (i * 1 + 1)) {
                        this.$message.error('第' + (i * 1 + 1) + '行的流程阶段必须与当前行的序号一致，请重新填写');
                        return;
                    }
                    if (!this.logicList[i].logicKey || this.logicList[i].logicKey == '') {
                        this.$message.error('第' + (i * 1 + 1) + '行的流程说明必填项，请填写了再提交');
                        return;
                    }
                    if (!this.logicList[i].user || this.logicList[i].user == '') {
                        this.$message.error('第' + (i * 1 + 1) + '行的流程用户为必填项，请填写了再提交');
                        return;
                    }
                }
                return true;
            },
            handleSubmit(type) {
                if (!this.checkItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = this.formData.id ? putObj : addObj;
                        this.formData.logicList = this.logicList;
                        if(this.formData.id){
                            saveBill(this.formData.id,this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/process_configuration',
                                        name: '流程配置',
                                        meta: {
                                            i18n: 'process_configuration'
                                        },
                                        query: {
                                            timeStamp: new Date().getTime()
                                        },
                                    });
                                } else {
                                    this.$message({
                                        type: "warning",
                                        message: res.data.msg
                                    });
                                }
                            }, error => {
                                this.preventRepeatSubmit(false, type);
                            });
                        }else{
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/process_configuration',
                                        name: '流程配置',
                                        meta: {
                                            i18n: 'process_configuration'
                                        },
                                        query: {
                                            timeStamp: new Date().getTime()
                                        },
                                    });
                                } else {
                                    this.$message({
                                        type: "warning",
                                        message: res.data.msg
                                    });
                                }
                            }, error => {
                                this.preventRepeatSubmit(false, type);
                            });
                        }

                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
