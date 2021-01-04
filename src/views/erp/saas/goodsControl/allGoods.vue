<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" style="margin-top: 0px">
        <el-row>
            <el-col :span="3" style="margin-left: 10px;">
                <el-card class="box-card" :style="{height:(Number(clientHeight)+250)+'px'}">
                    <el-row>
                        <el-col :span="24">
                            <el-input
                                    clearable
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                            </el-input>
                        </el-col>
<!--                        <el-col :span="8">-->
<!--                            <el-button type="text" icon="plus" @click="handleOpenTree" style="margin-left: 15px;font-size: 14px;">-->
<!--                                <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>-->
<!--                                <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>-->
<!--                            </el-button>-->
<!--                        </el-col>-->
                    </el-row>
                    <el-tree
                            class="filter-tree"
                            :data="categoryList"
                            node-key="value"
                            :props="defaultProps"
                            :default-expand-all="isOpenTree"
                            :expand-on-click-node="false"
                            :filter-node-method="filterNode"
                            ref="categoryTree"
                            @node-click="getNodeData">
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="21" style='padding-left:10px;margin-top: 7px;width: 86%'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;border-radius: 4px">
                    <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类：</span>
                    <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                                   style="display: inline-block;margin-right: 5px;">
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                            <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
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
                        <el-form-item label="上架状态:">
                            <el-select clearable class="filter-item" style="width: 200px;" placeholder="请选择查询的上架状态" v-model="listQuery.isOnSale">
                                <el-option label="下架" :value="1">下架</el-option>
                                <el-option label="上架" :value="0">上架</el-option>
                            </el-select>
                        </el-form-item>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
                    </el-form>
                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleInsert" plain v-if="openERP*1!==1">添加</el-button>
                        <el-button type="primary" plain icon="el-icon-download" class="filter-item" @click="goGoodsLibrary" v-if="openERP*1!==1">
                            产品库导入
                        </el-button>
                        <el-button type="primary" plain icon="el-icon-download" class="filter-item" @click="showGoodsERPLibrarySelector=true" v-else>
                            梅施产品库导入
                        </el-button>
                        <el-button type="danger" size="mini" @click="handleDelete" icon="el-icon-delete" plain v-if="canDelete">删除</el-button>
<!--                        <el-button type="primary" plain icon="el-icon-download" @click="showBatchUpload=true" v-if="openERP*1!==1">批量导入</el-button>-->
<!--                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="batchUpOrDown()" plain>上下架</el-button>-->
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-price-tag" @click="pasteTag" plain >贴标签</el-button>-->
                        <el-button type="warning" size="mini"  icon="el-icon-download" plain @click="excelTable" style="margin-right: 15px;">导出</el-button>
<!--                        <el-button type="primary" size="mini"  icon="el-icon-refresh" plain @click="doSyncStock" style="margin-right: 15px">erp库存同步</el-button>-->
<!--                        <el-button type="primary" size="mini"  icon="el-icon-refresh" plain @click="doCloudSyncStock" style="margin-right: 15px">云库存同步</el-button>-->
                        <el-dropdown @command="handleCommand" placement="bottom-start">
                            <el-button type="primary" plain>
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="openERP*1!==1" command="批量导入">批量导入</el-dropdown-item>
                                <el-dropdown-item command="上下架">上下架</el-dropdown-item>
                                <el-dropdown-item command="设置折扣">设置折扣</el-dropdown-item>
                                <el-dropdown-item command="贴标签">贴标签</el-dropdown-item>
                                <el-dropdown-item command="ERP库存同步" v-if="openERP*1===1">ERP库存同步　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="云库存同步" v-else>云库存同步　&nbsp;</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" ref="list"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column type="selection" width="60">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品名称" prop="name" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="规格型号" prop="specModel">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="图片" prop="picUrl">
                            <template slot-scope="scope">
