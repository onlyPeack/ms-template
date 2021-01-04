//身份类型
let userType = [
    {
        value: '0',
        label: '普通身份'
    },
    {
        value: '0',
        label: '超级管理员'
    }
]

let taxRateOptions = [
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

//订单状态
let orderType = [
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

//交货方式
let collectionType = [
    {
        value: '1',
        label: '下月月底结算'
    },
    {
        value: '2',
        label: '当天结算'
    }
];

//客户订货单状态
let storageType = [
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

//采购订单-出库状态
let storageStatusOptions = [
    {
        value: '0',
        label: '待入库'
    }, {
        value: '1',
        label: '部分入库'
    }, {
        value: '2',
        label: '全部入库'
    }
];

//采购订单-收货状态
let receiptStatusOptions = [
    {
        value: '0',
        label: '待收货'
    }, {
        value: '1',
        label: '部分收货'
    }, {
        value: '2',
        label: '全部收货'
    }
];

//全局弹框单据公共样式
const publicOption = {
    height: 320,
    tip: false,
    border: true,
    index: true,
    indexLabel: '序号',
    columnBtn: false,//列显示隐藏
    menu: false,
    addBtn: false,
    refreshBtn: false,//刷新
    searchBtn: false,//搜索显隐按钮
    selection: true
};

//客户表格:@/api/erp/crm/customer/index
const customerColumn = {
    column: [
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 170,
            overHidden:true,
            search: true,
            align: 'left'
        },
    ]
};
//报销人
const capitalAccountColumn = {
    column: [
        {
            label: "账户号",
            prop: "accountCode",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "账户名称",
            prop: "name",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left'
        },
    ]
};
//科目
const subjectColumn = {
    column: [
        {
            label: "科目编码",
            prop: "number",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "科目名称",
            prop: "name",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left'
        },
    ]
};
//报销人
const accountColumn = {
    column: [
        {
            label: "账户号",
            prop: "accountCode",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "账户名称",
            prop: "name",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left'
        },
    ]
};

//业务员表格:@/api/admin/user/index
const userColumn = {
    column: [
        {
            label: "姓名",
            prop: "name",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "账户",
            prop: "username",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "性别",
            prop: "sex",
            minWidth: 80,
            overHidden:true,
            align: 'left'
        },
        {
            label: "角色",
            prop: "position",
            minWidth: 80,
            overHidden:true,
            align: 'left',
        },
    ]
}

//关联合同@/api/erp/sales/bill/salesContract
const sourceColumn = {
    column: [
        {
            label: "合同编号",
            prop: "billNo",
            minWidth: 140,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "合同名称",
            prop: "contractName",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left',
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 190,
            overHidden:true,
            search: true,
            align: 'left',
        },
        {
            label: "业务员",
            prop: "salerName",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left',
        },
        {
            label: "合同金额",
            prop: "contractAmount",
            minWidth: 80,
            overHidden:true,
            align: 'right',
            slot: true
        },
        {
            label: "商品编码",
            prop: "skuNo",
            minWidth: 120,
            overHidden:true,
            align: 'left'
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 120,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 85,
            overHidden:true,
            hide: true
        },
        {
            label: "品牌名",
            prop: "brandName",
            minWidth: 80,
            overHidden:true,
            hide: true
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "单价",
            prop: "price",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "税额",
            prop: "tax",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 80,
            overHidden:true,
            align: 'right'
        },
        {
            label: "出库数量",
            prop: "stockOutQty",
            minWidth: 80,
            overHidden:true,
            align: 'right',
            slot: true
        },
        {
            label: "客户订货数量",
            prop: "customerOrderQty",
            minWidth: 100,
            overHidden:true,
            align: 'right',
            slot: true
        },
        {
            label: "签约日期",
            prop: "contractDate",
            minWidth: 140,
            overHidden:true,
            search: true,
            align: 'left',
            slot: true,
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '签约开始日期',
            endPlaceholder: '签约结束日期',
            searchSpan: 12,
        },
        {
            label: "生效日期",
            prop: "effectiveDate",
            minWidth: 140,
            overHidden:true,
            search: true,
            align: 'left',
            slot: true,
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '生效开始日期',
            endPlaceholder: '生效结束日期',
            searchSpan: 12,
        },
        {
            label: "到期日期",
            prop: "disabledDate",
            minWidth: 140,
            overHidden:true,
            search: true,
            align: 'left',
            slot: true,
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '到期开始日期',
            endPlaceholder: '到期结束日期',
            searchSpan: 12,
        },
    ]
};

//商品
const commodityColumn = {
    column: [
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 120,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "分类名称",
            prop: "categoryName",
            minWidth: 100,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "品牌名称",
            prop: "brandName",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "系列名称",
            prop: "seriesName",
            minWidth: 80,
            overHidden:true,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "可用库存",
            prop: "stockQty",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "面价",
            prop: "retailPrice",
            minWidth: 80,
            align: 'right'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
    ]
}

//项目订单
const relationColumn = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 120,
            align: 'left'
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left'
        },
        {
            label: "销售员编号",
            prop: "salesCode",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "销售员姓名",
            prop: "salesName",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 100,
            align: 'left'
        },
    ]
}

