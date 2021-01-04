import Vue from 'vue';
import echarts from 'echarts';
import Print from 'vue-print-nb'


window.echarts = echarts;
import axios from './router/axios';
import {pcaa} from 'area-data-vue';
import VueAreaLinkage from 'area-linkage-vue';
import AvueUeditor from 'avue-plugin-ueditor';
import VueAxios from 'vue-axios';
import 'area-linkage-vue/dist/index.css';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache';//页面缓冲
import store from './store';
import {loadStyle} from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import i18n from './lang' // Internationalization
import './styles/common.scss';
import './styles/bill.scss';
import 'element-ui/lib/theme-chalk/display.css';
import billContainer from './components/bill-container/bill_container';
import listContainer from './components/bill-container/list_container';
import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'
import msTemplateManage from 'ms-template-manage'

// import JsBarcode from 'jsbarcode'
// Vue.use(JsBarcode);
Vue.prototype.$pcaa = pcaa;
Vue.prototype.$echarts = echarts;

/*是否为SAAS true:SAAS false:erp  ||||  zh.js中更改网站标题*/
Vue.prototype.isSAAS=true

/*云订货跳转地址*/
// Vue.prototype.cloudOrderUrl='http://co-test.520mro.com/#/login' //测试
// Vue.prototype.cloudOrderUrl='http://192.168.1.144:1889/#/login' //本地
Vue.prototype.cloudOrderUrl='http://co.520mro.com/#/login' //正式

/*云发布跳转地址*/
// Vue.prototype.SRMUrl='http://srm-test.520mro.com/#/login' //测试
// Vue.prototype.SRMUrl='http://192.168.1.144:1889/#/login' //本地
Vue.prototype.SRMUrl='http://srm.520mro.com/#/login' //正式

Vue.prototype.SAASShopDefault='http://10018.520mro.com/'//前台商城测试地址



/*固定设置在请求头中的参数*/
Vue.prototype.tenantId=10011



