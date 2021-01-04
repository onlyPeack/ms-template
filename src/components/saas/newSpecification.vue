<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :nowRow="nowRow"
               :before-close="handleClose" title="规格参数" append-to-body class="public-dialog">
        <div style="font-size: 16px">
            规格参数:　<el-tag :key="index"
                    v-for="(data,index) in specificationTags"
                    closable size="medium"
                    :disable-transitions="false"
                    @close="handleCloseTag(specificationTags,data.specifications,index)">
                {{data.specifications}}
            </el-tag>
            <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="medium"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新规则</el-button>
        </div>

        <div style="font-size: 16px;margin-top: 15px" v-for="(data,index) in specificationTags">
            {{data.specifications}}:　<el-tag
                          v-for="childData in data.value"
                          closable size="medium"
                          :disable-transitions="false"
                          @close="handleCloseTag(data.value,childData.specifications,index)">
            {{childData.specifications}}
        </el-tag>
            <el-input
                    class="input-new-tag"
                    v-if="data.inputChildVisible"
                    v-model="data.inputChildValue"
                    ref="saveTagInput"
                    size="medium"
                    @keyup.enter.native="handleChildInputConfirm(index)"
                    @blur="handleChildInputConfirm(index)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showChildInput(index)">+ 添加属性</el-button>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {updateSpecification} from '@/api/erp/saas/goodsSeries';
    export default {
        props: ['timeStamp','dialogVisible', 'isSingle', 'title','option','typeName','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel','nowRow','specificationTags'],
        name: "newSpecification",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                dialogStatus: '',//当前表单为新建还是编辑
                isLoading:false,//按钮是否显示加载中
                isShow: true,
                searchDisable: true,
                dialogFormVisible:false,//是否展示新增品牌对话框
                addList:{//新增品牌数据存储
                    picUrl:''
                },

                listQuery: {},
                permission: {//顶部按钮显示隐藏
                    addBtn: true,
                    delBtn: true,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                inputVisible: false,//规格参数是否显示输入框
                inputValue: '',
            }
        },
        computed: {
            ids() {
                let ids = [];
                this.selectedRows.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        created() {
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
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
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if(Number(code)===401){
                    this.$message.warning(message)
                }else{
                    this.$message.error(message)
                }
                this.$message.error(message)
                this.isLoading=false
            },

            /**
             * 初始化方法
             */
            init(){
                //初始化所有状态
                this.dialogFormVisible = false
                this.isLoading=false

                this.getList(this.page)
            },

            /**
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },

            /**
             * 确认选择事件
             */
            handleSubmit() {
                let dto={
                    seriesName:this.nowRow.name,
                    seriesId:this.nowRow.id,
                    dtoList:[]
                }
                for (let i = 0; i <this.specificationTags.length ; i++) {
                    let data={
                        specifications: this.specificationTags[i].specifications,
                        value:[]
                    }
                    for (let j = 0; j <this.specificationTags[i].value.length ; j++) {
                        data.value.push(this.specificationTags[i].value[j].specifications)
                    }
                    data.value=data.value.toString()
                    dto.dtoList.push(data)
                }
                updateSpecification(dto).then(res=>{
                    this.$emit('handleSubmit', res);
                })
                //console.log(JSON.stringify(dto))
                //console.log(JSON.stringify(this.nowRow))
                //this.$emit('handleSubmit', dtoList);
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

            showInput() {
                this.inputVisible = true;

            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    let data={
                        value:[],
                        specifications:inputValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                    }
                    this._props.specificationTags.push(data);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            showChildInput(index){
                let data=this._props.specificationTags[index]
                data.inputChildVisible=true
                this.$set(this._props.specificationTags,index,data)
            },

            handleChildInputConfirm(index) {
                let inputChildValue = this._props.specificationTags[index].inputChildValue;
                if (inputChildValue) {
                    let data={
                        value:[],
                        specifications:inputChildValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                    }
                    this._props.specificationTags[index].value.push(data);
                }
                this._props.specificationTags[index].inputChildVisible = false;
                this._props.specificationTags[index].inputChildValue = '';
            },
        }
    }
</script>

<style lang="scss">
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
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

</style>
