<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container v-if="isShow">
            <avue-crud ref="crud"
                       v-if="isShow"
                       :data="list"
                       :page="page"
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
                       @row-click="handleRowClick" style="width: 99%;margin: 0% auto;"
                       @row-dblclick="handleRowDbClick">
                <template slot="menuLeft">
                    <button-bar type="lists"
                                ref="buttonBar"
                                :permission="permission"
                                objectKey="WLPZ"
                                :objectType="isDetailed ? 1 : 0"
                                :tableOption="tableOption"
                                :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                @handleAdd="handleAdd"
                                @handleEdit="handleEdit"
                                @handleDelete="handleRowDelete"
                                @handleSettingSubmit="handleSettingSubmit"></button-bar>
                </template>
                <template slot="template" slot-scope="scope" >
                    <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;font-size: 13px;">
                        <el-link class="link_under_line_font" :underline="false" :href="scope.row.template" target="_blank">预览</el-link>
                    </div>
                </template>
                <template slot="opt" slot-scope="scope" >
                    <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;font-size: 13px;">
                        <el-link :underline="false" class="link_under_line_font" v-if="scope.row.status == 1 || scope.row.status == '1'" @click="upadateBtn(scope.row,0)">停用</el-link>
                        <el-link :underline="false" class="link_under_line_font" v-else @click="upadateBtn(scope.row,1)">启用</el-link>
                        <el-button type="text" @click="upadateDataBtn(scope.row)">编辑</el-button>
                        <el-link class="link_under_line_font" :underline="false"  :href="scope.row.template" target="_blank" style="margin-left: 10px;">电子模板</el-link>
                        <el-button type="text" style="color: #FF5B52;" @click="batchDelBillBtn(scope.row)">删除</el-button>
                    </div>
                </template>
            </avue-crud>
        </basic-container>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="800px"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="budgetForm.id ? '修改物流网点':'新增物流网点'" append-to-body
                   class="public-dialog insertBudgetDialog ">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
                <template slot="expressName" slot-scope="scope">
                    <el-select v-model="budgetForm.expressName" placeholder="请选择快递公司名称"  @change="expressNameBtn">
                        <el-option
                                v-for="item in classificationOptions"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </template>
                <template slot="regionCodes" slot-scope="scope">
                    <el-cascader  :props="{ checkStrictly: true ,value:'title', label:'title'}" ref="tree_right"
                                  v-model="budgetForm.regionCodes"
                                  :options="optionsCodes"
                    ></el-cascader>
                </template>
                <template slot="template" slot-scope="scope">
                    <div class="logisticsPhoto">
                        <div class="insertLogisticsPhoto">
                            <el-link icon="el-icon-circle-plus-outline" :underline="false" style="color: #3E90FE;font-size: 14px;" @click="electronicVisibleBtn">添加模板</el-link>
                        </div>
                        <div class="insertLogisticsPhotos" v-if="budgetForm.template">
                            <div class="insertLogisticsPhotoC">
                                <el-image v-if="budgetForm.template"
                                          style="width: 150px; height: 200px"
                                          :src="budgetForm.template"
                                          fit="cover"></el-image>
                                <div  v-if="budgetForm.template" class="electronicDivImgCenter">
                                    <el-link :underline="false" @click="electronicVisibleBtn" icon="el-icon-s-tools" style="font-size: 14px;color: #FFFFFF;margin-bottom: 6px;">设置</el-link>
                                    <el-link :underline="false" @click="budgetForm.template = ''" icon="el-icon-delete" style="font-size: 14px;color: #FFFFFF;">删除</el-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
        <public-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                         :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                         @handleClose="handleClosePublic"
                         @handleSubmit="handleSubmitPublic"></public-selector>
        <el-dialog :visible.sync="electronicVisible" v-if="electronicVisible" width="800"
                   @close="handleElectronicClose"
                   :close-on-click-modal="false"
                   :before-close="handleElectronicClose" title="选择电子面单模板" append-to-body
                   class="public-dialog insertBudgetDialog ">
            <div class="electronicDiv">
                <div v-for="(item,index) in findBillList" :class="electronicImgIndex == index? 'electronicDivImg electronicDivImgs':'electronicDivImg'"  @click="electronicImgIndex = index">
                    <el-image v-if="item.url"
                            style="width: 150px; height: 200px"
                            :src="item.url"
                            fit="cover"></el-image>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleElectronicClose">取消</el-button>
                <el-button type="primary" @click="electronicImgBtn">保存</el-button>
            </div>
        </el-dialog>
    </list-container>