Vue.use(AvueUeditor);
Vue.use(Print);
Vue.use(VueAreaLinkage);
Vue.use(router)
Vue.use(msTemplateManage)
Vue.use(VueAxios, axios)
Vue.use(Element, {
    size: 'mini',
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
    size: 'mini',
    i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('basicBlock', basicBlock)
Vue.component('billContainer', billContainer);
Vue.component('listContainer', listContainer);
// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

/**
 *  过滤对象中字符串类型的前后空格
 */
Vue.prototype.filterObjSpace = function (obj) {
    for (var key in obj) {
        if ((typeof obj[key]) == 'string') {
            obj[key] = obj[key].trim();
        }
    }
    return obj;
};

Vue.prototype.printRecombinationData = function () {
    this.tdsWidth = [];
    this.itemsList = [];
    setTimeout(() => {
        //根据A4纸的宽高进行计算 with:794px height:1123px
        let titleHeight = $('.print-top').outerHeight(true);
        let topTableHeight = 0;
        let hiddenTableHeight = $('.hiddenTable').outerHeight(true);
        let footerHeight = $('.print-footer') && $('.print-footer').length > 0 ? $('.print-footer').outerHeight(true) : 0;
        //计算整个打印div的高度
        let printBoxHeight = titleHeight + topTableHeight + hiddenTableHeight + footerHeight;

        //根据printBoxHeight判断是否需要分页打印
        let pageHeight;//每页的高度
        if (this.isPortrait == 1 && printBoxHeight > 1050) {
            //纵向打印
            pageHeight = 1050;
        } else if (this.isPortrait == 0 && printBoxHeight > 720) {
            //横向打印
            pageHeight = 720;
        } else {
            console.log(pageHeight,'none')
            return;
        }

        const items = this.items;
        //获取每列的宽度，并赋值给打印的表格（确保宽度一致高度才会一致）
        const tds = $('.hiddenTable tr').eq(0).find('td');
        const tdsWidth = [];
        tds.each(function () {
            var tdWidth = $(this).width();
            tdsWidth.push(tdWidth);
        });
        this.tdsWidth = tdsWidth;

        //通过计算表格的高度来判断如何分页
        const trs = $('.hiddenTable tr');
        //表格行高的合计
        let trsHeight = 0;
        //分页数据
        const itemsList = [];
        let list = [];
        trs.each(function (i) {

            var trHeight = $(this).outerHeight(true);
            // 第一页要计算标题及头部表格的高度
            var sumHeight = itemsList.length < 1 ? trsHeight + titleHeight + topTableHeight : trsHeight;
            // 最后一页时要计算底部div的高度
            sumHeight = i == trs.length - 1 ? sumHeight + footerHeight : sumHeight;
            // 允许出现的误差值（包含打印时的默认页边距）
            var errorValue = this.isPortrait == 1 ? 120 : 90;
            //表格标题、表尾的合计,不存入数据
            if (i != 0 && items[i * 1 - 1] && i <= items.length) {
                var obj = items[i * 1 - 1];
                obj.index = i * 1;
                list.push(obj);
            }
            // 计算高度是否超过pageHeight
            if (pageHeight - sumHeight >= errorValue) {
                trsHeight += trHeight;
                //最后一行时
                if (i-1 == items.length) {
                    console.log(i,'*****')
                    itemsList.push({
                        list: list,
                        lastPage: 2
                    });
                    trsHeight = 0;
                    list = [];
                }

            } else {
                if (i <= items.length) {
                    itemsList.push({
                        list: list,
                        lastPage: 3
                    });
                    trsHeight = 0;
                    list = [];
                }
            }
        });
        this.itemsList = itemsList;
    })
};

/**
 * 精确计算小数乘法
 * @param data1 数1
 * @param data2 数2
 * @returns {number} 计算结果
 */
Vue.prototype.accMulti=function(data1, data2) {
    let baseData = 0;
    try { baseData += data1.toString().split(".")[1].length;} catch (e) {}
    try { baseData += data2.toString().split(".")[1].length;} catch (e) {}
    return Number(data1.toString().replace(".", "")) * Number(data2.toString().replace(".", "")) / Math.pow(10, baseData);
}
/**
 * 精确计算两数的商
 * @method division
 * @param {Number} v1 有效数值1  被除数
 * @param {Number} v2 有效数值2  除数
 * @return {Number} 两数值的商
 */
Vue.prototype.division=function(v1,v2){
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
     * 精确计算小数加法
     * @param data1 数1
     * @param data2 数2
     * @returns {number} 计算结果
     */
    Vue.prototype.accAdd=function(data1, data2) {
        let r1, r2, m, c;
        try {  r1 = data1.toString().split(".")[1].length;}catch (e) {  r1 = 0; }
        try { r2 = data2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                data1= Number(data1.toString().replace(".", ""));
                data2= Number(data2.toString().replace(".", "")) * cm;
            } else {
                data1= Number(data1.toString().replace(".", "")) * cm;
                data2= Number(data2.toString().replace(".", ""));
            }
        } else {
            data1= Number(data1.toString().replace(".", ""));
            data2= Number(data2.toString().replace(".", ""));
        }
        return (data1+ data2) / m;
    },

//备用字段
Vue.prototype.formOptionTwo = [
    {
        label: "自定义项一",
        prop: "bak1",
        span: 6,
        display: false,
        is: false
    },
    {
        label: "自定义项二",
        prop: "bak2",
        span: 6,
        display: false,
        is: false
    },
    {
        label: "自定义项三",
        prop: "bak3",
        span: 6,
        display: false
    },
    {
        label: "自定义项四",
        prop: "bak4",
        span: 6,
        display: false,
        is: false
    },
    {
        label: "自定义项五",
        prop: "bak5",
        span: 6,
        display: false,
        is: false
    },
    {
        label: "自定义项六",
        prop: "bak6",
        span: 6,
        display: false,
        is: false
    },];

//入库状态
Vue.prototype.storageStatusOptions = [{
    value: '0',
    label: '待入库'
}, {
    value: '1',
    label: '部分入库'
}, {
    value: '2',
    label: '全部入库'
}];
//发票类型
Vue.prototype.invoiceTypeOptions = [{value: '1', label: '增值税专用发票'}, {value: '2', label: '采购普通发票'}];
//预警类型
Vue.prototype.warningTypeOptions = [{value: '0', label: '全部'}, {value: '1', label: '库存高于上限'}, {
    value: '2',
    label: '库存低于下限'
}];
Vue.prototype.warningTypeOptions1 = [{value: '0', label: '全部'}, {value: '1', label: '上限预警'}, {
    value: '2',
    label: '下限预警'
}];
//收货状态
Vue.prototype.receiptStatusOptions = [{
    value: '0',
    label: '待收货'
}, {
    value: '1',
    label: '部分收货'
}, {
    value: '2',
    label: '全部收货'
}];

//税额
Vue.prototype.taxRateOptions = [
    {
        value: 0,
        label: '0%'
    },
    {
        value: 13,
        label: '13%'
    },
    {
        value: 16,
        label: '16%'
    },
    {
        value: 17,
        label: '17%'
    },
    {
        value: 18,
        label: '18%'
    },
    {
        value: 19,
        label: '19%'
    },
    {
        value: 20,
        label: '20%'
    }
];

/**
 *  自适应单据页表单组件的宽度
 */
Vue.prototype.changeFormWidth = function (_this, formOption) {
    var columnList = _this[formOption].column;
    var width = document.body.clientWidth;
    for (var i in columnList) {
        if (width < 1440) {
            if (columnList[i].span != 24) {
                columnList[i].span = 12;
            }
        } else {
            columnList[i].span = columnList[i].oldSpan;
        }
    }

    _this.$nextTick(() => {
        _this[formOption].column = columnList;
    });
};

/**
 *  单据新增方法
 */
Vue.prototype.handleBillAdd = function (_this, router) {
    router.query = {
        type: 'add' + new Date().getTime()
    };
    router.meta = {
        i18n: router.path.replace('/', '')
    };
    _this.$router.push(router);
};


//单据页面-同意、驳回、重新流转
Vue.prototype.auditBill = async function (_this, formData, subFun, subFunSuccessName) {
    if (_this[formData].taskMap.opinion == '同意') {
        _this.isAgreeLoading = true;
    } else {
        _this.isRejectLoading = true;
    }
    let result = await subFun(_this[formData]).then(response => {
        if (response.data.code == '2000') {
            _this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
            });
        } else {
            _this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
            })
        }
        _this.isAgreeLoading = false;
        _this.isRejectLoading = false;
        return response
    })
    return result
};