<!--                                    <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>-->
                                <el-image
                                        style="width: 80px"
                                        :src="scope.row.picUrl"
                                        :z-index="9999"
                                        :preview-src-list="[scope.row.picUrl]">
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="系列" prop="seriesName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品面价" prop="retailPrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="成本折扣" prop="retailDiscount">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="成本价" prop="retailDiscountPrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="上架状态" prop="isOnSale">
                            <template slot-scope="scope" >
                                <el-switch v-model="scope.row.isOnSale" active-color="#C0CCDA" inactive-color="#188AE2"
                                           @change="handleSwitchChange(scope.row,scope.$index)">
                                </el-switch>
                            </template>
                        </el-table-column>
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
                        <el-table-column align="center" label="操作" width="150" fixed="right" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row,0)" v-if="scope.row.isOnSale">编辑</el-button>
                                <el-button size="mini" @click="handleUpdate(scope.$index, scope.row,1)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 导出用表格-->
                <div class="result-container"style="padding: 0% 1%; background: #ffffff;" v-show="false">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" @row-click="rowClick" ref="list" id="goodsTable"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column align="center" min-width="100" label="商品名称" prop="name" :fixed="false">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="规格型号" prop="specModel">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="系列" prop="seriesName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品面价" prop="retailPrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售折扣" prop="retailDiscount">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售价" prop="retailDiscountPrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="上架状态" prop="isOnSale">
                            <template slot-scope="scope" >
                                <el-switch v-model="scope.row.isOnSale" active-color="#C0CCDA" inactive-color="#188AE2"
                                           @change="handleSwitchChange(scope.row,scope.$index)">
                                </el-switch>
                            </template>
                        </el-table-column>
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
                <div style="height: 50px"></div>
            </el-col>
        </el-row>
<!--        导入对话框-->
        <el-dialog :visible.sync="showBatchUpload" :modal-append-to-body="false" width="30%" title="批量导入">
            <el-form  label-position="left" label-width="120px">
                <el-form-item label="">
                    <el-link type="primary" :underline="false" href="api/saas/goods/downTemplate" download="商品模板">下载模板</el-link>
                </el-form-item>
                <el-form-item label="选择文件:">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="api/saas/goods/import"
                            :file-list="fileList"
                            :on-change="fileChange"
                            :multiple="true"
                            :headers="uploadHeader"
                            :on-success="fileSuccess"
                            :before-upload="beforeUpload"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <span v-if="fileList.length===0" style="color:#aaa;margin-left: 10px;">未选择任何文件</span>
<!--                        <span v-else style="color:#aaa;margin-left: 10px;">当前选择了{{fileList.length}}个文件</span>-->
                    </el-upload>
                    <el-form-item label="">
                        <div style="margin-top: 50px;">
                        <span style="color: red">注意事项:</span><span>必须按照下载模块格式上传文件;</span>
                        </div>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitUpload">确 定</el-button>
                <el-button @click="showBatchUpload = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="showBatchSetDiscount" width="30%" title="批量设置折扣"   :modal-append-to-body="false">
            <el-form :model="addList" label-width="120px" label-position="right" size="medium" :rules="rules">
                <el-form-item label="折扣" prop="retailDiscount">
                    <el-input v-model="addList.retailDiscount" placeholder="请输入折扣" style="width: 400px"></el-input>
                </el-form-item>
            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click="showBatchSetDiscount = false">取 消</el-button>
                <el-button type="primary" @click="doSetDiscount" :loading="isLoading">确 定</el-button>
            </div>
        </el-dialog>



<!--        从产品库导入对话框-->
        <goods-library-selector v-if="showGoodsLibrarySelector" ref="goodsLibrarySelector" :dialogVisible="showGoodsLibrarySelector" :nowClassify="nowClassify" :nowClassifyName="nowClassifyName"
                           @handleClose="showGoodsLibrarySelector=false"
                           @handleSubmit="handleSubmitPublic"></goods-library-selector>

