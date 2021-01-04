\<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose" :title="title" append-to-body class="public-dialog">
        <avue-crud :option="option" v-if="isShow"
                   :table-loading="loading"
                   :data="data"
                   :page="page"
                   v-model="form"
                   ref="crud"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   :cell-style="handleCellStyle"
                   @refresh-change="refreshChange"
                   @on-load="onLoad"
                   @row-click="rowClick">
            <template slot="menuRight">
                <el-switch style="margin-bottom:10px;" v-if="itemVisible == false? true:false" v-model="isDetailed"
                           active-text="费用" inactive-text="元器件" class="el-switch-select"
                           @change="handleSwitchChange"></el-switch>
                <el-switch style="margin-bottom:10px;" v-if="typeName == 'quotationType' && orderVisible == true? true:false" v-model="isDetailed"
                           active-text="项目合同" inactive-text="销售报价" class="el-switch-select"
                           @change="handleSwitchChange"></el-switch>

            </template>
            <template slot-scope="scope" slot="contractAmount">
                <div v-if="scope.row">{{scope.row.mainDTO.contractAmount}}</div>
            </template>
            <template slot-scope="scope" slot="stockOutQty">
                <div v-if="scope.row">{{scope.row.mainDTO.stockOutQty}}</div>
            </template>
            <template slot-scope="scope" slot="customerOrderQty">
                <div v-if="scope.row">{{scope.row.mainDTO.customerOrderQty}}</div>
            </template>
            <template slot-scope="scope" slot="contractDate">
                <div v-if="scope.row">{{scope.row.mainDTO.contractDate}}</div>
            </template>
            <template slot-scope="scope" slot="effectiveDate">
                <div v-if="scope.row">{{scope.row.mainDTO.effectiveDate}}</div>
            </template>
            <template slot-scope="scope" slot="disabledDate">
                <div v-if="scope.row">{{scope.row.mainDTO.disabledDate}}</div>
            </template>
            <template slot="billDate" slot-scope="scope">
                <span>{{scope.row.mainDTO.billDate}}</span>
            </template>
            <template slot="billAmount" slot-scope="scope">
                <span>{{scope.row.mainDTO.billAmount}}</span>
            </template>
            <template slot="deliverDate" slot-scope="scope">
                <span>{{scope.row.mainDTO.deliverDate}}</span>
            </template>
            <template slot="billNo" slot-scope="scope">
                <span>{{scope.row.mainDTO.billNo}}</span>
            </template>
            <template slot="supplierName" slot-scope="scope">
                <span>{{scope.row.mainDTO.supplierName}}</span>
            </template>
            <template slot="taxBillAmount" slot-scope="scope">
                <span>{{scope.row.mainDTO.taxBillAmount}}</span>
            </template>
            <!--<template slot="billStatus" slot-scope="scope" v-if="scope.row.mainDTO">-->
            <!--<div v-for="(item,index) in statusOptions"  :key="index">-->
            <!--<span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>-->
            <!--</div>-->
            <!--</template>-->
            <!--<template slot="invoiceStatus" slot-scope="scope" v-if="scope.row.mainDTO">-->
            <!--<div v-for="(item,index) in invoiceStatusOptions"  :key="index">-->
            <!--<span v-if="Number(item.value)==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>-->
            <!--</div>-->
            <!--</template>-->
            <template slot="storageStatus" slot-scope="scope" v-if="scope.row.mainDTO">
                <div v-for="(item,index) in storageStatusOptions" :key="index">
                    <span v-if="Number(item.value)==scope.row.mainDTO.storageStatus">{{item.label}}</span>
                </div>
            </template>
            <template slot="receiptStatus" slot-scope="scope" v-if="scope.row.mainDTO">
                <div v-for="(item,index) in receiptStatusOptions" :key="index">
                    <span v-if="Number(item.value)==scope.row.mainDTO.receiptStatus">{{item.label}}</span>
                </div>
            </template>
            <template slot="printCount" slot-scope="scope">
                <span>{{scope.row.mainDTO.printCount}}</span>
            </template>

            <template slot-scope="scope" slot="menu">
                <el-button type="primary"
                           size="small" @click="assignmentBtn(2)"
                           plain>编辑
                </el-button>
                <el-button type="info"
                           size="small"
                           plain @click="assignmentBtn(1)">删除
                </el-button>
            </template>
        </avue-crud>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {pageBySkuNoAndWarehouseId as skuType} from '@/api/erp/wms/stock_query/index';
    import {pageBySingleProduct as productType} from "@/api/erp/product/shop_manager/product_order";
    import {page as bankType} from '@/api/erp/financial/financialBankAccount';
    import {
        pageByBatchNo as stockType,
        selectByWarehouseIdAndPositionId as allocationStockOutType,
        selectStockByWarehouseId as stockByWarehouseIdType
    } from "@/api/erp/wms/stock_query/index";
    import {list as projectType} from '@/api/erp/project_management/projectOverview';
    import {page as bankAccountType} from '@/api/erp/financial/financialBankAccount';
    import {page  as capitalAccountType} from '@/api/erp/financial/financialCompanyAccount';
    import {page as subjectType} from '@/api/erp/financial/account';
    import {page as customerType} from '@/api/erp/crm/customer/index';
    import {page as userType, selectPageForCommission as userTypes,collectType} from '@/api/admin/user/index';
    import {selectPage as priceType} from '@/api/erp/purchase/bill/purchasePrices';
    import {selectPageByItem as sourceType} from '@/api/erp/sales/bill/salesContract';
    import {
        page as commodityType,
        feeType,
        queryType,
        queryStockWarning as queryStockWarningType
    } from '@/api/erp/goods/goodsProduct';
    import {selectPageByItem as relationType} from "@/api/erp/manager/project_order/index";
    import {selectPage as workerType} from "@/api/erp/product/shop_manager/product_work_order";
    import {findAll as dispatchersType} from "@/api/erp/product/shop_manager/product_dispatch_list";
    import {
        selectPage as manufactureType,
        selectPageByItem as manufacturesType,
        findBills as  manufacturessType
    } from "@/api/erp/product/shop_manager/product_order";
    import {selectPage as processesType} from "@/api/erp/product/product_config/product_process_managerment";
    import {selectPage as technologyType} from "@/api/erp/product/product_config/product_production_craft";
    import {
        selectPageByItem as customerOrderType,
        selectPageItemByWarehouseId as customerssOrderType,middleType
    } from "@/api/erp/sales/bill/salesOrder";
    import {page as warehouseType} from "@/api/erp/wms/config/warehouse";
    import {page as purchaseType} from "@/api/erp/purchase/supplier";
    import {selectPageByItem as applyType} from "@/api/erp/purchase/bill/purchaseApply";
    import {selectPageByItem as invoiceType} from "@/api/erp/purchase/bill/invoiceOrder";
    import {
        selectPageByItem as purchasesType,
        selectPage as purchasesTypes
    } from "@/api/erp/purchase/bill/purchaseOrder";
    import {selectPage as positionType} from '@/api/erp/wms/config/warehousePosition';
    import {
        selectPage as relatioType,
        selectPageByItem as relationsType,
        slectItemBillByPageSummary as relationssType,
        slectItemBillByPageSummarys as slectItemBillByPageSummaryType
    } from '@/api/erp/manager/project_order/index';
    import {selectPageByItem as materialType} from '@/api/erp/wms/bill/materialStockOut';
    import {selectPage as ordersType, selectPageByItem as ordersTypes} from '@/api/erp/wms/bill/purchaseStockIn';
    import {selectPageByItem as salesType} from "@/api/erp/wms/bill/salesStockOut";
    import {selectPageByItem as customersOrderType, selectPage as sellType, selectGoodsPage as taxCodType} from "@/api/erp/sales/bill/salesOrder";
    import {page as sendType} from '@/api/erp/wms/config/Logistics';
    import {page as otherType} from '@/api/erp/financial/financialOtherCompany';
    import {selectPageByItem as quotationType} from '@/api/erp/sales/bill/salesQuotation';
    import {selectPage as  selectAll} from '@/api/erp/project_management/projectOverview';
    export default {
        props: ['positionOutId','orderVisible','dialogVisible', 'isSingle', 'title', 'option', 'typeName', 'code', 'typeOption', 'id', 'itemVisible', 'selectType', 'operationType', 'craftId', 'config', 'discountLevel', 'searchObj','outType','customerName','warehouseId','skuNo'],
        data() {
            return {
                isShow: true,
                isDetailed: false,
                form: {},
                query: {},
                loading: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                selectionList: [],
                data: []
            };
        },
        computed: {
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        created() {
            if (this.typeName == 'queryType') {
                this.option.column = [
                    {
                        label: "产品名称",
                        prop: "skuName",
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "分类名称",
                        prop: "categoryName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "系列名称",
                        prop: "seriesName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "可用库存",
                        prop: "stockQty",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "面价",
                        prop: "retailPrice",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 80,
                        align: 'left'
                    },
                ];
            }
            if (this.typeName == 'commodityType') {
                this.option.column = [
                    {
                        label: "产品名称",
                        prop: "skuName",
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "分类名称",
                        prop: "categoryName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "系列名称",
                        prop: "seriesName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "可用库存",
                        prop: "stockQty",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "面价",
                        prop: "retailPrice",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 80,
                        align: 'left'
                    },
                ];
            }
            if (this.typeName == 'invoiceType') {
                this.option.column = [
                    {
                        label: "单据日期",
                        prop: "billDate",
                        slot: true,
                        minWidth: 150,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "单据编号",
                        prop: "billNo",
                        slot: true,
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "制单人",
                        prop: "crtUserName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "采购员",
                        prop: "purchaserName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "供应商",
                        prop: "supplierName",
                        minWidth: 180,
                        slot: true,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "金额",
                        prop: "billAmount",
                        minWidth: 150,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "税价合计",
                        prop: "taxBillAmount",
                        minWidth: 80,
                        align: 'right'
                    },
                    // {
                    //     label: "状态",
                    //     prop: "billStatus",
                    //     minWidth: 80,
                    //     slot:true,
                    //     align:'left'
                    // },
                    // {
                    //     label: "开票状态",
                    //     prop: "invoiceStatus",
                    //     minWidth: 80,
                    //     slot:true,
                    //     align:'left'
                    // },
                    // {
                    //     label: "商品编码",
                    //     prop: "skuNo",
                    //     minWidth: 80,
                    //     align:'left'
                    // },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        align: 'left'
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 150,
                        align: 'left'
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 80,
                        align: 'left'
                    },
                    {
                        label: "数量",
                        prop: "qty",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "单价",
                        prop: "price",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "税价合计",
                        prop: "taxPrice",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "收货数量",
                        prop: "deliverQty",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "入库数量",
                        prop: "stockInPurchaseQty",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "未入库数量",
                        prop: "notStockInPurchaseQty",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "入库金额",
                        prop: "stockInPurchaseAmount",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "未入库金额",
                        prop: "notStockInPurchaseAmount",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "未入库金额",
                        prop: "notStockInPurchaseAmount",
                        minWidth: 80,
                        align: 'right'
                    },
                    {
                        label: "入库状态",
                        prop: "storageStatus",
                        minWidth: 80,
                        slot: true,
                        align: 'left'
                    },
                    {
                        label: "收货状态",
                        prop: "receiptStatus",
                        minWidth: 80,
                        slot: true,
                        align: 'left'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 80,
                        align: 'left'
                    },
                    {
                        label: "开票数量",
                        prop: "purchaseInvoiceQty",
                        minWidth: 80,
                        align: 'right'
                    },
                ];
            }
        },
        methods: {
            handleSwitchChange() {
                this.isShow = false;
                if(this.itemVisible != undefined){
                    this.$nextTick(() => {
                        this.option.column = [];
                        if (this.isDetailed) {
                            this.option.column = [
                                {
                                    label: "费用名称",
                                    prop: "skuName",
                                    minWidth: 150,
                                    search: true,
                                    align: 'left'
                                },
                            ];
                        } else {
                            this.option.column = [
                                {
                                    label: "产品名称",
                                    prop: "skuName",
                                    minWidth: 150,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "分类名称",
                                    prop: "categoryName",
                                    minWidth: 120,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "品牌名称",
                                    prop: "brandName",
                                    minWidth: 120,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "系列名称",
                                    prop: "seriesName",
                                    minWidth: 120,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "规格型号",
                                    prop: "specifications",
                                    minWidth: 160,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "订货号",
                                    prop: "itemNo",
                                    minWidth: 150,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "可用库存",
                                    prop: "stockQty",
                                    minWidth: 150,
                                    align: 'left'
                                },
                                {
                                    label: "面价",
                                    prop: "retailPrice",
                                    minWidth: 80,
                                    align: 'right'
                                },
                                {
                                    label: "单位",
                                    prop: "unit",
                                    minWidth: 80,
                                    align: 'left'
                                },
                            ];
                        }
                        this.isShow = true;
                    })
                }else{
                    this.$nextTick(() => {
                        this.option.column = [];
                        if (this.isDetailed) {
                            this.option.column = [
                                {
                                    label: "合同编号",
                                    prop: "billNo",
                                    width:150,
                                    align: 'left',
                                    search: true,
                                },
                                {
                                    label: "合同名称",
                                    prop: "contractName",
                                    minWidth: 120,
                                    align: 'left',
                                    search: true,
                                },
                                {
                                    label: "所属项目",
                                    prop: "projectName",
                                    minWidth: 120,
                                    align: 'left',
                                },
                                {
                                    label: "业务员",
                                    prop: "salesName",
                                    minWidth: 120,
                                    align: 'left',
                                },
                                {
                                    label: "签约日期",
                                    prop: "signDate",
                                    minWidth: 120,
                                    align: 'left',
                                },
                                {
                                    label: "生效日期",
                                    prop: "takeDate",
                                    minWidth: 120,
                                    align: 'left',
                                },
                                {
                                    label: "到期日期",
                                    prop: "overDate",
                                    minWidth: 120,
                                    align: 'left',
                                },
                            ];
                        } else {
                            this.option.column = [
                                {
                                    label: "单据编号",
                                    prop: "billNo",
                                    minWidth: 150,
                                    search: true,
                                    align: 'left'
                                },
                                {
                                    label: "客户名称",
                                    prop: "customerName",
                                    minWidth: 220,
                                    search: true,
                                    align: 'left',
                                },
                                {
                                    label: "业务员",
                                    prop: "salerName",
                                    minWidth: 100,
                                    search: true,
                                    align: 'left',
                                },
                                {
                                    label: "商品名称",
                                    prop: "skuName",
                                    minWidth: 160,
                                    search: true,
                                    align: 'left'
                                }, {
                                    label: "订货号",
                                    prop: "itemNo",
                                    minWidth: 150,
                                    search: true,
                                }, {
                                    label: "品牌名",
                                    prop: "brandName",
                                    hide: true
                                }, {
                                    label: "规格型号",
                                    prop: "specifications",
                                    minWidth: 150,
                                    search: true,
                                    align: 'left'
                                }, {
                                    label: "数量",
                                    prop: "qty",
                                    minWidth: 80,
                                    align: 'center',
                                    textColor: "#ff0000",
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
                                }, {
                                    label: "单价",
                                    prop: "price",
                                    minWidth: 80,
                                    align: 'right',
                                    textColor: "#ff0000",
                                    renderHeader: h => {
                                        return h(
                                            "span",
                                            {
                                                style: {
                                                    color: "#ff0000"
                                                }
                                            },
                                            "单价"
                                        );
                                    }
                                }, {
                                    label: "金额",
                                    prop: "amount",
                                    minWidth: 100,
                                    align: 'right',
                                    textColor: "#ff0000",
                                    renderHeader: h => {
                                        return h(
                                            "span",
                                            {
                                                style: {
                                                    color: "#ff0000"
                                                }
                                            },
                                            "金额"
                                        );
                                    }
                                }, {
                                    label: "税额",
                                    prop: "tax",
                                    minWidth: 100,
                                    align: 'right',
                                    textColor: "#ff0000",
                                    renderHeader: h => {
                                        return h(
                                            "span",
                                            {
                                                style: {
                                                    color: "#ff0000"
                                                }
                                            },
                                            "税额"
                                        );
                                    }
                                }, {
                                    label: "含税单价",
                                    prop: "taxPrice",
                                    minWidth: 100,
                                    align: 'right',
                                    textColor: "#ff0000",
                                    renderHeader: h => {
                                        return h(
                                            "span",
                                            {
                                                style: {
                                                    color: "#ff0000"
                                                }
                                            },
                                            "含税单价"
                                        );
                                    }
                                }, {
                                    label: "价税合计",
                                    prop: "taxAmount",
                                    minWidth: 100,
                                    align: 'right',
                                    textColor: "#ff0000",
                                    renderHeader: h => {
                                        return h(
                                            "span",
                                            {
                                                style: {
                                                    color: "#ff0000"
                                                }
                                            },
                                            "价税合计"
                                        );
                                    }
                                },
                            ];
                        }
                        this.isShow = true;
                    })
                }
                this.onLoad(this.page);
            },
            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.option, column.property);
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            rowClick(row, event, column) {
                this.$refs.crud.toggleSelection([row]);
            },
            onLoad(page, params = {}) {
                this.loading = true;
                let queryObj;
                let select;
                let selectType = this.selectType != undefined ? this.selectType : 1;
                if (this.typeName == 'quotationType') {
                    if(this.orderVisible !== undefined && this.isDetailed){
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: 0,
                            customerId: this.operationType,
                            warehouseId:this.code
                        });
                        select = selectAll;
                    }else{
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: this.selectType,
                            customerId: this.operationType,
                            warehouseId:this.code
                        });
                        select = quotationType;
                    }


                }
                if (this.typeName == 'projectType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,type: 3});
                    select = projectType;
                }
                if (this.typeName == 'bankType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,status: 0});
                    select = bankType;
                }
                if (this.typeName == 'collectType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,customerName:this.customerName});
                    select = collectType;
                }
                if (this.typeName == 'queryStockWarningType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,});
                    select = queryStockWarningType;
                }
                if (this.typeName == 'queryType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = queryType;
                }
                if (this.typeName == 'otherType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = otherType;
                }
                if (this.typeName == 'productType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = productType;
                }
                if (this.typeName == 'stockType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        type: this.selectType
                    });
                    select = stockType;
                }
                if (this.typeName == 'stockByWarehouseIdType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = stockByWarehouseIdType;
                }
                if (this.typeName == 'allocationStockOutType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code,
                        positionId: this.positionOutId
                    });
                    select = allocationStockOutType;
                }
                if (this.typeName == 'capitalAccountType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = capitalAccountType;
                }
                if (this.typeName == 'subjectType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = subjectType;
                }
                if (this.typeName == 'bankAccountType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = bankAccountType;
                }
                if (this.typeName == 'sendType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = sendType;
                }
                if (this.typeName == 'taxCodType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize});
                    select = taxCodType;
                }
                if (this.typeName == 'customersOrderType') {
                    if (this.config) {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: selectType,
                            operationType: this.operationType,
                            config: this.config
                        });
                    } else {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: selectType,
                            operationType: this.operationType
                        });
                    }
                    select = customersOrderType;
                }
                if (this.typeName == 'ordersTypes') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = ordersTypes;
                }
                if (this.typeName == 'customerType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = customerType;
                }
                if (this.typeName == 'userType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        status: 0,
                    });
                    select = userType;
                }
                if (this.typeName == 'userTypes') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: !this.isEmpty(selectType) ? selectType : 4
                    }, this.searchObj);
                    select = userTypes;
                }
                if (this.typeName == 'sourceType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = sourceType;
                }
                if (this.typeName == 'commodityType') {
                    if (this.itemVisible != undefined && !this.itemVisible) {
                        if (this.isDetailed) {
                            queryObj = Object.assign(params, this.query, {
                                page: page.currentPage,
                                limit: page.pageSize,
                                discountLevel: this.discountLevel,
                                warehouseId:this.code
                            });
                            select = feeType;
                        } else {
                            queryObj = Object.assign(params, this.query, {
                                page: page.currentPage,
                                limit: page.pageSize,
                                selectType: selectType,
                                discountLevel: this.discountLevel,
                                warehouseId:this.code
                            });
                            select = commodityType;
                        }

                    } else {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: selectType,
                            warehouseId: this.code,
                            discountLevel: this.discountLevel
                        });
                        select = commodityType;
                    }
                }
                if (this.typeName == 'relationType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType,
                        operationType: this.operationType
                    });
                    select = relationType;
                }
                if (this.typeName == 'workerType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = workerType;
                }
                if(this.typeName == 'skuType'){
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,warehouseId:this.warehouseId,skuNo: this.skuNo });
                    select = skuType;
                }
                if (this.typeName == 'dispatchersType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        id: this.id,
                        selectType: selectType
                    });
                    select = dispatchersType;
                }
                if (this.typeName == 'manufactureType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = manufactureType;
                }
                if (this.typeName == 'manufacturesType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = manufacturesType;
                }
                if (this.typeName == 'manufacturessType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = manufacturessType;
                }
                if (this.typeName == 'processesType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        craftId: this.craftId
                    });
                    select = processesType;
                }
                if (this.typeName == 'technologyType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = technologyType;
                }

                if (this.typeName == 'customerssOrderType') {
                    if (this.code != undefined) {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            warehouseId: this.code,
                            selectType: selectType
                        });
                    }
                    select = customerssOrderType;
                }
                if (this.typeName == 'customerOrderType') {
                    if (this.code != undefined) {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            customerCode: this.code,
                            selectType: selectType
                        });
                    } else {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: selectType
                        });
                    }
                    select = customerOrderType;
                }
                if (this.typeName == 'customerOrderTypess') {
                    if (this.code != undefined) {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            customerCode: this.code,
                            selectType: selectType
                        });
                    } else {
                        queryObj = Object.assign(params, this.query, {
                            page: page.currentPage,
                            limit: page.pageSize,
                            selectType: selectType
                        });
                    }
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code,
                        selectType: selectType,
                    });
                    select = this.outType==1|| this.outType=='1' ?middleType:customerOrderType;
                }
                if (this.typeName == 'customerOrderTypes') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code,
                        selectType: selectType,

                    });
                    select = customerOrderType;
                }
                if (this.typeName == 'warehouseType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,});
                    select = warehouseType;
                }
                if (this.typeName == 'purchaseType') {
                    queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,});
                    select = purchaseType;
                }
                if (this.typeName == 'applyType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = applyType;
                }
                if (this.typeName == 'invoiceType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: this.selectType,
                        operationType: this.operationType,
                    });
                    select = purchasesType;
                }
                if (this.typeName == 'invoiceTypes') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: this.selectType,
                        supplierId: this.code,
                    });
                    select = invoiceType;
                }
                if (this.typeName == 'purchasesTypes') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType,
                        supplierId: this.code,
                    });
                    select = purchasesTypes;
                }
                if (this.typeName == 'purchasesType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType,
                        supplierId: this.code
                    });
                    select = purchasesType;
                }
                if (this.typeName == 'priceType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = priceType;
                }
                if (this.typeName == 'positionType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = positionType;
                }
                if (this.typeName == 'relationsType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = relationsType;
                }
                if (this.typeName == 'relatioType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = relatioType;
                }
                if (this.typeName == 'relationssType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = relationssType;
                }
                if (this.typeName == 'slectItemBillByPageSummaryType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        warehouseId: this.code
                    });
                    select = slectItemBillByPageSummaryType;
                }
                if (this.typeName == 'materialType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = materialType;
                }
                if (this.typeName == 'ordersType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        supplierId: this.code,
                        selectType: selectType
                    });
                    select = ordersType;
                }
                if (this.typeName == 'salesType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = salesType;
                }
                if (this.typeName == 'sellType') {
                    queryObj = Object.assign(params, this.query, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: selectType
                    });
                    select = sellType;
                }
                queryObj = JSON.parse(JSON.stringify(queryObj));
                if (queryObj.contractDate && queryObj.contractDate !== undefined && queryObj.contractDate.length > 0) {
                    queryObj.startContractDate = queryObj.contractDate[0] + ' 00:00:00';
                    queryObj.endContractDate = queryObj.contractDate[1] + ' 23:59:59';
                    delete queryObj.contractDate;
                }
                if (queryObj.effectiveDate && queryObj.effectiveDate !== undefined && queryObj.effectiveDate.length > 0) {
                    queryObj.startEffectiveDate = queryObj.effectiveDate[0] + ' 00:00:00';
                    queryObj.endEffectiveDate = queryObj.effectiveDate[1] + ' 23:59:59';
                    delete queryObj.effectiveDate;
                }
                if (queryObj.disabledDate && queryObj.disabledDate !== undefined && queryObj.disabledDate.length > 0) {
                    queryObj.startDisabledDate = queryObj.disabledDate[0] + ' 00:00:00';
                    queryObj.startDisabledDate = queryObj.disabledDate[1] + ' 23:59:59';
                    delete queryObj.disabledDate;
                }
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startBillDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i in data.records) {
                        data.records[i].goodsName = data.records[i].skuName || data.records[i].goodsName;
                        data.records[i].skuName = data.records[i].skuName || data.records[i].goodsName;
                        if (this.typeName == 'relationssType' || this.typeName == 'relationsType') {
                            data.records[i].qhqty = data.records[i].qty - data.records[i].stockQty;
                        }
                        if (this.typeName == 'customerOrderType') {
                            data.records[i].qhqty = data.records[i].qty - data.records[i].stockQty;
                        }
                        if (this.typeName == 'slectItemBillByPageSummaryType') {
                            data.records[i].qhqty = data.records[i].qty - data.records[i].branchQty;
                        }
                        if (this.typeName == 'customerOrderTypess') {
                         if(this.outType==1||this.outType== '1'){
                             data.records[i].billNo =  data.records[i].salesOrderBillNo
                         }
                        }
                        if (this.typeName == 'collectType') {
                                data.records[i].address =  data.records[i].province +data.records[i].city+data.records[i].region+data.records[i].detailAddress
                        }
                        if (data.records[i].mainDTO) {
                            data.records[i].releaseQty = data.records[i].mainDTO.releaseQty;
                            data.records[i].customerCode = data.records[i].mainDTO.customerCode;
                            data.records[i].customerName = data.records[i].mainDTO.customerName;
                            data.records[i].storageStatus = data.records[i].mainDTO.storageStatus;
                            data.records[i].salerName = data.records[i].mainDTO.salerName;
                            data.records[i].salerCode = data.records[i].mainDTO.salerCode;
                            data.records[i].taxBillAmount = data.records[i].mainDTO.taxBillAmount;
                            data.records[i].receiptStatus = data.records[i].mainDTO.receiptStatus;
                            data.records[i].customerName = data.records[i].mainDTO.customerName;
                            data.records[i].contractName = data.records[i].mainDTO.contractName;
                            data.records[i].purchaserName = data.records[i].mainDTO.purchaserName;
                            data.records[i].purchaserCode = data.records[i].mainDTO.purchaserCode;
                            data.records[i].supplierCode = data.records[i].mainDTO.supplierCode;
                            data.records[i].supplierName = data.records[i].mainDTO.supplierName;
                            if(!data.records[i].warehouseName){
                                data.records[i].warehouseName = this.typeName == 'customerOrderTypess' && (this.outType == '0' || this.outType == 0) ? data.records[i].warehouseName : data.records[i].mainDTO.warehouseName;
                            }
                            data.records[i].billAmount = data.records[i].mainDTO.billAmount;
                            data.records[i].billNo = data.records[i].mainDTO.billNo || data.records[i].billNo;
                            data.records[i].salesCode = data.records[i].mainDTO.salesCode;
                            data.records[i].salesName = data.records[i].mainDTO.salesName;
                            data.records[i].salesId = data.records[i].mainDTO.salesId;
                            data.records[i].billDate = data.records[i].mainDTO.billDate;
                            data.records[i].billNo = data.records[i].mainDTO.billNo;
                            data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                            data.records[i].departName = data.records[i].mainDTO.departName;
                            data.records[i].purchaserCode = data.records[i].mainDTO.purchaserCode;
                            data.records[i].purchaserId = data.records[i].mainDTO.purchaserId;
                            data.records[i].purchaserName = data.records[i].mainDTO.purchaserName;
                        }
                        if (data.records[i].mainItemDTO) {
                            data.records[i].projectBillNo = data.records[i].mainItemDTO.projectBillNo;
                        }
                    }
                    this.data = data.records;
                    this.loading = false;
                    this.selectionClear();
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleClose() {
                this.$emit('handleClose');
            },
            handleSubmit() {
                if (this.isSingle) {
                    if (this.selectionList.length > 1) {
                        this.vueMessage('warning', '只能选择一条数据');
                        return;
                    }
                } else {
                    if(this.typeName == 'customerOrderTypess' && (this.outType == '0' || this.outType == 0)){
                        for (let i in this.selectionList) {
                                if (this.selectionList[0].warehouseId != this.selectionList[i].warehouseId) {
                                    this.$message.error('只支持同一仓库内进行关联创建，请重新选择');
                                    return;
                                }
                        }
                    }
                    if (this.typeName == 'manufacturessOption') {
                        for (let i in this.selectionList) {
                            if (this.selectionList[0].mainItemDTO && this.selectionList[0].mainItemDTO.projectBillNo) {
                                if (this.selectionList[0].mainItemDTO.projectBillNo != this.selectionList[i].mainItemDTO.projectBillNo) {
                                    this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                                    return;
                                }
                            }
                        }
                    }
                    if (this.typeName == 'customersOrderType') {
                        for (let i in this.selectionList) {
                            if (this.selectionList[0].mainDTO && this.selectionList[0].mainDTO.customerId) {
                                if (this.selectionList[0].mainDTO.customerId != this.selectionList[i].mainDTO.customerId) {
                                    this.$message.error('只支持同一客户内进行关联创建，请重新选择');
                                    return;
                                }
                            }
                        }
                    }
                    if (this.typeName == 'relationType' || this.typeName == 'salesType' || this.typeName == 'customerOrderTypess') {
                        for (let i in this.selectionList) {
                            if (this.selectionList[0].mainDTO && this.selectionList[0].mainDTO.billNo) {
                                if (this.selectionList[0].mainDTO.billNo != this.selectionList[i].mainDTO.billNo) {
                                    this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                                    return;
                                }
                            }
                        }
                    }
                    if(this.typeName == 'applyType'){
                        let sumData = [];
                        for (let i in this.selectionList) {
                            if(this.selectionList[i].sourceBillId){
                                sumData.push(this.selectionList[i].sourceBillId);
                            }

                        }
                        let sel =this.isRepeat(sumData);
                        if(sel){
                            this.$message.error('只支持不同单据内进行关联创建，请重新选择');
                            return;
                        }

                    }
                    if (this.typeName == 'quotationType' || this.typeName == 'ordersTypes' || this.typeName == 'customerssOrderType' || this.typeName == 'slectItemBillByPageSummaryType' || this.typeName == 'relationssType' || this.typeName == 'sourceType' || this.typeName == 'customerOrderType' || this.typeName == 'sourceBillNo' || this.typeName == 'purchasesType') {
                        for (let i in this.selectionList) {
                            if(this.typeName == 'quotationType'){
                                this.selectionList[i].isDetailed = this.isDetailed;
                            }
                            if (this.selectionList[0].billNo != this.selectionList[i].billNo) {
                                this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                                return;

                            }

                            if (this.selectionList[0].mainDTO && this.selectionList[0].mainDTO.billNo) {
                                if (this.selectionList[0].mainDTO.billNo != this.selectionList[i].mainDTO.billNo) {
                                    this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                                    return;
                                }
                            }

                        }
                    }
                }
                this.$emit('handleSubmit', this.selectionList);
            },
            isRepeat(arr) {
                var hash = {};
                for(var i in arr) {
                    if(hash[arr[i]]) {
                        return true;
                    }
                    // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
                    hash[arr[i]] = true;
                }
                return false;
            }
        }
    };
</script>

<style>
</style>
