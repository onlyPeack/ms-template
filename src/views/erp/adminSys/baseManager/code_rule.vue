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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                    <button-bar type="list"
                                ref="buttonBar"
                                :permission="permission"
                                :tableOption="tableOption"
                                :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                objectKey="BMGZ"
                                :objectType="isDetailed ? 1 : 0"
                                @handleEdit="handleEdit"
                                @handleSettingSubmit="handleSettingSubmit"
                    ></button-bar>
                </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="30%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" :title="type == 'view'?'查看编码规则':'编辑编码规则'" append-to-body class="public-dialog">
            <avue-form :option="option" v-model="form"  ref="form" @submit="handleSubmit" :disabled="type == 'view' ?true:false" class="codeItem">
                <template slot-scope="scope" slot="codeMethod">
                    <div>
                        <el-select v-model="form.codeMethod" style="width: 100%;" @change="codeBlur(form.codeMethod)"
                                   :disabled="type=='view'?true:false">
                            <el-option v-for="item in codeOptions" :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template slot-scope="scope" slot="timeType">
                    <div>
                        <el-select v-model="form.timeType" style="width: 100%;"
                                   :disabled="type=='view' || form.codeMethod == '0'?true:false">
                            <el-option v-for="item in timeOptions" :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template slot-scope="scope" slot="length">
                    <div>
                        <el-input v-model="form.length" placeholder="请输入流水号长度"
                                  :disabled="type=='view' || form.codeMethod == '0'?true:false"></el-input>
                    </div>
                </template>
                <template slot-scope="scope" slot="start">
                    <div>
                        <el-input v-model="form.start" placeholder="请输入流水号起始"
                                  :disabled="type=='view'|| form.codeMethod == '0'?true:false"></el-input>
                    </div>
                </template>
            </avue-form>
        </el-dialog>
    </list-container>
</template>