const relatioColumn = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 120,
            align: 'left'
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left'
        },
        {
            label: "销售员编号",
            prop: "salesCode",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "销售员姓名",
            prop: "salesName",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 100,
            align: 'left'
        },
    ]
}

//项目订单-明细
const relationsColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 160,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 140,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            search: true,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "缺货数量",
            prop: "qhqty",
            minWidth: 100,
            align: 'right',
        },
        {
            label: "单价",
            prop: "price",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税金额",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 140,
            align: 'left'
        },
    ]
}

//生产订单
const manufactureColumn = {
    column: [
        {
            label: "项目编号",
            prop: "projectBillNo",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "生产订单号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left'
        },
        {
            label: "销售员编号",
            prop: "salesCode",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "销售员姓名",
            prop: "salesName",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "生产人员编号",
            prop: "produceCode",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "生产人员姓名",
            prop: "produceName",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "技术人员编号",
            prop: "skillCode",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "技术人员姓名",
            prop: "skillName",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "交货日期",
            prop: "goodsDate",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 150,
            align: 'left'
        },
    ]
}

//生产订单-详情
const manufacturesColumn = {
    column: [
        {
            label: "生产订单号",
            prop: "productBillNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "项目订单号",
            prop: "projectBillNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            align: 'left',
            search: true,
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            align: 'left',
            search: true,
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

const manufacturessColumn = {
    column: [
        {
            label: "单据编号",
            prop: "projectBillNo",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            align: 'left',
            search: true,
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            align: 'left',
            search: true,
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

//报工历史
const workerColumn = {
    height: 350,
    tip: false,
    border: true,
    index: true,
    indexLabel: '序号',
    columnBtn: false,//列显示隐藏
    refreshBtn: false,//刷新
    searchBtn: false,//搜索显隐按钮
    searchSpan: 4,
    showSummary: true,
    addBtn: false,//新增
    saveBtn: false,
    updateBtn: false,
    cancelBtn: false,
    delBtn: false,
    editBtn: false,
    page: false,
    align: 'center',
    menuAlign: 'center',
    column: [
        {
            label: "编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "项目编号",
            prop: "billProjectNo",
            minWidth: 150,
            align: 'left',
            search: true,
        },
        {
            label: "任务名称",
            prop: "billDate",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "任务类型",
            prop: "customerCode",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "任务描述",
            prop: "customerName",
            minWidth: 180,
            align: 'left'
        },
        {
            label: "规划日程",
            prop: "salesCode",
            minWidth: 150,
            align: 'right'
        },
        {
            label: "截止日期",
            prop: "salesName",
            minWidth: 150,
            align: 'right'
        },
        {
            label: "报工工时",
            prop: "produceCode",
            minWidth: 150,
            align: 'right'
        },
    ]
}

//派工历史
const dispatchersColumn = {
    column: [
        {
            label: "编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "工序",
            prop: "workOn",
            minWidth: 140,
            align: 'left',
            search: true,
        },
        {
            label: "要求",
            prop: "demand",
            minWidth: 150,
            align: 'left',
        },
        {
            label: "本次下达数量",
            prop: "releaseQty",
            minWidth: 150,
            align: 'left',
        },
        {
            label: "操作员",
            prop: "skillName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "操作员编号",
            prop: "skillCode",
            minWidth: 140,
            align: 'left',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

//工序
const processesColumn = {
    column: [
        {
            label: "工序名称",
            prop: "workName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "工序质量要求",
            prop: "workQuality",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "使用工具",
            prop: "tool",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "检验方式",
            prop: "inspectWay",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 160,
            align: 'left'
        }
    ]
}

//工艺
const technologyColumn = {
    column: [
        {
            label: "工艺名称",
            prop: "craftName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 150,
            align: 'left'
        },
    ]
}

//客户订货单
const customerOrderColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 140,
            search: true,
            align: 'left',
        },
        {
            label: "仓库",
            prop: "warehouseName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left',
            search: true,
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left',
            search: true,
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            align: 'left',
            search: true,
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 80,
            align: 'left'
        },
        // {
        //     label: "订单类型",
        //     prop: "salesType",
        //     minWidth: 80,
        //     overHidden:true,
        //     align: 'left',
        //     type: 'select',
        //     dicData: [
        //         {
        //             value: 0,
        //             label: '现货'
        //         },
        //         {
        //             value: 1,
        //             label: '期货'
        //         },
        //     ],
        // },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'right',
            // search: true,
        },
        // {
        //     label: "缺货数量",
        //     prop: "qhqty",
        //     minWidth: 100,
        //     align:'right',
        //     search: true,
        // },
        {
            label: "单价",
            prop: "price",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税金额",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "销售员编号",
            prop: "salerCode",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "销售员姓名",
            prop: "salerName",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 140,
            align: 'left'
        },
    ]
}

//出库仓库
const warehouseColum = {
    column: [
        {
            label: "仓库名称",
            prop: "name",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "仓库管理员",
            prop: "managerName",
            minWidth: 150,
            align: 'left'
        },
    ]
}

//供应商
const purchaseColum = {
    column: [
        {
            label: "供应商编号",
            prop: "supplierCode",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "供应商姓名",
            prop: "supplierName",
            minWidth: 150,
            align: 'left'
        },
    ]
}

const applysColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "采购员工号",
            prop: "purchaserCode",
            minWidth: 120,
            search: true,
            align: 'left',
        },
        {
            label: "采购员姓名",
            prop: "purchaserName",
            minWidth: 100,
            search: true,
            align: 'left',
        },
        {
            label: "采购员部门",
            prop: "departName",
            minWidth: 200,
            align: 'left',
        },
        {
            label: "供应商",
            prop: "supplierName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "本次到票金额",
            prop: "taxAmount",
            minWidth: 180,
            align: 'left',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "本次到票金额"
                );
            },
        },
        {
            label: "不含税金额",
            prop: "amount",
            minWidth: 120,
            align: 'left',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "不含税金额"
                );
            },
        },
        {
            label: "税额",
            prop: "tax",
            minWidth: 120,
            align: 'left',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "税额"
                );
            },
        },
        {
            label: "发票代码",
            prop: "invoiceCode",
            minWidth: 160,
            align: 'left',
        },
        {
            label: "发票号码",
            prop: "invoiceNo",
            minWidth: 160,
            align: 'left',
        },
        {
            label: "开票日期",
            prop: "invoiceDate",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "收票日期",
            prop: "invoiceDate",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        }
    ]
}

