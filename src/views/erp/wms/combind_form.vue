<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position:relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0;">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit" :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud" class="bill-items-container" :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">源商品清单</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(true)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index,true)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @change="qtyBlur(scope.row.$index,scope.row.qty,true)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                    <template slot-scope="scope" slot="items2">
                        <avue-crud :option="itemsTwoOption" :data="formData.items2" class="bill-items-container" :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">新商品清单</h3>
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
                                <div @click="skuBtn(scope.row,scope.row.$index,false)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionName" placeholder="请选择仓位"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              :disabled="type=='view'?true:false"
                                              @change="qtyBlur(scope.row.$index,scope.row.qty,false)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="costPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.costPrice" placeholder="请输入单位成本"
                                              :disabled="type=='view'?true:false"
                                              @change="priceBlur(scope.row.$index,scope.row.costPrice,false)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
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
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :code="formData.warehouseId"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, pageBySingleProduct} from "@/api/erp/wms/bill/combind";
    import {
        userOption,
        customerOption,
        commodityOption,
        relationOption,
        warehouseOption,
        productOption,
        positionOption
    } from '@/util/table';
    import {findDetailed as getBillProject} from "@/api/erp/manager/project_order/index";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "combind_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                positionIndex: undefined,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
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
                            label: "业务类型",
                            prop: "businessType",
                            span: 6,
                            type: 'select',
                            dicData: [
                                {
                                    value: '0',
                                    label: '组装'
                                },
                                {
                                    value: '1',
                                    label: '拆卸'
                                }
                            ]
                        },
                        {
                            label: "仓库",
                            prop: "warehouseName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择仓库',
                            rules: [{
                                required: true,
                                message: "请选择仓库",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                this.publicTitle = '请选择仓库';
                                this.typeName = 'warehouseType';
                                this.option = warehouseOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "加工费用",
                            prop: "operatingCost",
                            span: 6
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
                        {
                            prop: "items2",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        }
                    ]
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    height: 300,
                    index: true,
                    indexLabel: '序号',
                    highlightCurrentRow: true,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "costPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        }
                    ],
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
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            fixed: true,
                            align: 'left',
                            minWidth: 130,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "商品名称"
                                );
                            }
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            minWidth: 100,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 100,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            minWidth: 90,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            minWidth: 70,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            minWidth: 120,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "单位成本",
                            prop: "costPrice",
                            minWidth: 100,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                        },
                        {
                            label: "金额",
                            prop: "taxAmount",
                            minWidth: 100,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 100,
                            overHidden:true,
                            slot: true,
                        },
                    ]
                },
                itemsTwoOption: {
                    border: true,
                    menu: false,
                    height: 300,
                    index: true,
                    indexLabel: '序号',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "costPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        }
                    ],
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
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            align: 'left',
                            minWidth: 130,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "商品名称"
                                );
                            }
                        },

                        {
                            label: "规格型号",
                            prop: "specifications",
                            minWidth: 100,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 100,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            minWidth: 90,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            minWidth: 70,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            minWidth: 120,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "单位成本",
                            prop: "costPrice",
                            minWidth: 120,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "单位成本"
                                );
                            }
                        },
                        {
                            label: "仓位",
                            prop: "positionName",
                            minWidth: 120,
                            overHidden:true,
                            placeholder: '请选择仓位',
                            align: 'left',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "仓位"
                                );
                            }
                        },
                        {
                            label: "金额",
                            prop: "taxAmount",
                            minWidth: 100,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 100,
                            overHidden:true,
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
                skuNoIndex: undefined,
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            positionBtn(val, index) {
                if (this.type != 'view') {
                    if (!this.formData.warehouseId) {
                        this.vueMessage('warning', '请先仓库!');
                        return
                    }
                    if (!this.formData.items2[index] || !this.formData.items2[index].skuName) {
                        this.vueMessage('warning', '请先选择商品!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'positionType';
                    this.option = positionOption;
                    this.publicVisible = true;
                    this.positionIndex = index;
                }
            },
            priceBlur(index, val, type) {
                this.formData.items2[index].taxAmount = (parseInt(this.formData.items2[index].qty) * Number(val)).toFixed(this.sysParam.amountDecimal);
                this.vueSet(this.formData.items2, index, this.formData.items2[index]);
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    if (type) {
                        this.itemVisible = true;
                        if (this.formData.warehouseId == undefined) {
                            this.vueMessage('warning', '请先选择仓库!');
                            return
                        }
                    } else {
                        this.itemVisible = false;
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = type ? 'productType' : 'commodityType';
                    this.option = type ? productOption : commodityOption;
                    this.publicVisible = true;
                }

            },
            handleSuccess(response, file, fileLis) {
                this.formData.enclosure = response.data.url;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            qtyBlur(index, val, type) {
                if (type) {
                    if(this.formData.items[index].costPrice){
                        this.formData.items[index].taxAmount = (parseInt(this.formData.items[index].qty) * Number(this.formData.items[index].costPrice)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }

                } else {
                    if(this.formData.items2[index].price) {
                        this.formData.items2[index].amount = (parseInt(this.formData.items2[index].qty) * Number(this.formData.items2[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items2, index, this.formData.items2[index]);
                    }
                }
            },
            handleAddRow(type) {
                const d = {
                    skuName: '',
                }
                if (type) {
                    this.formData.items.push(d);
                } else {
                    this.formData.items2.push(d);
                }

            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = type ? this.formData.items.length : this.items2.items.length;
                if (ValueIndex === 1) {
                    return
                }
                if (type) {

                    this.formData.items.splice(index, 1);
                } else {
                    this.formData.items2.splice(index, 1);
                }
            },
            // skuBtn(item, index, type) {
            //     if (this.type != 'view') {
            //         if (type) {
            //             this.itemVisible = true;
            //         } else {
            //             this.itemVisible = false;
            //         }
            //         this.isSingle = false;
            //
            //         this.publicTitle = '请选择产品';
            //         this.typeName = 'commodityType';
            //         this.option = commodityOption;
            //         this.publicVisible = true;
            //     }
            //
            // },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'positionType') {
                        this.formData.items2[this.positionIndex].positionName = list[0].name;
                        this.formData.items2[this.positionIndex].positionId = list[0].id;
                        this.publicVisible = false;
                        this.vueSet(this.formData.items2, this.positionIndex, this.formData.items2[this.positionIndex]);
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'productType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {

                            var item = list[index];
                            var itemObj = {};
                            itemObj.whether = 1;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = 1;
                            itemObj.costPrice = item.costPrice.toFixed(this.sysParam.amountDecimal);
                            itemObj.taxAmount = (parseInt(itemObj.qty) * Number(item.costPrice)).toFixed(this.sysParam.amountDecimal);
                            itemObj.unit = item.unit;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow(true);
                        });
                    }
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.formData.items2, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
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
                            itemObj.unit = item.unit;
                            itemObj.costPrice = '';
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.formData.items2.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items2 = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items2)));
                            this.handleAddRow(false);
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
                this.vueSet(this, 'formData', {});
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
                        items: [{}],
                        items2: [{}],
                    };
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/combind_form',
                    name: '组装拆卸单制单',
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
                        let formData = JSON.parse(JSON.stringify(res.data.data));
                        delete formData.newItems;
                        delete formData.oldItems;
                        formData.items = res.data.data.oldItems;
                        formData.items2 = res.data.data.newItems;
                        formData.deliverDate = [formData.startValidityPeriod, formData.endValidityPeriod];
                        this.formData = formData;
                        let billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/combind_form',
                            name: '组装拆卸单制单',
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
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].costPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单位成本为必填项');
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
            handleCheckItemFucs(items) {
                var flag = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].positionName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的仓位为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].costPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单位成本为必填项');
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

                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (this.formData.items2.length == 0) {
                    this.vueMessage('warning', '商品单据明细不能为空');
                    return false;
                }
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc(this.formData.items)) {
                    return;
                }
                if (!this.handleCheckItemFucs(this.formData.items2)) {
                    return;
                }
                this.$nextTick(() => {
                    this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                    this.formData.items2 = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items2)));
                    let obj = JSON.parse(JSON.stringify(this.formData));
                    delete obj.items;
                    delete obj.items2;
                    obj.oldItems = this.formData.items;
                    obj.newItems = this.formData.items2;
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            //防止重复提交
                            this.preventRepeatSubmit(true, type);
                            let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                            saveBill(obj).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/combind',
                                        name: '组装拆卸单',
                                        meta: {
                                            i18n: 'combind'
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
                });
            }
        }
    };
</script>
