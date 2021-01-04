<template>
    <div class="task-history">
        <el-table :data="taskHistory" border style="width: 100%" size="mini" highlight-current-row
                  element-loading-text="正在查询中。。。" class="result-data-table" :row-style="handleTableRowStyle">
            <el-table-column prop="step" label="执行环节" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.step=='0' || scope.row.step=='End'">
                        {{scope.row.step=='0'?'开始':'结束'}}
                    </div>
                    <div v-else v-for="item in taskAuditOptions">
                        <span v-if="scope.row.logicKey==item.value">{{item.labelDefault}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="billNo" label="单据号" align="center">
            </el-table-column>
            <el-table-column prop="userName" label="操作人" align="center">
            </el-table-column>
            <el-table-column prop="beginTime" label="开始时间" align="center">
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center">
            </el-table-column>
            <el-table-column prop="opinion" label="提交意见" align="center">
            </el-table-column>
            <el-table-column prop="comment" label="备注">
                <template slot-scope="scope">
                    <span :title="scope.row.comment">{{scope.row.comment}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {getTaskHistoryList} from '@/api/erp/oa/task/taskHistory';
    import {getTypeValue} from '@/api/dict/dictValue/index';

    export default {
        name: "taskHistory",
        props: ['billNo', 'processId'],
        data() {
            return {
                taskAuditOptions: [],
                taskHistory: [],
            }
        },
        watch:{
            processId(newValue, oldValue){
                getTypeValue('task_audit').then(response => {
                    this.taskAuditOptions = response.data.data.rows;
                });
                this.getTaskHistoryInfo(this.billNo, this.processId);
            }
        },
        mounted() {
            getTypeValue('task_audit').then(response => {
                this.taskAuditOptions = response.data.data.rows;
            });
            this.getTaskHistoryInfo(this.billNo, this.processId);
        },
        methods: {
            getTaskHistoryInfo(billNo, processId) {
                getTaskHistoryList(billNo, processId).then(response => {
                    this.taskHistory = response.data;
                }).catch(() => {
                    this.taskHistory = [];
                })
            },
            handleTableRowStyle({row, rowIndex}) {
                if (row.comment && row.comment.indexOf('流转出错') != -1) {
                    return {
                        color: '#F56C6C'
                    };
                }
            }
        }
    }
</script>

<style scoped>
    .task-history {
        margin: 10px 0px;
    }
</style>
