<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: false,addBtn: false,dispatchersBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud"  class="bill-items-container">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(true)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="supplierName">
                                <div @click="supplierNameBtn(scope.row,scope.row.$index)">
                                    <el-input v-model="scope.row.supplierName" placeholder="请选择供应商" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="billDate">
                                <div>
                                    <el-date-picker v-model="scope.row.billDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择业务日期" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="repayDate">
                                <div>
                                    <el-date-picker v-model="scope.row.repayDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择付款到期日" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="payAmount">
                                <div>
                                    <el-input v-model="scope.row.payAmount" placeholder="请输入应付金额"
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" selectType="1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getHistoryBill,
        addObj,
        putObj,
        getObj,
    } from "@/api/erp/financial/financialPayableInit";
    import {
        getBill as getBillCraft
    } from "@/api/erp/product/product_config/product_production_craft";
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
    import {purchaseOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";

    export default {
        name: "init-form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
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
                formData: {},
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
                            label: "会计期间",
                            prop: "accountingPeriod",
                            span: 24,
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
                    indexLabel:'序号',
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
                            label: "供应商名称",
                            prop: "supplierName",
                            minWidth: 190,
                            overHidden:true,
                            placeholder: '请选择供应商名称',
                            fixed: true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "业务日期",
                            prop: "billDate",
                            placeholder: '请选择业务日期',
                            minWidth: 160,
                            overHidden:true,
                            slot: true,
                        },
                        {
                            label: "付款到期日",
                            prop: "repayDate",
                            minWidth: 160,
                            overHidden:true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "应付金额",
                            prop: "payAmount",
                            minWidth: 150,
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
                                    "应付金额"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 160,
                            overHidden:true,
                            align: 'left',
                            slot: true,
                        },
                    ]
                },
                option: [],
                selectIndex: 0,
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
            supplierNameBtn(item, index, type) {
                if (this.type == 'view') {
                    return
                }
                this.publicTitle = '请选择供应商';
                this.typeName = 'purchaseType';
                this.option = purchaseOption;
                this.isSingle = true;
                this.publicVisible = true;
                this.selectIndex = index;
            },
            handleAddRow(type) {
                const d = {
                    billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                    repayDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                }
                this.formData.items.push(d);
            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = this.formData.items.length ;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    if (item.goodsId) {
                        list.forEach(function (obj) {
                            if (obj.customerName == item.customerName) {
                                map.push(obj.customerName);
                            }
                        });
                    }
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    if (this.typeName == 'purchaseType') {
                        for (var index in list) {
                            var item = list[index];
                            this.formData.items[this.selectIndex].supplierName = item.supplierName;
                            this.formData.items[this.selectIndex].supplierCode = item.supplierCode;
                            this.formData.items[this.selectIndex].supplierId = item.id;
                            this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                        }
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
                if(this.$refs.form){
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getObj, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    let formData = {
                        accountingPeriod: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [{
                            billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            repayDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        }]
                    };
                    this.$nextTick(()=>{
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/payable-init-form',
                    name: '应付初始化制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'payable-init-form'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        for(let i in res.data.data.items){
                            let sum = [];
                            for(let j in res.data.data.items[i].skills){
                                sum.push(res.data.data.items[i].skills[j].skillName)
                            }
                            res.data.data.items[i].operatorName = sum.toString();
                        }
                        this.formData = formData;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/payable-init-form',
                            name: '应付初始化制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            },
                            meta: {
                                i18n: 'payable-init-form'
                            }
                        });
                        this.$refs.billContainer.refreshId(this.formData.id);
                    }

                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                // this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].supplierCode)) {
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
                    if (!this.isEmpty(items[i].supplierCode)) {
                        flag = false;
                        if (this.isEmpty(items[i].supplierName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的供应商名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].billDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的业务日期为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].repayDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的付款到期日为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].payAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的应付金额');
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
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = this.type && this.type == 'edit' ? putObj : addObj;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/payable-init',
                                    name: '应付初始化',
                                    meta: {
                                        i18n: 'payable-init'
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
