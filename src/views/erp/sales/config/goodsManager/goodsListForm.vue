<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :formOption="formOption1"
                        :formOptionTwo="formOptionTwo"
                        objectKey="SPLB"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: false,formBtn:true}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"
                        @handlesSettingSubmit="handlesSettingSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基本信息" name="first">
                        <avue-form v-model="formData" :option="formOption1" ref="form1" @submit="handleSubmit"
                                   class="main-form" v-if="isShow" :disabled="formOption.disabled">
                            <template slot-scope="scope" slot="retailPrice">
                                <div class="tableItem">
                                    <el-tooltip class="item" effect="dark" content="官方指导价即市面统一价格" placement="top-start">
                                        <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                                    </el-tooltip>
                                    <el-input v-model="formData.retailPrice" placeholder="请输入商品面价"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="allocationPrice">
                                <div class="tableItem">
                                    <el-tooltip class="item" effect="dark"
                                                content="公司给到销售员进行商品销售的成本价即销售员利润=售价-调拨价，注：销售员独立考核时使用"
                                                placement="top-start">
                                        <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                                    </el-tooltip>
                                    <el-input v-model="formData.allocationPrice" placeholder="请输入调拨价"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="grossWeight">
                                <div style="display: flex;flex-direction: row;justify-content: space-between;">
                                    <el-input v-model="formData.grossWeight" placeholder="请输入重量"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">kg</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="categoryIds">
                                <div>
                                    <el-cascader expand-trigger="hover" :options="categoryList"
                                                 v-model="formData.categoryIds"
                                                 @change="handleCategoryChange" :change-on-select="true"
                                                 filterable></el-cascader>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="brandId">
                                <el-select v-model="formData.brandId"
                                           :disabled="type=='view'?true:false" filterable @change="handleChangebrand">
                                    <el-option
                                            v-for="item in brandOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                            <template slot-scope="scope" slot="seriesId">
                                <el-select v-model="formData.seriesId"
                                           :disabled="type=='view'?true:false" filterable @focus="brandBtn">
                                    <el-option
                                            v-for="item in seriesOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </avue-form>
                    </el-tab-pane>
                    <el-tab-pane label="多级价格" name="second">
                        <avue-form v-model="formData" :option="formOption2" ref="form" @submit="handleSubmit"
                                   class="main-form" v-if="isShow" :disabled="formOption.disabled">
                            <template slot-scope="scope" slot="discountLevel1">
                                <div class="tableItem">
                                    <el-input v-model="formData.discountLevel1" placeholder="请输入一级折扣" @blur="discountBtn('discountLevel1',formData.discountLevel1)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">%</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discountLevel2">
                                <div class="tableItem">
                                    <el-input v-model="formData.discountLevel2" placeholder="请输入二级折扣" @blur="discountBtn('discountLevel2',formData.discountLevel2)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">%</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discountLevel3" >
                                <div class="tableItem">
                                    <el-input v-model="formData.discountLevel3" placeholder="请输入三级折扣" @blur="discountBtn('discountLevel3',formData.discountLevel3)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">%</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discountLevel4">
                                <div class="tableItem">
                                    <el-input v-model="formData.discountLevel4" placeholder="请输入四级折扣" @blur="discountBtn('discountLevel4',formData.discountLevel4)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">%</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discountLevel5">
                                <div class="tableItem">
                                    <el-input v-model="formData.discountLevel5" placeholder="请输入五级折扣" @blur="discountBtn('discountLevel5',formData.discountLevel5)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">%</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="priceLevel1">
                                <div class="tableItem">
                                    <el-input v-model="formData.priceLevel1" placeholder="请输入一级价格" @blur="discountBtn('priceLevel1',formData.priceLevel1)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">￥</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="priceLevel2">
                                <div class="tableItem">
                                    <el-input v-model="formData.priceLevel2" placeholder="请输入二级价格" @blur="discountBtn('priceLevel2',formData.priceLevel2)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">￥</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="priceLevel3" >
                                <div class="tableItem">
                                    <el-input v-model="formData.priceLevel3" placeholder="请输入三级价格" @blur="discountBtn('priceLevel3',formData.priceLevel3)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">￥</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="priceLevel4">
                                <div class="tableItem">
                                    <el-input v-model="formData.priceLevel4" placeholder="请输入四级价格" @blur="discountBtn('priceLevel4',formData.priceLevel4)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">￥</div>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="priceLevel5">
                                <div class="tableItem">
                                    <el-input v-model="formData.priceLevel5" placeholder="请输入五级价格" @blur="discountBtn('priceLevel5',formData.priceLevel5)"
                                              :disabled="type=='view'?true:false"></el-input>
                                    <div style="color: #C0C4CC;margin-right: 8px;">￥</div>
                                </div>
                            </template>
                        </avue-form>
                    </el-tab-pane>
                    <el-tab-pane label="库存预警" name="third">
                        <avue-form v-model="formData" :option="formOption3" ref="form" @submit="handleSubmit"
                                   class="main-form" v-if="isShow" :disabled="formOption.disabled">
                            <template slot-scope="scope" slot="upperQty">
                                <div class="tableItem">
                                    <el-input v-model="formData.upperQty" placeholder="请输入库存上限"
                                              @blur="publicColumnBlurs(formData.upperQty,'upperQty')"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="floorQty">
                                <div class="tableItem">
                                    <el-input v-model="formData.floorQty" placeholder="请输入库存下限"
                                              @blur="publicColumnBlurs(formData.floorQty,'floorQty')"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-form>
                    </el-tab-pane>
                    <el-tab-pane label="图片信息" name="fourth">
                        <avue-form  v-model="formData" :option="formOption4" ref="form" @submit="handleSubmit"
                                   class="main-form" v-if="isShow" :disabled="formOption.disabled">
                            <template slot-scope="scope" slot="picUrl">
                                <div style="margin-left: 10px;">
                                    <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card" :disabled="type=='view'?true:false"
                                               :show-file-list="false"
                                               accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                                        <img v-if="formData.picUrl" :src="formData.picUrl"
                                             style="max-width: 148px;max-height:148px;display: block;">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        <i v-if="formData.picUrl&&type!='view'" class="el-icon-delete el-icona"
                                           @click.stop="deletePreview"></i>
                                    </el-upload>
                                </div>
                            </template>
                        </avue-form>
                    </el-tab-pane>
                </el-tabs>

                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        addGoods,
        updateGoods,
        listCatAndBrand,
        getAttributeBaseAll,
        getGoodsDetail,
        getSpecificationBaseAll,
        queryParamsAndAttrByGoodsTypeId
    } from '@/api/erp/goods/goods'
    import {pageAll, allBrand, selectByBrandId} from '@/api/erp/financial/financialPaymentsMeans';
    import {commodityOption, positionOption, userOption, relationsOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {uploadPath} from '@/api/erp/goods/storage'

    export default {
        name: "goodsListForm",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                uploadPath,
                positionIndex: 0,
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                index: 0,
                associatedName: '',
                activeName: 'first',
                brandOptions: [],
                seriesOptions: [],
                formOptionTwo: this.formOptionTwo,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column:
                        [
                            {
                                label: "id",
                                prop: "id",
                                display: false
                            },
                            {
                                label: "商品名称",
                                prop: "name",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入商品名称",
                                    trigger: "change"
                                }]
                            },
                            // {
                            //     label: "商品标题",
                            //     formslot: true,
                            //     prop: "title",
                            //     span: 6,
                            // },
                            {
                                label: "订货号",
                                prop: "itemNo",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入订货号",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "规格型号",
                                prop: "specModel",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入规格型号",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "所属分类",
                                prop: "categoryIds",
                                span: 6,
                                no:false,
                                formslot: true,
                                rules: [{
                                    required: true,
                                    message: "请选择所属分类",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "所属品牌",
                                prop: "brandId",
                                span: 6,
                                no:false,
                                formslot: true,
                                rules: [{
                                    required: true,
                                    message: "请选择所属品牌",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "所属系列",
                                prop: "seriesId",
                                span: 6,
                                type: 'select',
                                align: 'center',
                                no:false,
                                formslot: true,
                            },
                            {
                                label: "计量单位",
                                prop: "unit",
                                no:false,
                                span: 6,
                                type: 'select',
                                align: 'center',
                                dicMethod: 'get',
                                dicUrl: '/api/dict/dictValue/dictType/comm_tmp_unit',
                                props: {
                                    value: 'labelDefault',
                                    label: 'labelDefault'
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择计量单位",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "商品面价",
                                prop: "retailPrice",
                                span: 6,
                                formslot: true,
                                rules: [{
                                    required: true,
                                    message: "请输入商品面价",
                                    trigger: "change"
                                }]
                            },
                            // {
                            //     label: "预计采购价",
                            //     prop: "purchasePrice",
                            //     span: 6,
                            //     formslot: true,
                            // },
                            // {
                            //     label: "调拨折扣",
                            //     prop: "allocationDiscount",
                            //     span: 6,
                            //     formslot: true
                            // },
                            {
                                label: "商品调拨价",
                                prop: "allocationPrice",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "库存上限",
                                prop: "upperQty",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "库存下限",
                                prop: "floorQty",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "最少起订量",
                                prop: "moqMinOrder",
                                span: 6,
                            },
                            {
                                label: "重量",
                                prop: "grossWeight",
                                span: 6,
                                formslot: true
                            },
                            // {
                            //     label: "安全折扣",
                            //     prop: "safeDiscount",
                            //     span: 6,
                            //     formslot: true
                            // },
                            // {
                            //     label: "安全价格",
                            //     prop: "safePrice",
                            //     span: 6,
                            //     formslot: true
                            // },
                            // {
                            //     label: "批发价",
                            //     prop: "userCode",
                            //     span: 6,
                            // },
                            // {
                            //     label: "批发折扣价",
                            //     prop: "userCode",
                            //     span: 6,
                            // },
                            // {
                            //     label: "零售价",
                            //     prop: "userCode",
                            //     span: 6,
                            // },
                            // {
                            //     label: "零售折扣",
                            //     prop: "userCode",
                            //     span: 6,
                            // },
                            // {
                            //     label: "安全库存",
                            //     prop: "safeQty",
                            //     span: 6,
                            //     formslot: true
                            // },
                            {
                                label: "一级折扣",
                                prop: "discountLevel1",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "二级折扣",
                                prop: "discountLevel2",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "三级折扣",
                                prop: "discountLevel3",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "四级折扣",
                                prop: "discountLevel4",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "五级折扣",
                                prop: "discountLevel5",
                                span: 6,
                                formslot: true
                            },
                            {
                                label: "关键字",
                                prop: "keywords",
                                span: 12,
                            },
                            {
                                label: "商品描述",
                                prop: "brief",
                                type: 'textarea',
                                row: true,
                                span: 24,
                            },
                            {
                                label: "商品图片",
                                prop: "picUrl",
                                row: true,
                                span: 24,
                                formslot: true,
                            },
                            // {
                            //     label: "商品详情介绍",
                            //     prop: "detail",
                            //     type: 'textarea',
                            //     row: true,
                            //     span: 24,
                            // },
                        ]
                },
                formOption1: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            display: false
                        },
                        {
                            label: "商品名称",
                            prop: "name",
                            span: 12,
                            no:false,
                            rules: [{
                                required: true,
                                message: "请输入商品名称",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "所属品牌",
                            prop: "brandId",
                            no:false,
                            span: 12,
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请选择所属品牌",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "所属系列",
                            prop: "seriesId",
                            span: 12,
                            type: 'select',
                            align: 'center',
                            no:false,
                            formslot: true,
                        },
                        {
                            label: "规格型号",
                            prop: "specModel",
                            no:false,
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入规格型号",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            span: 12,
                        },
                        {
                            label: "商品面价",
                            prop: "retailPrice",
                            span: 12,
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请输入商品面价",
                                trigger: "change"
                            }]
                        },
                        // {
                        //     label: "调拨折扣",
                        //     prop: "allocationDiscount",
                        //     span: 12,
                        //     formslot: true
                        // },
                        {
                            label: "商品调拨价",
                            prop: "allocationPrice",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "所属分类",
                            prop: "categoryIds",
                            span: 12,
                            formslot: true,
                            no:false,
                            rules: [{
                                required: true,
                                message: "请选择所属分类",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "最少起订量",
                            prop: "moqMinOrder",
                            span: 12
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            span: 12,
                            type: 'select',
                            no:false,
                            align: 'center',
                            dicMethod: 'get',
                            dicUrl: '/api/dict/dictValue/dictType/comm_tmp_unit',
                            props: {
                                value: 'labelDefault',
                                label: 'labelDefault'
                            },
                            rules: [{
                                required: true,
                                message: "请选择计量单位",
                                trigger: "change"
                            }]
                        },
                        // {
                        //     label: "预计采购价",
                        //     prop: "purchasePrice",
                        //     span: 12,
                        //     formslot: true,
                        // },
                        // {
                        //     label: "安全价格",
                        //     prop: "safePrice",
                        //     span: 12,
                        //     formslot: true
                        // },
                        // {
                        //     label: "安全折扣",
                        //     prop: "safeDiscount",
                        //     span: 12,
                        //     formslot: true
                        // },
                        // {
                        //     label: "重量",
                        //     prop: "grossWeight",
                        //     span: 12,
                        //     formslot: true
                        // },
                        {
                            label: "商品描述",
                            prop: "brief",
                            type: 'textarea',
                            row: true,
                            span: 24,
                        }
                    ]
                },
                formOption2: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "一级折扣",
                            prop: "discountLevel1",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "一级价格",
                            prop: "priceLevel1",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "二级折扣",
                            prop: "discountLevel2",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "二级价格",
                            prop: "priceLevel2",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "三级折扣",
                            prop: "discountLevel3",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "三级价格",
                            prop: "priceLevel3",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "四级折扣",
                            prop: "discountLevel4",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "四级价格",
                            prop: "priceLevel4",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "五级折扣",
                            prop: "discountLevel5",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "五级价格",
                            prop: "priceLevel5",
                            span: 12,
                            formslot: true
                        }
                    ]
                },
                formOption3: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column:
                        [
                            {
                                label: "库存上限",
                                prop: "upperQty",
                                span: 12,
                                formslot: true
                            },
                            {
                                label: "库存下限",
                                prop: "floorQty",
                                span: 12,
                                formslot: true
                            }
                        ]
                },
                formOption4: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column:
                        [
                            {
                                label: "商品图片",
                                prop: "picUrl",
                                row: true,
                                span: 24,
                                formslot: true,
                            }
                        ]
                },
                option: [],
                categoryList: [],
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
        },
        destroyed() {
        },
        updated() {
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            getConfigList() {
                this.setLists(this, 'SPLB');
            },
            handlesSettingSubmit(obj){
              this.isShow = false;
                for(let i in obj){
                    if(obj[i].type == 4){
                        this.formOptionTwo = JSON.parse(obj[i].content);
                    }
                    if(obj[i].type == 3){
                        this.formOption1 =  JSON.parse(obj[i].content);
                    }
                }
                for(let j in this.formOptionTwo){
                    if(this.formOptionTwo[j].display == true){
                        this.formOption1.column.push(this.formOptionTwo[j])
                    }
                }
                this.isShow = true;
            },
            discountBtn(type,val){
                let sum = true;
                if(this.formData.retailPrice == undefined || this.formData.retailPrice == ''){
                    this.vueMessage('warning','请先输入商品面价!')
                    return
                }
                if (!isNaN(val) && (val * 1) > -1) {
                    sum = true;
                }else{
                    sum = false;
                }
                if(type=='discountLevel1'){
                    this.formData.priceLevel1 = sum ? (this.formData.retailPrice * (val/100)).toFixed(2): '';
                }
                if(type=='priceLevel1'){
                    this.formData.discountLevel1 = sum ?  ((val / this.formData.retailPrice)*100).toFixed(2): '';
                }
                if(type=='discountLevel2'){
                    this.formData.priceLevel2 = sum ?  (this.formData.retailPrice *  (val/100)).toFixed(2): '';
                }
                if(type=='priceLevel2'){
                    this.formData.discountLevel2 = sum ?  ((val / this.formData.retailPrice)*100).toFixed(2): '';
                }
                if(type=='discountLevel3'){
                    this.formData.priceLevel3 = sum ?  (this.formData.retailPrice *  (val/100)).toFixed(2): '';
                }
                if(type=='priceLevel3'){
                    this.formData.discountLevel3 = sum ?  ((val / this.formData.retailPrice)*100).toFixed(2): '';
                }
                if(type=='discountLevel4'){
                    this.formData.priceLevel4 = sum ?  (this.formData.retailPrice *  (val/100)).toFixed(2): '';
                }
                if(type=='priceLevel4'){
                    this.formData.discountLevel4 = sum ?  ((val / this.formData.retailPrice)*100).toFixed(2): '';
                }
                if(type=='discountLevel5'){
                    this.formData.priceLevel5 = sum ?  (this.formData.retailPrice *  (val/100)).toFixed(2): '';
                }
                if(type=='priceLevel5'){
                    this.formData.discountLevel5 = sum ?  ((val / this.formData.retailPrice)*100).toFixed(2): '';
                }
            },
            deletePreview() {
                this.formData.picUrl = ''
            },
            handleChangebrand(val) {
                if(val != undefined) {
                    selectByBrandId(val).then(res => {
                        this.seriesOptions = res.data.data;
                    })
                }
            },
            publicColumnBlurs(val, type) {
                if (type == 'upperQty') {
                    if (this.formData.floorQty != undefined || this.formData.floorQty != '') {
                        if (this.formData.upperQty* 1 <= this.formData.floorQty* 1) {
                            this.vueMessage('warning', '库存上限不能小于库存下限');
                            this.formData.upperQty = ''
                        }
                    }
                }
                if (type == 'floorQty') {
                    console.log(this.formData.upperQty)
                    console.log(this.formData.floorQty)
                    console.log(this.formData.upperQty <= this.formData.floorQty)
                    if (this.formData.upperQty != undefined && this.formData.upperQty != '') {
                        if (this.formData.upperQty * 1 <= this.formData.floorQty * 1) {
                            this.vueMessage('warning', '库存上限不能小于库存下限');
                            this.formData.floorQty = ''
                        }
                    }
                }
            },
            // publicColumnBlur(val,type){
            //     if(!this.formData.retailPrice){
            //         this.vueMessage('warning','请先输入面价!');
            //         this.formData.allocationDiscount = '';
            //         this.formData.safeDiscount = '';
            //         this.formData.presetDiscount = '';
            //         return
            //     }
            //     if(type == 'allocationDiscount'){
            //         this.formData.allocationDiscount = Number(this.formData.allocationDiscount).toFixed(this.sysParam.discountDecimal);
            //         this.formData.allocationPrice = (this.formData.retailPrice * this.formData.allocationDiscount).toFixed(this.sysParam.amountDecimal);
            //     }
            //     if(type == 'allocationPrice'){
            //         this.formData.allocationDiscount = (this.formData.allocationPrice / this.formData.retailPrice).toFixed(this.sysParam.amountDecimal);
            //     }
            //     if(type == 'safeDiscount'){
            //         this.formData.safeDiscount = Number(this.formData.safeDiscount).toFixed(this.sysParam.discountDecimal);
            //         this.formData.safePrice = (this.formData.retailPrice * this.formData.safeDiscount).toFixed(this.sysParam.amountDecimal);
            //     }
            //     if(type == 'safePrice'){
            //         this.formData.safeDiscount = (this.formData.safePrice / this.formData.retailPrice).toFixed(this.sysParam.amountDecimal);
            //     }
            //     if(type == 'presetDiscount'){
            //         this.formData.presetDiscount = Number(this.formData.presetDiscount).toFixed(this.sysParam.discountDecimal);
            //         this.formData.presetPrice = (this.formData.retailPrice * this.formData.presetDiscount).toFixed(this.sysParam.amountDecimal);
            //     }
            //     if(type == 'presetPrice'){
            //         this.formData.presetDiscount = (this.formData.presetPrice / this.formData.retailPrice).toFixed(this.sysParam.amountDecimal);
            //     }
            // },
            uploadPicUrl: function (response) {
                this.formData.picUrl = response.data.url;
            },
            handleCategoryChange(value) {
                this.formData.categoryId = value[value.length - 1]
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }

            },
            positionBtn(val, index) {
                if (this.type != 'view') {
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'positionType';
                    this.option = positionOption;
                    this.publicVisible = true;
                    this.positionIndex = index;
                }

            },
            handleAddRow() {
                const d = {
                    skuName: '',
                }
                this.formData.items.push(d);
            },
            qtyBlur(index, val) {
                if (isNaN(val)) {
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                } else {
                    if (val > this.formData.items[index].maxQty) {
                        this.vueMessage('warning', '当前值大于最大退料数量!请重新填写');
                        this.formData.items[index].qty = '';
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                        return
                    }

                }
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    if (item.skuNo) {
                        list.forEach(function (obj) {
                            if (obj.skuNo == item.skuNo) {
                                map.push(obj.skuNo);
                            }
                        });
                    }
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'userType') {
                        this.formData.userId = list[0].id;
                        this.formData.userCode = list[0].no;
                        this.formData.userName = list[0].name;
                    }
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skuName = item.goodsName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = itemObj.qty;
                            itemObj.returnQty = 0;
                            itemObj.taxPrice = item.price;
                            itemObj.unit = item.unit;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if (this.typeName == 'relationsType') {
                        this.formData.sourceBillNo = list[0].billNo;
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.materialQty = item.pickingOutQty;
                            itemObj.orderQty = item.orderQty;
                            itemObj.maxQty = Number(item.pickingOutQty) - Number(item.pickingEnterQty);
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = itemObj.qty;
                            itemObj.returnQty = 0;
                            itemObj.taxPrice = item.price;
                            itemObj.unit = item.unit;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            reload() {
                this.loading = true;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.init();
                        this.isShow = true;
                    })
                }, 17)
            },
            brandBtn() {
                if (!this.formData.brandId) {
                    this.vueMessage('warning', '请先选择所属品牌!');
                }
            },
            init() {
                this.getConfigList();
                allBrand().then(res => {
                    this.brandOptions = res.data;
                })
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                this.vueSet(this, 'formData', {});
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getGoodsDetail, this.id);
                } else {

                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
                    };
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;
                }
                listCatAndBrand().then(response => {
                    this.categoryList = this.getCategoryList(response.data.data.categoryList);
                    this.brandList = response.data.brandList;
                });
            },
            getCategoryList(data) {
                //将最底层中的 children 设为undefined
                // 循环遍历json数据
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].children || data[i].children.length < 1) {
                        // children若为空数组，则将children设为undefined
                        data[i].children = undefined;
                    } else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getCategoryList(data[i].children);
                    }
                }
                return data;
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/goodsListForm',
                    name: '商品列表制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'goodsListForm'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data.goods;
                        if(formData.brandId != undefined){
                            selectByBrandId(formData.brandId).then(val => {
                                this.seriesOptions = val.data.data;
                                formData.categoryIds = res.data.data.categoryIds;
                                this.$nextTick(() => {
                                    this.vueSet(this, 'formData', formData);
                                })
                                this.index = 0;
                            })
                        }

                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                this.$refs['form1'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = this.formData.id ? updateGoods : addGoods;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/goodsList',
                                    name: '商品列表',
                                    meta: {
                                        i18n: 'goodsList'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                            this.preventRepeatSubmit(false, type);
                        });
                    } else {
                        return false;
                    }
                });

            }
        }
    };
</script>
<style>
    .el-upload--picture-card {
        position: relative;
    }

    .el-icona {
        position: absolute;
        font-size: 16px !important;
        right: 2px;
        top: 2px;
        z-index: 9999999;
    }

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
