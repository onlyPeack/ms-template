<template>
    <div class="app-container calendar-list-container" style="padding:0px 10px;">
        <el-row>
            <el-col :span="8">
                <!--<div class="filter-container" style="margin-bottom: 10px;">-->
                    <!--<el-button-group>-->
                        <!--<el-button type="primary" v-if="departManager_btn_add" icon="plus" @click="append">新建公司</el-button>-->
                    <!--</el-button-group>-->
                <!--</div>-->
                <div class="grid-content bg-purple" style="margin-right: 10px">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>组织部门</span>
                        </div>
                        <div >
                            <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 10px;">
                            </el-input>
                            <el-tree class="filter-tree" node-key="id" :data="mainTreeData" :props="defaultProps" default-expand-all :expand-on-click-node="false"
                                     :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData" highlight-current :render-content="renderContent">
                            </el-tree>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="16" style="height:100%">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card" v-if="!editTreeFormFlag" style="height:100%">
                        <div slot="header" class="clearfix">
                            <span>组织相关</span>
                        </div>
                        <div>
                            <el-tabs value="first">
                                <el-tab-pane label="用户管理" name="first">
                                    <div class="filter-container">
                                        <el-input @keyup.enter.native="handlerTableRowFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listTableQuery.name">
                                        </el-input>
                                        <el-button class="filter-item" type="primary" icon="search" @click="handlerTableRowFilter" style="margin-left: 10px;">搜索</el-button>
                                        <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleTableRowCreate" v-if="departManager_btn_user_add" type="primary">添加用户</el-button>-->
                                    </div>
                                    <el-table :data="childTableData" border highlight-current-row style="width: 100%;margin-top: 10px;">
                                        <el-table-column width="220" align="center" label="姓名">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.name}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="220" align="center" label="账户">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.username}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="150" align="center" label="性别">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.sex}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="220" align="center" label="角色">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.position}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="285" align="center" label="备注">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.description}}</span>
                                            </template>
                                        </el-table-column>
