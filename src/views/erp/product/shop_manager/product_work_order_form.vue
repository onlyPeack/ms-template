<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"
                                @handleWorkers="handleWorkers"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/product_work_order_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="region">
                        <area-cascader :level="2" v-model="formData.region" type="all" :data="$pcaa"
                                       :disabled="formOption.disabled" v-if="showRegion"></area-cascader>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud" class="bill-items-container">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <!--<i class="el-icon-plus" @click="handleAddRow(true)"-->
                                    <!--style="margin-right: 15px;color:  #409EFF;"></i>-->
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="startTime">
                                <div>
                                    <el-date-picker v-model="scope.row.startTime" align="left" type="date" @change="pickerBtn(scope.row,scope.row.$index)"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择开始时间" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="endTime">
                                <div>
                                    <el-date-picker v-model="scope.row.endTime" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择完工时间" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="estimateHour">
                                <div>
                                    <el-input v-model="scope.row.estimateHour" placeholder="请输入计划工时"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="onTest">
                                <div>
                                    <el-select v-model="scope.row.onTest">
                                        <el-option label="是" value="是"></el-option>
                                        <el-option label="否" value="否"></el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="workerHour">
                                <div>
                                    <el-input v-model="scope.row.workerHour" placeholder="请输入实际工时"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>

                            <template slot-scope="scope" slot="onText">
                                <div>
                                    <el-input v-model="scope.row.onText" placeholder="不合格原因"
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
            <task-history v-if="processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" selectType="1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :id="masterId"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill as getBills} from "@/api/erp/product/shop_manager/product_dispatch_list";
    import {getBill, getHistoryBill, addBill, tempAddBill,auditBill} from "@/api/erp/product/shop_manager/product_work_order";
    import {getListBill} from "@/api/erp/product/shop_manager/product_dispatch_list";
    import {processesOption, dispatchersOption, userOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "product_work_order_form",
        props: ['type', 'id', 'masterId', 'taskType', 'step'],
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
                permission: {tempAddBtn: false, addBtn: false, workersBtn: true},
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
                            label: "生产明细ID",
                            prop: "itemId",
                            display: false,
                            span: 8,
                        },
                        {
                            label: "关联单据",
                            prop: "sourceBillNo",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择关联单据",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择关联单据';
                                this.typeName = 'dispatchersType';
                                this.option = dispatchersOption;
                                this.isSingle = false;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "产品名称",
                            prop: "skuName",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "柜体号",
                            prop: "itemNo",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "下达数量",
                            prop: "qty",
                            span: 6,
                            readonly: true,
                        },
                        // {
                        //     label: "完成数量",
                        //     prop: "releaseQty",
                        //     type: "number",
                        //     span: 12,
                        //     rules: [{
                        //         required: true,
                        //         message: "请输入完成数量",
                        //         trigger: "change"
                        //     }],
                        //     change: ({value, column}) => {
                        //         if (this.formData.qty) {
                        //             let sum = parseInt(this.formData.qty) - parseInt(value);
                        //             if (this.formData.sourceBillNo) {
                        //                 if (this.formData.kqty < value) {
                        //                     this.$nextTick(() => {
                        //                         this.vueSet(this.formData, 'releaseQty', '');
                        //                     })
                        //                     this.vueMessage('warning', '输入值已超出本次可完成数量!');
                        //                 }
                        //             } else {
                        //                 this.vueMessage('warning', '请先关联单据!');
                        //             }
                        //         }
                        //
                        //     }
                        // },
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
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    height: 300,
                    index: true,
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
                            label: "工序名称",
                            prop: "workOn",
                            minWidth: 160,
                            placeholder: '请选择工序名称',
                            align: 'left',
                            readonly: true,
                        },
                        {
                            label: "作业要求",
                            prop: "demand",
                            placeholder: '请输入作业要求',
                            minWidth: 160,
                            align: 'left',
                        },
                        {
                            label: "操作员",
                            prop: "skillName",
                            width: 180,
                            placeholder: '',
                            align: 'left',
                            readonly: true,
                            clearable: false,
                        },
                        {
                            label: "开始时间",
                            prop: "startTime",
                            placeholder: '请输入开始时间',
                            width: 170,
                            type: "date",
                            align: 'left',
                            slot: true,

                        },
                        {
                            label: "完工时间",
                            prop: "endTime",
                            placeholder: '请输入开始时间',
                            width: 170,
                            type: "date",
                            align: 'left',
                            slot: true,
                        },
                        // {
                        //     label: "日程规划",
                        //     prop: "schedule",
                        //     width: 160,
                        //     align: 'left',
                        // },
                        {
                            label: "计划工时",
                            prop: "estimateHour",
                            width: 160,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "实际工时",
                            prop: "workerHour",
                            width: 160,
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
            pickerBtn(item,index){
                if(new Date(item.startTime).getTime()>new Date(item.endTime).getTime()){
                    this.vueMessage('warning','开始时间不能大于完工时间!');
                    this.formData.items[index].startTime = undefined;
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    return
                }
            },
            handleAddRow(type) {
                const d = {
                    workName: '',
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
            handleWorkers() {
                this.$router.push({
                    path: '/product_work_order',
                    name: '报工单',
                    query: {
                        type: 'add',
                        id: this.masterId,
                    },
                    meta: {
                        i18n: 'product_work_order'
                    }
                });
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    if (item.goodsId) {
                        list.forEach(function (obj) {
                            if (obj.skuNo == item.skuNo) {
                                map.push(obj.skuNo);
                            }
                        });
                    }
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    if (this.typeName == 'dispatchersType') {
                        this.formData.sourceBillNo = list[0].mainDTO.billNo;
                        this.formData.listId = list[0].id;
                        this.formData.qty = list[0].mainDTO.releaseQty;
                        this.formData.kqty = Number(Number(list[0].releaseQty) - Number(list[0].completeQty));
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skillName = item.skillName;
                            itemObj.skillId = item.skillId;
                            itemObj.skillCode = item.skillCode;
                            itemObj.workOn = item.workOn;
                            itemObj.standardCost = item.standardCost;
                            itemObj.demand = item.demand;
                            itemObj.estimateHour = item.estimateHour;
                            itemObj.endTime = item.planDate;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    this.publicVisible = false;
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
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    getListBill(this.masterId).then(response => {
                        let formData = {
                            itemId: response.data.data.id,
                            billProjectNo: response.data.data.projectBillNo,
                            itemNo: response.data.data.itemNo,
                            skuName: response.data.data.skuName,
                            startDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            endDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            items: []
                        };
                        this.$nextTick(() => {
                            this.formData = formData;
                            this.vueSet(this, 'formData', formData);
                        })
                        this.loading = false;
                    })

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/product_work_order_form',
                    name: '报工单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'customer_order_form'
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
                            path: '/product_work_order_form',
                            name: '报工单制单',
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
                    if (this.isEmpty(items[i].workOn)) {
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
                    if (!this.isEmpty(items[i].workOn)) {
                        flag = false;
                        if (this.isEmpty(items[i].demand)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的作业要求为必填项');
                            return false;
                        }
                        // if (this.isEmpty(items[i].workJob)) {
                        //     this.vueMessage('warning', '第' + (i * 1 + 1) + '行的工件工具为必填项');
                        //     return false;
                        // }
                        if (this.isEmpty(items[i].startTime)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的开始时间为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].endTime)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的完工时间为必填项');
                            return false;
                        }
                        // if (this.isEmpty(items[i].schedule)) {
                        //     this.vueMessage('warning', '第' + (i * 1 + 1) + '行的日程规划为必填项');
                        //     return false;
                        // }
                        if (this.isEmpty(items[i].estimateHour)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的计划工时为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].workerHour)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的实际工时为必填项');
                            return false;
                        }
                        // if (this.isEmpty(items[i].onTest)) {
                        //     this.vueMessage('warning', '第' + (i * 1 + 1) + '行的是否合格为必填项');
                        //     return false;
                        // }
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
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/product_work_order',
                                    name: '报工单',
                                    meta: {
                                        i18n: 'product_work_order'
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
