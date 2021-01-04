<template>
  <el-row>
    <el-col :span="24" style="padding:20px 15px 0px 15px;">
      <el-button-group>
        <el-button type="primary" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" v-if="groupManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
        <el-button type="primary" v-if="groupManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
        <el-button type="success" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
          权限分配
        </el-button>
        <el-button type="success" v-if="groupManager_btn_userManager" @click="handlerUser">
          关联用户
        </el-button>
        <el-button type="warning" v-if="groupManager_btn_authorizeManager" @click="handlerAuthorize">
          权限下发
        </el-button>
      </el-button-group>
    </el-col>
    <el-col :span="8" style='margin:15px 0px 0px 15px;'>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
               :filter-node-method="filterNode" :expand-on-click-node="false" ref="groupTree" @node-click="getNodeData"
               default-expand-all style="margin-top: 10px;"></el-tree>
    </el-col>
    <el-col :span="15" style='margin-top:15px;'>
      <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="form" ref="form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" :disabled="formEdit"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" :disabled="formEdit"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :disabled="formEdit"></el-input>
        </el-form-item>
        <el-form-item label="数据范围" prop="dataRange">
          <el-select v-model="form.dataRange" style="width: 200px;" :disabled="formEdit"
                     @change="handleDataRangeChange">
            <el-option v-for="item in dataRangeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formStatus == 'update'">
          <el-button type="primary" v-if="groupManager_btn_edit" @click="update('form')">更新</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        <el-form-item v-if="formStatus == 'create'">
          <el-button type="primary" v-if="groupManager_btn_add" @click="create('form')">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        <el-form-item v-show="form.dataRange=='0'">
          <el-input placeholder="输入关键字进行过滤" v-model="filterDepartText"></el-input>
          <el-tree class="filter-tree" :render-content="renderContent" check-strictly :data="departTreeData" show-checkbox
                   node-key="id" :expand-on-click-node="false" highlight-current
                   :props="defaultProps" :filter-node-method="filterNode" ref="departTree" @node-click="getDepartNodeData"
                   default-expand-all :disabled="formEdit" @check-change="handleDepartCheckChange">
          </el-tree>
        </el-form-item>
      </el-form>
    </el-col>
    <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible" append-to-body>
      <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
    </el-dialog>
    <el-dialog :title="dialogAuthorityName" size="large" :visible.sync="dialogAuthorityVisible" append-to-body>
      <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" append-to-body
                       ref="groupAuthority"></group-authority>
    </el-dialog>
    <el-dialog :title="dialogAuthorizeName" size="large" :visible.sync="dialogAuthorizeVisible" append-to-body>
      <group-authorize :groupId="currentId" @closeAuthorizeDialog="closeAuthorizeDialog"
                       ref="groupAuthorize"></group-authorize>
    </el-dialog>
  </el-row>
</template>

