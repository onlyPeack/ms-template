<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <div style="padding: 0 15px 15px 15px" class="webSetting-main">
            <el-card class="box-card">
                <div style="text-align: center;display: inline-block;vertical-align: top" class="webSetting-left">
                    <div :class="activeIndex===1?'choose':''" @click="activeIndex=1">网站基础设置</div>
                    <div :class="activeIndex===2?'choose':''" @click="activeIndex=2">协议设置</div>
                    <div :class="activeIndex===8?'choose':''" @click="activeIndex=8">合同协议</div>
                    <div :class="activeIndex===3?'choose':''" @click="activeIndex=3">支付设置</div>
                    <div :class="activeIndex===4?'choose':''" @click="activeIndex=4">运费设置</div>
                    <div :class="activeIndex===6?'choose':''" @click="activeIndex=6">短信设置</div>
                    <div :class="activeIndex===9?'choose':''" @click="activeIndex=9">系统初始化</div>
                    <div :class="activeIndex===5?'choose':''" @click="activeIndex=5">企业信息设置</div>
                    <div :class="activeIndex===7?'choose':''" @click="activeIndex=7">云仓设置</div>
                </div>
                <div style="width: 84%;display: inline-block;padding-top: 10px;">
                    <el-form :model="addList" label-position="right" label-width="200px" size="medium" :rules="rules" ref="addList" :inline="false">
                        <div v-if="activeIndex===1" class="default-setting">
                            <div style="height: 10px"></div>
                            <el-form-item label="站点域名：" prop="webUrl" >
                                <el-input v-model="addList.webUrl" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入站点域名">
                                    <template slot="prepend">Http://</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="站点标题：" prop="webTitle" >
                                <el-input v-model="addList.webTitle" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入站点标题"></el-input>
                            </el-form-item>
                            <el-form-item label="关键字：" prop="keyword" >
                                <el-input v-model="addList.keyword" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入关键字"></el-input>
                            </el-form-item>
                            <el-form-item prop="showOf"  label="产品是否默认展示大图：">
                                <el-switch v-model="addList.showOf" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                            <el-form-item label="客服电话：" prop="phone" >
                                <el-input v-model="addList.phone" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入客服电话"></el-input>
                            </el-form-item>
                            <el-form-item label="工作时间：" :required="true">
                                <el-input v-model="addList.workTime" style="width: 500px;" placeholder="请填写正确时间，如周一至周五 8:30-17:30"></el-input>
                            </el-form-item>
<!--                            <el-form-item label="底部版权信息：" prop="info" >-->
<!--                                <el-input v-model="addList.info" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入底部版权信息"></el-input>-->
<!--                            </el-form-item>-->
                            <el-form-item label="客服QQ：" prop="qq">
                                <el-input v-model="addList.qq" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入客服QQ"></el-input>
                            </el-form-item>
                            <el-form-item label="标题LOGO图标：" prop="logo">
                                <el-upload
                                        class="avatar-uploader"
                                        action="api/saas/storage/create"
                                        :show-file-list="false"
                                        accept=".jpg,.jpeg,.png,.svg"
                                        :on-success="titleHandleAvatarSuccess">
                                    <img v-if="addList.tittleLog" :src="addList.tittleLog" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/svg文件，最多只能上传一张，且不超过10MB，建议尺寸大小为40 * 40px　</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="PC端LOGO图标：" prop="logo">
                                <el-upload
                                        class="avatar-uploader"
                                        action="api/saas/storage/create"
                                        :show-file-list="false"
                                        accept=".jpg,.jpeg,.png,.svg"
                                        :on-success="handleAvatarSuccess">
                                    <img v-if="addList.logo" :src="addList.logo" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/svg文件，最多只能上传一张，且不超过10MB，建议尺寸大小为194 * 47px　</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="底部二维码：">
                                <el-upload
                                        class="avatar-uploader"
                                        action="api/saas/storage/create"
                                        :show-file-list="false"
                                        accept=".jpg,.jpeg,.png,.svg"
                                        :on-success="codeHandleAvatarSuccess">
                                    <img v-if="addList.qrCode" :src="addList.qrCode" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/svg文件，最多只能上传一张，且不超过10MB，建议尺寸大小为111 * 111px</div>
                                </el-upload>
                            </el-form-item>
                        </div>
                        <div v-show="activeIndex===2">
                            <div style="height: 10px"></div>
                            <el-form-item label="协议标题：" >
                                <el-input v-model="addList.protocolTitle" placeholder="请输入协议标题">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="协议内容：">
                                <avue-ueditor v-model="addList.protocol"></avue-ueditor>
                            </el-form-item>
                        </div>
                        <div v-if="activeIndex===3">
                            <el-tabs v-model="activeName" style="margin-left: 15px;">
                                <el-tab-pane label="微信设置" name="first">
                                    <el-form-item label="商户Id：" prop="mchId">
                                        <el-input v-model="addList.mchId" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入商户Id"></el-input>
                                    </el-form-item>
                                    <el-form-item label="微信AppId：" prop="wxAppId" >
                                        <el-input v-model="addList.wxAppId" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入微信AppId"></el-input>
                                    </el-form-item>
                                    <el-form-item label="微信小程序AppId：" prop="wxAppId" v-if="activeName==='first'">
                                        <el-input v-model="addList.wxProAppId" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入微信小程序AppId"></el-input>
                                    </el-form-item>
                                    <el-form-item label="微信秘钥：" prop="wxKey" >
                                        <el-input v-model="addList.wxKey" style="width: 500px;" placeholder="请输入微信秘钥" type="textarea"></el-input>
                                    </el-form-item>
<!--                                    <el-form-item label="微信异步通知地址：" prop="wxNotifyUrl" >-->
<!--                                        <el-input v-model="addList.wxNotifyUrl" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入微信异步通知地址"></el-input>-->
<!--                                    </el-form-item>-->
                                </el-tab-pane>
                                <el-tab-pane label="支付宝设置" name="second">
                                    <el-form-item label="支付宝AppId：" prop="aliAppId" >
                                        <el-input v-model="addList.aliAppId" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入支付宝AppId"></el-input>
                                    </el-form-item>
                                    <el-form-item label="支付宝私钥：" prop="aliPrivateKey" >
                                        <el-input v-model="addList.aliPrivateKey" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入支付宝私钥"></el-input>
                                    </el-form-item>
                                    <el-form-item label="支付宝支付公钥：" prop="aliPayPublicKey" >
                                        <el-input v-model="addList.aliPayPublicKey" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入支付宝支付公钥"></el-input>
                                    </el-form-item>
