<template>
    <div>
        <basic-container>
            <div style="width: 100%;">
<!--                <el-tabs v-model="activeName">-->
<!--                    <el-tab-pane label="待付款" name="first" ></el-tab-pane>-->
<!--                    <el-tab-pane label="待发货" name="second"></el-tab-pane>-->
<!--                    <el-tab-pane label="部分发货" name="third"></el-tab-pane>-->
<!--                    <el-tab-pane label="全部发货" name="fourth"></el-tab-pane>-->
<!--                    <el-tab-pane label="已完成" name="fifth"></el-tab-pane>-->
<!--                    <el-tab-pane label="已关闭" name="sixth"></el-tab-pane>-->
<!--                </el-tabs>-->
            </div>
            <el-form :inline="true">
                <el-form-item label="订单编号：">
                    <el-input placeholder="请输入订单编号" v-model="listQuery.masterOrderSn" style="width: 300px" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input placeholder="请输入客户名称" v-model="listQuery.memberUsername" style="width: 300px" clearable></el-input>
                </el-form-item>
                <el-form-item label="订单来源：">
                    <el-select v-model="listQuery.sourceType" style="width: 300px" clearable>
                        <el-option :label="key" v-for="(key,value) in sourceTypeMap" :value="value" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单类型：">
                    <el-select v-model="listQuery.orderType" style="width: 300px" clearable>
                        <el-option :label="key" v-for="(key,value) in orderTypeMap" :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="isDetail?'下单时间：　':'下单时间：'">
                    <el-date-picker
                            v-model="listQuery.createTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            style="width: 300px;"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="handleSearchChange">搜索</el-button>
                    <el-button icon="el-icon-delete" @click="handleSearchReset">重置</el-button>
                </el-form-item>
            </el-form>
            <avue-crud ref="crud"
                       :page="page"
                       :data="list"
                       :table-loading="loading"
                       :option="tableMainOption"
                       @refresh-change="refreshChange"
                       :summary-method="getSummaries"
                       @size-change="handleSizeChange"
                       @selection-change="handleSelectionChange"
                       @current-change="handleCurrentChange"
                       @search-change="handleSearchChange"
                       @search-reset="handleSearchReset"
                       @sort-change="handleSortChange"
                       @row-click="rowClick">
                <template slot="menuLeft">
<!--                    <el-button type="warning" icon="el-icon-download" @click="excelTable" plain>导出</el-button>-->
<!--                    <el-button type="success" icon="el-icon-plus" @click="excelTable" plain>生成EDI订单</el-button>-->
<!--                    <span style="margin-left: 15px;"></span>-->
<!--                    <el-switch v-model="isDetail" active-text="子订单" @change="changeOrder"></el-switch>-->
<!--                    <span style="margin-left: 15px;"></span>-->

                </template>
<!--                <template slot-scope="scope" slot="menu">-->
<!--                    <div>-->
<!--                        &lt;!&ndash;                        <el-button type="text" @click="showOrderDetail(scope.row)">详情</el-button>&ndash;&gt;-->
<!--                        <el-button type="text" @click="orderNote(scope.row)" v-if="activeName!=='sixth'&&activeName!=='fifth'&&!isDetail">商家备注</el-button>-->
<!--                        <el-button type="text" v-if="Number(scope.row.status) === 1&&!isDetail" @click="doDeliverGoods(scope.row)">立即发货</el-button>-->
<!--                        <el-button type="text" v-else-if="Number(scope.row.status) === 8&&!isDetail" @click="doDeliverGoods(scope.row)">继续发货</el-button>-->
<!--                        <el-button type="text" v-else-if="Number(scope.row.status) === 4&&!isDetail" @click="doDeleteOrder(scope.row)" style="color:red;">删除</el-button>-->
<!--                    </div>-->
<!--                </template>-->
                <template slot-scope="scope" slot="masterOrderSn">
                    <div style="text-align: center">
                        <span style="color: #409EFF;cursor: pointer" @click="showOrderDetail(scope.row,scope.row.masterOrderId)">{{scope.row.masterOrderSn}}</span>
                    </div>
                </template>
                <template slot-scope="scope" slot="orderSn">
                    <div style="text-align: center">
                        <span style="color: #409EFF;cursor: pointer" @click="showOrderDetail(scope.row)">{{scope.row.orderSn}}</span>
                    </div>
                </template>
                <template slot-scope="scope" slot="memberUsername">
                    <span>{{scope.row.mainDTO.memberUsername}}</span>
                </template>
                <template slot-scope="scope" slot="status">
                    <span>{{orderStatusMap[scope.row.mainDTO.status]}}</span>
                </template>
                <template slot-scope="scope" slot="sourceType">
                    <span>{{sourceTypeMap[scope.row.mainDTO.sourceType]}}</span>
                </template>
                <template slot-scope="scope" slot="orderType">
                    <span>{{orderTypeMap[scope.row.mainDTO.orderType]}}</span>
                </template>
                <template slot-scope="scope" slot="isReplaceDelivery">
                    <span>{{replaceDeliveryMap[scope.row.mainDTO.isReplaceDelivery]}}</span>
                </template>
                <template slot-scope="scope" slot="productPrice">
                    <span style="color: red">{{Number(scope.row.productPrice).toFixed(4)}}</span>
                </template>
                <template slot-scope="scope" slot="productDiscount">
                    <span style="color: red">{{division(scope.row.productPrice,scope.row.retailPrice).toFixed(4)}}</span>
                </template>
                <template slot-scope="scope" slot="productAmount">
                    <span style="color:red;">{{accAdd(scope.row.retailPrice,-scope.row.productPrice).toFixed(4)}}</span>
                </template>
