<template>
    <div style="background-color: #fff;" class="temp-preview">
        <div style="position:relative;overflow: hidden;min-height: 400px" class="temp-preview-contain">
            <div style="width: 100%;" v-for="(item,index) in plugs" @click="tempsClick(index)" v-bind:key="index">
                <component :is="item" ref="msHead"></component>
            </div>
        </div>

        <el-drawer
                :visible.sync="isShowPanel"
                :direction="direction"
                :title="`控制台${moduleStyle.name?'-'+moduleStyle.name:''}`"
                @opened="panelOpened"
                :modal="false"
                custom-class="demo-drawer"
                ref="drawer">
            <div class="demo-drawer__content">
                <div style="padding: 0 20px">
                    <el-button icon="el-icon-arrow-left" :disabled="chooseTempIndex===0" @click="tempChoose('before')"></el-button>
                    <el-button icon="el-icon-arrow-right" style="float: right" :disabled="chooseTemp.length-1===chooseTempIndex" @click="tempChoose('after')"></el-button>
                </div>
                <el-tabs tab-position="left">
                    <el-tab-pane label="PC样式">
                        <el-form ref="form" label-width="120px" v-if="moduleStyle.style">
                            <el-form-item v-for="(item,index) in moduleStyle.style" :label="`${item.label}：`" v-bind:key="item.label">
                                <div style="text-align: left">
                                    <el-color-picker v-model="item.value" show-alpha
                                                     v-if="item.property==='color'"></el-color-picker>
                                    <div v-else-if="item.property==='img'" @click="nowIndex=index">
                                        <el-upload
                                                class="avatar-uploader"
                                                :show-file-list="false"
                                                action="api/saas/storage/create"
                                                accept=".jpg,.jpeg,.png,.gif,.svg"
                                                :on-success="uploadImg">
                                            <img v-if="item.value" :src="item.value" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                    <el-input v-model="item.value" v-else></el-input>
                                </div>

                            </el-form-item>
                        </el-form>
                        <div style="text-align: center">
                            <el-button @click="doSave" type="primary"
                                       v-if="moduleStyle.style&&moduleStyle.style.length>0">
                                保存
                            </el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="PC文案">
                        <el-form label-width="120px">
                            <div v-for="child in moduleStyle.text" class="temp-preview-aside-text-setting" v-bind:key="child.label">
                                <h3 style="text-align: left">{{child.label}}</h3>
                                <el-collapse accordion>
                                    <el-collapse-item v-for="(item,index) in child.children" v-bind:key="`pre-text${index}`">
                                        <template slot="title" slot-scope="scope">
                                            <el-form-item :label="`预设文字组合${index+1}：`">
                                                <div @click.stop>
                                                    <el-input v-model="item.label" style="width: 300px"></el-input>
                                                </div>
                                            </el-form-item>
                                        </template>
                                        <div v-if="item.children" v-for="(textItem,textIndex) in item.children"
                                             style="margin-bottom: 10px;" v-bind:key="`pre-textItem${textIndex}`">
                                            <el-form-item :label="`预设${textIndex+1}：`">
                                                <el-input v-model="textItem.label"></el-input>
                                            </el-form-item>
                                            <el-form-item label="外部链接：">
                                                <el-input v-model="textItem.link"></el-input>
                                            </el-form-item>
                                            <el-form-item label="内部网页：">
                                                <el-select v-model="textItem.link" style="width:100%">
                                                    <el-option :label="webPage.name" v-for="webPage in webPageList" v-bind:key="webPage.id"
                                                               :value="`/#/bigPreview?id=${webPage.id}`"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
<!--                                        <div>-->
<!--                                            <el-button type="primary" circle icon="el-icon-plus"></el-button>-->
<!--                                        </div>-->
                                    </el-collapse-item>
                                </el-collapse>
