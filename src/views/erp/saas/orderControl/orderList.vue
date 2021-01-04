<template>
    <div>
        <basic-container>
            <div style="width: 100%;">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="全部订单" name="zero"></el-tab-pane>
                    <el-tab-pane label="待付款" name="first"></el-tab-pane>
                    <el-tab-pane label="待发货" name="second"></el-tab-pane>
                    <el-tab-pane label="部分发货" name="third"></el-tab-pane>
                    <el-tab-pane label="全部发货" name="fourth"></el-tab-pane>
                    <el-tab-pane label="已完成" name="fifth"></el-tab-pane>
                    <el-tab-pane label="已关闭" name="sixth"></el-tab-pane>
                </el-tabs>
            </div>

            <el-form :inline="true">
                <el-form-item label="订单编号：" v-if="!isDetail">
                    <el-input placeholder="请输入订单编号" v-model="listQuery.orderSn" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="子订单编号：" v-else>
                    <el-input placeholder="请输入子订单编号" v-model="listQuery.orderSn" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input placeholder="请输入订单编号" v-model="listQuery.memberUsername" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="订单来源：">
                    <el-select v-model="listQuery.sourceType" style="width: 300px">
                        <el-option :label="key" v-for="(key,value) in sourceTypeMap" :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单类型：">
                    <el-select v-model="listQuery.orderType" style="width: 300px">
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
                <el-form-item label="　　品牌：" v-if="isDetail">
                    <el-input placeholder="请输入品牌" v-model="listQuery.brandName" style="width: 300px"
                              clearable></el-input>
                </el-form-item>
                <el-form-item label="　　系列：" v-if="isDetail">
                    <el-input placeholder="请输入系列" v-model="listQuery.seriesName" style="width: 300px"
                              clearable></el-input>
                </el-form-item>
                <el-form-item label="规格参数：" v-if="isDetail">
                    <el-input placeholder="请输入规格参数" v-model="listQuery.specModel" style="width: 300px"
                              clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="handleSearchChange">搜索</el-button>
                    <el-button icon="el-icon-delete" @click="handleSearchReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-button type="warning" icon="el-icon-download" @click="excelTable" plain v-if="isDetail">导出</el-button>
            <el-button type="warning" icon="el-icon-download" @click="excelDetail" plain>导出订单明细</el-button>
            <el-button type="warning" icon="el-icon-download" @click="excelContract" plain>导出合同</el-button>
            <el-button type="success" icon="el-icon-plus" @click="addEDI" plain
                       v-if="activeName==='second'&&openERP*1!==1&&!isDetail">生成EDI订单
            </el-button>
            <span style="margin-left: 15px;"></span>
            <el-switch v-model="isDetail" active-text="子订单" @change="changeOrder"></el-switch>
            <div style="height: 15px"></div>

            <!--            表格-->
            <el-table size="small" :data="list" v-loading="loading" element-loading-text="正在查询中。。。" border fit
                      @selection-change="handleSelectionChange" :span-method="arraySpanMethod"
                      highlight-current-row :row-class-name="tableRowClassName" v-if="resetTable">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="myIndex" label="#" align="center" width="55px"></el-table-column>
                <el-table-column label="订单编号" align="center" prop="orderSn" width="140px" v-if="!isDetail"
                                 v-slot="{row}">
                    <span style="color: #409EFF;cursor: pointer" @click="showOrderDetail(row)">{{row.orderSn}}</span>
                </el-table-column>
                <el-table-column label="主订单编号" align="center" prop="masterOrderSn" width="140px" v-else v-slot="{row}">
                    <span style="color: #409EFF;cursor: pointer" @click="showOrderDetail(row,row.masterOrderId)">{{row.masterOrderSn}}</span>
                </el-table-column>
                <el-table-column label="订单状态" align="center" prop="status" v-slot="{row}">
                    <span>{{orderStatusMap[row.status]}}</span>
                </el-table-column>
                <el-table-column label="子订单编号" align="center" prop="orderSn" width="152px" v-if="isDetail"
                                 v-slot="{row}">
                    <span style="color: #409EFF;cursor: pointer" @click="showOrderDetail(row)">{{row.orderSn}}</span>
                </el-table-column>
                <el-table-column label="客户名称" align="center" prop="memberUsername"></el-table-column>
                <el-table-column label="EDI" align="center" prop="edi" v-if="!isDetail" v-slot="{row}">
                    <span v-if="row.edi*1===1" style="color: #409EFF;cursor: pointer" @click="goEDIList(row)">是</span>
                    <span v-else>否</span>
                </el-table-column>
                <!--                <el-table-column label="rowspan" align="center" prop="rowspan"></el-table-column>-->
                <el-table-column label="订单来源" align="center" prop="sourceType" v-slot="{row}">
                    <span>{{sourceTypeMap[row.sourceType]}}</span>
                </el-table-column>
                <el-table-column label="订单类型" align="center" prop="orderType" v-slot="{row}">
                    <span>{{orderTypeMap[row.orderType]}}</span>
                </el-table-column>
                <el-table-column label="是否代发货" align="center" prop="isReplaceDelivery" v-slot="{row}" width="90px">
                    <span>{{row.isReplaceDelivery*1===1?'是':'否'}}</span>
                </el-table-column>
                <el-table-column label="订单金额" align="right" prop="totalAmount" class-name="red-title" sortable
                                 width="110px"></el-table-column>
                <el-table-column label="优惠金额" align="right" prop="discountAmount" class-name="red-title" sortable
                                 v-slot="{row}" width="110px">
                    <span>{{accAdd(row.totalAmount, row.payAmount * (-1)).toFixed(4)}}</span>
                </el-table-column>
                <el-table-column label="实付金额" align="right" prop="payAmount" class-name="red-title" sortable
                                 width="110px"></el-table-column>
                <el-table-column label="下单时间" align="center" prop="createTime" width="140px"></el-table-column>
                <el-table-column label="备注" align="center" prop="note"></el-table-column>
                <el-table-column label="订单详情" align="center" v-if="isDetail" prop="orderItemList">
                    <el-table-column label="品名" prop="orderItemList[0].productName"></el-table-column>
                    <el-table-column label="品牌" prop="orderItemList[0].productBrand"></el-table-column>
                    <el-table-column label="系列" prop="orderItemList[0].productSeries"></el-table-column>
                    <el-table-column label="规格参数" prop="orderItemList[0].sp2"></el-table-column>
                    <el-table-column label="面价" prop="orderItemList[0].retailPrice" align="right"
                                     class-name="red-title"></el-table-column>
                    <el-table-column label="折扣" v-slot="{row}">
                        <span>{{division(row.orderItemList[0].productPrice,row.orderItemList[0].retailPrice)}}</span>
                    </el-table-column>
                    <el-table-column label="单价" prop="orderItemList[0].productPrice" align="right"
                                     class-name="red-title"></el-table-column>
                    <el-table-column label="数量" prop="orderItemList[0].productQuantity"></el-table-column>
                    <el-table-column label="金额" v-slot="{row}" align="right" class-name="red-title">
                        <span>{{accMulti(row.orderItemList[0].productPrice,row.orderItemList[0].productQuantity)}}</span>
                    </el-table-column>
                </el-table-column>


                <el-table-column label="操作" align="center" fixed="right" v-slot="{row}" width="160px" v-if="!isDetail">
                    <el-button type="text" @click="orderNote(row)"
                               v-if="activeName!=='sixth'&&activeName!=='fifth'&&!isDetail&&Number(row.status) !== 4">
                        商家备注
                    </el-button>
                    <el-button type="text"
                               v-if="Number(row.status) === 1&&!isDetail&&openERP*1!==1&&Number(row.isReview) === 1"
                               @click="doDeliverGoods(row)">立即发货
                    </el-button>
                    <el-button type="text" v-else-if="Number(row.status) === 8&&!isDetail&&openERP*1!==1"
                               @click="doDeliverGoods(row)">继续发货
                    </el-button>
                    <el-button type="text" v-else-if="Number(row.status) === 4&&!isDetail" @click="doDeleteOrder(row)"
                               style="color:red;">删除
                    </el-button>
                    <el-button type="text" v-if="Number(row.isReview) === 0&&Number(row.status) === 1"
                               @click="doAudit(row)" style="color:red;">立即审核
                    </el-button>
                </el-table-column>
            </el-table>
            <div style="height: 15px"></div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="page.currentPage"
                               :page-sizes="[10,20,30,50]" :page-size="page.pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="page.total">
                </el-pagination>
            </div>
            <div style="height: 50px"></div>
            <!-- 商家备注对话框 -->
            <el-dialog title="商家备注" width="30%" modal-append-to-body append-to-body
                       v-if="dialogFormVisible">
                <el-form :model="addList" status-icon size="medium" label-width="100px" label-position="right">
                    <el-form-item label="订单编号：" prop="orderSn">
                        <el-input v-model="addList.orderSn" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="订单备注：" prop="note">
                        <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="addList.note"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" :loading="isLoading" @click="noteSubmit">确定</el-button>
                </div>
            </el-dialog>


            <!--            订单详情对话框-->
            <el-dialog title="订单详情" append-to-body :visible.sync="isShowDetail" width="70%" top="3vh"
                       v-if="isShowDetail" custom-class="order-detail">
                <div style="margin-bottom: 40px;">
                    <span>主订单号：{{addList.orderSn||''}}</span>
                    <span style="margin-left: 120px;">下单时间：{{addList.createTime}}</span>
                    <span style="margin-left: 120px;">订单来源：{{addList.sourceType===0?'PC端商城':'微信小程序'}}</span>
                </div>
                <div style="margin-bottom: 20px">
                    <el-steps :active="titleIndexMap[addList.status]" align-center v-if="activeName!=='sixth'">
                        <el-step title="待付款" :description='detailTime[0]' icon="el-icon-circle-check"></el-step>
                        <el-step title="待发货" :description='detailTime[1]' icon="el-icon-circle-check"></el-step>
                        <el-step title="部分发货" :description='detailTime[2]' icon="el-icon-circle-check"></el-step>
                        <el-step title="全部发货" :description='detailTime[3]' icon="el-icon-circle-check"></el-step>
                        <el-step title="已完成" :description='detailTime[4]' icon="el-icon-circle-check"></el-step>
                    </el-steps>
                    <el-steps :active="titleIndexMap[addList.status]" align-center v-else>
                        <el-step title="待付款" :description='detailTime[0]' icon="el-icon-circle-check"></el-step>
                        <el-step title="已关闭" :description='detailTime[5]' icon="el-icon-circle-close"></el-step>
                    </el-steps>
                </div>
                <el-card shadow="never">
                    <div class="operate-container">
                        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
                        <span class="color-danger">&nbsp;&nbsp;当前订单状态：</span>{{titleMap[titleIndexMap[addList.status]].label}}
                        <div style="float: right;margin-right: 20px;color: rgb(0,121,254)" v-if="!isDetail">
                            <el-link type="primary" :underline="false" @click="orderNote"
                                     :disabled="activeName==='sixth'">商家备注
                            </el-link>
                            <span v-if="openERP*1!==1">　|　</span>
                            <el-link :underline="false" type="primary" @click="goDeliverGoods"
                                     :disabled="activeName!=='second'&&activeName!=='third'" v-if="openERP*1!==1">
                                {{activeName==='second'?'立即发货':'继续发货'}}
                            </el-link>
                            <span v-if="openERP*1!==1">　|　</span>
                            <el-link :underline="false" type="primary" @click="doCloseOrder"
                                     :disabled="activeName!=='second'" v-if="openERP*1!==1">关闭订单
                            </el-link>
                        </div>
                    </div>
                </el-card>
                <el-card shadow="never">
                    <div style="" class="orderDetail">
                        <h3>收货信息</h3>
                        <h4>　收货人：{{detailData.receiverName}}</h4>
                        <h4>所在区域：{{detailData.receiverProvince}} {{detailData.receiverCity}}
                            {{detailData.receiverRegion}}</h4>
                        <h4>详细地址：{{detailData.receiverDetailAddress}}</h4>
                        <h4>联系方式：{{detailData.receiverPhone}}</h4>
                        <h4>　　&nbsp;</h4>
                    </div>
                    <div style="" class="orderDetail">
                        <h3>配送信息</h3>
                        <h4>配送方式：{{distributionModeMap[detailData.distributionMode]}}</h4>
                        <h4>　　运费：¥{{detailData.freightAmount}}</h4>
                        <h4>发货时间：{{detailData.deliveryTime}}</h4>
                        <h4>　　&nbsp;</h4>
                        <h4>　　&nbsp;</h4>
                    </div>
                    <div style="" class="orderDetail">
                        <h3>付款信息</h3>
                        <h4>付款方式：{{payTypeMap[detailData.payType]}}</h4>
                        <h4>付款时间：{{detailData.paymentTime}}</h4>
                        <h4>订单总额：¥{{detailData.totalAmount}}</h4>
                        <h4>实付金额：¥{{detailData.paymentedAmount}}</h4>
                        <h4>订单优惠：¥{{detailData.couponAmount}}</h4>
                    </div>
                    <div style="border: 0" class="orderDetail">
                        <h3>买家信息</h3>
                        <h4>买家名称：{{detailData.memberUsername}}</h4>
                        <h4>买家留言：{{detailData.note}}</h4>
                        <h4>发票抬头：无</h4>
                        <h4>发票信息：无</h4>
                        <h4>&nbsp;</h4>
                    </div>
                </el-card>
                <el-card shadow="never" v-for="(data,index) in deliverList" body-style="{margin-bottom:'20px'}">
                    <h3>物流信息{{index+1}}：</h3>
                    <span style="margin-right: 25px">快递公司：{{data.deliveryCompany}}</span><span>快递单号：{{data.deliverySn}}</span>
                    <h4>发货清单{{index+1}}：</h4>
                    <el-table :data="data.deliverItemList" border style="width: 100%">
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="productName" align="center" label="品名"></el-table-column>
                        <el-table-column prop="itemNo" align="center" label="订货号"></el-table-column>
                        <el-table-column prop="specModel" align="center" label="型号"></el-table-column>
                        <el-table-column prop="shippedQty" align="center" label="发货数量"></el-table-column>
                    </el-table>
                </el-card>
                <el-card shadow="never">
                    商家备注：{{addList.note||'暂无备注'}}
                </el-card>
                <h3 v-if="detailData.omsOrderDeliverDTOList&&detailData.omsOrderDeliverDTOList.length>0">物流信息</h3>
                <el-carousel :interval="4000" :autoplay="false" arrow="always" indicator-position="outside"
                             v-if="detailData.omsOrderDeliverDTOList&&detailData.omsOrderDeliverDTOList.length>0">
                    <el-carousel-item v-for="item in detailData.omsOrderDeliverDTOList" :key="item">
                        <table style="width: 37.7vw;margin: 0 auto">
                            <tr style="background-color: rgb(18,149,235);color: white;">
                                <td style="padding: 7px" colspan="3">
                                    <span>物流单号：{{item.deliveryCompany}}/{{item.deliverySn}}</span><span
                                        style="margin-left: 25px;">发货时间：{{item.createTime}}</span>
                                    <span style="float: right;cursor: pointer"
                                          @click="doShowLogistics(item)">查看物流信息</span>
                                </td>
                            </tr>
                            <!--                            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0">-->
                            <!--                                <td style="padding: 7px;" colspan="3">-->
                            <!--                                    <span>物流快递：</span>-->
                            <!--                                </td>-->
                            <!--                            </tr>-->
                            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0">
                                <td style="padding: 7px;border-right: 1px solid #E4E7ED;width: 40%">
                                    <span>产品型号</span>
                                </td>
                                <td style="padding: 7px;border-right: 1px solid #E4E7ED;width: 30%">
                                    <span>订货号</span>
                                </td>
                                <td style="padding: 7px;width: 30%;">
                                    <span>数量</span>
                                </td>
                            </tr>
                        </table>
                        <table :style="`max-height: 204px;width: 37.7vw;margin: 0 auto;overflow-y: ${item.deliverItemList&&item.deliverItemList.length>6?'scroll;overflow-x:hidden':'unset'};display: block;border-collapse: collapse;`">
                            <tr :style="`background-color: white;border: 1px solid #E4E7ED;border-top: 0;width: ${item.deliverItemList&&item.deliverItemList.length>6?'100%':'99.8%'};display: block`"
                                v-for="detailExpress in item.deliverItemList">
                                <td :style="`padding: 7px;border-right: 1px solid #E4E7ED;width: ${item.deliverItemList&&item.deliverItemList.length>6?'38.5%':'38.1%'};display: inline-block`">
                                    <span>{{detailExpress.specModel}}</span>
                                </td>
                                <td :style="`padding: 7px;border-right: 1px solid #E4E7ED;width: ${item.deliverItemList&&item.deliverItemList.length>6?'28.1%':'27.9%'};display: inline-block`">
                                    <span>{{detailExpress.itemNo}}</span>
                                </td>
                                <td style="padding: 7px;width: 27%;display: inline-block">
                                    <span>{{detailExpress.shippedQty}}</span>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 37.7vw;margin: 0 auto">
                            <tr style="background-color: white;border: 1px solid #E4E7ED;border-top: 0">
                                <td style="padding: 7px;" colspan="3">
                                    <span>备注：{{item.note}}</span>
                                </td>
                            </tr>
                        </table>
                    </el-carousel-item>
                </el-carousel>
                <div style="margin-bottom: 40px;margin-top: 40px;" v-if="freeGoods.length!==0">
                    <span>赠品信息</span>
                </div>
                <el-table :data="freeGoods" border style="width: 100%" v-if="freeGoods.length!==0">
                    <el-table-column align="center" label="商品信息" v-slot="{row}" width="320px">
                        <img :src="row.pic" alt=""
                             style="display: inline-block;width: 80px;vertical-align: middle;margin-right: 15px;">
                        <div style="display: inline-block">
                            <span style="color: red;border: 1px solid red;border-radius: 3px;font-size: 12px;margin-right: 5px;padding: 0 2px">赠品</span><span>{{row.name}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="quantity" align="center" label="数量"></el-table-column>
                </el-table>
                <div v-for="(data,index) in detailGoods" v-if="!isDetail||isDetailOrder">
                    <div style="margin-bottom: 40px;margin-top: 40px;">
                        <span>子订单{{index+1}}：{{data.orderSn}}</span><span style="margin-left: 120px;">订单类型：{{orderTypeMap[data.orderType]}}</span>
                    </div>
                    <el-table :data="data.omsOrderItemList" border style="width: 100%" id="orderList" show-summary
                              :summary-method="getSummaries">
                        <el-table-column align="left" label="商品信息" v-slot="{row}" width="320px">
                            <span style="margin-left: 20px;"></span>
                            <img :src="row.productPic" alt=""
                                 style="display: inline-block;width: 80px;vertical-align: top;margin-right: 15px;">
                            <div style="display: inline-block;vertical-align: text-top;text-align: left">
                                <colors-component-my :brandName="row.productBrand"></colors-component-my>
                                <span>{{row.productName}}</span>
                                <div></div>
                                <span>订货号: </span><span>{{row.sp1}}</span>
                                <div></div>
                                <span>型号: </span><span>{{row.sp2}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column prop="productPrice" align="center" label="价格"></el-table-column>
                        <el-table-column prop="productQuantity" align="center" label="购买数量"></el-table-column>
                        <el-table-column prop="deliverQuantity" align="center" label="已发货数量"
                                         v-if="activeName!=='first'"></el-table-column>
                        <el-table-column align="center" label="小计">
                            <template slot-scope="scope">
                                <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-table :data="detailGoods" border style="width: 100%" v-if="isDetail&&!isDetailOrder">
                    <el-table-column align="center" label="商品信息" v-slot="{row}" width="320px">
                        <img :src="row.productPic" alt=""
                             style="display: inline-block;width: 80px;vertical-align: top;margin-right: 15px;">
                        <div style="display: inline-block;vertical-align: text-top;text-align: left">
                            <colors-component-my :brandName="row.productBrand"></colors-component-my>
                            <span>{{row.productName}}</span>
                            <div></div>
                            <span>订货号: </span><span>{{row.sp1}}</span>
                            <div></div>
                            <span>型号: </span><span>{{row.sp2}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="productPrice" align="center" label="价格"></el-table-column>
                    <el-table-column prop="productQuantity" align="center" label="数量"></el-table-column>
                    <el-table-column align="center" label="小计">
                        <template slot-scope="scope">
                            <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>


            <!--            立即发货&继续发货对话框-->
            <el-dialog modal-append-to-body append-to-body :title="titleMap[titleIndexMap[addList.status]].label"
                       v-if="isDeliverGoods"
                       :visible.sync="isDeliverGoods" width="70%">
                <el-form ref="ruleForm" class="demo-ruleForm" :model="addList" :inline="true" :rules="rules">
                    <el-card shadow="never">
                        <div class="operate-container">
                            <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
                            <span class="color-danger">&nbsp;&nbsp;当前订单状态：</span>{{titleMap[titleIndexMap[addList.status]].label}}
                        </div>
                    </el-card>
                    <h2>收货信息</h2>
                    <el-table :data="detailData" border style="width: 100%">
                        <el-table-column prop="receiverName" align="center" label="收货人"></el-table-column>
                        <el-table-column prop="receiverPhone" align="center" label="手机号码"></el-table-column>
                        <el-table-column prop="receiverDetailAddress" align="center" label="收货地址"></el-table-column>
                    </el-table>
                    <h2>物流信息</h2>
                    <div style="height: 15px"></div>
                    <el-form-item label="快递公司" prop="deliveryCompany">
                        <el-select placeholder="请选择" clearable filterable v-model="addList.deliveryCompany">
                            <el-option v-for="item in logistics" :key="item.id" :label="item.name"
                                       :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="deliverySn">
                        <el-input style="width: 300px" pleceholder="请输入快递单号" v-model="addList.deliverySn"></el-input>
                    </el-form-item>
                    <span style="margin-left: 30px;"></span>
                    <el-form-item label="备注" prop="note">
                        <el-input style="width: 400px" pleceholder="请输入备注" v-model="addList.note"></el-input>
                    </el-form-item>
                    <el-form :model="detailGoods" ref="ruleForm2">
                        <div v-for="(data,index) in detailGoods">
                            <div style="margin-bottom: 40px;margin-top: 40px;">
                                <span>子订单{{index+1}}：{{data.orderSn}}</span><span style="margin-left: 120px;">订单类型：{{orderTypeMap[data.orderType]}}</span>
                            </div>
                            <el-table :data="data.omsOrderItemList" border style="width: 100%">
                                <el-table-column align="center" label="商品信息" v-slot="{row}" width="320px">
                                    <img :src="row.productPic" alt=""
                                         style="display: inline-block;width: 80px;vertical-align: top;margin-right: 15px;">
                                    <div style="display: inline-block;vertical-align: text-top;text-align: left">
                                        <colors-component-my :brandName="row.productBrand"></colors-component-my>
                                        <span>{{row.productName}}</span>
                                        <div></div>
                                        <span>订货号: </span><span>{{row.sp1}}</span>
                                        <div></div>
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
                                <el-table-column align="center" label="小计">
                                    <template slot-scope="scope">
                                        <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="本次发货数量" prop="shippedQty" width="200"
                                                 v-slot="{row,$index}">
                                    <el-form-item :prop="`[${index}].omsOrderItemList[${$index}].shippedQty`" :rules="[{required: true, message: '发货数量不能为空', trigger: 'blur'},
                        {type: 'number',min:0,max:row.productQuantity-row.deliverQuantity, message: '数量不能大于未发数量', trigger: 'blur'}]">
                                        <el-input
                                                v-model.number="detailGoods[index].omsOrderItemList[$index].shippedQty"
                                                type="number"
                                                placeholder="请输入发货数量" min="0"></el-input>
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

            <!--            生成EDI订单对话框-->
            <el-dialog title="生成EDI订单" :visible.sync="showAddEDI" width="70%" v-if="showAddEDI" modal-append-to-body
                       append-to-body>
                <el-form :model="addList" :rules="rules" ref="addList" :inline="true" size="medium" label-width="140px"
                         label-position="right">
                    <el-form-item label="收货人姓名：" prop="receiverName">
                        <el-input v-model="addList.receiverName" plaecholder="请输入收货人姓名" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人电话：" prop="receiverPhone">
                        <el-input v-model="addList.receiverPhone" plaecholder="请输入收货人电话"
                                  style="width: 250px"></el-input>
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
                        <el-input type="text" :readonly="true" style="width: 250px" value="线下支付"
                                  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="是否代发：">
                        <el-switch v-model="addList.isReplaceDelivery" :active-value="1"
                                   :inactive-value="0"></el-switch>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="代发货公司：" :required="true" v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceDeliveryCompany" style="width: 250px"
                                  placeholder="请输入代发货公司"></el-input>
                    </el-form-item>
                    <el-form-item label="代发货联系人：" :required="true" v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceLinkMan" style="width: 250px"
                                  placeholder="请输入代发货联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="代发货联系电话：" :required="true" v-if="addList.isReplaceDelivery">
                        <el-input v-model="addList.replaceLinkPhone" style="width: 250px"
                                  placeholder="请输入代发货联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="deliverDetailAddress">
                        <el-input v-model="addList.deliverDetailAddress" style="width: 54.7vw"
                                  placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="addList.note" style="width: 54.7vw" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <el-table :data="EDIData" border style="width: 100%" show-summary :summary-method="getSummaries">
                    <el-table-column align="left" label="商品信息" v-slot="{row}" width="320px">
                        <span style="margin-left: 20px;"></span>
                        <el-image :src="row.productPic" alt=""
                                  style="display: inline-block;width: 80px;height: 80px;vertical-align: top;margin-right: 15px;"></el-image>
                        <div style="display: inline-block;vertical-align: text-top;text-align: left">
                            <colors-component-my :brandName="row.productBrand"></colors-component-my>
                            <span>{{row.productName}}</span>
                            <div></div>
                            <span>订货号: </span><span>{{row.sp1}}</span>
                            <div></div>
                            <span>型号: </span><span>{{row.sp2}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="retailPrice" align="center" label="面价"></el-table-column>
                    <el-table-column prop="productPrice" align="right" label="调拨价"
                                     class-name="red-title"></el-table-column>
                    <el-table-column align="center" label="调拨折扣" v-slot="{row}">
                        <span>{{division(row.productPrice,row.retailPrice).toFixed(4)}}</span>
                    </el-table-column>
                    <el-table-column prop="productQuantity" align="center" label="购买数量"></el-table-column>
                    <!--                    <el-table-column align="center" label="未发数量" prop="undeliveredQty">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <span>{{scope.row.productQuantity - scope.row.deliverQuantity
                    }}</span>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column align="right" label="小计" class-name="red-title">
                        <template slot-scope="scope">
                            <span>{{accMulti(scope.row.productPrice,scope.row.productQuantity).toFixed(4)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ediDeliverQuantity" align="center" label="已下单数量" v-slot="{row}">
                        <span>{{row.ediDeliverQuantity||0}}</span>
                    </el-table-column>
                    <el-table-column align="center" label="本次下单数量" prop="deliverQuantity" v-slot="{row,$index}"
                                     width="200px">
                        <el-input-number v-model="row.deliverQuantity" :min="0"
                                         :max="row.productQuantity-row.ediDeliverQuantity"></el-input-number>
                    </el-table-column>
                    <el-table-column align="center" label="操作" v-slot="{row,$index}">
                        <!--                        <el-button type="text"></el-button>-->
                        <el-link type="danger" :underline="false" @click="deleteEDIGoods($index)">删除</el-link>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAddEDI=false">取 消</el-button>
                    <el-button type="primary" @click="createEDI" :loading="isLoading">提 交</el-button>
                </div>
            </el-dialog>

            <el-dialog title="物流详情" append-to-body width="50%" v-if="isShowLogistics" :visible.sync="isShowLogistics"
                       custom-class="logistics-dialog">
                <div style="width: 95%;margin: 0 auto">
                    <div style="height: 150px;border: 1px solid #EBEEF5;padding-left: 50px;padding-top: 20px;">
                        <span>物流编号：{{logisticsData.deliverySn}}</span>
                        <div style="height: 10px"></div>
                        <span>物流快递：{{logisticsData.deliveryCompany}}</span>
                        <div style="height: 10px"></div>
                        <span>　收货人：{{logisticsData.receiverName}}</span>
                        <div style="height: 10px;"></div>
                        <span>收货电话：{{logisticsData.receiverPhone}}</span>
                        <div style="height: 10px"></div>
                        <!--                        <span>所在区域：{{logisticsData.receiverPhone}}</span><div></div>-->
                        <span>收货地址：{{logisticsData.receiverDetailAddress}}</span>
                        <div></div>
                    </div>
                    <div style="height: 200px;width: 100%;vertical-align: bottom;position: relative;overflow-y: scroll;margin-top: 20px;">
                        <div v-if="logisticsData.list.length>0">
                            <div v-for="(item,index) in logisticsData.list">
                                <div style="width: 200px;display: inline-block;text-align: right;line-height: 24px;height: 24px">
                                    <span>{{item.acceptTime}}</span>
                                </div>
                                <img src="http://gxcl-shop.qiniu.520mro.com/lqlb345ryyw4n9cqp1th.png" alt=""
                                     style="vertical-align: bottom;margin-left: 20px;"
                                     v-if="logisticsData.status*1==3&&index===0">
                                <img src="http://gxcl-shop.qiniu.520mro.com/pyjqfnbpsfwl68ezh6uq.png" alt=""
                                     style="vertical-align: bottom;margin-left: 20px;"
                                     v-else-if="index===logisticsData.list.length-1||(logisticsData.status*1==3&&index===2)||(logisticsData.status*1==2&&index===0)">
                                <img src="http://gxcl-shop.qiniu.520mro.com/h6nbmpqtkmyxzgwvi38e.png" alt=""
                                     style="vertical-align: bottom;margin-left: 20px;"
                                     v-else-if="logisticsData.status*1==3&&index===1">
                                <span v-else
                                      style="display: inline-block;background-color: rgb(189,189,189);height: 10px;width: 10px;border-radius: 50%;margin-left: 27px;margin-right: 7px;"></span>
                                <span style="margin-left: 15px;font-weight: bolder;color: black">{{item.acceptAddress}}</span>
                                <div style="margin-left: 232px;border-left: 1px dashed #E4E7ED;padding-left: 27px;padding-top: 10px;padding-bottom: 10px;">
                                    <span>{{item.remark}}</span>
                                </div>
                            </div>

                        </div>
                        <span style="position:absolute;top: 45%;left: 45%" v-else>暂无快递信息</span>
                    </div>

                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowLogistics=false">确 定</el-button>
                </div>
            </el-dialog>
        </basic-container>

        <!--        <tracking :isTracking="true" v-if="isTracking" @closeTracking="closeTracking" :itemData="addList" :logisticsData="logisticsData"/>-->
    </div>
</template>

<script>
    import {
        selectPage,
        updateOrderNote,
        closeOrder,
        deleteOrder,
        orderDetail,
        getLogistics,
        reviewOrder,
        doDeliver,
        selectPageByItem,
        orderMainDetail,
        searchLogistics
    } from '@/api/erp/saas/orderControl/orderList';
    // import {enableErp} from '@/api/erp/saas/allGoods';
    import {regionData, CodeToText, TextToCode} from 'element-china-area-data';
    import {selectItemByIds, generateOrderItem} from '@/api/erp/saas/orderControl/EDI';
    import {allLogistics} from '@/api/erp/saas/orderControl/logistics';
    import colorsComponentMy from '@/components/saas/colors';
    import {selectWebsiteSetting} from '@/api/erp/saas/websiteControl/websiteSetting';
    import logisticsDataCopy from '@/mock/saasLogistic.json'
    import FileSaver from "file-saver";
    import XLSX from "xlsx";

    export default {
        name: "orderList",
        data() {
            return {
                activeName: 'zero',//当前标签页
                status: null,//默认查询全部账单
                logisticsData: {},
                isTracking: false,

                dialogFormVisible: false,//是否显示商家备注对话框
                addList: {},//对话框数据存储对象
                showAddEDI: false,
                // openERP:0,
                isShowLogistics: false,
                EDIData: [],//EDI商品数据
                isLoading: false,//按钮是否显示加载中
                isShowDetail: false,//是否展示订单详情
                resetTable: true,//切换表格用参数
                detailTime: [],//步骤条时间展示
                // titleIndex: 0,//当前步骤条处于什么阶段
                titleIndexMap: {
                    0: 0,
                    1: 1,
                    8: 2,
                    2: 3,
                    3: 4,
                    4: 5
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
                orderStatusMap: {
                    0: "待付款",
                    1: "待发货",
                    2: "已发货",
                    3: "已完成",
                    4: "已关闭",
                    5: "无效订单",
                    6: "异常订单",
                    7: "部分支付",
                    8: "发货中",
                },
                orderTypeMap: {//订单类型字典
                    // 0: "现货订单",
                    0: "正常订单",
                    // 1:"秒杀订单",
                    1: "秒杀订单",
                    2: "期货订单",
                    3: '调拨订单'
                },
                distributionModeMap: {//配送方式字典
                    0: '快递运输',
                    1: '运费到付',
                    2: '货物自提'
                },
                payTypeMap: {//支付方式字典
                    0: '未支付',
                    1: '支付宝',
                    2: '微信',
                    3: '客户余额'
                },
                sourceTypeMap: {
                    0: 'PC端商城',
                    1: '微信小程序'
                },
                showColumn: [],
                regionData,//地址联级选择器数据源
                note: '',//商家备注
                detailData: {},//订单详情数据源
                detailGoods: [],//订单详情商品信息数据源
                isDeliverGoods: false,//是否展示发货对话框
                logistics: [],//物联快递存储数组
                rules: {//立即发货&继续发货表单验证
                    'distributionMode': [{required: true, message: '配送方式不能为空', trigger: 'blur'}],
                    'receiverName': [{required: true, message: '收货人不能为空', trigger: 'blur'}],
                    'receiverPhone': [{required: true, message: '收货人电话不能为空', trigger: 'blur'}],
                    'provinceAndCity': [{required: true, message: '省份城市不能为空', trigger: 'blur'}],
                    'deliverDetailAddress': [{required: true, message: '详细地址不能为空', trigger: 'blur'}],
                },
                deliverList: [],//发货清单存储数组
                isShow: true,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20, // 每页显示多少条
                    status: 1
                },
                option: {},
                freeGoods: [],//赠品列表数组
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
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
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    indexLabel: '序号',
                    menu: true,//是否显示行操作按钮
                    menuWidth: 200,
                    delBtn: false,//列删除隐藏
                    editBtn: false,//列编辑隐藏
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: [//主订单列配置
                        {
                            label: "订单编号",
                            prop: "orderSn",
                            minWidth: 180,
                            search: true,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "订单状态",
                            prop: "status",
                            minWidth: 180,
                            align: 'center',
                            dicData: [
                                {
                                    value: 0,
                                    label: "待付款"
                                },
                                {
                                    value: 1,
                                    label: "待发货"
                                },
                                {
                                    value: 2,
                                    label: "已发货"
                                },
                                {
                                    value: 3,
                                    label: "已完成"
                                },
                                {
                                    value: 4,
                                    label: "已关闭"
                                },
                                {
                                    value: 5,
                                    label: "无效订单"
                                },
                                {
                                    value: 6,
                                    label: "异常订单"
                                },
                                {
                                    value: 7,
                                    label: "部分支付"
                                },
                                {
                                    value: 8,
                                    label: "发货中"
                                },
                            ]
                        },
                        {
                            label: "客户名称",
                            prop: "memberUsername",
                            minWidth: 180,
                            align: 'center',
                            search: true
                        },
                        {
                            label: "订单来源",
                            prop: "sourceType",
                            minWidth: 180,
                            align: 'center',
                            search: true,
                            type: 'select',
                            dicData: [
                                {
                                    value: 0,
                                    label: "PC端商城"
                                },
                                {
                                    value: 1,
                                    label: "微信小程序"
                                },
                            ]
                        },
                        {
                            label: "订单类型",
                            prop: "orderType",
                            minWidth: 180,
                            align: 'center',
                            search: true,
                            type: 'select',
                            dicData: [
                                {
                                    value: 0,
                                    label: "正常订单"
                                },
                                {
                                    value: 1,
                                    label: "秒杀订单"
                                },
                                {
                                    value: 2,
                                    label: "期货订单"
                                },
                                {
                                    value: 3,
                                    label: "调拨订单"
                                },
                            ]
                        },
                        {
                            label: "是否代发货",
                            prop: "isReplaceDelivery",
                            minWidth: 180,
                            align: 'center',
                            dicData: [
                                {
                                    value: 0,
                                    label: "否"
                                },
                                {
                                    value: 1,
                                    label: "是"
                                },
                            ]
                        },
                        {
                            label: "订单金额",
                            prop: "totalAmount",
                            minWidth: 180,
                            align: 'right',
                            textColor: '#ff0000',
                            sortable: true,
                            renderHeader: (h, {column, $index}) => {
                                return h('div', {style: {display: 'inline'}}, [
                                        h('span', {
                                            style: {
                                                color: "#ff0000"
                                            }
                                        }, column.label)
                                    ]
                                )
                            },
                        },
                        {
                            label: "优惠金额",
                            prop: "discountAmount",
                            minWidth: 180,
                            align: 'right',
                            slot: true,
                            textColor: '#ff0000',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float: 'right'
                                        }
                                    },
                                    "优惠金额"
                                );
                            },
                        },
                        {
                            label: "实付金额",
                            prop: "payAmount",
                            minWidth: 180,
                            textColor: '#ff0000',
                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float: 'right'
                                        }
                                    },
                                    "实付金额"
                                );
                            },
                        },
                        {
                            label: "下单时间",
                            prop: "createTime",
                            minWidth: 180,
                            search: true,
                            sortable: true,
                            align: 'center',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            type: "daterange",
                            startPlaceholder: '开始日期',
                            endPlaceholder: '结束日期',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 180,
                            align: 'center',
                        },
                    ],
                },
                tableDetailOption: {
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
                    indexLabel: '序号',
                    menu: false,//是否显示行操作按钮
                    menuWidth: 200,
                    delBtn: false,//列删除隐藏
                    editBtn: false,//列编辑隐藏
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: [//子订单列配置
                        {
                            label: "主订单编号",
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
                            dicData: [
                                {
                                    value: 0,
                                    label: "待付款"
                                },
                                {
                                    value: 1,
                                    label: "待发货"
                                },
                                {
                                    value: 2,
                                    label: "已发货"
                                },
                                {
                                    value: 3,
                                    label: "已完成"
                                },
                                {
                                    value: 4,
                                    label: "已关闭"
                                },
                                {
                                    value: 5,
                                    label: "无效订单"
                                },
                                {
                                    value: 6,
                                    label: "异常订单"
                                },
                                {
                                    value: 7,
                                    label: "部分支付"
                                },
                                {
                                    value: 8,
                                    label: "发货中"
                                },
                            ]
                        },
                        {
                            label: "子订单编号",
                            prop: "orderSn",
                            minWidth: 180,
                            search: true,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "客户名称",
                            prop: "memberUsername",
                            minWidth: 180,
                            align: 'center',
                            search: true
                        },
                        {
                            label: "订单来源",
                            prop: "sourceType",
                            minWidth: 180,
                            align: 'center',
                            search: true,
                            type: 'select',
                            dicData: [
                                {
                                    value: 0,
                                    label: "PC端商城"
                                },
                                {
                                    value: 1,
                                    label: "微信小程序"
                                },
                            ]
                        },
                        {
                            label: "订单类型",
                            prop: "orderType",
                            minWidth: 180,
                            align: 'center',
                            search: true,
                            type: 'select',
                            dicData: [
                                {
                                    value: 0,
                                    label: "正常订单"
                                },
                                {
                                    value: 1,
                                    label: "秒杀订单"
                                },
                                {
                                    value: 2,
                                    label: "期货订单"
                                },
                                {
                                    value: 3,
                                    label: "调拨订单"
                                },
                            ]
                        },
                        {
                            label: "是否代发货",
                            prop: "isReplaceDelivery",
                            minWidth: 180,
                            align: 'center',
                            dicData: [
                                {
                                    value: 0,
                                    label: "否"
                                },
                                {
                                    value: 1,
                                    label: "是"
                                },
                            ]
                        },
                        {
                            label: "订单金额",
                            prop: "totalAmount",
                            minWidth: 180,
                            align: 'right',
                            textColor: '#ff0000',
                            sortable: true,
                            renderHeader: (h, {column, $index}) => {
                                return h('div', {style: {display: 'inline'}}, [
                                        h('span', {
                                            style: {
                                                color: "#ff0000"
                                            }
                                        }, column.label)
                                    ]
                                )
                            },
                        },
                        {
                            label: "优惠金额",
                            prop: "discountAmount",
                            minWidth: 180,
                            align: 'right',
                            slot: true,
                            textColor: '#ff0000',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float: 'right'
                                        }
                                    },
                                    "优惠金额"
                                );
                            },
                        },
                        {
                            label: "实付金额",
                            prop: "payAmount",
                            minWidth: 180,
                            textColor: '#ff0000',
                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000",
                                            float: 'right'
                                        }
                                    },
                                    "实付金额"
                                );
                            },
                        },
                        {
                            // label: "下单时间",
                            // prop: "createTime",
                            // minWidth: 160,
                            // search: true,
                            // sortable: true,
                            // align: 'left',
                            // searchslot: true,

                            label: "下单时间",
                            prop: "createTime",
                            minWidth: 180,
                            search: true,
                            sortable: true,
                            align: 'center',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            type: "daterange",
                            startPlaceholder: '开始日期',
                            endPlaceholder: '结束日期',
                        },
                        {
                            label: "订单详情",
                            children: [{
                                label: '品牌',
                                prop: 'phone',
                            }]
                        },


                    ],
                },
                isDetail: false,//是否为查询子订单
                isDetailOrder: false,//对话框是否子订单
                categoryList: [],
                brandList: [],
            }
        },
        components: {
            colorsComponentMy,
            'tracking': () => import('@/components/setting/tracking'),
        },
        watch: {
            activeName(val, oldData) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.listQuery = {};
                    switch (val) {
                        case 'first':
                            this.status = 0
                            // this.titleIndex = 0
                            break;
                        case 'second':
                            this.status = 1
                            // this.titleIndex = 1
                            break;
                        case 'third':
                            this.status = 8
                            // this.titleIndex = 2
                            break;
                        case 'fourth':
                            this.status = 2
                            // this.titleIndex = 3
                            break;
                        case 'fifth':
                            this.status = 3
                            // this.titleIndex = 4
                            break;
                        case 'sixth':
                            this.status = 4
                            // this.titleIndex = 5
                            break;
                        case 'zero':
                            delete this.status
                            break;
                    }
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            },
            '$route': function (to, from) {
                if (this.$route.query.tabType && this.$route.query.tabType !== '') {
                    this.activeName = this.$route.query.tabType
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
            },
            openERP() {
                return this.$store.getters.openERP * 1
            }
        },
        created() {
            // listCatAndBrand().then(response => {
            //     this.categoryList = response.data.data.categoryList;
            //     this.brandList = response.data.data.brandList;
            // });
            // enableErp().then(res=>{
            //     if(Number(res.data.code)===200||Number(res.data.code)===2000){
            //         this.openERP=res.data.data.enable
            //     }else{
            //         this.showError('请求ERP状态失败!'+res.data.msg||res.data.data,res.data.code)
            //     }
            // },error => this.showError('请求ERP状态失败!'+error))
            this.getList(this.page);
            this.option = this.tableMainOption
        },
        updated() {
            //this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummaries(param) {
                const {columns, data} = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计'
                        return
                    }
                    const values = data.map(item => Number(item[column.property]))
                    if (column.label === '采购入库金额' || column.label === '直发金额' || column.label === '采购退货金额' || column.label === '采购付款金额' || column.label === '采购退款金额' || column.label === '已收票金额') {
                        sums[index] = values.reduce((prev, curr) => {
                            return this.accAdd(prev, curr)
                        }, 0).toFixed(4)
                        // sums[index] += ' '
                    }
                    if (column.label === '购买数量') {
                        sums[index] = values.reduce((prev, curr) => {
                            return Number(prev) + Number(curr)
                        }, 0)
                        // sums[index] += ' '
                    }
                    if (column.label === '小计') {
                        console.log(param, 'param')
                        let sum = 0
                        for (let i = 0; i < this.EDIData.length; i++) {
                            sum += this.accMulti(this.EDIData[i].productPrice, this.EDIData[i].productQuantity)
                        }
                        sums[index] = sum.toFixed(2)
                        // sums[index] += ' ' accMulti(scope.row.productPrice,scope.row.productQuantity)
                    }
                })

                return sums
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {
                    page: page.currentPage,
                    limit: page.pageSize,
                    status: this.status
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                if (queryObj.billDate && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                let method = this.isDetail ? selectPageByItem : selectPage
                method(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i = 0; i < data.records.length; i++) {
                        data.records[i].totalAmount = data.records[i].totalAmount.toFixed(4)
                        data.records[i].payAmount = data.records[i].payAmount.toFixed(4)
                        data.records[i].myIndex = i + 1
                    }
                    this.list = data.records;
                    if (this.isDetail) {
                        this.list = this.arrayFormat(this.list)
                    }
                    this.loading = false;
                    this.resetTable = false
                    this.$nextTick(() => {
                        this.resetTable = true
                    })
                }, error => {
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
                let params = Object.assign({}, this.listQuery)
                //this.listQuery = params;
                try {
                    params.startDate = params.createTime[0] + ' 00:00:00'
                    params.endDate = params.createTime[1] + ' 23:59:59'
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
                this.listQuery.startValidateTime = val[0] + ' 00:00:00';
                this.listQuery.endValidateTime = val[1] + ' 23:59:59';
            },

            /**
             * 商家备注
             */
            orderNote(row) {
                this.dialogFormVisible = true
                if (row.id) {
                    this.addList = row
                    //this.note=this.addList.note||''
                }

            },

            /**
             * 商家备注提交事件
             */
            noteSubmit() {
                this.isLoading = true
                let params = new URLSearchParams();
                params.append("id", this.addList.id);
                params.append("note", this.addList.note);
                updateOrderNote(params).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        this.$message.success('修改商家备注成功!')
                        this.dialogFormVisible = false
                    } else {
                        this.showError('修改商家备注失败,' + res.data.msg || res.data.data, res.data.code)
                    }
                }, error => this.showError('修改商家备注失败,' + error))
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message, code) {
                if (Number(code) === 401) {
                    this.$message.warning(message)
                } else {
                    this.$message.error(message)
                }
                this.isLoading = false
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message) {
                this.$message.success(message)
                this.init()
            },

            init() {
                this.dialogFormVisible = false
                this.showAddEDI = false
                this.isShowDetail = false
                this.isLoading = false
                this.isDeliverGoods = false
                this.getList(this.page)
            },

            /**
             * 展示订单详情
             * @param row
             * @param id 需要查询的订单id
             */
            showOrderDetail(row, id) {
                this.isDetailOrder = Boolean(id)
                this.freeGoods = []
                this.isShowDetail = true
                this.addList = row
                let method = this.isDetail && !id ? orderDetail : orderMainDetail
                //console.log(Boolean(this.isDetail||id),'方法')
                method(id || row.id).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        if (this.isDetail && (!id)) {
                            console.log('走了这1')
                            this.detailData = res.data.data.mainDTO
                            this.deliverList = res.data.data.deliverList
                            for (let i = 0; i < res.data.data.orderItemList.length; i++) {
                                res.data.data.orderItemList[i].productPrice = res.data.data.orderItemList[i].productPrice.toFixed(4)
                            }
                            this.detailGoods = res.data.data.orderItemList
                            this.detailTime = [res.data.data.createTime, this.detailData.paymentTime, this.detailData.deliveryTime, this.detailData.receiveTime, this.detailData.commentTime, res.data.data.uptTime]
                        } else {
                            console.log('走了这2', '这是订单详情')
                            this.detailData = res.data.data
                            // for (let i = 0; i <res.data.data.itemDtoList.length ; i++) {
                            //     res.data.data.itemDtoList[i].productPrice=res.data.data.itemDtoList[i].productPrice.toFixed(4)
                            // }
                            //对订单号进行排序
                            this.detailGoods = res.data.data.orderSubList.sort(function (a, b) {
                                // return Number(a[0].orderSn.substring(a[0].orderSn.length-4))-Number(b[0].orderSn.substring(b[0].orderSn.length-4))
                                // console.log('比较',BigInt(a[0].orderSn),BigInt(b[0].orderSn),BigInt(a[0].orderSn)>BigInt(b[0].orderSn))
                                return BigInt(a.orderSn) > BigInt(b.orderSn) ? 1 : -1
                            })
                            // this.detailGoods=res.data.data.itemDtoList.result.sort((a,b)=>a[0].orderSn-b[0].orderSn);
                            this.detailTime = [res.data.data.createTime, this.detailData.paymentTime, this.detailData.deliveryTime, this.detailData.receiveTime, this.detailData.commentTime, res.data.data.uptTime]
                            if (res.data.data.umsMemberGiveawayList && res.data.data.umsMemberGiveawayList.goodsList) {
                                this.freeGoods = res.data.data.umsMemberGiveawayList.goodsList
                            }

                            //console.log(this.freeGoods,'赠品')
                        }

                    } else {
                        this.showError('获取订单详情失败,' + res.data.msg || res.data.data, res.data.code)
                    }
                }, error => this.showError('获取订单详情失败,' + error))
            },

            /**
             *关闭订单
             */
            doCloseOrder() {
                this.$confirm('此操作将永久关闭, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    closeOrder({orderId: this.addList.id}).then(res => {
                        if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                            this.showSuccess('关闭订单成功!')
                        } else {
                            this.showError('关闭订单失败,' + res.data.msg || res.data.data, res.data.code)
                        }
                    }, error => this.showError('关闭订单失败,' + error))
                })
            },

            /**
             * 删除订单
             */
            doDeleteOrder(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("id", row.id);
                    deleteOrder(params).then(res => {
                        if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                            this.showSuccess('删除订单成功!')
                        } else {
                            this.showError('删除订单失败,' + res.data.msg || res.data.data, res.data.code)
                        }
                    }, error => this.showError('删除订单失败,' + error))
                })

            },

            /**
             *立即审核
             */
            doAudit(row) {
                this.$confirm('立即审核, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // let params = new URLSearchParams();
                    // params.append("id", row.id);
                    reviewOrder(row.id).then(res => {
                        if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                            this.showSuccess('审核订单成功!')
                        } else {
                            this.showError('审核订单失败,' + res.data.msg || res.data.data, res.data.code)
                        }
                    }, error => this.showError('审核订单失败,' + error))
                })
            },

            /**
             *立即发货&继续发货按钮点击
             */
            doDeliverGoods(row) {
                this.isDeliverGoods = true
                this.addList = row
                this.detailData = [row]
                this.listQuery.status = 0
                this.listQuery.limit = 50
                allLogistics().then(res => {
                    this.logistics = res.data
                }, error => this.showError('获取物流快递失败,' + error))
                orderMainDetail(row.id).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        // this.addList.deliverItemList = res.data.data.orderSubList
                        this.addList = res.data.data
                        console.log(this.addList, 'getData')
                        this.detailGoods = res.data.data.orderSubList

                        for (let i = 0; i < this.detailGoods.length; i++) {
                            for (let j = 0; j < this.detailGoods[i].omsOrderItemList.length; j++) {
                                this.$set(this.detailGoods[i].omsOrderItemList[j], 'shippedQty', this.detailGoods[i].omsOrderItemList[j].productQuantity - this.detailGoods[i].omsOrderItemList[j].deliverQuantity)
                            }
                            // this.detailGoods[i][j].shippedQty=this.detailGoods[i][j].productQuantity-this.detailGoods[i][j].deliverQuantity

                        }
                    } else {
                        this.showError('获取订单详情失败,' + res.data.msg || res.data.data, res.data.code)
                    }
                }, error => this.showError('获取订单详情失败,' + error))
                //console.log(row)
            },

            /**
             * 立即发货&继续发货
             */
            async handleSubmit() {
                let params = Object.assign({}, this.addList)
                try {
                    this.addList.sourceBillNo = this.addList.id
                    let omsOrderItemList = []
                    for (let i = 0; i < this.addList.orderSubList.length; i++) {
                        for (let j = 0; j < this.addList.orderSubList[i].omsOrderItemList.length; j++) {

                            this.addList.orderSubList[i].omsOrderItemList[j].masterId = this.addList.id
                            this.addList.orderSubList[i].omsOrderItemList[j].masterOrderId = this.addList.id
                            this.addList.orderSubList[i].omsOrderItemList[j].masterOrderItemId = this.addList.orderSubList[i].omsOrderItemList[j].id
                            this.addList.orderSubList[i].omsOrderItemList[j].itemNo = this.addList.orderSubList[i].omsOrderItemList[j].sp1
                            this.addList.orderSubList[i].omsOrderItemList[j].specModel = this.addList.orderSubList[i].omsOrderItemList[j].sp2

                            omsOrderItemList.push(this.addList.orderSubList[i].omsOrderItemList[j])
                        }
                    }

                    params.deliverItemList = omsOrderItemList
                    delete params.orderSubList
                    // this.addList.deliverItemList = this.addList.deliverItemList.flat(Infinity)
                    console.log(this.addList, 'data')
                } catch (e) {
                    console.log(e, 'error')
                }
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.$refs['ruleForm2'].validate((valid) => {
                            if (valid) {
                                doDeliver(params).then(res => {
                                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                                        this.showSuccess('发货成功!')
                                    } else {
                                        this.showError('发货失败,' + res.data.msg || res.data.data, res.data.code)
                                    }
                                }, error => this.showError('发货失败,' + error))
                            } else {
                                this.$message.warning('请正确填写发货信息');
                            }
                        });
                    } else {
                        this.$message.warning('请正确填写发货信息');
                    }
                });
            },

            /**
             *详情内立即发货按钮
             */
            goDeliverGoods() {
                this.isShowDetail = false
                this.doDeliverGoods(this.addList)
            },

            /**
             * 表格导出
             */
            excelTable() {
                let map = {
                    0: "待付款",
                    1: "待发货",
                    2: "已发货",
                    3: "已完成",
                    4: "已关闭",
                    5: "无效订单",
                    6: "异常订单",
                    7: "部分支付",
                    8: "发货中"
                }
                import('@/vendor/Export2Excel').then(excel => {
                    var tHeader;
                    var filterVal;
                    var list = JSON.parse(JSON.stringify(this.selectedRows));
                    for (let i = 0; i < list.length; i++) {
                        list[i].status = map[list[i].status]
                    }
                    tHeader = ['主订单编号', '订单状态', '子订单编号', '客户名称', '订单来源', '订单类型', '是否代发货', '订单金额', '优惠金额', '实付金额', '订单状态', '下单时间'];
                    filterVal = ['masterOrderSn', 'status', 'orderSn', 'memberUsername', '$sourceType', '$orderType', '$isReplaceDelivery', 'totalAmount', 'discountAmount', 'payAmount', '$status', 'createTime'];
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
            rowClick(row) {
                this.$refs.crud.toggleSelection([row]);
            },

            changeOrder(flag) {
                // this.resetTable=false
                if (flag) {
                    //this.$set(this.tableOption,'column',this.detailColumn)
                    this.option = this.tableDetailOption
                    // this.option.column[0].showColumn=true
                } else {
                    //this.$set(this.tableOption,'column',this.mainColumn)
                    this.option = this.tableMainOption
                    // this.option.column[0].showColumn=false
                    // this.option.column.splice(0,1)
                }
                //console.log(this.tableOption.column,'换了表格')
                // console.log(this.option.column,'操作后')
                // console.log('删除了',this.showColumn)
                this.init()

            },

            goEDIList(row) {
                this.$router.push({name: 'EDI订单', params: {'billNo': row.orderSn}})
            },

            addEDI() {
                if (this.selectedRows.length < 1) {
                    this.$message.warning('请选择要生成的单据!')
                    return false
                }
                let ids = []
                for (let i = 0; i < this.selectedRows.length; i++) {
                    ids.push(this.selectedRows[i].id)
                }
                selectItemByIds(ids.toString()).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        this.EDIData = res.data.data
                    } else {
                        this.showError('获取订单明细失败!' + res.data.msg || res.data.data, res.data.code)
                    }
                }, error => this.showError('获取订单明细失败!' + error))
                orderMainDetail(ids[0]).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        this.addList = Object.assign(this.addList, res.data.data)
                        // this.addList.deliverDetailAddress=res.data.data.receiverDetailAddress
                        this.addList.isReplaceDelivery = 1
                        this.addList.provinceAndCity = [TextToCode[res.data.data.receiverProvince].code, TextToCode[res.data.data.receiverProvince][res.data.data.receiverCity].code, TextToCode[res.data.data.receiverProvince][res.data.data.receiverCity][res.data.data.receiverRegion].code]
                        //console.log(TextToCode[res.data.data.receiverProvince].code,'777')
                    } else {
                        this.$message.error('获取订单详情失败!' + res.data.msg || res.data.data)
                    }
                }, error => this.$message.error('获取订单详情失败!' + error))
                selectWebsiteSetting().then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        this.addList.replaceDeliveryCompany = res.data.data.companyName
                        this.addList.replaceLinkMan = res.data.data.companyContactPerson
                        this.addList.replaceLinkPhone = res.data.data.companyContactInformation
                        // this.addList.deliverDetailAddress=res.data.data.companyAddress
                        this.$set(this.addList, 'deliverDetailAddress', res.data.data.companyAddress)
                        //console.log(this.addList,'777')
                    } else {
                        this.showError('获取网站设置信息失败,' + res.data.msg || res.data.data, res.data.code)
                    }
                }, error => this.showError('获取网站设置信息失败,' + error))
                // this.addList={}
                this.showAddEDI = true
            },

            createEDI() {
                for (let i = 0; i < this.EDIData.length; i++) {
                    if ((!this.EDIData[i].deliverQuantity) || this.EDIData[i].deliverQuantity < 0) {
                        this.EDIData[i].deliverQuantity = 0
                        //this.$message.warning('请填写正确的发货数量!')
                        //return false
                    }
                }
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        //this.addList.list = this.EDIData
                        let params = {
                            list: this.EDIData,
                            omsOrderManualDTO: Object.assign({}, this.addList)
                        }
                        params.omsOrderManualDTO.province = CodeToText[this.addList.provinceAndCity[0]]
                        params.omsOrderManualDTO.city = CodeToText[this.addList.provinceAndCity[1]]
                        params.omsOrderManualDTO.region = CodeToText[this.addList.provinceAndCity[2]]
                        delete params.provinceAndCity
                        //console.log(params,'data')
                        //return false
                        this.isLoading = true
                        generateOrderItem(params).then(res => {
                            if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                                this.showSuccess('生成EDI订单成功!')
                            } else {
                                this.showError('生成EDI订单失败!' + res.data.msg || res.data.data, res.data.data)
                            }
                        }, error => this.showError('生成EDI订单失败!' + error))
                    } else {
                        this.$message.warning('请正确填写单据!')
                    }
                })

            },

            deleteEDIGoods(index) {
                this.EDIData.splice(index, 1)
            },

            excelDetail() {
                if (this.selectedRows.length < 1) {
                    this.$message.warning('请选择要导出的单据!')
                    return false
                }
                let ids = []
                for (let i = 0; i < this.selectedRows.length; i++) {
                    if (this.isDetail) {
                        ids.push(this.selectedRows[i].masterOrderId)
                    } else {
                        ids.push(this.selectedRows[i].id)
                    }

                }
                window.open('/api/saas/order/exportFile?ids=' + ids.toString(), '_blank')

            },

            excelContract() {
                if (this.selectedRows.length < 1) {
                    this.$message.warning('请选择要导出的单据!')
                    return false
                }
                if (this.selectedRows.length > 1) {
                    this.$message.warning('一次只能导出一条!')
                    return false
                }
                window.open('/api/saas/order/download?id=' + this.selectedRows[0].id, '_blank')
            },

            arrayFormat(arr) {
                let transformArr = arr.map(o => ({...o}))
                for (let i = 0; i < transformArr.length; i++) {
                    if (transformArr[i].orderItemList.length > 1) {
                        for (let j = 1; j < transformArr[i].orderItemList.length; j++) {
                            transformArr[i].rowspan = transformArr[i].orderItemList.length
                            let params = Object.assign({}, transformArr[i])
                            params.rowspan = 0
                            transformArr.splice(i + j, 0, params)
                            transformArr[i + j].orderItemList = [transformArr[i].orderItemList[j]]
                        }

                    } else {

                    }
                }
                return transformArr
            },

            tableRowClassName({row, rowIndex}) {
                // if (row.rowspan>=0){
                //     return 'info-row';
                // }
                // return '';
            },

            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                ///console.log(column,'row')
                // let arr=['品名','品牌','系列','规格参数','面价','折扣','单价','数量','金额']
                // if (this.isDetail&&columnIndex <14) {
                //     // if (rowIndex  === 1) {
                //     //     console.log('执行了一次')
                //     //     return {
                //     //         rowspan: 2,
                //     //         colspan: 1
                //     //     };
                //     // } else {
                //     //     return {
                //     //         rowspan: 0,
                //     //         colspan: 0
                //     //     };
                //     // }
                //     // if(this.list.length>0){
                //     //     try {
                //     //         let colspan=0
                //     //         for (let i = 0; i <this.list.length ; i++) {
                //     //             if(row.orderSn===this.list[i].orderSn){
                //     //                 colspan++
                //     //             }
                //     //             console.log(row.orderSn===this.list[i].orderSn,'colspan')
                //     //         }
                //     //         console.log(colspan,'colspan')
                //     //         if(colspan===1){
                //     //             return {
                //     //                 rowspan: 0,
                //     //                 colspan: 0
                //     //             };
                //     //         }
                //     //
                //     //         return{
                //     //             rowspan:1,
                //     //             colspan: colspan
                //     //         }
                //     //     }catch (e) {
                //     //         console.log('报错',e)
                //     //     }
                //     //
                //     // }
                //
                // }else{
                //     return {
                //         rowspan: 1,
                //         colspan: 1
                //     };
                // }
                if (this.isDetail && columnIndex < 14 || column.label === '操作') {
                    //console.log(row.rowspan,'111')
                    if (row.rowspan !== undefined) {
                        if (row.rowspan > 0) {
                            //console.log(row.rowspan,'222')
                            return {
                                rowspan: row.rowspan,
                                colspan: 1
                            };
                        } else {
                            //console.log(row.rowspan,'333')
                            return {
                                rowspan: 0,
                                colspan: 0
                            };
                        }

                    } else {
                        //console.log(row.rowspan,'444')
                        return {
                            rowspan: 1,
                            colspan: 1
                        };
                    }

                    // if (rowIndex  === 0) {
                    //     return {
                    //         rowspan: 2,
                    //         colspan: 1
                    //     };
                    // } else if(rowIndex  === 1){
                    //     return {
                    //         rowspan: 0,
                    //         colspan: 0
                    //     };
                    // }else{
                    //     return {
                    //         rowspan: 1,
                    //         colspan: 1
                    //     };
                    // }
                }
            },

            doShowLogistics(item) {
                //console.log(item,'item')
                let params = {
                    tenantId: item.tenantId,
                    // phone:item.receiverPhone,
                    phone: '18172850771',
                    // logisticsName:item.deliveryCompany,
                    logisticsName: '顺丰物流',
                    // logisticsNo:item.deliverySn
                    logisticsNo: 'SF1980573162430'
                }
                console.log(logisticsDataCopy, 'data', item)
                this.logisticsData = item
                this.logisticsData.list = logisticsDataCopy.routeResps[0].routes.reverse()
                if (this.logisticsData.list.length === 1) {
                    this.logisticsData.status = 1;
                } else {
                    this.logisticsData.status = 2;
                }
                for (let i = 0; i < this.logisticsData.list.length; i++) {
                    if (this.logisticsData.list[i].remark.indexOf('已签收') > -1 || this.logisticsData.list[0].remark.indexOf('已签收') > -1) {
                        this.logisticsData.status = 3;
                        break;
                    }
                }
                // for (let i in this.logisticsData) {
                //     this.logisticsData[0].status = 1;
                //     if (this.logisticsData[i].remark.indexOf('已签收') > -1 || this.logisticsData[0].remark.indexOf('已签收') > -1) {
                //         this.logisticsData[0].status = 3;
                //         this.logisticsData[1].status = 2;
                //         this.logisticsData[1].status = 1;
                //     }
                //     if (this.logisticsData[i].remark.indexOf('派件') > -1 || this.logisticsData[0].remark.indexOf('派送') > -1) {
                //         this.logisticsData[0].status = 2;
                //         this.logisticsData[1].status = 1;
                //     }
                //     if (!this.logisticsData[0].remark.indexOf('派件') > -1 || !this.logisticsData[0].remark.indexOf('派送') > -1) {
                //         this.logisticsData[0].status = 1;
                //     }
                // }
                this.isShowLogistics = true
                // searchLogistics(params).then(res=>{
                //     if(Number(res.data.code)===2000||Number(res.data.code)===200){
                //         console.log(JSON.parse(res.data.data))
                //         this.logisticsData=JSON.parse(res.data.data).routeResps
                //         this.isTracking=true
                //     }else{
                //         this.$message.error('获取物流信息失败!'+res.data.msg||res.data.data)
                //     }
                // },error => this.$message.error('获取物流信息失败!'+error))


                //this.addList = item
            },

            // closeTracking(){
            //     this.isTracking = false;
            // },
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

    .avue-crud {
        margin: 0px !important;
    }

    .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
        background-color: #fff !important;
    }

    .el-table__fixed-footer-wrapper tbody td {
        background-color: #fff !important;
    }

    .orderDetail {
        display: inline-block;
        width: 22%;
        border-right: 1px dashed #eee;
        margin-left: 2%;
    }

    .orderDetail h4 {
        font-weight: normal;
        color: #aaa;
    }
</style>
<style>
    .order-detail .el-carousel__container {
        height: 306px !important;
        /*margin-top: 3vh!important;*/
    }

    .red-title {
        color: red !important;
    }

    /*.info-row{*/
    /*    background-color: white!important;*/
    /*}*/
    /*.el-table tbody tr:hover>td {*/
    /*    background-color:white!important*/
    /*}*/
    .logistics-dialog {
        z-index: 4000;
    }
</style>
