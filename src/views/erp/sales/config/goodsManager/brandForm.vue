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
                           class="main-form" v-if="formData" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="picUrl">
                        <div style="margin-left: 10px;">
                            <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card"
                                       :show-file-list="false"
                                       accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
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
    import {addObj, getObj, putObj} from '@/api/erp/goods/brand';
    import {getHistoryBill} from "@/api/erp/product/product_config/product_process_managerment";
    import {uploadPath} from '@/api/erp/goods/storage'

    export default {
        name: "warehousing-order-form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
        },
        data() {
            return {
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
                            label: "品牌名称",
                            prop: "name",
                            span: 6,
                            rules: [{
                                required: true,
                                message: "请输入品牌名称",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "英文名称",
                            prop: "nameEn",
                            span: 6,
                        },
                        {
                            label: "首字母",
                            prop: "firstLetter",
                            span: 6,
                            rules: [{
                                required: true,
                                message: "请输入首字母",
                                trigger: "change"
                            }]
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
                            label: "品牌介绍",
                            prop: "desc",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            label: "品牌LOGO",
                            prop: "picUrl",
                            row: true,
                            span: 24,
                            formslot: true,
                        },
                        // {
                        //     label: "底价",
                        //     prop: "floorPrice",
                        //     span: 24,
                        // },
                    ]
                },
                option: [],
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
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
                    this.handleGetBill(getObj, this.id);
                }
                this.loading = false;
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    if (funType && funType == 'historyBill') {
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
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = this.formData.id ? putObj : addObj;
                        if (this.formData.id) {
                            saveBill(this.formData.id, this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/brand',
                                        name: '商品品牌',
                                        meta: {
                                            i18n: 'brand'
                                        }, query: {
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
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/brand',
                                        name: '商品品牌',
                                        meta: {
                                            i18n: 'brand'
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
    .el-upload--picture-card{
        position: relative;
    }
    .el-icona{
        position: absolute;
        font-size: 16px !important;
        right: 2px;
        top: 2px;
        z-index: 9999999;
    }
</style>

