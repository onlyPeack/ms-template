<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
        <el-row>
            <el-col :span="24" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <el-form :inline="true" style="margin-top: 15px;">
                        <el-form-item label="产品名称:">
                            <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入查询的产品名称" v-model="listQuery.name"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌名称:">
                            <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入查询的品牌名称" v-model="listQuery.brandName"></el-input>
                        </el-form-item>
                        <el-form-item label="系列名称:">
                            <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入查询的系列名称" v-model="listQuery.seriesName"></el-input>
                        </el-form-item>
                        <el-form-item label="规格型号:">
                            <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入查询的规格型号" v-model="listQuery.specModel"></el-input>
                        </el-form-item>
                        <el-form-item label="订货号:">
                            <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入查询的订货号" v-model="listQuery.itemNo"></el-input>
                        </el-form-item>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
                    </el-form>
                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="showAllGoodsSelector=true" plain>添加</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete" icon="el-icon-delete" plain>删除</el-button>
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" @row-click="rowClick" ref="list"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column type="selection" width="60" align="center">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品名称" prop="name" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="规格型号" prop="specModel">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="图片" prop="picUrl" v-slot="{row}">
                            <div @click="doShowImageViewer(row.picUrl)" style="cursor: pointer">
                                <el-image :src="row.picUrl" :url-list="srcList" fit="contain" style="width: 60px"></el-image>
                            </div>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="系列" prop="seriesName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品面价" prop="retailPrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售折扣" prop="retailDiscount">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售价" prop="retailDiscountPrice">
                        </el-table-column>
