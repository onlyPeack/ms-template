<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="{tempAddBtn: true,addBtn: false}"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData" target="_blank"
                                 :to="{path:'/print/product_order_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>

                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="manageCost">
                        <div>
                            <el-input v-model="formData.manageCost" placeholder="请输入管理费比例,如0.8"
                                      :disabled="type=='view'?true:false"
                                      @change="manageBlur(formData.manageCost)"></el-input>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="enclosure">
                        <el-upload v-if="type != 'view'"
                                   class="upload-demo"
                                   action="/api/goods/storage/create"
                                   :on-preview="handlePreview"
                                   :on-remove="handleRemove"
                                   :before-remove="beforeRemove"
                                   multiple
                                   :on-success="handleSuccess"
                                   :file-list="fileList">
                            <el-button size="small" type="primary" style="margin-left: 6px;">点击上传</el-button>
                        </el-upload>
                        <div v-else>
                            <div v-if="formData.annexMuster">
                                <span style="cursor:pointer" @click="showDetail(item)"
                                      v-for="(item,index) in formData.annexMuster" :key="index">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud"
                                   @current-row-change="handleCurrentRowChange">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>

                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <!--<i class="el-icon-plus" @click="handleAddRow(true)"-->
                                    <!--style="margin-right: 15px;color:  #409EFF;"></i>-->
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @change="qtyBlur(scope.row.$index,scope.row.qty,true)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div>
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @change="priceBlur(scope.row.$index,scope.row.taxPrice,true)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div>
                                    <el-input v-model="scope.row.taxAmount" placeholder=" "
                                              :disabled="type=='view'?true:false" readonly></el-input>
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
                    <template slot-scope="scope" slot="items2">
                        <avue-crud :option="itemsTwoOption" :data="selectedRows.length>0?items2.items:item2.items">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">器件清单</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(false)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,false)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index,false)">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              :disabled="type=='view'?true:false"
                                              @change="qtyBlur(scope.row.$index,scope.row.qty,false)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="price">
                                <div>
                                    <el-input v-model="scope.row.price" placeholder="请输入单价"
                                              :disabled="type=='view'?true:false"
                                              @change="priceBlur(scope.row.$index,scope.row.price,true)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div>
                                    <el-input v-model="scope.row.amount" placeholder=" "
                                              :disabled="type=='view'?true:false" readonly></el-input>
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
        tempAddBill,
        auditBill
    } from "@/api/erp/product/shop_manager/product_order";
    import {userOption, customerOption, commodityOption, relationOption} from '@/util/table';
    import {findDetailed as getBillProject} from "@/api/erp/manager/project_order/index";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "product_order_form",
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
                item2: {items: []},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                selectedRows: [],
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                swith: undefined,
                selectData: [],
                selectIndex: 0,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            display: false
                        },
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
                            label: "项目编号",
                            prop: "projectBillNo",
                            span: 12,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择项目编号",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择项目订单';
                                    this.typeName = 'relationType';
                                    this.option = relationOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            }
                        },
                        {
                            label: "项目名称",
                            prop: "projectName",
                            span: 6,
                            readonly: true
                        },
                        {
                            label: "项目类型",
                            prop: "projectCut",
                            span: 6,
                            readonly: true
                        },
                        // {
                        //     label: "客户ID",
                        //     prop: "customerId",
                        //     display: false
                        // },
                        // {
                        //     label: "客户编号",
                        //     prop: "customerCode",
                        //     display: false
                        // },
                        // {
                        //     label: "客户名称",
                        //     prop: "customerName",
                        //     span: 6,
                        //     dicData: [],
                        //     filterable: true,
                        //     readonly: true,
                        //     clearable: false,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择客户",
                        //         trigger: "change"
                        //     }],
                        //     click: ({value, column}) => {
                        //         if (this.type != 'view') {
                        //             this.publicTitle = '请选择客户';
                        //             this.typeName = 'customerType';
                        //             this.option = customerOption;
                        //             this.isSingle = true;
                        //             this.publicVisible = true;
                        //         }
                        //     }
                        // },
                        {
                            label: "销售员ID",
                            prop: "salesId",
                            display: false
                        },
                        {
                            label: "销售员编号",
                            prop: "salesCode",
                            display: false
                        },
                        {
                            label: "销售员",
                            prop: "salesName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择销售员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择销售员';
                                    this.typeName = 'userType';
                                    this.selectIndex = 1;
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            }
                        },
                        {
                            label: "开工日期",
                            prop: "openDate",
                            span: 6,
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
                            label: "结束日期",
                            prop: "endsDate",
                            span: 6,
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
                            label: "技术人员ID",
                            prop: "skillId",
                            display: false
                        },
                        {
                            label: "技术人员编号",
                            prop: "skillCode",
                            display: false
                        },
                        {
                            label: "技术人员",
                            prop: "skillName",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择技术人员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择技术人员';
                                    this.typeName = 'userType';
                                    this.selectIndex = 2;
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            }
                        },
                        {
                            label: "生产人员ID",
                            prop: "produceId",
                            display: false
                        },
                        {
                            label: "生产人员编号",
                            prop: "produceCode",
                            display: false
                        },
                        {
                            label: "生产人员",
                            prop: "produceName",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择生产人员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择生产人员';
                                    this.typeName = 'userType';
                                    this.selectIndex = 3;
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            }
                        }, {
                            label: "管理费比例",
                            prop: "manageCost",
                            span: 6,
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请输入管理费比例",
                                trigger: "change"
                            }],
                        },

                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            label: "附件",
                            prop: "enclosure",
                            span: 24,
                            formslot: true
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                        {
                            prop: "items2",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        }
                    ]
                },
                itemsOption: {
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    border: true,
                    menu: false,
                    height: 300,
                    index: true,
                    highlightCurrentRow: true,
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
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            minWidth: 180,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 180,
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 180,
                            readonly: true
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            width: 100,
                            align: 'left',
                            readonly: true
                        },
                        // {
                        //     label: "已做生产数量",
                        //     prop: "productionQty",
                        //     width: 140,
                        //     align: 'right',
                        // },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 140,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#F56C6C"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        // {
                        //     label: "含税单价",
                        //     prop: "taxPrice",
                        //     width: 160,
                        //     align: 'right',
                        //     slot: true,
                        // },
                        // {
                        //     label: "含税金额",
                        //     prop: "taxAmount",
                        //     width: 160,
                        //     align: 'right',
                        //     slot: true,
                        // },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            slot: true,
                        },
                    ]
                },
                itemsTwoOption: {
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    border: true,
                    menu: false,
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
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            minWidth: 120,
                            slot: true,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 120,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 120,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 120,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 160,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 120,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 140,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#F56C6C"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 80,
                            align: "left",
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 160,
                            slot: true,
                        },
                    ]
                },
                fileList: [],
                publicVisible: false,
                publicTitle: '',
                isSingle: true,
                typeName: '',
                itemVisible: true,
                itemTwo: [],
                items2: {items: []},
                skuNoIndex: undefined,
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        methods: {
            showDetail(item) {
                window.open(item)
            },
            handleSuccess(response, file, fileLis) {
                // this.formData.annexMuster = [...this.formData.annexMuster,response.data.url]
                if (!this.formData.annexMuster) {
                    this.formData.annexMuster = []
                    this.formData.annexMuster.push(response.data.url);
                } else {
                    this.formData.annexMuster.push(response.data.url);
                }
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleRemove(file, fileList) {
                this.formData.annexMuster = this.formData.annexMuster.filter(item => {
                    return item != file.response.data.url
                })
            },
            manageBlur(val) {
                if (isNaN(val)) {
                    this.formData.manageCost = '';
                    this.vueMessage('warning', '请输入数字!');
                }
            },
            qtyBlur(index, val, type) {
                if (type) {
                    let sum = this.formData.items[index].maxQty - this.formData.items[index].productionQty;
                    if (sum < val) {
                        this.vueMessage('warning', '数量不能大于已做生产订单数量!');
                        this.formData.items[index].qty = sum;
                        return
                    }

                    this.formData.items[index].taxAmount = (parseInt(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);

                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                } else {
                    if (!(val*1 % this.selectedRows[0].qty == 0)) {
                        this.vueMessage('warning', '器件的数量必须是订单数量的整数倍!');
                    }
                    //this.items2.items[index].qty = 0;
                    this.items2.items[index].amount = (parseInt(this.items2.items[index].qty) * Number(this.items2.items[index].price)).toFixed(2);
                    this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                    this.items2.items[index].taxPrice = (Number(this.items2.items[index].price) * Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                    this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                    this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                    this.vueSet(this.items2.items, index, this.items2.items[index]);
                }
            },
            priceBlur(index, val, type) {
                if (type) {
                    this.formData.items[index].taxAmount = (parseInt(this.formData.items[index].qty) * Number(val)).toFixed(2);
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                } else {
                    this.items2.items[index].amount = (parseInt(this.items2.items[index].qty) * Number(val)).toFixed(2);
                    this.vueSet(this.items2.items, index, this.items2.items[index]);
                }
            },
            handleAddRow(type) {
                const d = {
                    skuName: '',
                    goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                }
                if (type) {
                    this.formData.items.push(d);
                } else {
                    this.items2.items.push(d);
                }

            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = type ? this.formData.items.length : this.items2.items.length;
                if (ValueIndex === 1) {
                    return
                }
                if (type) {
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == item.skuNo) {
                            this.itemTwo.splice(i, 1);
                        }
                    }
                    if (this.items2.skuNo == item.skuNo) {
                        this.items2 = {items: []};
                    }
                    this.formData.items.splice(index, 1);
                } else {
                    this.items2.items.splice(index, 1);
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = this.items2.items;
                        }
                    }
                }
            },
            //多选框状态改变时
            handleCurrentRowChange(val) {
                this.selectedRows = [val];
                if (val != null && val != undefined && val.skuName && val.skuName != '') {
                    this.skuNoIndex = this.selectedRows[0].skuNo;
                    let flag = false;
                    let sum;
                    if (this.itemTwo.length > 0) {
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.skuNoIndex) {
                                flag = true;
                                sum = i;
                            }
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i] = JSON.parse(JSON.stringify(this.items2));
                            }
                        }
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        if (flag) {
                            if (this.itemTwo[sum].items.length == 0) {
                                const d = {
                                    skuName: '',
                                    goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                                };
                                this.items2.items.push(d);
                            } else {
                                this.items2.items = JSON.parse(JSON.stringify(this.itemTwo[sum].items));
                            }
                        } else {
                            this.itemTwo.push({
                                skuNo: this.skuNoIndex,
                                items: [],
                            });
                            const d = {
                                skuName: '',
                                goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                            };
                            this.items2.items.push(d);
                        }

                    } else {
                        this.itemTwo.push({
                            skuNo: this.skuNoIndex,
                            items: [],
                        });
                        const d = {
                            skuName: '',
                            goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                        };
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        this.items2.items.push(d);
                    }
                } else if (val == null || val != undefined && !val.skuName || val.skuName != '') {
                    //this.vueMessage('warning', '请先选择产品信息!');
                    this.selectedRows = [];
                }
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    if (type) {
                        this.itemVisible = true;
                    } else {
                        this.itemVisible = false;
                    }
                    this.isSingle = false;

                    this.publicTitle = '请选择产品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }

            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.goodsName = list[0].linkMan;
                        this.formData.goodsPhone = list[0].linkPhone;
                        this.formData.goodsAddress = list[0].linkAddress;
                    }
                    if (this.typeName == 'userType') {
                        if (this.selectIndex == 1) {
                            this.formData.salesId = list[0].id;
                            this.formData.salesCode = list[0].no;
                            this.formData.salesName = list[0].name;
                        }
                        if (this.selectIndex == 2) {
                            this.formData.skillId = list[0].id;
                            this.formData.skillCode = list[0].no;
                            this.formData.skillName = list[0].name;
                        }
                        if (this.selectIndex == 3) {
                            this.formData.produceId = list[0].id;
                            this.formData.produceCode = list[0].no;
                            this.formData.produceName = list[0].name;
                        }
                    }
                    if (this.typeName == 'relationType') {
                        if (list[0].id) {
                            this.formData.projectId = list[0].id;
                            this.formData.salesId = list[0].salesId;
                            this.formData.salesCode = list[0].salesCode;
                            this.formData.salesName = list[0].salesName;
                            this.formData.projectCut = list[0].projectCut;
                            getBillProject(list[0].id).then(res => {
                                if (res.data.code == '2000' && res.data.data) {
                                    let dataList = JSON.parse(JSON.stringify(res.data.data));
                                    res.data.data.maxQty = dataList.qty;
                                    res.data.data.qty = Number(dataList.qty - res.data.data.productionQty);
                                    let formData = res.data.data;
                                    this.formData.customerId = formData.id;
                                    this.formData.customerCode = formData.customerCode;
                                    this.formData.customerName = formData.customerName;
                                    this.formData.skillCode = formData.skillCode;
                                    this.formData.skillId = formData.skillId;
                                    this.formData.skillName = formData.skillName;
                                    this.formData.projectCut = formData.projectCut;
                                    this.formData.projectName = formData.projectName;
                                    this.formData.items = [formData];
                                    this.formData.projectBillNo = formData.billNo;
                                    this.formData.id = undefined;
                                    this.itemTwo = [];
                                    let itemData = [];
                                    let formDatas = [res.data.data];
                                    for (let i in formDatas) {
                                        let data = {
                                            skuNo: formDatas[i].skuNo,
                                            items: formDatas[i].items,
                                        }
                                        itemData.push(data)
                                    }
                                    this.itemTwo = itemData;
                                }
                            })
                        }
                    }
                    if (this.typeName == 'commodityType') {
                        if (this.itemVisible) {
                            const dataMap = this.dataMap(this.formData.items, list);
                            if (dataMap.length > 0) {
                                this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                                return;
                            }
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.whether = 1;
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.brandName = item.brandName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.qty = 1;
                                itemObj.taxPrice = item.price;
                                itemObj.taxAmount = (parseInt(itemObj.qty) * Number(item.price)).toFixed(2);
                                itemObj.unit = item.unit;
                                itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                                this.formData.items.push(itemObj);
                            }
                        } else {
                            const dataMap = this.dataMap(this.formData.items2, list);
                            if (dataMap.length > 0) {
                                this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                                return;
                            }
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.brandName = item.brandName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.qty = 1;
                                itemObj.price = item.price;
                                itemObj.amount = (parseInt(itemObj.qty) * Number(item.price)).toFixed(2);
                                itemObj.taxAmount = (parseInt(itemObj.qty) * Number(item.price)).toFixed(2);
                                itemObj.unit = item.unit;
                                this.items2.items.push(itemObj);
                            }

                            for (let i in this.itemTwo) {
                                if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                    this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                                }
                            }
                        }
                        this.$nextTick(() => {
                            if (this.itemVisible) {
                                this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                this.handleAddRow(this.itemVisible);
                            } else {
                                this.items2.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.items2.items)));
                            }
                        });
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.skuNo == item.skuNo) {
                            map.push(obj.skuNo);
                        }
                    });
                });
                return map;
            },
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
                        items.splice(i, 1);
                    }
                }
                return items;
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
            init() {
                this.processId = '';
                this.vueSet(this, 'formData', {});
                this.formData.annexMuster = [];
                this.itemTwo = [];
                this.fileList = [];
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.itemsTwoOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.itemsTwoOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [],
                        items2: [],
                    };
                    this.items2 = {items: []};
                    this.$nextTick(() => {
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/product_order_form',
                    name: '生产订单制单',
                    query: {
                        type: 'add'
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
                if (this.formData.annexMuster == '') {
                    this.formData.annexMuster = [];
                }
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum = await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this, this.$route);
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
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                        formData.deliverDate = [formData.startValidityPeriod, formData.endValidityPeriod];
                        this.formData = formData;
                        this.fileList = [];
                        for (let i in formData.annexMuster) {
                            this.fileList.push({
                                name: formData.annexMuster[i],
                                url: formData.annexMuster[i]
                            })
                        }
                        this.itemTwo = [];
                        let itemData = [];
                        for (let i in formData.items) {
                            let data = {
                                skuNo: formData.items[i].skuNo,
                                items: formData.items[i].items,
                            }
                            itemData.push(data)
                        }
                        this.itemTwo = itemData;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales_project_order_form',
                            name: '项目订单制单',
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
            handleCheckItemFuc(items) {
                var flag = true;
                var flagTwo = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的产品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税金额为必填项');
                            return false;
                        }
                    }
                    if (items[i].items.length > 0) {
                        for (var j in items[i].items) {
                            flagTwo = false;
                            let itemTwo = items[i].items[j];
                            if (!this.isEmpty(itemTwo.skuNo)) {
                                flag = false;
                                if (this.isEmpty(itemTwo.skuName)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的产品名称为必填项');
                                    return false;
                                }
                                if (this.isEmpty(itemTwo.qty)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                                    return false;
                                }
                            }
                        }
                    }

                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (flagTwo) {
                    this.vueMessage('warning', '产品单据明细不能为空');
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
                if (this.formData.annexMuster == '') {
                    this.formData.annexMuster = [];
                }
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (this.itemTwo.length == 0) {
                    this.vueMessage('warning', '产品单据明细不能为空');
                    return false;
                }
                for (var x in this.itemTwo) {
                    if (this.itemTwo[x].skuNo == this.items2.skuNo) {
                        this.itemTwo[x].items = this.items2.items;
                    }
                }
                let data = JSON.parse(JSON.stringify(this.formData));
                let twoData = JSON.parse(JSON.stringify(this.itemTwo));
                delete data.items2;
                for (let i in data.items) {
                    for (let j in twoData) {
                        if (data.items[i].skuNo == twoData[j].skuNo) {
                            data.items[i].items = this.clearNoGoodsIdData(twoData[j].items);
                            if (data.items[i].items.length < 1) {
                                this.vueMessage('warning', data.items[i].skuNo + '柜子无清单!');
                                return
                            }
                            for (let j in data.items[i].items) {
                                if (!(data.items[i].items[j].qty % data.items[i].qty == 0)) {
                                    this.vueMessage('warning', '第' + (j * 1 + 1) + '器件的数量必须是' + (i * 1 + 1) + '订单数量的整数倍!');
                                    return
                                }
                            }

                        }
                    }
                }
                data.items = this.clearNoGoodsIdData(data.items);
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc(data.items)) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        saveBill(data).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/product_order',
                                    name: '生产订单',
                                    meta: {
                                        i18n: 'product_order_form'
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
