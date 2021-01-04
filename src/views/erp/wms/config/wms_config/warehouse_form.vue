<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow"  style="height: 280px;">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="isOpenPosition">
                        <div class="tableItem" >
                            <el-tooltip class="item" effect="dark" content="不启用仓位信息，创建仓库时系统将自动创建1个默认仓位，反之则需要手动创建仓位。" placement="top-start">
                                <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                            </el-tooltip>
                            <el-select v-model="formData.isOpenPosition"
                                       :disabled="type == 'view'? true : false">
                                <el-option value="0" label="不启用"></el-option>
                                <el-option value="1" label="启用"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="location">
                        <div>
                            <area-cascader type="all" v-model="selected" :level='1' placeholder="省/市/区"
                                           :disabled="type=='view'?true:false"
                                           :data="$pcaa"></area-cascader>
                        </div>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="selectType"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getObj, getHistoryBill, addObj, putObj} from "@/api/erp/wms/config/warehouse";
    import {commodityOption,positionOption,userOption} from '@/util/table';
    import {isMobile} from "@/util/validate";
    var DIC = {
        allocation: [{
            label: '数量核算',
            value: '0'
        }, {
            label: '数量金额核算',
            value: '1'
        }],
        inventory: [{
            label: '不控制',
            value: '0'
        }, {
            label: '预警提示',
            value: '1'
        }, {
            label: '不允许负库存',
            value: '2'
        }]
    }
    export default {
        name: "material_stock_out_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                selectType: 1,
                selected:[],
                positionIndex: 0,
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                index:0,
                associatedName:'',
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
                                label: "仓库编码",
                                prop: "code",
                                disabled: true,
                                placeholder: "自动生成",
                                span:8
                            },
                            {
                                label: "仓库名称",
                                prop: "name",
                                span: 8,
                                rules: [{
                                    required: true,
                                    message: "请选择仓库",
                                    rigger: "change"
                                }],
                            },
                            {
                                label: "仓库类型",
                                prop: "warehouseType",
                                span: 8,
                                align: 'center',
                                type: 'select',
                                rules: [{
                                    required: true,
                                    message: "请选择仓库类型",
                                    rigger: "change"
                                }],
                                dicData: [
                                    {
                                        value: '0',
                                        label: '普通仓库'
                                    },
                                    {
                                        value: '1',
                                        label: '门店仓库',
                                    },
                                    {
                                        value: '2',
                                        label: '供应商仓库'
                                    }
                                ],
                            },
                            {
                                label: "仓库状态",
                                prop: "status",
                                span: 8,
                                align: 'center',
                                type: 'select',
                                dicData: [
                                    {
                                        value: '0',
                                        label: '启用'
                                    },
                                    {
                                        value: '1',
                                        label: '停用',
                                    },
                                ],
                            },
                            // {
                            //     label: "关联部门",
                            //     prop: "conDeptName",
                            //     span: 6,
                            //     type: 'text',
                            //     dicData: [],
                            //     filterable: true,
                            //     readonly: true,
                            //     clearable: false,
                            //     rules: [{
                            //         required: true,
                            //         message: "请选择关联部门",
                            //         trigger: "change"
                            //     }],
                            //     click: ({value, column}) => {
                            //         this.publicTitle = '请选择关联部门';
                            //         this.typeName = 'userType';
                            //         this.option = userOption;
                            //         this.isSingle = true;
                            //         this.publicVisible = true;
                            //     }
                            // },
                            // {
                            //     label: "关联门店",
                            //     prop: "storeName",
                            //     span: 6,
                            //     type: 'text',
                            //     dicData: [],
                            //     filterable: true,
                            //     readonly: true,
                            //     clearable: false,
                            //     rules: [{
                            //         required: true,
                            //         message: "请选择关联门店",
                            //         trigger: "change"
                            //     }],
                            //     click: ({value, column}) => {
                            //         this.publicTitle = '请选择关联门店';
                            //         this.typeName = 'userType';
                            //         this.option = userOption;
                            //         this.isSingle = true;
                            //         this.publicVisible = true;
                            //     }
                            // },
                            {
                                label: "仓位启用",
                                prop: "isOpenPosition",
                                span: 8,
                                align: 'center',
                                type: 'select',
                                rules: [{
                                    required: true,
                                    message: "请选择仓位信息",
                                    rigger: "change"
                                }],
                                formslot:true,
                                dicData: [
                                    {
                                        value: '0',
                                        label: '不启用'
                                    },
                                    {
                                        value: '1',
                                        label: '启用',
                                    },
                                ],
                            },
                            {
                                label: "管理员",
                                prop: "managerName",
                                span: 8,
                                type: 'text',
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择管理员",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    this.publicTitle = '请选择管理员';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "所在国家",
                                prop: "country",
                                span: 8,
                                readonly:true
                            },
                            {
                                label: "所在地区",
                                prop: "location",
                                span: 8,
                                formslot:true
                            },
                            {
                                label: "详细地址",
                                prop: "address",
                                span: 8,
                            },
                            // {
                            //     label: "费用分摊",
                            //     prop: "costAllocation",
                            //     span: 6,
                            //     type: "radio",
                            //     dicData: DIC.allocation,
                            //     mock:{
                            //         type:'dic'
                            //     },
                            //     change:({value,column})=>{
                            //     }
                            // },
                            // {
                            //     label: "负库存控制",
                            //     prop: "inventory",
                            //     span:6,
                            //     type: "radio",
                            //     dicData: DIC.inventory,
                            //     mock:{
                            //         type:'dic'
                            //     },
                            //     change:({value,column})=>{
                            //     }
                            // },
                            {
                                label: "仓库备注",
                                prop: "note",
                                type:"textarea",
                                span: 24,
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
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    if (this.typeName == 'userType') {
                        this.formData.managerId = list[0].id;
                        this.formData.managerCode = list[0].no;
                        this.formData.managerName = list[0].name;
                    }
                }
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
                // const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                // this.itemsOption.maxHeight = maxHeight;
                // if (type) {
                //     this.changeFormWidth(this, 'formOption');
                // }
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
                    this.index = 1;
                    this.handleGetBill(getObj, this.id);
                } else {
                    let formData = {
                        status:'0',
                        inventory:'0',
                        costAllocation: '0',
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        country:'中国',
                        items: [

                        ]
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
                    path: '/warehouse_form',
                    name: '仓库信息制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'warehouse_form'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
                            this.selected = this.setRegionInfo(formData.regionCodes);
                        })
                        this.index = 0;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                if(this.selected.length>0){
                    if(this.formData.province){
                        this.formData.province = this.selected[0];
                    }
                    if(this.formData.city){
                        this.formData.city = this.selected[1];
                    }
                    if(this.formData.county){
                        this.formData.county = this.selected[2];
                    }
                    this.formData = this.getRegionInfo(this.selected, this.formData, 'province', 'city', 'county');
                    if(this.formData.regionCodes){
                        this.formData.regionCodes = this.selected;
                    }

                }

                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill;
                        if(this.formData.id){
                            putObj(this.formData.id,this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/warehouse',
                                        name: '仓库信息',
                                        meta: {
                                            i18n: 'warehouse'
                                        },
                                        query: {
                                            timeStamp: new Date().getTime()
                                        },
                                    });
                                    this.reload();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: res.data.msg
                                    });
                                }
                            }, error => {
                                this.preventRepeatSubmit(false, type);
                            });
                        }else{
                            addObj(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/warehouse',
                                        name: '仓库信息',
                                        meta: {
                                            i18n: 'warehouse'
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
                        }

                    } else {
                        return false;
                    }
                });

            }
        }
    };
</script>
<style>

    .tableItem{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 6px;
    }
</style>

