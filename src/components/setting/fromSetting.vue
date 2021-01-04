<template>
    <el-dialog :visible.sync="dialogVisible" width="600px" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose" title="表单配置" class="public-dialog" append-to-body>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="基本信息" name="first">
                <div>
                    <el-table :data="columnList" ref="fromSetting" row-key="prop" border fit highlight-current-row
                              height="500px" v-if="renderShow">
                        <!--<el-table-column label="列字段" prop="prop" width="180">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.prop" readonly/>
                          </template>
                        </el-table-column>-->

                        <el-table-column label="名称" prop="label">
                            <template slot-scope="scope">
                                <!--<el-input v-model="scope.row.label"/>-->
                                <div style="display: flex;justify-content: space-between;align-items: center">
                                    {{scope.row.label}}
                                    <i v-if="scope.row.no == false" class="el-icon-edit-outline bianji"/>
                                    <i v-else class="el-icon-edit-outline bianjis"
                                       @click="labelBtn(scope.$index,true)"/>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="拖拽" prop="drag" width="240" align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleMovePosition('up',scope.$index)"
                                           class="el-icon-top"></el-button>
                                <el-button @click="handleMovePosition('down',scope.$index)"
                                           class="el-icon-bottom"></el-button>
                                <el-button class="el-icon-rank" style="cursor: move;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="预备信息" name="second">
                <div>
                    <el-table :data="columnLists" ref="fromsSetting" row-key="prop" border fit highlight-current-row
                              height="500px" v-if="rendersShow">
                        <!--<el-table-column label="列字段" prop="prop" width="180">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.prop" readonly/>
                          </template>
                        </el-table-column>-->

                        <el-table-column label="名称" prop="label">
                            <template slot-scope="scope">
                                <!--<el-input v-model="scope.row.label"/>-->
                                <div style="display: flex;justify-content: space-between;align-items: center">
                                    {{scope.row.label}}
                                    <i v-if="scope.row.no == false" class="el-icon-edit-outline bianji"/>
                                    <i v-else class="el-icon-edit-outline bianjis"
                                       @click="labelBtn(scope.$index,false)"/>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="拖拽" prop="drag" width="240" align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleMovePositions('up',scope.$index)"
                                           class="el-icon-top"></el-button>
                                <el-button @click="handleMovePositions('down',scope.$index)"
                                           class="el-icon-bottom"></el-button>
                                <el-button class="el-icon-rank" style="cursor: move;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>


        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <!--<el-button type="primary" @click="handleRest" :loading="isRestLoading">重 置</el-button>-->
            <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">保 存</el-button>
        </div>
        <el-dialog :title="'页面设置-'+(isRead ?columnList[index].label : columnLists[index].label)" v-if=" dialogsVisible" :visible.sync="dialogsVisible"
                   width="300px" :before-close="handleCloses" append-to-body>
            <div style="display: flex;flex-direction: column;justify-content: center;">
                <div class="columnListTable">
                    <span>显示标题</span>
                    <el-input type="text" v-model="data.label" style="width: 210px"/>
                </div>
                <div class="columnListTable">
                    <span>显示宽度</span>
                    <el-select v-model="data.span" placeholder="请选择" style="width: 210px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="columnListTable">
                    <span>是否显示</span>
                    <el-select v-model="data.display" placeholder="请选择" style="width: 210px">
                        <el-option
                                v-for="item in displayOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogsVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateBtn">确 定</el-button>
            </span>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import {addPage} from "@/api/erp/config/index";

    export default {
        name: "advancedSetting",
        props: ["dialogVisible", "obj", 'objTwo','objectKey'],
        data() {
            return {
                isRead: true,
                displayOptions: [
                    {
                        value: true,
                        label: '是'
                    },
                    {
                        value: false,
                        label: '否'
                    },
                ],
                options: [
                    {
                        value: 6,
                        label: '跨一列'
                    },
                    {
                        value: 12,
                        label: '跨二列'
                    },
                    {
                        value: 18,
                        label: '跨三列'
                    },
                    {
                        value: 24,
                        label: '跨四列'
                    }
                ],
                dialogsVisible: false,
                activeName: 'first',
                isRestLoading: false,
                sortable: null,
                isFormLoading: false,
                formOption: {},
                columnList: [],
                columnLists: [],
                columnObj: undefined,
                renderShow: true,
                rendersShow: true,
                index: 0,
                data: {}
            }
        },
        created() {
            var columnList = this.obj.column ? JSON.parse(JSON.stringify(this.obj.column)) : [];
            var columnLists = this.objTwo ? JSON.parse(JSON.stringify(this.objTwo)) : [];
            var index = -1;
            for (var i in columnList) {
                //储存prop='id'的对象
                if (columnList[i].prop == 'id') {
                    this.columnObj = columnList[i];
                    index = i;
                }
            }
            //从数组中删除prop='id'的对象，不在列表显示
            if (index != -1) {
                columnList.splice(index, 1);
            }
            this.columnList = columnList;
            this.columnLists = columnLists;
            this.formOption = JSON.parse(JSON.stringify(this.obj));
            this.$nextTick(() => {
                this.setTableSort(this, 'fromSetting', 'columnList', 'renderShow');
            });
            this.$nextTick(() => {
                this.setTableSort(this, 'fromsSetting', 'columnLists', 'rendersShow');
            });
        },
        methods: {
            updateBtn() {
                if (this.isRead) {
                    this.columnList[this.index] = this.data;
                    this.vueSet(this.columnList, this.index, this.columnList[this.index]);
                } else {
                    this.columnLists[this.index] = this.data;
                    this.vueSet(this.columnLists, this.index, this.columnLists[this.index]);
                }
                this.dialogsVisible = false;
            },
            labelBtn(index, val) {
                this.index = index;
                this.isRead = val
                this.data = this.isRead ? JSON.parse(JSON.stringify(this.columnList[index])) : JSON.parse(JSON.stringify(this.columnLists[index]));
                this.dialogsVisible = true;
            },
            handleCloses() {
                this.dialogsVisible = false;
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
            handleMovePositions(type, index) {
                if (type == 'up') {
                    if (index != 0) {
                        this.columnLists[index] = this.columnLists.splice(index - 1, 1, this.columnLists[index])[0];
                    } else {
                        this.columnLists.push(this.columnLists.shift());
                    }
                } else {
                    if (index != this.columnLists.length - 1) {
                        this.columnLists[index] = this.columnLists.splice(index + 1, 1, this.columnLists[index])[0];
                    } else {
                        this.columnLists.unshift(this.columnLists.splice(index, 1)[0]);
                    }
                }
            },
            handleRest() {
                this.$confirm("确定执行此操作?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.isRestLoading = true;
                    // resetSetting(this.objectKey, this.objectType).then(() => {
                    //     this.isRestLoading = false;
                    //     this.$message.success('操作成功');
                    //     this.$emit('handleSubmit');
                    // }, error => {
                    //     this.isRestLoading = false;
                    // });
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
            handleSubmit() {
                this.formOption.column = this.columnList;
              let data = [
                  {
                      type: 3,
                      content: JSON.stringify(this.formOption),
                      objectKey: this.objectKey
                  },
                  {
                      type: 4,
                      content: JSON.stringify(this.columnLists),
                      objectKey: this.objectKey
                  }
              ]
                addPage(data).then((res) => {
                    if (res.data.code == 200 || res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$emit('handleSubmit',data);
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                }, error => {

                });
                this.$emit('handlesSubmit',data);
            }
        }
    }
</script>

<style scoped>
    .bianji {
        font-size: 20px;
        margin-right: 10px;
        color: #E3E3E3;
    }

    .bianjis {
        font-size: 20px;
        margin-right: 10px;
        color: #1C8FF9;
    }

    .columnListTable {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;

        margin: 10px 0px;
    }

    .columnListTable span {
        display: inline-block;
        font-size: 12px;
        width: 62px;
        margin-right: 10px;
    }
</style>
