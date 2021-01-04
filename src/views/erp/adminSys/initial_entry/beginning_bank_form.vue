<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: false,addBtn: false,dispatchersBtn: false}"
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
                            <template slot-scope="scope" slot="accountName">

                                <div>
                                    <el-select v-model="scope.row.accountName" placeholder="请选择银行账户"
                                               style="width: 100%;">
                                        <el-option v-for="item in accountNameList"
                                                   :label="item.name" :value="item.name"></el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="billDate">
                                <div>
                                    <el-date-picker v-model="scope.row.billDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择日期" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div>
                                    <el-input v-model="scope.row.amount" placeholder="请输入期初金额"
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
        addObj,
        putObj,
        getObj,
    } from "@/api/erp/financial/financialBankAccountInit";
    import {
        getBill as getBillCraft
    } from "@/api/erp/product/product_config/product_production_craft";
    import {purchaseOption} from '@/util/table';
    import {getSelfCompany,pageAll} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";

    export default {
        name: "beginning_bank_form",
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
                accountNameList: [],
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
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                    ]
                },
                itemsOption: {
                    index: true,
                    indexLabel:'序号',
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
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
                            label: "银行账户",
                            prop: "accountName",
                            mixWidth: 180,
                            placeholder: '请选择银行账户',
                            fixed: true,
                            align: 'left',
                            minWidth: 180,
                            slot: true,
                        },
                        {
                            label: "日期",
                            prop: "billDate",
                            placeholder: '请选择日期',
                            width: 300,
                            slot: true,
                        },
                        {
                            label: "期初金额",
                            prop: "amount",
                            width: 180,
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
                                    "期初金额"
                                );
                            },
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 180,
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
            pageAll().then(res=>{
                console.log(res);
                this.accountNameList = res.data.data;
            })
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
            handleAddRow(type) {
                const d = {
                    billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
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
                this.vueSet(this, 'formData', {});
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

                    let formData = {
                        items: [{
                            billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        }]
                    };

                    this.formData = formData;
                    console.log(this.formData);
                    this.$nextTick(()=>{
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
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
                            path: '/beginning_bank_form',
                            name: '期初银行资金制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            },
                            meta: {
                                i18n: 'beginning_bank_form'
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
                    if (!this.isEmpty(items[i].accountCode)) {
                        flag = false;
                        if (this.isEmpty(items[i].accountName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的银行账户为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].billDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的业务日期为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].amount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的期初金额');
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
                for(let j in this.formData.items){
                    for(let i in this.accountNameList){
                        if(this.accountNameList[i].name == this.formData.items[j].accountName){
                            this.formData.items[j].accountCode = this.accountNameList[i].accountCode;
                            this.formData.items[j].accountId = this.accountNameList[i].accountId;
                        }
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
                                    path: '/beginning_bank',
                                    name: '期初银行资金',
                                    meta: {
                                        i18n: 'beginning_bank'
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
