<template>
    <el-dialog :visible.sync="dialogVisible" width="970px" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose" title="表格配置" class="public-dialog" append-to-body>

        <div style="margin-bottom: 10px;" v-if="false">
            操作栏：
            <el-switch v-model="tableOption.menu" active-color="#13ce66">
            </el-switch>
            &nbsp;&nbsp;
            查看按钮：
            <el-switch v-model="tableOption.viewBtn" active-color="#13ce66">
            </el-switch>
            &nbsp;&nbsp;
            编辑按钮：
            <el-switch v-model="tableOption.editBtn" active-color="#13ce66">
            </el-switch>
            &nbsp;&nbsp;
            删除按钮：
            <el-switch v-model="tableOption.delBtn" active-color="#13ce66">
            </el-switch>
        </div>

        <el-table :data="columnList" ref="tableSetting" row-key="prop" border fit highlight-current-row
                  height="500px" v-if="renderShow">
            <!--<el-table-column label="列字段" prop="prop" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.prop" readonly/>
              </template>
            </el-table-column>-->
            <el-table-column label="列名称" prop="label" width="150">
                <template slot-scope="scope">
                    <!--<el-input v-model="scope.row.label"/>-->
                    {{scope.row.label}}
                </template>
            </el-table-column>
            <el-table-column label="是否隐藏" prop="hide" width="80" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.hide" active-color="#13ce66">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="是否冻结" prop="fixed" width="80" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.fixed" active-color="#13ce66">
                    </el-switch>
                </template>
            </el-table-column>
            <!--<el-table-column label="汇总类型" prop="sumType" width="130">
              <template slot-scope="scope">
                <el-select v-model="scope.row.sumType" placeholder="请选择" clearable>
                  <el-option v-for="item in sumTypeList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>-->
            <!--<el-table-column label="是否排序" prop="sortable" width="80" align="left">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.sortable" active-color="#13ce66">
                </el-switch>
              </template>
            </el-table-column>-->
            <!--<el-table-column label="是否可搜索" prop="search" width="100" align="center">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-switch v-model="scope.row.search" active-color="#13ce66">-->
                    <!--</el-switch>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="对齐方式" prop="align" width="130">
              <template slot-scope="scope">
                <el-select v-model="scope.row.align" placeholder="请选择">
                  <el-option v-for="item in alignList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>-->
            <el-table-column label="字体颜色" prop="textColor" width="80" align="center">
                <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.textColor"></el-color-picker>
                </template>
            </el-table-column>
            <el-table-column label="背景颜色" prop="bgColor" width="80" align="center">
                <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.bgColor"></el-color-picker>
                </template>
            </el-table-column>
            <el-table-column label="列宽(px)" prop="width" min-width="130">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.width" :placeholder="'推荐设置' + scope.row.minWidth"/>
                </template>
            </el-table-column>
            <!--<el-table-column label="操作" prop="operation" width="150" align="center">
              <template slot-scope="scope">
                <el-button @click="handleMovePosition('up',scope.$index)" class="el-icon-top"></el-button>
                <el-button @click="handleMovePosition('down',scope.$index)" class="el-icon-bottom"></el-button>
              </template>
            </el-table-column>-->
            <el-table-column label="拖拽" prop="drag" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleMovePosition('up',scope.$index)" class="el-icon-top"></el-button>
                    <el-button @click="handleMovePosition('down',scope.$index)" class="el-icon-bottom"></el-button>
                    <el-button class="el-icon-rank" style="cursor: move;"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleRest" :loading="isRestLoading">重 置</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">保 存</el-button>
        </div>

    </el-dialog>
</template>