<!--                                    <el-form-item label="支付宝回调地址：" prop="aliReturnUrl">-->
<!--                                        <el-input v-model="addList.aliReturnUrl" style="width: 500px;" placeholder="请输入支付宝回调地址"></el-input>-->
<!--                                    </el-form-item>-->
<!--                                    <el-form-item label="支付宝异步通知地址：" prop="aliNotifyUrl" >-->
<!--                                        <el-input v-model="addList.aliNotifyUrl" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入支付宝异步通知地址"></el-input>-->
<!--                                    </el-form-item>-->
                                </el-tab-pane>
                                <el-tab-pane label="聚合支付设置" name="fourth">
                                    <el-form-item label="网关公钥：" prop="apigwPublicKey" >
                                        <el-input v-model="addList.apigwPublicKey" autocomplete="off" style="width: 500px" placeholder="请输入网关公钥" type="textarea"></el-input>
                                    </el-form-item>
                                    <el-form-item label="Appid：" prop="jhAppid" >
                                        <el-input v-model="addList.jhAppid" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入Appid"></el-input>
                                    </el-form-item>
                                    <el-form-item label="私钥：" prop="myPrivateKey" >
                                        <el-input v-model="addList.myPrivateKey" type="textarea" autocomplete="off" style="width: 500px" placeholder="请输入私钥"></el-input>
                                    </el-form-item>
                                    <el-form-item label="客户线下档案编号：" prop="merId">
                                        <el-input v-model="addList.merId" style="width: 500px;" placeholder="请输入客户线下档案编号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="e生活档案编号：" prop="storeCode" >
                                        <el-input v-model="addList.storeCode" autocomplete="off" style="width: 500px;height: 50px;" placeholder="请输入e生活档案编号"></el-input>
                                    </el-form-item>
                                </el-tab-pane>
                                <el-tab-pane label="对公账户" name="third">
                                    <el-form-item label="收款户名：" prop="receivingAccountName" >
                                        <el-input v-model="addList.receivingAccountName" autocomplete="off" style="width: 500px;height: 30px;" placeholder="请输入收款户名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="收款账号：" prop="receivingAccount" >
                                        <el-input v-model="addList.receivingAccount" autocomplete="off" style="width: 500px" placeholder="请输入收款账号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="收款银行：" prop="receivingBank" >
                                        <el-input v-model="addList.receivingBank" autocomplete="off" style="width: 500px" placeholder="请输入收款银行"></el-input>
                                    </el-form-item>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div v-if="activeIndex===4">
                            <h2 style="margin-bottom: 30px;margin-left: 15px;margin-top: 0;">运费管理<span style="font-weight: normal;font-size: 14px;margin-left: 15px;">运费计算方式设置</span></h2>
                            <el-form-item label="订单运费计算方式：" prop="type">
                                <el-radio-group v-model="transportList.type">
                                    <el-radio :label="0">固定金额</el-radio>
                                    <el-radio :label="1">订单金额</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="固定运费：" v-if="transportList.type===0">
                                <span>所有订单统一一个运费</span>
                            </el-form-item>
                            <el-form-item label="运费设置：" prop="monty" v-if="transportList.type===0">
                                <el-input placeholder="请输入运费" v-model="transportList.monty" style="width: 300px">
                                    <template slot="append">元/单</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="订单金额：" v-if="transportList.type===1">
                                <span>根据订单的收货地址以及订单金额匹配相应的收费模板</span>
                            </el-form-item>
                            <el-form-item v-if="transportList.type===1">
                                <el-table :data="transportList.umsTransportItemList" border cell-class-name="transport">
                                    <el-table-column label="操作" width="100" align="center" >
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">操作</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <i class="el-icon-plus" style="cursor: pointer;color:rgb(42,140,254);float: left;margin-top: 6px" @click="addAssData"></i><i class="el-icon-minus" style="float: right;margin-top: 6px;cursor: pointer;color:rgb(42,140,254)" @click="deleteAssData(scope.$index)"  v-if="scope.row.areas!=='全国默认地区'"></i>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="配送区域" prop="areas" align="center">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">配送区域</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-link type="success" :underline="false" v-if="!scope.row.areas||scope.row.areas===''" @click="showAreaSelector=true">为指定地区设置运费</el-link>
                                            <span v-else-if="scope.row.areas==='全国默认地区'">{{scope.row.areas.toString()}}</span>
                                            <el-link type="success" :underline="false" @click="showAreaSelector=true" v-else>{{scope.row.areas.toString()}}</el-link>
                                            <el-dialog :visible.sync="showAreaSelector" width="70%" title="选择地区" append-to-body class="public-dialog">
                                                <div style="height: 400px">
                                                    <el-transfer
                                                            filterable
                                                            :filter-method="filterMethod"
                                                            filter-placeholder="请输入城市拼音"
                                                            v-model="scope.row.areas"
                                                            :titles="['未选择', '已选择']"
                                                            style="height: 100%"
                                                            :data="data">
                                                    </el-transfer>
                                                </div>
                                                <div slot="footer" class="dialog-footer">
                                                    <el-button @click="showAreaSelector=false">关 闭</el-button>
                                                </div>
                                            </el-dialog>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="小于N元" align="center">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">小于N元</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.lessThan"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="费用(￥)" align="center" class-name="transportMoney">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">费用(￥)</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.lessMoney" style="color:red;"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="大于N元小于M元费用(￥)" align="center" class-name="transportMoney">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">大于N元小于M元费用(￥)</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.midMoney" style="color:red!important;"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="大于M元" align="center">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">大于M元</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.moreThen"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="费用(￥)" align="center" class-name="transportMoney">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color: #333">费用(￥)</span>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.moreMoney" style="color:red;"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </div>
                        <div v-if="activeIndex===5">
                            <div style="height: 10px"></div>
                            <el-form-item label="企业名称：" prop="companyName">
                                <el-input style="width: 300px;" placeholder="请输入企业名称" v-model="addList.companyName"></el-input>
                            </el-form-item>
                            <el-form-item label="企业税号：" prop="companyTaxNumber">
                                <el-input style="width: 300px;" placeholder="请输入企业税号" v-model="addList.companyTaxNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="企业地址：" prop="companyAddress">
                                <el-input style="width: 300px;" placeholder="请输入企业地址" v-model="addList.companyAddress"></el-input>
                            </el-form-item>
                            <el-form-item label="企业联系人：" prop="companyContactPerson">
                                <el-input style="width: 300px;" placeholder="请输入企业联系人" v-model="addList.companyContactPerson"></el-input>
                            </el-form-item>
                            <el-form-item label="企业联系方式：" prop="companyContactInformation">
                                <el-input style="width: 300px;" placeholder="请输入企业联系方式" v-model="addList.companyContactInformation"></el-input>
                            </el-form-item>
                            <el-form-item label="启用ERP：">
                                <el-switch :active-value="1" :inactive-value="0" v-model="openERP" @change="doOpenERP"></el-switch>
                            </el-form-item>
                        </div>
                        <div v-if="activeIndex===7">
                            <el-form-item label="是否开启云仓：" prop="enableCloudStorage">
                                <el-switch v-model="addList.enableCloudStorage" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                            <el-form-item label="客户号：" prop="customer ">
                                <el-input v-model="addList.customer" placeholder="请输入客户号" style="width: 300px"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="activeIndex===6" style="width:92%;margin: 0 auto">
                            <el-tabs v-model="noteActiveName">
                                <el-tab-pane label="用户管理" name="first">
                                    <span style="margin-left: 20px;" slot="label">短信设置提醒
                                        <el-tooltip class="item" effect="dark" content="选中后，涉及到该业务会给客户发送通知" placement="top-start">
                                            <span class="el-icon-question" style="cursor: pointer;color: red"></span>
                                        </el-tooltip>
                                    </span>
                                    <div style="border: 1px solid #E4E7ED;border-radius: 5px;padding: 30px">
                                        <span style="font-weight: bolder">系统消息</span>
                                        <div style="height: 15px"></div>
                                        <el-checkbox v-model="noteList.registerVerificationCode" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您的注册验证码为：${code},2分钟内有效，请勿泄露。'" placement="top-start" v-if="noteList.registerVerificationCode===1">
                                                <span>注册验证码</span>
                                            </el-tooltip>
                                            <span v-else>注册验证码</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="noteList.forgetPassword" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您当前在操作密码修改的验证码：${code},2分钟内有效，请勿泄露。'" placement="top-start" v-if="noteList.forgetPassword===1">
                                                <span>忘记密码</span>
                                            </el-tooltip>
                                            <span v-else>忘记密码</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="noteList.payPasswordModify" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您当前在操作支付密码修改的验证码为：${code}，2分钟内有效，请勿泄露。'" placement="top-start" v-if="noteList.payPasswordModify===1">
                                                <span>支付密码修改</span>
                                            </el-tooltip>
                                            <span v-else>支付密码修改</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="noteList.changePhone" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您当前在操作手机号修改的验证码为：${code}，2分钟内有效，请勿泄露。'" placement="top-start" v-if="noteList.changePhone===1">
                                                <span>换绑手机号</span>
                                            </el-tooltip>
                                            <span v-else>换绑手机号</span>
                                        </el-checkbox>
                                        <div style="height: 20px"></div>
                                        <el-checkbox v-model="noteList.orderTermination" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您在商城的订单${order}已取消，取消金额${money}将返回到您的余额。'" placement="top-start" v-if="noteList.orderTermination===1">
                                                <span>订单终止　</span>
                                            </el-tooltip>
                                            <span v-else>订单终止　</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="noteList.paySuccess" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您当前在商城用${way}支付了一笔金额为${money}的订单。'" placement="top-start" v-if="noteList.paySuccess===1">
                                                <span>支付成功</span>
                                            </el-tooltip>
                                            <span v-else>支付成功</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="noteList.balanceRecharge" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您当前在商城已成功充值${money}元。'" placement="top-start" v-if="noteList.balanceRecharge===1">
                                                <span>余额充值</span>
                                            </el-tooltip>
                                            <span v-else>余额充值</span>
                                        </el-checkbox>
                                        <!--                                <el-checkbox v-model="noteList.refund" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">退款</el-checkbox>-->
                                    </div>
                                    <div style="height: 20px"></div>
                                    <div style="border: 1px solid #E4E7ED;border-radius: 5px;padding: 30px">
                                        <span style="font-weight: bolder">交易物流</span>
                                        <div style="height: 15px"></div>
                                        <!--                                <el-checkbox v-model="noteList.deliveryPartial" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">部分发货　</el-checkbox>-->
                                        <el-checkbox v-model="noteList.deliveryAll" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">
                                            <el-tooltip class="item" effect="dark" :content="'【'+addList.companyName+'】您在商城的订单${order}已由${company}发出，运送单号${sn}，请注意查收！'" placement="top-start" v-if="noteList.deliveryAll===1">
                                                <span>全部发货</span>
                                            </el-tooltip>
                                            <span v-else>全部发货</span>
                                        </el-checkbox>
                                        <el-tooltip class="item" effect="dark" content="订单所有商品全部发货完成后，会发送短信通知" placement="top-start">
                                            <span class="el-icon-question" style="cursor: pointer;color: red"></span>
                                        </el-tooltip>
                                        <!--                                <el-checkbox v-model="noteList.deliveryAllOnce" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">一次性全部发货</el-checkbox>-->
                                    </div>
                                    <!--                            <div style="height: 20px"></div>-->
                                    <!--                            <div style="border: 1px solid #E4E7ED;margin-left: 90px;border-radius: 5px;padding: 30px">-->
                                    <!--                                <span style="font-weight: bolder">其他</span>-->
                                    <!--                                <div style="height: 15px"></div>-->
                                    <!--                                <el-checkbox v-model="noteList.couponGift" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">优惠券赠送</el-checkbox>-->
                                    <!--                                <el-checkbox v-model="noteList.couponReturn" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">优惠券退回</el-checkbox>-->
                                    <!--                                <el-checkbox v-model="noteList.promotions" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">促销活动</el-checkbox>-->
                                    <!--                                <el-checkbox v-model="noteList.spike" size="medium" style="margin-left: 30px;" :true-label="1" :false-label="0">秒杀</el-checkbox>-->
                                    <!--                            </div>-->
                                </el-tab-pane>
                                <el-tab-pane label="发送设置" name="second" v-if="false">
                                    <!-- 查询和其他操作 -->
                                    <div>
                                        <el-form :inline="true" :model="noteListQuery" label-width="100px" label-position="left">
                                            <el-form-item label="业务名称：">
                                                <el-select v-model="noteListQuery.businessCode" placeholder="请选择业务" filterable >
                                                    <el-option label="注册验证码" value="SMS_22188"></el-option>
                                                    <el-option label="忘记密码" value="SMS_32014"></el-option>
                                                    <el-option label="支付密码修改" value="SMS_29455"></el-option>
                                                    <el-option label="换绑手机号" value="SMS_47446"></el-option>
                                                    <el-option label="订单终止" value="SMS_0015"></el-option>
                                                    <el-option label="支付成功" value="SMS_68594"></el-option>
                                                    <el-option label="余额充值" value="SMS_33337"></el-option>
                                                    <el-option label="全部发货" value="SMS_76570"></el-option>
                                                </el-select>
                                            </el-form-item>
