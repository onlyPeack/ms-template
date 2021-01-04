<template>
    <div style="background-color: #fff;" class="temp-preview">
        <!--        <component :is="item" v-for="item in plugs" ref="msHead"></component>-->
        <!--        <div style="border-right: 1px solid #E4E7ED" class="temp-preview-aside">-->
        <!--            <h2>公共模板选择</h2>-->
        <!--        </div>-->
        <div style="position:relative;width: 69%;display: inline-block;overflow: hidden" class="temp-preview-contain">
            <div style="width: 100%;" v-for="(item,index) in plugs" @click="tempsClick(index)">
                <component :is="item" ref="msHead"></component>
            </div>

        </div>
        <div style="border-left: 1px solid #E4E7ED;width: 30%;padding-top: 0;" class="temp-preview-aside">
            <el-tabs type="border-card">
                <el-tab-pane label="样式调整">
                    <h2 style="margin-top: 0;">{{moduleStyle.name}}</h2>
                    <div style="height: 20px"></div>
                    <el-form ref="form" label-width="120px" v-if="moduleStyle.style">
                        <el-form-item v-for="(item,index) in moduleStyle.style" :label="`${item.label}：`">
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
                    <el-button @click="doSave" type="primary">保存</el-button>
                </el-tab-pane>
                <el-tab-pane label="文案调整">
                    <h2 style="margin-top: 0;">{{moduleStyle.name}}</h2>
                    <el-form label-width="120px">
                        <div v-for="child in moduleStyle.text" class="temp-preview-aside-text-setting">
                            <h3 style="text-align: left">{{child.label}}</h3>
                            <el-collapse accordion>
                                <el-collapse-item v-for="(item,index) in child.children">
                                    <template slot="title" slot-scope="scope">
                                        <el-form-item :label="`预设文字组合${index+1}：`">
                                            <div @click.stop>
                                                <el-input v-model="item.label"></el-input>
                                            </div>
                                        </el-form-item>
                                    </template>
                                    <div v-if="item.children" v-for="(textItem,textIndex) in item.children"
                                         style="margin-bottom: 10px;">
                                        <el-form-item :label="`预设${textIndex+1}：`">
                                            <el-input v-model="textItem.label"></el-input>
                                        </el-form-item>
                                        <el-form-item label="链接：">
                                            <el-input v-model="textItem.link"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-button type="primary" circle icon="el-icon-plus"></el-button>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                            <div style="text-align: center;margin-top: 5px;">
                                <el-button type="primary" circle icon="el-icon-plus"></el-button>
                            </div>
                            <!--                        <el-form label-width="120px">-->
                            <!--                            <el-form-item v-for="item in child.children" :label="`${item.label}：`">-->
                            <!--                                <el-input v-model="item.value"></el-input>-->
                            <!--                            </el-form-item>-->
                            <!--                        </el-form>-->
                        </div>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="模板选择">

                </el-tab-pane>
                <el-tab-pane label="页面设置">
                    <div style="text-align: center;margin-top: 5px;">
                        <draggable v-model="chooseTemp" @end="tempSort">
                            <div v-for="(item,index) in chooseTemp" style="text-align: left;margin-bottom: 10px;">
                                <span>{{item.title}}</span>
                                <i class="el-icon-refresh" style="float: right;cursor: pointer;color: #409EFF"></i>
                                <i class="el-icon-minus"
                                   style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"
                                   @click="removeTemp(item)"></i>
                                <i class="el-icon-bottom"
                                   style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"
                                   @click="insertTemp(item,index,'after')"></i>
                                <i class="el-icon-top"
                                   style="float:right;cursor: pointer;margin-right: 20px;color: #409EFF"
                                   @click="insertTemp(item,index,'before')"></i>
                            </div>
                            <!--                            <transiton>-->
                            <!--                               预留过渡动画 -->
                            <!--                            </transiton>-->


                        </draggable>

                        <el-button type="primary" circle icon="el-icon-plus" @click="showTempSelector"></el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
        <!--        关联公共模块弹窗-->
        <temp-selector v-if="isShowTempSelector" ref="goodsClassifySelector" :dialogVisible="isShowTempSelector"
                       :isSingle="isSingle"
                       @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></temp-selector>
    </div>
</template>

<script>
    import {insertBatch, selectBatch, deleteBatch, insertOnce, replaceInsertBatch,} from '@/api/temp/columnControl';
    import draggable from 'vuedraggable'

    export default {
        name: "preview",
        data() {
            return {
                plugs: [],
                nowIndex: 0,
                isSingle: false,//是否单选模板
                isShowTempSelector: false,
                chooseTemp: [],//已关联的模板
                moduleStyle: {}
            }
        },
        components: {
            'tempSelector': () => import('@/components/temp/tempSelector'),
            draggable
        },
        created() {
            console.log(this.$route.query, 'route')
            this.getDetail()
        },
        mounted() {
            //console.log(this.$refs.msHead[0].getModule(), 'getModule')

        },
        watch: {
            '$route': function () {
                this.getDetail()
                // console.log('监听到变化')
            },
            chooseTemp: function (val,oldValue) {
                console.log('chooseTemp变化了')

            },
            plugs:function () {
                if(this.$refs.msHead&&this.$refs.msHead.length>0){
                    this.moduleStyle = this.$refs.msHead[0].getModule()
                }

            }
        },
        updated() {
            // console.log(this.chooseTemp, '拖拽发生了变化')
        },
        methods: {
            doSave() {
                this.$refs.msHead[0].setModule(this.moduleStyle)
                console.log(this.$refs.msHead[0].getModule())
            },

            getDetail() {
                selectBatch({id: this.$route.query.id}).then(res => {
                    try {
                        this.chooseTemp = res.data
                        this.chooseTemp.sort(this.sortData)
                        let temp=[]
                        if(this.chooseTemp.length>0){
                            for (let i = 0; i <this.chooseTemp.length ; i++) {
                                try {
                                    temp.push( () =>Promise.resolve(require(`ms-template-manage/src/components/${this.chooseTemp[i].name}`)))
                                }catch (e) {
                                    throw new Error('模板路径错误或模板不存在')
                                }

                            }
                        }
                        this.plugs=temp
                    }catch (e) {
                        console.log('模板加载错误',e)
                    }


                }, error => this.$message.error('查询网页模板失败!' + error))
            },

            tempsClick(index) {
                this.moduleStyle = this.$refs.msHead[index].getModule()
            },
            testBtn(params) {
                console.log(params, 'params')
            },
            uploadImg(res, file) {
                this.$set(this.moduleStyle.style[this.nowIndex], 'value', res.data.url)
            },
            moduleAdd() {

            },
            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.isShowTempSelector = false
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
                    //console.log(this.chooseTemp[this.nowIndex].id,'insertTest')
                    delete data.sort
                    insertOnce(data).then(res => {
                        this.getDetail()
                    }, error => this.$message.error('插入失败!' + error))
                } else {
                    for (let i = 0; i < data.length; i++) {
                        data[i].mid = data[i].id
                        data[i].cid = this.$route.query.id
                        //目前固定公共模板库
                        data[i].type = 1
                        data[i].sort = i
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
                    this.chooseTemp[i].type = 1
                    this.chooseTemp[i].sort = i
                }
                replaceInsertBatch(this.chooseTemp).then(res => {
                    this.getDetail()
                }, error => this.$message.error('模板排序失败!' + error))
            }
        }
    }
</script>
<style scoped>

    .temp-preview-aside {
        height: 100px;
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
</style>

