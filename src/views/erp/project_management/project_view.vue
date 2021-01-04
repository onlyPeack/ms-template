<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer" class="projectView">
        <el-row :span="24">
            <div class="projectViewTop">
                <div class="projectViewTopOpt">
                    <i class="el-icon-arrow-left"></i>
                    <div>
                        <el-dropdown style="margin-right: 10px;"  v-if="projectViewData.projectStatus == '3'? false:true">
                            <el-button type="primary">
                                <i class="el-icon-plus"></i>快速新建
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="handleEdit('合同')" class="dropdownItem">
                                    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                                        <div></div>
                                        合同
                                    </div>

                                </el-dropdown-item>
                                <el-dropdown-item @click.native="handleEdit('支出')" class="dropdownItemTwo">
                                    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                                        <div></div>
                                        支出
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item class="dropdownItemTree">
                                    <el-upload class="upload" action="/api/manager/storage/create" :before-upload="beforeUpload"
                                               style="width: auto;border: none;"
                                               :on-remove="handleRemove" :show-file-list="false"
                                               :before-remove="beforeRemove" :on-exceed="handleExceed"
                                               :file-list="fileList"
                                               :on-success="uploadCompleteds" :headers="headers">
                                        <div class="dropdownItemTreeDiv" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                                            <div></div>
                                            资料
                                        </div>
                                    </el-upload>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" @click="selfEvaluationVisible = true" v-if="projectViewData.projectStatus!='0'&&projectViewData.projectStatus != '3' && userInfo.id == projectViewData.crtUserId">自评进度</el-button>
                        <el-button type="primary" @click="changeVisible = true"  v-if="projectViewData.projectStatus == '3'? false:true">变更</el-button>
                        <el-button type="primary" v-if="projectViewData.projectStatus == '0'&&projectViewData.projectStatus != '3'"
                                   @click="updateStausBtn(1,1)">启动
                        </el-button>
                        <el-button type="primary" v-if="projectViewData.projectStatus == '1'&&projectViewData.projectStatus != '3'"
                                   @click="updateStausBtn(2)">暂停
                        </el-button>
                        <el-button type="primary" v-if="projectViewData.projectStatus == '2'&&projectViewData.projectStatus != '3'"
                                   @click="updateStausBtn(1,0)">重启
                        </el-button>
                        <el-button type="primary" @click="updateStausBtn(3)" v-if="projectViewData.projectStatus!='0'&&projectViewData.projectStatus != '3'">完成</el-button>
                        <el-button @click="clocseCurrents">返回</el-button>
                    </div>
                </div>
                <div class="projectViewTopXinXin">
                    <div class="projectViewTopXinXinTop">
                        <div class="projectViewTopXinXinTopConent">
                            <img src="http://hejigy.com.cn/xm.png" style="width: 40px;height: 40px;">
                            <div>
                                <span v-if="projectViewData.projectType">{{projectViewData.projectType}}</span>
                                <span v-if="projectViewData.projectName">{{projectViewData.projectName}}</span>
                            </div>
                        </div>
                        <div style="display: flex;flex-direction: row;align-items:center;font-size: 14px;">
                            <span>状态:&nbsp;&nbsp;</span>
                            <img v-if="projectViewData.projectStatus == '1' || projectViewData.projectStatus == '3'" src="http://hejigy.com.cn/tg.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                            <img v-else src="http://hejigy.com.cn/zf.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                            <span v-for="(item,index) in statusOptions"
                                  v-if="item.value == projectViewData.projectStatus">{{item.label}}</span>
                        </div>
                    </div>
                    <div class="projectViewTopXinXinCenter">
                        <div class="projectViewTopXinXinCenterLeft">
                            <img v-if="userInfo.sex == '男'" src="http://hejigy.com.cn/sex1.png" style="width:60px;height: 60px;margin-right: 12px;">
                            <img v-else src="http://hejigy.com.cn/sex2.png" style="width:60px;height: 60px;margin-right: 12px;">
                            <div>
                                <span v-if="projectViewData.chargeName">{{projectViewData.chargeName}}</span>
                                <span>{{projectViewData.departName}}</span>
                            </div>
                        </div>
                        <div class="projectViewTopXinXinCenterRight">
                            <span v-if="projectViewData.startDate"><font class="projectViewXianMuConentColColor">计划工期:&nbsp;&nbsp;</font>{{projectViewData.startDate}}~{{projectViewData.endDate}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{projectViewData.workTime}}天</span>
                            <span v-if="projectViewData.crtTime"><font class="projectViewXianMuConentColColor">实际工期: &nbsp;&nbsp;</font>{{projectViewData.startTime}}~{{projectViewData.endTime}}</span>
                        </div>
                    </div>
                    <div class="projectViewTopOptBorder projectViewTopXinXinItem">
                        <div v-for="(item,index) in xinData" @click="xinIndex = index">
                            <img v-if="xinIndex == index" :src="item.imgUrl"/>
                            <img v-else="xinIndex == index" :src="item.img"/>
                            <span>{{item.title}}</span>
                            <div class="projectOverViewConentItemBottom" v-if="xinIndex == index"></div>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 0">
            <div class="progressView">
                <div v-for="item in progressData">
                    <el-progress type="circle" v-if="item.value !=undefined" :percentage="item.value<0?100:parseInt(item.value)" :width="80"
                                 :stroke-width="15"></el-progress>
                    <span>{{item.title}}</span>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 0">
            <el-col :span="18">
                <div class="projectViewXianMu projectViewSelect">
                    <div class="projectViewXianMuTitle">
                        <i class="el-icon-arrow-down"></i>
                        <span>项目详情</span>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">项目名称&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.projectName}}</span>
                            <span><font class="projectViewXianMuConentColColor">项目类型&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.projectType}}</span>
                        </div>
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">所属部门&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.departName}}</span>
                            <span><font class="projectViewXianMuConentColColor">计划开始&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.startDate}}</span>
                        </div>
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">计划结束&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.endDate}}</span>
                            <span><font class="projectViewXianMuConentColColor">计划工期&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.workTime}}</span>
                        </div>
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">实际开始&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.startTime||'--'}}</span>
                            <span><font class="projectViewXianMuConentColColor">实际结束&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.endTime||'--'}}</span>
                        </div>
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">项目描述&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.workText}}</span>
                        </div>
                        <div class="projectViewXianMuConentCol">
                            <span><font class="projectViewXianMuConentColColor">备注&nbsp;&nbsp;&nbsp;&nbsp;</font>{{projectViewData.note}}</span>
                        </div>
                    </div>
                </div>
                <div class="projectViewXuSuan projectViewSelect">
                    <div class="projectViewXianMuTitle">
                        <i class="el-icon-arrow-down"></i>
                        <span>项目预算概要</span>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div class="projectViewXianMuConentItem">
                            预算金额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color: orange"
                                                                                      v-if="projectData">{{projectData.sumBudgetsAmount}}</font>
                        </div>
                        <div class="projectViewXianMuConentItem">
                            预计支出&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color: orange"
                                                                                      v-if="projectData ">{{projectData.sumPayAmount}}</font>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="projectViewTongJi projectViewSelect">
                    <div class="projectViewTongJiTitle">
                        <div class="projectViewTongJiTitleDiv">
                            <img src="http://hejigy.com.cn/xmzc.png"
                                 style="width: 20px;height: 20px;margin-right: 10px"/>
                            <span>项目支出</span>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div style="font-size: 14px;margin: 4px 0px 14px 0px;">预算金额:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font
                                style="color: orange" v-if="projectData">{{projectData.sumBudgetsAmount}}</font></div>
                        <div class="projectViewXianMuConentRight">
                            <div>
                                <span>支出比例</span>
                                <span>{{projectData.scale}}%</span>
                            </div>
                            <div>
                                <span>支出金额</span>
                                <span><font style="color: orange" v-if="projectData">{{projectData.sumPayAmount}}</font></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="projectViewTongJi projectViewSelect">
                    <div class="projectViewTongJiTitle">
                        <div class="projectViewTongJiTitleDiv">
                            <img src="http://hejigy.com.cn/xmry.png"
                                 style="width: 20px;height: 20px;margin-right: 10px"/>
                            <span>项目人员</span>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div class="projectViewXianMuConentRight">
                            <div>
                                <span>成员人数</span>
                                <span>{{projectData.staffCount}}</span>
                            </div>
                            <div>
                                <span>成员分组</span>
                                <span>{{projectData.groupCount}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="projectViewTongJi projectViewSelect">
                    <div class="projectViewTongJiTitle">
                        <div class="projectViewTongJiTitleDiv">
                            <img src="http://hejigy.com.cn/xmgxr.png"
                                 style="width: 20px;height: 20px;margin-right: 10px"/>
                            <span>干系人</span>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div class="projectViewXianMuConentRight">
                            <div>
                                <span>干系人人数</span>
                                <span>{{projectData.stackCount}}</span>
                            </div>
                            <div>
                                <span>干系人角色</span>
                                <span>{{projectData.roleCount}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="projectViewTongJi projectViewSelect">
                    <div class="projectViewTongJiTitle">
                        <div class="projectViewTongJiTitleDiv">
                            <img src="http://hejigy.com.cn/xmfj.png"
                                 style="width: 20px;height: 20px;margin-right: 10px"/>
                            <span>附件资料</span>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="projectViewXianMuConent">
                        <div class="projectViewXianMuConentRightFj"
                             v-if="projectData && projectData.datas && projectData.datas.length>0">
                            <div class="projectViewXianMuConentRightFjItem" v-for="(item,index) in projectData.datas">
                                {{item.dataName}}
                            </div>
                        </div>
                        <div class="projectViewXianMuConentRightFj" v-else>
                            <img src="http://hejigy.com.cn/fjzw.png" style="width:84px;height:54px;">
                            <span>暂无数据</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 1">
            <div class="personnelDiv">
                <div class="personnelDivHead">
                    <span>项目人员</span>
                    <div class="personnelDivHeadRight">
                        <div>
                            <input placeholder="请输入姓名关键字查询" v-model="listQuerys.userName"/>
                            <i class="el-icon-search" @click="getList(page)"></i>
                        </div>
                        <el-button type="danger" @click="handleRowDelete(1)" v-if="personneData[personneIndex].name!='项目负责人' && projectViewData.projectStatus != '3'">移出项目</el-button>
                        <el-button type="primary" icon="el-icon-plus" v-if="personneData[personneIndex].name!='项目负责人'  && projectViewData.projectStatus != '3'" @click="insertPersonnel">添加人员</el-button>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <el-row :span="24" v-if="xinIndex == 1">
                        <el-col :span="7">
                            <div class="groupAll">
                                <div class="groupAllTitle">&nbsp;&nbsp;&nbsp;&nbsp;全部分组</div>
                                <div v-for="(item,index) in personneData" @click="personneBtn(index)"
                                     :class="personneIndex ==  index ?'groupAlConent xuanZhong':'groupAlConent'">
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}</span>
                                    <i class="el-icon-delete" v-if="item.name!='项目成员' && item.name!='项目负责人' &&  projectViewData.projectStatus != '3'"
                                       @click="delectGroupBtn(item.id)"></i>
                                </div>
                                <div class="groupAllBtn"  v-if="projectViewData.projectStatus == '3'? false:true">
                                    <i class="el-icon-plus"></i>
                                    <span @click="insertGroups">添加分组</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="groupAllList">
                                <list-container :timeStamp="timeStamp" :page="page" @reload="getList"
                                                style="width: 100%;" v-if="isShow">
                                    <avue-crud ref="crud"
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
                                               :cell-style="handleCellStyle"
                                               @row-click="handleRowClick"
                                               @row-dblclick="handleRowDbClick">
                                        <template slot-scope="scope" slot="userName">
                                            <div style="display: flex;flex-direction: row;align-items: center;">
                                                <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                                {{scope.row.userName}}
                                            </div>
                                        </template>
                                    </avue-crud>
                                </list-container>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 2">
            <div class="stakeholderDiv">
                <div class="personnelDivHead">
                    <span>项目干系人</span>
                    <div class="personnelDivHeadRight">
                        <div>
                            <input placeholder="请输入姓名精确查询" v-model="listQuerys.stakeName"/>
                            <i class="el-icon-search" @click="getList(page)"></i>
                        </div>
                        <el-button type="danger" icon="el-icon-minus"  v-if="projectViewData.projectStatus == '3'? false:true"  @click="handleRowDelete(2)">移除干系人</el-button>
                        <el-button type="primary" icon="el-icon-plus"  v-if="projectViewData.projectStatus == '3'? false:true" @click="insertStakeholder">添加干系人</el-button>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"
                                    v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="stakeName">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                    {{scope.row.stakeName}}
                                </div>
                            </template>
                            <template slot-scope="scope" slot="opt">
                                <div>
                                    <el-button :disabled="projectViewData.projectStatus != '3'? false:true" type="danger" icon="el-icon-edit" @click="selectId(scope.row)">编辑
                                    </el-button>
                                </div>
                            </template>
                        </avue-crud>
                    </list-container>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 3">
            <div class="stakeholderDiv">
                <div class="personnelDivHead">
                    <div class="projectZhiTitleLeft">
                    </div>
                    <el-button type="primary" icon="el-icon-plus"  v-if="projectViewData.projectStatus == '3'? false:true" @click="insertExpenditureBtn">支出申请</el-button>
                </div>
                <div class="projectZhiConent">
                    <div>
                        <span>支出金额</span>
                        <span class="sum">{{sumPayData.sumAmount}}</span>
                    </div>
                    <div>
                        <span>支出明细</span>
                        <span>{{sumPayData.count}}</span>
                    </div>
                </div>
                <div>
                    <avue-echart-bar v-if="xinIndex == 3" :theme="themeColor"
                                     :option="configOption" :data="echartsData"
                                     width="100%"
                                     height="400"></avue-echart-bar>
                </div>
                <div class="personnelDivbody" style="margin-top: -20px;">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"
                                    v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="applyName">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                    {{scope.row.applyName}}
                                </div>
                            </template>
                            <template slot-scope="scope" slot="files">
                                <div style="display: flex;flex-direction: row;align-items: center;" v-if="scope.row.files && scope.row.files.length>0">
                                    <el-button plain @click="fillesBtn(scope.row)">查看</el-button>
                                </div>
                            </template>

                        </avue-crud>
                    </list-container>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 4">
            <div class="stakeholderDiv">
                <div class="shenPiTitle">
                    <span class="shenPiTitles">项目审批</span>
                    <span style="color: #DCDFE6;">|</span>
                    <div @click="shenPiIndex = 0">
                        <span :class="shenPiIndex == 0 ? 'color':''">全部</span>
                        <div class="projectOverViewConentItemBottom" v-if="shenPiIndex == 0"></div>
                    </div>
                    <div  @click="shenPiIndex = 1">
                        <span :class="shenPiIndex == 1 ? 'color':''">项目启停</span>
                        <div  class="projectOverViewConentItemBottom" v-if="shenPiIndex == 1"></div>
                    </div>
                    <div  @click="shenPiIndex = 2">
                        <span :class="shenPiIndex == 2 ? 'color':''">项目变更</span>
                        <div  class="projectOverViewConentItemBottom" v-if="shenPiIndex == 2"></div>
                    </div>
                    <div  @click="shenPiIndex = 3">
                        <span :class="shenPiIndex == 3 ? 'color':''">项目支出</span>
                        <div  class="projectOverViewConentItemBottom" v-if="shenPiIndex == 3"></div>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"  v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="auditStatus">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img v-if="scope.row.auditStatus == '1'" src="http://hejigy.com.cn/tg.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                    <img v-if="scope.row.auditStatus == '0'" src="http://hejigy.com.cn/sp1.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                    <img v-if="scope.row.auditStatus == '2'" src="http://hejigy.com.cn/zf.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                    {{scope.row.auditStatus == '0' ? '待审批' :scope.row.auditStatus == '1' ? '已审批': '已驳回'}}
                                </div>
                            </template>
                        </avue-crud>
                    </list-container>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 5">
            <div class="stakeholderDiv">
                <div class="personnelDivHead">
                    <span>项目预算</span>
                    <div class="personnelDivHeadRight">
                        <el-button type="primary" icon="el-icon-plus" @click="budgetBtns"  v-if="projectViewData.projectStatus == '3'? false:true">预算申请</el-button>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"
                                    v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="status">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img v-if="scope.row.status == '0'" src="http://hejigy.com.cn/tg.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                    <img v-else src="http://hejigy.com.cn/zf.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                    {{scope.row.status == '0' ? '正常' : '作废'}}
                                </div>
                            </template>
                            <template slot-scope="scope" slot="opt">
                                <div>
                                    <el-link :underline="false" v-if="scope.row.status == '0' || scope.row.status == 0"  style="color: #3E90FE;margin-right: 14px;cursor: pointer;font-size: 12px;"
                                       @click="budgetsBtn(scope.row)">编辑
                                    </el-link>
                                    <el-link :underline="false"  style="color: #3E90FE;margin-right: 14px;cursor: pointer;font-size: 12px;" v-if="scope.row.status == '0' || scope.row.status == 0"
                                       @click="handleUpadate(scope.row)">作废
                                    </el-link>
                                    <el-link :underline="false"  style="color: #F86B67;cursor: pointer;font-size: 12px;"
                                       @click="handleDelete(scope.row.id)">删除</el-link>
                                </div>
                            </template>
                        </avue-crud>
                    </list-container>
                </div>
            </div>

        </el-row>
        <el-row :span="24" v-if="xinIndex == 6">
            <div class="stakeholderDiv">
                <div class="shenPiTitle">
                    <span class="shenPiTitles">项目变更</span>
                    <span style="color: #DCDFE6;">|</span>
                    <div @click="bianGengIndex = -1">
                        <span :class="bianGengIndex == -1 ? 'color':''">全部</span>
                        <div class="projectOverViewConentItemBottom" v-if="bianGengIndex == -1"></div>
                    </div>
                    <div @click="bianGengIndex = 1">
                        <span :class="bianGengIndex == 1 ? 'color':''">项目信息变更</span>
                        <div class="projectOverViewConentItemBottom" v-if="bianGengIndex == 1"></div>
                    </div>
                    <div @click="bianGengIndex = 0">
                        <span :class="bianGengIndex == 0 ? 'color':''">负责人变更</span>
                        <div class="projectOverViewConentItemBottom" v-if="bianGengIndex == 0"></div>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"
                                    v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="operationName">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                    {{scope.row.operationName}}
                                </div>
                            </template>
                        </avue-crud>
                    </list-container>
                </div>
            </div>
        </el-row>
        <el-row :span="24" v-if="xinIndex == 7">
            <div class="stakeholderDiv">
                <div class="personnelDivHead">
                    <span>项目资料</span>
                    <div class="personnelDivHeadRight">
                        <div>
                            <input placeholder="请输入资料名关键字查询" v-model="listQuerys.dataName"/>
                            <i class="el-icon-search" @click="getList(page)"></i>
                        </div>
                        <el-button type="primary" @click="dataTypeBtn"  v-if="projectViewData.projectStatus == '3'? false:true">设置资料类型</el-button>
                        <el-upload class="upload" action="/api/manager/storage/create" :before-upload="beforeUpload"  v-if="projectViewData.projectStatus == '3'? false:true"
                                   style="width: auto;border: none;margin-left: 10px;"
                                   :on-remove="handleRemove" :show-file-list="false"
                                   :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList"
                                   :on-success="uploadCompleteds" :headers="headers">
                            <el-button type="primary" icon="el-icon-plus">
                                上传资料
                            </el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="personnelDivbody">
                    <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;"
                                    v-if="isShow">
                        <avue-crud ref="crud"
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
                                   :cell-style="handleCellStyle"
                                   @row-click="handleRowClick"
                                   @row-dblclick="handleRowDbClick">
                            <template slot-scope="scope" slot="crtUserName">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                    {{scope.row.crtUserName}}
                                </div>
                            </template>
                            <template slot-scope="scope" slot="opt">
                                <div style="display: flex;flex-direction: row;align-items: center;">
                                    <el-link v-if="projectViewData.projectStatus == '3'? false:true"  :underline="false"  style="color: #3E90FE;margin-right: 14px;cursor: pointer; font-size: 12px;"
                                       @click="shezhiBtn(scope.row)">设置类型
                                    </el-link>
                                    <a :underline="false"  style="color: #3E90FE;margin-right: 14px;cursor: pointer;font-size: 12px;"
                                       v-if="scope.row.url && (scope.row.url.indexOf('pdf')>-1 || scope.row.url.indexOf('jpg')>-1 || scope.row.url.indexOf('png')>-1)"
                                       :href="scope.row.url" target="_blank">下载</a>
                                    <a :underline="false" style="color: #3E90FE;margin-right: 14px;cursor: pointer;font-size: 12px;" v-else
                                       @click="handleAttachmentDownLoad(scope.row.url)">下载
                                    </a>
                                    <el-link v-if="projectViewData.projectStatus == '3'? false:true" :underline="false" tyle="color: #F86B67;cursor: pointer;font-size: 12px;"
                                       @click="handleDelete(scope.row.id)">删除</el-link>
                                </div>
                            </template>
                        </avue-crud>
                    </list-container>
                </div>
            </div>
        </el-row>
        <el-dialog :visible.sync="contractVisible" v-if="contractVisible" width="80%"
                   @close="handlenContractClose"
                   :close-on-click-modal="false"
                   :before-close="handlenContractClose" title="新建合同" append-to-body class="public-dialog insertBudgetDialog">
            <avue-form :option="insertContract" v-model="contractForm" ref="contractForm">
                <template slot-scope="scope" slot="items">
                    <avue-crud :option="itemsOption" :data="contractForm.items">
                        <template slot-scope="scope" slot="operate">
                            <div>
                                <i class="el-icon-plus" @click="handleAddRow()"
                                   style="margin-right: 15px;color:  #409EFF;"></i>
                                <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                   style="color:#E80000;"></i>
                            </div>
                        </template>
                        <template slot-scope="scope" slot="skuName">
                            <div @click="skuBtn(scope.row,scope.row.$index)">
                                <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly></el-input>
                            </div>
                        </template>
                        <template slot-scope="scope" slot="qty">
                            <div>
                                <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                          @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty',scope.row)"></el-input>
                            </div>
                        </template>
                        <template slot-scope="scope" slot="taxPrice">
                            <div>
                                <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                          @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"></el-input>
                            </div>
                        </template>
                    </avue-crud>
                </template>
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="contractVisible = false">取消</el-button>
                <el-button type="primary" v-loading="visible" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <!--新建支出-->
        <el-dialog :visible.sync="insertExpenditureVisible" v-if="insertExpenditureVisible" width="50%"
                   @close="handlenIsertExpenditureClose"
                   :close-on-click-modal="false"
                   :before-close="handlenIsertExpenditureClose" title="新建支出" append-to-body class="public-dialog insertBudgetDialog">
            <avue-form :option="insertExpenditure" v-model="insertForm" ref="insertForm" class="insertExpenditure">
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="insertExpenditureVisible = false">取消</el-button>
                <el-button type="primary" @click="insertExpenditureSubmit" v-loading="visible" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <!--添加干系人-->
        <el-dialog :visible.sync="insertStakeholderVisible" v-if="insertStakeholderVisible" width="30%"
                   @close="handleStakeholderClose"
                   :close-on-click-modal="false"
                   :before-close="handleStakeholderClose" :title="titleStakeholder" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="optionStakeholde" v-model="form" ref="form">
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="insertStakeholderVisible = false">取消</el-button>
                <el-button type="primary" @click="insertStakeholderBtn" v-loading="visible" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <!--自评进度-->
        <el-dialog :visible.sync="selfEvaluationVisible" v-if="selfEvaluationVisible" width="50%"
                   @close="handleSelfClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelfClose" title="自评进度" append-to-body class="public-dialog insertBudgetDialog">
            <div class="selfEvaluation">
                <div class="selfEvaluationItem">
                    <label>自评进度</label>
                    <div class="selfEvaluationItemRight selfEvaluationItemRights">
                        <div :class="index == 0? 'selfEvaluationItemRightColor':''" @click="index = 0">0%</div>
                        <div :class="index == 10? 'selfEvaluationItemRightColor':''" @click="index = 10">10%</div>
                        <div :class="index == 20? 'selfEvaluationItemRightColor':''" @click="index = 20">20%</div>
                        <div :class="index == 30? 'selfEvaluationItemRightColor':''" @click="index = 30">30%</div>
                        <div :class="index == 40? 'selfEvaluationItemRightColor':''" @click="index = 40">40%</div>
                        <div :class="index == 50? 'selfEvaluationItemRightColor':''" @click="index = 50">50%</div>
                        <div :class="index == 60? 'selfEvaluationItemRightColor':''" @click="index = 60">60%</div>
                        <div :class="index == 70? 'selfEvaluationItemRightColor':''" @click="index = 70">70%</div>
                        <div :class="index == 80? 'selfEvaluationItemRightColor':''" @click="index = 80">80%</div>
                        <div :class="index == 90? 'selfEvaluationItemRightColor':''" @click="index = 90">90%</div>
                        <div :class="index == 100? 'selfEvaluationItemRightColor':''" @click="index = 100"
                             style="width: 140px;">100%(完成)
                        </div>
                    </div>
                </div>
                <div class="selfEvaluationItem" style="margin-top: 10px;">
                    <label>进展描述</label>
                    <div class="selfEvaluationItemRight ">
                        <el-input style="width: 100%;margin-top: 10px;"
                                  type="textarea"
                                  :rows="2"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selfEvaluationVisible = false">取消</el-button>
                <el-button type="primary" v-loading="visible" @click="selfEvaluationBtn" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <!--添加分组-->
        <el-dialog :visible.sync="groupsIdVisible" v-if="groupsIdVisible" width="20%"
                   @close="handleGroupsIdClose"
                   :close-on-click-modal="false"
                   :before-close="handleGroupsIdClose" title="添加分组" append-to-body class="public-dialog insertBudgetDialog">
            <el-input v-model="groupsIdName" placeholder="请输入分组名称"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="groupsIdVisible = false">取消</el-button>
                <el-button type="primary" @click="addGroupBtn">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dataTypeVisible" v-if="dataTypeVisible" width="20%"
                   @close="handleTypeClose"
                   :close-on-click-modal="false"
                   :before-close="handleTypeClose" title="设置资料类型" append-to-body class="public-dialog insertBudgetDialog">
            <el-select v-model="dataType" style="width: 100%">
                <el-option
                        v-for="item in typeData"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dataTypeVisible = false">取消</el-button>
                <el-button type="primary" @click="dataTypesBtn" v-loading="visible" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="changeVisible" v-if="changeVisible" width="50%"
                   @close="handleChangeClose"
                   :close-on-click-modal="false"
                   :before-close="handleChangeClose" title="项目变更" append-to-body class="public-dialog insertBudgetDialog">
            <el-tabs v-model="activeName">
                <el-tab-pane label="项目变更" name="first">
                    <avue-form :option="insertChange" v-model="changeForm" ref="changeForm" class="insertExpenditure">
                    </avue-form>
                </el-tab-pane>
                <el-tab-pane label="变更内容" name="second">
                    <div class="secondChange">
                        <div class="secondChangeItem">
                            <div class="secondChangeItemLeft one">变更项</div>
                            <div class="secondChangeItemLeft">变更前</div>
                            <div class="secondChangeItemRight">变更后</div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">项目名称</div>
                            <div class="secondChangeItemLeft">{{projectViewData.projectName}}</div>
                            <div class="secondChangeItemRight">
                                <el-input v-model="changeForm.projectName" style="width: 220px;"/>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">项目阶段</div>
                            <div class="secondChangeItemLeft">
                                {{projectViewData.projectStage}}
                            </div>
                            <div class="secondChangeItemRight">
                                <el-select v-model="changeForm.projectStage" style="width: 220px;">
                                    <el-option v-for="item in stageList" :key="item.name" :label="item.name"
                                               :value="item.name">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">所属部门</div>
                            <div class="secondChangeItemLeft">{{projectViewData.departName}}</div>
                            <div class="secondChangeItemRight">
                                <el-input v-model="changeForm.departName" disabled style="width: 220px;"/>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">计划开始</div>
                            <div class="secondChangeItemLeft">{{projectViewData.startDate}}</div>
                            <div class="secondChangeItemRight">
                                <el-date-picker
                                        v-model="changeForm.startDate"  value-format="yyyy-MM-dd"
                                        type="date"
                                        placeholder="选择日期" @change="startBtn">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">计划结束</div>
                            <div class="secondChangeItemLeft">{{projectViewData.endDate}}</div>
                            <div class="secondChangeItemRight">
                                <el-date-picker  value-format="yyyy-MM-dd"
                                        v-model="changeForm.endDate" @change="startBtn"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one">计划工期</div>
                            <div class="secondChangeItemLeft">{{projectViewData.workTime}}</div>
                            <div class="secondChangeItemRight">{{changeForm.workTime}}</div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 1">
                            <div class="secondChangeItemLeft one two">项目说明</div>
                            <div class="secondChangeItemLeft two">{{projectViewData.workText}}</div>
                            <div class="secondChangeItemRight">
                                <el-input style="width: 220px;"
                                          type="textarea"
                                          :rows="2"
                                          placeholder="请输入内容"
                                          v-model="changeForm.workText">
                                </el-input>
                            </div>
                        </div>
                        <div class="secondChangeItem" v-if="changeForm.alterType == 0">
                            <div class="secondChangeItemLeft one two">项目负责人</div>
                            <div class="secondChangeItemLeft two">{{projectViewData.chargeName}}</div>
                            <div class="secondChangeItemRight">
                                <div @click="insertPersonnel">
                                    <el-input style="width: 220px;"
                                              placeholder="请选择项目负责人"
                                              v-model="changeForm.chargeName" readonly="">
                                    </el-input>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!--<el-upload-->
                            <!--v-if="changeForm.alterType == 0"-->
                            <!--class="upload-demo"-->
                            <!--:action="uploadPath"-->
                            <!--:on-remove="handleRemove"-->
                            <!--:before-remove="beforeRemove"-->
                            <!--multiple-->
                            <!--:headers="headers"-->
                            <!--:on-exceed="handleExceed"-->
                            <!--on-success="uploadCompleted"-->
                            <!--style="margin-top: 10px;"-->
                            <!--:file-list="fileList">-->
                        <!--<el-button type="primary" plain icon="el-icon-plus">添加附件</el-button>-->
                    <!--</el-upload>-->
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeVisible = false">取消</el-button>
                <el-button type="primary" v-loading="visible" @click="changeBtn" :disabled="visible">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="30%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" title="预算申请" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="filesVisible" v-if="filesVisible" width="30%"
                   @close="handleFilesClose"
                   :close-on-click-modal="false"
                   :before-close="handleFilesClose" title="查看附件" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-crud ref="selectCrud"  :data="bomList" :option="selectOption">
                <template slot-scope="scope" slot="value">
                    <div style="display: flex;flex-direction: row;align-items: center;">
                        <a :href="scope.row.value" target="_blank">{{scope.row.label}}</a>

                    </div>
                </template>
            </avue-crud>
        </el-dialog>
        <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                        :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                        @handleClose="handleClosePublic"
                        @handleSubmit="handleSubmitPublic"></pubil-selector>
    </bill-container>
</template>

<script>
    import {
        projectSelect,
        batchBudget,
        putBudget,
        addBudget,
        listbBdget,
        sumPay,
        alterList,
        batchData,
        putData,
        addData,
        listData,
        batchDelGroup,
        addAlter,
        select,
        findGroup,
        findStaff,
        batchDelBill,
        stakeList,
        addStake,
        batchDelStake,
        addStaffs,
        addGroup,
        stakeSelect,
        putStake,
        addPay,
        groupPay,
        payList,
        addSpeed,
        alterLis,
        updateStatus,
        auditList
    } from '@/api/erp/project_management/projectOverview';
    import {userOption, commodityOption} from '@/util/table';
    import {uploadPath,downloadPath} from '@/api/erp/goods/storage'
    import {pageAll} from '@/api/erp/financial/projectStage';

    export default {
        name: "project_view",
        props: ['id', 'type', 'timeStamp'],
        components: {
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                bomList:[],
                selectOption: {
                    height: '350',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: false,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: [
                        {
                            label: "附件名称",
                            prop: "value",
                            minWidth: 180,
                            align: 'left',
                            slot: true
                        },
                    ]
                },
                filesVisible:false,
                userInfo:{},
                invisible: false,
                budgetForm: {},
                budgetVisible: false,
                sumPayData: {sumAmount: '', count: ''},
                statusOptions: [
                    {
                        value: '0',
                        label: '未启动'
                    },
                    {
                        value: '1',
                        label: '进行中'
                    },
                    {
                        value: '2',
                        label: '已暂停'
                    },
                    {
                        value: '3',
                        label: '已完成'
                    }
                ],
                typeData: [
                    {
                        value: '说明',
                        label: '说明'
                    },
                    {
                        value: '项目规范',
                        label: '项目规范'
                    },
                    {
                        value: '项目手册',
                        label: '项目手册'
                    }
                ],
                dataType: undefined,
                stageList: [],
                activeName: 'first',
                changeForm: {},
                changeVisible: false,
                textarea: '',
                index: -1,
                contractVisible: false,
                visible: false,
                titleStakeholder: undefined,
                groupsIdVisible: false,
                groupsIdName: undefined,
                dataTypeVisible: false,
                headers: undefined,
                fileList: [],
                uploadPath,
                insertExpenditureVisible: false,
                insertStakeholderVisible: false,
                bianGengIndex: -1,
                shenPiIndex: 0,
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                isSingle: true,
                option: [],
                projectZhiIndex: 0,
                personneIndex: 0,
                isShow: false,
                xinIndex: 0,
                selfEvaluationVisible: false,
                personneData: [],
                xinData: [
                    {
                        title: '综合信息',
                        img: 'http://hejigy.com.cn/zh.png',
                        imgUrl: 'http://hejigy.com.cn/zhxz.png'
                    },
                    {
                        title: '人员',
                        img: 'http://hejigy.com.cn/ry.png',
                        imgUrl: 'http://hejigy.com.cn/ryxz.png'
                    },
                    {
                        title: '干系人',
                        img: 'http://hejigy.com.cn/gxr.png',
                        imgUrl: 'http://hejigy.com.cn/gxrxz.png'
                    },
                    {
                        title: '支出',
                        img: 'http://hejigy.com.cn/zc.png',
                        imgUrl: 'http://hejigy.com.cn/zcxz.png'
                    },
                    {
                        title: '审批',
                        img: 'http://hejigy.com.cn/sp.png',
                        imgUrl: 'http://hejigy.com.cn/spxz.png'
                    },
                    {
                        title: '预算',
                        img: 'http://hejigy.com.cn/ys.png',
                        imgUrl: 'http://hejigy.com.cn/ysxz.png'
                    },
                    {
                        title: '变更',
                        img: 'http://hejigy.com.cn/bg1.png',
                        imgUrl: 'http://hejigy.com.cn/bg1xz.png'
                    },
                    {
                        title: '资料',
                        img: 'http://hejigy.com.cn/zl.png',
                        imgUrl: 'http://hejigy.com.cn/zlxz.png'
                    },
                ],
                progressData: [
                    {
                        title: '时间进度',
                        value: 19
                    },
                    {
                        title: '支出比例',
                        value: 19
                    },
                    {
                        title: '自评进度',
                        value: 19
                    },
                ],
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                themeColor: 'wonderland',
                echartsData: {
                    "categories": [
                        "北京",
                        "上海",
                        "杭州",
                        "深圳",
                        "杭州",
                        "深圳",
                        "广州",
                        "连云港"
                    ],
                    "series": [
                        {
                            "name": "单位:元",
                            "data": [
                                1131776,
                                1349011,
                                905718,
                                1349011,
                                905718,
                                656020,
                                571234,
                                467397
                            ]
                        }
                    ]
                },
                configOption: {
                    switchTheme: false,
                    refreshTime: 5000,
                    titlePostion: '',
                    titleFontSize: 24,
                    titleColor: 'rgb(115, 170, 229)',
                    gridX: 105,
                    gridY: 50,
                    gridX2: 80,
                    gridY2: 100,
                    nameColor: '#333',
                    lineColor: '#333',
                    xNameFontSize: 12,
                    yNameFontSize: 12,
                    labelShow: false,
                    labelShowFontSize: 12,
                    labelShowFontWeight: 300,
                    yAxisInverse: false,
                    xAxisInverse: false,
                    xAxisShow: true,
                    yAxisShow: true,
                    xAxisSplitLineShow: false,
                    yAxisSplitLineShow: false,
                    refresh: 3000,
                    barWidth: 30,
                    barRadius: 2,
                    barColor: [
                        {
                            color1: '#23B7E5',
                            postion: 50
                        }],
                    barMinHeight: 2,
                },
                loading: false,
                tableOption: {
                    height: 'auto',
                    calcHeight: 250,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "costPrice",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                listQuerys: {},
                billColumnOne: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "姓名",
                        prop: "userName",
                        width: 80,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "部门",
                        prop: "departName",
                        minWidth: 190,
                        align: 'left',
                    },
                    {
                        label: "电话",
                        prop: "phone",
                        minWidth: 120,
                        align: 'left',
                    },
                    // {
                    //     label: "邮箱",
                    //     prop: "email",
                    //     minWidth: 120,
                    //     align: 'left',
                    // },
                    {
                        label: "所属分组",
                        prop: "groupName",
                        minWidth: 100,
                        align: 'left',
                    },
                ],
                billColumnTwo: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "姓名",
                        prop: "stakeName",
                        width: 190,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "干系人角色",
                        prop: "departName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "电话",
                        prop: "phone",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "跟进人",
                        prop: "followName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "添加日期",
                        prop: "crtTime",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 120,
                        align: 'center',
                        slot: true
                    },
                ],
                billColumnTree: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "支出申请人",
                        prop: "applyName",
                        width: 120,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "申请日期",
                        prop: "crtTime",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "支出类型",
                        prop: "payType",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "支出金额",
                        prop: "payAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#F0A52F",
                    },
                    {
                        label: "支出日期",
                        prop: "payDate",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "支出原因",
                        prop: "applyText",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "附件",
                        prop: "files",
                        minWidth: 320,
                        overHidden:true,
                        align: 'left',
                        slot: true
                    },
                ],
                billColumnFour: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "申请类型",
                        prop: "auditType",
                        width: 520,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: '3',
                                label: '项目启停'
                            },
                            {
                                value: '4',
                                label: '项目支出'
                            },
                            {
                                value: '5',
                                label: '项目变更'
                            },
                        ]
                    },
                    {
                        label: "操作人",
                        prop: "operatorName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "状态",
                        prop: "auditStatus",
                        minWidth: 120,
                        align: 'left',
                        type: 'select',
                        slot: true,
                    },

                    {
                        label: "添加日期",
                        prop: "crtTime",
                        minWidth: 140,
                        align: 'left',
                    },
                ],
                billColumnFive: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "预算名称",
                        prop: "budgetName",
                        width: 190,
                        align: 'left',
                    },
                    {
                        label: "状态",
                        prop: "status",
                        minWidth: 120,
                        align: 'left',
                        type: 'select',
                        slot: true,
                        dicData: [
                            {
                                value: '0',
                                label: '正常'
                            },
                            {
                                value: '1',
                                label: '作废'
                            },
                        ]
                    },
                    {
                        label: "预算金额",
                        prop: "amount",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "预算描述",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "申请时间",
                        prop: "applyDate",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 120,
                        align: 'left',
                        slot: true
                    },
                ],
                billColumnSix: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "操作人",
                        prop: "operationName",
                        width: 520,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "操作日期",
                        prop: "updTime",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "变更类型",
                        prop: "alterType",
                        minWidth: 120,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: 0,
                                label: '负责人'
                            },
                            {
                                value: 1,
                                label: '项目信息'
                            }
                        ]
                    },
                ],
                billColumnSeven: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "资料名称",
                        prop: "dataName",
                        width: 220,
                        align: 'left',
                    },
                    {
                        label: "类型",
                        prop: "dataType",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "大小(KB)",
                        prop: "dataSize",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "上传人",
                        prop: "crtUserName",
                        minWidth: 120,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "上传时间",
                        prop: "crtTime",
                        minWidth: 150,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 150,
                        align: 'left',
                        slot: true
                    },
                ],
                projectViewData: {},
                insertForm: {},
                form: {},
                projectData: {},
                optionStakeholde: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "名称",
                            prop: "stakeName",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "干系人角色",
                            prop: "departName",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入干系人角色",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "电话",
                            prop: "phone",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入电话",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "跟进人",
                            prop: "followName",
                            span: 24,
                            type: 'search',
                            readonly: true,
                            appendClick: () => {
                                this.insertPersonnel();
                            },
                            rules: [{
                                required: true,
                                message: "请输入跟进人",
                                trigger: "change"
                            }],
                        },
                    ]
                },
                insertExpenditure: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "支出类型",
                            prop: "payType",
                            span: 12,
                            type: 'select',
                            dicUrl: '/api/manager/register-type/pageAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            rules: [{
                                required: true,
                                message: "请选择支出类型",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "支出金额",
                            prop: "payAmount",
                            span: 12,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入支出金额",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "支出日期",
                            prop: "payDate",
                            span: 12,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "申请人",
                            prop: "applyName",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入申请人",
                                trigger: "change"
                            }],
                            type: 'search',
                            readonly: true,
                            appendClick: () => {
                                this.insertPersonnel();
                            },
                        },
                        {
                            label: "支出原因",
                            prop: "applyText",
                            span: 24,
                            type: 'textarea',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            span: 24,
                            type: 'textarea',
                        },
                        {
                            label: '附件上传',
                            prop: 'files',
                            type: 'upload',
                            loadText: '附件上传中，请稍等',
                            span: 24,
                            propsHttp: {
                                res: 'data'
                            },
                            action: uploadPath
                        },
                    ]
                },
                insertContract: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "合同编号",
                            prop: "payType",
                            span: 12,
                            type: 'text',
                        },
                        {
                            label: "合同名称",
                            prop: "payAmount",
                            span: 12,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入合同名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "客户名称",
                            prop: "applyName",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请选择客户",
                                trigger: "change"
                            }],
                            type: 'search',
                            readonly: true,
                            appendClick: () => {
                                this.insertPersonnel();
                            },
                        },
                        {
                            label: "业务员",
                            prop: "applyName",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请选择业务员",
                                trigger: "change"
                            }],
                            type: 'search',
                            readonly: true,
                            appendClick: () => {
                                this.insertPersonnel();
                            },
                        },
                        {
                            label: "合同金额",
                            prop: "payAmount",
                            span: 12,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入合同金额",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "签约日期",
                            prop: "payDate",
                            span: 12,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "生效日期",
                            prop: "payDate",
                            span: 12,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "到期日期",
                            prop: "payDate",
                            span: 12,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "客户行业",
                            prop: "payAmount",
                            span: 12,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入客户行业",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "项目名称",
                            prop: "payAmount",
                            span: 12,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入项目名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "备注",
                            prop: "note",
                            span: 24,
                            type: 'textarea',
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            minRows: 10,
                            formslot: true
                        },
                    ]
                },
                itemsOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    height: 100,
                    columnBtn: false,
                    addBtn: false,
                    refreshBtn: false,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 80,
                            slot: true,
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            align: 'left',
                            minWidth: 130,
                            slot: true,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 100,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 100,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 130,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 130,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 120,
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
                            label: "单价",
                            prop: "price",
                            width: 120,
                            align: 'right',
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

                    ]
                },
                insertChange: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "变更类型",
                            prop: "alterType",
                            span: 24,
                            type: 'select',
                            dicData: [
                                {
                                    value: 1,
                                    label: '项目信息变更',
                                },
                                {
                                    value: 0,
                                    label: '负责人变更',
                                }
                            ]
                        },
                        {
                            label: "项目",
                            prop: "projectName",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入项目",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "操作人",
                            prop: "operationName",
                            span: 24,
                            type: 'text',
                            readonly: true,
                        },
                        {
                            label: "变更说明",
                            prop: "note",
                            span: 24,
                            type: 'textarea',
                        },
                    ]
                },
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "项目预算",
                            prop: "budgetName",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入项目预算",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "预算金额",
                            prop: "amount",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入预算金额",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "描述",
                            prop: "note",
                            span: 24,
                            type: 'textarea',
                        },
                    ]
                },
            }
        },
        watch: {
            bianGengIndex(){
                this.getList(this.page, this.listQuery);
            },
            shenPiIndex(){
                this.getList(this.page, this.listQuery);
            },
            budgetVisible() {
                // this.vueSet(this, 'budgetForm', {});
            },
            changeVisible() {
                this.changeForm.alterType = 1;
                let list = JSON.parse(JSON.stringify(this.projectViewData));
                console.log(list)
                this.changeForm.projectBillId = list.id;
                this.changeForm.chargeName = list.chargeName;
                this.changeForm.startDate = list.startDate;
                this.changeForm.endDate = list.endDate;
                this.changeForm.workText = list.workText;
                this.changeForm.workTime = list.workTime;
                this.changeForm.departName = list.departName;
                this.changeForm.projectStage = list.projectStage;
                this.changeForm.projectName = list.projectName;
                this.changeForm.operationId = this.$store.getters.userInfo.id;
                this.changeForm.operationCode = this.$store.getters.userInfo.no;
                this.changeForm.operationName = this.$store.getters.userInfo.name;
            },
            selfEvaluationVisible() {
                if (this.selfEvaluationVisible) {
                    this.textarea = '';
                    this.index = -1;
                }
            },
            xinIndex(val) {
                this.isShow = false;
                this.listQuerys.userName = '';
                this.listQuerys.stakeName = '';
                this.listQuery.dataName = '';
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    if (this.xinIndex == 0) {
                        select(this.id).then(res => {
                            this.projectViewData = res.data.data;
                            let now = new Date();
                            let year = now.getFullYear();
                            let month = now.getMonth() + 1;
                            let day = now.getDate();

                            this.progressData[2].value = Number(this.projectViewData.speed).toFixed(0);
                            let sumOne = this.getDaysBetween(this.projectViewData.startDate,year + '-' + month + '-' + day);
                            let sumTwo =  ((sumOne * 1)/(this.projectViewData.workTime * 1))*100;
                            this.projectViewData.dataTime = Number((sumTwo).toFixed(0));
                            this.progressData[0].value = Number(this.projectViewData.dataTime).toFixed(0) < 0 ? 0: Number(this.projectViewData.dataTime).toFixed(0);

                            projectSelect(this.id).then(res => {
                                res.data.data.sumBudgetsAmount = res.data.data.sumBudgetsAmount.toFixed(2);
                                res.data.data.sumPayAmount = res.data.data.sumPayAmount.toFixed(2);
                                this.projectData = res.data.data;
                                this.progressData[1].value = Number(this.projectData.scale).toFixed(0);
                                pageAll().then(res => {
                                    this.stageList = res.data.data;
                                })
                            })

                        }).catch(() => {
                            this.loading = false;
                        });


                    }
                    if (this.xinIndex == 1) {
                        this.personneIndex = 0;
                        findGroup(this.id).then(res => {
                            this.personneData = res.data.data;
                            this.getList(this.page, this.listQuery);
                        })
                        this.tableOption.column = this.billColumnOne;
                    } else if (this.xinIndex == 2) {
                        this.getList(this.page, this.listQuery);
                        this.tableOption.column = this.billColumnTwo;
                    } else if (this.xinIndex == 3) {
                        sumPay(this.id).then(res => {
                            this.sumPayData = res.data.data[0];
                        })
                        groupPay(this.id).then(res => {
                            let titleData = [];
                            let conentData = [];
                            for (let i in res.data.data) {
                                titleData.push(res.data.data[i].payType);
                                conentData.push(res.data.data[i].sumAmount);
                            }
                            this.echartsData.categories = titleData;
                            this.echartsData.series[0].data = conentData;
                            this.getList(this.page, this.listQuery);
                        })

                        this.tableOption.column = this.billColumnTree;
                    } else if (this.xinIndex == 4) {
                        this.getList(this.page, this.listQuery);
                        this.tableOption.column = this.billColumnFour;
                    } else if (this.xinIndex == 5) {
                        this.getList(this.page, this.listQuery);
                        this.tableOption.column = this.billColumnFive;
                    } else if (this.xinIndex == 6) {
                        this.getList(this.page, this.listQuery);
                        this.tableOption.column = this.billColumnSix;
                    }else if (this.xinIndex == 7) {
                        this.getList(this.page, this.listQuery);
                        this.tableOption.column = this.billColumnSeven;
                    }

                    this.vueSet(this.tableOption, 'column', this.tableOption.column);
                    this.isShow = true;
                });
            }
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
            this.userInfo = this.$store.getters.userInfo;
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            };
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 540);
            };
            this.getLists();
            this.tableOption.column = this.billColumnOne;
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 540);
        },
        methods: {
            handleFilesClose(){
                this.filesVisible = false;
            },
            fillesBtn(data){
                this.bomList = data.files;
                this.filesVisible = true;
            },
            budgetBtns(){
                this.budgetVisible = true;
                this.budgetForm ={};
            },
            handleUpadate(item) {
                if(this.projectViewData.projectStatus != '3'){
                    let data = JSON.parse(JSON.stringify(item));
                    data.status = 1;
                    putBudget(data).then(res => {
                        if (res.data.code == '2000') {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.getList(this.page);
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.msg
                            });
                        }
                    }).catch(() => {
                    })
                }else{
                    this.vueMessage('warning','项目已完成，不能操作');
                }
            },
            budgetsBtn(item) {
                if(this.projectViewData.projectStatus != '3'){
                    this.budgetVisible = true;
                    this.vueSet(this, 'budgetForm', item);
                    this.budgetForm = item;
                }else{
                    this.vueMessage('warning','项目已完成，不能操作');
                }

            },
            budgetBtn(type) {
                this.$refs['budgetForm'].validate((valid) => {
                    if (valid) {
                        if (type) {
                            this.invisible = true;
                        } else {
                            this.visible = true;
                        }
                        let select = this.budgetForm.id ? putBudget : addBudget;
                        this.budgetForm.projectBillId = this.id;
                        select(this.budgetForm).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$refs.budgetForm ? this.$refs.budgetForm.resetForm() : '';
                                this.$nextTick(() => {
                                    this.$refs.budgetForm ? this.$refs.budgetForm.clearValidate() : '';
                                })
                                this.budgetForm = {};
                                this.vueSet(this, 'budgetForm', {});
                                this.getList(this.page);
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        }).catch(() => {
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        })
                    }
                })

            },
            clocseCurrents() {
                this.clocseCurrent(this, this.$route);
                this.$router.push({
                    path: '/project_list',
                    name: '项目列表',
                    meta: {
                        i18n: 'project_list'
                    },
                    query: {
                        timeStamp: new Date().getTime()
                    },
                });
            },
            updateStausBtn(sum,flag) {
                updateStatus(sum, this.id,this.projectViewData.projectName,flag).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message:res.data.msg
                        });
                        this.getLists();
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                })
            },
            shezhiBtn(data) {
                if(this.projectViewData.projectStatus != '3'){
                    this.selectedRows = [data];
                    this.dataType = data.dataType;
                    this.dataTypeVisible = true;
                }else{
                    this.vueMessage('warning','项目已完成，不能操作');
                }

            },
            handleDelete(id) {
                if(this.projectViewData.projectStatus != '3'){
                    let select;
                    if (this.xinIndex == 7) {
                        select = batchData;
                    } else {
                        select = batchBudget;
                    }
                    select([id]).then(res => {
                        if (res.data.code == '2000') {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.getList(this.page, this.listQuery);
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.msg
                            });
                        }
                    })
                }else{
                    this.vueMessage('warning','项目已完成，不能操作');
                }
            },
            handleAttachmentDownLoad(url) {
                console.log(url)
                const ele = document.createElement('a');
                ele.setAttribute('href', downloadPath(url)); // 设置下载文件的url地址
                ele.click();
            },
            dataTypesBtn() {
                if (this.dataType != undefined && this.dataType != '') {
                    this.visible = true;
                    for(let i in this.selectedRows){
                        this.selectedRows[i].dataType = this.dataType;
                    }
                    putData(this.selectedRows).then(res => {
                        if (res.data.code == '2000') {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.dataType == undefined;
                            this.dataTypeVisible = false;
                            this.visible = false;
                            this.getList(this.page, this.listQuery);
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.msg
                            });
                        }
                    }).catch(() => {
                        this.visible = false;
                    })
                }
            },
            delectGroupBtn(id) {
                batchDelGroup(id).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        findGroup(this.id).then(res => {
                            this.personneData = res.data.data;
                            this.personneIndex = 0;
                            this.getList(this.page, this.listQuery);
                        })
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }

                })
            },
            changeBtn() {
                if (this.changeForm.projectName == '' || this.changeForm.projectName == undefined) {
                    return
                }
                let data=JSON.parse(JSON.stringify(this.changeForm));
                data.manageDTO = JSON.parse(JSON.stringify(this.changeForm));
                data.projectBillId = this.id;
                addAlter(data).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.changeVisible = false;
                        this.changeForm = {};
                        this.getList(this.page);

                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                    this.visible = false;
                })
            },
            startBtn() {
                if (this.changeForm.startDate != '' && this.changeForm.startDate != undefined && this.changeForm.endDate != '' && this.changeForm.endDate != undefined) {
                    let sum = this.getDaysBetween(this.changeForm.startDate, this.changeForm.endDate);
                    if (sum < 1) {
                        this.vueMessage('warning', '计划完工日期不能大与计划开工日期!');
                        return
                        this.changeForm.endDate = '';
                    } else {
                        this.changeForm.workTime = sum.toFixed(0);
                    }

                }

            },
            getDaysBetween(dateString1, dateString2) {
                var startDate = Date.parse(dateString1);
                var endDate = Date.parse(dateString2);
                var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
                // alert(days);
                return days;
            },
            selfEvaluationBtn() {
                this.visible = true;
                addSpeed({
                    speed: this.index,
                    text: this.textarea,
                    projectBillId: this.id
                }).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.visible = false;
                        this.selfEvaluationVisible = false;
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                    this.visible = false;

                }).catch(() => {
                    this.visible = false;
                })
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.contractForm.items.splice(index, 1);
            },
            skuBtn(item, index, type) {
                this.isSingle = false;
                this.publicTitle = '请选择商品';
                this.typeName = 'commodityType';
                this.option = commodityOption;
                this.publicVisible = true;
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                }
                this.contractForm.items.push(d);
            },
            selectId(item) {
                stakeSelect(item.id).then(res => {
                    this.form = res.data.data;
                    this.titleStakeholder = '编辑干系人';
                    this.insertStakeholderVisible = true;
                })
            },
            addGroupBtn() {
                addGroup({
                    name: this.groupsIdName,
                    projectBillId: this.id
                }).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        findGroup(this.id).then(res => {
                            this.personneData = res.data.data;
                            this.getList(this.page, this.listQuery);
                        })
                        this.groupsIdVisible = false;
                        this.groupsIdName = '';
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }

                })
            },
            insertStakeholderBtn() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.visible = true;
                        let select = this.form.id ? putStake : addStake;
                        this.form.projectBillId = this.id;
                        select(this.form).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getList(this.page);
                                this.insertStakeholderVisible = false;
                                this.form = {};
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                            this.visible = false;
                        }).catch(() => {
                            this.visible = false;
                        })
                    }
                })
            },
            dataTypeBtn() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                this.dataTypeVisible = true;
            },
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeUpload(file) {
            },
            uploadCompleted(response, file, fileList) {
                this.changeForm.file = response.data.url;
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
            uploadCompleteds(response, file, fileList) {
                let data = {
                    dataName: response.data.name,
                    dataSize: response.data.size,
                    url: response.data.url,
                    crtUserId: this.$store.getters.userInfo.id,
                    crtUserName: this.$store.getters.userInfo.name,
                    projectBillId: this.id,
                    departId: this.projectViewData.departId
                }
                addData(data).then(res => {
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.getList(this.page);
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                })
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            handleEdit(data) {
                if (data == '支出') {
                    this.insertExpenditureBtn();
                }
                if (data == '合同') {
                    this.$router.push({
                        path: '/project_view_add',
                        name: '项目合同制单',
                        query: {
                            type: 'add' + new Date().getTime(),
                            taskType: this.projectViewData,
                            step:this.id
                        },
                        meta: {
                            i18n: 'project_view_add'
                        }
                    });
                }
            },
            insertExpenditureBtn() {
                this.insertForm.payDate = new Date().toLocaleDateString().replace(/\//g, '-');
                this.insertForm.applyId = this.$store.getters.userInfo.id;
                this.insertForm.applyCode = this.$store.getters.userInfo.no;
                this.insertForm.applyName = this.$store.getters.userInfo.name;
                this.insertForm.projectBillId = this.id;
                this.insertExpenditureVisible = true;
            },
            insertStakeholder() {
                this.titleStakeholder = '添加干系人';
                this.form = {};
                this.insertStakeholderVisible = true;
            },
            insertGroups() {
                this.groupsIdVisible = true;
            },
            insertPersonnel() {
                this.isSingle = true;
                this.publicTitle = '请选择业务员';
                this.typeName = 'userType';
                this.option = userOption;
                this.publicVisible = true;
            },
            insertExpenditureSubmit() {
                this.$refs['insertForm'].validate((valid) => {
                    if (valid) {
                        this.visible = true;
                        let select = this.insertForm.id ? addPay : addPay;
                        select(this.insertForm).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.insertExpenditureVisible = false;
                                this.insertForm = {};
                                this.getList(this.page);

                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                            this.visible = false;
                        }).catch(() => {
                            this.visible = false;
                        })
                    }
                })
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    this.$refs.publicSelector.selectionClear();
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.contractForm.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skuName = item.goodsName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.seriesName = item.seriesName;
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = 1;
                            itemObj.price = item.retailPrice;
                            this.contractForm.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.contractForm.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.contractForm.items)));
                        });
                    } else {
                        if (this.changeVisible) {
                            this.changeForm.chargeId = list[0].id;
                            this.changeForm.chargeCode = list[0].no;
                            this.changeForm.chargeName = list[0].name;
                            var depart = list[0].departId;
                            this.changeForm.departName = depart.indexOf('{') > -1 ? JSON.parse(depart).name : depart;
                            console.log(this.changeForm)
                        } else if (this.insertStakeholderVisible) {
                            this.form.followId = list[0].id;
                            this.form.followCode = list[0].no;
                            this.form.followName = list[0].name;
                        } else if (this.insertExpenditureVisible) {
                            this.insertForm.applyId = list[0].id;
                            this.insertForm.applyCode = list[0].no;
                            this.insertForm.applyName = list[0].name;

                        } else {
                            addStaffs({
                                groupId: this.personneData[this.personneIndex].id,
                                userId: list[0].id,
                                userCode: list[0].no,
                                userName: list[0].name,
                                chargeType: 1,
                                departId: JSON.parse(list[0].departId).id,
                                departName: JSON.parse(list[0].departId).name,
                                groupName: this.personneData[this.personneIndex].name,
                                email: list[0].email,
                                phone: list[0].mobilePhone,
                                projectBillId: this.id
                            }).then(res => {
                                console.log(res)
                                if (res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.getList(this.page);
                                    this.publicVisible = false;
                                    this.form = {}
                                } else {
                                    this.$message({
                                        type: "warning",
                                        message: res.data.msg
                                    });
                                }
                            })
                        }
                    }
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            //删除方法
            handleRowDelete(type) {
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
                    this.$confirm('您正在执行移出项目操作, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let del = type == 1 ? batchDelBill : batchDelStake;
                        del(ids).then((res) => {
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getList(this.page);

                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                        });
                    });
                }
            },
            personneBtn(index) {
                this.personneIndex = index;
                this.getList(this.page, this.listQuery);
            },
            reload() {
                this.loading = true;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.getLists();
                        this.getList(this.page);
                        this.isShow = true;
                    })
                }, 17)
            },
            getLists() {
                projectSelect(this.id).then(res => {
                    res.data.data.sumBudgetsAmount = res.data.data.sumBudgetsAmount.toFixed(2);
                    res.data.data.sumPayAmount = res.data.data.sumPayAmount.toFixed(2);
                    this.projectData = res.data.data;
                    this.progressData[1].value = Number(this.projectData.scale).toFixed(0);
                    select(this.id).then(re => {
                        pageAll().then(r => {
                            console.log(1)
                            this.stageList = r.data.data;
                        })
                        this.projectViewData = re.data.data;
                        let now = new Date();
                        let year = now.getFullYear();
                        let month = now.getMonth() + 1;
                        let day = now.getDate();
                        this.progressData[2].value = Number(this.projectViewData.speed).toFixed(0);
                        let sumOne = this.getDaysBetween(this.projectViewData.startDate,year + '-' + month + '-' + day);
                        let sumTwo =   ((sumOne * 1)/(this.projectViewData.workTime * 1))*100;
                        this.projectViewData.dataTime = Number((sumTwo).toFixed(0)) < 0 ? 0 :Number((sumTwo).toFixed(0));
                        this.progressData[0].value = Number(this.projectViewData.dataTime).toFixed(0);


                    }).catch(() => {
                        this.loading = false;
                    });
                })

            },
            handleBudgetClose() {
                this.budgetVisible = false;
            },
            handleGroupsIdClose() {
                this.groupsIdName = undefined;
                this.groupsIdVisible = false;
            },
            handleTypeClose() {
                this.dataTypeVisible = false;
            },
            handleSelfClose() {
                this.selfEvaluationVisible = false;
            },
            handleChangeClose() {
                this.changeVisible = false;
            },
            handleStakeholderClose() {
                this.form = {};
                this.insertStakeholderVisible = false;
            },
            handlenIsertExpenditureClose() {
                this.insertForm = {};
                this.insertExpenditureVisible = false;
            },
            handlenContractClose() {
                this.contractForm = {};
                this.contractVisible = false;
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                this.isShow = false;
                let queryObj;
                let select;
                if (this.xinIndex == 1) {
                    select = findStaff;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: this.selectType,
                        id: this.personneData[this.personneIndex].id,
                        projectBillId: this.id
                    });
                }
                if (this.xinIndex == 2) {
                    select = stakeList;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        projectBillId: this.id,
                    });
                }
                if (this.xinIndex == 3) {
                    select = payList;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        projectBillId: this.id,
                    });
                }
                if (this.xinIndex == 4) {
                    select = auditList;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        selectType: this.shenPiIndex,
                        projectBillId: this.id
                    });
                }

                if (this.xinIndex == 5) {
                    select = listbBdget;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        projectBillId: this.id
                    });
                }
                if (this.xinIndex == 6) {
                    select = alterList;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        alterType:this.bianGengIndex > -1 ? this.bianGengIndex:'',
                        projectBillId: this.id
                    });
                }
                if (this.xinIndex == 7) {
                    select = listData;
                    queryObj = Object.assign(params, this.listQuery, this.listQuerys, {
                        page: page.currentPage,
                        limit: page.pageSize,
                        projectBillId: this.id
                    });
                }
                if (this.xinIndex > 0) {
                    queryObj = JSON.parse(JSON.stringify(queryObj));
                }
                this.loading = false;
                if (this.xinIndex > 0 && this.xinIndex < 8) {
                    select(queryObj).then(res => {
                        const data = res.data.data;
                        this.page.total = data.total;
                        this.list = data.records;

                        this.loading = false;
                        this.isShow = true;
                        this.handleSelectionClear();
                    }).catch(() => {
                        this.loading = false;
                        this.isShow = true;
                    });
                }
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
                if (selection.length > 0) {
                    this.controlButtonShow(selection[selection.length - 1], this);
                }
                this.selectedRows = selection;
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            //搜索
            handleSearchChange(params) {
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
            //行点击事件
            handleRowClick(row, event, column) {
                // this.controlButtonShow(row, this);
                // this.$refs.crud.toggleSelection([row]);

            },
            //双击查看
            handleRowDbClick(row) {
            },
        }
    }