//单据页面-根据单据状态控制按钮的显示与隐藏
Vue.prototype.controlButtonShow = function (row, _this) {
    var billStatus;
    if (row.billStatus) {
        billStatus = row.billStatus;
    } else {
        if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
        }
    }
    if (!billStatus) {
        return;
    }

    //add_bill:新增 edit_bill:编辑 delete_bill:删除 import_bill:导入 export_bill:导出
    if (billStatus == 1 || billStatus == 5) {
        //状态1：暂存   新增 编辑 删除 导入 导出
        //状态5：驳回  新增 编辑 删除 导入 导出
        _this.permission.editBtn = true;
        _this.permission.delBtn = true;
    } else if (billStatus == 2 || billStatus == 4) {
        //状态2：流转  新增 导出
        //状态4：正常  新增 导出
        _this.permission.editBtn = false;
        _this.permission.delBtn = false;
    }

};

/**
 *  自适应单据页子表单的高度
 */
Vue.prototype.changeFormHeight = function (columnList, num) {
    if (!num) {
        num = 0;
    }
    var span = 0;
    for (var i in columnList) {
        if (columnList[i].display != false) {
            columnList[i].span = columnList[i].span ? columnList[i].span : 12;
            span = columnList[i].span * 1 + span * 1;
        }
    }
    if (span % 24 != 0) {
        span = span + 24;
    }
    var height = 41 * (parseInt(span / 24)) + num;
    return (160 + height + num) * 1.2;
};

