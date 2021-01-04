<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: true}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud" class="bill-items-container"
                                   v-if="isShow">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(true)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="work">
                                <div @click="workBtn(scope.row,scope.row.$index)">
                                    <el-input v-model="scope.row.work" placeholder="请选择工序" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="ask">
                                <div>
                                    <el-input v-model="scope.row.ask" placeholder="请输入要求"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="standardCost">
                                <div>
                                    <el-input v-model="scope.row.standardCost" placeholder="请输入标准费用(小时)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <task-history v-if="processId && processId!='' && taskType=='now'" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;margin-bottom: 60px;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getBill,
        getHistoryBill,
        addBill,
        auditBill
    } from "@/api/erp/product/product_config/product_production_craft";
    import {processesOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "warehousing-order-form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "订单编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 12,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "工艺名称",
                            prop: "craftName",
                            span: 12,
                        },
                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                    ]
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    height: 300,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            minWidth: 120,
                            slot: true,
                        },
                        {
                            label: "工序",
                            prop: "work",
                            minwidth: 180,
                            placeholder: '',
                            slot: true,
                            fixed: true,
                            align: 'left',
                            readonly: true,
                            clearable: false,

                        },
                        {
                            label: "要求",
                            prop: "ask",
                            placeholder: '请输入要求',
                            width: 400,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "标准费用(小时)",
                            prop: "standardCost",
                            width: 200,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#F56C6C"
                                        }
                                    },
                                    "标准费用(小时)"
                                );
                            }
                        },
                        {
                            label: "备注",
                            placeholder: '请输入内容',
                            prop: "note",
                            width: 400,
                            align: 'left',
                            slot: true,
                        },
                    ]
                },
                option: [],
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        methods: {
            workBtn() {
                if (this.type == 'view') {
                    return
                }
                this.isSingle = true;
                this.publicTitle = '请选择工序';
                this.typeName = 'processesType';
                this.option = processesOption;
                this.publicVisible = true;
            },
            handleAddRow(type) {
                const d = {
                    work: '',
                }
                this.formData.items.push(d);
            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.id == item.id) {
                            map.push(obj.id);
                        }
                    })
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    const dataMap = this.dataMap(this.formData.items, list);
                    if (dataMap.length > 0) {
                        this.vueMessage('warning', '工序(' + dataMap.join(",") + ')已有相同的工序信息，不能重复添加');
                        return;
                    }
                    for (var index in list) {
                        var item = list[index];
                        var itemObj = {};
                        itemObj.work = item.workName;
                        itemObj.tool = item.tool;
                        itemObj.ask = item.workQuality;
                        itemObj.workId = item.id;
                        console.log(itemObj);
                        this.formData.items.push(itemObj);
                    }
                    this.$nextTick(() => {
                        //清除没有商品ID的数据
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                    });

                    this.$refs.publicSelector.selectionClear();
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
                    })
                }, 17)
            },
            changeMaxHeight(type) {
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;

                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.processId = '';
                this.vueSet(this, 'formData', {});
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [{
                            work: ''
                        }]
                    };
                    this.formData = formData;
                    this.$nextTick(() => {
                        this.vueSet(this, 'formData', formData);
                    })
                    this.isShow = true;
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/product_craft_managerment_form',
                    name: '工艺管理制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'product_craft_managerment_form'
                    }
                });
            },
            getProcessId(billPrefix) {
                getProcessId({
                    billPrefix: billPrefix
                }).then(response => {
                    if (response != null && response != '') {
                        this.processId = response.data;
                    }
                });
            },
            async handleAuditBill(val) {
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum =await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this,this.$route);
                    this.$router.push({
                        path: '/taskNowList',
                        name: '待办任务',
                        meta: {
                            i18n: 'taskNowList'
                        },
                        query: {
                            timeStamp: new Date().getTime()
                        },
                    });
                    this.isAgreeLoading = false;
                    this.isRejectLoading = false;
                    this.init();

                }
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/warehousing-order-form',
                            name: '入库订单制单',
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
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].workId)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            handleCheckItemFuc() {
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                var items = this.formData.items;
                var flag = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].workId)) {
                        flag = false;
                        if (this.isEmpty(items[i].work)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的工序为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].ask)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的要求为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].standardCost)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的标准费用（小时）为必填项');
                            return false;
                        }
                    }
                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                return true;
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == this.id ? auditBill : addBill;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/product_craft_managerment',
                                    name: '工艺管理',
                                    meta: {
                                        i18n: 'product_craft_managerment'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                            this.preventRepeatSubmit(false, type);
                        });
                    } else {
                        return false;
                    }
                });

            }
        }
    };
</script>
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