</script>
<style lang="scss">
    .insertExpenditure .el-form .el-row .el-col {
        margin-bottom: 0px;
    }
</style>
<style lang="scss" scoped>
    .projectView {
        display: flex;
        flex-direction: column;
        padding: 10px 39px;
        .projectViewTop {
            border-radius: 2px;
            background: white;
            display: flex;
            flex-direction: column;
            .projectViewTopOpt {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background: rgba(247, 247, 249, 1);
                .el-icon-arrow-left {
                    font-size: 26px;
                    color: #B3B4B4;
                }
                div {
                    display: flex;
                    flex-direction: row;
                }
            }
            .projectViewTopXinXin {
                display: flex;
                flex-direction: column;
                .projectViewTopXinXinTop {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 21px 30px;
                    .projectViewTopXinXinTopConent {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        div {
                            display: flex;
                            flex-direction: column;
                            margin-left: 12px;
                            span {
                                font-size: 14px;
                            }
                            span:last-child {
                                font-size: 22px;
                            }
                        }
                    }
                }
                .projectViewTopXinXinCenter {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin: 0px 10px 20px 120px;

                    .projectViewTopXinXinCenterRight, .projectViewTopXinXinCenterLeft {
                        display: flex;
                        flex-direction: column;
                        span {
                            line-height: 30px;
                            font-size: 14px;
                        }
                    }
                    .projectViewTopXinXinCenterLeft {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-right: 10rem;
                        div {
                            display: flex;
                            flex-direction: column;
                        }
                    }
                }
                .projectViewTopXinXinItem {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    position: relative;
                    height: 71px;
                    div {
                        position: relative;
                        img {
                            width: 20px;
                            height: 20px;
                        }
                        height: 71px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 0px 30px;
                        cursor: pointer;
                        font-size: 14px;
                        span {
                            margin-top: 6px;
                        }
                        .color {
                            color: #409EFF;
                        }
                        .projectOverViewConentItemBottom {
                            position: absolute;
                            bottom: 0px;
                            height: 2px;
                            background: #409EFF;
                        }
                    }

                }
            }
            .projectViewTopOptBorder {
                border-top: 1px solid #EBEEF5;
            }
        }
        .progressView {
            display: flex;
            flex-direction: row;
            align-items: center;
            background: white;
            border-radius: 2px;
            margin: 14px 0px;
            padding: 30px;
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 30px;
                cursor: pointer;
                span {
                    font-size: 14px;
                    margin-top: 16px;
                    text-align: center;
                    display: inline-block;
                    margin-left: -26px;
                }
            }
        }
        .projectViewSelect {
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 6px;
            margin-bottom: 14px;
            .projectViewXianMuTitle {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0px 20px;
                height: 48px;
                border-bottom: 1px solid #EBEEF5;
                font-size: 14px;
                .el-icon-arrow-down {
                    margin-right: 10px;
                }
            }
            .projectViewXianMuConent {
                display: flex;
                flex-direction: column;
                font-size: 14px;
                margin: 16px 20px;
                .projectViewXianMuConentRight {
                    width: 100%;
                    background: #F7F7F9;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    height: 80px;
                    div:first-child {
                        margin-right: 60px;
                    }
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        span:first-child {
                            font-size: 14px;
                            color: #9B9B9B;
                            margin-bottom: 10px;
                        }
                        span {
                            font-size: 18px;
                        }

                    }
                }
                .projectViewXianMuConentItem {
                    line-height: 30px;
                }
                .projectViewXianMuConentCol {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .projectViewXianMuConentColColor {
                        color: #999999;
                    }
                    span {
                        display: inline-block;
                        width: 50%;
                        line-height: 30px;
                    }
                }
            }
            .projectViewTongJiTitle {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 0px 20px;
                border-bottom: 1px solid #DCDFE6;
                height: 48px;
                .projectViewTongJiTitleDiv {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                font-size: 14px;
            }
        }
        .projectViewXianMu, .projectViewXuSuan {
            margin-right: 14px;
        }
        .personnelDiv, .stakeholderDiv {
            margin-top: 10px;
            background: white;
            display: flex;
            flex-direction: column;
            height: auto;
            .personnelDivHead {
                display: flex;
                height: 48px;
                padding: 0px 30px;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #EBEEF5;
                font-size: 14px;
                .personnelDivHeadRight {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    div {
                        width: 180px;
                        height: 26px;
                        margin-right: 10px;
                        border: 1px solid #DCDFE6;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 2px;
                        input {
                            width: 150px;
                            border: none;
                            margin: 4px;
                            font-size: 12px;
                        }
                        .el-icon-search {
                            font-size: 16px;
                            color: #B0B0B0;
                            margin-right: 6px;
                        }
                    }
                }
            }
            .personnelDivbody {
                margin: 30px;
                .groupAll {
                    border: 1px solid #DCDFE6;
                    height: 350px;
                    margin-right: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .groupAllTitle {
                        display: flex;
                        flex-direction: row;
                        line-height: 46px;
                        background: #F7F7F7;
                        border-bottom: 1px solid #DCDFE6;
                        font-size: 15px;
                        width: 100%;
                    }
                    .groupAlConent {
                        text-align: left;
                        width: 100%;
                        font-size: 13px;
                        line-height: 49px;
                        border-bottom: 1px solid #DCDFE6;
                        cursor: pointer;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        .el-icon-delete {
                            margin-right: 20px;
                            color: red;
                        }
                    }
                    .groupAllBtn {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        cursor: pointer;
                        color: #4C98FE;
                        font-size: 14px;
                        line-height: 46px;
                        i {
                            font-size: 12px;
                            margin-right: 6px;
                            font-weight: bold;
                        }
                    }
                }

            }
            .projectZhiTitle {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0px 30px;
                height: 60px;
                .projectZhiTitleLeft {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    div {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        cursor: pointer;
                        height: 30px;
                        .color {
                            color: #409EFF;
                        }
                        .projectOverViewConentItemBottom {
                            position: absolute;
                            right: 0px;
                            bottom: 0px;
                            height: 2px;
                            width: 100%;
                            background: #409EFF;
                        }
                    }
                }
            }
            .projectZhiConent {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background: #F7F7F9;
                margin: 20px 30px 0px 30px;
                height: 100px;
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0px 50px;
                    span {
                        font-size: 18px;
                        margin-top: 12px;
                    }
                    span:first-child {
                        font-size: 14px;
                        color: #409EFF;
                    }
                    .sum {
                        color: orange;
                        font-weight: bold;
                    }
                }
                div:not(:first-child) {
                    border-left: 1px solid #DCDFE6;
                }
            }
            .shenPiTitle {
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #DCDFE6;
                .shenPiTitles {
                    margin: 0px 30px;
                    font-size: 14px;
                }
                div {
                    line-height: 48px;
                    position: relative;
                    margin-left: 30px;
                    cursor: pointer;
                    font-size: 14px;
                    .color {
                        color: #409EFF;
                    }
                    .projectOverViewConentItemBottom {
                        position: absolute;
                        right: 0px;
                        bottom: 0px;
                        height: 2px;
                        width: 100%;
                        background: #409EFF;
                    }
                }

            }
        }
    }

    .xuanZhong {
        background: #EDEDFF;
    }

    .selfEvaluation {
        display: flex;
        flex-direction: column;
        .selfEvaluationItem {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            label {
                font-size: 14px;
                display: inline-block;
                width: 80px;
            }
            .selfEvaluationItemRight {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                margin-top: -10px;
                flex: 1;
            }
            .selfEvaluationItemRights div {
                border: 1px solid #CCCCCC;
                line-height: 30px;
                min-width: 60px;
                text-align: center;
                font-size: 12px;
                margin: 10px;
                cursor: pointer;
            }
            .selfEvaluationItemRightColor {
                border: 1px solid #31D5AA !important;
                color: white;
                background: #31D5AA;
            }
        }
    }

    .secondChange {
        display: flex;
        flex-direction: column;
        border: 1px solid #eeeeee;
        .secondChangeItem {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 12px;
            .secondChangeItemLeft {
                border-right: 1px solid #eeeeee;
                line-height: 40px;
                width: 220px;
                padding-left: 20px;
            }
            .one {
                width: 100px !important;
            }
            .two {
                line-height: 60px !important;
            }
            .secondChangeItemRight {
                padding-left: 20px;
            }
        }
        .secondChangeItem:not(:first-child) {
            border-top: 1px solid #eeeeee;
        }
    }

    .projectViewXianMuConentRightFj {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .projectViewXianMuConentRightFjItem {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 90%;
            position: relative;
            padding-left: 20px;
            margin-bottom: 6px;

        }
        .projectViewXianMuConentRightFjItem::before {
            content: '';
            background-color: #888;
            display: block;
            width: 5px;
            height: 5px;
            border-radius: 7.5px;
            position: absolute;
            top: 7.5px;
            left: 7.5px;
        }
        span {
            font-size: 14px;
            color: #CCCCCC;
            margin-top: 14px;
        }
    }

    .dropdownItem{
        div div{
            width: 14px;
            height: 14px;
            margin-right: 6px;
            background: url("http://hejigy.com.cn/he2.png") 100% 100%;
        }
    }
    .dropdownItem:hover{
        color: white;
        background: #3E90FE;
        div{

            div {
                background: url("http://hejigy.com.cn/ht1.png") 100% 100%;
            }
        }
    }
    .dropdownItemTwo{
        div div{
            width: 14px;
            height: 14px;
            margin-right: 6px;
            background: url("http://hejigy.com.cn/zc2.png") 100% 100%;
        }
    }
    .dropdownItemTwo:hover{
        color: white;
        background: #3E90FE;
        div{

            div {
                background: url("http://hejigy.com.cn/zc1.png") 100% 100%;
            }
        }
    }
    .dropdownItemTree{
       .dropdownItemTreeDiv div{
            width: 14px;
            height: 14px;
            margin-right: 6px;
            background: url("http://hejigy.com.cn/zl1.png") 100% 100%;
        }
    }
    .dropdownItemTree:hover{
        color: white;
        background: #3E90FE;
       .dropdownItemTreeDiv{

            div {
                background: url("http://hejigy.com.cn/zl2.png") 100% 100%;
            }
        }
    }
</style>