/**
 *  判断是否为空
 */
import {validatenull} from "@/util/validate";

function isEmpty(val) {
    return validatenull(val);
}

Vue.prototype.isEmpty = isEmpty;

//封装Vue.set
Vue.prototype.vueSet = function (obj, index, val) {
    Vue.set(obj, index, val)
};

//收款条件
Vue.prototype.collectionType = [
    {
        value: '1',
        label: '下月月底结算'
    },
    {
        value: '2',
        label: '当天结算'
    }
];

//开票状态
Vue.prototype.invoiceType = [
    {
        value: '0',
        label: '待开票'
    },
    {
        value: '1',
        label: '部分开票'
    },
    {
        value: '2',
        label: '全部开票'
    }
];

//出库状态
Vue.prototype.storageType = [
    {
        value: '0',
        label: '待出库'
    }, {
        value: '1',
        label: '部分出库'
    }, {
        value: '2',
        label: '全部出库'
    }
];

//单据状态
Vue.prototype.orderType = [
    {
        value: '1',
        label: '暂存'
    }, {
        value: '2',
        label: '流转中'
    }, {
        value: '3',
        label: '作废'
    }, {
        value: '4',
        label: '正常'
    }, {
        value: '5',
        label: '回退'
    }
];

//货物类型
Vue.prototype.salesType = [
    {
        value: 0,
        label: '现货'
    }, {
        value: 1,
        label: '期货'
    }
]

//默认税率
Vue.prototype.defaultTaxRate = 13;

//币别
Vue.prototype.currencyOptions = [
    {
        value: '1',
        label: '人民币'
    }, {
        value: '2',
        label: '加元'
    }, {
        value: '3',
        label: '澳元'
    }
];
//状态
Vue.prototype.statusOptions = [{
    value: 1,
    label: '暂存'
}, {
    value: 2,
    label: '流转中'
}, {
    value: 3,
    label: '作废'
}, {
    value: 4,
    label: '正常'
}, {
    value: 5,
    label: '回退'
}];
//开票状态
Vue.prototype.invoiceStatusOptions = [{
    value: 0,
    label: '待开票'
}, {
    value: 1,
    label: '部分开票'
}, {
    value: 2,
    label: '全部开票'
}];
/**
 *  单元格样式
 */
Vue.prototype.cellStyle = function (tableOption, property) {
    let columnIndex = -1;
    for (var i in tableOption.column) {
        if (property && property == tableOption.column[i].prop) {
            columnIndex = i;
        }
    }

    if (columnIndex > -1) {
        const item = tableOption.column[columnIndex];
        return {
            "color": !this.isEmpty(item.textColor) ? item.textColor : undefined,
            "background-color": !this.isEmpty(item.bgColor) ? item.bgColor : undefined
        }
    }
};

Vue.prototype.getRegionInfo = function (list, row, p, c, a, s) {
    for (var i in list) {
        const item = list[i];
        if (typeof item == 'string') {
            return;
        }
        for (var j in item) {
            if (i * 1 == 0) {
                row[p] = item[j];
            }
            if (i * 1 == 1 && p) {
                row[c] = item[j];
            }
            if (i * 1 == 2 && a) {
                row[a] = item[j];
            }
            if (i * 1 == 3 && s) {
                row[s] = item[j];
            }
        }
    }
    return row;
};

Vue.prototype.setRegionInfo = function (list) {
    var arr = [];
    for (var i in list) {
        const item = list[i];
        for (var j in item) {
            arr.push(j);
        }
    }
    return arr;
}

//封装
import {getObj as getSetting, getPageSettings} from "@/api/erp/config/index";

