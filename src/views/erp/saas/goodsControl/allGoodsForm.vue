<template>
    <bill-container  :type="type"  ref="billContainer">
        <basic-container v-loading="isLoading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        v-if="$route.query.flag!=='view'"
                        :marginBottom="10"
                        objectKey="SPLB"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="handleSubmit"></button-bar>
            <div class="bill-form-container">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="商品信息" name="first">
                        <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="100px" :disabled="isView" size="medium">
                            <h3 style="margin: 0 0 20px 0">基本信息</h3>
                            <div style="display: inline-block">
                                <el-form-item label="商品名称:" prop="goods.name" >
                                    <el-input style="width: 200px;" v-model="addList.goods.name" autocomplete="off"></el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px">
                                <el-form-item label="商品标题:" >
                                    <el-input style="width: 200px;" v-model="addList.goods.title" autocomplete="off" disabled></el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px" @click="showSeriesSelector=(!isView)">
                                <el-form-item label="商品系列:" :required="true">
                                        <el-input style="width: 200px;" v-model="addList.goods.seriesName"  placeholder="请选择商品系列" autocomplete="off">
                                            <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 35px" slot="suffix"></i>
                                        </el-input>
                                </el-form-item>
                            </div>
                            <div></div>
                            <div style="display: inline-block" @click="showBrandSelector=(!isView)">
                                <el-form-item label="商品品牌:" :required="true" >
                                    <el-input style="width: 200px;" v-model="addList.goods.brandName"  placeholder="请选择商品品牌">
                                        <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 35px" slot="suffix"></i>
                                    </el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px" @click="showClassifySelector=(!isView)">
                                <el-form-item label="商品分类:" :required="true">
                                    <el-input style="width: 200px;" v-model="addList.goods.categoryName"  placeholder="请选择商品分类">
                                        <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 35px" slot="suffix"></i>
                                    </el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px">
                                <el-form-item label="规格型号:" prop="goods.specModel">
                                    <el-input style="width: 200px;" v-model="addList.goods.specModel"></el-input>
                                </el-form-item>
                            </div>
                            <div></div>
<!--                            <div style="display: inline-block">-->
<!--                                <el-form-item label="调拨库存数量:" prop="goods.synergyStock">-->
<!--                                    <el-input style="width: 200px;" v-model.number="addList.goods.synergyStock"></el-input>-->
<!--                                </el-form-item>-->
<!--                            </div>-->
                            <div style="display: inline-block;">
                                <el-form-item label="起订量:" prop="goods.moqMinOrder">
                                    <el-input style="width: 200px;" v-model.number="addList.goods.moqMinOrder"></el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px">
                                <el-form-item label="库存数量:" prop="goods.stock">
                                    <el-input style="width: 200px;" v-model.number="addList.goods.stock" :disabled="openERP*1!==0"></el-input>
                                </el-form-item>
                            </div>
                            <div style="display: inline-block;margin-left: 80px">
                                <el-form-item label="订货号:" :prop="noItemsNo?'':'goods.itemNo'">
                                    <el-input style="width: 200px;" v-model="addList.goods.itemNo" :disabled="noItemsNo"></el-input>
                                    <span style="margin-left: 15px;vertical-align: middle">是否启用(启用后订货号自动生成)：</span>
                                    <el-switch v-model="noItemsNo"></el-switch>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="是否为附件:">
                                    <el-switch v-model="addList.goods.annex"></el-switch>
                                    <span style="margin-left: 15px;vertical-align: middle">是否启用期货：</span><el-switch v-model="addList.goods.supportFeature"  :active-value="1" :inactive-value="0"></el-switch>
                                </el-form-item>
                            </div>
                            <h3>单位价格</h3>
                            <div class="goodsTable">
                                <el-table border :data="tableData" >
                                    <el-table-column label="条形码">
                                        <template scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input v-model="addList.goods.stripeCode"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="计量单位">
                                        <template scope="scope">
                                            <el-form-item label-width="0">
                                                <el-select v-model="addList.goods.unit" filterable>
                                                    <el-option value="个"></el-option>
                                                    <el-option value="位"></el-option>
                                                    <el-option value="件"></el-option>
                                                    <el-option value="台"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column >
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red;">*&nbsp</span><span>产品面价</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="goods.retailPrice" label-width="0">
                                                <el-input v-model="addList.goods.retailPrice" ></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="成本折扣">
                                        <template slot-scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input v-model="addList.goods.retailDiscount" @input="computeWithFace('折扣')"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="成本价">
                                        <template slot-scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input v-model="addList.goods.retailDiscountPrice" @input="computeWithFace('价格')" type="text"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="零售折扣">
                                        <template slot-scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input v-model="addList.goods.customerDiscount" @input="computeWithFace('零售折扣')"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="零售价">
                                        <template slot-scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input v-model="addList.goods.costPrice" @input="computeWithFace('零售价格')" type="text"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column id="table"  :label="date"  v-for="(date,index) in tableHeader" :key="index">
                                        <template scope="scope">
                                            <el-form-item label-width="0">
                                                <el-input type="text" v-model="tableData[scope.$index][index]" @input="computeWithFace(index)"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template scope="scope">
                                            <i class="el-icon-plus" style="cursor: pointer" @click="addTableData"></i><i class="el-icon-minus" style="float: right;margin-top: 6px;cursor: pointer" @click="deleteTableData"></i>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                            <h3 style="display: inline-block">商品上架</h3>
                            <div style="display: inline-block;margin-left: 40px">
                                <el-checkbox v-model="addList.goods.isOnSale">立即上架</el-checkbox>
                            </div>
                            <div></div>