<script>
    import {page as selectPageByItems,getObj,preview,putObj} from "@/api/erp/manager/config/configureCode";
    import {getObj as getSetting} from "@/api/erp/config/index";
    var  dataTime = new Date();
    export default {
        name: "code_rule",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['timeStamp'],
        data() {
            return {
                form:{},
                dialogSelectVisible: false,
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                timeOptions:[
                    {
                        value: 'yy',
                        label: '年('+dataTime.getFullYear().toString().substr(2,2)+ ')'
                    },
                    {
                        value: 'yyMM',
                        label: '年月('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                    },
                    {
                        value: 'yyMMdd',
                        label: '年月日('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                    },
                    {
                        value: 'yyyy',
                        label: '年('+dataTime.getFullYear()+ ')'
                    },
                    {
                        value: 'yyyyMM',
                        label: '年月('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                    },
                    {
                        value: 'yyyyMMdd',
                        label: '年月日('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                    },
                ],
                codeOptions: [
                    {
                        value: '0',
                        label: '系统默认编码'
                    },
                    {
                        value: '1',
                        label: '自定义编码'
                    },
                ],
                type: '',
                option: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    column: [
                        {
                            label: "编码方式",
                            prop: "codeMethod",
                            span: 24,
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请选择编码方式",
                                trigger: "change"
                            }],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                        },
                        {
                            label: "第一前缀",
                            prop: "key",
                            span: 24,
                            type: 'text',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                        },
                        {
                            label: "第二前缀",
                            prop: "timeType",
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请选择第二前缀",
                                trigger: "change"
                            }],
                            formslot: true,
                            clearable: false,
                        },
                        {
                            label: "流水号长度",
                            prop: "length",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入流水号长度",
                                trigger: "change"
                            }],
                            formslot: true,
                        },
                        {
                            label: "流水号起始",
                            prop: "start",
                            span: 24,
                            type: 'text',
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请输入流水号起始",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "单据号预览",
                            prop: "codePreview",
                            span: 24,
                            type: 'search',
                            readonly: true,
                            appendClick:()=>{
                                preview(this.form.key,this.form.timeType,this.form.length,this.form.start).then(s=>{
                                    this.form.codePreview = s.data.data;
                                })
                            }
                        },
                    ]
                },
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: false,
                    delBtn: false,
                    editBtn: true,
                    viewBtn: true,
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
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "amountFormer",
                            type: "sum"
                        },
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
                        label: "模块",
                        prop: "moduleType",
                        minWidth: 80,
                        overHidden:true,
                        sortable: true,
                        hide: true,
                        search: true,
                        type:'select',
                        dicData:[
                            {
                                value: 0,
                                label: '基础模块'
                            },
                            {
                                value: 1,
                                label: '采购模块'
                            },
                            {
                                value: 2,
                                label: '销售模块'
                            },
                            {
                                value: 3,
                                label: '库存模块'
                            },
                            {
                                value: 4,
                                label: '资金模块'
                            }
                        ],
                        align: 'left',
                    },
                    {
                        label: "模块名称",
                        prop: "moduleName",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "编码预览",
                        prop: "codePreview",
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "编码方式",
                        prop: "codeMethod",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        type:'select',
                        dicData:[
                            {
                                value: '0',
                                label: '系统默认编码'
                            },
                            {
                                value: '1',
                                label: '自定义编码'
                            },
                        ],
                    },
                    {
                        label: "第一前缀",
                        prop: "key",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "第二前缀",
                        prop: "timeType",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        type:'select',
                        dicData:[
                            {
                                value: 'yy',
                                label: '年('+dataTime.getFullYear().toString().substr(2,2)+ ')'
                            },
                            {
                                value: 'yyMM',
                                label: '年月('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                            },
                            {
                                value: 'yyMMdd',
                                label: '年月日('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                            },
                            {
                                value: 'yyyy',
                                label: '年('+dataTime.getFullYear()+ ')'
                            },
                            {
                                value: 'yyyyMM',
                                label: '年月('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                            },
                            {
                                value: 'yyyyMMdd',
                                label: '年月日('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                            },
                        ],
                    },
                    {
                        label: "流水号长度",
                        prop: "length",
                        minWidth: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "流水号起始",
                        prop: "start",
                        minWidth: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 160,
                        overHidden:true,
                        align: 'left',
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
            this.getConfigList();
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            codeBlur(val){
                if(val == '0'){
                    this.form.timeType = 'yyyyMMdd';
                    this.form.length = 5;
                    this.form.start = 1;
                    preview(this.form.key,this.form.timeType,this.form.length,this.form.start).then(s=>{
                        this.form.codePreview = s.data.data;
                    })
                }
            },
            handleSubmit(form, done) {
                putObj(this.form.id,this.form).then(res => {
                    done();
                    if (res.data && res.data.code == '2000') {
                        this.vueMessage('success', '编写成功!');
                        this.dialogSelectVisible = false;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    this.getList(this.page);
                }).catch(() => {
                    this.dialogSelectVisible = false;
                });

                done();
            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
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
            getConfigList() {
                this.setList(this, 'BMGZ');
            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    this.billColumn = obj.column;
                    this.isShow = true;
                })
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];

                    this.tableOption.showSummary = true;
                    this.tableOption.column = this.billColumn;

                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPageByItems;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    for (let i in data.records) {
                        data.records[i].paymentsMeans = parseInt(data.records[i].paymentsMeans);
                        if (data.records[i].mainDTO) {
                            data.records[i].paymentsMeans = Number(data.records[i].mainDTO.paymentsMeans);
                            data.records[i].receiveAccount = data.records[i].mainDTO.receiveAccount;
                            data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                            data.records[i].billDate = data.records[i].mainDTO.billDate;
                            data.records[i].billNo = data.records[i].mainDTO.billNo;
                            data.records[i].receiveMethod = data.records[i].mainDTO.receiveMethod;
                        }
                    }
                    this.page.total = data.total;
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
                this.type = type;
                if(type == 'view'){
                    this.option.submitBtn = false;
                }else{
                    this.option.submitBtn = true;
                }
                const id = this.selectedRows[0].id;
                getObj(id).then(res=>{
                    this.form  = res.data.data;
                    preview(this.form.key,this.form.timeType,this.form.length,this.form.start).then(s=>{
                        this.form.codePreview = s.data.data;
                    })
                })

                this.dialogSelectVisible = true;
            },
        }
    }
</script>

<style  lang="scss">
    .el-input.is-disabled .el-input__inner{
        background: #ffffff;
        color: #000000;
    }
    .codeItem .el-form .el-row .el-col .el-form-item .el-form-item__content .avue-form__menu .el-button{
        margin-left: -7.4rem;
    }
</style>
