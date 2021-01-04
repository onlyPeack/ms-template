<template>
    <div>
        <el-row>
            <el-col :span="18">
                <div class="filter-container">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或登录名"
                              v-model="listQuery.name">
                    </el-input>
                    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" style="margin-left: 10px;">
                        搜索
                    </el-button>
                </div>
                <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                          @current-change="getRowData" @row-dblclick="onSubmit" ref="singleTable" style="width: 100%;margin-top: 10px;">
                    <el-table-column align="center" label="工号">
                        <template slot-scope="scope">
                            <span>{{scope.row.no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="姓名">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="登录名">
                        <template slot-scope="scope">
                            <span>{{scope.row.username}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="性别">
                        <template slot-scope="scope">
                            <span>{{scope.row.sex}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="身份">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-tag-->
                                    <!--:type="scope.row.isSuperAdmin === '0' ? 'primary' : 'warning'"-->
                                    <!--close-transition>-->
                                <!--<span v-if="scope.row.isSuperAdmin === '0'">普通身份</span>-->
                                <!--<span v-else-if="scope.row.isSuperAdmin === '1'">超级管理员</span>-->
                            <!--</el-tag>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column align="center" label="备注">
                        <template slot-scope="scope">
                            <span>{{scope.row.description}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.page"
                                   :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>

            </el-col>
            <el-col :span="6">
                <el-row>
                    <el-col :span="24" style="line-height: 36px;padding-left: 20px;">
                        已选人员：
                        <br/>
                        <el-tag v-show="chooseAdmin.length>0" :key="tag" v-for="(tag,index) in chooseAdmin" closable
                                :disable-transitions="true"
                                @close="handleTagClose(index)" style="margin-right: 15px;">
                            {{tag}}
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import {page} from '@/api/admin/user/index';
    import {mapGetters} from 'vuex';

    export default {
        //isSingle是否为单选 true单选、false多选
        props: ['isSingle'],
        methods: {
            getList() {
                this.listLoading = true;
                this.listQuery.username = this.listQuery.name;
                page(this.listQuery)
                    .then(response => {
                        this.list = response.data.data.records;
                        this.total = response.data.data.total;
                        this.listLoading = false;
                    })
            },
            handleFilter() {
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            getRowData(val) {
                //console.log(val);
                if(val){
                    if (this.isSingle) {
                        this.chooseAdmin = [val.name];
                        this.currentUser = [val];
                    } else {
                        for (var i in this.chooseAdmin) {
                            if (this.chooseAdmin[i] == val.name) {
                                return;
                            }
                        }
                        this.chooseAdmin.push(val.name);
                        this.currentUser.push(val);
                    }
                }
                if(this.isXin){
                    this.chooseAdmin = [];
                    this.currentUser = [];
                }
            },
            onSubmit() {
                this.chooseAdmin = [];
                this.$emit('closeUserDialog', this.currentUser)
            },
            reset() {
                this.chooseAdmin = [];
                this.currentUser = [];
                this.$refs.singleTable.setCurrentRow();
            },
            handleTagClose(index) {
                //console.log(index);
                this.chooseAdmin.splice(index, 1);
                this.currentUser.splice(index, 1);
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters(['elements'])
        },
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    name: undefined,
                    username: undefined
                },
                tableKey: 0,
                chooseAdmin: [],
                currentUser: []
            };
        }
    };
</script>