<script>
  import {
    fetchTree,
    getObj,
    addObj,
    delObj,
    putObj
  } from '@/api/admin/group/index';
  import { getTree } from '@/api/org/depart/index';
  import { addObj as addGroupOffice, getByGroupId } from '@/api/admin/groupOffice';
  import { getAllChildrenIds } from '@/util/tree';
  import { mapGetters } from 'vuex';

  export default {
    name: 'groupDetail',
    components: {
      'group-user': () => import('./groupUser'),
      'group-authority': () => import('./groupAuthority'),
      'group-authorize': () => import('./groupAuthorize')
    },
    props: {
      type: {
        default: 'role'
      }
    },
    data() {
      return {
        filterText: '',
        filterDepartText: '',
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        dialogUserVisible: false,
        dialogUserName: '关联用户',
        dialogAuthorityVisible: false,
        dialogAuthorityName: '关联资源',
        dialogAuthorizeVisible: false,
        dialogAuthorizeName: '权限下发',
        listQuery: {
          groupType: this.type,
          name: undefined
        },
        treeData: [],
        departTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        labelPosition: 'right',
        groupManager_btn_edit: false,
        groupManager_btn_del: false,
        groupManager_btn_add: false,
        groupManager_btn_userManager: false,
        groupManager_btn_resourceManager: false,
        groupManager_btn_authorizeManager: false,
        form: {
          code: undefined,
          name: undefined,
          description: undefined,
          dataRange: undefined,
          groupType: this.type
        },
        dataRangeOptions: [
          {
            value: '1',
            label: '仅本人'
          }, {
            value: '2',
            label: '所在部门'
          },
          // {
          //   value: '3',
          //   label: '所在部门及以下'
          // }, {
          //   value: '4',
          //   label: '所在公司'
          // }, {
          //   value: '5',
          //   label: '所在公司及以下'
          // },
          {
            value: '6',
            label: '所在公司'
          }
          // {
          //   value: '0',
          //   label: '按明细设置'
          // }
        ],
        rules: {
          // code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          dataRange: [{ required: true, message: '请选择数据范围', trigger: 'blur' }]
        },
        currentId: -1
      }
    },
    watch: {
      filterText(val) {
        this.$refs.groupTree.filter(val);
      },
      filterDepartText(val) {
        this.$refs.departTree.filter(val);
      }
    },
    created() {
      this.getList();
      this.getDepartTreeDate();
      this.groupManager_btn_edit = this.elements['groupManager:btn_edit'];
      this.groupManager_btn_del = this.elements['groupManager:btn_del'];
      this.groupManager_btn_add = this.elements['groupManager:btn_add'];
      this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
      this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager'];
      this.groupManager_btn_authorizeManager = this.elements['groupManager:btn_authorizeManager'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        fetchTree(this.listQuery).then(data => {
          this.treeData = data.data;
        });
      },
      getDepartTreeDate() {
        getTree().then(data => {
          this.departTreeData = data.data
        });
      },
      getDepartByGroupId(id) {
        getByGroupId(id).then(response => {
          if (response.data.data.length > 0) {
            let ids = [];
            for (let i in response.data.data) {
              ids.push(response.data.data[i].departId);
            }
            this.$refs.departTree.setCheckedKeys(ids, true);
          }
        });
      },
      addGroupOffice(id, departList) {
        addGroupOffice({
          groupId: id,
          departList
        }).then(response => {
          if (response.code == 2000) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
            this.getDepartByGroupId(id);
          }else {
            this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'warning',
              duration: 2000
            })
          }
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update';
        }
        getObj(data.id).then(response => {
          this.form = response.data.data;
        });
        this.currentId = data.id;

        this.getDepartByGroupId(data.id);
      },
      getDepartNodeData(data) {

      },
      handleDepartCheckChange(data, check, currentNode) {
        if (check) {
          this.selectChildren(data);
        }else {
          this.unSelectChildren(data);
        }
      },
      renderContent(h, { node, data }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
            <span>{node.label}</span>
            <span>
              <el-tooltip class="item" effect="dark" content="选中当前节点和所有下级节点" placement="top-start">
                <el-button size="mini" type="text" on-click={() => this.selectChildren(data)}><i class="el-icon-circle-check"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="取消选中当前节点和所有下级节点" placement="top-start">
                <el-button size="mini" type="text" on-click={() => this.unSelectChildren(data)}><i class="el-icon-circle-close"></i></el-button>
              </el-tooltip>
            </span>
          </span>);
      },
      selectChildren(data) {
        const nodes = this.$refs.departTree.getCheckedNodes();
        const ids = [];
        ids.push(data.id);
        for (let i = 0; i < nodes.length; i++) {
          ids.push(nodes[i].id);
        }
        getAllChildrenIds(ids, data);
        this.$refs.departTree.setCheckedKeys(ids);
      },
      unSelectChildren(data) {
        const ids = [];
        ids.push(data.id);
        getAllChildrenIds(ids, data);
        for (let i = 0; i < ids.length; i++) {
          this.$refs.departTree.setChecked(ids[i], false);
        }
      },
      handleDataRangeChange(val) {
        this.$refs.departTree.setCheckedKeys([]);
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false;
          this.formStatus = 'update';
        }
      },
      handlerAdd() {
        this.resetForm();
        this.$refs.departTree.setCheckedKeys([]);
        this.formEdit = false;
        this.formStatus = 'create';
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList();
            this.resetForm();
            this.onCancel();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          });
        });
      },
      update(formName) {
        const set = this.$refs;
        let departList = [];
        if (this.form.dataRange == '0') {
          const nodes = this.$refs.departTree.getCheckedNodes();
          for (let i in nodes) {
            departList.push(nodes[i].id);
          }
        }

        set[formName].validate(valid => {
          if (valid) {
            putObj(this.form.id, this.form).then(response => {
              if (response.status == 200) {
                if (this.form.dataRange == '0') {
                  this.addGroupOffice(response.data.data.id, departList);
                }else {
                  this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                }
              }
            });
          } else {
            return false;
          }
        });
      },
      create(formName) {
        const set = this.$refs;
        let departList = [];
        if (this.form.dataRange == '0') {
          const nodes = this.$refs.departTree.getCheckedNodes();
          for (let i in nodes) {
            departList.push(nodes[i].id);
          }
        }

        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(response => {
              if (response.status == 200) {
                if (this.form.dataRange == '0') {
                  this.addGroupOffice(response.data.data.id, departList);
                }else {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                }
              }
            });
          } else {
            return false;
          }
        });
      },
      onCancel() {
        this.formEdit = true;
        this.formStatus = '';
      },
      resetForm() {
        this.form = {
          parentId: -1,
          code: undefined,
          name: undefined,
          description: undefined,
          groupType: this.type
        };
      },
      handlerUser() {
        this.dialogUserVisible = true;
        if (this.$refs.groupUser !== undefined) {
          this.$refs.groupUser.groupId = this.currentId;
          this.$refs.groupUser.initUsers();
        }
      },
      handlerAuthority() {
        this.dialogAuthorityVisible = true;
        if (this.$refs.groupAuthority !== undefined) {
          this.$refs.groupAuthority.groupId = this.currentId;
          this.$refs.groupAuthority.initAuthoritys();
        }
      },
      handlerAuthorize() {
        this.dialogAuthorizeVisible = true;
        if (this.$refs.groupAuthorize !== undefined) {
          this.$refs.groupAuthorize.groupId = this.currentId;
          this.$refs.groupAuthorize.initAuthoritys();
        }
      },
      closeAuthorizeDialog() {
        this.dialogAuthorizeVisible = false;
      },
      closeUserDialog() {
        this.dialogUserVisible = false;
      },
      closeAuthorityDialog() {
        this.dialogAuthorityVisible = false;
      }
    }
  }
</script>

<style lang="scss">
  .groupUserDialog{
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
      overflow: auto;
    }
  }
</style>