//采购申请单
const applyColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 80,
            align: 'left'
        },
        {
            label: "已申请数量",
            prop: "applyQty",
            minWidth: 120,
            align: 'right'
        },
        {
            label: "已做采购数量",
            prop: "purchasedQty",
            minWidth: 120,
            align: 'right'
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 150,
            align: 'left'
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 180,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//采购订单
const purchasesColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 80,
            align: 'left'
        },
        {
            label: "采购数量",
            prop: "qty",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "入库数量",
            prop: "stockInPurchaseQty",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "未入库数量",
            prop: "notStockInPurchaseQty",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "入库状态",
            prop: "storageStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: storageStatusOptions,
        },
        {
            label: "源单单号",
            prop: "sourceBillNo",
            minWidth: 150,
            align: 'right'
        },
        {
            label: "付款单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "税率",
            prop: "taxRate",
            minWidth: 100,
            type: 'select',
            dicData: taxRateOptions,
            align: 'right'
        },
        {
            label: "不含税单价",
            prop: "price",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
        },
        {
            label: "入库金额",
            prop: "stockInPurchaseAmount",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "未入库金额",
            prop: "notStockInPurchaseAmount",
            minWidth: 100,
            align: 'right'
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 160,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 150,
            align: 'left'
        },
    ]
}

