<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="picUrl">
                        <div style="margin-left: 10px;">
                            <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card"
                                       :show-file-list="false"
                                       accept=".jpg,.jpeg,.png,.gif,.svg" :on-success="uploadPicUrl">
                                <img v-if="formData.picUrl" :src="formData.picUrl"
                                     style="max-width: 148px;max-height:148px;display: block;">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <i v-if="formData.picUrl" class="el-icon-delete el-icona" @click.stop="deletePreview"></i>
                            </el-upload>
                        </div>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>
            </div>
        </basic-container>
    </bill-container>
</template>

<script>
    import { addObj, getObj, delObj, putObj} from '@/api/erp/goods/series';
    import {uploadPath} from '@/api/erp/goods/storage'
    export default {
        name: "seriesForm",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                uploadPath,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                index:0,
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
                                label: "系列名称",
                                prop: "name",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入系列名称",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "子系列名称",
                                prop: "subName",
                                span: 6,
                            },
                            {
                                label: "关联品牌",
                                prop: "brandId",
                                span: 6,
                                type: 'select',
                                align: 'center',
                                dicMethod: 'get',
                                dicUrl: '/api/manager/brand/allBrand',
                                filterable: true,
                                rules: [{
                                    required: true,
                                    message: "请选择关联品牌",
                                    trigger: "change"
                                }],
                                props: {
                                    value: 'id',
                                    label: 'name'
                                },
                            },
                            {
                                label: "排序",
                                prop: "sortOrder",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入排序",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "系列图片",
                                prop: "picUrl",
                                row: true,
                                span: 24,
                                formslot: true,
                            },
                            {
                                label: "介绍",
                                prop: "desc",
                                type: 'textarea',
                                row: true,
                                span: 24,
                            },
                        ]
                },
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            deletePreview(){
                this.formData.picUrl = ''
            },
            uploadPicUrl: function (response) {
                this.formData.picUrl = response.data.url;
            },
            handleSelectionChange(selection) {

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
                    this.vueSet(this, 'formData', {});
                    this.loading = false;

                }
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
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
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = !this.id ? addObj : putObj;
                        if(!this.id){
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/series',
                                        name: '商品系列',
                                        meta: {
                                            i18n: 'series'
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
                        }else{
                            saveBill(this.id,this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/series',
                                        name: '商品系列',
                                        meta: {
                                            i18n: 'series'
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