<!--                                            <el-form-item label="创建时间：">-->
<!--                                                <el-date-picker-->
<!--                                                        v-model="noteListQuery.daterange"-->
<!--                                                        type="daterange"-->
<!--                                                        value-format="yyyy-MM-dd"-->
<!--                                                        range-separator="至"-->
<!--                                                        start-placeholder="开始日期"-->
<!--                                                        end-placeholder="结束日期">-->
<!--                                                </el-date-picker>-->
<!--                                            </el-form-item>-->
                                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                                            <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
                                        </el-form>
                                    </div>
                                    <div class="filter-container" style="background: #ffffff;margin-bottom: 15px;">
                                        <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">新增</el-button>
                                    </div>
                                    <div style="width: 100%;background: #ffffff;">
                                        <!-- 查询结果 -->
                                        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                                                  highlight-current-row style="height: 100%;position:relative;">
                                            <el-table-column  type="index" align="center">
                                            </el-table-column>
                                            <el-table-column align="center" prop="businessName" label="业务名称" >
                                            </el-table-column>
                                            <el-table-column align="center" prop="templateContent" label="短信模板" width="500">
                                            </el-table-column>
                                            <el-table-column align="center" prop="crtTime" label="创建时间" >
                                            </el-table-column>
                                            <el-table-column align="center" prop="note" label="备注" >
                                            </el-table-column>
                                            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                                                <template slot-scope="scope">
                                                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                                                    <el-button type="danger" size="mini" @click="handleRowDelete(scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>

                                    <!-- 分页 -->
                                    <div class="pagination-container" style="padding:2px 10px;background: #ffffff;">
                                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                                       :current-page="noteListQuery.page"
                                                       :page-sizes="[10,20,30,50]" :page-size="noteListQuery.limit"
                                                       layout="total, sizes, prev, pager, next, jumper" :total="total">
                                        </el-pagination>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>

                            <div style="height: 45px"></div>
                        </div>
                        <div v-if="activeIndex===8">
                            <el-form-item label="协议内容：" prop="contractProtocol">
                                <avue-ueditor v-model="addList.contractProtocol"></avue-ueditor>
                            </el-form-item>
                        </div>
                        <div v-if="activeIndex===9">
                            <setting></setting>
                        </div>
                        <el-form-item>
                            <el-button type="primary" @click="doUpdate" size="medium" v-if="noteActiveName!=='second'&&activeIndex!==9">保存设置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>

        <!-- 添加或修改对话框 -->
        <el-dialog modal-append-to-body
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="noteAddList" :model="noteAddList" status-icon label-position="right" label-width="180px" size="medium">
                <el-form-item label="选择业务：" prop="businessCode">
                    <el-select v-model="noteAddList.businessCode" style="width: 400px" placeholder="请选择业务" filterable >
                        <el-option label="注册验证码" value="SMS_22188"></el-option>
                        <el-option label="忘记密码" value="SMS_32014"></el-option>
                        <el-option label="支付密码修改" value="SMS_29455"></el-option>
                        <el-option label="换绑手机号" value="SMS_47446"></el-option>
                        <el-option label="订单终止" value="SMS_0015"></el-option>
                        <el-option label="支付成功" value="SMS_68594"></el-option>
                        <el-option label="余额充值" value="SMS_33337"></el-option>
                        <el-option label="全部发货" value="SMS_76570"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择模板：" prop="templateTitle">
                    <div @click="showNoteTemplateSelector=true">
                        <el-input v-model="noteAddList.templateTitle" placeholder="请选择短信模板" style="width: 400px;" readonly>
                            <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="发送对象：" prop="isAll">
                    <el-radio-group v-model="noteAddList.isAll">
                        <el-radio :label="1">全部人员</el-radio>
                        <el-radio :label="0">指定人员</el-radio>
                    </el-radio-group>
                    <span style="margin-left: 45px;margin-right: 45px;" v-if="noteAddList.isAll===0">已选择&nbsp;{{noteAddList.sendUser?noteAddList.sendUser.length:0}}&nbsp; 人</span>
                    <el-button type="primary" @click="showMemberSelector=true" v-if="noteAddList.isAll===0">选择</el-button>
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                    <el-input v-model="noteAddList.note" type="textarea" style="width: 400px" :autosize="{ minRows: 2, maxRows: 6 }">

                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="noteTemplateSubmit" :loading="isLoading">确定</el-button>
            </div>
        </el-dialog>

        <!--        短信模板选择框-->
        <note-template-selector v-if="showNoteTemplateSelector" ref="goodsLibrarySelector" :dialogVisible="showNoteTemplateSelector"
                                @handleClose="showNoteTemplateSelector=false"
                                @handleSubmit="handleSubmitPublic"></note-template-selector>

        <!--        客户选择弹窗-->
        <member-selector v-if="showMemberSelector" ref="memberSelector" :dialogVisible="showMemberSelector" :afterChoose="noteAddList.sendUser"
                         :isSingle="false"
                         @handleClose="handleClosePublic"
                         @handleSubmit="handleMemberSubmit"></member-selector>
    </list-container>