<!--                            <h3 style="display: inline-block">商品标签</h3>-->
<!--                            <div style="display: inline-block;margin-left: 40px">-->
<!--                                <el-checkbox-group  v-model="tags" :max=3 :disabled="isChooseTags">-->
<!--                                    <el-checkbox  v-for="tag in goodsTags" :label="tag.name">{{tag.name}}</el-checkbox>-->
<!--                                </el-checkbox-group>-->
<!--                            </div>-->
<!--                            <div></div>-->
<!--                            <h3 style="display: inline-block"><span style="color:#F56C6C;margin-right: 2px">*</span>商品主图</h3>-->
                            <h3 style="display: inline-block">主图视频</h3>
                            <div style="display: inline-block;vertical-align: text-top;margin-left: 40px;">
                                <el-upload
                                        class="avatar-uploader goods-video"
                                        :show-file-list="false"
                                        list-type="picture-card"
                                        style="position: relative"
                                        :on-success="goodsMainVideo"
                                        accept=".mp4,.mov,.m4v,.flv,.x-flv,.mkv,.wmv,.avi,.rmvb,.3gp"
                                        :on-preview="handlePictureCardPreview"
                                        action="api/saas/storage/create">
                                    <div class="goods-video-remove" style="background-color: rgba(255,255,255,.8);height: 30px;position: absolute;width: 100%;bottom: 0;line-height: 30px;color: #409EFF;cursor: pointer" v-if="addList.goods.video" @click.stop="removeUpload('video')">
                                        <span>删除</span>
                                    </div>
                                    <video v-if="addList.goods.video" :src="addList.goods.video" class="avatar" ></video>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div class="el-upload__tip" slot="tip">
                                        <div class="el-upload__tip" slot="tip">
                                            <ul style="padding: 0;margin-left: 14px;list-style:disc">
                                                <li>主图视频只能上传一个</li>
                                                <li>尺寸比例：1:1</li>
                                                <li>时长：3分钟以内</li>
                                                <li>建议分辨率 ：≥720P</li>
                                                <li>支持 mp4、mov、m4v、flv、x-flv、mkv、wmv、avi、rmvb、3gp格式</li>
                                            </ul>
                                        </div>
                                    </div>
                                </el-upload>
                            </div>
                            <div></div>
                            <h3 style="display: inline-block">商品主图</h3>
                            <div style="display: inline-block;vertical-align: text-top;margin-left: 40px;">
                                <el-upload
                                        action="api/saas/storage/create"
                                        list-type="picture-card"
                                        style="position: relative"
                                        :limit=6
                                        :file-list="galleryList"
                                        :multiple="true"
                                        :on-remove="delGoodsMainPic"
                                        :on-success="uploadGoodsMainPic"
                                        accept=".jpg,.jpeg,.png,.gif">
                                    <i class="el-icon-plus"></i>
                                    <div class="el-upload__tip" slot="tip">建议尺寸420*420</div>
                                </el-upload>
                            </div>
                            <div></div>
                            <h3 style="display: inline-block">商品列表图</h3>
                            <div style="display: inline-block;margin-left: 20px;vertical-align: text-top">
                            <el-upload
                                    class="avatar-uploader goods-pic"
                                    :show-file-list="false"
                                    style="position: relative"
                                    action="api/saas/storage/create"
                                    accept=".jpg,.jpeg,.png,.gif,.svg"
                                    :on-success="goodsListPic">
                                <div class="goods-pic-remove" style="background-color: rgba(255,255,255,.8);height: 30px;position: absolute;width: 100%;bottom: 0;line-height: 30px;color: #409EFF;cursor: pointer" v-if="addList.goods.picUrl" @click.stop="removeUpload('picUrl')">
                                    <span>删除</span>
                                </div>
                                <img v-if="addList.goods.picUrl" :src="addList.goods.picUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <div class="el-upload__tip" slot="tip">建议尺寸80*80,商品列表图只能上传一张</div>
                            </el-upload>
                            </div>
                            <div></div>
                            <h3 style="display: inline-block;margin-right: 38px;">详细信息</h3>