<!--                        <el-table-column align="center" min-width="100" label="上架状态" prop="isOnSale">-->
<!--                            <template slot-scope="scope" >-->
<!--                                <el-switch v-model="scope.row.isOnSale" active-color="#C0CCDA" inactive-color="#188AE2"-->
<!--                                           @change="handleSwitchChange(scope.row,scope.$index)">-->
<!--                                </el-switch>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column align="center" label="计量单位" prop="measureUnitName">
                        </el-table-column>
                        <el-table-column align="center" min-width="80" label="起订量" prop="moqMinOrder">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="标签" prop="tagsList">
                            <template slot-scope="scope" >
                                <el-tag v-for="tag in scope.row.tagsList">{{tag}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="库存数量" prop="stock">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="可售数量" prop="availableStock">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="调拨库存" prop="synergyStock">
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pagination-container" style="padding: 10px 0px;background: #ffffff;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="listQuery.page"
                                   :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <el-image-viewer :url-list="srcList" v-if="showImageViewer" :on-close="closeImageViewer"/>
        <!--        选择全部商品对话框-->
        <all-goods-selector v-if="showAllGoodsSelector" ref="allGoodsSelector" :dialogVisible="showAllGoodsSelector" title="选择推荐商品"
                            @handleClose="showAllGoodsSelector=false"
                            @handleSubmit="handleSubmitPublic"></all-goods-selector>
    </list-container>
</template>


<script>
    import {deleteGoods,goodsPutaway,updateGoods,updateGoodsTag,coverFromOut,synStock} from '@/api/erp/saas/allGoods';
    import {addAndDelGoodsRecommend,page} from '@/api/erp/saas/contentControl/goodsRecommend';
    import goodsLibrarySelector from "@/components/saas/goodsLibrarySelector";
    import allGoodsSelector from "@/components/saas/allGoodsSelector";
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import 'element-ui/lib/theme-chalk/index.css';
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    export default {
        name: 'goodsRecommend',
        components: {allGoodsSelector, goodsLibrarySelector,ElImageViewer},
        props: ['timeStamp'],
        data() {
            return {
                uploadHeader:{//文件上传请求头设置
                    Authorization: 'Bearer ' + this.$store.getters.token
                },
                showBatchUpload:false,//是否显示批量导入对话框
                showGoodsLibrarySelector:false,//是否显示从产品库导入对话框
                rules: {//新增类目表单验证
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                },
                showImageViewer:false,//是否展示图片预览
                srcList: ['http://gxcl-shop.qiniu.520mro.com/5snm6e6lxrkaysv6w2gj.jpg'],//图片预览数组
                addList:{//新增商品数据临时存储对象
                    tableData:[
                        [1, 2, 3]
                    ]
                },
                showPicture:false,//是否展示商品主图
                showPictureList:false,//是否展示商品列表图
                nowClassify:'',//当前选择分类
                nowClassifyName:'',//当前选择分类名
                nowClassifyLevel:'',//当前选择分类级别
                showAllGoodsSelector:false,//是否展示全部商品选择对话框
                nowRow:{},//当前选择行
                headers: undefined,
                fromOut: '',
                selfCategoryId: undefined,
                clientHeight: 300,
                list: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    skuName: undefined,
                    name: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    itemNo: undefined,
                    specModel: undefined,
                    isOnSale: undefined
                },
                goodsTypeList: [],
                fileList: [],//文件上传存储文件数组
                goodsDetail: '',
                detailDialogVisible: false,
                dialogFormVisible: false,
                goodsDialogTitle: '',
                downloadLoading: false,
                goodsId: null,
                categoryList: [],
                brandList: [],
                isOpenTree: true,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterText: '',
                breadcrumbList: [{label: '所有分类', value: 0}],
                initializingShow: true,
                queryVisible: true,
                dialogDataBaseVisible: false,
                no: undefined,
                selectedRows: [],
                userId:undefined
            }
        },
        created() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
            this.no = this.$store.getters.userInfo.no;
            this.userId = this.$store.getters.userInfo.id;
            this.changeDivHeight();
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            };
            this.init();
            if (this.$store.state.user.id == '1') {
                this.initializingShow = false; // 超级管理员不显示商品初始化功能
            }
        },
        watch: {
            filterText(val) {
                this.$refs.categoryTree.filter(val);
            },
            '$route': function (to, from) {
                if(this.$route.query.myRefresh){
                    this.getList(this.listQuery);
                }

            },
        },
        methods: {
            closeCoverDialog() {
                this.dialogDataBaseVisible = false;
            },
            handlechangeFun(val) {
                this.selectedRows = val;
            },
            dialogDataVisible() {
                if (this.listQuery.categoryId !== undefined) {
                    this.dialogDataBaseVisible = true;
                } else {
                    this.vueMessage('warning', '请选择分类');
                }
            },
            changeDivHeight() {
                if (document.getElementsByClassName('filter-container')[0]) {
                    var height = document.getElementsByClassName('filter-container')[0].clientHeight;
                } else {
                    height = 49;
                }
                this.clientHeight = (document.body.clientHeight - (240 + height)) * 1;
            },
            init() {
                this.showBatchUpload=false
                this.showGoodsLibrarySelector=false
                this.showAllGoodsSelector=false
                this.getList(this.listQuery);
            },
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(response => {
                    this.list = response.data.data.records;
                    this.total = response.data.data.total;
                    this.listLoading = false;
                    for (let i in response.data.data.records) {
                        response.data.data.records[i].isOnSale=Boolean(response.data.data.records[i].isOnSale)
                        if (response.data.data.records[i].tags && response.data.data.records[i].tags !== '') {
                            response.data.data.records[i].tagsList = response.data.data.records[i].tags.split(',');
                        } else {
                            response.data.data.records[i].tagsList = [];
                        }
                        this.list[i].showStatus=!Boolean(this.list[i].showStatus)
                    }
                }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                })
            },
            insertBtn(){
                document.getElementById("productForm").submit();
            },
            handleOpenTree() {
                this.isOpenTree = !this.isOpenTree;
                for (const i in this.$refs.categoryTree.store.nodesMap) {
                    this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getAllParentNode(node, arr) {
                if (node.parent && node.parent.label) {
                    arr.push({
                        label: node.parent.label,
                        value: node.parent.key
                    });
                    if (node.parent.parent) {
                        this.getAllParentNode(node.parent, arr);
                    }
                }
                return arr;
            },
            changeTreeNode(data, index) {
                // if (data.label == '所有分类') {
                //     return;
                // }
                this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
                this.listQuery.categoryId = data.value;
                this.$refs.categoryTree.setCurrentKey(data.value);
                this.handleFilter();
                this.nowClassify=data.value
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList(this.listQuery);
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList(this.listQuery);
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList(this.listQuery);
            },
            showDetail(detail) {
                this.goodsDetail = detail;
                this.detailDialogVisible = true;
            },

            /**
             *批量删除
             */
            handleDelete(index, row) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    addAndDelGoodsRecommend(ids,0).then(res => {
                        if(Number(res.data.code) === 2000||Number(res.data.code)===200){
                            this.showSuccess('推荐商品删除成功!')
                        }else{
                            this.showError('推荐商品删除失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('推荐商品删除失败,'+error));
                });
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if(Number(code)===401){
                    this.$message.warning(message||'操作失败')
                }else{
                    this.$message.error(message||'操作失败')
                }
                this.isLoading=false
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
             * 重置按钮事件
             */
            clear(){
                delete this.listQuery.skuName
                delete this.listQuery.brandName
                delete this.listQuery.specifications
                delete this.listQuery.itemNo
                delete this.listQuery.isOnSale
                delete this.listQuery.name
                delete this.listQuery.seriesName
                delete this.listQuery.specModel
                this.init()
            },

            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                if (data.type === 'allGoods') {
                    let ids=[]
                    if(data.arr.length>50){
                        this.showError('所选商品不能大于50个!',401)
                        return false
                    }
                    for (let i = 0; i <data.arr.length ; i++) {
                        ids.push(data.arr[i].id)
                    }
                    addAndDelGoodsRecommend(ids.toString(),1).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('推荐商品添加成功!')
                        }else{
                            this.showError('推荐商品添加失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error=>this.showError('推荐商品添加失败,'+error))
                }else if(data.type==='goodsLibrary'){
                    let orderNos=[]
                    for (let i = 0; i <data.arr.length ; i++) {
                        orderNos.push(data.arr[i].orderNo)
                    }
                    coverFromOut(orderNos.toString(),this.nowClassify).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('从产品库导入商品成功!')
                        }else{
                            this.showError('从产品库导入商品失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('从产品库导入商品失败,'+error))
                }
            },

            /**
             * 行单击事件
             */
            rowClick(row, column, event){
                this.$refs.list.toggleRowSelection(row);
            },

            /**
             * 表格导出
             */
            excelTable(){
                var wb = XLSX.utils.table_to_book(document.querySelector("#goodsTable"));
                /* 获取二进制字符串作为输出 */
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                        //Blob 对象表示一个不可变、原始数据的类文件对象。
                        //Blob 表示的不一定是JavaScript原生格式的数据。
                        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                        new Blob([wbout], { type: "application/octet-stream" }),
                        //设置导出文件名称
                        "sheetjs.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },

            /**
             * 文件上传完毕
             */
            fileSuccess(res, file, fileList){
                if(Number(res.code)===2000||Number(res.code)===200){
                    this.showSuccess('文件上传成功!'+res.msg)
                }else{
                    this.showError('文件上传失败,'+res.msg||res.data,res.code)
                }
            },

            /**
             * 同步库存
             */
            doSyncStock(){
                synStock().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('手动同步库存成功!')
                    }else{
                        this.showError('手动同步库存失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('手动同步库存失败,'+error))
            },

            /**
             * 展示图片大图预览
             * @param img 图片地址
             */
            doShowImageViewer(img){
                this.$set(this.srcList,0,img)
                this.showImageViewer=true
            },

            /**
             * 关闭图片预览
             */
            closeImageViewer(){
                this.showImageViewer=false
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .goods-list-container {
        .box-card {
            overflow: auto;
        }

        .curr-classify {
            font-size: 14px;
            position: relative;
            top: -2px;
            color: #5a5e66;
        }

        .query-visible {
            color: #409EFF;
            margin-left: 10px;
            cursor: pointer;
            font-size: 14px;
        }

        .el-breadcrumb__inner a {
            color: #1276c3 !important;
            cursor: pointer !important;
        }

        .table-expand {
            font-size: 0;
        }

        .table-expand label {
            width: 100px;
            color: #99a9bf;
        }

        .table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }

        .gallery {
            width: 80px;
            margin-right: 10px;
        }

        .goodsFormDialog > .el-dialog {
            margin-top: 0vh !important;
            margin-bottom: 0vh !important;
            height: 100vh;
        }

        .goodsFormDialog > .el-dialog > .el-dialog__body {
            width: 100%;
            position: absolute;
            top: 40px;
            padding-top: 10px !important;
        }

        .goodsFormDialog > .el-dialog > .el-dialog__footer {
            position: absolute;
            width: 100%;
            bottom: 0px;
        }

        .goods-form-container {
            .topTable {
                .el-input input.el-input__inner {
                    border: none;
                    text-align: left;
                }

                .el-textarea__inner {
                    border: none;
                    resize: none;
                    padding: 10px 15px;
                }

                .el-form-item__content {
                    width: 100%;
                    margin-left: 0px !important;
                    line-height: 39px;

                    .el-form-item__error {
                        position: absolute;
                        display: inline-block;
                        top: 0px;
                        right: 15px;
                        text-align: right;
                    }
                }

                .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
                    line-height: 40px;
                    color: #444;
                    /* width: 220px!important;*/
                }goodsManager

                 .input-new-keyword .el-input__inner {
                     border: 1px solid #409EFF !important;
                 }
            }
        }
    }
</style>
