<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
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
                           :summary-method="getSummaries"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                        ></button-bar>
                    </template>
                    <template slot="menuRight">
                        <div style="display: inline-block;width: 170px;">
                            <a href="/api/manager/stock-detail/exportStockFile" style="color: #409EFF;margin-right: 10px;">
                            <el-button type="text">
                                <img src="https://hejigy.com.cn/mobanxiaz.png" alt="" style="margin-right: 3px;"/>
                                下载导入模板
                            </el-button>
                            </a>
                            <el-upload class="upload" action="/api/manager/stock-detail/importBeginningStock"
                                       :before-upload="beforeUpload"
                                       :on-remove="handleRemove" :show-file-list="false"
                                       :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed"
                                       :file-list="fileList"
                                       style="display:inline;" :on-success="uploadCompleted" :headers="headers">
                                <el-button type="text" icon="el-icon-download">
                                    导入
                                </el-button>
                            </el-upload>
                        </div>

                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectBeginningStock, stockDetailDelete} from '@/api/erp/wms/stock_query/index'

    export default {
        name: "stock_initial_entry",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['timeStamp'],
        data() {
            return {
                headers: undefined,
                fileList: undefined,
                isShow: true,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    indexLabel: '序号',
                    index: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    searchShow: false,//首次加载是否显示搜索
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "lockedQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "vendibility",
                            type: "sum",
                            len: 0
                        }, {
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "allocationPrice",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "仓库名称",
                        prop: "warehouseName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "仓位名称",
                        prop: "positionName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "库存数量  ",
                        prop: "qty",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#ff0000"
                                    }
                                }, column.label+'   '),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '商品的账面库存',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },

                    },

                    {
                        label: "可售数量    ",
                        prop: "vendibility",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#ff0000"
                                    }
                                }, column.label),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '账面库存-（锁定库存+坏品库存）',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                    {
                        label: "面价   ",
                        prop: "retailPrice",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#ff0000"
                                    }
                                }, column.label),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '官方指导价即市面统一价格',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                    {
                        label: "成本价   ",
                        prop: "purchasePrice",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#ff0000"
                                    }
                                }, column.label),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '公司采购的进价',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                    {
                        label: "调拨价   ",
                        prop: "allocationPrice",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#ff0000"
                                    }
                                }, column.label),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '公司给到销售员进行商品销售的成本价即销售员利润=售价-调拨价，注：销售员独立考核时使用',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                ],
            }
        },
        computed: {
            ids() {
                let ids = [];
                this.selectedRows.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        created() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadCompleted(response, file, fileList) {
                this.getList(this.page);
                if (response.code == '2000') {
                    this.$notify({
                        title: '成功',
                        message: response.msg,
                        type: 'success',
                        duration: 2000
                    });

                } else {
                    this.$notify({
                        title: '失败',
                        message: response.msg,
                        type: 'warning',
                        duration: 2000
                    })
                }
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUpload(file) {
                const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isXLS) {
                    this.$message.error('只能上传xls/xlsx表格!');
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!');
                }
                return isXLS && isLt10M;
            },
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1 && this.selectedRows.length > 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                let flag = true;
                if (flag) {
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        stockDetailDelete(this.selectedRows[0].id).then((res) => {
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getList(this.page);

                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                        });
                    });
                }
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectBeginningStock;
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i in data.records) {
                        data.records[i].vendibility = Number(data.records[i].qty) - Number(data.records[i].lockedQty)
                    }
                    this.list = data.records;
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                    this.searchDisable = false;
                });
            },
            //刷新表格
            refreshChange() {
                this.getList(this.page, this.listQuery);
            },
            //当前页改变时
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList(this.page, this.listQuery);
            },
            //页面显示条数改变时
            handleSizeChange(val) {
                this.page.currentPage = 1;
                this.page.pageSize = val;
                this.getList(this.page, this.listQuery)
            },
            //多选框状态改变时
            handleSelectionChange(selection) {
                if (selection.length > 0) {
                    this.controlButtonShow(selection[selection.length - 1], this);
                }
                this.selectedRows = selection;
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            //搜索
            handleSearchChange(params) {
                if (this.searchDisable) {
                    return;
                }
                this.searchDisable = true;
                this.listQuery = params;
                this.page.currentPage = 1;
                this.getList(this.page, params);
            },
            //清空
            handleSearchReset() {
                this.listQuery = {};
                this.getList(this.page);
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
            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
                const id = row.id;
                // this.$router.push({
                //     path: '/purchase_stock_in_form',
                //     name: '采购入库单制单',
                //     query: {
                //         id: id,
                //         type: 'view'
                //     },
                //     meta: {
                //         i18n: 'purchase_stock_in_form'
                //     }
                // });
            },
            handleAdd() {
                this.handleBillAdd(this, {path: '/stock_initial_entry_form', name: '期初库存制单'});
            },
        }
    }
</script>

<style>
    .imgTabelItem {
        display: inline-block;
        width: 14px;
        height: 14px;
    }

    .tableItem {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 6px;
    }
</style>