<!--                <template slot-scope="scope" slot="discountAmount">-->
<!--                    <span>{{accAdd(scope.row.totalAmount,scope.row.payAmount*(-1)).toFixed(4)}}</span>-->
<!--                </template>-->
            </avue-crud>
            <!-- 商家备注对话框 -->
            <el-dialog modal-append-to-body append-to-body title="商家备注" :visible.sync="dialogFormVisible" width="30%" v-if="dialogFormVisible">
                <el-form ref="addList" :model="addList" status-icon label-position="left" label-width="70px"
                         style='width: 400px; margin-left:50px;'>
                    <el-form-item label="订单编号" prop="orderSn">
                        <el-input v-model="addList.orderSn" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="订单备注" prop="note">
                        <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="addList.note"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" :loading="isLoading" @click="noteSubmit">确定</el-button>
                </div>
            </el-dialog>





            <!--            立即发货&继续发货对话框-->
            <el-dialog modal-append-to-body append-to-body :title="titleMap[titleIndex].label" :visible.sync="isDeliverGoods" width="70%">
                <el-form ref="ruleForm" class="demo-ruleForm" :model="addList" :inline="true" :rules="rules">
                    <el-card shadow="never">
                        <div class="operate-container">
                            <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
                            <span class="color-danger">&nbsp;&nbsp;当前订单状态：</span>{{titleMap[titleIndex].label}}
                        </div>
                    </el-card>
                    <h2>收货信息</h2>
                    <el-table :data="detailData" border style="width: 100%">
                        <el-table-column prop="receiverName" align="center" label="收货人"></el-table-column>
                        <el-table-column prop="receiverPhone" align="center" label="手机号码" ></el-table-column>
                        <el-table-column prop="receiverDetailAddress" align="center" label="收货地址"></el-table-column>
                    </el-table>
                    <h2>物流信息</h2>
                    <div style="height: 15px"></div>
                    <el-form-item label="快递公司">
                        <el-select  placeholder="请选择" clearable filterable v-model="addList.deliveryCompany">
                            <el-option v-for="item in logistics" :key="item.id" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="deliverySn">
                        <el-input style="width: 300px" pleceholder="请输入快递单号" v-model="addList.deliverySn"></el-input>
                    </el-form-item>
                    <el-form :model="detailGoods" ref="ruleForm2">
                        <div v-for="(data,index) in detailGoods">
                            <div style="margin-bottom: 40px;margin-top: 40px;">
                                <span>子订单{{index+1}}：{{data.orderSn}}</span><span style="margin-left: 120px;">订单类型：{{orderTypeMap[data.sp3]}}</span>
                            </div>
                            <el-table :data="data" border style="width: 100%"   >
                                <el-table-column align="center" label="商品信息" v-slot="{row}">
                                    <img :src="row.productPic" alt="" style="display: inline-block;width: 80px;vertical-align: top;margin-right: 15px;" >
                                    <div style="display: inline-block;vertical-align: text-top;text-align: left">
                                        <colors-component-my :brandName="row.productBrand"></colors-component-my><span>{{row.productName}}</span><div></div>
                                        <span>订货号: </span><span>{{row.sp1}}</span><div></div>
                                        <span>型号: </span><span>{{row.sp2}}</span>
                                    </div>
                                </el-table-column>
                                <el-table-column prop="productPrice" align="center" label="价格"></el-table-column>
                                <el-table-column prop="productQuantity" align="center" label="购买数量"></el-table-column>
                                <el-table-column align="center" label="未发数量" prop="undeliveredQty">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.productQuantity-scope.row.deliverQuantity}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="小计" >
                                    <template slot-scope="scope">
                                        <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="本次发货数量" prop="shippedQty" width="200" v-slot="{row,$index}">
                                    <el-form-item :prop="`[${index}][${$index}].shippedQty`" :rules="[{required: true, message: '发货数量不能为空', trigger: 'blur'},
                        {type: 'number',min:0,max:row.productQuantity-row.deliverQuantity, message: '数量不能大于未发数量', trigger: 'blur'}]">
                                        <el-input v-model.number="detailGoods[index][$index].shippedQty" type="number" placeholder="请输入发货数量" min="0"></el-input>
                                    </el-form-item>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isDeliverGoods=false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">发 货</el-button>
                </div>
            </el-dialog>

            <!--            订单详情对话框-->
            <el-dialog title="订单详情" :visible.sync="showAddEDI" width="70%" v-if="showAddEDI" modal-append-to-body append-to-body>
                <h2 style="position: absolute;top: 0;right: 84px">NO:{{addList.masterOrderSn}}</h2>
