<template>
    <div class="avue-tags avue-top-tag"
         v-if="showTag">
        <!-- tag盒子 -->
        <div v-if="contextmenuFlag"
             class="avue-tags__contentmenu"
             :style="{left:contentmenuX+'px',top:contentmenuY+'px'}">
            <div class="item"
                 @click="closeRenovate">{{$t('tagsView.closeRenovate')}}
            </div>
            <div class="item"
                 @click="closeOthersTags">{{$t('tagsView.closeOthers')}}
            </div>
            <div class="item"
                 @click="closeAllTags">{{$t('tagsView.closeAll')}}
            </div>
        </div>
        <div class="avue-tags__box"
             :class="{'avue-tags__box--close':!website.isFirstPage}">
            <el-tabs v-model="active"
                     type="card"
                     @contextmenu.native="handleContextmenu"
                     :closable="tagLen!==1"
                     @tab-click="openTag"
                     @edit="menuTag">
                <el-tab-pane :key="item.value"
                             v-for="item in tagList"
                             :label="generateTitle(item)"
                             :name="item.value">
                </el-tab-pane>

            </el-tabs>
            <!--<el-dropdown class="avue-tags__menu">-->
            <!--<el-button type="primary"-->
            <!--size="mini">-->
            <!--{{$t('tagsView.menu')}}-->
            <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</el-button>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item @click.native="$parent.isSearch=true">{{$t('tagsView.search')}}</el-dropdown-item>-->
            <!--<el-dropdown-item @click.native="closeRenovate('menu')">{{$t('tagsView.closeRenovate')}}-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item @click.native="closeOthersTags">{{$t('tagsView.closeOthers')}}</el-dropdown-item>-->
            <!--<el-dropdown-item @click.native="closeAllTags">{{$t('tagsView.closeAll')}}</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
        </div>

    </div>
</template>
<script>
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "tags",
        data() {
            return {
                contextmenuTag: "",
                active: "",
                contentmenuX: "",
                contentmenuY: "",
                contextmenuFlag: false
            };
        },
        created() {
        },
        mounted() {
            this.setActive();
        },
        watch: {
            tag() {
                this.setActive();
            },
            contextmenuFlag() {
                window.addEventListener("mousedown", this.watchContextmenu);
            }
        },
        computed: {
            ...mapGetters(["tagWel", "tagList", "tag", "website"]),
            ...mapState({
                showTag: state => state.common.showTag
            }),
            tagLen() {
                return this.tagList.length || 0;
            }
        },
        methods: {
            generateTitle(item) {
                const type = item.query.type;
                let label = item.label.toString();
                if(type == 'view'){
                    label = label.replace('制单','');
                    label = label.replace('详情','');
                    label = label.replace('审核','');
                    if(item.query.taskType && item.query.taskType=='now'){
                        label = label + '审核';
                    }else{
                        label = label + '详情';
                    }
                }
                return this.$router.$avueRouter.generateTitle(
                    `${label}`,
                    (item.meta || {}).i18n
                );
            },
            watchContextmenu(event) {
                if (!this.$el.contains(event.target) || event.button !== 0) {
                    this.contextmenuFlag = false;
                }
                window.removeEventListener("mousedown", this.watchContextmenu);
            },
            handleContextmenu(event) {
                let target = event.target;
                // 解决 https://github.com/d2-projects/d2-admin/issues/54
                let flag = false;
                if (target.className.indexOf("el-tabs__item") > -1) flag = true;
                else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
                    target = target.parentNode;
                    flag = true;
                }
                if (flag) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.contentmenuX = event.clientX;
                    this.contentmenuY = event.clientY;
                    this.tagName = target.getAttribute("aria-controls").slice(5);
                    let path = event.path || (event.composedPath && event.composedPath());
                    this.contextmenuTag = path[0].getAttribute('id').replace('tab-', '');
                    this.contextmenuFlag = true;
                }
            },
            //激活当前选项
            setActive() {
                this.active = this.tag.value;
            },
            menuTag(value, action) {
                if (action === "remove") {
                    let {tag, key} = this.findTag(value);
                    this.$store.commit("DEL_TAG", tag);
                    if (tag.value === this.tag.value) {
                        tag = this.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
                        this.openTag(tag);
                    }
                }
            },
            openTag(item) {
                let tag;
                if (item.name) {
                    tag = this.findTag(item.name).tag;
                } else {
                    tag = item;
                }
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: tag.label,
                        src: tag.value
                    }, tag.meta),
                    query: tag.query
                });
            },
            closeRenovate(type) {
                if (type == 'menu') {
                    this.contextmenuTag = this.tag.value;
                }
                this.contextmenuFlag = false;
                let {tag, key} = this.findTag(this.contextmenuTag);
                if (tag.value === this.tag.value) {
                    this.$router.replace({
                        path: '/refresh',
                        query: {
                            date: Date.now()
                        }
                    });
                } else {
                    this.$router.push({
                        path: tag.value
                    });
                }
            },
            closeOthersTags() {
                this.contextmenuFlag = false;
                this.$store.commit("DEL_TAG_OTHER");
            },
            findTag(value) {
                let tag, key;
                this.tagList.map((item, index) => {
                    if (item.value === value) {
                        tag = item;
                        key = index;
                    }
                });
                return {tag: tag, key: key};
            },
            closeAllTags() {
                this.contextmenuFlag = false;
                this.$store.commit("DEL_ALL_TAG");
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        src: this.tagWel.value
                    }),
                    query: this.tagWel.query
                });
            }
        }
    };
</script>
<style lang="scss">
    .avue-top-tag{
        .el-tabs__item{
            font-size: 12px !important;
            height: 35px !important;
            line-height: 35px !important;
        }
    }
</style>


