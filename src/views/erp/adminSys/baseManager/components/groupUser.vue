<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleUserSelector">新增</el-button>
    </div>
    <el-table :data="mItems" border highlight-current-row style="width: 100%;margin-bottom: 30px;" height="480px">
      <el-table-column width="40">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-delete"
                     @click="handleUserDelete(scope.$index,scope.row)"></el-button>
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
    </el-table>

    <div class="bottom-btn">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
    </div>

    <el-dialog title="请选择用户" v-if="userVisible" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="false"
                     ref="userSelector"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    page
  } from '@/api/admin/user/index';
  import {
    getUsers,
    modifyUsers
  } from '@/api/admin/group/index';
  import {mapGetters} from 'vuex';

  export default {
    props: {
      groupId: {
        default: '1'
      }
    },
    components: {
      'user-selector': () => import('@/components/erp/User/user')
    },
    data() {
      return {
        mItems: [],
        members: [],
        loading: false,
        userVisible: false,
        groupManager_btn_userManager: false
      }
    },
    created() {
      this.initUsers();
      this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      onCancel() {
        this.$emit('closeUserDialog');
      },
      onSubmit() {
        const vals = {};
        if (this.members.length > 0) vals.members = this.members.join();
        modifyUsers(this.groupId, vals).then(() => {
          this.$emit('closeUserDialog');
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      initUsers() {
        getUsers(this.groupId).then(response => {
          this.mItems = response.data.data.members;
          const mems = [];
          for (let i = 0; i < response.data.data.members.length; i++) {
            mems.push(response.data.data.members[i].id);
          }
          this.members = mems;
        });
      },
      dataMap(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.id] = item
        });
        return map
      },
      handleUserDelete(index, row) {
        this.mItems.splice(index, 1);
        this.members.splice(index, 1);
      },
      // 用户选择
      handleUserSelector() {
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.userSelector.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.userSelector.onSubmit();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          const dataMap = this.dataMap(this.mItems);
          for (var i in list) {
            const filter = dataMap[list[i].id];
            if (!filter) {
              this.mItems.push(list[i]);
              this.members.push(list[i].id);
            }
          }
          this.$refs.userSelector.reset();
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-btn {
    position: absolute;
    background-color: #fff;
    margin-left: -20px;
    width: 95%;
    bottom: 20px;
    text-align: right;
  }
</style>