//仓位
const positionColum = {
    column: [
        {
            label: "仓位名称",
            prop: "name",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "所属仓库",
            prop: "warehouseName",
            minWidth: 150,
            align: 'left'
        },
    ]
}

//领料出库单
const materialColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "单据状态",
            prop: "billStatus",
            minWidth: 80,
            align: 'left',
            type: 'select',
            dicData: orderType,
            search: true,
            searchFilterable: true
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "品牌",
            prop: "brandName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "领料数量",
            prop: "qty",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "退料数量",
            prop: "returnQty",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "货架",
            prop: "positionName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 160,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//采购入库单
const ordersColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "供应商编号",
            prop: "supplierCode",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "供应商名称",
            prop: "supplierName",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "采购员工号",
            prop: "purchaserCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "采购员姓名",
            prop: "purchaserName",
            minWidth: 100,
            search: true,
            align: 'left',
        },
        {
            label: "采购员部门",
            prop: "departName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "入库仓库",
            prop: "warehouseName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "金额",
            prop: "billAmount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "价税合计",
            prop: "taxBillAmount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 120,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//采购入库单详情
const ordersColums = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 80,
            type: 'select',
            align: 'left',
            dicData: orderType,
        },
        {
            label: "供应商编号",
            prop: "supplierCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "供应商名称",
            prop: "supplierName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "采购员编号",
            prop: "purchaserCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "采购员",
            prop: "purchaserName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "采购部门",
            prop: "departName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "到货仓库",
            prop: "warehouseName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "商品编码",
            prop: "skuNo",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'right',
        },
        {
            label: "单价",
            prop: "price",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "税额",
            prop: "tax",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "入库数量",
            prop: "qty",
            minWidth: 80,
            align: 'right',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 180,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//销售出库单
const salesColum = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "单据状态",
            prop: "billStatus",
            minWidth: 80,
            align: 'left',
            type: 'select',
            dicData: orderType,
            search: true,
            searchFilterable: true
        },
        {
            label: "仓位",
            prop: "positionName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            search: true,
            align: 'right',
        },
        {
            label: "单价",
            prop: "price",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000"
        },
        {
            label: "税率",
            prop: "taxRate",
            minWidth: 80,
            align: 'right',
        },
        {
            label: "税额",
            prop: "tax",
            minWidth: 80,
            align: 'right',
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'left',
            textColor: "#ff0000"
        },
        {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 100,
            align: 'left',
            textColor: "#ff0000"
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 180,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//角色
const positionColumn = {
    column: [
        {
            label: "姓名",
            prop: "name",
            minWidth: 150,
            search: true,
            align: 'left'
        },
    ]
}

const collectColumn = {
    column: [
        {
            label: "收货人",
            prop: "name",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "收货电话",
            prop: "phoneNumber",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "收货地址",
            prop: "address",
            minWidth: 150,
            search: true,
            align: 'left'
        },
    ]
}

//销售订单-明细
const customerOrderColumn = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        // {
        //     label: "单据状态",
        //     prop: "billStatus",
        //     minWidth: 80,
        //     align: 'left',
        //     type: 'select',
        //     dicData: orderType,
        //     search: true,
        //     searchFilterable: true
        // },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 180,
            align: 'left',
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left'
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'left',
        },
        // {
        //     label: "缺货数量",
        //     prop: "qhqty",
        //     minWidth: 80,
        //     align: 'left',
        // },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 100,
            align: 'left',
        },
        // {
        //     label: "采购订货数量",
        //     prop: "orderQty",
        //     minWidth: 120,
        //     align: 'left',
        // },
        // {
        //     label: "采购入库数量",
        //     prop: "purchaseStockInQty",
        //     minWidth: 120,
        //     align: 'left',
        // },
        {
            label: "出库数量",
            prop: "stockOutSaleQty",
            minWidth: 80,
            align: 'left',
        },
        {
            label: "出库金额",
            prop: "stockInSaleAmount",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "未出库数量",
            prop: "notStockOutSaleQty",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "未出库金额",
            prop: "notStockInSaleAmount",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "开票数量",
            prop: "purchaseInvoiceQty",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "销售员编号",
            prop: "salerCode",
            minWidth: 100,
            align: 'left',
        },
        {
            label: "销售员姓名",
            prop: "salerName",
            minWidth: 120,
            search: true,
            align: 'left',
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 180,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
    ]
}

