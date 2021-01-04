<template>
    <basic-container>
        <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-top: 10px;">
            <div style="width: 3px;height: 30px;background: #559EFE;margin-right: 19px;"></div>
            <span style="color: #20222A;font-size: 16px;">首页设置</span>
        </div>
        <div v-for="(item,index) in list">
            <div class="homePage" v-if="item.type != 3">
                <div class="homePageTitle">
                    <span>{{item.title}}</span>
                    <span v-if="item.type == 1" style="color: #999999;font-size: 14px;">&nbsp;&nbsp;&nbsp;(首页显示卡片最多可添加4个）</span></div>
                <div class="homePageConent">
                    <el-switch v-for="(val,index) in item.listData"
                               v-model="val.show"
                               :inactive-text="val.label" style="width:auto;height: 40px;margin-right: 3.9rem;">
                    </el-switch>
                </div>
            </div>
            <div v-else class="homePage">
                <span class="homePageTitle">{{item.title}}</span>
                <div class="homePageConentLast">
                    <el-radio v-model="item.radio" label="1" style="margin-bottom: 10px;" @change="radioBtn(item.radio)">默认，系统自动取点击量排名前八6页面</el-radio>
                    <el-radio v-model="item.radio" label="2" @change="radioBtn(item.radio)">自定义<font style="color: #999999;">&nbsp;&nbsp;(首页常用功能最多只能添加9个）</font></el-radio>

                    <div class="homePageConentLastMemu">
                        <div class="homePageConentLastMemuItem" v-for="(val,indexs) in item.listData">
                            <div v-if="val.type == 0" @click="memuItem(indexs,item.radio)" class="homePageConentLastMemuItemConent">
                               <i class="el-icon-plus" style="font-size: 50px;color: #DCDFE6;"></i>
                            </div>
                            <div v-else  class="homePageConentLastMemuItemConent">
                                <div style="position: absolute;right:2px;top: 2px;" v-if="item.radio !='1'">
                                    <i class="el-icon-delete" @click="deleteBtn(indexs)"></i>
                                </div>
                                <img :src="val.imgUrl" style="width: 60px;height: 60px;margin: 0px 20px 8px 20px;"/>
                                <span>{{val.title}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-button type="primary" v-loading="formLoading" style="margin-top: 40px;"  @click="handleSubmint">保 存</el-button>
        <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
                   :before-close="handleClose" title="请选择菜单" append-to-body class="public-dialog">
            <div>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {addPageSetting, getPageSetting} from "@/api/erp/config/index";
    export default {
        name: "page_setting",
        data() {
            return {
                dialogVisible: false,
                formLoading: false,
                list: [
                    {
                        type: 0,
                        title: '显示栏目',
                        listData: [
                            {
                                label: '统计卡片',
                                show: true,
                            },
                            {
                                label: '待办任务',
                                show: true,
                            },
                            {
                                label: '数据报表',
                                show: true,
                            },
                            {
                                label: '常用功能',
                                show: true,
                            }
                        ]
                    },
                    {
                        type: 1,
                        title: '统计卡片',
                        content:'(首页显示卡片最多可添加4个）',
                        listData:[
                            {
                                label: '当前库存',
                                show: true,
                                title: this.$t("wel.data.column1"),
                                text: this.$t("wel.data.text1"),
                                key: this.$t("wel.data.key1"),
                            },
                            {
                                label: '本月销售和采购',
                                show: true,
                                title: this.$t("wel.data.column2"),
                                text: this.$t("wel.data.text2"),
                                key: this.$t("wel.data.key2"),
                            },
                            {
                                label: '往来欠款',
                                show: true,
                                title: this.$t("wel.data.column3"),
                                text: this.$t("wel.data.text3"),
                                key: this.$t("wel.data.key3"),
                            },
                            {
                                label: '本月出库统计',
                                show: true,
                                title: this.$t("wel.data.column4"),
                                text: this.$t("wel.data.text4"),
                                key: this.$t("wel.data.key4"),
                            },
                            {
                                label: '本月收款付款',
                                show: false,
                                title: this.$t("wel.data.column5"),
                                text: this.$t("wel.data.text5"),
                                key: this.$t("wel.data.key5"),
                            },
                            {
                                label: '本月客户数',
                                show: false,
                                title: this.$t("wel.data.column6"),
                                text: this.$t("wel.data.text6"),
                                key: this.$t("wel.data.key6"),
                            },
                        ]
                    },
                    {
                        type: 2,
                        title: '统计图表',
                        listData:[
                            {
                                label: '销售金额和回款统计',
                                show: true,
                            },
                            {
                                label: '采购金额统计',
                                show: true,
                            },
                            {
                                label: '库存资金和数量统计',
                                show: true,
                            },
                            {
                                label: '应收已收分析',
                                show: true,
                            },
                        ]
                    },
                    {
                        type: 3,
                        title: '常用功能',
                        radio: '2',
                        listData:[
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/purchaseOrder1.png',
                                title: '采购订单',
                                code: 'purchase_order',
                            },
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/orderSales1.png',
                                title: '销售订单',
                                code: 'customer_order',
                            },
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/receipt1.png',
                                title: '收款单',
                                code: 'sales-receivable',
                            },
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/paymentNote1.png',
                                title: '付款单',
                                code: 'purchase-payment',
                            },
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/transferOrder1.png',
                                title: '商品调拨单',
                                code: 'allocation_stock_out',
                            },
                            {
                                type: 1,
                                imgUrl: 'http://hejigy.com.cn/InventorySheet1.png',
                                title: '库存盘点单',
                                code: 'check_stock',
                            },
                            {
                                type: 0,
                                imgUrl: '',
                                title: '',
                                code: '',
                            },
                            {
                                type: 0,
                                imgUrl: '',
                                title: '',
                                code: '',
                            },
                            {
                                type: 0,
                                imgUrl: '',
                                title: '',
                                code: '',
                            },
                        ]
                    }
                ],
                handleData: {},
                data:[],
                memuIndex:0,
                defaultProps: {
                    children: 'children',
                    label: 'title'
                }
            }
        },
        created() {
            this.data = this.$store.getters.menu;
            getPageSetting().then(res=>{
                if(res.data.data){
                    this.list= res.data.data
                }
            })
        },
        methods: {
            handleSubmint(){
                let sum = 0;
                let sumTree =0;
                for(let i in this.list[1].listData){
                    if(this.list[1].listData[i].show){
                        sum++;
                    }
                }
                for(let i in this.list[2].listData){
                    if(this.list[2].listData[i].show){
                        sumTree++;
                    }
                }

                if(this.list[0].listData[0].show && sum>4){
                    this.vueMessage('warning','统计卡片最多展示四张卡片!');
                    return
                }
                if(this.list[0].listData[2].show && sumTree<1){
                    this.vueMessage('warning','统计图表至少选择一个!');
                    return
                }
                if(this.list[0].listData[2].show && sumTree<1){
                    this.vueMessage('warning','统计图表至少选择一个!');
                    return
                }
                this.formLoading = true;
                addPageSetting(this.list).then((res) => {
                    this.formLoading = false;
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                    getPageSetting().then(ress=>{
                        this.list= ress.data.data;
                    })

                    this.$router.push({
                        path: '/process',
                        name: '初始化流程',
                        meta: {
                            i18n: '/process'
                        },
                        query: {
                            timeStamp: new Date().getTime()
                        },
                    });
                    this.$router.replace({
                        path: '/refresh',
                        query: {
                            date: Date.now()
                        }
                    });
                    // window.location.reload()
                }, error => {
                    this.formLoading = false;
                });
            },
            radioBtn(val){
                if(val == '1'){
                   this.list[3].listData=[
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/purchaseOrder1.png',
                           title: '采购订单',
                           code: 'purchase_order',
                       },
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/orderSales1.png',
                           title: '销售订单',
                           code: 'customer_order',
                       },
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/receipt1.png',
                           title: '收款单',
                           code: 'sales-receivable',
                       },
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/paymentNote1.png',
                           title: '付款单',
                           code: 'purchase-payment',
                       },
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/transferOrder1.png',
                           title: '商品调拨单',
                           code: 'allocation_stock_out',
                       },
                       {
                           type: 1,
                           imgUrl: 'http://hejigy.com.cn/InventorySheet1.png',
                           title: '库存盘点单',
                           code: 'check_stock',
                       },
                       {
                           type: 0,
                           imgUrl: '',
                           title: '',
                           code: '',
                       },
                       {
                           type: 0,
                           imgUrl: '',
                           title: '',
                           code: '',
                       },
                       {
                           type: 0,
                           imgUrl: '',
                           title: '',
                           code: '',
                       },
                   ]
                }else{
                    this.list[3].listData=[
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/purchaseOrder1.png',
                            title: '采购订单',
                            code: 'purchase_order',
                        },
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/orderSales1.png',
                            title: '销售订单',
                            code: 'customer_order',
                        },
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/receipt1.png',
                            title: '收款单',
                            code: 'sales-receivable',
                        },
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/paymentNote1.png',
                            title: '付款单',
                            code: 'purchase-payment',
                        },
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/transferOrder1.png',
                            title: '商品调拨单',
                            code: 'allocation_stock_out',
                        },
                        {
                            type: 1,
                            imgUrl: 'http://hejigy.com.cn/InventorySheet1.png',
                            title: '库存盘点单',
                            code: 'check_stock',
                        },
                        {
                            type: 0,
                            imgUrl: '',
                            title: '',
                            code: '',
                        },
                        {
                            type: 0,
                            imgUrl: '',
                            title: '',
                            code: '',
                        },
                        {
                            type: 0,
                            imgUrl: '',
                            title: '',
                            code: '',
                        },
                    ]
                }
            },
            handleSubmit(){
                if(this.handleData.length>0){
                    this.vueMessage('warning','请选择子节点!');
                }else{
                    this.list[3].listData[this.memuIndex].type = 1;
                    this.list[3].listData[this.memuIndex].title = this.handleData.title;
                    this.list[3].listData[this.memuIndex].code = this.handleData.code;
                    this.dialogVisible = false;
                }

            },
            deleteBtn(index){
                this.list[3].listData[index].type = 0;
                this.list[3].listData[index].title = '';
                this.list[3].listData[index].code = '';
                this.list[3].listData[index].imgUrl = '';
            },
            memuItem(index,type){
                if(type == '1'){
                    this.vueMessage('warning','当前为系统默认显示!');
                    return
                }
                this.dialogVisible = true;
                this.memuIndex = index;
            },
            handleClose(){
                this.dialogVisible = false;
            },
            handleNodeClick(data) {
                this.handleData = data;
            }
        }
    }
</script>

<style lang="scss" scoped>
.homePage{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    >div{
        margin-left: 21px;
        margin-right: 21px;
    }
    .homePageTitle{
        display: inline-block;
        font-size: 15px;
        margin: 20px 21px;
    }
    .homePageConent{
        padding: 15px 20px;
        border: 1px solid #CCCCCC;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
    }
    .homePageConentLast{
        padding: 20px;
        border: 1px solid #CCCCCC;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .homePageConentLastMemu{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .homePageConentLastMemuItem{
                .homePageConentLastMemuItemConent{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 100px;
                    height: 100px;
                    text-align: center;
                    position: relative;
                }
                display: flex;
                flex-direction: column;
                justify-content: center;
                border: 1px solid #CCCCCC;
                border-radius: 4px;
                width: 100px;
                height: 100px;
                font-size: 14px;
                align-items: center;
                margin: 15px;
                cursor: pointer;
            }

        }
    }
}
</style>