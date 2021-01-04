<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/sales_project_order_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>

                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="annexMuster">
                        <el-upload v-if="type != 'view'"
                                   class="upload-demo"
                                   action="/api/goods/storage/create"
                                   :on-preview="handlePreview"
                                   :on-remove="handleRemove"
                                   :before-remove="beforeRemove"
                                   multiple
                                   :on-success="handleSuccess"
                                   :file-list="fileList">
                            <el-button size="small" type="primary" style="margin-left: 6px;">点击上传</el-button>
                        </el-upload>
                        <div v-else>
                            <div v-if="formData.annexMuster">
                                <span style="cursor:pointer" @click="showDetail(item)"
                                      v-for="(item,index) in formData.annexMuster" :key="index">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud" class="bill-items-container"
                                   @current-row-change="handleCurrentRowChange" :summary-method="getSummaries">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot="menuRight">
                                <el-button type="text" icon="el-icon-download">
                                    <a :href="openUrl+'/api/manager/project-order/download'" style="color: #409EFF;">下载导入模板</a>
                                </el-button>
                                <el-upload class="upload" action="/api/manager/project-order/import"
                                           :before-upload="beforeUpload"
                                           :on-remove="handleRemove" :show-file-list="false"
                                           :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList"
                                           style="display:inline;" :on-success="uploadCompleted" :headers="headers">
                                    <el-button type="text" icon="el-icon-download">
                                        导入
                                    </el-button>
                                </el-upload>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(true)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index,true)">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择产品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div>
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div>
                                    <el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,true,'taxAmount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxRate">
                                <div>
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               :disabled="type=='view'?true:false"
                                               @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,true,'taxRate', scope.row)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="price">
                                <div>
                                    <el-input v-model="scope.row.price" placeholder="请输入单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.price,true,'price', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div>
                                    <el-input v-model="scope.row.amount" placeholder="请输入金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.amount,true,'amount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="productionTime">
                                <div>
                                    <el-input v-model="scope.row.productionTime" placeholder="请输入货期(天)"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.productionTime,true,'productionTime', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="productdescribe">
                                <div>
                                    <el-input v-model="scope.row.productdescribe" placeholder="请输入产品描述"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.productdescribe,true,'productdescribe', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input
                                            @blur="publicColumnBlur(scope.row.$index,scope.row.note,true,'note', scope.row)"
                                            v-model="scope.row.note" placeholder="请输入备注"
                                            :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                    <template slot-scope="scope" slot="items2">
                        <avue-crud :option="itemsTwoOption" :data="selectedRows.length>0?items2.items:item2.items"
                                   class="bill-items-container">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">器件清单</h3>
                            </template>
                            <template slot="menuRight">
                                <el-button type="text" icon="el-icon-download">
                                    <a :href="openUrl+'/api/manager/project-order/downloadBill'"
                                       style="color: #409EFF;">下载导入模板</a>
                                </el-button>
                                <el-upload class="upload" v-if="selectedRows.length>0"
                                           action="/api/manager/project-order/importBill" :before-upload="beforeUploads"
                                           :on-remove="handleRemoves" :show-file-list="false"
                                           :before-remove="beforeRemoves" :on-exceed="handleExceeds"
                                           :file-list="fileList"
                                           style="display:inline;" :on-success="uploadCompleteds" :headers="headers">
                                    <el-button type="text" icon="el-icon-download">
                                        导入
                                    </el-button>
                                </el-upload>
                            </template>
                            <template slot-scope="scope" slot="operate"
                                      v-if="type != 'view' || taskType=='now' ">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(false)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,false)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index,false)">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择产品" readonly
                                              :disabled="type=='view' && taskType!='now' ?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discount">
                                <div>
                                    <el-input v-model="scope.row.discount" placeholder="请输入折扣"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.discount,false,'discount', scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.qty,false,'qty',scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div>
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,false,'taxPrice', scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div>
                                    <el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,false,'taxAmount', scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxRate">
                                <div>
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               :disabled="type=='view' && taskType!='now'?true:false"
                                               @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,false,'taxRate', scope.row)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="price">
                                <div>
                                    <el-input v-model="scope.row.price" placeholder="请输入单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.price,false,'price', scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div>
                                    <el-input v-model="scope.row.amount" placeholder="请输入金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.amount,false,'amount', scope.row)"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.note,false,'note', scope.row)"
                                              placeholder="请输入备注"
                                              :disabled="type=='view' && taskType!='now'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <task-history v-if="formData.billNo && processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          @stepClick="stepClick"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;margin-bottom: 60px;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :selectType="selectType" :itemVisible="itemVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill} from "@/api/erp/manager/project_order/index";
    import {userOption, customerOption, commodityOption} from '@/util/table';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    import {openUrl} from '@/config/env';

    export default {
        name: "sales_project_order_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            var validateMobile = (rule, value, callback) => {
                if (value && value != '' && !isMobile(value)) {
                    callback(new Error('请输入正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {


                insertType: 0,
                permission: {tempAddBtn: true, addBtn: false},
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                selectType: undefined,
                item2: {items: []},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                headers: undefined,
                fileList: [],
                selectedRows: [],
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {
                    annexMuster: []
                },
                publicIndex: 0,
                swith: undefined,
                selectData: [],
                selectIndex: 0,
                formOption: {
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
                            label: "订单编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "客户ID",
                            prop: "customerId",
                            display: false
                        },
                        {
                            label: "客户编号",
                            prop: "customerCode",
                            display: false
                        },
                        {
                            label: "客户名称",
                            prop: "customerName",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择客户",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择客户';
                                    this.typeName = 'customerType';
                                    this.option = customerOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                    this.itemVisible = true;
                                    this.selectType = 1;
                                }
                            }
                        },
                        // {
                        //     label: "生产人员",
                        //     prop: "produceName",
                        //     span: 6,
                        //     dicData: [],
                        //     filterable: true,
                        //     readonly: true,
                        //     clearable: false,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择生产人员",
                        //         trigger: "change"
                        //     }],
                        //     click: ({value, column}) => {
                        //         if (this.type != 'view') {
                        //             this.publicTitle = '请选择生产人员';
                        //             this.typeName = 'userType';
                        //             this.option = userOption;
                        //             this.isSingle = false;
                        //             this.publicIndex = parseInt(1);
                        //             this.publicVisible = true;
                        //         }
                        //     }
                        // },
                        {
                            label: "技术人员",
                            prop: "skillName",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择技术人员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择技术人员';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.isSingle = false;
                                    this.publicIndex = parseInt(2);
                                    this.publicVisible = true;
                                }
                            }
                        },
                        {
                            label: "项目名称",
                            prop: "projectName",
                            span: 6,
                            rules: [{
                                required: true,
                                message: "请输入项目名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "项目类型",
                            prop: "projectCut",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/product-project-type/selectAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择项目类型",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "项目地点",
                            prop: "projectSigning",
                            span: 6,
                        },
                        {
                            label: "项目负责人",
                            prop: "projectCharge",
                            span: 6,
                        },
                        {
                            label: "业务员ID",
                            prop: "salesId",
                            display: false
                        },
                        {
                            label: "业务员编号",
                            prop: "salesCode",
                            display: false
                        },
                        {
                            label: "业务员",
                            prop: "salesName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择业务员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type != 'view') {
                                    this.publicTitle = '请选择业务员';
                                    this.typeName = 'userType';
                                    this.publicIndex = 1;
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                    this.itemVisible = true;
                                    this.selectType = 1;
                                }
                            }
                        },

                        {
                            label: "联系人",
                            prop: "contactName",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "结算方式",
                            prop: "settlementWay",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/payments-means/pageAll',
                            props: {
                                value: 'value',
                                label: 'label'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择结算方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "支付方式",
                            prop: "paymentType",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/produt-payment-method/selectAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择支付方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "交货方式",
                            prop: "deliveryWay",
                            span: 6,
                            type: 'select',
                            dicData: [
                                {
                                    value: 0,
                                    label: '自提'
                                },
                                {
                                    value: 1,
                                    label: '快件'
                                },
                                {
                                    value: 2,
                                    label: '物流'
                                }
                            ],
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择交货方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "收货人",
                            prop: "goodsName",
                            span: 6,

                        },
                        {
                            label: "收货电话",
                            prop: "goodsPhone",
                            span: 6,
                            rules: [{
                                validator: validateMobile,
                                trigger: "blur"
                            }],
                        },
                        {
                            label: "收货地址",
                            prop: "goodsAddress",
                            span: 6,
                        },
                        {
                            label: "签订地点",
                            prop: "signing",
                            span: 6,
                        },
                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            label: "附件",
                            prop: "annexMuster",
                            span: 24,
                            formslot: true
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                        {
                            prop: "items2",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        }
                    ]
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    addBtn: false,//新增customer_order_form
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    height: 300,
                    highlightCurrentRow: true,
                    index: true,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }
                    ],
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            minWidth: 120,
                            slot: true,
                        },
                        {
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            minWidth: 180,
                            slot: true,
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 160,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            width: 100,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 140,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税单价"
                                );
                            }
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税金额"
                                );
                            }
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 140,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "单价"
                                );
                            }
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "金额"
                                );
                            }
                        },
                        {
                            label: "货期(天)",
                            prop: "productionTime",
                            span: 6,
                            width: 180,
                            slot: true,
                        },
                        {
                            label: "产品描述",
                            prop: "productdescribe",
                            span: 6,
                            width: 180,
                            slot: true,
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            slot: true,
                        },
                    ]
                },
                itemsTwoOption: {
                    index: true,
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    height: 300,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum"
                        },
                        {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }
                    ],
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            minWidth: 120,
                            slot: true,
                        },
                        {
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            minWidth: 180,
                            slot: true,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 160,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            width: 100,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "折扣",
                            prop: "discount",
                            width: 140,
                            align: 'right',
                            placeholder: ' ',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "折扣"
                                );
                            }
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 140,
                            align: 'right',
                            type: 'number',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税单价"
                                );
                            }
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税金额"
                                );
                            }
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 140,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 140,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "单价"
                                );
                            }
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 160,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "金额"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            slot: true,
                        },
                    ]
                },
                publicVisible: false,
                publicTitle: '',
                isSingle: true,
                typeName: '',
                itemVisible: true,
                itemTwo: [],
                items2: {items: []},
                skuNoIndex: undefined,
            };
        },
        mounted() {
            this.init();
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            handleExceed(files, fileList) {
            },
            uploadCompleted(response, file, fileList) {

                if (response.data) {
                    const dataMap = this.dataMap(this.formData.items, response.data);
                    if (dataMap.length > 0) {
                        this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                        return;
                    }
                    for (var index in response.data) {
                        var item = response.data[index];
                        var itemObj = {};
                        itemObj.whether = 1;
                        itemObj.skuName = item.skuName;
                        itemObj.skuNo = item.skuNo;
                        itemObj.brandName = item.brandName;
                        itemObj.itemNo = item.itemNo;
                        itemObj.specifications = item.specifications;
                        itemObj.qty = 1;
                        itemObj.price = item.price;
                        itemObj.taxRate = item.taxRate;
                        itemObj.amount = item.amount;
                        itemObj.tax = item.tax;
                        itemObj.taxPrice = item.taxPrice;
                        itemObj.productionTime = item.productionTime;
                        itemObj.taxAmount = item.taxAmount;
                        itemObj.unit = item.unit;
                        itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                        this.formData.items.push(itemObj);
                    }
                    this.$nextTick(() => {
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        this.handleAddRow(true);
                    });
                }

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
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            //文件上传
            handleExceeds(files, fileList) {
            },
            uploadCompleteds(response, file, fileList) {

                if (response.data) {
                    const dataMap = this.dataMap(this.formData.items2, response.data);
                    if (dataMap.length > 0) {
                        this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                        return;
                    }
                    for (var index in response.data) {
                        var item = response.data[index];
                        var itemObj = {};
                        itemObj.skuName = item.skuName;
                        itemObj.skuNo = item.skuNo;
                        itemObj.type = item.skuNo == undefined ? 1 : 0;
                        itemObj.brandName = item.brandName;
                        itemObj.categoryName = item.categoryName;
                        itemObj.seriesName = item.seriesName;
                        itemObj.itemNo = item.itemNo;
                        itemObj.specifications = item.specifications;
                        itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                        itemObj.qty = item.qty;
                        itemObj.price = item.price;
                        itemObj.discount = item.discount || '';
                        itemObj.taxRate = item.taxRate;
                        itemObj.amount = item.amount;
                        itemObj.tax = item.tax;
                        itemObj.taxPrice = item.taxPrice;
                        itemObj.taxAmount = item.taxAmount;
                        itemObj.unit = item.unit;
                        this.items2.items.push(itemObj);
                    }
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                        }
                    }
                    this.$nextTick(() => {
                        this.items2.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.items2.items)));
                    });
                }

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
            beforeRemoves(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUploads(file) {
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
            handleRemoves(file, fileList) {
                console.log(file, fileList);
            },
            stepClick(value) {

            },
            showDetail(item) {
                window.open(item)
            },
            handleSuccess(response, file, fileLis) {
                if (!this.formData.annexMuster) {
                    this.formData.annexMuster = []
                    this.formData.annexMuster.push(response.data.url);
                } else {
                    this.formData.annexMuster.push(response.data.url);
                }
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleRemove(file, fileList) {
                this.formData.annexMuster = this.formData.annexMuster.filter(item => {
                    return item != file.response.data.url
                })
            },
            publicColumnBlur(index, val, type, name, item) {
                if (!isNaN(item.qty) && !isNaN(item.price)) {
                    if (type) {
                        if (name == 'qty' || name == 'price') {
                            this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(2);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(2);
                            this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(2);
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                        }
                        if (name == 'amount') {
                            this.formData.items[index].price = (Number(this.formData.items[index].amount) / Number(this.formData.items[index].qty)).toFixed(2);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(2);
                            this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(2);
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                        }
                        if (name == 'taxPrice') {
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                            this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(2);
                            this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(2);
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(2);
                        }
                        if (name == 'taxAmount') {
                            this.formData.items[index].taxPrice = (Number(this.formData.items[index].taxAmount) / Number(this.formData.items[index].qty)).toFixed(2);
                            this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(2);
                            this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(2);
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(2);
                        }
                        if (name == 'taxRate') {
                            this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(2);
                            this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(2);
                            this.formData.items[index].tax = (Number(this.formData.items[index].price) * Number(this.formData.items[index].taxRate / 100)).toFixed(2);
                        }
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    } else {
                        if (name == "discount") {
                            this.items2.items[index].taxPrice = (Number(val) * Number(this.items2.items[index].surfacePrice)).toFixed(2);
                            this.items2.items[index].price = (Number(this.items2.items[index].taxPrice) / Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].amount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].price)).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                        }
                        if (name == 'qty' || name == 'price') {
                            this.items2.items[index].amount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].price)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                            this.items2.items[index].taxPrice = (Number(this.items2.items[index].price) * Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                        }
                        if (name == 'amount') {
                            this.items2.items[index].price = (Number(this.items2.items[index].amount) / Number(this.items2.items[index].qty)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                            this.items2.items[index].taxPrice = (Number(this.items2.items[index].price) * Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                            this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                        }
                        if (name == 'taxPrice') {
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].price = (Number(this.items2.items[index].taxPrice) / Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].amount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].price)).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                            this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                        }
                        if (name == 'taxAmount') {
                            this.items2.items[index].taxPrice = (Number(this.items2.items[index].taxAmount) / Number(this.items2.items[index].qty)).toFixed(2);
                            this.items2.items[index].price = (Number(this.items2.items[index].taxPrice) / Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].amount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].price)).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].tax = (Number(this.items2.items[index].amount) * Number(this.items2.items[index].taxRate / 100)).toFixed(2);
                            this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                        }
                        if (name == 'taxRate') {
                            this.items2.items[index].taxPrice = (Number(this.items2.items[index].price) * Number(1 + Number(this.items2.items[index].taxRate / 100))).toFixed(2);
                            this.items2.items[index].taxAmount = (Number(this.items2.items[index].qty) * Number(this.items2.items[index].taxPrice)).toFixed(2);
                            this.items2.items[index].discount = (Number(this.items2.items[index].taxPrice) / Number(this.items2.items[index].surfacePrice)).toFixed(2);
                        }
                        this.vueSet(this.items2.items, index, this.items2.items[index]);
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                            }
                        }
                    }
                }
            },
            handleAddRow(type) {
                const d = {
                    skuName: '',
                }
                if (type) {
                    this.formData.items.push(d);
                } else {
                    this.items2.items.push(d);
                }
            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = type ? this.formData.items.length : this.items2.items.length;
                if (type) {
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == item.skuNo) {
                            this.itemTwo.splice(i, 1);
                        }
                    }
                    if (this.items2.skuNo == item.skuNo) {
                        this.items2 = {items: []};
                    }
                    if (ValueIndex === 1) {
                        this.formData.items = [{}]
                    } else {
                        this.formData.items.splice(index, 1);
                    }

                } else {
                    if (ValueIndex === 1) {
                        this.items2.items = [{}];
                    } else {
                        this.items2.items.splice(index, 1);
                    }
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = this.items2.items;
                        }
                    }
                }
            },
            //多选框状态改变时
            handleCurrentRowChange(val) {
                this.selectedRows = [val];
                if (this.type == 'view') {
                    for (let i in  this.itemTwo) {
                    }

                }
                if (val != null && val != undefined && val.skuName && val.skuName != '') {
                    this.skuNoIndex = this.selectedRows[0].skuNo;
                    let flag = false;
                    let sum;
                    if (this.itemTwo.length > 0) {
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.skuNoIndex) {
                                flag = true;
                                sum = i;
                            }
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i] = JSON.parse(JSON.stringify(this.items2));
                            }
                        }
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};

                        if (flag) {
                            if (!this.itemTwo[sum].items || this.itemTwo[sum].items.length == 0) {
                                const d = {
                                    skuName: '',
                                };
                                this.items2.items.push(d);
                            } else {
                                this.items2.items = JSON.parse(JSON.stringify(this.itemTwo[sum].items));
                            }
                        } else {
                            this.itemTwo.push({
                                skuNo: this.skuNoIndex,
                                items: [],
                            });
                            const d = {
                                skuName: '',
                            };
                            this.items2.items.push(d);
                        }

                    } else {
                        this.itemTwo.push({
                            skuNo: this.skuNoIndex,
                            items: [],
                        });
                        const d = {
                            skuName: '',
                        };
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        this.items2.items.push(d);
                    }
                } else if (val == null || val != undefined && !val.skuName || val.skuName != '') {
                    //this.vueMessage('warning', '请先选择产品信息!');
                    this.selectedRows = [];
                }
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    if (type) {
                        this.itemVisible = true;
                        this.selectType = 0;
                        this.insertType = index;
                    } else {
                        this.itemVisible = false;
                        this.selectType = 1;
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择产品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }
                if (this.taskType == 'now') {
                    if (type) {
                        return
                    }
                    this.itemVisible = false;
                    this.selectType = 1;
                    this.isSingle = false;
                    this.publicTitle = '请选择产品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;

                }
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.goodsName = list[0].receiveName;
                        this.formData.contactName = list[0].linkMan;
                        this.formData.projectCharge = list[0].managerName;
                        this.formData.goodsPhone = list[0].receivePhone;
                        this.formData.goodsAddress = list[0].receiveAddress;
                    }
                    if (this.typeName == 'userType') {

                        if (this.publicIndex == 1) {
                            this.formData.salesName = list[0].name;
                            this.formData.salesId = list[0].id;
                            this.formData.salesCode = list[0].no;
                        }
                        if (this.publicIndex == 2) {
                            this.formData.skillName = list[0].name;
                            this.formData.skillId = list[0].id;
                            this.formData.skillCode = list[0].no;
                        }
                    }
                    if (this.typeName == 'commodityType') {
                        if (this.itemVisible) {
                            const dataMap = this.dataMap(this.formData.items, list);
                            if (dataMap.length > 0) {
                                this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                                return;
                            }
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.whether = 1;
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.brandName = item.brandName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.qty = 1;
                                itemObj.price = '';
                                itemObj.taxRate = this.defaultTaxRate;
                                itemObj.amount = '';
                                itemObj.tax = '';
                                itemObj.taxPrice = '';
                                itemObj.taxAmount = '';
                                itemObj.unit = item.unit;
                                itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                this.formData.items.push(itemObj);
                            }
                        } else {
                            const dataMap = this.dataMap(this.formData.items2, list);
                            if (dataMap.length > 0) {
                                this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                                return;
                            }
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.type = item.skuNo == undefined ? 1 : 0;
                                itemObj.brandName = item.brandName;
                                itemObj.categoryName = item.categoryName;
                                itemObj.seriesName = item.seriesName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                itemObj.qty = 1;
                                itemObj.price = '';
                                itemObj.taxRate = this.defaultTaxRate;
                                itemObj.discount = item.discount || '';
                                itemObj.amount = '';
                                itemObj.tax = '';
                                itemObj.taxPrice = '';
                                itemObj.taxAmount = '';
                                itemObj.unit = item.unit;
                                this.items2.items.push(itemObj);
                            }
                            for (let i in this.itemTwo) {
                                if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                    this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                                }
                            }
                        }
                        this.$nextTick(() => {
                            if (this.itemVisible) {
                                this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                this.handleAddRow(this.itemVisible);
                                this.indexInsert();
                            } else {
                                this.items2.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.items2.items)));
                            }
                        });
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.skuNo == item.skuNo) {
                            map.push(obj.skuNo);
                        }
                    });
                });
                return map;
            },
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                console.log(items)
                if (items != undefined) {
                    for (var i = items.length - 1; i >= 0; i--) {
                        if (this.isEmpty(items[i].skuNo)) {
                            items.splice(i, 1);
                        }
                    }
                }
                return items;
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
                }, 1000)
            },
            init() {
                this.processId = '';
                this.vueSet(this, 'formData', {});
                this.items2 = {items: []};
                this.item2 = {items: []};
                this.itemTwo = [];
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }

                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    if (this.taskType != 'now') {
                        this.itemsTwoOption.column[0].hide = true;
                    } else {
                        this.itemsTwoOption.column[0].hide = false;
                    }
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.itemsTwoOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        salesId: this.$store.getters.userInfo.id,
                        salesCode: this.$store.getters.userInfo.no,
                        salesName: this.$store.getters.userInfo.name,
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        goodsDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [{
                            skuName: '',
                        }],
                        items2: [],
                    };
                    this.items2 = {items: []};
                    this.itemTwo = [];
                    this.fileList = [];
                    this.$nextTick(() => {
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/sales_project_order_form',
                    name: '项目订单制单',
                    query: {
                        type: 'add'
                    }
                });
            },
            getProcessId(billPrefix) {
                getProcessId({
                    billPrefix: billPrefix
                }).then(response => {
                    if (response != null && response != '') {
                        this.processId = response.data;
                    }
                });
            },
            handleAuditBill(val) {
                if (this.formData.annexMuster.length < 1) {
                    this.formData.annexMuster = [];
                }
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                for (var x in this.itemTwo) {
                    if (this.itemTwo[x].skuNo == this.items2.skuNo) {
                        this.itemTwo[x].items = this.items2.items;
                    }
                }
                let data = JSON.parse(JSON.stringify(this.formData));
                let twoData = JSON.parse(JSON.stringify(this.itemTwo));
                delete data.items2;
                let taxBillAmount = 0;
                for (let i in data.items) {
                    if (data.items[i].taxAmount != undefined) {
                        taxBillAmount = data.items[i].taxAmount * 1 + taxBillAmount * 1;
                    }
                    for (let j in twoData) {
                        if (data.items[i].skuNo == twoData[j].skuNo) {
                            data.items[i].items = this.clearNoGoodsIdData(twoData[j].items);
                            if ( data.items[i].items == undefined || data.items[i].items.length < 1) {
                                this.vueMessage('warning', data.items[i].skuNo + '柜子无清单!');
                                return
                            }
                        }
                    }

                }
                if (!this.handleCheckItemFuc(data.items)) {
                    return;
                }
                data.taxBillAmount = taxBillAmount;
                data.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                if (data.annexMuster.length < 1) {
                    data.annexMuster = [];
                }
                if (data.taskMap.opinion == '同意') {
                    this.isAgreeLoading = true;
                } else {
                    this.isRejectLoading = true;
                }
                auditBill(data).then(response => {
                    if (response.data.code == '2000') {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.clocseCurrent(this, this.$route);
                        this.$router.push({
                            path: '/taskNowList',
                            name: '待办任务',
                            meta: {
                                i18n: 'taskNowList'
                            },
                            query: {
                                timeStamp: new Date().getTime()
                            },
                        });
                        this.isAgreeLoading = false;
                        this.isRejectLoading = false;
                        this.init();
                    } else {
                        this.$notify({
                            title: '失败',
                            message: response.data.msg,
                            type: 'warning',
                            duration: 2000
                        })
                    }
                    this.isAgreeLoading = false;
                    this.isRejectLoading = false;
                })
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                        res.data.data.settlementWay = parseInt(res.data.data.settlementWay);
                        this.formData = formData;
                        this.fileList = [];
                        if (this.taskType == 'now') {
                            if (this.formData.items[0] && !this.formData.items[0].items) {
                                this.indexInsert()
                            }
                        }
                        for (let i in formData.annexMuster) {
                            this.fileList.push({
                                name: formData.annexMuster[i],
                                url: formData.annexMuster[i]
                            })
                        }
                        this.itemTwo = [];
                        let itemData = [];
                        for (let i in formData.items) {
                            let data = {
                                skuNo: formData.items[i].skuNo,
                                items: formData.items[i].items,
                            }
                            itemData.push(data)
                        }
                        this.itemTwo = itemData;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales_project_order_form',
                            name: '项目订单制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            }
                        });
                        this.$refs.billContainer.refreshId(this.formData.id);
                    }

                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            handleCheckItemFuc(items) {
                var flag = true;
                var flagTwo = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的产品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税金额为必填项');
                            return false;
                        }
                    }
                    if (!this.isEmpty(items[i].skuNo) && items[i].items) {
                        for (var j in items[i].items) {
                            let itemTwo = items[i].items[j];
                            if (!this.isEmpty(itemTwo.skuNo)) {
                                flagTwo = false;
                                if (this.isEmpty(itemTwo.skuName)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的产品名称为必填项');
                                    return false;
                                }
                                if (this.isEmpty(itemTwo.qty)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                                    return false;
                                }
                                if (this.isEmpty(itemTwo.price)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单价为必填项');
                                    return false;
                                }
                                if (this.isEmpty(itemTwo.amount)) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的金额为必填项');
                                    return false;
                                }
                            }
                        }
                    }

                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (flagTwo && this.taskType == 'now') {
                    this.vueMessage('warning', '产品单据明细不能为空');
                    return false;
                }
                return true;
            },
            indexInsert() {
                this.$refs.crud.setCurrentRow(this.formData.items[this.selectIndex]);
                let val = this.formData.items[this.selectIndex];
                this.selectedRows = [this.formData.items[this.selectIndex]];
                if (val != null && val != undefined && val.skuName && val.skuName != '') {
                    this.skuNoIndex = this.selectedRows[0].skuNo;
                    let flag = false;
                    let sum;
                    if (this.itemTwo.length > 0) {
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.skuNoIndex) {
                                flag = true;
                                sum = i;
                            }
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i] = JSON.parse(JSON.stringify(this.items2));
                            }
                        }
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};

                        if (flag) {
                            if (this.itemTwo[sum].items.length == 0) {
                                const d = {
                                    skuName: '',
                                    goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                                };
                                this.items2.items.push(d);
                            } else {
                                this.items2.items = JSON.parse(JSON.stringify(this.itemTwo[sum].items));
                            }
                        } else {
                            this.itemTwo.push({
                                skuNo: this.skuNoIndex,
                                items: [],
                            });
                            const d = {
                                skuName: '',
                                goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                            };
                            this.items2.items.push(d);
                        }
                    } else {
                        this.itemTwo.push({
                            skuNo: this.skuNoIndex,
                            items: [],
                        });
                        const d = {
                            skuName: '',
                            goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                        };
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        this.items2.items.push(d);
                        this.vueSet(this, 'selectedRows', this.selectedRows);
                        this.vueSet(this, 'items2', this.items2);
                    }
                } else if (val == null || val != undefined && !val.skuName || val.skuName != '') {
                    // console.log(1)
                    // this.vueMessage('warning', '请先选择产品信息!');
                    this.selectedRows = [];
                }
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                if (this.formData.annexMuster.length < 1) {
                    this.formData.annexMuster = [];
                }
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                for (var x in this.itemTwo) {
                    if (this.itemTwo[x].skuNo == this.items2.skuNo) {
                        this.itemTwo[x].items = this.items2.items;
                    }
                }
                let data = JSON.parse(JSON.stringify(this.formData));
                let twoData = JSON.parse(JSON.stringify(this.itemTwo));
                delete data.items2;
                let taxBillAmount = 0;
                for (let i in data.items) {
                    if (data.items[i].taxAmount != undefined) {
                        taxBillAmount = data.items[i].taxAmount * 1 + taxBillAmount * 1;
                    }
                    for (let j in twoData) {
                        if (data.items[i].skuNo == twoData[j].skuNo) {
                            data.items[i].items = this.clearNoGoodsIdData(twoData[j].items);
                        }
                    }
                }
                data.taxBillAmount = taxBillAmount;
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc(data.items)) {
                    return;
                }
                data.items = this.clearNoGoodsIdData(data.items);
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        saveBill(data).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/sales_project_order',
                                    name: '项目订单',
                                    meta: {
                                        i18n: 'sales_project_order'
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
