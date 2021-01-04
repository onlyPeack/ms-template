<template>
    <div class="button-bar" :style="{marginBottom: marginBottom+'px'}">
        <el-button icon="el-icon-plus" id="add_bill" @click="handleAddBill" type="success" plain :disabled="addDisable"
                   v-if="permission.addBtn">
            新增
        </el-button>
        <el-button icon="el-icon-edit" id="edit_bill" @click="handleEditBill" type="primary" plain :disabled="editDisable"
                   v-if="permission.editBtn">
            编辑
        </el-button>
        <el-button icon="el-icon-view" id="view_bill" @click="handleViewBill" type="warning" plain :disabled="viewDisable"
                   v-if="permission.viewBtn">
            查看
        </el-button>
        <el-button icon="el-icon-edit-outline" id="temp_add_bill" @click="handleTempAddBill" type="success" plain
                   :disabled="tempAddLoading" v-loading="tempAddLoading" v-if="type=='form' && permission.tempAddBtn">
            暂存
        </el-button>
        <el-button icon="el-icon-document-checked" id="preserve_bill" @click="handlePreserveBill" type="primary" plain
                   :disabled="preserveLoading" :loading="preserveLoading" v-if="type=='form'">
            保存
        </el-button>
        <el-button icon="el-icon-circle-close" id="close_bill" @click="handleCloseBill" type="danger" plain
                   :disabled="closeLoading" v-loading="closeLoading" v-if="permission.closeBtn">
            关闭
        </el-button>
        <el-button icon="el-icon-close" id="cancel_bill" @click="handleCancelBill" type="success" plain
                   :disabled="cancelLoading" v-loading="cancelLoading" v-if="permission.cancelBtn">
            取消
        </el-button>
        <el-button icon="el-icon-delete" id="delete_bill" @click="handleDeleteBill" type="danger" plain
                   :disabled="deleteLoading" v-loading="deleteLoading" v-if="permission.delBtn">
            删除
        </el-button>
        <el-button icon="el-icon-printer" id="print_bill" @click="handlePrintBill" type="warning" plain
                   :disabled="printDisable" v-if="permission.printBtn">
            打印
        </el-button>
        <el-button icon="el-icon-upload" id="import_bill" @click="handleImportBill" type="success" plain
                   :disabled="importLoading" v-loading="importLoading" v-if="permission.importBtn">
            导入
        </el-button>
        <el-button icon="el-icon-upload2" id="export_bill" @click="handleExportBill" type="primary" plain
                   v-if="permission.exportBtn">
            导出
        </el-button>
        <el-button icon="el-icon-view" id="bom_bill" @click="handleBomBill" type="warning" plain :disabled="bomDisable"
                   v-if="type=='list' && permission.bomBtn">
            查看BOM清单
        </el-button>
        <el-button icon="el-icon-edit" id="create_bill" @click="handleCreateBill" type="primary" plain :disabled="createDisable"
                   v-if="type=='list' && permission.createBtn">
            生成生产订单
        </el-button>
        <el-button icon="el-icon-view" id="dispatchers_bill" @click="handleDispatchersBill" type="warning" plain :disabled="dispatchersDisable"
                   v-if="type!='list' && permission.dispatchersBtn">
            派工历史
        </el-button>
        <el-button icon="el-icon-view" id="workers_bill" @click="handleWorkersBill" type="warning" plain :disabled="workersDisable"
                   v-if="type!='list' && permission.workersBtn">
            报工历史
        </el-button>
        <el-button icon="el-icon-lock" id="forbidden_bill" @click="handleForbiddenBill" type="warning" plain
                   :disabled="forbiddenDisable" v-if="permission.forbiddenBtn" >
            禁用
        </el-button>
        <el-button icon="el-icon-position" type="warning" plain @click="handlePositionBill" v-if="permission.positionBtn">
            跟踪
        </el-button>
        <el-button icon="el-icon-unlock" type="warning" plain @click="handleToVoidBill" v-if="permission.voidBtn">
            作废
        </el-button>
        <el-button icon="el-icon-setting" id="table_setting" @click="handleSettingOpen" type="warning" plain
                   v-if="type=='list'">
            表格设置
        </el-button>
        <el-button icon="el-icon-setting" id="form_setting" @click="handlesSettingOpen" type="warning" plain
                   v-if="type!='list'&& permission.formBtn">
            表单设置
        </el-button>
        <el-button icon="el-icon-sort-up" id="first_bill" @click="lastBill" type="primary" plain  v-loading="lastLoading" v-if="type=='view' && permission.lastBtn">
            上一单
        </el-button>
        <el-button icon="el-icon-sort-down" id="last_bill" @click="firstBill" type="primary" plain  v-loading="firstLoading" v-if="type=='view' && permission.firstBtn">
            下一单
        </el-button>
        <from-setting :dialogVisible="formSettingVisible" :obj="data" :objTwo="formOptionTwo"  :objectKey="objectKey"
                       v-if="formSettingVisible"
                       @handleClose="handlesSettingClose"
                       @handleSubmit="handlesSettingSubmit" ></from-setting>
        <!--表格设置弹窗-->
        <table-setting :dialogVisible="tableSettingVisible" :obj="tableOption"
                       v-if="tableSettingVisible"
                       @handleClose="handleSettingClose"
                       @handleSubmit="handleSettingSubmit" :objectKey="objectKey"
                       :objectType="objectType"></table-setting>
    </div>
</template>