<!--                                <div style="text-align: center;margin-top: 5px;">-->
<!--                                    <el-button type="primary" circle icon="el-icon-plus"></el-button>-->
<!--                                </div>-->
                                <!--                        <el-form label-width="120px">-->
                                <!--                            <el-form-item v-for="item in child.children" :label="`${item.label}：`">-->
                                <!--                                <el-input v-model="item.value"></el-input>-->
                                <!--                            </el-form-item>-->
                                <!--                        </el-form>-->
                            </div>
                        </el-form>
                        <div style="text-align: center;margin-top: 15px;">
                            <el-button @click="doSave" type="primary"
                                       v-if="moduleStyle.text&&moduleStyle.text.length>0">
                                保存
                            </el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="手机样式">

                    </el-tab-pane>
                    <el-tab-pane label="手机文案">

                    </el-tab-pane>
                    <el-tab-pane label="文章关联" v-if="moduleStyle.type==='list'">
                        <div style="text-align: left;margin-bottom: 10px;font-size: 16px">
                            <span>{{chooseArticle.name}}</span>
                            <i class="el-icon-minus"
                               style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"
                               v-if="chooseArticle.id"
                               @click="removeArticle(chooseArticle)"></i>
                        </div>
                        <div style="text-align: center">
                            <el-button type="primary" icon="el-icon-plus" @click="isShowArticleSelector=true">关联文章栏目
                            </el-button>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="详情页关联" v-if="moduleStyle.type==='list'">
                        <div style="text-align: left;margin-bottom: 10px;font-size: 16px">
                            <span>{{chooseDetailPage.name}}</span>
                        </div>
                        <div style="text-align: center">
                            <el-button type="primary" icon="el-icon-plus" @click="isShowPageSelector=true">关联详情页</el-button>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="模板信息">
                        <div v-if="moduleStyle.info" style="text-align: center;">
                            <h4 v-for="item in moduleStyle.info" v-bind:key="item">{{item}}</h4>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="手机预览">
                        <div class="qrcode" ref="qrCodeUrl" style="display: flex;justify-content: center"></div>
                    </el-tab-pane>
                    <el-tab-pane label="网页结构">
                        <div style="text-align: center;margin-top: 5px;">
                            <draggable v-model="chooseTemp" @end="tempSort">
                                <div v-for="(item,index) in chooseTemp"
                                     style="text-align: left;margin-bottom: 10px;font-size: 16px"
                                     v-bind:key="item.title">
                                    <span>{{item.title}}</span>
                                    <i class="el-icon-rank"
                                       style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"></i>
                                    <i class="el-icon-minus"
                                       style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"
                                       @click="removeTemp(item)"></i>
<!--                                    <i class="el-icon-bottom"-->
<!--                                       style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"-->
<!--                                       @click="insertTemp(item,index,'after')"></i>-->
<!--                                    <i class="el-icon-top"-->
<!--                                       style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"-->
<!--                                       @click="insertTemp(item,index,'before')"></i>-->
                                </div>
                                <!--                            <transiton>-->
                                <!--                               预留过渡动画 -->
                                <!--                            </transiton>-->


                            </draggable>

                            <el-button type="primary" circle icon="el-icon-plus" @click="showTempSelector"></el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="面板设置">
                        <div style="padding: 15px">
                            <el-radio-group v-model="direction">
                                <el-radio label="ltr">从左往右开</el-radio>
                                <div style="height: 15px"></div>
                                <el-radio label="rtl">从右往左开</el-radio>
                                <div style="height: 15px"></div>
                                <el-radio label="ttb">从上往下开</el-radio>
                                <div style="height: 15px"></div>
                                <el-radio label="btt">从下往上开</el-radio>
                            </el-radio-group>
                        </div>

                    </el-tab-pane>
                </el-tabs>
                <!--                <div class="demo-drawer__footer">-->
                <!--                    <el-button @click="isShowPanel=false">取 消</el-button>-->
                <!--                    <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定'
                }}</el-button>-->
                <!--                </div>-->
            </div>
        </el-drawer>


        <el-button type="primary" icon="el-icon-s-tools" circle v-show="!isShowPanel" @click.stop="isShowPanel=true"
                   size="medium"
                   style="position: fixed;right: 80px;bottom: 30px;z-index: 4000"></el-button>


        <!--        关联公共模块弹窗-->
        <temp-selector v-if="isShowTempSelector" :dialogVisible="isShowTempSelector"
                       :isSingle="isSingle"
                       @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></temp-selector>

        <!--        关联文章弹窗-->
        <article-selector v-if="isShowArticleSelector" :dialogVisible="isShowArticleSelector"
                          :isSingle="true"
                          @handleClose="handleClosePublic" @handleSubmit="articleSubmit"></article-selector>

        <!--        关联详情页弹窗-->
        <page-selector v-if="isShowPageSelector" :dialogVisible="isShowPageSelector"
                       :isSingle="true" :id="$route.query.id"
                       @handleClose="handleClosePublic" @handleSubmit="pageSubmit"></page-selector>
    </div>