<!--        从产品库导入对话框-->
        <goods-e-r-p-library-selector v-if="showGoodsERPLibrarySelector" ref="goodsERPLibrarySelector" :dialogVisible="showGoodsERPLibrarySelector" :nowClassify="nowClassify" :nowClassifyName="nowClassifyName"
                           @handleClose="showGoodsERPLibrarySelector=false"
                           @handleSubmit="handleSubmitPublic"></goods-e-r-p-library-selector>
<!--        选择商品标签对话框-->
        <goods-tag-selector v-if="showGoodsTagSelector" :dialogVisible="showGoodsTagSelector" :nowRow="nowRow"
                           @handleClose="showGoodsTagSelector=false"
                           @handleSubmit="handleSubmitPublic"></goods-tag-selector>
    </list-container>
</template>


<script>
    import {page,deleteGoods,goodsPutaway,updateGoods,updateGoodsTag,coverFromOut,synStock,enableErp,setRetailDiscountBatch,syncErpStock} from '@/api/erp/saas/allGoods';
    import {listCatAndBrand} from '@/api/erp/saas/goodsClassify';
    import {coverFromErp} from '@/api/erp/saas/goodsLibrary';
    import goodsLibrarySelector from "@/components/saas/goodsLibrarySelector";
    import goodsERPLibrarySelector from "@/components/saas/goodsERPLibrarySelector";
    import goodsTagSelector from "@/components/saas/goodsTagSelector";
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    export default {
        name: 'allGoods',
        components: {goodsTagSelector, goodsLibrarySelector,goodsERPLibrarySelector},
        props: ['timeStamp'],
        data() {
            return {
                uploadHeader:{//文件上传请求头设置
                    Authorization: 'Bearer ' + this.$store.getters.token
                },
                canDelete:true,
                showBatchUpload:false,//是否显示批量导入对话框
                showGoodsLibrarySelector:false,//是否显示从产品库导入对话框
                showGoodsERPLibrarySelector:false,//是否显示从ERP产品库导入对话框
                rules: {//新增类目表单验证
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                    retailDiscount: [{required: true, message: '折扣不能为空', trigger: 'blur'}],
                },
                addList:{//新增商品数据临时存储对象
                    tableData:[
                        [1, 2, 3]
                    ]
                },
                showBatchSetDiscount:false,//显示批量设置折扣对话框
                showPicture:false,//是否展示商品主图
                showPictureList:false,//是否展示商品列表图
                nowClassify:'',//当前选择分类
                nowClassifyName:'',//当前选择分类名
                nowClassifyLevel:'',//当前选择分类级别
                showGoodsTagSelector:false,//是否暂时商品标签选择对话框
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
                    label: 'name'
                },
                isLoading:false,
                filterText: '',
                breadcrumbList: [{label: '所有分类', value: 0}],
                initializingShow: true,
                queryVisible: true,
                dialogDataBaseVisible: false,
                no: undefined,
                selectedRows: [],
                userId:undefined,
                // openERP:0
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
            // enableErp().then(res=>{
            //     if(Number(res.data.code)===200||Number(res.data.code)===2000){
            //         this.openERP=res.data.data.enable
            //     }else{
            //         this.showError('请求ERP状态失败!'+res.data.msg||res.data.data,res.data.code)
            //     }
            // },error => this.showError('请求ERP状态失败!'+error))
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
        computed:{
          openERP(){
              return this.$store.getters.openERP*1
          }
        },
        methods: {
            uploadCompleted(response, file, fileList) {
                this.getList(this.listQuery);
                if (response.code === '2000') {
                    this.$notify({
                        title: '成功',
                        message: response.msg,
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    this.$alert(response.msg, "提示", {
                        confirmButtonText: "确定",
                    }).then(() => {
                    });
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

            /**
             * 上传文件列表更变事件
             * fileList 当前选择的文件列表
             */
            fileChange(file,fileList) {
                this.fileList=fileList
            },

            closeCoverDialog() {
                this.dialogDataBaseVisible = false;
            },
            handlechangeFun(val) {
                //onsole.log(val,'selection')
                this.canDelete=true
                for (let i = 0; i <val.length ; i++) {
                    if(!val[i].isOnSale){
                        this.canDelete=false
                        break;
                    }
                }
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
                this.showGoodsTagSelector=false
                this.showBatchSetDiscount=false
                this.showGoodsERPLibrarySelector=false
                listCatAndBrand().then(response => {
                    try {
                        response.data.data.categoryList.unshift({name:'全部分类'})
                        this.categoryList = response.data.data.categoryList;
                        this.nowClassify=response.data.data.categoryList[0].value
                        this.nowClassifyName=response.data.data.categoryList[0].label
                        this.brandList = response.data.data.brandList;
                    }catch (e) {}
                },error => this.showError('获取商品分类失败,'+error));
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
                return data.name.indexOf(value) !== -1;
            },
            getAllParentNode(node, arr) {
                if (node.parent && node.parent.label) {
                    arr.push({
                        label: node.parent.label,
                        value: node.parent.id
                    });
                    if (node.parent.parent) {
                        this.getAllParentNode(node.parent, arr);
                    }
                }
                // console.log(arr,'getNode')
                return arr;
            },
            getNodeData(data, node) {
                //console.log(data,node,'这是树')
                this.listQuery.categoryId = data.id;
                this.fromOut = data.label;
                this.selfCategoryId = data.id;
                this.nowClassify=data.id
                this.nowClassifyName=data.name
                // console.log(this.nowClassify,'clasafiy')
                console.log(data,node,'classfiy')
                let breadcrumbList = [];
                breadcrumbList.push(data);
                if (node.parent) {
                    breadcrumbList = this.getAllParentNode(node, breadcrumbList);
                }
                this.breadcrumbList = breadcrumbList.reverse();
                this.handleFilter();
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
                    deleteGoods(ids).then(res => {
                        if(Number(res.data.code) === 2000||Number(res.data.code)===200){
                            this.showSuccess('商品删除成功!')
                        }else{
                            this.showError('商品删除失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('商品删除失败,'+error));
                });
            },

            /**
             * 批量导入文件上传
             */
            submitUpload() {
                this.$refs.upload.submit();
            },

            /**
             * 商品主图图片上传事件
             * @param file 上传的文件
             */
            handlePictureCardPreview(file) {
                this.addList.goodsPicture = file.url;
                this.showPicture = true;
            },


            /**
             * 增加预设折扣和预设价格
             */
            addTableData(){
                let nowIndex=this.tableHeader[this.tableHeader.length-2].replace(/[^0-9]/ig,"")
                this.tableHeader.splice(this.tableHeader.length,0,'预设折扣'+(Number(nowIndex)+1))
                this.tableHeader.splice(this.tableHeader.length,0,'预设价格'+(Number(nowIndex)+1))
            },

            /**
             * 删除新增的预设折扣和预设价格
             */
            deleteTableData(){
                if(this.tableHeader.length>9){
                    this.tableHeader.splice(this.tableHeader.length-2)
                }
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
                this.isLoading=false
                this.init()
            },

            /**
             * 顶部新增按钮事件,跳转至商品新增页面
             */
            handleInsert(){
                this.$router.push({
                    path:'/shop/goodsControl/allGoodsForm',
                    query:{
                        flag:'add'
                    }
                })
            },

            /**
             * 行编辑&行详情事件
             */
            handleUpdate(index,row,flag){
                if(flag===0){
                    this.$router.push({
                        name:'编辑商品',
                        query: {
                            id:row.id,
                            flag:'edit'
                        },

                    });
                }else{
                    this.$router.push({
                        name:'商品详情',
                        query: {
                            id:row.id,
                            flag:'view'
                        },
                    });
                }
            },

            /**
             * 表格行中是否上架
             * index 当前按钮索引
             * row 当前行数据
             */
            handleSwitchChange(row, index) {
                let data={
                    id:row.id,
                    status:row.isOnSale?1:0
                }
                goodsPutaway(data).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('更改商品上下架状态成功!')
                    }else{
                        this.showError('更改商品上下架状态失败,'+res.data.msg||res.data.data,res.data.code)
                        this.init()
                    }

                },error => this.$message.error('更改商品上下架状态失败,'+error))
            },

            /**
             *批量上下架
             */
            batchUpOrDown(){
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let obj = {
                    id:[],
                    status: ''
                };
                this.selectedRows.forEach((row) => {
                    obj.id.push(row.id)
                });
                goodsPutaway(obj).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('批量上下架成功!')
                    }else{
                        this.showError('批量上下架失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('批量上下架失败,'+error))
            },

            /**
             * 重置按钮事件
             */
            clear(){
                this.listQuery.skuName=''
                this.listQuery.brandName=''
                this.listQuery.specifications=''
                this.listQuery.itemNo=''
                this.listQuery.isOnSale=''
                this.listQuery.name=''
                this.listQuery.seriesName=''
                this.listQuery.specModel=''
                this.init()
            },

            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                if (data.type === 'goodsTag') {
                    let subData={
                        ids:[],
                        tags:data.arr.tagsList.toString()
                    }
                    for (let i = 0; i <this.selectedRows.length ; i++) {
                        subData.ids.push(this.selectedRows[i].id)
                    }
                    subData.ids=subData.ids.toString()
                    updateGoodsTag(subData).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('商品标签添加成功!')
                        }else{
                            this.showError('商品标签添加失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error=>this.showError('商品标签添加失败,'+error))
                }else if(data.type==='goodsERPLibrary'){
                    let skuNoList=[]
                    for (let i = 0; i <data.arr.length ; i++) {
                        skuNoList.push(data.arr[i].skuNo||data.arr[i].orderNo)
                    }
                    coverFromErp({skuNoList:skuNoList.toString()}).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('从产品库导入商品成功!')
                        }else{
                            this.showError('从产品库导入商品失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('从产品库导入商品失败,'+error))
                }else if(data.type==='goodsLibrary'){

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
                        this.showSuccess('erp库存同步成功!')
                    }else{
                        this.showError('erp库存同步失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('erp库存同步失败,'+error))
            },

            doCloudSyncStock(){
                syncErpStock().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('云库存同步成功!')
                    }else{
                        this.showError('云库存同步失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('云库存同步失败,'+error))
            },

            pasteTag(){
                if (this.selectedRows.length<1){
                    this.$message.warning('请选择商品!')
                }else{
                    this.showGoodsTagSelector=true
                }
            },

            handleCommand(command){
                if(command==='批量导入'){
                    this.showBatchUpload=true
                }else if(command==='上下架'){
                    this.batchUpOrDown()
                }else if(command==='贴标签') {
                    this.pasteTag()
                }else if(command==='ERP库存同步') {
                    this.doSyncStock()
                }else if(command==='云库存同步'){
                    this.doCloudSyncStock()
                }else{
                    if (this.selectedRows.length<1){
                        this.$message.warning('请选择商品!')
                    }else{
                        this.showBatchSetDiscount=true
                    }
                }
            },

            doSetDiscount(){
                this.isLoading=true
                let params=Object.assign({},this.addList)
                delete params.tableData
                let ids=[]
                for (let i = 0; i <this.selectedRows.length ; i++) {
                    ids.push(this.selectedRows[i].id)
                }
                params.ids=ids.toString()
                setRetailDiscountBatch(params).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('批量设置折扣成功!')
                    }else{
                        this.showError('批量设置折扣失败!' + res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('批量设置折扣失败!' + error))
            },

            goGoodsLibrary(){
                console.log(this.nowClassifyName,this.nowClassify,'test')
                if(this.nowClassify&&this.nowClassify!==''){
                    this.showGoodsLibrarySelector=true
                }else{
                    this.$message.warning('请选择分类')
                }

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