<!--                            <el-input type="textarea" style="width: 80%;vertical-align: text-top" v-model="addList.goods.detailInfo"></el-input>-->
<!--                                <div id="wangEditor" style="width: 80%;display: inline-block;vertical-align: text-top"></div>-->
                            <avue-ueditor v-model="addList.goods.detailInfo" :options="editorOptions"></avue-ueditor>
                            <div style="height: 200px"></div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="规格参数" name="second">
                        <h3>规格参数</h3>
                        <el-form ref="addList" :model="addList" status-icon label-position="right" label-width="120px" :disabled="isView">
                            <h4 v-if="specifications.length<1">请重新选择商品系列</h4>
                            <el-form-item :label="data.specifications+'：'" v-for="(data,index) in specifications" :key="index">
                                    <el-select placeholder="请选择" v-model="addList.values[index].value">
                                        <el-option :value="values" :label="values" v-for="(values,key) in data.value" :key="key"></el-option>
                                    </el-select>
                            </el-form-item>
                        </el-form>
                        <div ></div>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="third">
                        <h3>商品属性</h3>
                        <div style="font-size: 16px">
                            属性名称:　<el-tag :key="index"
                                          v-for="(data,index) in specificationTags"
                                          :closable="!isView" size="medium"
                                          :disable-transitions="false"
                                          style="margin-bottom: 15px;"
                                          @close="handleCloseTag(specificationTags,data.productAttributeName,index)">
                            {{data.productAttributeName}}
                        </el-tag>
                            <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"

                                    size="medium"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput" :disabled="isView">+ 添加属性名称</el-button>
                        </div>
                        <div style="font-size: 16px;margin-top: 15px" v-for="(data,index) in specificationTags">
                            {{data.productAttributeName}}:　<el-input style="width: 200px" clearable v-model="specificationTags[index].value" :disabled="isView"></el-input>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="关联商品" name="fourth">
                       <div style="background-color: rgb(255,247,232);padding: 15px;width: 600px;font-size: 14px;">
                           <h3 style="color: red">温馨提示:</h3>
                           <h4>1、关联商品最多添加25条，最少0条</h4>
                           <h4>2、已经添加的关联商品将在商品详情页面的[相关推荐]模块做显示</h4>
                       </div>
                        <el-table border :data="addList.items" >
                            <el-table-column type="index" align="center">
                            </el-table-column>
                            <el-table-column label="操作" min-width="60" align="center">
                                <template scope="scope">
                                    <i class="el-icon-plus" style="cursor: pointer;color:rgb(42,140,254);float: left;margin-top: 6px" @click="addAssData()"></i><i class="el-icon-minus" style="float: right;margin-top: 6px;cursor: pointer;color:rgb(42,140,254)" @click="deleteAssData(scope.$index)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" prop="name" min-width="150"  align="center">
                                <template scope="scope">
                                    <div>{{scope.row.name}}<i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer" @click="showAssGoods(scope.$index)"></i></div>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品品牌" prop="brandName"  align="center"></el-table-column>
                            <el-table-column label="规格型号" prop="specModel"  align="center"></el-table-column>
                            <el-table-column label="订货号" prop="itemNo" align="center"></el-table-column>
                            <el-table-column label="图片" prop="picUrl" align="center">
                                <template slot-scope="scope">
                                    <el-image :src="scope.row.picUrl" style="width: 80px"></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="产品面价" prop="retailPrice" align="center"></el-table-column>
                            <el-table-column label="折扣" prop="retailDiscount" align="center"></el-table-column>
                            <el-table-column label="折扣价" prop="retailPrice" align="center"></el-table-column>
                            <el-table-column label="计量单位" prop="measureUnitName" align="center"></el-table-column>
                            <el-table-column label="条形码" prop="stripeCode" align="center"></el-table-column>
                            <el-table-column label="库存数量" prop="stock" align="center"></el-table-column>
                            <el-table-column label="起订量" prop="moqMinOrder" align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </basic-container>
        <!--        商品系列选择对话框-->
        <goods-series-selector v-if="showSeriesSelector" :dialogVisible="showSeriesSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></goods-series-selector>
        <!--        商品品牌选择对话框-->
        <brand-manager-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></brand-manager-selector>
        <!--        商品分类选择对话框-->
        <goods-classify-selector v-if="showClassifySelector" :dialogVisible="showClassifySelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></goods-classify-selector>
        <!--        全部商品关联选择框-->
        <all-goods-selector v-if="showAllGoodsSelector" :dialogVisible="showAllGoodsSelector" title="选择关联商品" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></all-goods-selector>
    </bill-container>
