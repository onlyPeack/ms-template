<template>
    <div>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="data"
                   :page="page"
                   :permission="permission"
                   :before-open="beforeOpen"
                   v-model="form"
                   ref="crud"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @row-del="rowDel"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   @on-load="onLoad"
                   @row-click="rowClick">
            <template slot-scope="scope" slot="regionCodesForm">
                <area-cascader :level="1" v-model="form.regionCodes" type="all" :data="$pcaa"
                               :disabled="disabled"></area-cascader>
            </template>
            <template slot-scope="scope" slot="defaultStatusForm">
                <el-switch v-model="form.defaultStatus" :inactive-value="0" :active-value="1"
                           :disabled="disabled"></el-switch>
            </template>
            <template slot-scope="scope" slot="regionCodes">
                <div v-if="scope.row">{{scope.row.province}}-{{scope.row.city}}-{{scope.row.region}}</div>
            </template>
        </avue-crud>
    </div>
</template>

<script>
    import {page as getList, getObj, addObj, putObj, delObj} from '@/api/erp/crm/receiveAddress/index';
    import {isPhone, isMobile} from "@/util/validate";

    export default {
        props: ['customerName'],
        data() {
            var validateRegionCodes = (rule, value, callback) => {
                if (!value || value.length == 0) {
                    callback(new Error('请选择所在区域'));
                } else {
                    callback();
                }
            };
            var validateTelePhone = (rule, value, callback) => {
                if (!isPhone(value) && !isMobile(value)) {
                    callback(new Error('请输入正确的电话号码'));
                } else {
                    callback();
                }
            };
            var validatePostCode = (rule, value, callback) => {
                const reg = /^[1-9][0-9]{5}$/;
                if (value && value != '' && !reg.test(value)) {
                    callback(new Error('请输入正确的邮政编码'));
                } else {
                    callback();
                }
            };
            return {
                form: {},
                query: {},
                disabled: false,
                loading: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                },
                selectionList: [],
                option: {
                    height: 'auto',
                    maxHeight: 260,
                    emptyText: '暂无数据',
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    columnBtn: false,//列显示隐藏
                    viewBtn: false,
                    selection: false,
                    menuWidth: 160,
                    searchMenuSpan: 6,
                    dialogWidth: 700,
                    dialogHeight: 340,
                    dialogClickModal: false,
                    column: [
                        {
                            label: "客户全称",
                            prop: "customerName",
                            hide: true,
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false
                        },
                        {
                            label: "收货人名称",
                            prop: "name",
                            minWidth: 150,
                            rules: [{
                                required: true,
                                message: "请输入收货人名称",
                                trigger: "blur"
                            }],
                            span: 24
                        },
                        {
                            label: "收货人电话",
                            prop: "phoneNumber",
                            minWidth: 150,
                            rules: [{
                                required: true,
                                validator: validateTelePhone,
                                trigger: "blur"
                            }],
                            span: 24
                        },
                        {
                            label: "所在区域",
                            prop: "regionCodes",
                            minWidth: 220,
                            formslot: true,
                            slot: true,
                            rules: [{
                                required: true,
                                validator: validateRegionCodes,
                                trigger: 'blur'
                            }],
                            span: 24
                        },
                        {
                            label: "省",
                            prop: "province",
                            hide: true,
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false
                        },
                        {
                            label: "市",
                            prop: "city",
                            hide: true,
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false
                        },
                        {
                            label: "区",
                            prop: "region",
                            hide: true,
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false
                        },
                        {
                            label: "详细地址",
                            prop: "detailAddress",
                            minWidth: 180,
                            rules: [{
                                required: true,
                                message: "请输入详细地址",
                                trigger: "blur"
                            }],
                            span: 24
                        },
                        {
                            label: "邮政编码",
                            prop: "postCode",
                            minWidth: 180,
                            rules: [{
                                validator: validatePostCode,
                                trigger: "blur"
                            }],
                            span: 24
                        },
                        {
                            label: "是否默认",
                            prop: "defaultStatus",
                            width: 80,
                            align: 'center',
                            formslot: true,
                            dicData: [
                                {
                                    label: '否',
                                    value: 0
                                }, {
                                    label: '是',
                                    value: 1
                                }
                            ],
                            rules: [{
                                required: true,
                                message: "请选择是否默认",
                                trigger: "blur"
                            }],
                            span: 24
                        }
                    ]
                },
                data: []
            };
        },
        computed: {
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods: {
            rowSave(row, loading, done) {
                row = this.getRegionInfo(row.regionCodes, row, 'province', 'city', 'region');
                row.memberId = this.customerId;
                this.disabled = true;
                addObj(row).then(() => {
                    this.disabled = false;
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    this.disabled = false;
                });
            },
            rowUpdate(row, index, loading, done) {
                row = this.getRegionInfo(row.regionCodes, row, 'province', 'city', 'region');
                this.disabled = true;
                putObj(row.id, row).then(() => {
                    this.disabled = false;
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    this.disabled = false;
                });
            },
            rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return delObj(row.id);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            beforeOpen(done, type) {
                if (type == 'add') {
                    if (!this.customerName) {
                        this.vueMessage('warning', '请先输入客户全称');
                        return
                    }
                    this.form = {defaultStatus: 0, customerName: this.customerName};
                }
                if (["edit", "view"].includes(type)) {
                    getObj(this.form.id).then(res => {
                        this.form = res.data.data;
                        this.form.regionCodes = this.setRegionInfo(res.data.data.regionCodes);
                    });
                }
                done();
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
                done();
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            rowClick(row, event, column) {
                this.$refs.crud.toggleSelection([row]);
            },
            onLoad(page, params = {}) {
                this.loading = true;
                this.query.customerName = this.customerName;
                let queryObj = Object.assign(params, this.query, {
                    page: page.currentPage,
                    limit: page.pageSize
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                getList(queryObj).then(res => {
                    const data = res.data;
                    this.page.total = data.total;
                    this.data = data.records;
                    this.loading = false;
                    this.selectionClear();
                }).catch(() => {
                    this.loading = false;
                });
            }
        }
    };
</script>

<style>
</style>