//销售订单-明细
const customerOrdersColum = {
    column: [
        {
            label: "订单编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            align: 'left',
        },
        {
            label: "采购单号",
            prop: "purchaseOrderBillNo",
            minWidth: 160,
            search: true,
            sortable: true,
            align: 'left',
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 80,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left',
            search: true,
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 160,
            align: 'left',
            search: true,
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            align: 'left',
            search: true,
        },
        {
            label: "计量单位",
            prop: "unit",
            minWidth: 100,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        // {
        //     label: "缺货数量",
        //     prop: "qhqty",
        //     minWidth: 100,
        //     align:'right',
        //     search: true,
        // },
        {
            label: "单价",
            prop: "price",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "含税金额",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
            // search: true,
        },
        {
            label: "销售员编号",
            prop: "salerCode",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "销售员姓名",
            prop: "salerName",
            minWidth: 100,
            align: 'left',
            search: true,
        },
        {
            label: "单据日期",
            prop: "crtTime",
            minWidth: 140,
            align: 'left'
        },
    ]
}

//销售订单-主表
const sellColumn = {
    column: [
        {
            label: "id",
            prop: "id",
            sortable: true,
            hide: true
        },
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        },
        {
            label: "单据状态",
            prop: "billStatus",
            minWidth: 80,
            align: 'left',
            type: 'select',
            dicData: orderType,
            search: true,
            searchFilterable: true
        },
        {
            label: "销售员编号",
            prop: "salerCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            search: true,
            align: 'left',
        },
        {
            label: "价税合计",
            prop: "taxBillAmount",
            minWidth: 80,
            align: 'left',
        },
        {
            label: "单据日期",
            prop: "billDate",
            minWidth: 120,
            search: true,
            sortable: true,
            align: 'left',
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

const sendColumn = {
    column: [
        {
            label: "快递名称",
            prop: "name",
            minWidth: 180,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        }
    ]
}

const priceColumn = {
    column: [
        {
            label: "id",
            prop: "id",
            sortable: true,
            hide: true
        }, {
            label: "单据编号",
            prop: "billNo",
            minWidth: 160,
            search: true,
            sortable: true,
            fixed: true,
            align: 'left',
        }, {
            label: "订单状态",
            prop: "billStatus",
            minWidth: 100,
            type: 'select',
            align: 'left',
            dicData: orderType,
            search: true,
            searchFilterable: true
        }, {
            label: "单据日期",
            prop: "billDate",
            minWidth: 120,
            align: 'left',
            search: true,
            valueFormat: 'yyyy-MM-dd',
            format: 'yyyy-MM-dd',
            type: "daterange",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
        },
        {
            label: "报价类型",
            prop: "quotationType",
            align: 'left',
            minWidth: 120,
            type: 'select',
            textColor: "#ff0000",
            dicData: [
                {
                    value: 0,
                    label: '生产'
                },
                {
                    value: 1,
                    label: '普通'
                }
            ]
        }, {
            label: "销售编号",
            prop: "salesCode",
            minWidth: 120,
            align: 'left',
        }, {
            label: "销售姓名",
            prop: "salesName",
            minWidth: 180,
            align: 'left',
        }, {
            label: "客户编号",
            prop: "customerCode",
            minWidth: 120,
            align: 'left',
        }, {
            label: "客户名称",
            prop: "customerName",
            minWidth: 180,
            align: 'left',
        }, {
            label: "报价开始有效期",
            prop: "startValidityPeriod",
            minWidth: 130,
            sortable: true,
            type: 'date',
            align: 'left',
        }, {
            label: "报价结束有效期",
            prop: "endValidityPeriod",
            minWidth: 130,
            sortable: true,
            type: 'date',
            align: 'left',
        }, {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

//库存明细
const stockColumn = {
    column: [
        {
            label: "批次号",
            prop: "batchNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "仓库名称",
            prop: "warehouseName",
            minWidth: 120,
            align: 'center'
        },
        {
            label: "仓位名称",
            prop: "positionName",
            minWidth: 120,
            align: 'center'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'right'
        },
        {
            label: "成本价",
            prop: "purchasePrice",
            minWidth: 120,
            align: 'right'
        },
        {
            label: "锁定数量",
            prop: "lockedQty",
            minWidth: 100,
            align: 'center'
        },
    ]
}

//库存修改单选择商品的接口
const stockByWarehouseIdColumn = {
    column: [
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "仓库名称",
            prop: "warehouseName",
            minWidth: 120,
            align: 'center'
        },
        {
            label: "仓位名称",
            prop: "positionName",
            minWidth: 120,
            align: 'center',
            search: true,
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'right'
        },
        {
            label: "库存形态",
            prop: "stockForm",
            minWidth: 100,
            align: 'center',
            search: true,
        },
    ]
}

//商品调拨单选择商品的接口
const allocationStockOutColumn = {
    column: [
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'right'
        },
        {
            label: "锁定数量",
            prop: "lockedQty",
            minWidth: 80,
            align: 'right'
        },
        {
            label: "面价",
            prop: "retailPrice",
            minWidth: 120,
            align: 'right'
        },
        {
            label: "单价",
            prop: "costPrice",
            minWidth: 120,
            align: 'right'
        },
    ]
}

const productColumn = {
    column: [
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 150,
            search: true,
            align: 'center'
        },
        {
            label: "品牌名称",
            prop: "brandName",
            minWidth: 120,
            search: true,
            align: 'center'
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "单位",
            prop: "unit",
            minWidth: 80,
            align: 'center'
        },
        {
            label: "单位成本",
            prop: "costPrice",
            minWidth: 80,
            align: 'right',
            textColor: "#ff0000"
        },
    ]
}
const bankColumn  = {
    column: [
        {
            label: "名称",
            prop: "name",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "账户类型",
            prop: "accountType",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "账户号码",
            prop: "accountNo",
            minWidth: 120,
            align: 'center',
        },
    ]
}

const projectColumn  = {
    column: [
        {
            label: "项目名称",
            prop: "projectName",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "项目类型",
            prop: "projectType",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "项目阶段",
            prop: "projectStage",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "负责人",
            prop: "chargeName",
            minWidth: 120,
            align: 'center',
        },
    ]
}


const carrierColumn = {
    column: [
        {
            label: "单位名称",
            prop: "name",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "单位简称",
            prop: "shortName",
            minWidth: 120,
            align: 'center',
        },
    ]
}

const otherColumn = {
    column: [
        {
            label: "单位名称",
            prop: "name",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "单位简称",
            prop: "shortName",
            minWidth: 120,
            align: 'center',
        },
        {
            label: "状态",
            prop: "status",
            minWidth: 160,
            align: 'center',
            type: 'select',
            dicData: [
                {
                    value: 0,
                    label: '启用'
                }, {
                    value: 1,
                    label: '禁用'
                }
            ],
        },
        {
            label: "备注",
            prop: "note",
            minWidth: 120,
            align: 'left',
        },
    ]
}

//关联销售报价@/api/erp/sales/bill/salesContract
const quotationColumn = {
    column: [
        {
            label: "单据编号",
            prop: "billNo",
            minWidth: 150,
            search: true,
            align: 'left'
        },
        {
            label: "客户名称",
            prop: "customerName",
            minWidth: 220,
            search: true,
            align: 'left',
        },
        {
            label: "业务员",
            prop: "salerName",
            minWidth: 100,
            search: true,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 160,
            search: true,
            align: 'left'
        }, {
            label: "订货号",
            prop: "itemNo",
            minWidth: 150,
            search: true,
        }, {
            label: "品牌名",
            prop: "brandName",
            hide: true
        }, {
            label: "规格型号",
            prop: "specifications",
            minWidth: 150,
            search: true,
            align: 'left'
        }, {
            label: "数量",
            prop: "qty",
            minWidth: 80,
            align: 'center',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "数量"
                );
            }
        }, {
            label: "单价",
            prop: "price",
            minWidth: 80,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "单价"
                );
            }
        }, {
            label: "金额",
            prop: "amount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "金额"
                );
            }
        }, {
            label: "税额",
            prop: "tax",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "税额"
                );
            }
        }, {
            label: "含税单价",
            prop: "taxPrice",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "含税单价"
                );
            }
        }, {
            label: "价税合计",
            prop: "taxAmount",
            minWidth: 100,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "价税合计"
                );
            }
        },
    ]
};

