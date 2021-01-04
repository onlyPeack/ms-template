<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: false,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" :disabled="formOption.disabled">

                    <template slot-scope="scope" slot="items">
                        <div>
                            <avue-crud v-if="isShow" :option="itemsOption" :data="formData.items"
                                       :class="type == 'view'?'':'main-form-items'">
                                <template slot="menuLeft" slot-scope="scope">
                                    <h3 style="margin: 10px 0px;">订单明细</h3>
                                </template>


                                <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                    <div>
                                        <i class="el-icon-plus" @click="handleAddRow"
                                           style="margin-right: 15px;color:  #409EFF;"></i>
                                        <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                           style="color:#E80000;"></i>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="name">
                                    <div @click="skuBtn(scope.row,scope.row.$index)">
                                        <el-input v-model="scope.row.name" placeholder="请选择商品" readonly
                                                  :disabled="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="taxCode">
                                    <div>
                                        <el-input v-model="scope.row.taxCode" placeholder="请输入税务代码"
                                                  :disabled="type=='view'?true:false"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="isDefault">
                                    <div>
                                        <el-radio v-model="scope.row.isDefault" label="0" :disabled="type=='view'?true:false"
                                                  @change="defaultBtn(scope.row.$index,0)">否
                                        </el-radio>
                                        <el-radio v-model="scope.row.isDefault" label="1" :disabled="type=='view'?true:false"
                                                  @change="defaultBtn(scope.row.$index,1)">是
                                        </el-radio>
                                    </div>
                                </template>
                            </avue-crud>
                        </div>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addGoodsTaxCode, getGoodsTaxCode, puttGoodsTaxCode} from "@/api/erp/taxCode";
    import {taxOption} from '@/util/table';
    import {openUrl} from '@/config/env';

    export default {
        name: "goods_tax_code_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                headers: undefined,
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
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
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    height: 'auto',
                    calcHeight: 350,
                    showSummary: false,
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
                            prop: "name",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                        },
                        {
                            label: "型号",
                            prop: "specifications",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                        },
                        {
                            label: "品牌名称",
                            prop: "brandName",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                        },
                        {
                            label: "税务编码",
                            prop: "taxCode",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "是否默认",
                            prop: "isDefault",
                            minWidth: 120,
                            overHidden: true,
                            align: 'left',
                            slot: true,
                        },
                    ]
                },
                option: {},
            };
        },
        mounted() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
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
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            defaultBtn(index, sum) {
                console.log(index)
                if (sum * 1 == 0) {
                    this.vueSet(this.formData.items[index], 'isDefault', '0');
                } else {
                    for (let i in this.formData.items) {
                        if (Number(i) != Number(index)) {
                            this.vueSet(this.formData.items[i], 'isDefault', '0');
                        } else {
                            this.vueSet(this.formData.items[i], 'isDefault', '1');
                        }
                    }
                }
            },
            skuBtn(item, index, type) {
                if (this.type.indexOf('add') > -1) {
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'taxCodType';
                    this.option = taxOption;
                    this.publicVisible = true;
                }


            },
            handleAddRow() {
                const d = {
                    isDefault: '0'
                }
                this.formData.items.push(d);
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
                    list.forEach(function (obj) {
                        if (obj.goodsCode == item.goodsCode) {
                            map.push(obj.goodsCode);
                        }
                    })
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'taxCodType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '客户编码(' + dataMap.join(",") + ')已有相同的客户信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.name = item.name;
                            itemObj.goodsCode = item.goodsCode;
                            itemObj.specifications = item.specifications;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.isDefault = '0';
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
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
            changeMaxHeight(type) {
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.processId = '';
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && (this.type == 'view' || this.type == 'edit')) {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getGoodsTaxCode, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    let formData = {
                        items: [
                            {
                                isDefault: '0'
                            }
                        ]
                    };
                    this.$nextTick(() => {
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }


            },
            //新增
            handleAdd() {
                this.handleBillAdd(this, {path: '/goods_tax_code_form', name: '商品税务编码制单'});
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        res.data.data.paymentsMeans = Number(res.data.data.paymentsMeans);
                        let formData = res.data.data;
                        this.formData.items = [formData];
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/goods_tax_code_form',
                            name: '商品税务编码制单',
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
            //清除没有客户customerCode的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].goodsCode)) {
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
                    if (!this.isEmpty(items[i].goodsCode)) {
                        flag = false;
                        if (this.isEmpty(items[i].taxCode)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的税务编码为必填项');
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
                        let saveBill = this.id ? puttGoodsTaxCode : addGoodsTaxCode;
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        saveBill(this.id? this.formData.items[0]:this.formData.items).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                //this.init();
                                this.$router.push({
                                    path: '/goods_tax_code',
                                    name: '商品税务编码',
                                    meta: {
                                        i18n: 'goods_tax_code'
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