<script>
    import {addObj as addSetting, reset as resetSetting} from "@/api/erp/config/index";

    export default {
        name: "advancedSetting",
        props: ["dialogVisible", "obj", "objectKey", "objectType"],
        data() {
            return {
                isRestLoading: false,
                sortable: null,
                isFormLoading: false,
                fixedList: [
                    {
                        label: '否',
                        value: false
                    },
                    {
                        label: '是',
                        value: true
                    },
                ],
                alignList: [
                    {
                        label: '居左',
                        value: 'left'
                    },
                    {
                        label: '居中',
                        value: 'center'
                    },
                    {
                        label: '居右',
                        value: 'right'
                    },
                ],
                sumTypeList: [
                    {
                        label: '合计',
                        value: 'sum'
                    },
                    {
                        label: '平均值',
                        value: 'avg'
                    },
                    {
                        label: '统计',
                        value: 'count'
                    }
                ],
                tableOption: {},
                columnList: [],
                columnObj: undefined,
                renderShow: true
            }
        },
        created() {
            var columnList = this.obj.column ? JSON.parse(JSON.stringify(this.obj.column)) : [];
            var index = -1;
            for (var i in columnList) {
                //储存prop='id'的对象
                if (columnList[i].prop == 'id') {
                    this.columnObj = columnList[i];
                    index = i;
                }
                if (this.isEmpty(columnList[i].textColor)) {
                    columnList[i].textColor = '#606266';
                }
                if (this.isEmpty(columnList[i].bgColor)) {
                    columnList[i].bgColor = '#ffffff';
                }
                const obj = this.findItem(this.obj.sumColumnList, columnList[i].prop);
                if (obj) {
                    columnList[i].sumType = obj.type;
                }
            }

            //从数组中删除prop='id'的对象，不在列表显示
            if (index != -1) {
                columnList.splice(index, 1);
            }

            this.columnList = columnList;
            this.tableOption = JSON.parse(JSON.stringify(this.obj));
            this.$nextTick(() => {
                this.setTableSort(this, 'tableSetting', 'columnList', 'renderShow');
            });
        },
        methods: {
            handleRest() {
                this.$confirm("确定执行此操作?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.isRestLoading = true;
                    resetSetting(this.objectKey, this.objectType).then(() => {
                        this.isRestLoading = false;
                        this.$message.success('操作成功');
                        this.$emit('handleSubmit');
                    }, error => {
                        this.isRestLoading = false;
                    });
                }).catch(() => {
                });
            },

            findItem(list, prop) {
                for (var i in list) {
                    if (list[i].name == prop) {
                        return list[i];
                    }
                }
                return;
            },
            handleClose() {
                this.$emit('handleClose');
            },
            handleMovePosition(type, index) {
                if (type == 'up') {
                    if (index != 0) {
                        this.columnList[index] = this.columnList.splice(index - 1, 1, this.columnList[index])[0];
                    } else {
                        this.columnList.push(this.columnList.shift());
                    }
                } else {
                    if (index != this.columnList.length - 1) {
                        this.columnList[index] = this.columnList.splice(index + 1, 1, this.columnList[index])[0];
                    } else {
                        this.columnList.unshift(this.columnList.splice(index, 1)[0]);
                    }
                }
            },
            handleSubmit() {
                var sumColumnList = [];
                //冻结列的数量
                var fixedCount = 0;
                for (var i in this.columnList) {
                    var item = this.columnList[i];
                    if (this.isEmpty(item.label)) {
                        this.$message.warning('第' + (i * 1 + 1) + '行的列名称为必填项，请填写了再提交');
                        return false;
                    }

                    if (!this.isEmpty(item.sumType)) {
                        sumColumnList.push({
                            name: item.prop,
                            type: item.sumType
                        });
                    }
                    if (this.columnList[i].textColor && this.columnList[i].textColor != '#606266') {
                        let j = i;
                        this.columnList[i].renderHeader = h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: this.columnList[j].textColor
                                    }
                                },
                                this.columnList[j].label
                            );
                        }
                    }
                    item.fixed ? fixedCount++ : undefined;
                }
                //冻结列的数量不可超过5个
                if (fixedCount > 5) {
                    this.$message.warning('冻结列的数量不可超过5个');
                    return;
                }
                //添加prop='id'的对象
                if (!this.isEmpty(this.columnObj)) {
                    this.columnList.push(this.columnObj);
                }
                this.tableOption.sumColumnList = this.obj.sumColumnList;
                this.tableOption.column = this.columnList;
                if (!this.isEmpty(this.objectKey) && !this.isEmpty(this.objectType)) {
                    let formData = {
                        objectKey: this.objectKey,
                        type: this.objectType,
                        content: JSON.stringify(this.tableOption)
                    }
                    addSetting(formData).then((res) => {
                        if (res.data.code == 200 || res.data.code == '2000') {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.$emit('handleSubmit', this.tableOption);
                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    }, error => {

                    });
                } else {
                    this.$emit('handleSubmit', this.tableOption);
                }

            }
        }
    }
</script>

<style scoped>

</style>
