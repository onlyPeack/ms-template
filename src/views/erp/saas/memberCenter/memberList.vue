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
                           :cell-style="handleCellStyle">
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </avue-crud>
            </div>
            <!-- 会员详情对话框 -->
            <el-dialog append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" draggable="true">
                <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="100px" size="small">
                    <el-form-item label="用户名:" prop="name">
                        <el-input v-model="addList.username" disabled style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="账户余额:" prop="balance">
                        <el-input v-model="addList.balance" disabled style="width: 300px;"></el-input><el-link @click="showRecharge=true" :underline="false" type="primary" style="margin-left: 15px;" v-if="isCompanyAdmin*1===1">去充值>></el-link>
                    </el-form-item>
                    <el-form-item label="手机号:" prop="mobile">
                        <el-input v-model="addList.mobile" disabled style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="会员等级:" prop="memberLevelId">
                        <el-select v-model="addList.memberLevelId" placeholder="请选择" style="width: 300px;">
                            <el-option  :value="1" label="普通会员"></el-option>
                            <el-option  :value="2" label="黄金会员"></el-option>
                            <el-option  :value="3" label="铂金会员"></el-option>
                            <el-option  :value="4" label="钻石会员"></el-option>
                            <el-option  :value="5" label="至尊会员"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格策略:" prop="memberPriceStatus">
                        <el-radio-group v-model="addList.memberPriceStatus" style="width: 300px;">
                            <el-radio :label=0>无</el-radio>
                            <el-radio :label=1>折扣级别</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="折扣级别:" v-if="addList.memberPriceStatus!==0">
                        <el-input disabled v-if="addList.memberLevelId===1" value="折扣1" style="width: 300px;"></el-input>
                        <el-input disabled v-else-if="addList.memberLevelId===2" value="折扣2" style="width: 300px;"></el-input>
                        <el-input disabled v-else-if="addList.memberLevelId===3" value="折扣3" style="width: 300px;"></el-input>
                        <el-input disabled v-else-if="addList.memberLevelId===4" value="折扣4" style="width: 300px;"></el-input>
                        <el-input disabled v-else-if="addList.memberLevelId===5" value="折扣5" style="width: 300px;"></el-input>
                    </el-form-item>

                    <el-form-item label="启用/禁用:" prop="status">
                        <el-radio-group v-model="addList.status">
                            <el-radio :label=1>启用</el-radio>
                            <el-radio :label=0>禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="支付状态:" prop="payStatus">
                        <el-radio-group v-model="addList.payStatus">
                            <el-radio :label=0>正常</el-radio>
                            <el-radio :label=1>冻结</el-radio>
                        </el-radio-group>
                    </el-form-item>
