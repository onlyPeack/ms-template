import Layout from '@/page/index/'
export default [
    {
        path: '/wel',
        component: Layout,
        redirect: '/wel/index',
        children: [
            {
                path: 'index',
                name: '网页管理',
                props: (route) => ({timeStamp: route.query.timeStamp,name:route.query.name}),
                meta: {
                    i18n: 'dashboard'
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ `@/views/temp/columnList`)
            }, {
                path: 'dashboard',
                name: '控制台',
                meta: {
                    i18n: 'dashboard',
                    menu: false,
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
            },
            {
                path: 'process',
                name: '初始化流程',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/wel/process')
            },
            {
                path: 'notice',
                name: '消息中心',
                meta: {
                    i18n: 'notice',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/wel/notice')
            },
            {
                path: 'overallNavigation',
                name: '系统总体导航',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/overallNavigation')
            },
            {
                path: 'operationFlowOne',
                name: '销售业务流程',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/operationFlowOne')
            },
            {
                path: 'operationFlowTwo',
                name: '采购业务流程',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/operationFlowTwo')
            },
            {
                path: 'operationFlowTree',
                name: '财务业务流程',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/operationFlowTree')
            },
            {
                path: 'operationFlowFour',
                name: '仓储业务流程',
                meta: {
                    i18n: 'process',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/operationFlowFour')
            },
        ]
    },
    {
        path: '/print/sales-invoice-print',
        component: resolve => require(['@/views/erp/financial/receivable/sales-invoice-print'], resolve),
        hidden: true
    },
    {
        path: '/print/project_contract_print',
        component: resolve => require(['@/views/erp/project_management/project_contract_print'], resolve),
        hidden: true
    },
    {
        path: '/print/purchase_invoice_print',
        component: resolve => require(['@/views/erp/financial/payable/purchase_invoice_print'], resolve),
        hidden: true
    },
    {
        path: '/print/sales-invoice-print',
        component: resolve => require(['@/views/erp/financial/receivable/sales-invoice-print'], resolve),
        hidden: true
    },
    {
        path: '/project_management/project_view_pay',
        component: resolve => require(['@/views/erp/project_management/project_view_pay'], resolve),
        hidden: true
    },
    {
        path: '/print/sales_stock_out_print',
        component: resolve => require(['@/views/erp/sales/sales_bill/sales_stock_out_print'], resolve),
        hidden: true
    },
    {
        path: '/print/customer_order_print',
        component: resolve => require(['@/views/erp/sales/sales_bill/customer_order_print'], resolve),
        hidden: true
    },
    {
        path: '/print/purchase_stock_return_print',
        component: resolve => require(['@/views/erp/wms/stock_out/purchase_stock_return_print'], resolve),
        hidden: true
    },
    {
        path: '/print/purchase_apply_print',
        component: resolve => require(['@/views/erp/purchase/purchase_bill/purchase_apply_print'], resolve),
        hidden: true
    },
    {
        path: '/print/purchase_order_print',
        component: resolve => require(['@/views/erp/purchase/purchase_bill/purchase_order_print'], resolve),
        hidden: true
    },
    {
        path: '/print/other_stock_out_print',
        component: resolve => require(['@/views/erp/wms/stock_in/other_stock_out_print'], resolve),
        hidden: true
    },
    {
        path: '/print/purchase_stock_in_print',
        component: resolve => require(['@/views/erp/wms/stock_in/purchase_stock_in_print'], resolve),
        hidden: true
    },
    {
        path: '/print/product_stock_in_print',
        component: resolve => require(['@/views/erp/wms/stock_in/product_stock_in_print'], resolve),
        hidden: true
    },
    {
        path: '/print/product_work_order_print',
        component: resolve => require(['@/views/erp/product/shop_manager/product_work_order_print'], resolve),
        hidden: true
    },
    {
        path: '/print/product_dispatch_list_print',
        component: resolve => require(['@/views/erp/product/shop_manager/product_dispatch_list_print'], resolve),
        hidden: true
    },
    {
        path: '/print/material_stock_out_print',
        component: resolve => require(['@/views/erp/wms/stock_out/material_stock_out_print'], resolve),
        hidden: true
    },
    {
        path: '/print/product_order_print',
        component: resolve => require(['@/views/erp/product/shop_manager/product_order_print'], resolve),
        hidden: true
    },{
        path: '/print/db-electronic-sheet-print',
        component: resolve => require(['@/views/erp/sales/sales_bill/db-electronic-sheet-print'], resolve),
        hidden: true
    },{
        path: '/print/db-electronic-sheets-print',
        component: resolve => require(['@/views/erp/sales/sales_bill/db-electronic-sheets-print'], resolve),
        hidden: true
    },
    {
        path: '/refresh',
        name: 'refresh',
        component: () => import('@/page/refresh/index'),
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/form-detail',
        component: Layout,
        children: [
            {
                path: 'index',
                name: '详情页',
                meta: {
                    i18n: 'detail'
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/util/form-detail')
            }
        ]
    },
    {
        path: '/info',
        component: Layout,
        redirect: '/info/index',
        children: [
            {
                path: 'index',
                name: '个人信息',
                meta: {
                    i18n: 'info'
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/user/info')
            },
            {
                path: 'setting',
                name: '个人设置',
                meta: {
                    i18n: 'setting'
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/views/user/setting')
            },
            {
                path: 'userWizard',
                name: '用户向导',
                meta: {
                    i18n: 'userWizard',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/userWizard')
            },
            {
                path: 'addedServices',
                name: '增值服务设置',
                meta: {
                    i18n: 'addedServices',
                },
                component: () =>
                    import( /* webpackChunkName: "views" */ '@/page/index/top/addedServices')
            }
        ]
    },
    /***********************************SAAS-Start***************************************/
    //商品管理
    {
        path: '/shop/goodsControl',
        component: Layout,
        redirect: '/basic_data/goodsControl',
        children: [
            {
                path: 'allGoods',
                name: '全部商品',
                meta: {
                    i18n: 'allGoods'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/allGoods')
            },
            {
                path: 'goodsClassify',
                name: '商品分类',
                meta: {
                    i18n: 'goodsClassify'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/goodsClassify')
            },
            {
                path: 'brandManager',
                name: '品牌管理',
                meta: {
                    i18n: 'brandManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/brandManager')
            },
            {
                path: 'goodsTag',
                name: '商品标签',
                meta: {
                    i18n: 'goodsTag'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/goodsTag')
            },
            {
                path: 'goodsSeries',
                name: '商品系列',
                meta: {
                    i18n: 'goodsSeries'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/goodsSeries')
            },
            {
                path: 'allGoodsForm',
                name: '新增商品',
                meta: {
                    i18n: 'allGoodsForm'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/allGoodsForm')
            },
            {
                path: 'allGoodsEdit',
                name: '编辑商品',
                meta: {
                    i18n: 'allGoodsEdit'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/allGoodsEdit')
            },
            {
                path: 'allGoodsView',
                name: '商品详情',
                meta: {
                    i18n: 'allGoodsView'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/allGoodsView')
            },
            {
                path: 'goodsPutaway',
                name: '商品上架',
                meta: {
                    i18n: 'goodsPutaway'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/goodsPutaway')
            },
            {
                path: 'salesScheme',
                name: '价格方案',
                meta: {
                    i18n: 'salesScheme'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/salesScheme')
            },
        ]
    },
    //价格管理
    {
        path: '/shop/salesManager',
        component: Layout,
        redirect: '/shop/salesManager',
        children: [
            {
                path: 'salesScheme',
                name: '价格方案',
                meta: {
                    i18n: 'salesScheme'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/salesScheme')
            },
            {
                path: 'salesSetting',
                name: '价格设置',
                meta: {
                    i18n: 'salesSetting'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/salesManager/salesSetting')
            },
        ]
    },
    //会员管理
    {
        path: '/shop/memberCenter',
        component: Layout,
        redirect: '/shop/memberCenter',
        children: [
            {
                path: 'memberList',
                name: '会员列表',
                meta: {
                    i18n: 'memberList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/memberCenter/memberList')
            },
            {
                path: 'memberBill',
                name: '会员账单',
                meta: {
                    i18n: 'memberBill'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/memberCenter/memberBill')
            },
        ]

    },
    //内容管理
    {
        path: '/shop/contentControl',
        component: Layout,
        redirect: '/shop/contentControl',
        children: [
            {
                path: 'brandRecommend',
                name: '品牌推荐',
                meta: {
                    i18n: 'brandRecommend'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/brandRecommend')
            },
            {
                path: 'goodsRecommend',
                name: '商品推荐',
                meta: {
                    i18n: 'goodsRecommend'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/goodsRecommend')
            },
            {
                path: 'perfectGoods',
                name: '精选好货',
                meta: {
                    i18n: 'perfectGoods'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/perfectGoods')
            },
            {
                path: 'subjectRecommend',
                name: '促销专区',
                meta: {
                    i18n: 'subjectRecommend'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/subjectRecommend')
            },
            {
                path: 'goodsStorey',
                name: '商城楼层',
                meta: {
                    i18n: 'goodsStorey'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/goodsStorey')
            },
            {
                path: 'advertiseManager',
                name: '广告管理',
                meta: {
                    i18n: 'advertiseManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/advertiseManager')
            },
            {
                path: 'columnManager',
                name: '栏目管理',
                meta: {
                    i18n: 'columnManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/columnManager')
            },
            {
                path: 'columnManagerForm',
                name: '新增栏目',
                meta: {
                    i18n: 'columnManagerForm'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/columnManagerForm')
            },
            {
                path: 'columnManagerEdit',
                name: '编辑栏目',
                meta: {
                    i18n: 'columnManagerEdit'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/columnManagerEdit')
            },
            {
                path: 'noticeManager',
                name: '发布公告',
                meta: {
                    i18n: 'noticeManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/noticeManager')
            },
            {
                path: 'hotRecommend',
                name: '热门搜索',
                meta: {
                    i18n: 'hotRecommend'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/contentControl/hotRecommend')
            },
        ]
    },
    //订单管理
    {
        path: '/shop/orderControl',
        component: Layout,
        redirect: '/shop/orderControl',
        children: [
            {
                path: 'orderList',
                name: '订单列表',
                meta: {
                    i18n: 'orderList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/orderControl/orderList')
            },
            {
                path: 'logistics',
                name: '物流快递',
                meta: {
                    i18n: 'logistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/orderControl/logistics')
            },
            {
                path: 'orderChart',
                name: '商城首页',
                meta: {
                    i18n: 'orderChart'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/orderControl/orderChart')
            },
            {
                path: 'orderSetting',
                name: '订单设置',
                meta: {
                    i18n: 'orderSetting'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/orderControl/orderSetting')
            },
            {
                path: 'EDIOrder',
                name: 'EDI订单',
                meta: {
                    i18n: 'EDIOrder'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/orderControl/EDIOrder')
            },
        ]

    },
    //营销管理
    {
        path: '/shop/umsControl',
        component: Layout,
        redirect: '/shop/umsControl',
        children: [
            {
                path: 'couponManager',
                name: '优惠券',
                meta: {
                    i18n: 'couponManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/umsControl/couponManager')
            },
            {
                path: 'couponStatistics',
                name: '优惠券使用统计',
                meta: {
                    i18n: 'couponStatistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/umsControl/couponStatistics')
            },
            {
                path: 'seckill',
                name: '秒杀',
                meta: {
                    i18n: 'seckill'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/umsControl/seckill')
            },
            {
                path: 'fullSent',
                name: '满送',
                meta: {
                    i18n: 'fullSent'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/umsControl/fullSent')
            },
            {
                path: 'freeGoodsList',
                name: '赠品列表',
                meta: {
                    i18n: 'freeGoodsList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/umsControl/freeGoodsList')
            },
        ]

    },
    //短信管理
    {
        path: '/shop',
        component: Layout,
        redirect: '/shop',
        children: [
            {
                path: 'noteList',
                name: '短信服务',
                meta: {
                    i18n: 'noteList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/noteControl/noteList')
            },
        ]

    },
    //网站设置
    {
        path: '/shop/websiteControl',
        redirect: '/shop/websiteControl',
        component: Layout,
        children: [
            {
                path: 'websiteSetting',
                name: '网站设置',
                meta: {
                    i18n: 'websiteSetting'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/websiteControl/websiteSetting')
            },
            {
                path: 'paySetting',
                name: '支付设置',
                meta: {
                    i18n: 'paySetting'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/websiteControl/paySetting')
            },
            {
                path: 'transportManager',
                name: '运费管理',
                meta: {
                    i18n: 'transportManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/websiteControl/transportManager')
            },
        ]
    },
    //网站设置
    {
        path: '/shop/cloudWMS',
        redirect: '/shop/cloudWMS',
        component: Layout,
        children: [
            {
                path: 'salesScheme',
                name: '价格方案',
                meta: {
                    i18n: 'cloudOrder'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/goodsControl/salesScheme')
            },
            {
                path: 'setting',
                name: '设置',
                meta: {
                    i18n: 'cloudOrder'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/saas/cloudWMS/setting')
            },
        ]
    },
    /***********************************SAAS-End***************************************/




    /***********模板管理Start******************/
    {
        path: '/temp',
        component: Layout,
        redirect: '/temp',
        children: [
            {
                path: 'columnList',
                name: '网页管理',
                meta: {
                    i18n: 'columnList'
                },
                component: () =>
                    import('@/views/temp/columnList')
            },
            {
                path: 'columnForm',
                name: '网页编辑',
                meta: {
                    i18n: 'columnForm'
                },
                component: () =>
                    import('@/views/temp/columnForm')
            },
            {
                path: 'articleList',
                name: '文章管理',
                meta: {
                    i18n: 'articleList'
                },
                component: () =>
                    import('@/views/temp/articleList')
            },
            {
                path: 'articleForm',
                name: '文章编辑',
                meta: {
                    i18n: 'articleForm'
                },
                component: () =>
                    import('@/views/temp/articleForm')
            },
            {
                path: 'tempList',
                name: '模板管理',
                meta: {
                    i18n: 'tempList'
                },
                component: () =>
                    import('@/views/temp/tempList')
            },
            {
                path: 'tempForm',
                name: '模板编辑',
                meta: {
                    i18n: 'tempForm'
                },
                component: () =>
                    import('@/views/temp/tempForm')
            },
            {
                path: 'preview',
                name: '网页预览',
                meta: {
                    i18n: 'tempForm'
                },
                component: () =>
                    import('@/views/temp/preview')
            },
            {
                path: 'bigPreview',
                name: '网页预览',
                meta: {
                    i18n: 'bigPreview'
                },
                component: () =>
                    import('@/views/temp/bigPreview')
            },
            {
                path: 'urlMap',
                name: '路径管理',
                meta: {
                    i18n: 'urlMap'
                },
                component: () =>
                    import('@/views/temp/urlMap')
            },
        ]
    },
    /***********模板管理End******************/
]