</template>
<script>
    let baseUrl = 'https://cli.avuejs.com/api/area'
    // import {selectLinkman} from "@/api/erp/customerManage/myCustomer";
    // import {selectIndustry,selectArea} from "@/api/erp/msCustomer";
    // import {memberOption} from '@/util/table';
    import {test,findBillById,selectArea,selectPage,findExpress,addBill,delObj,auditBill} from '@/api/erp/sales/bill/stock_logistics'
    import {warehouseOption} from '@/util/table';
    import {uploadPath} from '@/api/erp/goods/storage'
    export default {
        name: "stock_logistics",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'publicSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                electronicImgIndex:-1,
                electronicVisible: false,
                isSingle: true,
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                optionsCodes:[],
                uploadPath,
                classificationOptions:[],
                budgetForm:{},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth:110,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "仓库名称",
                            prop: "houseName",
                            span: 12,
                            type: 'text',
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择仓库名称',
                            rules: [{
                                required: true,
                                message: "请选择仓库",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择仓库';
                                this.typeName = 'warehouseType';
                                this.option = warehouseOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "快递公司",
                            prop: "expressName",
                            formslot: true,
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入快递公司",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "网点地址",
                            prop: "site",
                            span: 12,
                        },
                        {
                            label: "网点编码",
                            prop: "code",
                            span: 12,
                        },
                        {
                            label: "联系方式",
                            prop: "phone",
                            span: 12,
                        },
                        {
                            label: "月结账号",
                            prop: "number",
                            span: 12,
                        },
                        {
                            label: "寄件人",
                            prop: "linkPerson",
                            span: 12,
                        },
                        {
                            label: "寄件人电话",
                            prop: "linkPhone",
                            span: 12,
                        },
                        {
                            label: "寄件地区",
                            prop: "regionCodes",
                            formslot: true,
                            span: 12
                        },
                        {
                            label: "寄件地址",
                            prop: "linkAddress",
                            span: 12
                        },
                        {
                            label: "顾客编码",
                            prop: "outletsKey",
                            span: 12
                        },
                        {
                            label: "校验码",
                            prop: "outletsValue",
                            span: 12
                        },
                        {
                            label: "快递签名",
                            prop: "sgin",
                            span: 12
                        },
                        {
                            label: '设置电子模板',
                            prop: 'template',
                            span: 24,
                            formslot: true,

                        },
                    ]
                },
                visible: false,
                invisible:false,
                budgetVisible: false,
                imgUrl:'',
                permission: {
                    addBtn: true,
                    delBtn:false,
                    editBtn: false,
                    viewBtn: false,
                    exportBtn: false,
                    printBtn: false
                },
                isDetailed:false,
                value: [],
                listQuerys: {},
                isShow: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    simplePage: false,
                    height: 'auto',
                    calcHeight: 220,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchShow: false,
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "retailPrice",
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
                        label: "仓库",
                        prop: "houseName",
                        minWidth:120,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "快递公司",
                        prop: "expressName",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "网点编码",
                        prop: "code",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "月结账号",
                        prop: "number",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "顾客编码",
                        prop: "outletsKey",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "校验码",
                        prop: "outletsValue",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "快递签名",
                        prop: "sgin",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "电子模板",
                        prop: "template",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        slot: true,
                    },
                    {
                        label: "创建时间",
                        prop: "crtTime",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        sortable: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "操作员",
                        prop: "crtUserName",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 150,
                        overHidden:true,
                        align: 'left',
                        slot: true
                    },
                ],
                findBillList: []
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
        watch: {
        },
        created() {
            // test().then(res=>{
            //     console.log(res)
            //     this.imgUrl=res.data.data;
            // });    // test().then(res=>{
            //     console.log(res)
            //     this.imgUrl=res.data.data;
            // });
            const _this = this;
            this.tableOption.column = this.billColumn;
            findExpress().then(res=>{
                const data = res.data.data;
                this.classificationOptions = data || [];
                selectArea().then(val => {
                    this.optionsCodes = val.data.data;
                    this.getList(this.page);
                })
            })


        },
        updated() {
        },
        mounted(){
        },
        methods: {
            upadateBtn(item,sum){
                let data = JSON.parse(JSON.stringify(item));
                data.status =  sum;
                auditBill(data).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.getList(this.page);
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                }).catch(() => {
                })
            },
            batchDelBillBtn(item){
                delObj(item.id).then((res) => {
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
            },
            upadateDataBtn(item){
                this.electronicImgIndex = -1;
                this.budgetForm = JSON.parse(JSON.stringify(item));
                this.budgetForm.docking = Number(this.budgetForm.docking);
                this.budgetForm.regionCodes = [];
                if(this.budgetForm.province && this.budgetForm.province != ''){
                    this.budgetForm.regionCodes.push(this.budgetForm.province)
                }
                if(this.budgetForm.city && this.budgetForm.city != ''){
                    this.budgetForm.regionCodes.push(this.budgetForm.city)
                }
                if(this.budgetForm.county && this.budgetForm.county != ''){
                    this.budgetForm.regionCodes.push(this.budgetForm.county)
                }
                this.budgetVisible = true;
            },
            electronicImgBtn(){
              if(this.electronicImgIndex>-1){
                  this.electronicVisible = false;
                  this.budgetForm.template = this.findBillList[this.electronicImgIndex].url;
              }
            },
            electronicVisibleBtn(){
              if(this.budgetForm.expressName!=''){
                  findBillById(this.budgetForm.expressId).then(res=>{
                      console.log(res)
                      this.findBillList = res.data.data || [];
                      if(this.findBillList.length<1){
                          this.vueMessage('warning','该快递公司暂无电子模板');
                      }else{
                          this.electronicVisible = true;
                      }
                  })
              }else{
                  this.vueMessage('warning','请先选择快递公司');
              }
            },
            handleElectronicClose(){
                this.electronicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    // 仓库
                    if (this.typeName == 'warehouseType') {
                        //修改仓库时清空明细的值
                        this.budgetForm.houseName = list[0].name;
                        this.budgetForm.houseId = list[0].id;
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.positionIndex = undefined;
                this.publicVisible = false;
            },
            expressNameBtn(e){
                if(this.classificationOptions.length>0){
                    for(let i in this.classificationOptions){
                        if(this.classificationOptions[i].name == e){
                            this.budgetForm.expressCode = this.classificationOptions[i].code;
                            this.budgetForm.expressId= this.classificationOptions[i].id;
                        }
                    }
                }
            },
            handleBudgetClose(){
                this.budgetVisible = false;
            },
            budgetBtn(type) {
                this.$refs['budgetForm'].validate((valid) => {
                    if (valid) {
                        if (this.budgetForm.regionCodes.length > 0) {
                            if(this.budgetForm.regionCodes.length  == 1){
                                this.budgetForm.province = this.budgetForm.regionCodes[0];
                                this.budgetForm.city = '';
                                this.budgetForm.county = '';
                            }
                            if(this.budgetForm.regionCodes.length  == 2){
                                this.budgetForm.province = this.budgetForm.regionCodes[0];
                                this.budgetForm.city = this.budgetForm.regionCodes[1];
                                this.budgetForm.county = '';
                            }
                            if(this.budgetForm.regionCodes.length  == 3){
                                this.budgetForm.province = this.budgetForm.regionCodes[0];
                                this.budgetForm.city = this.budgetForm.regionCodes[1];
                                this.budgetForm.county = this.budgetForm.regionCodes[2];
                            }
                        }
                        if (type) {
                            this.invisible = true;
                        } else {
                            this.visible = true;
                        }
                        let select = this.budgetForm.id ? auditBill : addBill;
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
            handleAdd() {
                this.budgetForm = {};
                this.electronicImgIndex = -1;
                this.budgetVisible = true;
            },
            handleEdit(){

            },
            handleRowDelete(){

            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    this.billColumn = obj.column;
                    this.isShow = true;
                })
            },
            rest(){
                this.listQuerys = {};
                this.value = [];
                this.getList(this.page);
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery,this.listQuerys, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
                if(queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0){
                    queryObj.startDate = queryObj.crtTime[0]+ ' 00:00:00';
                    queryObj.endDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
                }

                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.list = data.records;
                    this.page.total = data.total;
                    this.loading = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
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
                // this.controlButtonShow(row, this);
                // this.$refs.crud.toggleSelection([row]);

            },
            //双击查看
            handleRowDbClick(row) {
            },
        }
    }
</script>
<style lang="scss" scoped>
    .electronicDiv{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex: 1;
        max-height: 500px;
        overflow-y: auto;
        .electronicDivImg{
            margin-right: 42px;
            margin-bottom: 29px;
            border: 1px solid #D9D9D9;
            position: relative;
            height: 200px;
        }
        .electronicDivImgs{
            border: 1px solid #3E90FE!important;
        }
        .electronicDivImg:nth-child(5n){
            margin-right: 0px;
        }
    }
    .link_under_line_font{
        font-size: 12px;
        margin-right: 10px;
        color: #409EFF;
    }
    .logisticsPhoto{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        .insertLogisticsPhoto{
            width: 150px;
            height: 200px;
            background: #F7FAFF;
            border: 1px solid #D9D9D9;
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 20px;

        }
        .insertLogisticsPhotoC{
            position: relative;
            width: 150px;
            height: 200px;
            background: #F7FAFF;
            border: 1px solid #D9D9D9;
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 20px;
            .electronicDivImgCenter{
                position: absolute;
                border-radius: 3px;
                top:0px;
                left: 0px;
                width: 150px;
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 3px;
                z-index: 999;
                visibility: hidden;
            }
        }
        .insertLogisticsPhotoC:hover{
            .electronicDivImgCenter{
                visibility: visible;
            }
        }
    }
</style>
