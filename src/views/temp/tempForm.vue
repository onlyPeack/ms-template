<template>
    <bill-container  :type="type"  ref="billContainer">
        <basic-container v-loading="isLoading">
            <el-button type="primary" plain icon="el-icon-folder-add" @click="handleSubmit">保存</el-button>
            <div class="bill-form-container" style="margin-top: 15px;">
                <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="100px" :inline="false" size="medium">
                    <el-form-item label="模板名：" prop="title">
                        <el-input v-model="addList.title" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="组件名：" prop="name">
                        <el-input v-model="addList.name" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="模板类型：" prop="type">
                        <el-select v-model="addList.type" style="width: 250px;">
                            <el-option v-for="(key,value) in tempType" :label="key" :value="value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板区域：" prop="area">
                        <el-select v-model="addList.area" style="width: 250px;">
                            <el-option v-for="(key,value) in tempArea" :label="key" :value="value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板图片：" prop="pic">
                        <el-upload
                                class="avatar-uploader"
                                action="api/saas/storage/create"
                                :show-file-list="false"
                                accept=".jpg,.jpeg,.png,.svg"
                                :on-success="handleAvatarSuccess">
                            <img v-if="addList.pic" :src="addList.pic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png/svg文件，最多只能上传一张，截取模板全貌　</div>
                        </el-upload>
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
    import {tempType,tempArea} from "./common/dic";
    import {addObj,getObj,putObj} from '@/api/temp/tempControl';
    export default {
        name: "tempForm",
        props: ['type', 'id','title','rowData'],
        data() {
            return {
                tags:[],//商品标签存储数组
                addList:{//新增&编辑&详情商品数据存储对象
                    goods:{//商品信息数据集合
                        picUrl:'',//商品列表图
                        seriesName:'　',//商品系列名
                        brandName:'　',//品牌名
                        categoryName:'　',//商品分类名
                        gallery:[],//商品主图数据集合
                    },
                    items:[{}],//商品关联数据存储数组
                    values:[],//规格参数数据集合
                },
                tempType,
                tempArea,
                rules: {//新增商品表单验证
                    'name': [{required: true, message: '组件名不能为空', trigger: 'blur'}],
                    'title': [{required: true, message: '模板名不能为空', trigger: 'blur'}],
                    'pic': [{required: true, message: '模板图片不能为空', trigger: 'blur'}],
                    'sort': [{required: true, message: '排序不能为空', trigger: 'blur'}],
                    'type': [{required: true, message: '模板类型不能为空', trigger: 'blur'}],
                    'area': [{required: true, message: '模板区域不能为空', trigger: 'blur'}],
                },
                editorOptions:{
                    //普通图片上传
                    action: "api/saas/storage/create",
                    customConfig: {},//wangEditor编辑的配置
                    props: {
                        res: "data",
                        url: "url"
                    },
                },
                tableData:[[]],//新增商品单位价格数据存储数组
                tableHeader:['预设折扣1','预设价格1',],//新增商品单位价格表头数据存储数组
                tableHeaderKey:['presetDiscount1','defaultPrice1'],//新增商品单位价格表头键名数据存储数组
                showSeriesSelector:false,//是否展示商品系列选择框
                showBrandSelector:false,//是否展示商品品牌选择框
                showClassifySelector:false,//是否展示商品分类选择框
                showAllGoodsSelector:false,//是否展示全部商品关联选择框
                MeasureUnit:[],//计量单位存储数组
                goodsTags:[],//商品标签存储数组
                specifications:[],//规格参数数据存储数组
                inputVisible:false,//展示添加商品属性输入框
                specificationTags:[],//商品属性存储数组
                inputValue:'',//商品属性输入框绑定值
                clickRow:Number,//当前关联商品中点击的行索引
                isChooseTags:false,//是否禁用选择标签
                picList:[],//商品列表图存储数组
                galleryList:[],//商品主图存储数组
                isView:false,//是否为详情页
                isLoading: false,//当前是否显示载入状态
                activeName: 'first',//当前标签页
                pidArr:[],//父类目存储数组
            };
        },
        created() {
            this.init()
            if(this.$route.query.flag==='upd'){
                getObj(this.$route.query.id).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=res.data.data
                    }else{
                        this.$message.error('获取公共模板信息失败!'+res.data.msg||res.data.data)
                    }
                },error => this.$message.error('获取公共模板信息失败!'+error))
            }
        },
        methods: {
            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                /*data.type:当前数据返回的是何种数据*/
                if(data.type==='series'){
                    this.addList.goods.seriesName=data.arr.name
                    this.addList.goods.seriesId=data.arr.id
                    if(data.arr.brandName&&data.arr.brandName!==''){
                        this.addList.goods.brandName=data.arr.brandName
                        this.addList.goods.brandId=data.arr.brandId
                    }
                    if(data.arr.seriesName&&data.arr.seriesName!==''){
                        this.addList.goods.categoryName=data.arr.seriesName
                        this.addList.goods.categoryId=data.arr.seriesId
                    }
                    let dtoList=data.arr.dtoList||[]
                    for(let i=0;i<dtoList.length;i++){
                        if(dtoList[i].value){
                            let data={
                                specifications: dtoList[i].specifications,
                                value:dtoList[i].value?dtoList[i].value.split(','):[]
                            }
                            this.specifications.push(data)
                            data={
                                productAttributeName: dtoList[i].specifications,
                            }
                            if(!this.addList.values){
                                this.addList.values=[]
                            }
                            this.addList.values.push(data)
                        }
                    }
                    this.showSeriesSelector=false
                }else if(data.type==='brand'){
                    this.addList.goods.brandName=data.brandName
                    this.addList.goods.brandId=data.brandId
                    this.showBrandSelector=false
                }else if(data.type==='goodsClassify'){
                    this.addList.goods.categoryName=data.seriesName
                    this.addList.goods.categoryId=data.seriesId
                    this.showClassifySelector=false
                }else if(data.type==='allGoods'){
                    for(let i=0;i<data.arr.length;i++){
                        //不允许关联自己
                        if(data.arr[i].id!==this.addList.goods.id){
                            let flag=false
                            for(let j=0;j<this.addList.items.length;j++){
                                //当前行是否为空行 是则替换 否则push
                                if(this.addList.items[j]===null||this.addList.items[j].id){
                                    flag=true
                                }else{
                                    this.$set(this.addList.items,j,data.arr[i])
                                    flag=false
                                    break
                                }
                            }
                            if(flag){
                                this.addList.items.push(data.arr[i])
                            }
                        }
                    }
                    try {
                        let hash={}
                        this.addList.items=this.addList.items.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    }catch (e) {console.log('关联商品去重发生错误,'+e)}
                    //数组去重

                    this.showAllGoodsSelector=false
                }
            },

            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.showSeriesSelector=false
                this.showBrandSelector=false
                this.showClassifySelector=false
                this.showAllGoodsSelector=false
            },

            init() {
                //获取父栏目
            },

            /**
             * 商品保存事件
             */
            handleSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method=this.$route.query.flag==='add'?addObj:putObj
                        let message=this.$route.query.flag==='add'?'公共模板新建':'公共模板修改'
                        let params=Object.assign({},this.addList)
                        method(params).then(res=>{
                            if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                this.$message.success(message+'成功')
                                this.$router.push({
                                    name:'模板管理',
                                    path:'/temp/tempList',
                                    query:{
                                        success:true
                                    }
                                })
                                this.init()
                            }else{
                                this.showError(message+'失败,'+res.data.msg||res.data.data,res.data.code)
                            }
                        },error=>this.showError(message+'失败,'+error))
                    } else {
                        return false;
                    }
                });
            },

            /**
             * 删除新增的预设折扣和预设价格
             */
            deleteTableData(){
                if(this.isView){
                    return false
                }
                if(this.tableHeader.length>2){
                    this.tableHeader.splice(this.tableHeader.length-2)
                    this.tableHeaderKey.splice(this.tableHeaderKey.length-2)
                }
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if (Number(code)===401){
                    this.$message.warning(message)
                }else{
                    this.$message.error(message)
                }
                this.isLoading=false
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message){
                this.$message.success(message)
                this.init()
            },

            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res,file) {
                this.$set(this.addList,'pic',res.data.url)
            },
        },
        watch: {
            '$route': function (to, from) {
                //console.log('监听到了变化')
                if(this.$route.query.flag==='upd'){
                    getObj(this.$route.query.id).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.addList=res.data.data
                        }else{
                            this.$message.error('获取公共模板信息失败!'+res.data.msg||res.data.data)
                        }
                    },error => this.$message.error('获取公共模板信息失败!'+error))
                }else{
                    this.addList={}
                }
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