const skuColumn = {
    column: [
        {
            label: "仓位",
            prop: "positionName",
            minWidth: 120,
            align: 'left',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "仓位"
                );
            }
        },
        {
            label: "批次号",
            prop: "batchNo",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "商品名称",
            prop: "skuName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "品牌",
            prop: "brandName",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "规格型号",
            prop: "specifications",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth: 120,
            align: 'left',
        },
        {
            label: "库存数量",
            prop: "qty",
            minWidth: 120,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "库存数量"
                );
            }
        },
        {
            label: "锁定数量",
            prop: "lockedQty",
            minWidth: 120,
            align: 'right',
            textColor: "#ff0000",
            renderHeader: h => {
                return h(
                    "span",
                    {
                        style: {
                            color: "#ff0000"
                        }
                    },
                    "锁定数量"
                );
            }
        },
    ]
}

const taxColumn = {
    column:[
        {
            label: "id",
            prop: "id",
            sortable: true,
            hide: true
        },
        {
            label: "商品名称",
            prop: "name",
            minWidth: 120,
            overHidden:true,
            align: 'left',
            search: true,
        },
        {
            label: "订货号",
            prop: "itemNo",
            minWidth:120,
            overHidden:true,
            align: 'left',
            search: true,
        },
        {
            label: "型号",
            prop: "specifications",
            minWidth: 120,
            overHidden:true,
            align: 'left',
            search: true,
        },
        {
            label: "品牌名称",
            prop: "brandName",
            minWidth: 120,
            overHidden:true,
            align: 'left',
        },
    ]
}
export const taxOption = JSON.parse(JSON.stringify(Object.assign(publicOption, taxColumn)));