<!--                    <el-form-item label="审核状态:" prop="auditStatus">-->
<!--                        <el-select v-model="addList.auditStatus" placeholder="请选择" style="width: 300px;">-->
<!--                            <el-option  :value=1 label="审核不通过"></el-option>-->
<!--                            <el-option  :value=2 label="审核通过"></el-option>-->
<!--                            <el-option  :value=0 label="审核中"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item label="密码重置:">
                        <el-button type="primary" @click="resetPassword">重置密码</el-button>
                    </el-form-item>
                    <el-tabs type="border-card" style="width: 100%">
                        <el-tab-pane label="基本信息">
                            <el-form :inline="true" label-width="120px" label-position="right" v-model="addList" :rules="rules">
                                <el-form-item label="公司名称:" prop="companyName">
                                    <el-input v-model="addList.companyName" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="客户编号:" prop="customer">
                                    <el-input v-model="addList.customer" disabled style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="性别:" prop="gender">
                                    <el-select v-model="addList.gender" placeholder="请选择" style="width: 200px;">
                                        <el-option  :value="1" label="男"></el-option>
                                        <el-option  :value="2" label="女"></el-option>
                                        <el-option  :value="0" label="未知"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生日:" prop="birthday">
                                    <el-date-picker v-model="addList.birthday" type="date" placeholder="选择日期" style="width: 200px;"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="所在城市:" prop="city">
                                    <el-input v-model="addList.city" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="职业:">
                                    <el-input v-model="addList.job" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="个人签名:" prop="personalizedSignature">
                                    <el-input v-model="addList.personalizedSignature" style="width: 200px;"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="财务信息">
                            <el-form :inline="true" label-width="120px" label-position="right">
                                <el-form-item label="开户银行:">
                                    <el-input v-model="addList.umsMemberInfo.khBank" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="开票电话:">
                                    <el-input v-model="addList.umsMemberInfo.kpPhone" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="开户账号:">
                                    <el-input v-model="addList.umsMemberInfo.khAccount" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="收票人:">
                                    <el-input v-model="addList.umsMemberInfo.spPerson" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="客户税号:">
                                    <el-input v-model="addList.umsMemberInfo.khParagraph" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="收票地址:">
                                    <el-input v-model="addList.umsMemberInfo.spSite" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="开票地址:">
                                    <el-input v-model="addList.umsMemberInfo.kpSite" style="width: 200px;"></el-input>
                                </el-form-item>
                                <el-form-item label="收票电话:">
                                    <el-input v-model="addList.umsMemberInfo.spPhnoe" style="width: 200px;"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="企业资质" >
                            <el-upload
                                    class="avatar-uploader"
                                    :action='"/api/saas/storage/create?companyName="+addList.companyName'
                                    style="margin-left: 20px;"
                                    accept=".jpg,.jpeg,.png,.svg,.gif"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess">
                                <img v-if="addList.umsMemberInfo.qualification" :src="addList.umsMemberInfo.qualification" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <div class="el-upload__tip" slot="tip">
                                    <span>提供营业执照。税务登记证。组织机构代码（或三证合一的营业执照）</span><div></div>
                                    <span>只能上传jpg/png文件，且不超过10MB</span>
                                </div>
                            </el-upload>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="listSubmit" :loading="isLoading">确定</el-button>
                </div>
            </el-dialog>
            <!-- 会员详情对话框 -->
            <el-dialog append-to-body title="会员充值" :visible.sync="showRecharge" width="600px" draggable="true">
                <el-form :model="addList" size="medium" label-width="120px" label-position="right">
                    <el-form-item label="当前账户余额：">
                        <span>￥{{addList.balance}}</span>
                    </el-form-item>
                    <el-form-item label="充值金额：" prop="money">
                        <el-input v-model="addList.money" placeholder="请输入需要充值的金额" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="doRecharge">立即充值</el-button>
                    </el-form-item>
                    <el-form-item>
                        <div style="height: 120px;width: 100%;background-color: rgb(255,253,238);border: 1px solid rgb(237,211,141);text-indent: 25px">
                            <h3 style="margin-bottom: 5px;margin-top: 0;">温馨提示</h3>
                            <span style="margin-left: 25px;">1.充值金额为整数，且充值金额大于10元。</span><div></div>
                            <span style="margin-left: 25px">2.一旦充值成功后，只能去编辑修改账户余额，请谨慎操作。</span><div></div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </basic-container>
    </list-container>
</template>

