<template>
  <el-autocomplete class="top-search"
                   popper-class="my-autocomplete"
                   v-model="value"
                   :fetch-suggestions="querySearch"
                   :placeholder="$t('search')"
                   @select="handleSelect">

    <template slot-scope="{ item }">
      <i :class="[item[iconKey],'icon']"></i>
      <div class="name">{{ item[labelKey] }}</div>
      <div class="addr" v-if="!isSAAS">{{item[pathKey] }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import config from "../sidebar/config.js";
import { mapGetters } from "vuex";
import Vue from 'vue'
export default {
  data () {
    return {
      config: config,
      value: "",
      menuList: []
    };
  },
  created () {
    this.getMenuList();
  },
  watch: {
    menu () {
      this.getMenuList();
    }
  },
  computed: {
    labelKey () {
      return this.website.menu.props.title || this.config.propsDefault.title;
    },
    pathKey () {
      return this.website.menu.props.path || this.config.propsDefault.path;
    },
    iconKey () {
      return this.website.menu.props.icon || this.config.propsDefault.icon;
    },
    childrenKey () {
      return (
        this.website.menu.props.children || this.config.propsDefault.children
      );
    },
    isSAAS(){
      return Vue.prototype.isSAAS
    },
    ...mapGetters(["menu", "website"])
  },
  methods: {
    getMenuList () {
      const findMenu = list => {
        for (let i = 0; i < list.length; i++) {
          const ele = Object.assign({}, list[i]);
          if (this.validatenull(ele[this.childrenKey])) {
            this.menuList.push(ele);
          } else {
            findMenu(ele[this.childrenKey]);
          }
        }
      };
      this.menuList = [];
      findMenu(this.menu);
    },
    querySearch (queryString, cb) {
      var restaurants = this.menuList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
      createFilter(queryString) {
          return restaurant => {
              const regExp = new RegExp('[\u4E00-\u9FA5\uFE30-\uFFA0]');
              if (!regExp.test(queryString)) {
                  return (
                      restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
                  );
              } else {
                  return (
                      restaurant.title.indexOf(queryString.trim()) === 0
                  );
              }
          };
      },
    handleSelect (item) {
      this.value = "";
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }, item.meta),
        query: item.query
      });
    }
  }
};
</script>

<style lang="scss">
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    .icon {
      margin-right: 5px;
      display: inline-block;
      vertical-align: middle;
    }
    .name {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    .addr {
      padding-top: 5px;
      width: 100%;
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