<!--                                        <el-table-column align="center" label="操作" width="100">-->
<!--                                            <template  slot-scope="scope">-->
<!--                                                <el-button size="small" type="text" @click="handleTableRowDelete(scope.row)" style="color: red" v-if="departManager_btn_user_del">-->
<!--                                                    <i class="el-icon-delete"></i>-->
<!--                                                </el-button>-->
<!--                                            </template>-->
<!--                                        </el-table-column>-->
                                    </el-table>
                                </el-tab-pane>
                                <!--<el-tab-pane label="岗位管理" name="second">-->
                                <!--<depart-position :departId="currentTreeNodeId" ref="positionManager"/>-->
                                <!--</el-tab-pane>-->
                            </el-tabs>
                        </div>
                    </el-card>
                    <el-card class="box-card" v-if="editTreeFormFlag">
                        <div slot="header" class="clearfix">
                            <span>部门编辑</span>
                        </div>
                        <div>
                            <!-- 表单提交 -->
                            <el-form :model="mainTreeForm" status-icon :rules="mainTreeFormRules" ref="mainTreeForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="编码" prop="code">
                                    <el-input v-model="mainTreeForm.code" placeholder="请输入编码">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="部门名" prop="name">
                                    <el-input v-model="mainTreeForm.name" placeholder="请输入部门名"></el-input>
                                </el-form-item>
                                <el-form-item label="部门类型">
                                    <el-select class="filter-item" v-model="mainTreeForm.type" placeholder="请选择部门类型">
                                        <el-option v-for="item in  departTypeOptions" :key="item.id" :label="item.labelDefault" :value="item.value"> </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="handlerMainTreeForm('mainTreeForm')" v-if="departManager_btn_edit">提交</el-button>
                                    <el-button @click="editTreeFormFlag = false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-dialog v-if="dialogUserVisible" title="添加用户"  :visible.sync="dialogUserVisible" append-to-body>
            <depart-user @closeUserDialog="closeUserDialog" ref="departUser"></depart-user>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getTree,
        addDepartObj,
        getDepartObj,
        delDepartObj,
        putDepartObj,
        addUserObj,
        delUserObj,
        getUsers
    } from '@/api/org/depart/index';
    import { mapGetters } from 'vuex';
    import { getTypeValue } from '@/api/dict/dictValue/index';
    export default {
        name:'orgManager',
        components: {
            'depart-user': () => import('./components/departUser'),
            'depart-position': () => import('./components/departPosition')
        },
        watch: {
            filterText(val) {
                this.$refs.mainTree.filter(val);
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleTableRowCreate() {
                if (this.currentTreeNodeId === undefined) {
                    this.$notify({
                        title: '提示',
                        message: '请先选择部门节点！',
                        type: 'warning',
                        duration: 2000
                    });
                } else {
                    this.dialogUserVisible = true
                }
            },
            handleTableRowDelete(row) {
                this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delUserObj({ departId: this.currentTreeNodeId, userId: row.id }).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        const index = this.childTableData.indexOf(row);
                        this.childTableData.splice(index, 1);
                    });
                });
            },
            handlerTableRowFilter() {
                this.listTableQuery.departId = this.currentTreeNodeId
                const query = {
                    departId: this.currentTreeNodeId,
                    name: this.listTableQuery.name
                };
                getUsers(query).then(response => {
                    this.childTableData = response.data.data.rows;
                });
            },
            handlerMainTreeForm(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        putDepartObj(this.mainTreeForm.id, this.mainTreeForm).then(() => {
                            this.editTreeFormFlag = false
                            this.initmainTreeData();
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            append(node, data) {
                let entity = {};
                if (data === undefined) {
                    data = {}
                    data.code = new Date().getTime();
                    data.id = '-1';
                    addDepartObj({ name: '根部门', code: data.code, parentId: data.id }).then(() => {
                        this.initmainTreeData();
                    });
                } else {
                    addDepartObj({ name: '子部门', code: new Date().getTime() + '_tmp', parentId: data.id }).then(response => {
                        entity = response.data.data;
                        const newChild = { id: entity.id, label: entity.name, children: [] };
                        if (!data.children) {
                            this.$set(data, 'children', []);
                        }
                        data.children.push(newChild);
                    });
                }
                this.$refs.mainTree.setCurrentKey(data.id);
            },
            remove(node, data) {
                if (data.children.length > 0) {
                    this.$notify({
                        title: '失败',
                        message: '删除失败，该部门有其他子部门！',
                        type: 'warning',
                        duration: 2000
                    });
                    return;
                }
                const query = {
                    departId: this.currentTreeNodeId
                };
                getUsers(query).then(response => {
                    this.childTableData = response.data.data.rows;
                    if (this.childTableData.length > 0) {
                        this.$notify({
                            title: '失败',
                            message: '删除失败，部门存在用户！',
                            type: 'warning',
                            duration: 2000
                        });
                        return;
                    }
                    delDepartObj(data.id).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                    });
                    this.$refs.mainTree.setCurrentKey(data.id);
                });
            },
            edit(node, data) {
                this.editTreeFormFlag = true;
                getDepartObj(data.id).then(response => {
                    this.mainTreeForm = response.data.data;
                });
                this.$refs.mainTree.setCurrentKey(data.id);
            },
            resetMainTreeForm() {
                this.mainTreeForm = {
                    code: '',
                    name: ''
                };
            },
            renderContent(h, { node, data }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
                    <span>
                    <span>{node.label}</span>
                </span>
                <span>
                {this.departManager_btn_edit ?
            <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.edit(node, data)}
            >
            <i class="el-icon-edit" />
                    </el-button> : <span></span>
            }
                {this.departManager_btn_add ?
                <el-button
                    style="font-size: 12px;"
                    type="text"
                    on-click={() => this.append(node, data)}
                >
                <i class="el-icon-circle-plus-outline" />
                    </el-button>
                : <span></span>
                }
                {this.departManager_btn_del ?
                <el-button
                    style="font-size: 12px;"
                    type="text"
                    on-click={() => this.remove(node, data)}
                >
                <i class="el-icon-delete" />
                    </el-button>
                : <span></span>
                }
            </span>
                </span>
            );
            },
            initmainTreeData() {
                getTree().then(data => {
                    this.mainTreeData = data.data
                });
            },
            getTreeNodeData(data) {
                this.currentTreeNodeId = data.id
                this.currentTreeNode = data
                const query = {
                    departId: this.currentTreeNodeId
                };
                getUsers(query).then(response => {
                    this.childTableData = response.data.data.rows
                });
                this.$refs.positionManager.getList(data.id)
            },
            closeUserDialog(selects) {
                this.dialogUserVisible = false
                const uIds = []
                let flag = false
                for (let i = 0; i < selects.length; i++) {
                    flag = true
                    for (let j = 0; j < this.childTableData.length; j++) {
                        if (this.childTableData[j].id === selects[i].id) {
                            flag = false
                        }
                    }
                    if (flag) {
                        this.childTableData.push(selects[i])
                        uIds.push(selects[i].id)
                    }
                }
                this.$refs.departUser.clear()
                addUserObj({ departId: this.currentTreeNodeId, userIds: uIds.join() }).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    });
                });
            }
        },
        created() {
            this.initmainTreeData()
            // 加载树
            this.departManager_btn_edit = this.elements['departManager:btn_edit'];
            this.departManager_btn_del = this.elements['departManager:btn_del'];
            this.departManager_btn_add = this.elements['departManager:btn_add'];
            this.departManager_btn_user_add = this.elements['departManager:btn_user_add'];
            this.departManager_btn_user_del = this.elements['departManager:btn_user_del'];
            getTypeValue('org_depart').then(response => {
                this.departTypeOptions = response.data.data.rows;
            });
        },
        computed: {
            ...mapGetters(['elements'])
        },
        data() {
            return {
                dialogUserVisible: false,
                departTypeOptions: [],
                departManager_btn_edit: false,
                departManager_btn_del: false,
                departManager_btn_add: false,
                departManager_btn_user_add: false,
                departManager_btn_user_del: false,
                filterText: '',
                editTreeFormFlag: false,
                currentTreeNodeId: undefined,
                currentTreeNode: {},
                mainTreeForm: {
                    code: '',
                    name: ''
                },
                listTableQuery: {
                    name: undefined,
                    departId: undefined
                },
                mainTreeFormRules: {
                    code: [
                        {
                            required: true,
                            message: '请输入编码',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入目录名',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符',
                            trigger: 'blur'
                        }
                    ]
                },
                mainTreeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                childTableData: []
            };
        }
    };
</script>