<!--                <div style="margin-bottom: 40px;">-->
<!--                    <span>主订单号：{{addList.orderSn||''}}</span>-->
<!--                    <span style="margin-left: 120px;">下单时间：{{addList.createTime}}</span>-->
<!--&lt;!&ndash;                    <span style="margin-left: 120px;">订单来源：{{addList.sourceType===0?'PC端商城':'微信小程序'}}</span>&ndash;&gt;-->
<!--                </div>-->
                <el-form :model="addList" :rules="rules" ref="addList" :inline="true" size="medium" label-width="140px" label-position="right" :disabled="true" v-if="false">
                    <el-form-item label="收货人姓名：" prop="receiverName">
                        <el-input v-model="addList.receiverName" plaecholder="请输入收货人姓名" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人电话：" prop="receiverPhone">
                        <el-input v-model="addList.receiverPhone" plaecholder="请输入收货人电话" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="省份城市：" prop="provinceAndCity">
                        <el-cascader
                                placeholder="请选择所在省份城市"
                                v-model="addList.provinceAndCity"
                                style="width: 250px"
                                :props="{ expandTrigger: 'hover' }"
                                :options="regionData">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="配送方式：" prop="distributionMode">
                        <el-select v-model="addList.distributionMode" style="width: 250px" placeholder="请选择配送方式">
                            <el-option label="快递运输" :value="0"></el-option>
                            <el-option label="运费到付" :value="1"></el-option>
                            <el-option label="货物自提" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结算方式：">
                        <el-input type="text" :readonly="true" style="width: 250px" value="线下支付" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="是否代发：">
                        <el-switch v-model="addList.isReplaceDelivery" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="代发货公司：" :required="true" v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceDeliveryCompany"  style="width: 250px" placeholder="请输入代发货公司"></el-input>
                    </el-form-item>
                    <el-form-item label="代发货联系人：" :required="true"  v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceLinkMan" style="width: 250px"  placeholder="请输入代发货联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="代发货联系电话：" :required="true" v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceLinkPhone" style="width: 250px"  placeholder="请输入代发货联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="deliverDetailAddress">
                        <el-input v-model="addList.deliverDetailAddress"  style="width: 54.7vw"  placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="addList.note"  style="width: 54.7vw"  placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <el-table :data="EDIData" border style="width: 100%">
                    <el-table-column align="center" label="商品信息" v-slot="{row}" width="400px">
                        <el-image :src="row.productPic" alt="" style="display: inline-block;width: 80px;height: 80px;vertical-align: top;margin-right: 15px;" ></el-image>
                        <div style="display: inline-block;vertical-align: text-top;text-align: left">
                            <colors-component-my :brandName="row.productBrand"></colors-component-my><span>{{row.productName}}</span><div></div>
                            <span>订货号: </span><span>{{row.sp1}}</span><div></div>
                            <span>型号: </span><span>{{row.sp2}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="productPrice" align="center" label="价格"></el-table-column>
                    <el-table-column prop="productQuantity" align="center" label="购买数量"></el-table-column>
                    <!--                    <el-table-column align="center" label="未发数量" prop="undeliveredQty">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <span>{{scope.row.productQuantity-scope.row.deliverQuantity}}</span>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column align="center" label="小计" >
                        <template slot-scope="scope">
                            <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="发货数量" prop="deliverQuantity">
                    </el-table-column>
                </el-table>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {updateOrderNote,closeOrder,deleteOrder,orderDetail,getLogistics,doDeliver,selectPageByItem,orderMainDetail} from '@/api/erp/saas/orderControl/orderList';
    import {listCatAndBrand} from '@/api/erp/goods/goods';
    import {page as selectPage,selectDetail} from '@/api/erp/saas/orderControl/EDI';
    import colorsComponentMy from '@/components/saas/colors';
    import {regionData, CodeToText,TextToCode} from 'element-china-area-data';

    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    export default {
        name: "orderList",
        data() {
            return {
                activeName: 'first',//当前标签页
                status:0,//默认查询未付款账单
                dialogFormVisible:false,//是否显示商家备注对话框
                addList:{},//对话框数据存储对象
                isLoading:false,//按钮是否显示加载中
                isShowDetail:false,//是否展示订单详情
                resetTable:true,//切换表格用参数
                showAddEDI:false,
                EDIData:[],
                detailTime:[],//步骤条时间展示
                titleIndex:0,//当前步骤条处于什么阶段
                sourceTypeMap:{
                    0:'PC端商城',
                    1:'微信小程序'
                },
                titleMap: [//订单状态字典
                    {
                        value: 0,
                        label: '待付款'
                    },
                    {
                        value: 1,
                        label: '待发货'
                    },
                    {
                        value: 2,
                        label: '部分发货'
                    },
                    {
                        value: 3,
                        label: '全部发货'
                    },
                    {
                        value: 4,
                        label: '已完成'
                    },
                    {
                        value: 5,
                        label: '已关闭'
                    },
                ],
                orderTypeMap: {//订单类型字典
                    0:"正常订单",
                    1:"秒杀订单",
                    2:"期货订单",
                    3:"调拨订单"
                },
                distributionModeMap:{//配送方式字典
                    0:'快递运输',
                    1:'运费到付',
                    2:'货物自提'
                },
                payTypeMap:{//支付方式字典
                    0:'未支付',
                    1:'支付宝',
                    2:'微信',
                    3:'客户余额'
                },
                replaceDeliveryMap:{
                    0:'否',
                    1:'是'
                },
                showColumn:[],
                note:'',//商家备注
                detailData:{},//订单详情数据源
                detailGoods:[],//订单详情商品信息数据源
                isDeliverGoods:false,//是否展示发货对话框
                logistics:[],//物联快递存储数组
                rules: {//立即发货&继续发货表单验证

                },
                deliverList:[],//发货清单存储数组
                isShow: true,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20, // 每页显示多少条
                },
                option:{},
                freeGoods:[],//赠品列表数组
                listQuery: {
                },
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                },
                orderStatusMap:{
                    0:'待付款',
                    1:'待发货',
                    2:'已发货',
                    3:'已完成',
                    4:'已关闭',
                    5:'无效订单',
                    6:'异常订单',
                    7:'部分支付',
                    8:'发货中',
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableMainOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    menu: false,//是否显示行操作按钮
                    menuWidth:200,
                    delBtn:false,//列删除隐藏
                    editBtn:false,//列编辑隐藏
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: [//主订单列配置
                        {
                            label: "订单编号",
                            prop: "masterOrderSn",
                            minWidth: 180,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "订单状态",
                            prop: "status",
                            minWidth: 180,
                            align: 'center',
                            slot: true,
                            dicData: [
                                {
                                    value:0,
                                    label:"待付款"
                                },
                                {
                                    value:1,
                                    label:"待发货"
                                },
                                {
                                    value:2,
                                    label:"已发货"
                                },
                                {
                                    value:3,
                                    label:"已完成"
                                },
                                {
                                    value:4,
                                    label:"已关闭"
                                },
                                {
                                    value:5,
                                    label:"无效订单"
                                },
                                {
                                    value:6,
                                    label:"异常订单"
                                },
                                {
                                    value:7,
                                    label:"部分支付"
                                },
                                {
                                    value:8,
                                    label:"发货中"
                                },
                            ]
                        },
                        {
                            label: "客户名称",
                            prop: "memberUsername",
                            minWidth: 180,
                            slot: true,
                            align: 'center',
                        },
                        {
                            label: "订单来源",
                            prop: "sourceType",
                            minWidth: 180,
                            align: 'center',
                            slot: true,
                            type:'select',
                            dicData: [
                                {
                                    value:0,
                                    label:"PC端商城"
                                },
                                {
                                    value:1,
                                    label:"微信小程序"
                                },
                            ]
                        },
                        {
                            label: "订单类型",
                            prop: "orderType",
                            minWidth: 180,
                            align: 'center',
                            slot: true,
                            type: 'select',
                            dicData: [
                                {
                                    value:0,
                                    label:"正常订单"
                                },
                                {
                                    value:1,
                                    label:"秒杀订单"
                                },
                                {
                                    value:2,
                                    label:"期货订单"
                                },
                                {
                                    value:3,
                                    label:"调拨订单"
                                },
                            ]
                        },
                        {
                            label: "是否代发货",
                            prop: "isReplaceDelivery",
                            minWidth: 180,
                            slot: true,
                            align: 'center',
                            dicData: [
                                {
                                    value:0,
                                    label:"否"
                                },
                                {
                                    value:1,
                                    label:"是"
                                },
                            ]
                        },
                        {
                            label: "品名",
                            prop: "productName",
                            minWidth: 180,
                            align: 'center',
                        },
                        {
                            label: "品牌",
                            prop: "productBrand",
                            minWidth: 180,
                            align: 'center',
                        },
                        {
                            label: "型号",
                            prop: "sp2",
                            minWidth: 200,
                            align: 'center',
                        },
                        {
                            label: "订货号",
                            prop: "sp1",
                            minWidth: 180,
                            align: 'center',
                        },
                        {
                            label: "系列",
                            prop: "productSeries",
                            minWidth: 180,
                            align: 'center',
                        },
                        {
                            label: "面价",
                            prop: "retailPrice",
                            minWidth: 180,
                            textColor:'#ff0000',
                            color:'red',
                            align: 'center',
                        },
                        {
                            label: "数量",
                            prop: "deliverQuantity",
                            minWidth: 180,
                            align: 'center',
                        },
                        {
                            label: "调拨价",
                            prop: "productPrice",
                            minWidth: 180,
                            slot: true,
                            align: 'right',
                            textColor:'#ff0000',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float:'right'
                                        }
                                    },
                                    "调拨价"
                                );
                            },
                        },
                        {
                            label: "调拨折扣",
                            prop: "productDiscount",
                            slot: true,
                            minWidth: 180,
                            align: 'right',
                            textColor:'#ff0000',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float:'right'
                                        }
                                    },
                                    "调拨折扣"
                                );
                            },
                        },
                        {
                            label: "调拨金额",
                            prop: "productAmount",
                            slot: true,
                            minWidth: 180,
                            align: 'right',
                            textColor:'#ff0000',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float:'right'
                                        }
                                    },
                                    "调拨金额"
                                );
                            },
                        },

                        //
                        // {
                        //     label: "订单金额",
                        //     prop: "totalAmount",
                        //     minWidth: 180,
                        //     align: 'right',
                        //     textColor:'#ff0000',
                        //     sortable: true,
                        //     renderHeader: (h, { column, $index }) => {
                        //         return h('div',{style:{display:'inline'}}, [
                        //                 h('span',{
                        //                     style: {
                        //                         color: "#ff0000"
                        //                     }
                        //                 },column.label)
                        //             ]
                        //         )
                        //     },
                        // },
                        // {
                        //     label: "优惠金额",
                        //     prop: "discountAmount",
                        //     minWidth: 180,
                        //     align: 'right',
                        //     slot:true,
                        //     textColor:'#ff0000',
                        //     renderHeader: h => {
                        //         return h(
                        //             "span",
                        //             {
                        //                 style: {
                        //                     color: "#ff0000",
                        //                     float:'right'
                        //                 }
                        //             },
                        //             "优惠金额"
                        //         );
                        //     },
                        // },
                        // {
                        //     label: "实付金额",
                        //     prop: "payAmount",
                        //     minWidth: 180,
                        //     textColor:'#ff0000',
                        //     align: 'right',
                        //     renderHeader: h => {
                        //         return h(
                        //             "span",
                        //             {
                        //                 style: {
                        //                     color: "#ff0000",
                        //                     float:'right'
                        //                 }
                        //             },
                        //             "实付金额"
                        //         );
                        //     },
                        // },
                        // {
                        //     label: "下单时间",
                        //     prop: "createTime",
                        //     minWidth: 180,
                        //
                        //     sortable: true,
                        //     align: 'center',
                        //     valueFormat: 'yyyy-MM-dd',
                        //     format: 'yyyy-MM-dd',
                        //     type: "daterange",
                        //     startPlaceholder: '开始日期',
                        //     endPlaceholder: '结束日期',
                        // },
                        // {
                        //     label: "备注",
                        //     prop: "note",
                        //     minWidth: 180,
                        //     align: 'center',
                        // },
                    ],
                },

                isDetail:false,//是否为查询子订单
                isDetailOrder:false,//对话框是否子订单
                categoryList: [],
                brandList: [],
            }
        },
        components:{
            colorsComponentMy
        },
        watch: {
            activeName(val,oldData) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.listQuery = {};
                    switch (val) {
                        case 'first':
                            this.status=0
                            this.titleIndex=0
                            break;
                        case 'second':
                            this.status=1
                            this.titleIndex=1
                            break;
                        case 'third':
                            this.status=8
                            this.titleIndex=2
                            break;
                        case 'fourth':
                            this.status=2
                            this.titleIndex=3
                            break;
                        case 'fifth':
                            this.status=3
                            this.titleIndex=4
                            break;
                        case 'sixth':
                            this.status=4
                            this.titleIndex=5
                            break;
                    }
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            },
            '$route': function (to, from) {
                if(this.$route.query.tabType&&this.$route.query.tabType!==''){
                    this.activeName=this.$route.query.tabType
                }
                console.log(this.$route,'77')
                if(this.$route.params.billNo&&this.$route.params.billNo!==''){
                    this.listQuery.orderSn=this.$route.params.billNo
                    this.getList(this.page,this.listQuery)
                }
            },
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
            // listCatAndBrand().then(response => {
            //     this.categoryList = response.data.data.categoryList;
            //     this.brandList = response.data.data.brandList;
            // });
            this.getList(this.page);
            this.option=this.tableMainOption
        },
        updated() {
            //this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, {
                    page: page.currentPage,
                    limit: page.pageSize,
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let method=this.isDetail?selectPageByItem:selectPage
                method(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    // for (let i = 0; i <data.records.length ; i++) {
                    //     data.records[i].totalAmount=data.records[i].totalAmount.toFixed(4)
                    //     data.records[i].payAmount=data.records[i].payAmount.toFixed(4)
                    // }
                    this.list = data;
                    this.loading = false;
                    this.resetTable=false
                    this.$nextTick(()=>{
                        this.resetTable=true
                    })
                },error => {
                    this.loading = false;
                    this.showError(error)
                })
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
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            //搜索
            handleSearchChange() {
                // if (this.searchDisable) {
                //     return;
                // }
                // this.searchDisable = true;
                let params=Object.assign({},this.listQuery)
                //this.listQuery = params;
                try {
                    params.startTime = params.createTime[0] + ' 00:00:00'
                    params.endTime = params.createTime[1] + ' 23:59:59'
                    delete params.createTime
                } catch (e) {

                }
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

            handleDateSelect(val) {
                this.listQuery.startTime = val[0] + ' 00:00:00';
                this.listQuery.endTime = val[1] + ' 23:59:59';
            },

            /**
             * 商家备注
             */
            orderNote(row){
                this.dialogFormVisible=true
                if(row.id){
                    this.addList=row
                    this.note=this.addList.note||''
                }

            },

            /**
             * 商家备注提交事件
             */
            noteSubmit(){
                this.isLoading=true
                let params = new URLSearchParams();
                params.append("id", this.addList.id);
                params.append("note", this.note);
                updateOrderNote(params).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.$message.success('修改商家备注成功!')
                        this.dialogFormVisible=false
                    }else{
                        this.showError('修改商家备注失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('修改商家备注失败,'+error))
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

            init(){
                this.dialogFormVisible=false
                this.isShowDetail=false
                this.isLoading=false
                this.isDeliverGoods=false
                this.getList(this.page)
            },

            /**
             * 展示订单详情
             * @param row
             * @param id 需要查询的订单id
             */
            showOrderDetail(row,id){
                this.isDetailOrder=Boolean(id)
                this.freeGoods=[]
                this.showAddEDI=true
                this.addList=row
                //console.log(Boolean(this.isDetail||id),'方法')
                selectDetail(id||row.id).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        // if(this.isDetail&&!id){
                        //     this.detailData=res.data.data.mainDTO
                        //     this.deliverList=res.data.data.deliverList
                        //     for (let i = 0; i <res.data.data.orderItemList.length ; i++) {
                        //         res.data.data.orderItemList[i].productPrice=res.data.data.orderItemList[i].productPrice.toFixed(4)
                        //     }
                        //     this.detailGoods=res.data.data.orderItemList
                        //     this.detailTime=[res.data.data.createTime,this.detailData.paymentTime,this.detailData.deliveryTime,this.detailData.receiveTime,this.detailData.commentTime,res.data.data.uptTime]
                        // }else{
                        //     this.detailData=res.data.data
                        //     // for (let i = 0; i <res.data.data.itemDtoList.length ; i++) {
                        //     //     res.data.data.itemDtoList[i].productPrice=res.data.data.itemDtoList[i].productPrice.toFixed(4)
                        //     // }
                        //     //对订单号进行排序
                        //     this.detailGoods=res.data.data.itemDtoList.sort(function (a,b) {
                        //         // return Number(a[0].orderSn.substring(a[0].orderSn.length-4))-Number(b[0].orderSn.substring(b[0].orderSn.length-4))
                        //         // console.log('比较',BigInt(a[0].orderSn),BigInt(b[0].orderSn),BigInt(a[0].orderSn)>BigInt(b[0].orderSn))
                        //         return BigInt(a[0].orderSn)>BigInt(b[0].orderSn)?1:-1
                        //     })
                        //     // this.detailGoods=res.data.data.itemDtoList.result.sort((a,b)=>a[0].orderSn-b[0].orderSn);
                        //     this.detailTime=[res.data.data.createTime,this.detailData.paymentTime,this.detailData.deliveryTime,this.detailData.receiveTime,this.detailData.commentTime,res.data.data.uptTime]
                        //     if(res.data.data.umsMemberGiveawayList&&res.data.data.umsMemberGiveawayList.goodsList){
                        //         this.freeGoods=res.data.data.umsMemberGiveawayList.goodsList
                        //     }
                        //
                        //     //console.log(this.freeGoods,'赠品')
                        // }
                        this.EDIData=res.data.data
                    }else{
                        this.showError('获取订单详情失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error=>this.showError('获取订单详情失败,'+error))
            },

            /**
             *关闭订单
             */
            doCloseOrder(){
                this.$confirm('此操作将永久关闭, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    closeOrder({orderId:this.addList.id}).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('关闭订单成功!')
                        }else{
                            this.showError('关闭订单失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('关闭订单失败,'+error))
                })
            },

            /**
             * 删除订单
             */
            doDeleteOrder(row){
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("id", row.id);
                    deleteOrder(params).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('删除订单成功!')
                        }else{
                            this.showError('删除订单失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('删除订单失败,'+error))
                })

            },

            /**
             * 精确计算小数乘法
             * @param data1 数1
             * @param data2 数2
             * @returns {number} 计算结果
             */
            accMulti(data1, data2) {
                let baseData = 0;
                try { baseData += data1.toString().split(".")[1].length;} catch (e) {}
                try { baseData += data2.toString().split(".")[1].length;} catch (e) {}
                return Number(data1.toString().replace(".", "")) * Number(data2.toString().replace(".", "")) / Math.pow(10, baseData);
            },

            /**
             * 精确计算小数加法
             * @param data1 数1
             * @param data2 数2
             * @returns {number} 计算结果
             */
            accAdd(data1, data2) {
                let r1, r2, m, c;
                try {  r1 = data1.toString().split(".")[1].length;}catch (e) {  r1 = 0; }
                try { r2 = data2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
                c = Math.abs(r1 - r2);
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        data1= Number(data1.toString().replace(".", ""));
                        data2= Number(data2.toString().replace(".", "")) * cm;
                    } else {
                        data1= Number(data1.toString().replace(".", "")) * cm;
                        data2= Number(data2.toString().replace(".", ""));
                    }
                } else {
                    data1= Number(data1.toString().replace(".", ""));
                    data2= Number(data2.toString().replace(".", ""));
                }
                return (data1+ data2) / m;
            },

            /**
             *立即发货&继续发货按钮点击
             */
            doDeliverGoods(row){
                this.isDeliverGoods=true
                this.addList=row
                this.detailData=[row]
                this.listQuery.status=0
                this.listQuery.limit=50
                allLogistics().then(res=>{
                    this.logistics=res.data
                },error => this.showError('获取物流快递失败,'+error))
                orderMainDetail(row.id).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList.deliverItemList=res.data.data.itemDtoList
                        this.detailGoods=res.data.data.itemDtoList
                    }else{
                        this.showError('获取订单详情失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error=>this.showError('获取订单详情失败,'+error))
                console.log(row)
            },

            /**
             * 立即发货&继续发货
             */
            async handleSubmit(){
                try {
                    this.addList.sourceBillNo=this.addList.id
                    for (let i = 0; i <this.addList.deliverItemList.length ; i++) {
                        this.addList.deliverItemList[i].masterId=this.addList.id
                        this.addList.deliverItemList[i].masterOrderId=this.addList.id
                        this.addList.deliverItemList[i].masterOrderItemId=this.addList.deliverItemList[i].id
                        this.addList.deliverItemList[i].itemNo=this.addList.deliverItemList[i].sp1
                        this.addList.deliverItemList[i].specModel=this.addList.deliverItemList[i].sp2
                        this.addList.deliverItemList=this.addList.deliverItemList.flat(Infinity)
                    }
                }catch (e) {
                    console.log(e,'error')
                }
                this.$refs['ruleForm'].validate((valid) =>{
                    if (!valid) {
                        this.$message.warning('请正确填写发货信息');
                        return false
                    }
                });
                this.$refs['ruleForm2'].validate((valid) =>{
                    if (!valid) {
                        this.$message.warning('请正确填写发货信息');
                        return false
                    }
                });
                doDeliver(this.addList).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('发货成功!')
                    }else{
                        this.showError('发货失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('发货失败,'+error))
            },

            /**
             *详情内立即发货按钮
             */
            goDeliverGoods(){
                this.isShowDetail=false
                this.doDeliverGoods(this.addList)
            },

            /**
             * 表格导出
             */
            excelTable(){
                import('@/vendor/Export2Excel').then(excel => {
                    var tHeader;
                    var filterVal;
                    var list = JSON.parse(JSON.stringify(this.selectedRows));
                    tHeader = [ '订单编号', '客户名称','订单来源','订单类型' ,'是否代发货','订单金额', '优惠金额','实付金额','订单状态' ,'下单时间'];
                    filterVal = ['orderSn', 'memberUsername','$sourceType','$orderType','$isReplaceDelivery' ,'totalAmount','discountAmount' ,'payAmount','$status', 'createTime'];
                    excel.export_json_to_excel2(tHeader, list, filterVal, '订单表');
                })
                //console.log(this.selectedRows,'导出')
            },

            //多选框状态改变时
            handleSelectionChange(selection) {
                this.selectedRows = selection;
            },

            /**
             * 行单击
             * @param row 当前行
             */
            rowClick(row){
                this.$refs.crud.toggleSelection([row]);
            },

            changeOrder(flag){
                // this.resetTable=false
                if(flag){
                    //this.$set(this.tableOption,'column',this.detailColumn)
                    this.option=this.tableDetailOption
                    // this.option.column[0].showColumn=true
                }else{
                    //this.$set(this.tableOption,'column',this.mainColumn)
                    this.option=this.tableMainOption
                    // this.option.column[0].showColumn=false
                    // this.option.column.splice(0,1)
                }
                //console.log(this.tableOption.column,'换了表格')
                // console.log(this.option.column,'操作后')
                // console.log('删除了',this.showColumn)
                this.init()

            }
        }
    }
</script>

<style scoped lang="scss">
    .color-danger {
        color: #F56C6C;
    }

    .operate-container {
        background: #F2F6FC;
        height: 80px;
        margin: -20px -20px;
        line-height: 80px;
    }

    .color-danger {
        color: #F56C6C;
    }

    .crudListTitle {
        display: inline-block;
        margin: 10px 0px;
    }

    .crudListTitles {
        display: inline-block;
        margin: 0px 0px 10px 0px;
    }

    .logisticsData {
        display: flex;
        flex-direction: column;
        width: 100%;
        div {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 12px;
            .logisticsData_item_div {
                width: calc(20% - 1px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 40px;
                border: 1px solid #EBEEF5;
                border-bottom: none !important;
            }
            .logisticsData_item_div:not(:first-child) {
                border-left: none !important;
            }
        }
        .logisticsData_item {
            border-bottom: 1px solid #EBEEF5 !important;
            margin-bottom: 10px;
        }
    }
    .logisticsDatas {
        display: flex;
        flex-direction: column;
        width: 100%;
        div {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 12px;
            .logisticsData_item_div {
                width: calc(25% - 1px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 40px;
                border: 1px solid #EBEEF5;
                border-bottom: none !important;
            }
            .logisticsData_item_div:not(:first-child) {
                border-left: none !important;
            }
        }
        .logisticsData_item {
            border-bottom: 1px solid #EBEEF5 !important;
            margin-bottom: 10px;
        }
    }
    .avue-crud{
        margin: 0px!important;
    }
    .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
        background-color: #fff!important;
    }
    .el-table__fixed-footer-wrapper tbody td{
        background-color: #fff!important;
    }

    .orderDetail{
        display: inline-block;
        width: 22%;
        border-right: 1px dashed #eee;
        margin-left: 2%;
    }
    .orderDetail h4{
        font-weight: normal;
        color: #aaa;
    }
</style>
