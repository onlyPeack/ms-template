<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
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
                                 :to="{path:'/print/sales_stock_out_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打印清单</el-button>
                    </router-link>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path: formData.expressName == '德邦'?'/print/db-electronic-sheet-print':'/print/db-electronic-sheets-print',query:{id:id}}">
                        <el-button icon="el-icon-receiving" type="warning" plain style="margin-left: 10px;">打印电子面单
                        </el-button>
                    </router-link>
                    <el-button icon="el-icon-paperclip" v-if="type == 'view' && formData && formData.billStatus == '4'&& formData.expressNumber" type="warning" plain style="margin-left: 10px;" @click="selectLogistics">物流轨迹</el-button>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="outType">
                        <div >
                            <el-select v-model="formData.outType" @change="handleReceiveMethodChange"
                                       :disabled="type == 'view'? true : false">
                                <el-option value="0" label="现货出库"></el-option>
                                <el-option value="1" label="期货出库"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="transportType">
                        <div class="outTypeDiv">
                            <el-select v-model="formData.transportType"
                                       :disabled="type == 'view'? true : false">
                                <el-option
                                        v-for="item in transportOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="expressName">
                        <div>
                            <el-select v-model="formData.expressName" :placeholder="formData.warehouseName ? '请选择物流名称':'请先选择出库仓库'" @change="expressNameBtn"
                                       :disabled="type == 'view'? true : false">
                                <el-option
                                        v-for="item in expressOption"
                                        :key="item.expressName"
                                        :label="item.expressName"
                                        :value="item.expressName">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" v-if="isShow"  :class="type == 'view'?'':'main-form-items'"  :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.dataSku" placeholder="请选择仓库" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div>
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>


                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="qtyBlur(scope.row.$index,scope.row.qty)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="saleCostPrice">
                                <div>
                                    <el-input v-model="scope.row.saleCostPrice" placeholder="请输入成本单价"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请填写备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>
            </div>
            <task-history v-if="formData.billNo && processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :warehouseId="formData.warehouseId" :outType="formData.outType" :customerName="formData.customerName"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :skuNo="skuNo"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
            <sku-selector v-if="publicsVisible" ref="skuSelector" :dialogVisible="publicsVisible" :sourceBillId="sourceBillId"
                            :warehouseId="formData.warehouseId" :res="formData.items[positionIndex].maxQty"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :skuNo="skuNo"
                            @handleClose="handleClosesPublic"
                            @handleSubmit="handleSubmitsPublic"></sku-selector>
            <tracking :isTracking="isTracking" @closeTracking="closeTracking" :itemData="formData" :logisticsData="logisticsData"/>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill,findLogisticsNo} from "@/api/erp/wms/bill/salesStockOut";
    import {customerOrderOption, warehouseOption, skuOption,collectOption,customerOrdersOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getStockOutConfig,pageAll,selectExpressByWarehouseId} from "@/api/erp/manager/config/index"
    import {pageBySkuNoAndWarehouseId} from "@/api/erp/wms/stock_query/index"
    import {getObj as getObjs} from '@/api/erp/crm/customer/index'
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "sales_stock_out_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'tracking': () => import('@/components/setting/tracking'),
            'skuSelector': () => import('@/components/erp/sku_selector'),
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
                logisticsData:undefined,
                isTracking: false,
                sourceBillId:undefined,
                publicsVisible: false,
                expressOption:[],
                transportOption: [
                    {
                        value: '0',
                        label: '快递运输'
                    },
                    {
                        value: '1',
                        label: '运费到付'
                    },
                    {
                        value: '2',
                        label: '货物自提'
                    }
                ],
                permission: {tempAddBtn: true, addBtn: false},
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                skuNo: undefined,
                isSingle: true,
                isShow: false,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                itemsOneOption: [
                    {
                        label: "操作",
                        prop: "operate",
                        fixed: true,
                        align: 'center',
                        minWidth: 80,
                        slot: true,
                    },
                    {
                        label: "仓位",
                        prop: "positionName",
                        width: 130,
                        overHidden:true,
                        placeholder: ' ',
                        align: 'left',
                        slot: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "仓位"
                            );
                        }
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        width: 160,
                        overHidden:true,
                        placeholder: '',
                        align: 'left'
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        placeholder: ' ',
                        width: 160,
                        overHidden:true,
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        placeholder: ' ',
                        width: 130,
                        overHidden:true,
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        placeholder: ' ',
                        width: 100,
                        overHidden:true,
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                    },
                    {
                        label: "面价",
                        prop: "surfacePrice",
                        width: 100,
                        overHidden:true,
                        align:'right',
                    },
                    {
                        label: "出库数量",
                        prop: "qty",
                        width: 112,
                        overHidden:true,
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
                                "出库数量"
                            );
                        }
                    },
                    {
                        label: "单价",
                        prop: "price",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "税率",
                        prop: "taxRate",
                        width: 80,
                        overHidden:true,
                        align: 'right',
                        type: 'select',
                        disabled: true,
                        dicData: [
                            {
                                value: 0,
                                label: '0%'
                            },
                            {
                                value: 13,
                                label: '13%'
                            },
                            {
                                value: 16,
                                label: '16%'
                            },
                            {
                                value: 17,
                                label: '17%'
                            },
                            {
                                value: 18,
                                label: '18%'
                            },
                            {
                                value: 19,
                                label: '19%'
                            },
                            {
                                value: 20,
                                label: '20%'
                            }
                        ]
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                        overHidden:true,
                        slot: true
                    },
                ],
                itemsTwoOption: [
                    {
                        label: "操作",
                        prop: "operate",
                        fixed: true,
                        align: 'center',
                        minWidth: 80,
                        slot: true,
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        width: 160,
                        overHidden:true,
                        placeholder: '请选择商品名称',
                        align: 'left'
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        placeholder: ' ',
                        width: 160,
                        overHidden:true,
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        placeholder: ' ',
                        width: 130,
                        overHidden:true,
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        placeholder: ' ',
                        width: 100,
                        overHidden:true,
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                    },
                    {
                        label: "面价",
                        prop: "surfacePrice",
                        width: 100,
                        overHidden:true,
                        align:'right',
                    },
                    {
                        label: "出库数量",
                        prop: "qty",
                        align: 'right',
                        width: 112,
                        overHidden:true,
                        slot: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "出库数量"
                            );
                        }
                    },
                    {
                        label: "单价",
                        prop: "price",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "税率",
                        prop: "taxRate",
                        width: 80,
                        overHidden:true,
                        align: 'right',
                        type: 'select',
                        disabled: true,
                        dicData: [
                            {
                                value: 0,
                                label: '0%'
                            },
                            {
                                value: 13,
                                label: '13%'
                            },
                            {
                                value: 16,
                                label: '16%'
                            },
                            {
                                value: 17,
                                label: '17%'
                            },
                            {
                                value: 18,
                                label: '18%'
                            },
                            {
                                value: 19,
                                label: '19%'
                            },
                            {
                                value: 20,
                                label: '20%'
                            }
                        ]
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        slot: true
                    },
                ],
                itemsTreeOption: [
                    {
                        label: "操作",
                        prop: "operate",
                        fixed: true,
                        align: 'center',
                        minWidth: 80,
                        slot: true,
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        width: 160,
                        overHidden:true,
                        placeholder: '请选择商品名称',
                        align: 'left'
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        placeholder: ' ',
                        width: 160,
                        overHidden:true,
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        placeholder: ' ',
                        width: 130,
                        overHidden:true,
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        placeholder: ' ',
                        width: 100,
                        overHidden:true,
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                        readonly: true
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                        placeholder: ' ',
                    },
                    {
                        label: "面价",
                        prop: "surfacePrice",
                        width: 100,
                        overHidden:true,
                        align:'right',
                    },
                    {
                        label: "出库数量",
                        prop: "qty",
                        width: 112,
                        overHidden:true,
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
                                "出库数量"
                            );
                        }
                    },
                    {
                        label: "单价",
                        prop: "price",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "税率",
                        prop: "taxRate",
                        width: 80,
                        overHidden:true,
                        align: 'right',
                        type: 'select',
                        disabled: true,
                        dicData: [
                            {
                                value: 0,
                                label: '0%'
                            },
                            {
                                value: 13,
                                label: '13%'
                            },
                            {
                                value: 16,
                                label: '16%'
                            },
                            {
                                value: 17,
                                label: '17%'
                            },
                            {
                                value: 18,
                                label: '18%'
                            },
                            {
                                value: 19,
                                label: '19%'
                            },
                            {
                                value: 20,
                                label: '20%'
                            }
                        ]
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        width: 80,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        width: 100,
                        overHidden:true,
                        align: 'right'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        slot: true
                    },
                ],
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
                                label: "客户ID",
                                prop: "customerId",
                                display: false
                            },
                            {
                                label: "单据日期",
                                prop: "billDate",
                                span: 6,
                                type: 'date',
                                readonly: true,
                                valueFormat: 'yyyy-MM-dd',
                                format: 'yyyy-MM-dd',
                                pickerOptions: {
                                    disabledDate(time) {
                                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                    },
                                }
                            },
                            {
                                label: "出库类型",
                                prop: "outType",
                                span: 6,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '0',
                                        label: '现货出库'
                                    },
                                    {
                                        value: '1',
                                        label: '期货出库'
                                    }
                                ],
                                formslot: true,
                                filterable: true,
                                rules: [{
                                    required: true,
                                    message: "请选择出库类型",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "关联单据",
                                prop: "sourceBillNo",
                                span: 6,
                                type: 'text',
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择关联单据',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择关联单据",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = this.formData.outType == '0' || this.formData.outType == 0 ?'请选择销售订单':'请选择采购订单';
                                    if(this.formData.outType == '1' || this.formData.outType == 1 ){
                                        this.option = customerOrdersOption;
                                    }else{
                                        this.option = customerOrderOption;
                                    }
                                    this.typeName = 'customerOrderTypess';
                                    this.isSingle = false;
                                    this.publicVisible = true;
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
                                type: 'text',
                                dicData: [],
                                disabled: true,
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择客户",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "出库仓库ID",
                                prop: "warehouseId",
                                display: false
                            },
                            {
                                label: "出库仓库",
                                prop: "warehouseName",
                                span: 6,
                                type: 'text',
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择出库仓库',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择出库仓库';
                                    this.typeName = 'warehouseType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "销售员ID",
                                prop: "salerId",
                                display: false
                            },
                            {
                                label: "销售员编号",
                                prop: "salerCode",
                                display: false
                            },
                            {
                                label: "销售员",
                                prop: "salerName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                disabled: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择销售员",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "配送方式",
                                prop: "transportType",
                                span: 6,
                                type: 'select',
                                formslot: true,
                                filterable: true,
                                rules: [{
                                    required: true,
                                    message: "请选择配送方式",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "物流名称",
                                prop: "expressName",
                                span: 6,
                                type: 'select',
                                formslot: true,
                            },
                            {
                                label: "收货人",
                                prop: "linkPerson",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    if(this.formData.customerName == ''){
                                        return
                                    }
                                    this.publicTitle = '请选择收货人';
                                    this.typeName = 'collectType';
                                    this.option = collectOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "收货电话",
                                prop: "linkPhone",
                                span: 6,
                                rules: [{
                                    validator: validateMobile,
                                    trigger: "blur"
                                }],
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    if(this.formData.customerName == ''){
                                        return
                                    }
                                    this.publicTitle = '请选择收货电话';
                                    this.typeName = 'collectType';
                                    this.option = collectOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "收货地址",
                                prop: "linkAddress",
                                span: 12,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    if(this.formData.customerName == ''){
                                        return
                                    }
                                    this.publicTitle = '请选择收货地址';
                                    this.typeName = 'collectType';
                                    this.option = collectOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "整单备注",
                                prop: "note",
                                type: 'textarea',
                                row: true,
                                span: 24
                            },
                            {
                                prop: "items",
                                type: "dynamic",
                                span: 24,
                                formslot: true
                            },
                        ]
                },
                itemsOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    height: 'auto',
                    calcHeight: 350,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "taxPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        },{
                            name: "price",
                            type: "sum"
                        },{
                            name: "amount",
                            type: "sum"
                        },
                    ],
                    column: [],
                },
                option: [],
                stockOutConfigIndex: 0,
                positionIndex: 0,
            };
        },
        created() {
            getStockOutConfig().then(res => {
                this.stockOutConfigIndex = res.data;
                this.init();
            })

            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            selectLogistics() {
                findLogisticsNo(this.formData.id).then(res => {
                    console.log()
                    if (res.data.code == '2000') {

                        let val = res.data.data.routeResps[0];

                        this.logisticsData = val.routes;
                        console.log(this.logisticsData)
                        this.isTracking = true;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                })
        },
            closeTracking(){
                this.isTracking = false;
            },
            expressNameBtn(e){
                for(let i in this.expressOption){
                    if(this.expressOption[i].expressName == e){
                        this.formData.expressId = this.expressOption[i].expressId;
                    }
                }
            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            positionBtn(val, index) {
                if (this.type != 'view') {
                    if (!this.formData.warehouseId) {
                        this.vueMessage('warning', '请先选出库仓库!');
                        return
                    }
                    if (!this.formData.items[index].skuName || this.formData.items[index].skuName == undefined) {
                        this.vueMessage('warning', '请先关联单据!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'skuType';
                    this.option = skuOption;
                    this.sourceBillId =this.formData.items[index].sourceBillId;
                    this.publicsVisible = true;
                    this.positionIndex = index;
                    this.skuNo = this.formData.items[index].skuNo;
                }

            },
            handleReceiveMethodChange() {
                this.formData.sourceBillNo = undefined;
                this.isShow = false;
                this.$nextTick(() => {
                    //清除没有商品ID的数据
                    this.itemsOption.column = [];
                    if (this.formData.outType == '1') {
                        this.itemsOption.column = this.itemsTreeOption;
                        this.formOption.column[9].display = false;
                        this.formOption.column[14].display = false;
                    } else if (this.formData.outType == '0' && this.stockOutConfigIndex == 1) {
                        this.formOption.column[9].display = true;
                        this.formOption.column[14].display = true;
                        this.itemsOption.column = this.itemsOneOption;
                    } else {
                        this.itemsOption.column = this.itemsTwoOption;
                        this.formOption.column[9].display = true;
                        this.formOption.column[14].display = true;
                    }
                    this.formData.items = [
                        {
                            customerCode: '',
                            receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        }
                    ];
                    this.isShow = true;
                });
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            qtyBlur(index, val) {
                if (!isNaN(val)) {
                    if (val > this.formData.items[index].maxQty) {
                        this.vueMessage('warning', '当前值大于最大可出库数量');
                        this.formData.items[index].qty = this.formData.items[index].maxQty;
                    }
                    this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].tax = (Number(this.formData.items[index].taxAmount) - Number(this.formData.items[index].amount)).toFixed(this.sysParam.amountDecimal);
                }
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
                    if(this.typeName == 'collectType'){
                        this.formData.linkPerson = list[0].name;
                        this.formData.linkPhone = list[0].phoneNumber;
                        this.formData.linkAddress = list[0].address;
                    }
                    if (this.typeName == 'customerOrderTypess') {
                        this.formData.items = [];
                        this.formData.customerCode =list[0].mainDTO ? list[0].mainDTO.customerCode:list[0].customerCode;
                        this.formData.customerName = list[0].mainDTO ? list[0].mainDTO.customerName:list[0].customerName;
                        this.formData.customerId = list[0].mainDTO ? list[0].mainDTO.customerId:list[0].customerId;
                        this.formData.salerName = list[0].mainDTO ? list[0].mainDTO.salerName:list[0].salerName;
                        this.formData.salerCode = list[0].mainDTO ? list[0].mainDTO.salerCode:list[0].salerCode;
                        this.formData.salerId = list[0].mainDTO ? list[0].mainDTO.salerId:list[0].salerId;
                        this.formData.supplierId = list[0].mainDTO ? list[0].mainDTO.supplierId:list[0].supplierId;
                        this.formData.supplierCode = list[0].mainDTO ? list[0].mainDTO.supplierCode:list[0].supplierCode;
                        this.formData.supplierName = list[0].mainDTO ? list[0].mainDTO.supplierName:list[0].supplierName;
                        this.formData.warehouseName = list[0].warehouseName;
                        this.formData.warehouseId = list[0].warehouseId;
                        if(this.formData.warehouseId){
                            selectExpressByWarehouseId(this.formData.warehouseId).then(res=>{
                                this.expressOption = res.data.data;
                            })
                        }
                        if (this.typeName == 'customerOrderTypess') {
                            this.formData.sourceBillNo = list[0].billNo;
                            this.formData.sourceBillId = list[0].id;
                        }
                        getObjs(this.formData.customerId).then(res => {
                            if (res.data.code == 2000) {
                                this.formData.linkPerson = res.data.data.receiveName;
                                this.formData.linkPhone = res.data.data.receivePhone;
                                this.formData.linkAddress = res.data.data.receiveAddress;
                                this.formData.province = res.data.data.province;
                                this.formData.city = res.data.data.city;
                                this.formData.county = res.data.data.county;
                                this.formData.postcode = res.data.data.postcode;
                            }
                        })
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceObjectKey = this.formData.outType == '1' ||  this.formData.outType == 1?'CGDD-XSDD':'XSDD';
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            if (this.formData.outType == '0'|| this.formData.outType == 0) {
                                itemObj.qty = item.notStockOutSaleQty;
                                itemObj.maxQty = item.notStockOutSaleQty;
                            }else if (this.formData.outType == '1' || this.formData.outType == 1) {
                                itemObj.qty = item.qty -item.stockInPurchaseQty - item.stockOutQty;
                                itemObj.maxQty = item.qty -item.stockInPurchaseQty - item.stockOutQty;
                            }
                            itemObj.price = item.price;

                            itemObj.taxRate = item.taxRate;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.amount = (Number(itemObj.price) * parseInt(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.taxAmount = (Number(itemObj.taxPrice) * parseInt(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.tax = (Number(itemObj.taxAmount) - Number(itemObj.amount)).toFixed(this.sysParam.amountDecimal);
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillNo = list[0].billNo;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name;
                        this.formData.warehouseId = list[0].id;
                        selectExpressByWarehouseId(this.formData.warehouseId).then(res=>{
                            this.expressOption = res.data.data;
                        })
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleSubmitsPublic(list) {
                if (list.length > 0) {
                    this.publicsVisible = false;

                    if (this.typeName == 'skuType') {
                        let data = [];
                        let dataList = [];
                        let sum = 0;
                        for (let i in list) {
                            data.push(list[i].positionName);
                            var x = {}
                            x[list[i].id] = list[i].positionName;
                            dataList.push({
                                id:list[i].id,
                                positionName:list[i].positionName,
                                qty:list[i].sum,
                            });
                            sum = sum * 1+list[i].sum*1
                        }
                        this.formData.items[this.positionIndex].qty = sum;
                        this.formData.items[this.positionIndex].dataSku = data.toString();
                        this.formData.items[this.positionIndex].positionList = dataList;
                        this.vueSet(this.formData.items, this.positionIndex, this.formData.items[this.positionIndex]);
                    }
                    this.$refs.skuSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleClosesPublic() {
                this.publicsVisible = false;
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
            changeMaxHeight(type) {
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.processId = '';
                if (!this.id) {
                    this.itemsOption.column = [];
                    this.itemsOption.column = this.itemsTwoOption;
                }
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                for (var i in this.formOption.column) {
                    if(this.type == 'view'){
                        //this.formOption.column[i].readonly =  true;
                        if(this.formOption.column[i].disabled!=undefined){
                            this.formOption.column[i].disabled = false;
                        }
                    }else{
                        if(this.formOption.column[i].disabled!=undefined){
                            this.formOption.column[i].disabled = true;
                        }
                    }
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {

                    this.vueSet(this, 'formData', {});
                    getSelfCompany().then(response => {
                        let formData = {
                            outType: '0',
                            billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            items: []
                        };
                        formData.companyId = response.data.id ? response.data.id : undefined
                        formData.companyName = response.data.companyName ? response.data.companyName : undefined
                        this.vueSet(this, 'formData', formData);
                        this.loading = false;
                        this.handleReceiveMethodChange();
                    })

                }

            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/sales_stock_out_form',
                    name: '销售出库制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'sales_stock_out_form'
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
            async handleAuditBill(val) {
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum = await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
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

                }
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.isShow = false;
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.itemsOption.column = [];
                            if (formData.outType == '1') {
                                this.itemsOption.column = this.itemsTreeOption;
                            } else if (formData.outType == '0' && this.stockOutConfigIndex == 1) {
                                this.itemsOption.column = this.itemsOneOption;
                            } else {
                                this.itemsOption.column = this.itemsTwoOption;
                            }
                            if(this.type && this.type == 'view'){
                                this.itemsOption.column = [];
                                this.itemsOption.column = this.itemsOneOption;
                            }
                            this.isShow = true;
                        });
                        for (let i in formData.items) {
                            if (formData.items[i].positionList && formData.items[i].positionList.length > 0) {
                                let datas = []
                                let list = formData.items[i].positionList
                                for (let j in list) {
                                    let datass = list[j];
                                    datas.push(datass.positionName);
                                }
                                formData.items[i].dataSku = datas.toString()
                            }
                        }
                        this.formData = formData;

                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales_stock_out_form',
                            name: '销售出库制单',
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            handleCheckItemFuc() {
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                var items = this.formData.items;
                var flag = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.formData.outType == '0' && this.stockOutConfigIndex == 1) {
                            if (this.isEmpty(items[i].positionList)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的仓位为必填项');
                                return false;
                            }
                        }

                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].price)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxRate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的金额不能小于1');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的价税合计为必填项');
                            return false;
                        }
                    }
                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                return true;
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                if(this.outType == '0' || this.outType == 0){
                    if(this.formData.warehouseId == warehouseName || this.formData.warehouseName== ''){
                        this.vueMessage('warning','出库仓库为必填项!');
                        return
                    }
                }
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        let amount = 0;
                        let taxAmount = 0;
                        for (let i in this.formData.items) {
                            if (this.formData.items[i].amount) {
                                amount = Number(this.formData.items[i].amount) + Number(amount);
                                taxAmount = Number(this.formData.items[i].taxAmount) + Number(taxAmount);
                            }

                        }
                        this.formData.billAmount = Number(amount).toFixed(this.sysParam.amountDecimal);
                        this.formData.taxBillAmount = Number(taxAmount).toFixed(this.sysParam.amountDecimal);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/sales_stock_out',
                                    name: '销售出库',
                                    meta: {
                                        i18n: 'sales_stock_out'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            }  else {
                                this.vueMessage('warning',res.data.msg)
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
