<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
    <basic-container>
        <el-form ref="form" :model="forms" label-width="120px">
        <div class="addedServices">
            <div :class="activeName == 'first'? 'first active':'second'" @click="activeName = 'first'">
                <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
                    <span>短信设置提醒</span>
                    <el-tooltip class="item" effect="dark" content="选择后，涉及到该业务会给客户发送通知" placement="top-start">
                        <div class="xianji"></div>
                    </el-tooltip>
                </div>
                <div v-if="activeName == 'first'"  class="activeDiv"></div>
            </div>
            <!--<div :class="activeName == 'second'? 'second active':'second'" @click="activeName = 'second'">-->
                <!--<div>发送设置</div>-->
                <!--<div v-if="activeName == 'second'" class="activeDiv"></div>-->
            <!--</div>-->
        </div>
        <!--<div v-if="activeName == 'first'" class="jiaoywl">-->
            <!--<div class="form_title">系统消息</div>-->
            <!--<el-form-item class="config_titles">-->
                <!--<el-checkbox-group v-model="forms.checkLists">-->
                    <!--<el-checkbox label="注册验证码" >注册验证码</el-checkbox>-->
                    <!--<el-checkbox label="忘记密码" >忘记密码</el-checkbox>-->
                    <!--<el-checkbox label="换绑手机号" >换绑手机号</el-checkbox>-->
                    <!--<el-checkbox label="支付成功" >支付成功</el-checkbox>-->
                    <!--<el-checkbox label="余额充值" >余额充值</el-checkbox>-->
                <!--</el-checkbox-group>-->
            <!--</el-form-item>-->
        <!--</div>-->
        <div  v-if="activeName == 'first'" class="jiaoywl">
            <div class="form_title">
                交易物流
            </div>
            <el-form-item class="config_titles">
                <el-checkbox-group v-model="forms.checkList">
                    <el-checkbox label="销售出库">销售出库</el-checkbox>
                    <el-checkbox label="销售收款">销售收款</el-checkbox>
                    <el-checkbox label="销售退款">销售退款</el-checkbox>
                    <el-checkbox label="销售发票">销售发票</el-checkbox>
                    <el-checkbox label="收票预警">收票预警</el-checkbox>
                    <el-checkbox label="开票预警">开票预警</el-checkbox>
                    <el-checkbox label="库存预警">库存预警</el-checkbox>
                    <el-checkbox label="采购入库">采购入库</el-checkbox>
                    <!--<el-tooltip class="item" effect="dark" content="订单出库商品根据入库批次，先入库的优先出库" placement="top-start">-->
                        <!--<div class="xianji"></div>-->
                    <!--</el-tooltip>-->
                </el-checkbox-group>
            </el-form-item>
        </div>
        <el-button  v-if="activeName == 'first'" type="primary" style="margin-left: 100px;" @click="messBtn">保存设置</el-button>
        <div  v-if="activeName == 'second'">
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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot-scope="scope" slot="picUrl">
                        <div>
                            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                        </div>
                    </template>
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="isSwitch" slot-scope="scope" >
                        <el-switch v-model="scope.row.isSwitch" active-color="#C0CCDA" inactive-color="#188AE2"
                                   @change="handleSwitchChange($event,scope.row,scope.$index)">
                        </el-switch>
                    </template>
                </avue-crud>
            </div>
        </div>
        </el-form>
    </basic-container>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="35%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="this.budgetForm.id ? '修改发送任务':'新增发送任务'" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
                <template slot-scope="scope" slot="priceStrategy">
                    <div style="margin-left: 6px;">
                        <el-radio v-model="budgetForm.priceStrategy" label="0" @change="priceStrategyBtn(false)">全部人员</el-radio>
                        <el-radio v-model="budgetForm.priceStrategy" label="1" @change="priceStrategyBtn(true)">指定人员</el-radio>
                    </div>

                </template>
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
    </list-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import {queryAmount, queryRank} from "@/api/user";
    import {messageSetting,messageSettingList} from '@/api/erp/manager/config/index'
    export default {
        name: "addedServices",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                budgetForm:{},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth: 82,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "选择业务",
                            prop: "name",
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入业务",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "选择模板",
                            prop: "customerName",
                            span: 24,
                            type: 'text',
                            dicData: [],
                            suffixIcon: 'el-icon-search',
                            placeholder: '请选择模板',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择模板",
                                trigger: "change"
                            }],
                            click: () => {
                                if (this.type == 'view') {
                                    return
                                }
                            }
                        },
                        {
                            label: "发送对象",
                            prop: "priceStrategy",
                            span: 24,
                            formslot: true,
                        },
                        {
                            label: "选择模板",
                            prop: "sort",
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入模板",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            span: 24
                        },
                    ]
                },
                visible: false,
                invisible:false,
                budgetVisible: false,
                isShow: true,
                searchDisable: false,
                form: {
                    type: 'customer_type',
                    name: undefined,
                    status: '0'
                },
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
                    editBtn: true,
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
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index:true,
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "taxPrice",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "业务名称",
                        prop: "code",
                        minWidth: 120,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "短信模板",
                        prop: "name",
                        minWidth: 120,
                        overHidden:true,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        width: 130,
                        align: 'left',
                        search: true,
                        sortable: true,
                        overHidden:true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 80,
                        overHidden:true,
                        slot:true,
                        align: 'center'

                    },
                ],
                activeName: 'first',
                forms:{
                    checkList:[],
                    checkLists: [],
                },
            };
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        created() {
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        watch: {},
        methods: {
            messBtn(){
                let list = []
                if(this.forms.checkLists.length > 0){
                    list.push( {
                        type: 1,
                        names: this.forms.checkLists
                    })
                }
                if(this.forms.checkList.length > 0){
                    list.push( {
                        type: 0,
                        names: this.forms.checkList
                    })
                }
                messageSetting(list).then((res) => {
                    if (res.status == 200) {
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
            },
            priceStrategyBtn(type){
                if(!type){
                    this.budgetForm.discountLevel == ''
                }
                this.insertBudget.column[3].display = type;
            },
            handleBudgetClose(){
                this.budgetVisible = false;
            },
            budgetBtn(type) {
                if(this.budgetForm.priceStrategy == '1'){
                    if(this.budgetForm.discountLevel == undefined || this.budgetForm.discountLevel == ''){
                        this.vueMessage('warning','请选择折扣级别!');
                        return
                    }
                }
                this.$refs['budgetForm'].validate((valid) => {
                    if (valid) {
                        if (type) {
                            this.invisible = true;
                        } else {
                            this.visible = true;
                        }
                        let select = this.budgetForm.id ? putObj : addObj;
                        this.budgetForm.projectBillId = this.id;
                        select(this.budgetForm).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });

                                this.$refs.budgetForm ? this.$refs.budgetForm.resetForm() : '';
                                this.$nextTick(() => {
                                    this.$refs.budgetForm ? this.$refs.budgetForm.clearValidate() : '';
                                })
                                this.budgetForm = {};
                                this.vueSet(this, 'budgetForm', {});
                                this.getList(this.page);
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        }).catch(() => {
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        })
                    }
                })

            },
            handleSwitchChange(val, row, index) {
                if (val) {
                    row.status = '1';
                } else {
                    row.status = '0';
                }
                this.form = row;
                this.form.type = 'customer_type';
                putObj(this.form).then(() => {
                    this.getList(this.page);
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                });
            },
            handleAdd() {
                this.budgetForm   = {
                    priceStrategy:'0'
                };
                this.insertBudget.column[3].display =false;
                this.budgetVisible = true;
            },
            //获取数据
            getList(page, params = {}) {
                messageSettingList().then(res=>{
                    for(let i in res.data.data){
                        if(res.data.data[i].type =='1'){
                            this.forms.checkLists =res.data.data[i].names;
                        }
                        if(res.data.data[i].type =='0'){
                            this.forms.checkList = res.data.data[i].names
                        }
                    }
                })
                // this.loading = true;
                // let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                // queryObj = JSON.parse(JSON.stringify(queryObj));
                // let select;
                // select = selectPage;
                // select(queryObj).then(res => {
                //     const data = res.data.data;
                //     if (data.records) {
                //         for (var i in data.records) {
                //             data.records[i].isSwitch = data.records[i].status == '0' ? false : true;
                //         }
                //     }
                //     this.page.total = data.total;
                //     this.list = data.records;
                //     this.loading = false;
                //     this.searchDisable = false;
                //     this.handleSelectionClear();
                // }).catch(() => {
                //     this.loading = false;
                //     this.searchDisable = false;
                // });
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
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
                const id = row.id;
            },
            //编辑
            handleEdit(type) {
                const text = type == 'view' ? '查看' : '编辑';
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要' + text + '的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能' + text + '一个条目');
                    return false;
                }
                this.budgetForm   = this.selectedRows[0];
                this.budgetVisible = true;
            },
            //打印
            handlePrint() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
            },
            //导出
            handleExport() {
                this.$refs.crud.rowExcel();
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delObj(ids).then((res) => {
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
        }
    };
</script>


<style lang="scss" scoped>
    .xianji {
        width: 14px;
        height: 14px;
        background: url("http://hejigy.com.cn/questionMark.png") 100% 100% no-repeat;
        margin-right: 0px;
        margin-left: 6px;
    }

    .xianji:hover {
        width: 14px;
        height: 14px;
        background: url("http://hejigy.com.cn/questionMarks.png") 100% 100% no-repeat;
    }
    .addedServices {
        margin-bottom: 30px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #F0F0F0;
        position: relative;
        .first,.second {
            font-size: 16px;
            color: #9A9A9A;
            position: relative;
            height: 50px;
            line-height: 50px;
            margin-right: 50px;
            div {
                cursor: pointer;
            }
            .activeDiv {
                position: absolute;
                bottom: 0px;
                width: 100%;
                height: 2px;
                background: #3E90FE;
            }
        }
        div.active {
            font-size: 16px;
            color: #444444;
        }
    }
    .jiaoywl{
        border: 1px solid #F0F0F0;
        height:auto;
        padding: 20px 0px;
        margin-bottom: 30px;
        .form_title {
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-weight: 600;
            padding-left: 20px;
            margin-top: 15px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

        }
    }
</style>