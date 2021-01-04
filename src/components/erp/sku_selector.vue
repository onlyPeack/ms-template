<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose" :title="title" append-to-body class="public-dialog">
        <div>
            <basic-container>
                <div class="avue-crud-container" v-if="isShow">
                    <avue-crud ref="crud"
                               v-if="isShow"
                               :page="page"
                               :data="list"
                               :table-loading="loading"
                               :option="tableOption"
                               @refresh-change="refreshChange"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               @selection-change="handleSelectionChange"
                               @search-change="handleSearchChange"
                               @search-reset="handleSearchReset"
                               @sort-change="handleSortChange"
                               @row-click="handleRowClick"
                               @on-load="onLoad">
                        <!--自定义按钮-->
                        <template slot="menuRight">
                            <!--<el-switch style="margin-bottom: 10px;" v-model="isDetailed" active-text="收货通知单" inactive-text="采购订单"-->
                            <!--@change="handleSwitchChange"></el-switch>-->
                        </template>
                        <template slot-scope="scope" slot="sum">
                            <div>
                                <el-input v-model="scope.row.sum" @blur="sumbBtn(scope.row.qty,scope.row.lockedQty,scope.row.$index)" placeholder="请输入出库数量"></el-input>
                            </div>
                        </template>
                    </avue-crud>
                </div>
            </basic-container>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {pageBySkuNoAndWarehouseId as skuType} from '@/api/erp/wms/stock_query/index';
    export default {
        props: ['dialogVisible', 'isSingle', 'title','typeName','warehouseId','skuNo','res','sourceBillId'],
        data() {
            return {
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
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                listQuery: {},
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                tableOption: {
                    height: '300',
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "taxPrice",
                            type: "sum"
                        },
                    ],
                    column: [
                        {
                            label: "仓位",
                            prop: "positionName",
                            minWidth: 120,
                            align: 'left',
                            textColor: "#ff0000",
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
                            label: "批次号",
                            prop: "batchNo",
                            minWidth: 120,
                            align: 'left',
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            minWidth: 120,
                            align: 'left',
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            minWidth: 120,
                            align: 'left',
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            minWidth: 120,
                            align: 'left',
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 120,
                            align: 'left',
                        },
                        {
                            label: "出库数量",
                            prop: "sum",
                            minWidth: 140,
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
                                    "出库数量"
                                );
                            }
                        },
                        {
                            label: "库存数量",
                            prop: "qty",
                            minWidth: 120,
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
                                    "库存数量"
                                );
                            }
                        },
                        {
                            label: "锁定数量",
                            prop: "lockedQty",
                            minWidth: 120,
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
                                    "锁定数量"
                                );
                            }
                        },
                    ]
                },

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
        methods: {
            sumbBtn(val1,val2,index){
                let sum = val1 * 1 -val2 * 1;
                if (!isNaN(this.list[index].sum)){
                    if(this.list[index].sum > sum){
                        this.vueMessage('warning','当前值已超出剩余可用数量!');
                        this.list[index].sum = sum;
                        this.vueSet(this.list, index, this.list[index]);
                    }
                }else{
                    this.vueMessage('warning','请输入数字!');
                    this.list[index].sum = sum;
                    this.vueSet(this.list, index, this.list[index]);
                }

            },
            handleSearchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            handleSearchChange(params) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
            },
            handleSelectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            handleCurrentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            handleSizeChange(pageSize) {
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
                queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,warehouseId:this.warehouseId,skuNo: this.skuNo,sourceBillId:this.sourceBillId});
                select = skuType;
                this.list = [];
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for(let i in data.records){
                        data.records[i].sum = ''
                    }
                    this.list = data.records;
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
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
                }else{
                    if (this.selectionList.length <1) {
                        this.vueMessage('warning', '请勾选数据');
                        return;
                    }
                    let sum = 0
                    console.log(this.selectionList)
                    for(let i in this.selectionList){

                        if(this.selectionList[i].sum!=undefined && this.selectionList[i].sum!= ''){
                            sum = sum + this.selectionList[i].sum * 1
                        }
                    }
                    if(sum  == 0){
                        this.vueMessage('warning','请填写出库数量!');
                        return
                    }
                    if(sum > this.res){
                        this.vueMessage('warning','选中仓位累积总数量大于当前商品可出库最大值！当前可出库最大值为'+this.res);
                        return
                    }
                }
                let list = [];
                for(let i in this.selectionList){
                    if(this.selectionList[i].sum!=undefined && this.selectionList[i].sum!= ''){
                        list.push(this.selectionList[i])
                    }
                }
                this.$emit('handleSubmit', list);
            },
            //排序
            handleSortChange(obj) {
                let defaultSort = {};
                if (obj.order == 'ascending') {
                    defaultSort.ascs = this.convertToUnderline(obj.prop);
                } else if (obj.order = 'descending') {
                    defaultSort.descs = this.convertToUnderline(obj.prop);
                }
                this.defaultSort = defaultSort;
                this.getList(this.page);
            },
            //行点击事件
            handleRowClick(row, event, column) {
                this.$refs.crud.toggleSelection([row]);
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.onLoad(this.page, this.query);
                    this.isShow = true;
                });
            },
        }
    };
</script>

<style>
</style>