</template>

<script>
    import {selectWebsiteSetting,updateWebsiteSetting,createOrUpdateEnable} from '@/api/erp/saas/websiteControl/websiteSetting';
    import {updateTransportManager,selectTransportManager,selectNoteSetting,updateNoteSetting,createTemplate,selectNoteSettingPage,deleteTemplate,updateTemplate} from '@/api/erp/saas/websiteControl/websiteSetting';
    import { provinceAndCityData } from 'element-china-area-data'
    import noteTemplateSelector from "@/components/saas/noteTemplateSelector";
    // let E = require('wangeditor')
    let xss=require('xss')
    export default {
        props: ['timeStamp'],
        name: "websiteSetting",
        components: {
            noteTemplateSelector,
            'memberSelector': () => import('@/components/saas/memberSelector'),
            'setting': () => import('@/views/erp/saas/cloudWMS/setting'),
        },
        data() {
            const generateData = _ => {
                const data = [];
                const province=provinceAndCityData
                province.forEach((item,index) => {
                    data.push({
                        label: item.label,
                        key: item.label,
                        value:item.value
                    });
                });
                return data;
            };
            return {
                data: generateData(),
                value: [],
                listLoading:false,
                showMemberSelector:false,
                showNoteTemplateSelector:false,
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1;
                },
                isLoading:false,
                noteActiveName:'first',
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑',
                    create: '新建'
                },
                noteAddList:{},
                businessMap:{
                    SMS_22188:'注册验证码',
                    SMS_32014:'忘记密码',
                    SMS_29455:'支付密码修改',
                    SMS_47446:'换绑手机号',
                    SMS_0015:'订单终止',
                    SMS_68594:'支付成功',
                    SMS_33337:'余额充值',
                    SMS_76570:'全部发货',
                },
                noteListQuery:{
                  page:1,
                  limit:10
                },
                total:0,
                showAreaSelector:false,
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否显示新增编辑短信模板对话框
                activeName:'first',
                activeIndex:1,
                addList:{
                },//设置网站数据存储对象
                noteList:{},//设置短信提醒数据存储对象
                sourceClassifyVisible:false,//是否显示关联分类对话框
                sourceBrandVisible:false,//是否显示关联品牌对话框
                showSpecification:false,//是否显示规格参数对话框
                nowRow:Object,//当前行中值集合
                transportList:{
                    type:0,
                },
                editorOptions:{
                    //普通图片上传
                    customConfig: {
                        menus:[
                            'head',  // 标题
                            'bold',  // 粗体
                            'fontSize',  // 字号
                            'fontName',  // 字体
                            'italic',  // 斜体
                            'underline',  // 下划线
                            'strikeThrough',  // 删除线
                            'foreColor',  // 文字颜色
                            'backColor',  // 背景颜色
                            'link',  // 插入链接
                            'list',  // 列表
                            'justify',  // 对齐方式
                            'quote',  // 引用
                            'emoticon',  // 表情
                            'table',  // 表格
                            'video',  // 插入视频
                            'code',  // 插入代码
                            'undo',  // 撤销
                            'redo'  // 重复
                        ]
                    },//wangEditor编辑的配置
                    props: {
                        res: "data",
                        url: "url"
                    },
                },
                specificationTags:[],//当前行规格参数存储对象
                publicTitle:'',
                inputVisible: false,//规格参数是否显示输入框
                rules: {//新增&编辑商品表单验证
                    'webUrl': [{required: true, message: '站点域名不能为空', trigger: 'blur'}],
                    'logo':  [{required: true, message: 'PC端LOGO不能为空', trigger: 'blur'}],
                    'phone': [{required: true, message: '客服电话不能为空', trigger: 'blur'}],
                    'info': [{required: true, message: '版权信息不能为空', trigger: 'blur'}],
                    'businessCode': [{required: true, message: '业务不能为空', trigger: 'blur'}],
                    'templateTitle': [{required: true, message: '短信模板不能为空', trigger: 'blur'}],
                    'isAll': [{required: true, message: '发送对象不能为空', trigger: 'blur'}],
                },
                inputValue: '',
                isSingle: true,
                option: [],
                typeName: '',
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: true,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                // editor:{},
                workTime:['09:00','17:00']
            }
        },
        created() {
            this.getList()
        },
        watch:{
            noteActiveName:function (val) {
                this.listLoading=true
                if (val==='second'){
                    this.getNoteSettingPage()
                }
            }
        },
        mounted() {
            // this.editor = new E('#wangEditorToolbar','#wangEditorText')
            // this.editor.create()
            // if(this.addList.protocol&&this.addList.protocol!==''){
            //     this.editor.txt.html(this.addList.protocol)
            // }else{
            //     let text='<h4>一.用户须知</h4>\n' +
            //         '        <p>（1）您在申请注册流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。如您对协议有任何疑问，可向****客服咨询。</p>\n' +
            //         '        <p>（2）当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与****达成一致，成为****“用户”。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。</p>\n' +
            //         '        <p>（3）签约主体【平等主体】本协议由您与****经营者共同缔结，本协议对您与****经营者均具有合同效力。【主体信息】****经营者是指经营****的各法律主体，您可随时查看****各网站首页底部公示的证照信息以确定与您履约的****主体。本协议项下，****经营者可能根据****的业务调整而发生变更，变更后的****经营者与您共同履行本协议并向您提供服务，****经营者的变更不会影响您本协议项下的权益。****经营者还有可能因为提供新的****服务而新增，如您使用新增的****服务的，视为您同意新增的****经营者与您共同履行本协议。发生争议时，您可根据您具体使用的服务及对您权益产生影响的具体行为对象确定与您履约的主体及争议相对方。</p>\n' +
            //         '        <p>（4）补充协议由于互联网高速发展，您与****签署的本协议列明的条款并不能完整罗列并覆盖您与****所有权利与义务，现有的约定也不能保证完全符合未来发展的需求。因此，****隐私权声明、法律声明、版权规则、****规则均为本协议的补充协议，与本协议不可分割且具有同等法律效力。如您使用****服务，视为您同意上述补充协议。</p>\n' +
            //         '        <h4>二、注册与使用</h4>\n' +
            //         '        <p>（1）****保证所有商品均为与正规商家合作提供。</p>\n' +
            //         '        <p>（2）****尽最大努力确保网站图片与实物的一致性，但由于拍摄角度、光线强度、不同显示器的色差等问题仍有可能导致出现误差，此种情况不属于质量问题范畴。图片仅供参考，一切以实物为准。</p>\n' +
            //         '        <p>（3）****竭诚为广大客户提供最优质的商品及服务，但对于任何欺诈或不道德行为，****将保留取消订单直至依法追究法律责任的权利。</p>\n' +
            //         '        <p>（4）有关商品质量的检测，依国家规定执行。</p>\n' +
            //         '        <p>（5）本条款最终解释权归****所有。</p>\n' +
            //         '        <p>（6）服务条款确认,****是一家致力于打造便捷化电子商务的互联网商城，通过互联网及相关软硬件设施为会员提供质优价廉的电气产品！****秉承客户至上的经营理念，为用户提供最优质的服务，让用户获取最完美的网购体验。\n' +
            //         '              ****的网站所有权、运作权及所涉及的一切知识产权归**************所有。用户在享受****提供服务同时，应受本协议条款的约束。用户通过注册流程并完成注册，表示用户完全理解并接受本协议的各项条款，在享有条款授予权力的同时，受到相关的约束和限制。当用户在使用****各单项服务时，用户享受服务的行为被视为对单项服务条款以及该单项服务中发出的各类公告的认可。</p>\n' +
            //         '        <p>（7）用户行为准则:用户承诺对服务的使用是根据所有适用于服务的地方法律、国家法律并对自己发布的内容单独承担责任。</p>\n' +
            //         '        <p>（7.1）承诺在网页上发布信息或者利用****的服务时必须符合中国有关法规，不在****的网页上或者利用****的服务制作、复制、发布、传播以下信息：</p>\n' +
            //         '        <p>A. 违反国家各项法律法规的以及法律法规禁止的、泄露国家机密、破坏国家统一的；</p>\n' +
            //         '        <p>B. 危害国家安全、破坏名族团结、损害国家利益的；</p>\n' +
            //         '        <p>C. 破坏国家宗教政策、宣扬邪教和封建迷信的；</p>\n' +
            //         '        <p>D. 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>\n' +
            //         '        <p>E. 侮辱或者诽谤他人，侵害他人合法利益的；</p>\n' +
            //         '        <p>（7.2）承诺不利用****提供的服务从事制作、传播计算机病毒等破坏性程序；不从事危害计算机信息网络安全的行为；不以任何方式干扰****的正常运行</p>\n' +
            //         '        <p>（7.3）用户使用****各项服务的权利是基于人的。不论是公司或实体的商业性组织。用户承诺不经****同意，不能利用****各项服务从事任何商业活动。</p>\n' +
            //         '        <p>（8）用户名、密码和安全性:注册成为会员，你将拥有一个专属于个人的用户名和密码，请妥善保管。因个人保管不善引起的责任，由个人承担。根据个人需要，您可以登录****修改密码。如发现个人账户有任何非正常情况发生，可联系****客服人员。</p>\n' +
            //         '        <p>（9）用户隐私制度</p>\n' +
            //         '        <p>（9.1）在您加入****服务时，我们要求您提供个人资料，包括手机号码。根据您个人意愿和需要，你可以留下更多的个人信息，您的电子邮件将是我们提供信息和服务的重要渠道，请确保这些信息的正确性。</p>\n' +
            //         '        <p>（9.2）尊重用户个人隐私是****的一项基本政策，此政策意在确保我们为您带来便捷服务的同时，充分尊重和保护您的个人信息和隐私。****不会公开、修改或透露用户的注册资料及保存在****各项服务中的非公开内容</p>\n' +
            //         '        <p>（9.3）如用户同意****或者要求****可以透露某些信息的；或者授权必须向某人透露信息的；或者在法律法规要求下需要****提供个人信息的；或者****认为的其它必要的，****会在诚信的基础上、在有必要的前提下才会公开。</p>\n' +
            //         '        <p>（9.4）****的信息服务是根据您的主动申请而提供的，除了少量的服务动态信息，我们不会任意推送无关的信息到您的电子邮箱。如果您想完全拒绝非主动获得的信息，您可以与客服取得联系帮您取消。</p>\n' +
            //         '        <p>（10）拒绝提供担保:用户明确同意会员服务的使用由用户个人承担风险，****不担保服务一定能满足用户的要求，也不担保服务不会受中断，对服务的及时性，安全性，出错发生都不作担保。****拒绝提供任何担保，包括信息能否准确，及时，顺利的传送。</p>\n' +
            //         '        <p>（10.1）服务条款的修订:****会在必要时修改服务条款，服务条款一旦发生变动，将会在重要页面上提示修改内容或通过其他形式告知会员。</p>\n' +
            //         '        <p>（10.2）结束服务:用户或者****可随时根据实际情况中止网站服务。****不需对任何个人或第三方负责！结束用户服务后，用户使用****会员服务的权利马上中止。从那时起，****不再对用户承担任何义务。</p>\n' +
            //         '        <p>（10.3）通告:所有重要信息的通告，包括条款的修改、服务变更、或其他重要事情，网站可以以电子邮件、站内消息、网站页面显要位置公告的形式告知用户</p>\n' +
            //         '        <p>（10.4）法律:会员服务条款与该我国国家法律解析一致，包括法律条款中有争议抵触的内容。若有任何服务条款与法律相抵触，那这些条款将按尽可能接近的方法重新解析，而其它条款则保持对用户产生效力和影响。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可本站所在地的人民法院提起诉讼。</p>\n' +
            //         '        <h4>三、****服务及规范【服务概况】您有权在****上享受供应管理、商品或服务的销售与推广、商品或服务的购买与评价、商品退换货处理、交易争议处理等服务。****提供的服务内容众多，具体您可登录****浏览。</h4>\n' +
            //         '        <p>（1）商品或服务的销售与推广</p>\n' +
            //         '        <p>【商品或服务信息发布】通过****文字、图片、视频、音频等形式在****上选购您所需要的商品，达成交易。</p>\n' +
            //         '        <p>【禁止销售范围】您应当确保您对您在****上发布的商品或服务享有相应的权利，您不得在****上销售以下商品或提供以下服务：（一）国家禁止或限制的；（二）侵犯他人知识产权或其它合法权益的；（三）\n' +
            //         '              ****规则或您与第三方单独签署的协议中已明确说明不适合在****上销售或提供的。</p>\n' +
            //         '        <p>【交易秩序保障】您应当遵守诚实信用原则，确保您所发布的商品或服务信息真实、与您实际所销售的商品或提供的服务相符，并在交易过程中切实履行您的交易承诺。您应当维护****市场良性竞争秩序，不得贬低、诋毁竞争对手，不得干扰****上进行的任何交易、活动，不得以任何不正当方式提升或试图提升自身的信用度，不得以任何方式干扰或试图干扰****的正常运作。</p>\n' +
            //         '        <p>【促销及推广】您有权决定商品或服务的促销及推广方式，****亦为您提供了形式丰富的促销推广工具。但您的促销推广行为应当符合国家相关法律法规及****的要求。</p>\n' +
            //         '        <p>【依法纳税】依法纳税是每一个公民、企业应尽的义务，您应对销售额/营业额超过法定免征额部分及时、足额地向税务主管机关申报纳税。</p>\n' +
            //         '        <p>（2）团购及性价比定制服务</p>\n' +
            //         '        <p>（2.1）参加****发起团购的客户请遵守团购规则，客户应本着实事求是的原则，根据自己的需求参加团购，团购要达到要求的最低起订量，而且团购的商品除产品质量问题外不能退换货，详情请见帮助中心里团购相关内容。</p>\n' +
            //         '        <p>（3）商品或服务的购买与评价</p>\n' +
            //         '        <p>【商品或服务的购买】当您在****购买商品或服务时，请您务必仔细确认所购商品的品名、价格、数量、型号、规格、尺寸或服务的时间、内容、限制性要求等重要事项，并在下单时核实您的联系地址、电话、收货人等信息。如您填写的收货人非您本人，则该收货人的行为和意思表示产生的法律后果均由您承担。您的购买行为应当基于真实的消费需求，不得存在对商品或服务实施恶意购买、恶意维权等扰乱****正常交易秩序的行为。基于维护****交易秩序及交易安全的需要，****发现上述情形时可主动执行关闭相关交易订单等操作。</p>\n' +
            //         '        <p>（4）商品退换货处理</p>\n' +
            //         '        <p>（4.1）非产品本身质量问题，不得退换货</p>\n' +
            //         '        <p>（4.2）如遇到产品质量问题，请联系商城客服，并提供相应证据。我们将与厂家联系提供相应的售后。</p>\n' +
            //         '        <p>（5）****向您提供的服务付出了大量的成本，除****明示的收费业务外，****向您提供的服务目前是免费的。如未来****向您收取合理费用，****会采取合理途径并以足够合理的期限提前通过法定程序并以本协议第八条约定的方式通知您，确保您有充分选择的权利。</p>\n' +
            //         '        <p>（6）责任限制</p>\n' +
            //         '        <p>【不可抗力】****负责"按现状"和"可得到"的状态向您提供****服务。****依法律规定承担基础保障义务，但无法对由于信息网络设备维护、连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，暴乱，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或因第三方原因而给您造成的损害结果承担责任。</p>\n' +
            //         '        <p>【调处决定】您理解并同意，在争议调处服务中，****的客服并非专业人士，仅能以普通人的认知对用户提交的凭证进行判断。因此，除存在故意外，调处方对争议调处决定免责。</p> \n' +
            //         '        <h4>四、用户信息的保护及授权</h4>\n' +
            //         '        <p>（1）个人信息的保护****非常重视用户个人信息（即能够独立或与其他信息结合后识别用户身份的信息）的保护，在您使用****提供的服务时，您同意****按照在****上公布的隐私权政策收集、存储、使用、披露和保护您的个人信息。****希望通过隐私权政策向您清楚地介绍****对您个人信息的处理方式，因此****建议您完整地阅读隐私权政策（可在****首页底部链接查看），以帮助您更好地保护您的隐私权。</p>\n' +
            //         '        <p>（2）非个人信息的保证与授权</p>\n' +
            //         '        <p>【信息的发布】您声明并保证，您对您所发布的信息拥有相应、合法的权利。否则，****可对您发布的信息依法或依本协议进行删除或屏蔽</p>\n' +
            //         '        <p>【禁止性信息】您应当确保您所发布的信息不包含以下内容：（一） 违反国家法律法规禁止性规定的；（二）\n' +
            //         '              政治宣传、封建迷信、淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；（三）欺诈、虚假、不准确或存在误导性的；（四）侵犯他人知识产权或涉及第三方商业秘密及其他专有权利的；（五）\n' +
            //         '              侮辱、诽谤、恐吓、涉及他人隐私等侵害他人合法权益的；（六）存在可能破坏、篡改、删除、影响****任何系统正常运行或未经授权秘密获取****及其他用户的数据、个人资料的病毒、木马、爬虫等恶意软件、程序代码的；（七）其他违背社会公共利益或公共道德或依据相关****协议、规则的规定不适合在****上发布的。</p>\n' +
            //         '        <p>【授权使用】对于您提供及发布除个人信息外的文字、图片、视频、音频等非个人信息，在\n' +
            //         '              版权保护期内您免费授予****及其关联公司获得全球排他的许可使用权利及再授权给其他第三方使用的权利。您同意****及其关联公司存储、使用、复制、修订、编辑、发布、展示、翻译、分发您的非个人信息或制作其派生作品，并以已知或日后开发的形式、媒体或技术将上述信息纳入其它作品内。</p>\n' +
            //         '        <h4>五、用户的违约及处理</h4>\n' +
            //         '        <p>（1）违约认定发生如下情形之一的，视为您违约：（一） 使用****服务时违反有关法律法规规定的；（二）\n' +
            //         '              违反本协议或本协议补充协议约定的。为适应电子商务发展和满足海量用户对高效优质服务的需求，您理解并同意，****可在****规则中约定违约认定的程序和标准。如：****可依据您的用户数据与海量用户数据的关系来认定您是否构成违约；您有义务对您的数据异常现象进行充分举证和合理解释，否则将被认定为违约。</p>\n' +
            //         '        <p>（2）违约处理措施</p>\n' +
            //         '        <p>【信息处理】您在****上发布的信息构成违约的，****可根据相应规则立即对相应信息进行删除、屏蔽处理或对您的商品进行下架、监管</p>\n' +
            //         '        <p>【行为限制】您在****上实施的行为，或虽未在****上实施但对****及其用户产生影响的行为构成违约的，****可依据相应规则对您执行限制参加营销活动、中止向您提供部分或全部服务、划扣违约金等处理措施。如您的行为构成根本违约的，****可查封您的账户，终止向您提供服务。</p>\n' +
            //         '        <p>【处理结果公示】****可将对您上述违约行为处理措施信息以及其他经国家行政或司法机关生效法律文书确认的违法信息在****上予以公示。</p>\n' +
            //         '        <p>（3）赔偿责任如您的行为使****或其关联公司遭受损失（包括自身的直接经济损失、商誉损失及对外支付的赔偿金、和解款、律师费、诉讼费等间接经济损失），您应赔偿****或其关联公司的上述全部损失。如您的行为使****或其关联公司遭受第三人主张权利，****或其关联公司可在对第三人承担金钱给付等义务后就全部损失向您追偿。</p>\n' +
            //         '        <p>（4）特别约定</p>\n' +
            //         '        <p>【商业贿赂】如您向****或其关联公司的雇员或顾问等提供实物、现金、现金等价物、劳务、旅游等价值明显超出正常商务洽谈范畴的利益，则可视为您存在商业贿赂行为。发生上述情形的，****可立即终止与您的所有合作并向您收取违约金及/或赔偿金，该等金额以****因您的贿赂行为而遭受的经济损失和商誉损失作为计算依据。</p>\n' +
            //         '        <h4>六、协议的变更****可根据国家法律法规变化及维护交易秩序、保护消费者权益需要，不时修改本协议、补充协议，变更后的协议、补充协议（下称“变更事项”）将通过法定程序并以本协议第八条约定的方式通知您。如您不同意变更事项，您有权于变更事项确定的生效日前联系****反馈意见。如反馈意见得以采纳，****将酌情调整变更事项。如您对已生效的变更事项仍不同意的，您应当于变更事项确定的生效之日起停止使用****服务，变更事项对您不产生效力；如您在变更事项生效后仍继续使用****服务，则视为您同意已生效的变更事项。</h4>\n' +
            //         '        <h4>七、通知您同意****以以下合理的方式向您送达各类通知：（一） 公示的文案；（二） 站内信、客户端推送的消息；（三）根据您预留于****的联系方式发出的电子邮件、短信、函件等。</h4>\n' +
            //         '        <h4>八、协议的终止</h4>\n' +
            //         '        <p>（1） 终止的情形</p>\n' +
            //         '        <p>【用户发起的终止】您有权通过以下任一方式终止本协议：（一）在满足****网公示的账户注销条件时您通过网站自助服务注销您的账户的；（二）变更事项生效前您停止使用并明示不愿接受变更事项的；（三）您明示不愿继续使用****服务，且符合****网终止条件的。</p>\n' +
            //         '        <p>【****发起的终止】出现以下情况时，****可以本协议第八条的所列的方式通知您终止本协议：（一）您违反本协议约定，****依据违约条款终止本协议的；（二）您盗用他人账户、发布违禁信息、骗取他人财物、售假、扰乱市场秩序、采取不正当手段谋利等行为，****依据****规则对您的账户予以查封的；（三）除上述情形外，因您多次违反****规则相关规定且情节严重，****依据****规则对您的账户予以查封的；（三）您的账户被****依据本协议回收的；（四）其它应当终止服务的情况。</p>\n' +
            //         '        <p>（2）协议终止后的处理【用户信息披露】本协议终止后，除法律有明确规定外，****无义务向您或您指定的第三方披露您账户中的任何信息。【****权利】本协议终止后，****仍享有下列权利：（一）继续保存您留存于****的本协议第五条所列的各类信息；（二）对于您过往的违约行为，****仍可依据本协议向您追究违约责任。【交易处理】本协议终止后，对于您在本协议存续期间产生的交易订单，****可通知交易相对方并根据交易相对方的意愿决定是否关闭该等交易订单；如交易相对方要求继续履行的，则您应当就该等交易订单继续履行本协议及交易订单的约定，并承担因此产生的任何损失或增加的任何费用。</p>\n' +
            //         '        <h4>九、法律适用、管辖与其他</h4>\n' +
            //         '        <p>【法律适用】本协议之订立、生效、解释、修订、补充、终止、执行与争议解决均适用中华人民共和国大陆地区法律；如法律无相关规定的，参照商业惯例及/或行业惯例。</p>\n' +
            //         '        <p>【管辖】您因使用****服务所产生及与****服务有关的争议，由****与您协商解决。协商不成时，任何一方均可向人民法院提起诉讼。</p>\n' +
            //         '        <p>【可分性】本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。</p>'
            //
            //
            //         this.editor.txt.html(text)
            //
            // }
        },
        computed:{
            openERP(){
                return this.$store.getters.openERP*1
            }
        },
        methods: {
            getNoteSettingPage(){
                selectNoteSettingPage(this.noteListQuery).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.list=res.data.data.records
                        this.total=res.data.data.total
                    }else{
                        this.showError('获取短信设置列表失败!'+res.data.msg||res.data.data,res.data.code)
                    }
                    this.listLoading=false
                },error => this.showError('获取短信设置列表失败!'+error))
            },
            //获取数据
            getList() {
                selectWebsiteSetting().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=res.data.data||{}
                        try {
                            if(!res.data.data.protocolTitle||res.data.data.protocolTitle===''){
                                this.$set(this.addList,'protocolTitle','****用户协议')
                            }
                        }catch (e) {

                        }


                        //this.workTime=res.data.data.workTime.split(',')
                    }else{
                        this.showError('获取网站设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取网站设置信息失败,'+error))

                selectTransportManager().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        if(!res.data.data.umsTransportItemList||res.data.data.umsTransportItemList.length<1){
                            res.data.data.umsTransportItemList=[{areas:'全国默认地区'}]
                        }
                        this.transportList=res.data.data||{}

                    }else{
                        this.showError('获取运费设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取运费设置信息失败,'+error))

                selectNoteSetting().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.noteList=res.data.data||{}
                    }else{
                        this.showError('获取短信设置信息失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取短信设置信息失败,'+error))


            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message){
                this.$message.error(message)
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
             * 初始化所有状态
             */
            init(){
                this.getList()
            },

            doUpdate(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        if(this.activeIndex===4) {
                            let params=Object.assign({},this.transportList)
                            for (let i = 0; i < params.umsTransportItemList.length; i++) {
                                if (params.umsTransportItemList[i] == null || params.umsTransportItemList[i] == "" || JSON.stringify(params.umsTransportItemList[i]) == "{}") {
                                    params.umsTransportItemList.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            for (let i = 0; i <params.umsTransportItemList.length ; i++) {
                                if(params.umsTransportItemList[i].areas){
                                    params.umsTransportItemList[i].areas=params.umsTransportItemList[i].areas.toString()
                                }else{

                                }

                            }
                            updateTransportManager(params).then(res=>{
                                if(Number(res.data.code)===200||Number(res.data.code)===2000){
                                    this.showSuccess('更新运费设置成功!')
                                }else{
                                    this.showError('更新运费设置失败!'+res.data.msg||res.data.data,res.data.code)
                                }
                            },error => this.showError('更新运费设置失败!'+error))
                        }else if(this.activeIndex===6){
                            updateNoteSetting(this.noteList).then(res=>{
                                if(Number(res.data.code)===200||Number(res.data.code)===2000){
                                    this.showSuccess('短信提醒设置成功!')
                                }else{
                                    this.showError('短信提醒设置失败!'+res.data.msg||res.data.data,res.data.code)
                                }
                            },error => this.showError('短信提醒设置失败!'+error))
                        }else{
                            let params = Object.assign({}, this.addList)
                            // params.workTime=this.workTime.toString()
                            // try {
                            //     this.addList.workTime=this.workTime.toString()
                            // }catch (e) {
                            //
                            // }
                            params.protocol = xss(params.protocol)
                            params.contractProtocol = xss(params.contractProtocol)
                            updateWebsiteSetting(params).then(res => {
                                if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                                    this.showSuccess('更新网站设置成功!')
                                } else {
                                    this.showError('更新网站设置失败,' + res.data.msg || res.data.data, res.data.code)
                                }
                            }, error => this.showError('更新网站设置失败,' + error))
                        }

                    }
                })
            },

            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res,file) {
               this.$set(this.addList,'logo',res.data.url)
            },
            codeHandleAvatarSuccess(res,file){
                this.$set(this.addList,'qrCode',res.data.url)
            },
            titleHandleAvatarSuccess(res,file){
                this.$set(this.addList,'tittleLog',res.data.url)
            },

            /**
             * 新增关联商品行
             */
            addAssData(){
                this.transportList.umsTransportItemList.push({})
            },

            /**
             * 删除地区选择行
             * @param index 当前行索引
             */
            deleteAssData(index){
                this.transportList.umsTransportItemList.splice(index,1)
            },

            /**
             * 新建短信设置
             */
            handleCreate(){
                this.dialogFormVisible=true
                this.dialogStatus='create'
                this.noteAddList={}
            },

            handleSubmitPublic(row){
                this.showNoteTemplateSelector=false
                // this.noteAddList.templateTitle=row.instructions
                this.$set(this.noteAddList,'templateTitle',row.instructions)
                this.$refs['noteAddList'].validateField('templateTitle')
                this.noteAddList.templateCode=row.templateCode
                this.noteAddList.templateContent=row.templateText
            },

            /**
             * 关闭对话框
             */
            handleClosePublic() {
                this.showMemberSelector=false
            },

            handleMemberSubmit(row){
                let arr=[]
                for (let i = 0; i <row.length ; i++) {
                    // row[i].memberName=row[i].username
                    // row[i].memberId=row[i].id
                    arr.push(row[i].id)
                }
                this.$set(this.noteAddList,'sendUser',arr)
                // this.$set(this.noteAddList,'sumName',arr.toString())
                // this.$refs['noteAddList'].validateField('sumName')
                this.showMemberSelector=false
                //console.log(this.noteAddList.sendUser)
            },

            noteTemplateSubmit(){
                this.$refs['noteAddList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        let params=Object.assign({},this.noteAddList)
                        if(params.isAll===1){
                            params.sendUser=''
                        }else{
                            params.sendUser=params.sendUser.toString()
                        }
                        params.businessName=this.businessMap[params.businessCode]
                        let method=this.dialogStatus==='create'?createTemplate:updateTemplate
                        method(params).then(res=>{
                            this.isLoading=false
                            if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                // this.showSuccess('创建短信设置成功!')
                                this.$message.success(this.textMap[this.dialogStatus]+'短信设置成功!')
                                this.dialogFormVisible=false
                                this.getNoteSettingPage()
                            }else{
                                this.showError(this.textMap[this.dialogStatus]+'短信设置失败!'+res.data.msg||res.data.data,res.data.code)
                            }
                        },error=>{
                            this.showError(this.textMap[this.dialogStatus]+'短信设置失败!'+error)
                            this.isLoading=false
                        })
                    }
                })

            },

            /**
             * 重置按钮方法
             */
            clear() {
                this.noteListQuery={
                    page:1,
                    limit:10
                }
                // this.list=[...this.tableData]
                this.getNoteSettingPage()
            },

            handleFilter() {
                this.noteListQuery.page = 1;
                // if(this.noteListQuery.daterange.length>1){
                //     this.noteListQuery.startTime=this.noteListQuery.daterange[0]
                //     this.noteListQuery.endTime=this.noteListQuery.daterange[1]
                // }
                this.getNoteSettingPage()
                // let data=[...this.tableData]
                // if(this.listQuery.name&&this.listQuery.name!==''){
                //     data=data.filter(item=>item.name.indexOf(this.listQuery.name)>-1)
                // }
                // this.list=data
                // this.total=this.list.length
            },

            /**
             *行内删除
             */
            handleRowDelete(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // let params={
                    //     ids:[row.id],
                    // }
                    deleteTemplate(row.id).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.$message.success('删除成功!')
                            this.getNoteSettingPage()
                        } else {
                            this.showError('删除失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('删除失败,'+error));
                });
            },

            handleUpdate(row){
                this.dialogStatus='update'
                this.dialogFormVisible=true
                row.isAll=row.sendUser===''?1:0
                if(row.sendUser!==''){
                    row.sendUser=row.sendUser.split(',')
                }
                this.noteAddList=Object.assign({},row)
            },

            handleSizeChange(val) {
                this.noteListQuery.limit = val;
                this.getNoteSettingPage()
            },

            handleCurrentChange(val) {
                this.noteListQuery.page = val;
                this.getNoteSettingPage()
            },

            doOpenERP(val){
                let localStorage = window.localStorage
                if(localStorage['canOpenERP']==='1'){
                    this.$confirm('开启ERP后，库存将同步ERP数据，商城子订单自动生成ERP订单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={
                            tenantId:localStorage['tenantId'],
                            enable:val
                        }
                        createOrUpdateEnable(params).then(res=>{
                            if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                this.showSuccess('开启ERP成功!')
                                this.$store.commit('SET_OPEN_ERP',val)
                            }else{
                                this.showError('开启ERP失败!'+res.data.msg||res.data.data,res.data.code)
                            }
                        },error => this.$message.error('开启ERP失败!'+error))
                    })
                }else{
                    this.$message.warning('请联系您的专属客服开通梅施云ERP')
                }

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
    .default-setting .el-input-group__append,.webSetting-main .el-input-group__prepend{
        border-left: 1px solid #DCDFE6!important;
        border-right: none!important;
    }
    .webSetting-left{
        border-right: 1px solid #dcdfe6;
        min-height: 1080px;
    }
    .webSetting-left>div{
        height: 48px;
        width: 142px;
        cursor: pointer;
        line-height: 48px;
        font-size: 14px;
        border-bottom: 1px solid #DCDFE6;
    }
    .webSetting-left .choose{
        color: white;
        background-color: #409EFF;
    }
    .webSetting-main .el-card__body{
        padding: 0!important;
    }
    .transport .el-input__inner{
        border: 0!important;
        text-align: center;
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
    .webSetting-main .ql-image{
        display: none!important;
    }
</style>