export const collectOption = JSON.parse(JSON.stringify(Object.assign(publicOption, collectColumn)));

export const customerOption = JSON.parse(JSON.stringify(Object.assign(publicOption, customerColumn)));

export const userOption = JSON.parse(JSON.stringify(Object.assign(publicOption, userColumn)));

export const sourceOption = JSON.parse(JSON.stringify(Object.assign(publicOption, sourceColumn)));

export const commodityOption = JSON.parse(JSON.stringify(Object.assign(publicOption, commodityColumn)));

export const relationOption = JSON.parse(JSON.stringify(Object.assign(publicOption, relationColumn)));

export const relatioOption = JSON.parse(JSON.stringify(Object.assign(publicOption, relatioColumn)));

export const workerOption = JSON.parse(JSON.stringify(workerColumn));

export const dispatchersOption = JSON.parse(JSON.stringify(Object.assign(publicOption, dispatchersColumn)));

export const manufactureOption = JSON.parse(JSON.stringify(Object.assign(publicOption, manufactureColumn)));

export const processesOption = JSON.parse(JSON.stringify(Object.assign(publicOption, processesColumn)));

export const technologyOption = JSON.parse(JSON.stringify(Object.assign(publicOption, technologyColumn)));

export const customerOrderOption = JSON.parse(JSON.stringify(Object.assign(publicOption, customerOrderColum)));

