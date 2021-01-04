<template>
    <bill-container :type="type" ref="billContainer">
        <basic-container v-loading="isLoading">
            <el-button type="primary" plain icon="el-icon-folder-add" @click="handleSubmit">保存</el-button>
            <div class="bill-form-container" style="margin-top: 15px;">
                <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right"
                         label-width="120px" :inline="true" size="medium">
                    <el-form-item label="所属栏目：" prop="pidName">
                        <el-input v-model="addList.pidName" disabled="" style="width: 250px"
                                  placeholder="请输入文章标题"></el-input>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="文章标题：" prop="title">
                        <el-input v-model="addList.title" style="width: 250px" placeholder="请输入文章标题"></el-input>
                    </el-form-item>
                    <el-form-item label="发布时间：" prop="releaseTime">
                        <el-date-picker
                                v-model="addList.releaseTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                style="width: 250px"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-input v-model="addList.sort" style="width: 250px"></el-input>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="文章缩略图：" prop="pic">
                        <el-upload
                                class="avatar-uploader"
                                action="api/saas/storage/create"
                                :show-file-list="false"
                                accept=".jpg,.jpeg,.png,.svg"
                                :on-success="handleAvatarSuccess">
                            <img v-if="addList.pic" :src="addList.pic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png/svg文件，最多只能上传一张</div>
                        </el-upload>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="文章描述：" prop="description">
                        <el-input type="textarea" v-model="addList.description" style="width: 1148px"></el-input>
                    </el-form-item>
                    <el-form-item label="文章内容：" prop="content">
                        <avue-ueditor v-model="addList.content" :options="editorOptions"></avue-ueditor>
                    </el-form-item>
                    <el-form-item label="备注：" prop="note">
                        <el-input v-model="addList.note" style="width: 250px"></el-input>
                    </el-form-item>
                </el-form>
                <div style="height: 50px"></div>
            </div>
        </basic-container>

    </bill-container>
</template>

<script>
    import {addObj, getObj, putObj} from '@/api/temp/articleControl';

    export default {
        name: "articleForm",
        props: ['type', 'id', 'title', 'rowData'],
        components: {
            'tempSelector': () => import('@/components/temp/tempSelector'),
        },
        data() {
            return {
                tags: [],//商品标签存储数组
                isHeeler: false,//是否为添加下级状态

                addList: {//新增&编辑数据存储对象
                    type: 0,//栏目类型默认网页
                },
                rules: {//新增商品表单验证
                    'name': [{required: true, message: '栏目名不能为空', trigger: 'blur'}],
                    'link': [{required: true, message: '栏目地址不能为空', trigger: 'blur'}],
                    'pic': [{required: true, message: '模板图片不能为空', trigger: 'blur'}],
                    'sort': [{required: true, message: '排序不能为空', trigger: 'blur'}],
                },
                editorOptions: {
                    //普通图片上传
                    action: "api/saas/storage/create",
                    customConfig: {},//wangEditor编辑的配置
                    props: {
                        res: "data",
                        url: "url"
                    },
                },
                tableData: [[]],//新增商品单位价格数据存储数组
                tableHeader: ['预设折扣1', '预设价格1',],//新增商品单位价格表头数据存储数组
                tableHeaderKey: ['presetDiscount1', 'defaultPrice1'],//新增商品单位价格表头键名数据存储数组
                showSeriesSelector: false,//是否展示商品系列选择框
                showBrandSelector: false,//是否展示商品品牌选择框
                showClassifySelector: false,//是否展示商品分类选择框
                showAllGoodsSelector: false,//是否展示全部商品关联选择框
                MeasureUnit: [],//计量单位存储数组
                goodsTags: [],//商品标签存储数组
                specifications: [],//规格参数数据存储数组
                inputVisible: false,//展示添加商品属性输入框
                specificationTags: [],//商品属性存储数组
                inputValue: '',//商品属性输入框绑定值
                clickRow: Number,//当前关联商品中点击的行索引
                isChooseTags: false,//是否禁用选择标签
                picList: [],//商品列表图存储数组
                galleryList: [],//商品主图存储数组
                isView: false,//是否为详情页
                isLoading: false,//当前是否显示载入状态
                activeName: 'first',//当前标签页
                pidArr: [],//父类目存储数组
                typeMap: {
                    0: '网页',
                    1: '模块',
                    2: '栏目',
                    3: '文章'
                }
            };
        },
        created() {
            this.init()
            if (this.$route.query.flag === 'upd') {
                getObj(this.$route.query.id).then(res => {
                    if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                        this.addList = res.data.data
                    } else {
                        this.$message.error('获取公共模板信息失败!' + res.data.msg || res.data.data)
                    }
                }, error => this.$message.error('获取公共模板信息失败!' + error))
            }


            this.addList.pid = this.$route.query.pid
            this.addList.pidName = this.$route.query.pidName

        },
        methods: {
            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                this.isShowTempSelector = false
                console.log(data, '这是选中的模板')

            },

            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.isShowTempSelector = false
            },

            showTempSelector() {
                this.isShowTempSelector = true
            },


            init() {

            },

            /**
             * 商品保存事件
             */
            handleSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method = this.$route.query.flag === 'add' ? addObj : putObj
                        let message = this.$route.query.flag === 'add' ? '文章新建' : '文章修改'
                        let params = Object.assign({}, this.addList)
                        method(params).then(res => {
                            if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                                this.$message.success(message + '成功')
                                this.$router.push({
                                    name: '文章管理',
                                    path: '/temp/articleList',
                                    query: {
                                        success: true
                                    }
                                })
                                this.init()
                            } else {
                                this.showError(message + '失败,' + res.data.msg || res.data.data, res.data.code)
                            }
                        }, error => this.showError(message + '失败,' + error))
                    } else {
                        return false;
                    }
                });
            },

            /**
             * 删除新增的预设折扣和预设价格
             */
            deleteTableData() {
                if (this.isView) {
                    return false
                }
                if (this.tableHeader.length > 2) {
                    this.tableHeader.splice(this.tableHeader.length - 2)
                    this.tableHeaderKey.splice(this.tableHeaderKey.length - 2)
                }
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message, code) {
                if (Number(code) === 401) {
                    this.$message.warning(message)
                } else {
                    this.$message.error(message)
                }
                this.isLoading = false
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message) {
                this.$message.success(message)
                this.init()
            },

            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.$set(this.addList, 'pic', res.data.url)
            },

            testIN() {
                console.log(this.addList, 'test')
            }
        },
        watch: {
            '$route': function (to, from) {
                //console.log('监听到了变化')

                this.addList.pid = this.$route.query.pid
                this.addList.pidName = this.$route.query.pidName

            },
        },
    };
</script>
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
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