import {getPrepareField} from "@/api/erp/config/index";

Vue.prototype.setList = function (_this, tableName) {
    getSetting(tableName).then(res => {
        _this.isShow = false;
        _this.$nextTick(() => {
                const data = res.data;
                if (data.length > 0) {
                    var index1 = data.findIndex(item => item.type == 0);
                    var index2 = data.findIndex(item => item.type == 1);
                    if (index1 > -1) {
                        let content1 = JSON.parse(data[index1].content);
                        for (let i in content1.column) {
                            if (content1.column[i].textColor && content1.column[i].textColor != '#606266') {
                                let j = i;
                                content1.column[i].renderHeader = h => {
                                    return h(
                                        "span",
                                        {
                                            style: {
                                                color: content1.column[j].textColor
                                            }
                                        },
                                        content1.column[j].label
                                    );
                                }
                            }
                        }
                        _this.billColumn = content1.column;
                        !_this.isDetailed ? _this.tableOption = content1 : '';
                    }
                    if (index2 > -1) {
                        let content2 = JSON.parse(data[index2].content);
                        for (let i in content2.column) {
                            if (content2.column[i].textColor && content2.column[i].textColor != '#606266') {
                                let j = i;
                                content2.column[i].renderHeader = h => {
                                    return h(
                                        "span",
                                        {
                                            style: {
                                                color: content2.column[j].textColor
                                            }
                                        },
                                        content2.column[j].label
                                    );
                                }
                            }
                        }
                        _this.detailedColumn = content2.column;
                        _this.isDetailed ? _this.tableOption = content2 : '';
                    }
                }
                getPrepareField(tableName).then(res => {
                    if (res.data.length > 0) {
                        let list = res.data[0]
                        let content = JSON.parse(list.content);
                        for (let i = _this.billColumn.length - 1; i >= 0; i--) {
                            if (_this.billColumn[i].is == false) {
                                _this.billColumn.splice(i * 1, 1);
                            }
                        }
                        for (let i = _this.detailedColumn.length - 1; i >= 0; i--) {
                            if (_this.detailedColumn[i].is == false) {
                                _this.detailedColumn.splice(i * 1, 1);
                            }
                        }
                        for (let i in content) {
                            _this.billColumn.push({
                                label: content[i].label,
                                prop: content[i].prop,
                                minWidth: 120,
                                align: 'left',
                                search: content[i].display,
                                is: content[i].is,
                                hide: !content[i].display,
                            },)
                        }
                        for (let i in content) {
                            _this.detailedColumn.push({
                                label: content[i].label,
                                prop: content[i].prop,
                                minWidth: 120,
                                align: 'left',
                                is: content[i].is,
                                search: content[i].display,
                                hide: !content[i].display,
                            },)
                        }
                    }
                    if (_this.isDetailed) {
                        _this.tableOption.column = _this.detailedColumn;
                    } else {
                        _this.tableOption.column = _this.billColumn;
                        _this.vueSet(_this.tableOption, 'column', _this.billColumn);
                    }
                    _this.isShow = true;
                }).catch(() => {
                    _this.isShow = true;
                })
            }
        );
    }).catch(() => {
        _this.loading = false;
        _this.searchDisable = false;
    });
}

Vue.prototype.setLists = function (_this, tableName) {
    getPageSettings(tableName).then(res => {
        _this.isShow = false;
        _this.$nextTick(() => {
                const obj = res.data;
                for (let i in obj) {
                    if (obj[i].type == 4) {
                        this.formOptionTwo = JSON.parse(obj[i].content);
                    }
                    if (obj[i].type == 3) {
                        let data = JSON.parse(obj[i].content);
                        for (let i in data.column) {
                            if (data.column[i].is == false) {
                                data.column.splice(i * 1, 1);
                            }
                        }
                        this.formOption1 = data;
                    }
                }
                for (let j in this.formOptionTwo) {
                    if (this.formOptionTwo[j].display == true) {
                        this.formOption1.column.push(this.formOptionTwo[j])
                    }
                }
                _this.isShow = true;
            }
        );
    }).catch(() => {
        _this.loading = false;
        _this.searchDisable = false;
    });
}