export const customerOrdersOption = JSON.parse(JSON.stringify(Object.assign(publicOption, customerOrdersColum)));

export const warehouseOption = JSON.parse(JSON.stringify(Object.assign(publicOption, warehouseColum)));

export const purchaseOption = JSON.parse(JSON.stringify(Object.assign(publicOption, purchaseColum)));

export const applyOption = JSON.parse(JSON.stringify(Object.assign(publicOption, applyColum)));

export const applysOption = JSON.parse(JSON.stringify(Object.assign(publicOption, applysColum)));

export const purchasesOption = JSON.parse(JSON.stringify(Object.assign(publicOption, purchasesColum)));

export const positionOption = JSON.parse(JSON.stringify(Object.assign(publicOption, positionColum)));

export const relationsOption = JSON.parse(JSON.stringify(Object.assign(publicOption, relationsColum)));

export const materialOption = JSON.parse(JSON.stringify(Object.assign(publicOption, materialColum)));

export const manufacturesOption = JSON.parse(JSON.stringify(Object.assign(publicOption, manufacturesColumn)));

export const manufacturessOption = JSON.parse(JSON.stringify(Object.assign(publicOption, manufacturessColumn)));

export const ordersOption = JSON.parse(JSON.stringify(Object.assign(publicOption, ordersColum)));

export const salesOption = JSON.parse(JSON.stringify(Object.assign(publicOption, salesColum)));

export const positionsOption = JSON.parse(JSON.stringify(Object.assign(publicOption, positionColumn)));

export const ordersOptions = JSON.parse(JSON.stringify(Object.assign(publicOption, ordersColums)));

export const customersOrderOption = JSON.parse(JSON.stringify(Object.assign(publicOption, customerOrderColumn)));

export const sendOption = JSON.parse(JSON.stringify(Object.assign(publicOption, sendColumn)));

export const sellOption = JSON.parse(JSON.stringify(Object.assign(publicOption, sellColumn)));

export const priceOption = JSON.parse(JSON.stringify(Object.assign(publicOption, priceColumn)));

export const bankAccountOption = JSON.parse(JSON.stringify(Object.assign(publicOption, accountColumn)));

export const subjectOption = JSON.parse(JSON.stringify(Object.assign(publicOption, subjectColumn)));

export const capitalAccountOption = JSON.parse(JSON.stringify(Object.assign(publicOption, capitalAccountColumn)));

export const stockOption = JSON.parse(JSON.stringify(Object.assign(publicOption, stockColumn)));

export const stockByWarehouseIdOption = JSON.parse(JSON.stringify(Object.assign(publicOption, stockByWarehouseIdColumn)));

export const allocationStockOutOption = JSON.parse(JSON.stringify(Object.assign(publicOption, allocationStockOutColumn)));

export const productOption = JSON.parse(JSON.stringify(Object.assign(publicOption, productColumn)));

export const otherOption = JSON.parse(JSON.stringify(Object.assign(publicOption, otherColumn)));

export const quotationOption = JSON.parse(JSON.stringify(Object.assign(publicOption, quotationColumn)));

export const carrierOption = JSON.parse(JSON.stringify(Object.assign(publicOption, carrierColumn)));

export const skuOption = JSON.parse(JSON.stringify(Object.assign(publicOption, skuColumn)));

export const bankOption = JSON.parse(JSON.stringify(Object.assign(publicOption, bankColumn)));

export const projectOption = JSON.parse(JSON.stringify(Object.assign(publicOption, projectColumn)));









