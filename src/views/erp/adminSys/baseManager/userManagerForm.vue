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
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="formData" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="password">
                        <div>
                            <el-input style="display: none"></el-input>
                            <el-input  style="display: none" type="password"></el-input>
                            <el-input v-model="formData.password" :type="types" @focus="types = 'password'"  autocomplete="new-password" :readonly="readonly"  placeholder="请输入密码" >
                            </el-input>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="qrPassword">
                        <div>
                            <el-input style="display: none"></el-input>
                            <el-input style="display: none" type="password"></el-input>
                            <el-input v-model="formData.qrPassword" :type="types"  @focus="types = 'password'"  autocomplete="new-password" :readonly="readonly"   placeholder="请输入确认密码">
                            </el-input>
                        </div>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>

            </div>
            <el-dialog title="选择部门" width="30%" :visible.sync="dialogDepartVisible" v-if="dialogDepartVisible"
                       append-to-body>
                <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
                <span slot="footer" class="dialog-footer">
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart"
                                   type="primary" icon="edit">添加</el-button>
                      </span>
            </el-dialog>
            <el-dialog title="选择角色" width="30%" :visible.sync="dialogPositionVisible" v-if="dialogPositionVisible"
                       append-to-body>
                <position-selector @closePositionDialog="closePositionDialog"
                                   ref="positionSelector"></position-selector>
                <span slot="footer" class="dialog-footer">
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddPosition"
                                   type="primary" icon="edit">添加</el-button>
                      </span>
            </el-dialog>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addObj, getObj, updateUser} from '@/api/admin/user/index';
    import {getHistoryBill} from "@/api/erp/product/product_config/product_process_managerment";
    import {uploadPath} from '@/api/erp/goods/storage'
    import {userOption, positionsOption} from '@/util/table';
    import { isvalidatemobile } from "@/util/validate";
    var DIC = {
        SEX: [{
            label: '男',
            value: '男',
        }, {
            label: '女',
            value: '女',
        }]
    }
    export default {
        name: "userManagerForm",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'depart-selector': () => import('./departSelector'),
            'position-selector': () => import('./positionSelector'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            const validatePhone = (rule, value, callback) => {
                if (isvalidatemobile(value)[0]) {
                    callback(new Error(isvalidatemobile(value)[1]));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if(this.type.indexOf('add')> -1){
                    if (value == '' || value == undefined || value == null) {
                        callback(new Error('请输入密码'));
                    } else if (value.length < 6) {
                        callback(new Error('密码不能低于6位!'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                readonly:false,
                types: 'text',
                dialogPositionVisible: false,
                publicVisible: false,
                publicTitle: undefined,
                typeName: undefined,
                isSingle: false,
                dialogDepartVisible: false,
                option: undefined,
                uploadPath,
                isShow: true,
                loading: false,
                formData: {},
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "姓名",
                            prop: "name",
                            span: 4,
                            readonly: true,
                            rules: [{
                                required: true,
                                message: "请输入姓名",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "手机号",
                            prop: "mobilePhone",
                            readonly: true,
                            span: 5,
                        },
                        // {
                        //     label: "密码",
                        //     prop: "password",
                        //     type: "password",
                        //     span: 6,
                        //     formslot: true,
                        //     rules: [{validator: validatePass, trigger: 'blur'}]
                        // },
                        // {
                        //     label: "确认密码",
                        //     prop: "qrPassword",
                        //     type: "password",
                        //     formslot: true,
                        //     span: 6,
                        //     rules: [{validator: validatePass, trigger: 'blur'}]
                        // },
                        {
                            label: "部门",
                            prop: "departName",
                            span: 5,
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择部门",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.dialogDepartVisible = true;
                            }
                        },
                        {
                            label: "角色",
                            prop: "position",
                            span: 5,
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择角色",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.dialogPositionVisible = true;
                            }
                        },
                        {
                            label: "直属上级",
                            prop: "leader",
                            span: 5,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择直属上级",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.isSingle = true;
                                this.publicTitle = '请选择直属上级';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.publicVisible = true;
                            }
                        },
                        // {
                        //     label: "性别",
                        //     prop: "sex",
                        //     span: 6,
                        //     type: "radio",
                        //     dicData: DIC.SEX,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择性别",
                        //         trigger: "blur"
                        //     }],
                        //     mock: {
                        //         type: 'dic'
                        //     },
                        //     change: ({value, column}) => {
                        //         //this.$message.success('change')
                        //     }
                        // },
                        {
                            label: "备注",
                            prop: "description",
                            type: 'textarea',
                            span: 24,
                        },
                    ]
                },
                option: [],
            };
        },
        created() {

        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'userType') {
                        this.formData.leader = list[0].no;
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handlerAddDepart() {
                this.$refs.departSelector.onSubmit()
            },
            handlerAddPosition() {
                this.$refs.positionSelector.onSubmit()
            },
            closePositionDialog(position) {
                if (position && position.label) {
                    this.formData.position = position.label;
                    this.formData.positionId = position.id;
                }
                this.dialogPositionVisible = false;
                this.$refs['form'].validateField('position');
            },
            closeDepartDialog(depart) {
                if (depart && depart.label) {
                    this.formData.departName = depart.label;
                    this.formData.departId = depart.id;
                }
                this.dialogDepartVisible = false;
                this.$refs['form'].validateField('departName');
            },
            uploadPicUrl: function (response) {
                this.formData.picUrl = response.data.url;
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
            init() {
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                this.vueSet(this, 'formData', {});
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                this.readonly = false;
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getObj, this.id);
                } else {
                    this.vueSet(this, 'formData', {sex: '男'});
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this, {path: '/userManagerForm', name: '用户管理制单'});
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if (res.status == 200 && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        formData.password = undefined;
                        if(formData.departId && formData.departId.indexOf('{')>-1   ){
                            formData.departName = JSON.parse(formData.departId).name;
                            formData.departId = JSON.parse(formData.departId).id;
                        }

                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/userManagerForm',
                            name: '用户管理制单',
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
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                if (this.formData.id) {
                    if (this.formData.password) {
                        if (this.formData.password !== this.formData.qrPassword) {
                            this.vueMessage('warning', '密码与确认码不一致!');
                            return
                        }
                    }
                } else {
                    if (!this.formData.password) {
                        this.vueMessage('warning', '请输入密码!');
                        return
                    }
                    if (this.formData.password !== this.formData.qrPassword) {
                        this.vueMessage('warning', '密码与确认码不一致!');
                        return
                    }
                }
                this.readonly = true;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = this.formData.id ? updateUser : addObj;
                        this.formData.username = this.formData.mobilePhone
                        if (this.formData.id) {
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 2000 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/userManager',
                                        name: '用户管理',
                                        meta: {
                                            i18n: 'userManager'
                                        },
                                        query: {
                                            timeStamp: new Date().getTime()
                                        },
                                    });
                                } else if (res.data.code == 401 || res.data.code == '401') {
                                    this.$message({
                                        type: "warning",
                                        message: res.data.msg
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
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 2000 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/userManager',
                                        name: '用户管理',
                                        meta: {
                                            i18n: 'userManager'
                                        },
                                        query: {
                                            timeStamp: new Date().getTime()
                                        },
                                    });
                                } else if (res.data.code == 401 || res.data.code == '401') {
                                    this.$message({
                                        type: "warning",
                                        message: res.data.msg
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
