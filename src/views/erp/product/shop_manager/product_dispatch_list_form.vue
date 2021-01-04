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
                                @handleDispatchers="handleDispatchers"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/product_dispatch_list_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="file">
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
                                <span style="cursor:pointer" @click="showDetail(item)" v-for="(item,index) in formData.annexMuster" :key="index">{{item}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud" class="bill-items-container">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <!--<i class="el-icon-plus" @click="handleAddRow(true)"-->
                                    <!--style="margin-right: 15px;color:  #409EFF;"></i>-->
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="operatorName">
                                <div @click="operatorBtn(scope.row,scope.row.$index)">
                                    <el-input v-model="scope.row.operatorName" placeholder="请选择操作员" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>

                            <template slot-scope="scope" slot="planDate">
                                <div>
                                    <el-date-picker v-model="scope.row.planDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择计划工作时间" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="estimateHour">
                                <div>
                                    <el-input v-model="scope.row.estimateHour" placeholder="请输入预计工时"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
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
            <task-history v-if="processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
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
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getBill,
        getHistoryBill,
        addBill,
        tempAddBill,
        getListBill,
        auditBill
    } from "@/api/erp/product/shop_manager/product_dispatch_list";
    import {
        getBill as getBillCraft
    } from "@/api/erp/product/product_config/product_production_craft";
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
    import {processesOption, technologyOption, userOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "product_dispatch_list_form",
        props: ['type', 'id', 'masterId', 'productBillNo', 'skuName', 'specifications', 'itemNo', 'goodsDate', 'taskType', 'step'],
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
                permission: {tempAddBtn: false, addBtn: false, dispatchersBtn: true},
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
                fileList: [],
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {
                    annexMuster: []
                },
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                selectIndex: 0,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "billProjectNo",
                            prop: "billProjectNo",
                            display: false
                        },
                        {
                            label: "itemId",
                            prop: "itemId",
                            display: false
                        },
                        {
                            label: "workerQty",
                            prop: "workerQty",
                            display: false
                        },
                        {
                            label: "派工日期",
                            prop: "billDate",
                            span: 12,
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
                            label: "生产订单号",
                            prop: "billProductNo",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "工艺路线",
                            prop: "craft",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择工艺路线",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.isSingle = true;
                                this.publicTitle = '请选择工艺';
                                this.typeName = 'technologyType';
                                this.option = technologyOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "产品名称",
                            prop: "projectName",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "产品描述",
                            prop: "projectDescribe",
                            span: 6,
                        },
                        {
                            label: "柜体号",
                            prop: "itemNo",
                            span: 6,
                            readonly: true,
                        },

                        {
                            label: "订单量",
                            prop: "qty",
                            span: 6,
                            readonly: true,
                        },
                        {
                            label: "本次下达量",
                            prop: "releaseQty",
                            type: "number",
                            span: 6,
                            rules: [{
                                required: true,
                                message: "请输入本次下达量",
                                trigger: "change"
                            }],
                            change: ({value, column}) => {
                                if (value > this.formData.maxQty) {
                                    // this.$nextTick(() => {
                                    //     this.vueSet(this.formData, 'releaseQty', '');
                                    // })
                                    this.formData.releaseQty = this.formData.maxQty;
                                    this.vueMessage('warning', '输入值已超出本次可下达量!');

                                }
                            }
                        },
                        {
                            label: "开工日期",
                            prop: "startTime",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() < new Date().getTime() - 3600 * 1000 * 24;
                                },
                            },
                            change: ({value, column}) => {
                                if (this.type == "add") {
                                    // let flag = this.compareDate(value, this.formData.openDate);
                                    // let flags = this.compareDate(value, this.formData.endsDate);
                                    // if (!flag) {
                                    //     this.vueMessage('warning', '不能小于' + this.formData.openDate);
                                    //
                                    //     this.$nextTick(() => {
                                    //         this.formData.startTime = undefined;
                                    //     })
                                    //     return
                                    // }
                                    // if (flags) {
                                    //     this.vueMessage('warning', '不能大于' + this.formData.endsDate);
                                    //
                                    //     this.$nextTick(() => {
                                    //         this.formData.startTime = undefined;
                                    //     })
                                    //     return
                                    // }

                                }
                            }
                        },
                        {
                            label: "预计完工日期",
                            prop: "endTime",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() < new Date().getTime() - 3600 * 1000 * 24;
                                },
                            },
                            change: ({value, column}) => {
                                if (this.type == "add") {
                                    // let flag = this.compareDate(value, this.formData.openDate);
                                    // let flags = this.compareDates(value, this.formData.endsDate);
                                    // if (!flag) {
                                    //     this.vueMessage('warning', '不能小于' + this.formData.openDate);
                                    //     this.$nextTick(() => {
                                    //         this.formData.endTime = undefined;
                                    //     })
                                    //     return
                                    // }
                                    // if (!flags) {
                                    //     this.vueMessage('warning', '不能大于' + this.formData.endsDate);
                                    //
                                    //     this.$nextTick(() => {
                                    //         this.formData.endTime = undefined;
                                    //     })
                                    //     return
                                    // }
                                }
                            }
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
                            prop: "file",
                            span: 24,
                            formslot: true
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
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    index: true,
                    height: 300,
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
                            label: "工序名称",
                            prop: "workOn",
                            mixWidth: 120,
                            placeholder: '',
                            fixed: true,
                            align: 'left',
                            minWidth: 180,
                        },
                        {
                            label: "工序要求",
                            prop: "demand",
                            placeholder: '请输入工序要求',
                            width: 280,
                            align: 'left',
                        },
                        {
                            label: "操作员",
                            prop: "operatorName",
                            width: 180,
                            placeholder: '请选择操作员',
                            align: 'left',
                            readonly: true,
                            clearable: false,
                            slot: true,
                        },
                        {
                            label: "计划工作时间",
                            prop: "planDate",
                            width: 210,
                            type: 'date',
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "预计工时",
                            prop: "estimateHour",
                            width: 160,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            align: 'left',
                            slot: true,
                        },
                    ]
                },
                option: [],
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
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
        methods: {
            showDetail(item) {
                window.open(item)
            },
            operatorBtn(item, index) {
                if (this.type == 'view') {
                    return
                }
                this.selectIndex = index;
                if (this.formData.items[index].workOn != undefined) {
                    this.publicTitle = '请选择操作员';
                    this.typeName = 'userType';
                    this.option = userOption;
                    this.isSingle = false;
                    this.publicVisible = true;
                } else {
                    this.vueMessage('warning', '请先选工序!');
                }
            },
            handleAddRow(type) {
                const d = {
                    workName: '',
                }
                this.formData.items.push(d);
            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            compareDate(checkStartDate, checkEndDate) {
                var arys1 = new Array();
                var arys2 = new Array();
                if (checkStartDate != null && checkEndDate != null) {
                    arys1 = checkStartDate.split('-');
                    var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
                    arys2 = checkEndDate.split('-');
                    var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
                    if (sdate >= edate) {
                        // alert("日期开始时间大于结束时间");
                        return true;
                    } else {
                        //alert("通过");
                        return false;
                    }
                }
            },
            compareDates(checkStartDate, checkEndDate) {
                var arys1 = new Array();
                var arys2 = new Array();
                if (checkStartDate != null && checkEndDate != null) {
                    arys1 = checkStartDate.split('-');
                    var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
                    arys2 = checkEndDate.split('-');
                    var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
                    if (sdate <= edate) {
                        // alert("日期开始时间大于结束时间");
                        return true;
                    } else {
                        //alert("通过");
                        return false;
                    }
                }
            },
            handleSuccess(response, file, fileLis) {
                if (!this.formData.annexMuster) {
                    this.formData.annexMuster = []
                    this.formData.annexMuster.push(response.data.url);
                } else {
                    this.formData.annexMuster.push(response.data.url);
                }
            },
            handleRemove(file, fileList) {
                this.formData.annexMuster = this.formData.annexMuster.filter(item => {
                    return item != annexMuster.response.data.url
                })
            },
            handlePreview(file) {
                console.log(file);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleDispatchers() {
                this.$router.push({
                    path: '/product_dispatch_list',
                    name: '派工单',
                    query: {
                        id: this.masterId,
                    },
                    meta: {
                        i18n: 'product_dispatch_list_form'
                    }
                });
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    if (item.goodsId) {
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
                    if (this.typeName == 'technologyType') {
                        this.formData.craft = list[0].craftName;
                        this.formData.craftId = list[0].id;
                        getBillCraft(list[0].id).then(res => {
                            for (var index in res.data.data.items) {
                                var item = res.data.data.items[index];
                                var itemObj = {};
                                itemObj.workOn = item.work;
                                itemObj.workId = item.id;
                                itemObj.demand = item.ask;
                                itemObj.standardCost = item.standardCost;
                                let flag = false;
                                for (let i in this.formData.items) {
                                    if (this.formData.items[i].workOn == itemObj.workOn) {
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    this.formData.items.push(itemObj);
                                }

                            }
                            this.$nextTick(() => {
                                //清除没有商品ID的数据
                                this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            });
                        })
                    }
                    if (this.typeName == 'userType') {
                        let craftList = []
                        let lists = [];
                        for (let i in list) {
                            craftList.push(list[i].name);
                            lists.push({
                                skillId: list[i].id,
                                skillName: list[i].name,
                                skillCode: list[i].no,
                            })
                        }
                        this.formData.items[this.selectIndex].operatorName = craftList.toString();
                        this.formData.items[this.selectIndex].skills = lists;
                        this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                    }
                    this.publicVisible = false;
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
            changeMaxHeight(type) {
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;

                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.processId = '';
                this.vueSet(this, 'formData', {});
                this.fileList = [];
                this.formData.annexMuster = [];
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    getListBill(this.masterId).then(response => {
                        let formData = {
                            annexMuster: [],
                            billProductNo: this.productBillNo,
                            openDate: response.data.data.mainDTO.openDate,
                            endsDate: response.data.data.mainDTO.endsDate,
                            projectName: this.skuName,
                            specifications: this.specifications,
                            itemNo: this.itemNo,
                            itemId: response.data.data.id,
                            billProjectNo: response.data.data.projectBillNo,
                            qty: response.data.data.qty,
                            maxQty: response.data.data.qty - response.data.data.workerQty,
                            workerQty: response.data.data.workerQty,
                            releaseQty: response.data.data.qty - response.data.data.workerQty,
                            billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            startDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            endDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            items: [{}]
                        };
                        this.$nextTick(() => {
                            this.formData = formData;
                            this.vueSet(this, 'formData', formData);
                        })
                        this.loading = false;
                    })

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/product_dispatch_list',
                    name: '派工单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'product_dispatch_list'
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
                if (this.formData.annexMuster == '') {
                    this.formData.annexMuster = [];
                }
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum =await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this,this.$route);
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
                        this.fileList = [];
                        for (let i in formData.annexMuster) {
                            this.fileList.push({
                                name: formData.annexMuster[i],
                                url: formData.annexMuster[i]
                            })
                        }
                        for (let i in res.data.data.items) {
                            let sum = [];
                            for (let j in res.data.data.items[i].skills) {
                                sum.push(res.data.data.items[i].skills[j].skillName)
                            }
                            res.data.data.items[i].operatorName = sum.toString();
                        }
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/product_dispatch_list_form',
                            name: '派工单制单',
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
                    console.log(this.isEmpty(items[i].workOn))
                    if (this.isEmpty(items[i].workOn)) {
                        items.splice(i, 1);
                    }
                }
                console.log(items);
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
                    if (!this.isEmpty(items[i].workOn)) {
                        flag = false;
                        if (this.isEmpty(items[i].demand)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的工序要求为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].operatorName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的操作员为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].planDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的计划工作时间为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].estimateHour)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的预计工时');
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
                if(this.formData.annexMuster.length<1){
                    this.formData.annexMuster = [];
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
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/product_dispatch_list',
                                    name: '派工单',
                                    meta: {
                                        i18n: 'product_dispatch_list'
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
