<template>
  <el-dialog modal-append-to-body append-to-body :visible.sync="dialogDataBaseVisible" width="85%" @close="handleDialogClose"  class="productImport"
      :before-close="handleDialogClose">
    <el-dialog
      width="20%"
      class="built"
      title="将选入本部分类"
      :visible.sync="innerVisible"
      append-to-body>
      <el-card class="box-card">
        <el-tree
          class="filter-tree"
          :data="categoryLists"
          node-key="value"
          highlight-current
          :props="defaultProp"
          :expand-on-click-node="false"
          :filter-node-method="filterNodes"
          ref="categoryTree"
          @node-click="getNodeDatas"
          default-expand-all
          style='margin-top:10px;'
        >
        </el-tree>
      </el-card>
    </el-dialog>
    <el-row>
      <el-col :span="4">
        <el-card class="box-card" >
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="categoryList"
            node-key="value"
            :props="defaultProps"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="categoryTree"
            @node-click="getNodeData"
            default-expand-all
            style='margin-top:10px;'
          >
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="20" style='padding-left:10px;'>
        <el-tag :type="'success'" class="dialog-tag" closable @click="innerVisible = true">
          将选入本部分类：{{fromOut}}
        </el-tag>
        <div class="filter-container" style="margin-bottom: 20px;">
           <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0"  style="font-size:12px;">已选择外部分类:</span>
          <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                         style="display: inline-block;margin-right: 5px;">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" style="font-size:12px;">
            {{item.label}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <br/>
          <br/>
          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品品牌名称" v-model="listQuery.brandName" clearable>
          </el-input>
          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品系列名称"  v-model="listQuery.seriesStandardsName" clearable>
          </el-input>
<!--          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品编号" v-model="listQuery.productId" clearable>-->
<!--          </el-input>-->
          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品型号" v-model="listQuery.productModel" clearable>
          </el-input>
          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品名称" v-model="listQuery.productName" clearable>
          </el-input>
          <el-input  class="filter-item" style="width: 160px;margin-right:20px;" placeholder="请输入产品订货号,多个订货号用','隔开" v-model="listQuery.orderNos" type="textarea" clearable>
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

           <el-button type="primary" icon="el-icon-refresh" @click="restClick" class="filter-item">
              重置
          </el-button>
        </div>
        <div class="result-container">
          <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                    highlight-current-row :height="clientHeight"  style="width: 100%;height: 70vh;position:relative;overflow: auto;">
            <el-table-column align="center" label="同步数据" class-name="small-padding fixed-width">

              <template slot-scope="scope">
                <i class="el-icon-refresh heard-refresh ative" @click="handleUpdate(scope.$index, scope.row)"> </i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品分类名称" prop="cpCategory.name">
            </el-table-column>
            <el-table-column align="center" label="产品品牌名称" prop="brandName">
            </el-table-column>
            <el-table-column align="center" label="产品系列名称" prop="cpSeriesStandards.name">
            </el-table-column>
            <!--<el-table-column align="center" label="产品编号" w prop="productId">-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="产品订货号" prop="orderNo">
            </el-table-column>
            <el-table-column align="center" label="产品型号" prop="productModel">
            </el-table-column>
            <el-table-column align="center" label="产品名称" prop="productName">
            </el-table-column>
            <el-table-column align="center" label="计量单位" prop="measureUnit">
            </el-table-column>
            <el-table-column align="right" label="指导价" prop="guidePrice">
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-container disableds" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.pageNo"
                         :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="maxResults">
          </el-pagination>
          <el-button type="primary" icon="el-icon-upload2" class="filter-item" @click="leadingOut">
            导出(按分类)
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog width="30%"
               class="built builts"
               title="导入外部产品"
               :visible.sync="leadingVisible"
               append-to-body>
      <el-tag :type="'success'" class="dialog-tag" closable @click="innerVisible = true">
        将选入本部分类：{{fromOut}}
      </el-tag>
      <br/>
      <span class="span_list">
        已选择外部分类：
        <span v-for="(item,index) in breadcrumbList" :key="index" style="font-size:12px;">
          {{item.label}}<i v-if="index!==breadcrumbList.length-1">/</i>
        </span>
      </span>
      <br/>
      <span class="span_list">已选择产品品牌：{{listQuery.brandName?listQuery.brandName:'暂无'}}</span>
      <br/>
      <span class="span_list">已选择产品系列：{{listQuery.seriesName?listQuery.seriesName:'暂无'}}</span>
      <br/>
      <span class="span_list">已选择产品编号：{{listQuery.productId?listQuery.productId:'暂无'}}</span>
      <br/>
      <span class="span_list">已选择的订货号：{{listQuery.orderNos?listQuery.orderNos:'暂无'}}</span>
      <br/>
      <span class="span_list">已选择产品型号：{{listQuery.productModel?listQuery.productModel:'暂无'}}</span>
      <br/>
      <span class="span_list">已选择产品名称：{{listQuery.productName?listQuery.productName:'暂无'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leadingVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTap">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { coverFromOut, getByPage, coverFromOuts } from '@/api/erp/goods/goods';
  import { Loading } from 'element-ui';

  export default {
    name: 'coverFromOut',
    props: ['dialogDataBaseVisible', 'fromOut', 'selfCategoryId','categoryLists'],
    computed: {
    },
    data() {
      return {
        filterText: '',
        leadingVisible:false,
        innerVisible: false,
        defaultProp: {
          children: 'children',
          label: 'label'
        },
        clientHeight: 300,
        maxResults: 0,
        listLoading: true,
        categoryList: [],
        list: [],
        defaultProps: {
          children: 'item',
          value: 'id',
          label: 'name'
        },
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          selfCategoryId: undefined,
          categoryId: undefined,
          categoryName: undefined,
          brandName: undefined,
          seriesStandardsName: undefined,
          productId: undefined,
          orderNos: undefined,
          productModel: undefined,
          productName: undefined
        },
        breadcrumbList: [{label: '所有分类', value: 0}]

      }
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      }
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
      this.init();
    },

    methods: {
      handleUpdate(index, row) {
        const query = JSON.parse(JSON.stringify(this.listQuery));
        query.productId = row.productId
        query.selfCategoryId = this.selfCategoryId
        delete query.pageSize;
        delete query.pageNo;
        coverFromOuts(query).then(res => {
            console.log('res');
            console.log(res);
          if (res.data.code === 2000||res.data.code === '2000') {
            this.vueMessage('success', '同步成功!')
          } else {
            this.vueMessage('warning', '同步失败!')
          }
        })
      },
      getNodeDatas(data, node) {
        this.listQuery.categoryId = data.value;
        this.fromOut = data.label;
        this.selfCategoryId = data.value;
        this.innerVisible = false;
        this.handleFilter();
      },
      filterNodes(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 49;
        }
        this.clientHeight = ((document.body.clientHeight - (190 + height)) * 1);
      },
      leadingOut() {
        if(this.breadcrumbList[0].label==='所有分类'){
          if((this.listQuery.brandName===''||this.listQuery.brandName===undefined)&&(this.listQuery.seriesName===''||this.listQuery.seriesName===undefined)&&(this.listQuery.productId===''||this.listQuery.productId===undefined)&&(this.listQuery.orderNos===''||this.listQuery.orderNos===undefined)&&(this.listQuery.productModel===''||this.listQuery.productModel===undefined)&&(this.listQuery.productName===''||this.listQuery.productName===undefined)){
            this.vueMessage('warning','请选择左侧分类或者输入搜索条件!');
            return
          }
        }
        this.listQuery.selfCategoryId = this.selfCategoryId;
          this.leadingVisible = true
      },
      dialogTap(){
        this.leadingVisible = false
        const query = JSON.parse(JSON.stringify(this.listQuery));
        delete query.pageSize;
        delete query.pageNo;
          this.$alert('后台导入中，请耐心等待，您可以离开当前页面或者继续做导入操作。', "提示", {
              confirmButtonText: "确定",
          }).then(() => {
          });
        coverFromOuts(query).then(res => {
          if (res.data.code === '2000') {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
            this.vueMessage('success', '导入成功!')
          } else {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
            // this.vueMessage('warning',res.data.msg)
          }
        })
      },
      restClick() {
        this.listQuery = {
          pageNo: 1,
          pageSize: 20,
          seifCategoryId: undefined,
          categoryId: undefined,
          categoryName: undefined,
          brandName: undefined,
          seriesName: undefined,
          productId: undefined,
          orderNos: undefined,
          productModel: undefined,
          productName: undefined
        }
        this.breadcrumbList=[{ label: '所有分类', value: 0 }]
        this.changeDivHeight();
        const _this = this;
        window.onresize = function() {
          _this.changeDivHeight();
        }
        this.init();
      },
      getNodeData(data, node) {
        this.listQuery.categoryId = data.id
        this.listQuery.categoryName = data.name
        let breadcrumbList = [];
        const sum = {
          label: data.name,
          value: data.id
        }
        breadcrumbList.push(sum);
        if (node.parent) {
          breadcrumbList = this.getAllParentNode(node, breadcrumbList);
        }
        this.breadcrumbList = breadcrumbList.reverse();
        this.handleFilter();
      },
      changeTreeNode(data, index) {
        if (data.label === '所有分类') {
          return;
        }
        this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
        this.$refs.categoryTree.setCurrentKey(data.value);
        this.handleFilter();
      },
      getAllParentNode(node, arr) {
        if (node.parent && node.parent.label) {
          arr.push({
            label: node.parent.label,
            value: node.parent.key
          });
          if (node.parent.parent) {
            this.getAllParentNode(node.parent, arr);
          }
        }
        return arr;
      },
      handleFilter() {
        this.listQuery.pageNo = 1;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        getByPage(this.listQuery).then(res => {
          this.list = res.data.list
          this.maxResults = res.data.count;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.listQuery.pageNo = 1;
          this.maxResults = 0;
          this.listLoading = false;
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;

        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getList();
      },
      handleDialogClose() {
        this.$emit('closeCoverDialog', true)
      },
      filterNode(name, data) {
        if (!name) return true;
        return data.name.indexOf(name) !== -1;
      },
      init() {
        coverFromOut().then(res => {
            console.log('res');
            console.log(res);
          this.categoryList = res.data
        })
        this.getList()
      }
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss">
.productImport {
.el-dialog__wrapper {
    overflow: hidden;
}
  .el-dialog {
      margin-top: 0!important;
    overflow: hidden;
  }
  .box-card {
    overflow: auto;
    height: 92vh;
  }
  .goodsFormDialog{
    overflow: hidden;
  }
  .dialog-tag{
    margin-bottom: 10px;
  }
  .disableds{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .built{
    .box-card{
      height: 60vh;
    }
  }
  .span_list{
    line-height: 32px;
    font-size: 12px;
  }
  .ative{
    font-size: 16px;
  }
  .ative:hover{
    font-size: 20px;
  }
}

</style>