</template>

<script>
    import {
        insertBatch,
        selectBatch,
        deleteBatch,
        insertOnce,
        replaceInsertBatch,
        updStyle,
        listForWeb,
        webTree as page,
        bindDetail
    } from '@/api/temp/columnControl';
    import QRCode from 'qrcodejs2'
    import {columnType, tempType} from "./common/dic";
    import {updateBatch as bindArticle, putObj, getObj} from '@/api/temp/articleControl'
    import draggable from 'vuedraggable'

    export default {
        name: "bigPreview",
        data() {
            return {
                plugs: [],
                nowIndex: 0,
                isSingle: false,//是否单选模板
                isShowPanel: false,//是否展示设置面板
                isShowMainPanel: true,//是否展示主体设置面板
                isShowArticleSelector: false,//是否展示文章关联弹窗
                isShowTempSelector: false,//是否展示模板选择弹窗
                isShowPageSelector: false,//是否展示网页选择弹窗
                chooseTemp: [],//已关联的模板
                moduleStyle: {
                    name:'MS'
                },//当前模板样式&文案
                webPageList: [],//当前所有网页
                chooseArticle: {},//当前选择的文章集合
                chooseDetailPage: {},//当前文章关联的详情页
                articleDetail: {},//文章详情存储
                loading: false,//是否提交中
                direction: 'rtl',//面板方向
                QRCode:undefined,//二维码预览对象
                chooseTempIndex:0,//当前选中模板索引
                columnType,
                tempType,
                // articleList:[],//当前文章列表

            }
        },
        components: {
            'tempSelector': () => import('@/components/temp/tempSelector'),
            'articleSelector': () => import('@/components/temp/articleSelector'),
            'pageSelector': () => import('@/components/temp/pageSelector'),
            'ElDrawer': () => import('element-ui/packages/drawer/src/main'),
            draggable
        },
        created() {
            let localStorage = window.localStorage
            //console.log(this.$route.query, 'route',window.location.origin+'/#/bigPreview?url=bigPreview&mobile=1&id='+this.$route.query.id+'&tenantId='+localStorage['tenantId'],window.location)
            this.getDetail()
            page({tenantId: localStorage['tenantId']}).then(res => {
                this.webDataChange(res.data)
                //console.log(res.data,'changeAfter')
                this.webPageList = res.data
            })

        },
        mounted() {

        },
        watch: {
            '$route': function () {
                this.getDetail()
                // console.log('监听到变化')
            },
        },
        updated() {


        },
        methods: {
            doSave() {
                let params = this.chooseTemp[this.nowIndex]
                params.style = JSON.stringify(this.moduleStyle)
                updStyle(params).then(res => {
                    this.getDetail()
                }, error => this.$message.error('保存样式失败!' + error))
            },

            creatQrCode() {
                if (this.$route.query.mobile !== '1') {
                    let localStorage = window.localStorage
                    if(this.QRCode===undefined){
                        this.QRCode=new QRCode(this.$refs.qrCodeUrl, {
                            text: window.location.origin + '/#/bigPreview?url=bigPreview&mobile=1&id=' + this.$route.query.id + '&tenantId=' + localStorage['tenantId'], // 需要转换为二维码的内容
                            width: 100,
                            height: 100,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        })
                    }
                }
            },


            getDetail() {
                if (this.$route.query.id && this.$route.query.id !== '') {
                    if (this.$route.query.article && this.$route.query.article !== '') {
                        getObj(this.$route.query.article).then(res => {
                            this.articleDetail = res.data.data
                            console.log(this.articleDetail, 'articleDetail')
                        }, error => this.$message.error('获取文章详情失败!' + error))
                    }


                    let method = selectBatch
                    if (this.$route.query.mobile && this.$route.query.mobile === '1') {
                        method = listForWeb
                    }
                    method({id: this.$route.query.id, tenantId: this.$route.query.tenantId}).then(res => {
                        try {
                            this.chooseTemp = res.data
                            this.chooseTemp.sort(this.sortData)
                            let temp = []
                            if (this.chooseTemp.length > 0) {
                                for (let i = 0; i < this.chooseTemp.length; i++) {
                                    // temp.push( () =>Promise.resolve(require(`ms-template-manage/src/components/${this.chooseTemp[i].name}`)))
                                    //let arr=Promise.resolve(require(`ms-template-manage/src/components/${this.chooseTemp[i].name}`))
                                    temp.push(this.chooseTemp[i].name)
                                }
                            }
                            this.plugs = temp
                            this.$nextTick(() => {
                                this.moduleCompute()
                            })

                            //console.log(this.plugs,'temp')
                        } catch (e) {
                            console.log('模板加载错误', e)
                        }


                    }, error => this.$message.error('查询网页模板失败!' + error))


                }

            },

            tempsClick(index) {
                //console.log(this.$refs.msHead[index].getModule(), '点击的模板')
                this.nowIndex = index
                this.chooseTempIndex=index
                this.moduleStyle = this.$refs.msHead[index].getModule()
                if (this.columnType[this.chooseTemp[index].type] === '列表') {
                    this.chooseDetailPage = this.chooseTemp[index].detail
                }

            },

            tempChoose(flag){
                if(flag==='before'){
                    this.chooseTempIndex--
                    this.nowIndex--
                }else{
                    this.chooseTempIndex++
                    this.nowIndex++
                }
                //设置样式
                this.moduleStyle = this.$refs.msHead[this.chooseTempIndex].getModule()
                //显示关联文章
                this.chooseArticle = this.chooseTemp[this.chooseTempIndex].articleList&&this.chooseTemp[this.chooseTempIndex].articleList.length>0?this.chooseTemp[this.chooseTempIndex].articleList[0]:{}
                //显示关联详情页
                if (this.columnType[this.chooseTemp[this.chooseTempIndex].type] === '列表') {
                    this.chooseDetailPage = this.chooseTemp[this.chooseTempIndex].detail||{}
                }
            },

            uploadImg(res) {
                this.$set(this.moduleStyle.style[this.nowIndex], 'value', res.data.url)
            },
            moduleAdd() {

            },
            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.isShowTempSelector = false
                this.isShowArticleSelector = false
                this.isShowPageSelector = false
            },

            showTempSelector() {
                this.isSingle = false
                this.isShowTempSelector = true
            },
            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {

                if (this.isSingle) {
                    data.id = this.nowIndex < this.chooseTemp.length ? this.chooseTemp[this.nowIndex].id : null
                    data.cid = this.$route.query.id
                    //console.log(this.chooseTemp[this.nowIndex].id,'insertTest')
                    delete data.sort
                    insertOnce(data).then(res => {
                        this.getDetail()
                    }, error => this.$message.error('插入失败!' + error))
                } else {
                    let localStorage = window.localStorage
                    for (let i = 0; i < data.length; i++) {
                        data[i].mid = data[i].id
                        data[i].cid = this.$route.query.id
                        //目前固定公共模板库
                        data[i].columnType = 1
                        data[i].sort = i
                        data[i].tenantId = localStorage['tenantId']
                    }
                    insertBatch(data).then(res => {
                        this.getDetail()
                    }, error => this.$message.error('选择模板失败!' + error))
                    //console.log(data,'这是选中的模板')
                }
                this.isShowTempSelector = false
            },

            removeTemp(row) {
                this.$confirm('确定删除此模板?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteBatch(row.id).then((res) => {
                        this.getDetail()
                    }, error => this.showError('模板删除失败' + error));
                });
            },

            removeArticle(row) {
                this.$confirm('确定删除此文章?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.mid = ''
                    putObj(row).then(res => {
                        if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                            this.$message.success('取消关联成功!')
                            //this.getDetail()
                            this.$router.push({
                                path: '/refresh'
                            })
                        } else {
                            this.$message.error('取消关联失败!' + res.data.msg || res.data.data)
                        }
                    }, error => this.$message.error('取消关联失败!' + error))
                });
            },

            insertTemp(row, index, flag) {
                this.isSingle = true
                this.isShowTempSelector = true
                this.nowIndex = flag === 'before' ? index : index + 1

            },

            sortData(a, b) {
                return a.sort - b.sort
            },

            tempSort(params) {
                for (let i = 0; i < this.chooseTemp.length; i++) {
                    this.chooseTemp[i].mid = this.chooseTemp[i].id
                    this.chooseTemp[i].cid = this.$route.query.id
                    //目前固定公共模板库
                    this.chooseTemp[i].columnType = 1
                    this.chooseTemp[i].sort = i
                }
                replaceInsertBatch(this.chooseTemp).then(res => {
                    this.getDetail()
                }, error => this.$message.error('模板排序失败!' + error))
            },

            articleSubmit(list) {
                //console.log(list,'article')
                // this.moduleStyle.article=list
                // this.$refs.msHead[this.nowIndex].setModule(this.moduleStyle)
                // for (let i = 0; i < list.length; i++) {
                //     list[i].mid = this.chooseTemp[this.nowIndex].id
                // }
                list.mid = this.chooseTemp[this.nowIndex].id
                // list.cid=this.$route.query.id
                bindArticle(list).then(res => {
                    this.isShowArticleSelector = false
                    this.getDetail()
                }, error => this.$message.error('绑定文章栏目失败!' + error))
            },

            pageSubmit(page) {
                this.isShowPageSelector = false
                let params = {
                    id: this.chooseTemp[this.nowIndex].id,
                    did: page.id
                }
                bindDetail(params).then(res => {
                    this.chooseDetailPage = page
                }, error => this.$message.error('绑定详情页失败!' + error))
                console.log(page, '网页选择')
            },


            /**
             * 重新设置每个模板的module
             */
            moduleCompute() {
                if (this.$refs.msHead && this.$refs.msHead.length > 0) {
                    for (let i = 0; i < this.$refs.msHead.length; i++) {
                        let style = {}

                        if (this.chooseTemp[i].style && this.chooseTemp[i].style.length > 0) {
                            style = JSON.parse(this.chooseTemp[i].style)
                        }
                        if (this.chooseTemp[i].articleList && this.chooseTemp[i].articleList.length > 0) {
                            style.article = this.chooseTemp[i].articleList[0].children
                            for (let j = 0; j < style.article.length; j++) {
                                style.article[j].link = `/bigPreview?id=${this.chooseTemp[i].did}&article=${style.article[j].id}`
                            }
                            this.chooseArticle = this.chooseTemp[i].articleList[0]||{}
                        }

                        let module = this.$refs.msHead[i].getModule()
                        if (Object.prototype.toString.call(module.text) === '[object Array]') {
                            for (let j = 0; j < module.text.length; j++) {

                                if (module.text[j].type && module.text[j].type === 'nav') {
                                    module.text[j].children = this.webPageList
                                }else{
                                    module.text[j].children = style.text[j].children
                                }
                            }
                            style.text = module.text

                        }

                        //如果为详情模板则传入文章详情
                        if (this.tempType[this.chooseTemp[i].type] === '详情模板' && this.articleDetail.id) {
                            style.detail = this.articleDetail
                        }
                        this.$refs.msHead[i].setModule(style)
                        console.log(style, 'submitList', this.webPageList, this.$refs.msHead[i].getModule().text)

                    }
                    if (this.moduleStyle.name!=='MS') {
                        //onsole.log('没name')
                        this.moduleStyle = this.$refs.msHead[0].getModule()
                    }
                    // console.log(this.$refs.msHead[0].getModule(), '拖拽发生了变化')
                }
            },

            webDataChange(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].label = data[i].name
                    data[i].link = `/#/bigPreview?id=${data[i].id}`
                    if (data[i].children && data[i].children.length > 0) {
                        this.webDataChange(data[i].children)
                    }
                }
            },

            /*
            * 控制台打开
            * */
            panelOpened() {
                this.creatQrCode()
            },


        }
    }
</script>
<style scoped>

    .temp-preview-aside {
        height: 100%;
        width: 20%;
        padding-top: 20px;
        vertical-align: top;
        display: inline-block;
        text-align: center;
    }

    >>> .temp-preview-aside .temp-preview-aside-text-setting .el-form-item {
        margin-bottom: 0 !important;
    }
</style>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px !important;
        height: 148px !important;
        line-height: 148px !important;
        text-align: center;
    }

    .avatar {
        width: 148px !important;
        height: 148px !important;
        display: block;
    }


    .el-tabs__content {
        height: 100% !important;
    }

    .el-tab-pane {
        overflow-y: scroll;
    }

    .avue-draggable {
        z-index: 2000 !important;
    }

    #app {
        overflow: unset;
    }
    .temp-preview-aside-text-setting .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 0;
    }
</style>