<script>
    export default {
        name: "button_bar",
        props: {
            //列表配置
            formOptionTwo: {
                type: Array
            },
            tableOption: {
                type: Object
            },
            formOption: {
                type: Object
            },
            marginBottom: {
                type: Number,
                default: 0
            },
            //list列表 form单据
            type: {
                type: String,
                default: 'list'
            },
            permission: {
                type: Object,
                default: {}
            },
            objectKey: {
                type: String
            },
            objectType: {
                type: Number
            },
            row: {
                type: Object
            }
        },
        components: {
            'tableSetting': () => import('@/components/setting/tableSetting'),
            'fromSetting': () => import('@/components/setting/fromSetting')
        },
        data() {
            return {
                data:{},
                formSettingVisible: false,
                tableSettingVisible: false,
                addDisable: false,
                editDisable: false,
                viewDisable: false,
                firstDisable: false,
                lastDisable: false,
                tempAddDisable: false,
                preserveDisable: false,
                closeDisable: false,
                cancelDisable: false,
                deleteDisable: false,
                printDisable: false,
                importDisable: false,
                exportDisable: false,
                tempAddLoading: false,
                firstLoading: false,
                lastLoading: false,
                preserveLoading: false,
                closeLoading: false,
                cancelLoading: false,
                deleteLoading: false,
                importLoading: false,
                bomDisable:false,
                createDisable: false,
                dispatchersDisable:false,
                workersDisable: false,
                forbiddenDisable: false,
            }
        },
        created() {
            if (this.row) {
                this.controlButtonDisable(this.row);
            }
        },
        watch: {
            row(val) {
                if (val) {
                    this.controlButtonDisable(val);
                }
            }
        },
        methods: {
            handlesSettingClose() {
                this.formSettingVisible = false;
            },
            handleSettingSubmit(obj) {
                if(obj){
                    this.formSettingVisible = false;
                    this.$emit('handleSettingSubmit', obj);
                }else{
                    this.$router.replace({
                        path: '/refresh',
                        query: {
                            date: Date.now()
                        }
                    });
                }
            },
            handleSettingClose() {
                this.tableSettingVisible = false;
            },
            handlesSettingSubmit(obj) {
                if(obj){
                    this.formSettingVisible = false;
                    this.$emit('handlesSettingSubmit', obj);
                }else{
                    this.$router.replace({
                        path: '/refresh',
                        query: {
                            date: Date.now()
                        }
                    });
                }
            },
            controlButtonDisable() {
                if (this.type == 'form') {
                    this.addDisable = false;
                    this.editDisable = true;
                    this.viewDisable = true;
                    this.tempAddDisable = false;
                    this.firstDisable = false;
                    this.lastDisable = false;
                    this.preserveDisable = false;
                    this.deleteDisable = true;
                    this.printDisable = true;
                    this.exportDisable = false;
                    this.importDisable = true;
                    this.bomDisable = true;
                    this.createDisable = false;
                    this.dispatchersDisable = false;
                    this.workersDisable = false;
                    this.forbiddenDisable = false;
                } else if (this.type == 'view') {
                    this.addDisable = false;
                    this.editDisable = true;
                    this.viewDisable = true;
                    this.tempAddDisable = true;
                    this.firstDisable = true;
                    this.lastDisable = true;
                    this.preserveDisable = true;
                    this.deleteDisable = true;
                    this.printDisable = true;
                    this.exportDisable = false;
                    this.importDisable = true;
                    this.bomDisable = true;
                    this.createDisable = false;
                    this.dispatchersDisable = false;
                    this.workersDisable = false;
                    this.forbiddenDisable = false;
                }
            },
            handleAddBill() {
                this.$emit('handleAdd');
            },
            handleCreateBill() {
                this.$emit('handleCreate', 'create');
            },
            handleEditBill() {
                this.$emit('handleEdit', 'edit');
            },
            handleDispatchersBill() {
                this.$emit('handleDispatchers', 'dispatchers');
            },
            handleWorkersBill() {
                this.$emit('handleWorkers', 'workers');
            },
            handleForbiddenBill() {
                this.$emit('handleForbidden', 'forbidden');
            },
            handleViewBill() {
                this.$emit('handleEdit', 'view');
            },
            handleBomBill() {
                this.$emit('handleBomBill', 'bom');
            },
            handleTempAddBill() {
                this.$emit('handlePreserve', 'tempAdd');
            },
            firstBill() {
                this.$emit('handleFirst', 'first');
            },
            lastBill() {
                this.$emit('handleLast', 'last');
            },
            handlePreserveBill() {
                this.$emit('handlePreserve');
            },
            handleCloseBill() {
                this.$emit('handleCloseOrClose', 'close');
            },
            handleCancelBill() {
                this.$emit('handleCloseOrClose', 'cancel');
            },
            handleDeleteBill() {
                this.$emit('handleDelete');
            },
            handlePrintBill() {
                this.$emit('handlePrint');
            },
            handleImportBill() {
                this.$emit('handleImport');
            },
            handleExportBill() {
                this.$emit('handleExport');
            },
            handleSettingOpen() {
                this.tableSettingVisible = true;
            },
            handleToVoidBill() {
                this.$emit('handleToVoid');
            },
            handlePositionBill() {
                this.$emit('handlePosition');
            },
            handlesSettingOpen(){
                let data = JSON.parse(JSON.stringify(this.formOption));
                for(let i=data.column.length - 1; i>=0;i--){
                    if(data.column[i].is == false){
                        data.column.splice(i*1, 1);
                    }
                }
                this.data = data
                this.formSettingVisible = true;
            },
            preventRepeatSubmit(type, val) {
                this[type] = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .button-bar {
        display: inline-block;
    }
</style>