<script>
    import {addBrand,deleteMultiBrand} from '@/api/erp/saas/brandManager';
    import {page as selectPage,updateMember,resetPassword,recharge} from '@/api/erp/saas/memberCenter/memberList';
    export default {
        props: ['timeStamp'],
        name: "member",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                textMap: {//新增&编辑对话框顶部标题字典
                    update: '编辑会员信息',
                    create: '新增会员'
                },
                showRecharge:false,
                dialogStatus: '',//当前表单为新建还是编辑
                rules: {//新增类目表单验证
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    mobile: [{required: true, message: '手机不能为空', trigger: 'blur'}],
                    job: [{required: true, message: '职业不能为空', trigger: 'blur'}],
                    companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}],
                    memberLevelId: [{required: true, message: '会员等级不能为空', trigger: 'blur'}],
                    memberPriceStatus: [{required: true, message: '价格策略不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否展示新增品牌对话框
                addList:{//新增品牌数据存储
                    umsMemberInfo:{}
                },
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {//顶部按钮显示隐藏
                    addBtn: false,
                    delBtn: false,
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
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    indexLabel:'序号',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,//是否显示顶部搜索栏
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    menuWidth:140,
                    delBtn:false,//行删除按钮是否显示
                    editBtn:false,//行编辑按钮是否显示
                    column: []
                },
                billColumn: [
                    {
                        label: "会员名",
                        prop: "username",
                        minWidth: 160,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "账户余额",
                        prop: "balance",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "电话号码",
                        prop: "mobile",
                        minWidth: 160,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "客户编号",
                        prop: "customer",
                        minWidth: 160,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "公司名称",
                        prop: "companyName",
                        minWidth: 160,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "来源",
                        prop: "resource",
                        minWidth: 120,
                        align: 'center',
                        search: true,
                        type:'select',
                        dicData: [
                            {
                                value:'网络搜索',
                                label:"网络搜索"
                            },
                            {
                                value:'朋友推荐',
                                label:"朋友推荐"
                            },
                            {
                                value:'其他',
                                label:"其他"
                            }
                        ],
                    },
                    // {
                    //     label: "所属业务员",
                    //     prop: "salesman",
                    //     minWidth: 120,
                    //     align: 'center',
                    //     search: true
                    // },
                    {
                        label: "注册时间",
                        prop: "createTime",
                        minWidth: 140,
                        align: 'center',
                    },
                    {
                        label: "启用/禁用",
                        prop: "status",
                        minWidth: 120,
                        align: 'center',
                        dicData: [
                            {
                                value:0,
                                label:"审核中"
                            },
                            {
                                value:1,
                                label:"启用"
                            }
                        ],
                    },
                    // {
                    //     label: "审核",
                    //     prop: "auditStatus",
                    //     minWidth: 120,
                    //     align: 'center',
                    //     dicData: [
                    //         {
                    //             value:0,
                    //             label:"审核中"
                    //         },
                    //         {
                    //             value:1,
                    //             label:"审核不通过"
                    //         },
                    //         {
                    //             value:2,
                    //             label:"审核通过"
                    //         }
                    //     ],
                    // },
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
            },
            isCompanyAdmin(){
                return this.$store.getters.userInfo.isCompanyAdmin
            }

        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
            //console.log(this.$store.getters.userInfo,'userinfo')
            //console.log(this.$store.getters.userInfo.no,'no')
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            /**
             * 顶部新增按钮事件
             */
            handleAdd() {
                this.dialogFormVisible=true
                this.dialogStatus='create'
                this.addList={
                    picUrl: ''
                }
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select= selectPage;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;

                }
                select(queryObj).then(res => {
                    const data = res.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    for (let i = 0; i <this.list.length ; i++) {
                        if(!this.list[i].umsMemberInfo){
                            this.list[i].umsMemberInfo={}
                        }
                    }
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                },error => {
                    this.showError('失败,'+error)
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
                const id = this.selectedRows[0].id;
                this.$router.push({
                    path: '/brandForm',
                    name: '品牌管理制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'brandForm'
                    }
                });
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
            /**
             *多选删除方法
             */
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
                        deleteMultiBrand(ids).then((res) => {
                            if (res.data.code === 200 || res.data.code === 2000) {
                                this.showSuccess('品牌删除成功')
                            } else {
                                this.showError('品牌删除失败'+res.data.msg||res.data.data)
                            }
                        }, error => this.showError('品牌删除失败'+error));
                    });
                }
            },
            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.$set(this.addList.umsMemberInfo,'qualification',res.data.url)
            },
            /**
             * 图片上传之前添加参数
             * @param res
             * @param done
             * @param loading
             */
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isJPG&&!isPNG) {
                    this.$message.error('上传头像图片只能是 JPG或png 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isPNG||isJPG && isLt2M;
            },
            /**
             * 添加&编辑会员信息
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.dialogStatus==='create'?addBrand:updateMember
                        let message=this.dialogStatus==='create'?"品牌新增":"会员信息编辑"
                        if(this.addList.password){
                            delete this.addList.password
                        }
                        if(this.addList.payPassword){
                            delete this.addList.payPassword
                        }

                        method(this.addList.id,this.addList).then(res => {
                            if (Number(res.data.code) === 2000) {
                                this.showSuccess(message+'成功')
                            } else {
                                this.showError(message+"失败"+res.data.msg||res.data.data)
                            }
                        }, error => this.showError(message+"失败"+error))
                    }
                })
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message){
                this.$message.success(message)
                this.init()
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message){
                this.$message.error(message)
                this.isLoading=false
                this.loading = false;
                this.searchDisable = false;
            },

            /**
             * 初始化方法
             */
            init(){
                //初始化所有状态
                this.dialogFormVisible = false
                this.showRecharge=false
                this.isLoading=false
                this.getList(this.page)
            },

            /**
             * 表格编辑按钮事件
             * index 当前按钮索引值
             * row 当前行中数据
             */
            handleUpdate(index,row){
                this.dialogFormVisible = true
                this.dialogStatus='update'
                this.addList=row
            },

            /**
             * 重置密码
             */
            resetPassword(){
                this.$confirm('此操作将会重置该会员的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetPassword({id:this.addList.id}).then(res => {
                        if (Number(res.data.code) === 2000) {
                            this.$message.success('密码重置成功')
                        } else {
                            this.showError("密码重置失败"+res.data.msg||res.data.data)
                        }
                    }, error => this.showError("密码重置失败"+error))
            })
            },

            doRecharge(){
                this.isLoading=true
                recharge(this.addList).then(res=>{
                    if(Number(res.data.code)===200||Number(res.data.code)===2000){
                        this.showSuccess('会员充值成功!')
                    }else{
                        this.showError('会员充值失败!'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('会员充值失败!'+error))
            }
        }
    }
</script>

<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