/**
 *  自适应列表页表格的高度
 */
Vue.prototype.changeTableHeight = function (_this, className, tableOption, num) {
    if (!num) {
        num = 0;
    }
    if (document.getElementsByClassName(className)[0]) {
        var height = document.getElementsByClassName(className)[0].clientHeight;
    } else {
        var height = 38;
    }
    _this[tableOption].calcHeight = 255 + height + num;
};

/**
 *  单元格样式
 */
Vue.prototype.cellStyle = function (tableOption, property) {
    let columnIndex = -1;
    for (var i in tableOption.column) {
        if (property && property == tableOption.column[i].prop) {
            columnIndex = i;
        }
    }

    if (columnIndex > -1) {
        const item = tableOption.column[columnIndex];
        return {
            "color": !this.isEmpty(item.textColor) ? item.textColor : undefined,
            "background-color": !this.isEmpty(item.bgColor) ? item.bgColor : undefined
        }
    }
};

//消息提示
Vue.prototype.vueMessage = function (type, message) {
    Element.Message({
        message: message,
        type: type,
        duration: 3 * 1000
    });
};

//关闭当前页
Vue.prototype.clocseCurrent = function (_this, tag) {
    var tagList = _this.$store.getters.tagList;
    let r, key;
    tagList.map((item, index) => {
        if (item.value === tag.path) {
            r = item;
            key = index;
        }
    });
    _this.$store.commit("DEL_TAG", r);
};
import Sortable from 'sortablejs'

/**
 *  表格拖拽
 *  refName 表格的ref值
 *  listName 表格绑定的数组名称
 *  showName 控制表格显示与隐藏
 */
Vue.prototype.setTableSort = function (_this, refName, listName, showName) {
    if (!_this.$refs[refName]) {
        return false;
    }
    const el = _this.$refs[refName].$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
    _this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
            dataTransfer.setData('Text', '');
        },
        onEnd: evt => {
            const oldRow = _this[listName][evt.oldIndex];
            if (evt.oldIndex < evt.newIndex) {
                for (var i = evt.oldIndex; i < evt.newIndex; i++) {
                    _this[listName][i] = _this[listName][i + 1]
                }
            } else {
                for (var i = evt.oldIndex; i > evt.newIndex; i--) {
                    _this[listName][i] = _this[listName][i - 1]
                }
            }
            _this[listName][evt.newIndex] = oldRow;

            _this[showName] = false;
            _this.$nextTick(() => {
                _this[showName] = true;
                _this.$nextTick(() => {
                    _this.setTableSort(_this, refName, listName, showName);
                })
            })

        }
    })
};

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;
/**
 *  表格汇总
 *  sumColumnList 需要汇总的字段
 *  len 保留几位小数
 */
Vue.prototype.getSummariesMethod = function (param, sumColumnList) {
    const {columns, data} = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计';
            return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
            const idx = sumColumnList.findIndex(item => item.name == column.property);
            if (idx > -1) {
                if (this.isEmpty(sumColumnList[idx].len)) {
                    sumColumnList[idx].len = this.$store.getters.sysParam.amountDecimal;
                }
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return getFloat(prev + curr, sumColumnList[idx].len);
                    } else {
                        return getFloat(prev, sumColumnList[idx].len);
                    }
                }, 0).toFixed(sumColumnList[idx].len);
                sums[index] += ' ';
            }
        } else {
            sums[index] = ' ';
        }
    });
    return sums;
};

/**
 *  数字四舍五入（保留n位小数） 如：2，会在2后面补上00.即2.00
 */
export const getFloat = function (number, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) return Math.round(number);
    number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n);
    var s = number.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + n) {
        s += '0';
    }
    return parseFloat(s);
}

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