</template>

<script>
    import {addGoods,findMeasureUnit,goodsDetail,updateGoods} from '@/api/erp/saas/allGoods'
    let xss=require('xss')
    export default {
        name: "allGoodsForm",
        props: ['type', 'id','title','rowData'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'goodsSeriesSelector': () => import('@/components/saas/goodsSeriesSelector'),
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
            'goodsClassifySelector': () => import('@/components/saas/goodsClassifySelector'),
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
        },
        data() {
            return {
                tags:[],//商品标签存储数组
                addList:{//新增&编辑&详情商品数据存储对象
                    goods:{//商品信息数据集合
                        picUrl:'',//商品列表图
                        seriesName:'　',//商品系列名
                        brandName:'　',//品牌名
                        categoryName:'　',//商品分类名
                        gallery:[],//商品主图数据集合
                        isOnSale:true,
                    },
                    items:[{}],//商品关联数据存储数组
                    values:[],//规格参数数据集合
                },
                editorOptions:{
                    //普通图片上传
                    action: "api/saas/storage/create",
                    customConfig: {
                        uploadImgHooks:{
                            success: function (xhr, editor, result) {
                                // 图片上传并返回结果，图片插入成功之后触发
                                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                                this.showError('777')
                            },
                        }
                    },//wangEditor编辑的配置
                    props: {
                        res: "data",
                        url: "url"
                    },
                },
                rules: {//新增商品表单验证
                    'goods.name': [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
                    'goods.seriesName': [{required: true, message: '商品系列不能为空', trigger: 'blur'}],
                    'goods.brandName': [{required: true, message: '品牌不能为空', trigger: 'blur'}],
                    'goods.categoryName': [{required: true, message: '商品分类不能为空', trigger: 'blur'}],
                    'goods.specModel': [{required: true, message: '规格型号不能为空', trigger: 'blur'}],
                    'goods.itemNo': [{required: true, message: '订货号不能为空', trigger: 'blur'}],
                    'goods.stock': [
                        {required: true, message: '库存不能为空', trigger: 'blur'},
                        {type: 'number', message: '库存只能为数字', trigger: 'blur'},
                    ],
                    'goods.productFacePrice': [{required: true, message: '产品面价不能为空', trigger: 'blur'}],
                    'goods.moqMinOrder': [{type: 'number', message: '起订量只能为数字', trigger: 'blur'}],
                    'goods.synergyStock': [{type: 'number', message: '调拨库存只能为数字', trigger: 'blur'}],
                    'goods.retailPrice': [
                        // {type: 'number', message: '产品面价只能为数字', trigger: 'blur'},
                        {required: true, message: '产品面价不能为空', trigger: 'blur'}
                        ],
                },
                tableData:[[]],//新增商品单位价格数据存储数组
                tableHeader:['预设折扣1','预设价格1',],//新增商品单位价格表头数据存储数组
                tableHeaderKey:['presetDiscount1','defaultPrice1'],//新增商品单位价格表头键名数据存储数组
                showSeriesSelector:false,//是否展示商品系列选择框
                showBrandSelector:false,//是否展示商品品牌选择框
                showClassifySelector:false,//是否展示商品分类选择框
                showAllGoodsSelector:false,//是否展示全部商品关联选择框
                MeasureUnit:[],//计量单位存储数组
                goodsTags:[],//商品标签存储数组
                specifications:[],//规格参数数据存储数组
                inputVisible:false,//展示添加商品属性输入框
                specificationTags:[],//商品属性存储数组
                inputValue:'',//商品属性输入框绑定值
                clickRow:Number,//当前关联商品中点击的行索引
                isChooseTags:false,//是否禁用选择标签
                picList:[],//商品列表图存储数组
                galleryList:[],//商品主图存储数组
                isView:false,//是否为详情页
                isLoading: false,//当前是否显示载入状态
                activeName: 'first',//当前标签页
                noItemsNo:false,//是否不传订货号
            };
        },
        created() {
            this.init();
            /*初始化时如果router中携带了参数id就代表是从编辑或详情中进入,之后根据携带的id查询相应的商品信息*/
            if(this.$route.query.id){
                goodsDetail(this.$route.query.id).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=this.dataFormat(res.data.data)
                    }else{
                        this.showError('获取商品详细信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取商品详细信息失败,'+error))
            }
        },
        destroyed() {},
        updated() {},
        computed:{
            openERP(){
                return this.$store.getters.openERP*1
            }
        },
        methods: {
            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                /*data.type:当前数据返回的是何种数据*/
                if(data.type==='series'){
                    this.addList.goods.seriesName=data.arr.name
                    this.addList.goods.seriesId=data.arr.id
                    if(data.arr.brandName&&data.arr.brandName!==''){
                        this.addList.goods.brandName=data.arr.brandName
                        this.addList.goods.brandId=data.arr.brandId
                    }
                    if(data.arr.seriesName&&data.arr.seriesName!==''){
                        this.addList.goods.categoryName=data.arr.seriesName
                        this.addList.goods.categoryId=data.arr.seriesId
                    }
                    let dtoList=data.arr.dtoList||[]
                    for(let i=0;i<dtoList.length;i++){
                        if(dtoList[i].value){
                            let data={
                                specifications: dtoList[i].specifications,
                                value:dtoList[i].value?dtoList[i].value.split(','):[]
                            }
                            this.specifications.push(data)
                            data={
                                productAttributeName: dtoList[i].specifications,
                            }
                            if(!this.addList.values){
                                this.addList.values=[]
                            }
                            this.addList.values.push(data)
                        }
                    }
                    this.showSeriesSelector=false
                }else if(data.type==='brand'){
                    this.addList.goods.brandName=data.brandName
                    this.addList.goods.brandId=data.brandId
                    this.showBrandSelector=false
                }else if(data.type==='goodsClassify'){
                    this.addList.goods.categoryName=data.seriesName
                    this.addList.goods.categoryId=data.seriesId
                    this.showClassifySelector=false
                }else if(data.type==='allGoods'){
                    for(let i=0;i<data.arr.length;i++){
                        //不允许关联自己
                        if(data.arr[i].id!==this.addList.goods.id){
                            let flag=false
                            for(let j=0;j<this.addList.items.length;j++){
                                //当前行是否为空行 是则替换 否则push
                                if(this.addList.items[j]===null||this.addList.items[j].id){
                                    flag=true
                                }else{
                                    this.$set(this.addList.items,j,data.arr[i])
                                    flag=false
                                    break
                                }
                            }
                            if(flag){
                                this.addList.items.push(data.arr[i])
                            }
                        }
                    }
                    try {
                        let hash={}
                        this.addList.items=this.addList.items.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    }catch (e) {console.log('关联商品去重发生错误,'+e)}
                    //数组去重

                    this.showAllGoodsSelector=false
                }
            },

            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.showSeriesSelector=false
                this.showBrandSelector=false
                this.showClassifySelector=false
                this.showAllGoodsSelector=false
            },

            init() {
                //获取计量单位
                // findMeasureUnit().then(res=>{
                //     this.MeasureUnit=res.data
                // },error => this.showError('获取计量单位失败,'+error))
                //获取商品标签
                // getAllTag().then(res=>{
                //     this.goodsTags=res.data
                // },error=>this.showError('获取商品标签失败'+error))
            },

            /**
             * 商品保存事件
             */
            handleSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        // if((!this.addList.goods.picUrl)||this.addList.goods.picUrl===''){
                        //     this.$message.warning('商品列表图不能为空!')
                        //     return false
                        // }
                        if(!this.addList.values){
                            this.addList.values=[]
                        }
                        try {
                            for (let i = 0; i <this.tableHeader.length ; i++) {
                                this.addList.goods[this.tableHeaderKey[i]]=this.tableData[0][i]
                            }
                            for(let i=0;i<this.addList.values.length;i++){
                                this.addList.values[i].type=0
                                this.addList.values[i].productAttributeName=this.specifications[i].specifications
                                this.addList.values[i].value=this.addList.values[i].value.toString()
                            }
                            for (let i = 0; i <this.addList.specifications.length ; i++) {
                                this.addList.specifications[i].value=this.addList.specifications[i].value.toString()
                            }
                        }catch (e) {}
                        // this.addList.goods.tags=this.tags.toString()
                        if(this.galleryList.length>0){
                            let gallery=[]
                            for (let i = 0; i <this.galleryList.length ; i++) {
                                gallery.push(this.galleryList[i].url)
                            }
                            this.addList.goods.gallery=gallery.toString()
                        }else{
                            // this.$message.warning('商品主图不能为空!')
                            // return false
                            this.addList.goods.gallery=''
                        }
                        if((!this.addList.items)||(!this.addList.items[0])||(!this.addList.items[0].id)){
                            this.addList.items=[]
                        }
                        this.addList.goods.isOnSale=Number(this.addList.goods.isOnSale)
                        let dto=JSON.parse(JSON.stringify(this.addList))
                        dto.values=dto.values.concat(this.specificationTags)
                        let method=this.$route.query.flag==='add'?addGoods:updateGoods
                        let message=this.$route.query.flag==='add'?'商品新建':'商品修改'
                        // delete this.addList.categoryIds
                        // delete this.addList.productAttributes
                        method(dto).then(res=>{
                            if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                this.$message.success(message+'成功')
                                this.$router.push({
                                    path:'/refresh',
                                })
                                // this.$router.push({
                                //     path:'/shop/goodsControl/allGoods',
                                //     query:{
                                //         myRefresh:true
                                //     }
                                // })
                            }else{
                                this.showError(message+'失败,'+res.data.msg||res.data.data,res.data.code)
                            }
                        },error=>this.showError(message+'失败,'+error))
                    } else {
                        return false;
                    }
                });
            },

            /**
             * 删除新增的预设折扣和预设价格
             */
            deleteTableData(){
                if(this.isView){
                    return false
                }
                if(this.tableHeader.length>2){
                    this.tableHeader.splice(this.tableHeader.length-2)
                    this.tableHeaderKey.splice(this.tableHeaderKey.length-2)
                }
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if (Number(code)===401){
                    this.$message.warning(message)
                }else{
                    this.$message.error(message)
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
             * 增加预设折扣和预设价格
             */
            addTableData(){
                if(this.isView){
                   return false
                }
                if(this.tableHeader.length<9) {
                    let nowIndex = this.tableHeader[this.tableHeader.length - 2].replace(/[^0-9]/ig, "")
                    this.tableHeader.splice(this.tableHeader.length, 0, '预设折扣' + (Number(nowIndex) + 1))
                    this.tableHeader.splice(this.tableHeader.length, 0, '预设价格' + (Number(nowIndex) + 1))
                    this.tableHeaderKey.splice(this.tableHeaderKey.length, 0, 'presetDiscount' + (Number(nowIndex) + 1))
                    this.tableHeaderKey.splice(this.tableHeaderKey.length, 0, 'defaultPrice' + (Number(nowIndex) + 1))
                }else{
                    this.$message.warning('预设折扣和预设价格最多为5个')
                }
            },

            /**
             * 商品列表图上传成功事件
             * @param res 响应数据
             * @param file 图片文件
             */
            goodsListPic(res,file){
                this.$set(this.addList.goods,'picUrl',res.data.url)
                // this.addList.goods.picUrl=
            },

            /**
             * 主图视频上传成功事件
             * @param res 响应数据
             * @param file 图片文件
             */
            goodsMainVideo(res,file){
                this.$set(this.addList.goods,'video',res.data.url)
                // this.addList.goods.picUrl=
            },

            /**
             * 标签删除方法
             * @param arr 当前标签存储数组
             * @param tag 当前标签
             * @param index 当前数组在父数组索引
             */
            handleCloseTag(arr,tag,index) {
                arr.splice(this.specificationTags.indexOf(tag), 1);
            },

            /**
             *展示添加属性名称输入框
             */
            showInput() {
                this.inputVisible = true;
            },

            /**
             * ???
             */
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    let data={
                        value:'',
                        productAttributeName:inputValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                        type:1
                    }
                    this.specificationTags.push(data);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            /**
             * 新增关联商品行
             */
            addAssData(){
                if(this.isView){
                    return false
                }
                this.addList.items.push({})
            },

            /**
             * 删除关联商品行
             * @param index 当前行索引
             */
            deleteAssData(index){
                if(this.isView){
                    return false
                }
                this.addList.items.splice(index,1)
                if(this.addList.items.length===0){
                    this.addList.items=[{}]
                }
            },

            /**
             * 放大镜图标点击事件
             * @param index 当前行索引
             */
            showAssGoods(index){
                if(this.isView){
                    return false
                }
                this.showAllGoodsSelector=true
                this.clickRow=index
            },

            /**
             * 编辑&详情数据格式化
             * @param data 需要格式化的数据
             */
            dataFormat(data){
                try {
                    //Object.assign(this.$data, this.$options.data())
                    if(this.$route.query.flag==='view') {
                        this.isView = true
                    }
                    if(this.$route.query.flag==='view'||this.$route.query.flag==='edit'){
                        this.isChooseTags=true
                    }
                    data.goods.isOnSale=!Boolean(data.goods.isOnSale)
                    if(data.goods.gallery&&data.goods.gallery!==''){
                        data.goods.gallery=data.goods.gallery.split(',')
                        for (let i = 0; i <data.goods.gallery.length ; i++) {
                            this.galleryList.push({
                                url:data.goods.gallery[i],
                                uid:data.goods.gallery[i]
                            })
                        }
                    }

                    // /*商品标签处理*/
                    // if(data.goods.tags&&data.goods.tags!==''){
                    //     this.tags=data.goods.tags.split(',')
                    // }



                    /*商品列表图数据处理*/
                    if(data.goods.picUrl&&data.goods.picUrl!==''){
                        this.picList=[{
                            url:data.goods.picUrl
                        }]
                    }

                    /*关联商品处理*/
                    data.items=JSON.parse(JSON.stringify(data.item))
                    delete  data.item
                    console.log(data.items,'数据格式化的数组')
                    //如果为空则新建一行空行提供新增
                    if(data.items.length<1){
                        data.items=[{}]
                    }

                    /*规格参数进行组装&&规格参数进行默认填充*/
                    data.values=[]
                    let readyValues=[]
                    for (let i = 0; i <data.specifications.length ; i++) {
                        console.log('监测点0',)
                        if(data.specifications[i].value&&data.specifications[i].value!==''){
                            console.log('监测点04',data.specifications[i])
                            data.specifications[i].value = data.specifications[i].value.split(',')
                        }else{
                            console.log('监测点05',)
                            data.specifications[i].value=''
                        }
                        //商品系列的规格参数与设置的默认值进行匹配
                        for (let j = 0; j <data.productAttributes.length ; j++) {
                            if(data.productAttributes[j].type===0){
                                console.log('监测点1',)
                                if(data.productAttributes[j].productAttributeName===data.specifications[i].specifications){
                                    console.log('监测点2',i)
                                    data.values.push({
                                        value:data.productAttributes[j].value
                                    })
                                }
                            }
                        }
                        readyValues.push({
                            value: ''
                        })
                    }
                    for (let i = 0; i <data.values.length ; i++) {
                        if(!data.values[i].value){
                            data.values[i].value=''
                        }
                    }
                    console.log('监测点6',data.values)
                    this.specifications=data.specifications//规格参数属性选择值


                    /*商品属性进行清空*/
                    this.specificationTags=[]
                    for (let i = 0; i <data.productAttributes.length ; i++) {
                        if(data.productAttributes[i].type!==0){
                            this.specificationTags.push({
                                value:data.productAttributes[i].value,
                                productAttributeName:data.productAttributes[i].productAttributeName,
                                type:1
                            })
                        }
                    }
                    if(data.goods.presetDiscount5||data.goods.defaultPrice5){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3','预设折扣4','预设价格4','预设折扣5','预设价格5']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3','presetDiscount4','defaultPrice4','presetDiscount5','defaultPrice5']
                    }else if(data.goods.presetDiscount4||data.goods.defaultPrice4){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3','预设折扣4','预设价格4']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3','presetDiscount4','defaultPrice4']
                    }else if(data.goods.presetDiscount3||data.goods.defaultPrice3){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3']
                    }else if(data.goods.presetDiscount2||data.goods.defaultPrice2){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2']
                    }
                    this.tableData=[[data.goods.presetDiscount1||'',data.goods.defaultPrice1||'',data.goods.presetDiscount2||'',data.goods.defaultPrice2||'',data.goods.presetDiscount3||'',data.goods.defaultPrice3||'',data.goods.presetDiscount4||'',data.goods.defaultPrice4||'',data.goods.presetDiscount5||'',data.goods.defaultPrice5||'']]
                    if(data.values.length===0){
                        data.values=readyValues
                    }
                    console.log(data,'格式化完毕',this.specifications)
                    //获取商品标签
                    // getAllTag().then(res=>{
                    //     this.goodsTags=res.data
                    // },error=>this.showError('获取商品标签失败'+error))
                }catch (e) {console.log(e,'数据格式化错误')}
                return data
            },

            /**
             * 输入零售价或零售折扣时根据产品面价互相更改
             * @param type 当前输入类型
             */
            computeWithFace(type){
                if (type==='折扣'){
                    this.addList.goods.retailDiscountPrice=this.accMulti(this.addList.goods.retailPrice,this.addList.goods.retailDiscount).toFixed(4)
                    return true;
                }else if(type==='价格'){
                    this.addList.goods.retailDiscount=this.division(this.addList.goods.retailDiscountPrice,this.addList.goods.retailPrice).toFixed(4)
                    return true;
                } else if (type==='零售折扣'){
                    this.addList.goods.costPrice=this.accMulti(this.addList.goods.retailPrice,this.addList.goods.customerDiscount).toFixed(4)
                    return true;
                }else if(type==='零售价格'){
                    this.addList.goods.customerDiscount=this.division(this.addList.goods.costPrice,this.addList.goods.retailPrice).toFixed(4)
                    return true;
                }
                if(Number(type)%2===0){
                    this.$set(this.tableData[0],type+1,this.accMulti(this.addList.goods.retailPrice,this.tableData[0][type]).toFixed(4))
                }else{
                    this.$set(this.tableData[0],type-1,this.division(this.tableData[0][type],this.addList.goods.retailPrice).toFixed(4))
                }

            },

            delGoodsMainPic(file,fileList){
                //console.log(file,fileList,this.galleryList,'77')
                this.galleryList=fileList
            },

            uploadGoodsMainPic(res){
                res.data.uid=res.data.url
               // console.log(res,'788')
                this.galleryList.push(res.data)
            },

            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            removeUpload(flag){
                this.addList.goods[flag]=''
            }
    },
        watch: {
            '$route': function (to, from) {
                this.addList={goods:{
                        picUrl:'',//商品列表图
                        seriesName:'　',//商品系列名
                        brandName:'　',//品牌名
                        categoryName:'　',//商品分类名
                        gallery:[],//商品主图数据集合
                    }}
                this.tableData=[[]]
                this.tags=[]
                this.galleryList=[]
                this.picList=[]
                this.isView=false
                if(this.$route.query.flag==='edit'||this.$route.query.flag==='view'){
                    this.isChooseTags=true
                    if(this.$route.query.flag==='view'){
                        this.isView=true
                    }
                    goodsDetail(this.$route.query.id).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.addList=this.dataFormat(res.data.data)
                        }else{
                            this.showError('获取商品详细信息失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('获取商品详细信息失败,'+error))
                }else{
                    this.isChooseTags=false
                }
            },

        },
    };
</script>
<style scoped>
    h3{
        font-size: 1.17em;
    }
</style>
<style>
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
        width: 148px!important;
        height: 148px!important;
        line-height: 148px!important;
        text-align: center;
    }
    .avatar {
        width: 148px!important;
        height: 148px!important;
        display: block;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .goodsTable .el-input__inner{
        border: 0!important;
    }

    .ql-snow .ql-picker{
        height: unset!important;
    }
    .quill-editor{
        max-height: unset!important;
        height: unset!important;
    }
    .avue-ueditor .ql-editor{
        min-height: 400px;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .goods-video-remove{
        display: none;
        z-index: 200;
    }
    .el-upload:hover .goods-video-remove{
        display: block;
    }
    .goods-pic-remove{
        display: none;
        z-index: 200;
    }
    .el-upload:hover .goods-pic-remove{
        display: block;
    }
</style>
