<template>
    <bill-container  :type="type"  ref="billContainer">
        <basic-container v-loading="isLoading">
            <button-bar type='form'
                        ref="buttonBar"
                        :marginBottom="10"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="handleSubmit"></button-bar>
            <div class="bill-form-container" style="margin-top: 15px;">
                <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="100px" :inline="true" size="medium">
                    <el-form-item label="栏目标题:" prop="name">
                        <el-input v-model="addList.name" style="width: 250px"></el-input>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="addList.sort" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用:" prop="status">
                        <el-switch v-model="addList.status"  :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="级别:" prop="level">
                        <el-select v-model="addList.level" style="width: 250px">
                            <el-option label="一级栏目" :value="1"></el-option>
                            <el-option label="二级栏目" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属栏目:" prop="pid" v-if="addList.level!==1">
                        <el-select v-model="addList.pid" placeholder="请选择所属类目" style="width: 250px">
                            <el-option v-for="data in pidArr" :label="data.name" :value="data.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <div></div>
                    <el-form-item label="关键字:" prop="keyword" v-if="addList.level!==1">
                        <el-input v-model="addList.keyword" type="textarea" style="width: 800px"></el-input>
                    </el-form-item>
                    <el-form-item label="内容:" prop="content" v-show="addList.level!==1">
                        <avue-ueditor v-model="addList.content" :options="editorOptions"></avue-ueditor>
                    </el-form-item>
                </el-form>
                <div style="height: 50px"></div>
            </div>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addColumn,page,getPidColumn,delColumn,updateColumn,updateColumnStatus} from '@/api/erp/saas/contentControl/columnManager';
    let xss=require('xss')
    export default {
        name: "allGoodsForm",
        props: ['type', 'id','title','rowData'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
        },
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
                rules: {//新增商品表单验证
                    'name': [{required: true, message: '栏目标题不能为空', trigger: 'blur'}],
                    'level': [{required: true, message: '级别不能为空', trigger: 'blur'}],
                    'pid': [{required: true, message: '父类目不能为空', trigger: 'blur'}],
                    'sort': [{required: true, message: '排序不能为空', trigger: 'blur'}],
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
            this.$nextTick(()=>{
                if(this.$route.query.flag==='edit'||this.$route.query.flag==='view'){
                    this.addList=JSON.parse(this.$route.query.columnData)
                }
            })
        },
        destroyed() {},
        updated() {},
        computed: {},
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
                getPidColumn().then(res => {
                    if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                        this.pidArr=res.data.data
                    } else {
                        this.showError("获取父类目失败"+res.data.msg||res.data.data,res.data.code)
                    }
                }, error => this.showError("获取父类目失败"+error))
            },

            /**
             * 商品保存事件
             */
            handleSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method=this.$route.query.flag==='add'?addColumn:updateColumn
                        let message=this.$route.query.flag==='add'?'栏目新建':'栏目修改'
                        let params=Object.assign({},this.addList)
                        if(params.level===1&&params.pid){
                            delete params.pid
                        }
                        params.content=xss(params.content)
                        method(params).then(res=>{
                            if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                this.$message.success(message+'成功')
                                this.$router.push({
                                    name:'栏目管理',
                                    query:{
                                        myRefresh:true
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
             * 增加预设折扣和预设价格
             */
            addTableData(){
                if(this.isView){
                    return false
                }
                if(this.tableHeader.length<9) {
                    let nowIndex = this.tableHeader[this.tableHeader.length - 2].replace(/[^0-9]/ig, "")
                    this.tableHeader.splice(this.tableHeader.length, 0, '预设折扣' + (Number(nowIndex) + 1))
                    this.tableHeader.splice(this.tableHeader.length, 0, '预设价格' + (Number(nowIndex) + 1))
                    this.tableHeaderKey.splice(this.tableHeaderKey.length, 0, 'presetDiscount' + (Number(nowIndex) + 1))
                    this.tableHeaderKey.splice(this.tableHeaderKey.length, 0, 'defaultPrice' + (Number(nowIndex) + 1))
                }else{
                    this.$message.warning('预设折扣和预设价格最多为5个')
                }
            },

            /**
             * 商品列表图上传成功事件
             * @param res 响应数据
             * @param file 图片文件
             */
            goodsListPic(res,file){
                this.addList.goods.picUrl=res.data.url
            },

            /**
             * 商品主图上传成功事件
             * @param res 响应数据
             * @param file 图片文件
             */
            goodsMainPic(res,file){
                this.addList.goods.gallery.push(res.data.url)
            },

            /**
             * 标签删除方法
             * @param arr 当前标签存储数组
             * @param tag 当前标签
             * @param index 当前数组在父数组索引
             */
            handleCloseTag(arr,tag,index) {
                arr.splice(this.specificationTags.indexOf(tag), 1);
            },

            /**
             *展示添加属性名称输入框
             */
            showInput() {
                this.inputVisible = true;
            },

            /**
             * ???
             */
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    let data={
                        value:'',
                        productAttributeName:inputValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                        type:1
                    }
                    this.specificationTags.push(data);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            /**
             * 新增关联商品行
             */
            addAssData(){
                if(this.isView){
                    return false
                }
                this.addList.items.push({})
            },

            /**
             * 删除关联商品行
             * @param index 当前行索引
             */
            deleteAssData(index){
                if(this.isView){
                    return false
                }
                this.addList.items.splice(index,1)
                if(this.addList.items.length===0){
                    this.addList.items=[{}]
                }
            },

            /**
             * 放大镜图标点击事件
             * @param index 当前行索引
             */
            showAssGoods(index){
                if(this.isView){
                    return false
                }
                this.showAllGoodsSelector=true
                this.clickRow=index
            },

            /**
             * 编辑&详情数据格式化
             * @param data 需要格式化的数据
             */
            dataFormat(data){
                try {
                    //Object.assign(this.$data, this.$options.data())
                    //this.editor = new E('#wangEditor')
                    if(this.$route.query.flag==='view') {
                        this.isView = true
                    }
                    if(this.$route.query.flag==='view'||this.$route.query.flag==='edit'){
                        this.isChooseTags=true
                    }
                    data.goods.isOnSale=!Boolean(data.goods.isOnSale)
                    if(data.goods.gallery){
                        data.goods.gallery=data.goods.gallery.split(',')
                        let obj=[]
                        for (let i = 0; i <data.goods.gallery.length ; i++) {
                            obj.push({
                                url:data.goods.gallery[i]
                            })
                        }
                        this.galleryList=obj
                    }

                    /*商品标签处理*/
                    if(data.goods.tags&&data.goods.tags!==''){
                        this.tags=data.goods.tags.split(',')
                    }



                    /*商品列表图数据处理*/
                    if(data.goods.picUrl&&data.goods.picUrl!==''){
                        this.picList=[{
                            url:data.goods.picUrl
                        }]
                    }

                    /*关联商品处理*/
                    data.items=JSON.parse(JSON.stringify(data.item))
                    delete  data.item
                    console.log(data.items,'数据格式化的数组')
                    //如果为空则新建一行空行提供新增
                    if(data.items.length<1){
                        data.items=[{}]
                    }

                    /*规格参数进行组装&&规格参数进行默认填充*/
                    data.values=[]
                    let readyValues=[]
                    for (let i = 0; i <data.specifications.length ; i++) {
                        if(data.specifications[i].value){
                            data.specifications[i].value = data.specifications[i].value.split(',')
                        }else{
                            data.specifications[i].value=''
                        }
                        //商品系列的规格参数与设置的默认值进行匹配
                        for (let j = 0; j <data.productAttributes.length ; j++) {
                            if(data.productAttributes[j].type===0&&(data.productAttributes[j].productAttributeName===data.specifications[i].specifications)){
                                data.values.push({
                                    value:data.productAttributes[j].value
                                })
                            }
                        }
                        readyValues.push({
                            value: ''
                        })
                    }
                    this.specifications=data.specifications//规格参数属性选择值


                    /*商品属性进行清空*/
                    this.specificationTags=[]
                    for (let i = 0; i <data.productAttributes.length ; i++) {
                        if(data.productAttributes[i].type!==0){
                            this.specificationTags.push({
                                value:data.productAttributes[i].value,
                                productAttributeName:data.productAttributes[i].productAttributeName,
                                type:1
                            })
                        }
                    }
                    if(data.goods.presetDiscount5||data.goods.defaultPrice5){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3','预设折扣4','预设价格4','预设折扣5','预设价格5']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3','presetDiscount4','defaultPrice4','presetDiscount5','defaultPrice5']
                    }else if(data.goods.presetDiscount4||data.goods.defaultPrice4){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3','预设折扣4','预设价格4']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3','presetDiscount4','defaultPrice4']
                    }else if(data.goods.presetDiscount3||data.goods.defaultPrice3){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2','预设折扣3','预设价格3']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2','presetDiscount3','defaultPrice3']
                    }else if(data.goods.presetDiscount2||data.goods.defaultPrice2){
                        this.tableHeader=['预设折扣1','预设价格1','预设折扣2','预设价格2']
                        this.tableHeaderKey=['presetDiscount1','defaultPrice1','presetDiscount2','defaultPrice2']
                    }
                    this.tableData=[[data.goods.presetDiscount1||'',data.goods.defaultPrice1||'',data.goods.presetDiscount2||'',data.goods.defaultPrice2||'',data.goods.presetDiscount3||'',data.goods.defaultPrice3||'',data.goods.presetDiscount4||'',data.goods.defaultPrice4||'',data.goods.presetDiscount5||'',data.goods.defaultPrice5||'']]
                    if(data.values.length===0){
                        data.values=readyValues
                    }
                    console.log(data,'格式化完毕',this.specifications)
                    //获取商品标签
                    getAllTag().then(res=>{
                        this.goodsTags=res.data
                    },error=>this.showError('获取商品标签失败'+error))
                }catch (e) {console.log(e,'数据格式化错误')}
                return data
            },

            /**
             * 输入零售价或零售折扣时根据产品面价互相更改
             * @param type 当前输入类型
             */
            computeWithFace(type){
                if (type==='折扣'){
                    this.addList.goods.retailDiscountPrice=this.accMulti(this.addList.goods.retailPrice,this.addList.goods.retailDiscount).toFixed(4)
                    return true;
                }else if(type==='价格'){
                    this.addList.goods.retailDiscount=this.division(this.addList.goods.retailDiscountPrice,this.addList.goods.retailPrice).toFixed(4)
                    return true;
                }
                if(Number(type)%2===0){
                    this.$set(this.tableData[0],type+1,this.accMulti(this.addList.goods.retailPrice,this.tableData[0][type]).toFixed(4))
                }else{
                    this.$set(this.tableData[0],type-1,this.division(this.tableData[0][type],this.addList.goods.retailPrice).toFixed(4))
                }

            },

            /**
             * 精确计算两数的商
             * @method division
             * @param {Number} v1 有效数值1  被除数
             * @param {Number} v2 有效数值2  除数
             * @return {Number} 两数值的商
             */
            division(v1,v2){
                var t1=0,t2=0,n1,n2;
                var s1=v1.toString();
                var s2=v2.toString();
                //获取两数的浮点位数
                try{t1=s1.split(".")[1].length}catch(e){}
                try{t2=s2.split(".")[1].length}catch(e){}
                //去除小数点符号，获取整数
                n1=Number(s1.replace(".",""))
                n2=Number(s2.replace(".",""))
                //两整数相除，乘以10为底数的（除数浮点位数-被除数的浮点位数）
                return (n1/n2)*Math.pow(10,t2-t1);
            },

            /**
             * 精确计算小数乘法
             * @param data1 数1
             * @param data2 数2
             * @returns {number} 计算结果
             */
            accMulti(data1, data2) {
                let baseData = 0;
                try { baseData += data1.toString().split(".")[1].length;} catch (e) {}
                try { baseData += data2.toString().split(".")[1].length;} catch (e) {}
                return Number(data1.toString().replace(".", "")) * Number(data2.toString().replace(".", "")) / Math.pow(10, baseData);
            },
        },
        watch: {
            '$route': function (to, from) {
                console.log('监听到了变化')
                if(this.$route.query.flag==='edit'||this.$route.query.flag==='view'){
                    this.addList=JSON.parse(this.$route.query.columnData)
                }else{
                    this.addList={}
                }
            },
        },
    };
</script>
<style>
    .ql-snow .ql-picker{
        height: unset!important;
    }
    .quill-editor{
        max-height: unset!important;
        height: unset!important;
    }
    .avue-ueditor .ql-editor{
        min-height: 400px;
    }
</style>
