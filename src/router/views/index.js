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
    /***********销售模块Start******************/
    {
        path: '/sales/sales_bill',
        component: Layout,
        redirect: '/sales/sales_bill',
        children: [
            {
                path: 'customer_order',
                name: '销售订单',
                meta: {
                    i18n: 'customer_order'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/customer_order')
            },
            {
                path: 'customer_order_form',
                name: '销售订单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'customer_order_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/customer_order_form')
            },
            {
                path: 'customer_order_view',
                name: '销售订单详情',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    ids: route.query.ids,
                }),
                meta: {
                    i18n: 'customer_order_view'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/customer_order_view')
            },
            {
                path: 'project_view_add',
                name: '项目合同制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'project_view_add'
                },
                component: () =>
                    import('@/views/erp/project_management/project_view_add')
            },
            {
                path: 'customer_order_change',
                name: '销售订单变更',
                meta: {
                    i18n: 'customer_order_change'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/customer_order_change')
            },
            {
                path: 'customer_order_change_form',
                name: '销售订单变更制单',
                props: (route) => ({type: route.query.type, id: route.query.id,  taskType: route.query.taskType, step: route.query.step}),
                meta: {
                    i18n: 'customer_order_change_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/customer_order_change_form')
            },
            {
                path: 'sales_project_order',
                name: '项目订单',
                meta: {
                    i18n: 'sales_project_order'
                },
                props: (route) => ({timeStamp: route.query.timeStamp ,taskType: route.query.taskType, step: route.query.step}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_project_order')
            },
            {
                path: 'sales_quotation_prices',
                name: '项目报价',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'sales_quotation_prices'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_quotation_prices')
            },
            {
                path: 'sales_quotation_prices_form',
                name: '项目报价单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                meta: {
                    i18n: 'sales_quotation_prices_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_quotation_prices_form')
            },
            {
                path: 'sales_project_order_form',
                name: '项目订单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'sales_project_order_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_project_order_form')
            },
            {
                path: 'sales_project_order_change',
                name: '项目订单变更单',
                meta: {
                    i18n: 'sales_project_order_change'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_project_order_change')
            },
            {
                path: 'sales_project_order_change_form',
                name: '项目订单变更单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'sales_project_order_change_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_project_order_change_form')
            },
            {
                path: 'sales_price',
                name: '销售报价',
                meta: {
                    i18n: 'sales_price'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_price')
            },
            {
                path: 'sales_price_form',
                name: '销售报价制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'sales_price_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_price_form')
            },
            {
                path: 'sales_stock_out',
                name: '销售出库',
                meta: {
                    i18n: 'sales_stock_out'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_stock_out')
            },
            {
                path: 'sales_stock_out_form',
                name: '销售出库制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'sales_stock_out_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_bill/sales_stock_out_form')
            },
        ]
    },
    {
        path: '/sales/sales_report',
        component: Layout,
        redirect: '/sales/sales_report',
        children: [
            {
                path: 'sales_receive_warning',
                name: '销售收款预警表',
                meta: {
                    i18n: 'sales_receive_warning'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_receive_warning')
            },
            {
                path: 'sales_invoice_warning',
                name: '销售开票预警表',
                meta: {
                    i18n: 'sales_invoice_warning'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_invoice_warning')
            },
            {
                path: 'sales_commission_config',
                name: '提成方案设置',
                meta: {
                    i18n: 'sales_commission_config'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_commission_config')
            },
            {
                path: 'sales_commission_config_form',
                name: '提成方案设置制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'sales_commission_config_form'
                },
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_commission_config_form')
            },
            {
                path: 'sales-profit-statistics',
                name: '销售毛利统计',
                meta: {
                    i18n: 'sales-profit-statistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales-profit-statistics')
            },
            {
                path: 'sales_detail_list',
                name: '销售明细表',
                meta: {
                    i18n: 'sales_detail_list'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_detail_list')
            },
            {
                path: 'sales_collection_statistics/sales_commission_statistics',
                name: '销售提成统计',
                meta: {
                    i18n: 'sales_commission_statistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_collection_statistics/sales_commission_statistics')
            },
            {
                path: 'sales_summary_list',
                name: '销售汇总表',
                meta: {
                    i18n: 'sales_summary_list'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_summary_list')
            },
            {
                path: 'sales_order_tail',
                name: '销售订单跟踪',
                meta: {
                    i18n: 'sales_order_tail'
                },
                props: (route) => ({timeStamp: route.query.timeStamp,id: route.query.id}),
                component: () =>
                    import('@/views/erp/sales/sales_report/sales_order_tail')
            },
        ]
    },
    /***********销售模块End******************/
    /***********生产模块Start******************/
    {
        path: '/product/project_analysis',
        component: Layout,
        redirect: '/product/project_analysis',
        children: [
            {
                path: 'product_order_tail',
                name: '生产订单跟踪',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'product_order_tail'
                },
                component: () =>
                    import('@/views/erp/product/project_analysis/product_order_tail')
            },
            // {
            //     path: 'product_order_form',
            //     name: '生产订单制单',
            //     props: (route) => ({type: route.query.type, id: route.query.id}),
            //     meta: {
            //         i18n: 'product_order_form'
            //     },
            //     component: () =>
            //         import('@/views/erp/product/shop_manager/product_order_form')
            // },
        ]
    },
    {
        path: '/product/shop_manager',
        component: Layout,
        redirect: '/product/shop_manager',
        children: [
            {
                path: 'product_order',
                name: '生产订单',
                meta: {
                    i18n: 'product_order'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/product/shop_manager/product_order')
            },
            {
                path: 'product_order_form',
                name: '生产订单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'product_order_form'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_order_form')
            },
            {
                path: 'product_order_changes',
                name: '生产订单变更单',
                meta: {
                    i18n: 'product_order_changes'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/product/shop_manager/product_order_changes')
            },
            {
                path: 'product_order_changes_form',
                name: '生产订单变更单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'product_order_changes_form'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_order_changes_form')
            },
            {
                path: 'product_dispatch_list',
                name: '派工单',
                props: (route) => ({id: route.query.id, timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'product_dispatch_list'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_dispatch_list')
            },
            {
                path: 'product_dispatch_list_form',
                name: '派工单制单',
                props: (route) => ({type: route.query.type, id: route.query.id, masterId: route.query.masterId}),
                meta: {
                    i18n: 'product_dispatch_list_form'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_dispatch_list_form')
            },
            {
                path: 'product_work_order',
                name: '报工单',
                props: (route) => ({id: route.query.id, timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'product_work_order'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_work_order')
            },
            {
                path: 'product_work_order_form',
                name: '报工单制单',
                props: (route) => ({type: route.query.type, id: route.query.id, masterId: route.query.masterId}),
                meta: {
                    i18n: 'product_work_order_form'
                },
                component: () =>
                    import('@/views/erp/product/shop_manager/product_work_order_form')
            },
        ]
    },
    {
        path: '/product/product_config',
        component: Layout,
        redirect: '/product/product_config',
        children: [
            {
                path: 'product_process_managerment',
                name: '工序管理',
                meta: {
                    i18n: 'product_process_managerment'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/product/product_config/product_process_managerment')
            },
            {
                path: 'product_process_managerment_form',
                name: '工序管理制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'product_process_managerment_form'
                },
                component: () =>
                    import('@/views/erp/product/product_config/product_process_managerment_form')
            },
            {
                path: 'product_craft_managerment',
                name: '工艺管理',
                meta: {
                    i18n: 'product_craft_managerment'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/product/product_config/product_craft_managerment')
            },
            {
                path: 'product_craft_managerment_form',
                name: '工艺管理制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'process_control_form'
                },
                component: () =>
                    import('@/views/erp/product/product_config/product_craft_managerment_form')
            },
            {
                path: 'consume_register',
                name: '耗材登记',
                meta: {
                    i18n: 'consume_register'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/product/product_config/consume_register')
            },
            {
                path: 'consume_register_form',
                name: '耗材登记制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'consume_register_form'
                },
                component: () =>
                    import('@/views/erp/product/product_config/consume_register_form')
            },
        ]
    },
    /***********采购Start******************/
    {
        path: '/purchase/purchase_bill',
        component: Layout,
        redirect: '/purchase/purchase_bill',
        children: [
            {
                path: 'invoice_verification',
                name: '发票核销',
                meta: {
                    i18n: 'invoice_verification'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/invoice_verification')
            },
            {
                path: 'invoice_verification_form',
                name: '发票核销制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'invoice_verification_form'
                },
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/invoice_verification_form')
            },
            {
                path: 'purchase_apply',
                name: '采购申请',
                meta: {
                    i18n: 'purchase_apply'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_apply')
            },
            {
                path: 'purchase_apply_form',
                name: '采购申请制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step,
                    obj: route.query.obj,
                }),
                meta: {
                    i18n: 'purchase_apply_form'
                },
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_apply_form')
            },
            {
                path: 'purchase_order',
                name: '采购订单',
                meta: {
                    i18n: 'purchase_order'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_order')
            },
            {
                path: 'purchase_order_form',
                name: '采购订单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'purchase_order_form'
                },
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_order_form')
            },
            {
                path: 'purchase_stock_in_cancel',
                name: '入库取消',
                meta: {
                    i18n: 'purchase_stock_in_cancel'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_stock_in_cancel')
            },
            {
                path: 'purchase_stock_in_cancel_form',
                name: '入库取消制单',
                meta: {
                    i18n: 'purchase_stock_in_cancel_form'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_stock_in_cancel_form')
            },
            {
                path: 'purchase_order_change',
                name: '采购订单变更',
                meta: {
                    i18n: 'purchase_order_change'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_order_change')
            },
            {
                path: 'purchase_order_change_form',
                name: '采购订单变更制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'purchase_order_change_form'
                },
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/purchase_order_change_form')
            },
            {
                path: 'receipt_goods_notice',
                name: '收货通知单',
                meta: {
                    i18n: 'receipt_goods_notice'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/receipt_goods_notice')
            },
            {
                path: 'receipt_goods_notice_form',
                name: '收货通知单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'receipt_goods_notice_form'
                },
                component: () =>
                    import('@/views/erp/purchase/purchase_bill/receipt_goods_notice_form')
            },
        ]
    },
    {
        path: '/purchase/supplierManager',
        component: Layout,
        redirect: '/purchase/supplierManager',
        children: [
            {
                path: 'supplier',
                name: '供应商资料',
                meta: {
                    i18n: 'supplier'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/supplierManager/supplier')
            },
            {
                path: 'supplier_linkman',
                name: '供应商联系人',
                meta: {
                    i18n: 'supplier_linkman'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/supplierManager/supplierLinkman')
            },
        ]
    },
    {
        path: '/purchase/purchase_report',
        component: Layout,
        redirect: '/purchase/purchase_report',
        children: [
            {
                path: 'purchase_pay_warning',
                name: '采购付款预警表',
                meta: {
                    i18n: 'purchase_pay_warning'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_report/purchase_pay_warning')
            },
            {
                path: 'purchase_invoice_warning',
                name: '采购收票预警表',
                meta: {
                    i18n: 'purchase_invoice_warning'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_report/purchase_invoice_warning')
            },
            {
                path: 'purchase_summary_list',
                name: '采购汇总表',
                meta: {
                    i18n: 'purchase_summary_list'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_report/purchaseSummaryList')
            },
            {
                path: 'purchase_detail_list',
                name: '采购明细表',
                meta: {
                    i18n: 'purchase_detail_list'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/purchase/purchase_report/purchaseDetailList')
            },
            {
                path: 'purchase_order_tail',
                name: '采购订单跟踪',
                meta: {
                    i18n: 'purchase_order_tail'
                },
                props: (route) => ({timeStamp: route.query.timeStamp,id: route.query.id}),
                component: () =>
                    import('@/views/erp/purchase/purchase_report/purchase_order_tail')
            },
        ]
    },
    /***********采购End******************/
    /***********库存Start******************/
    {
        path: '/wms/allocation',
        component: Layout,
        redirect: '/wms/allocation',
        children: [
            {
                path: 'allocation_stock_out',
                name: '商品调拨单',
                meta: {
                    i18n: 'allocation_stock_out'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/allocation/allocation_stock_out')
            },
            {
                path: 'allocation_stock_out_form',
                name: '商品调拨单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'allocation_stock_out_form'
                },
                component: () =>
                    import('@/views/erp/wms/allocation/allocation_stock_out_form')
            },
        ]
    },
    {
        path: '/project_management/project_manager/project_data',
        component: Layout,
        redirect: '/project_management/project_manager/project_data',
        children: [
            {
                path: 'project_contract',
                name: '合同',
                meta: {
                    i18n: 'project_contract'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/project_management/project_contract')
            },
        ]
    },

    {
        path: '/project_management/project_manager',
        component: Layout,
        redirect: '/project_management/project_manager',
        children: [
            {
                path: 'project_overview',
                name: '项目概览',
                meta: {
                    i18n: 'project_overview'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/project_management/project_overview')
            },
            {
                path: 'project_list',
                name: '项目列表',
                meta: {
                    i18n: 'project_list'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/project_management/project_list')
            },
            {
                path: 'project_audit',
                name: '项目审批',
                meta: {
                    i18n: 'project_audit'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/project_management/project_audit')
            },
            {
                path: 'project_view',
                name: '项目详情',
                meta: {
                    i18n: 'project_view'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                }),
                component: () =>
                    import('@/views/erp/project_management/project_view')
            },
        ]
    },
    {
        path: '/wms',
        component: Layout,
        redirect: '/wms',
        children: [
            {
                path: 'cost_adjustment',
                name: '成本调整单',
                meta: {
                    i18n: 'cost_adjustment'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/cost_adjustment')
            },
            {
                path: 'cost_adjustment_form',
                name: '成本调整单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'cost_adjustment_form'
                },
                component: () =>
                    import('@/views/erp/wms/cost_adjustment_form')
            },
            {
                path: 'combind',
                name: '组装拆卸单',
                meta: {
                    i18n: 'combind'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/combind')
            },
            {
                path: 'combind_form',
                name: '组装拆卸单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'combind_form'
                },
                component: () =>
                    import('@/views/erp/wms/combind_form')
            },
            {
                path: 'stock_modify',
                name: '库存修改单',
                meta: {
                    i18n: 'stock_modify'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_modify')
            },
            {
                path: 'stock_modify_form',
                name: '库存修改单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'stock_modify_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_modify_form')
            },
        ]
    },
    /***********库存End******************/
    /***********仓储Start******************/
    {
        path: '/wms/stock_in',
        component: Layout,
        redirect: '/wms/stock_in',
        children: [
            {
                path: 'other_stock_in',
                name: '其它入库',
                meta: {
                    i18n: 'other_stock_in'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/other_stock_in')
            },
            {
                path: 'other_stock_in_form',
                name: '其它入库制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'other_stock_in_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_in/other_stock_in_form')
            },
            {
                path: 'other_stock_out',
                name: '其它出库',
                meta: {
                    i18n: 'other_stock_out'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/other_stock_out')
            },
            {
                path: 'other_stock_out_form',
                name: '其它出库制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'other_stock_out_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_in/other_stock_out_form')
            },
            {
                path: 'purchase_stock_in',
                name: '采购入库',
                meta: {
                    i18n: 'purchase_stock_in'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/purchase_stock_in')
            },
            {
                path: 'purchase_stock_in_form',
                name: '采购入库制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'purchase_stock_in_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_in/purchase_stock_in_form')
            },
            {
                path: 'material_stock_return',
                name: '退料入库单',
                meta: {
                    i18n: 'material_stock_return'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/material_stock_return')
            },
            {
                path: 'material_stock_return_form',
                name: '退料入库单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'material_stock_return_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_in/material_stock_return_form')
            },
            {
                path: 'product_stock_in',
                name: '生产入库单',
                meta: {
                    i18n: 'product_stock_in'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/product_stock_in')
            },
            {
                path: 'product_stock_in_form',
                name: '生产入库单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'product_stock_in_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_in/product_stock_in_form')
            },
            {
                path: 'sales_stock_return',
                name: '销售退货',
                meta: {
                    i18n: 'sales_stock_return'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_in/sales_stock_return')
            },
            {
                path: 'sales_stock_return_form',
                name: '销售退货制单',
                meta: {
                    i18n: 'sales_stock_return_form'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                component: () =>
                    import('@/views/erp/wms/stock_in/sales_stock_return_form')
            },
        ]
    },
    {
        path: '/wms/check_stock',
        component: Layout,
        redirect: '/wms/check_stock',
        children: [
            {
                path: 'check_stock',
                name: '库存盘点单',
                meta: {
                    i18n: 'check_stock'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock')
            },
            {
                path: 'check_stock_form',
                name: '库存盘点单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'check_stock_form'
                },
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock_form')
            },
            {
                path: 'check_stock_loss',
                name: '盘亏出库单',
                meta: {
                    i18n: 'check_stock_loss'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock_loss')
            },
            {
                path: 'check_stock_loss_form',
                name: '盘亏出库单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'check_stock_loss_form'
                },
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock_loss_form')
            },
            {
                path: 'check_stock_profit',
                name: '盘盈入库单',
                meta: {
                    i18n: 'check_stock_profit'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock_profit')
            },
            {
                path: 'check_stock_profit_form',
                name: '盘盈入库单制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'check_stock_profit_form'
                },
                component: () =>
                    import('@/views/erp/wms/check_stock/check_stock_profit_form')
            },
            // {
            //     path: 'stock-change-record',
            //     name: '库存收发明细表',
            //     props: (route) => ({type: route.query.type, id: route.query.id}),
            //     meta: {
            //         i18n: 'stock-change-record'
            //     },
            //     component: () =>
            //         import('@/views/erp/wms/wms_report/stock-change-record')
            // },

        ]
    },
    {
        path: '/wms/stock-query',
        component: Layout,
        redirect: '/wms/stock-query',
        children: [
            {
                path: 'goods_stock_query',
                name: '即时库存查询',
                meta: {
                    i18n: 'goods_stock_query'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock-query/goods_stock_query')
            },
            {
                path: 'stock_warning_query',
                name: '库存预警查询',
                meta: {
                    i18n: 'stock_warning_query'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock-query/stock_warning_query')
            },
            {
                path: 'share_stock_query',
                name: '共享库存查询',
                meta: {
                    i18n: 'share_stock_query'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock-query/share_stock_query')
            },
        ]
    },
    {
        path: '/wms/stock_out',
        component: Layout,
        redirect: '/wms/stock_out',
        children: [
            {
                path: 'material_stock_out',
                name: '领料出库单',
                meta: {
                    i18n: 'material_stock_out'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_out/material_stock_out')
            },
            {
                path: 'material_stock_out_form',
                name: '领料出库单制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'material_stock_out_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_out/material_stock_out_form')
            },
            {
                path: 'purchase_stock_return',
                name: '采购退货',
                meta: {
                    i18n: 'purchase_stock_return'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_out/purchase_stock_return')
            },
            {
                path: 'purchase_stock_return_form',
                name: '采购退货制单',
                props: (route) => ({type: route.query.type, id: route.query.id,taskType: route.query.taskType,}),
                meta: {
                    i18n: 'purchase_stock_return_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_out/purchase_stock_return_form')
            },
            {
                path: 'purchase_stock_return',
                name: '采购退货',
                meta: {
                    i18n: 'purchase_stock_return'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/stock_out/purchase_stock_return')
            },
            {
                path: 'purchase_stock_return_form',
                name: '采购退货制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    taskType: route.query.taskType,
                    step: route.query.step
                }),
                meta: {
                    i18n: 'purchase_stock_return_form'
                },
                component: () =>
                    import('@/views/erp/wms/stock_out/purchase_stock_return_form')
            },
        ]
    },
    {
        path: '/wms/stock-report',
        component: Layout,
        redirect: '/wms/stock-report',
        children: [
            {
                path: 'stock-change-record-summary',
                name: '商品收发汇总表',
                meta: {
                    i18n: 'stock-change-record-summary'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/wms_report/stock-change-record-summary')
            },
            {
                path: 'stock-change-record',
                name: '商品收发明细表',
                meta: {
                    i18n: 'stock-change-record'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/wms_report/stock-change-record')
            },
            {
                path: 'stock-summary-report',
                name: '商品库存汇总表',
                meta: {
                    i18n: 'stock-summary-report'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/wms_report/stock-summary-report')
            },
        ]
    },
    {
        path: '/config/wms_config',
        component: Layout,
        redirect: '/config/wms_config',
        children: [
            {
                path: 'stock_logistics',
                name: '物流配置',
                meta: {
                    i18n: 'stock_logistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/wms_config/stock_logistics')
            },
            {
                path: 'warehouse',
                name: '仓库信息',
                meta: {
                    i18n: 'warehouse'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/wms_config/warehouse')
            },
            {
                path: 'warehouse_form',
                name: '仓库信息制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'warehouse_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/wms_config/warehouse_form')
            },
            {
                path: 'warehouse_position',
                name: '仓位信息',
                meta: {
                    i18n: 'warehouse'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/wms_config/warehouse_position')
            },
            {
                path: 'warehouse_position_form',
                name: '仓位信息制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'warehouse_position_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/wms_config/warehouse_position_form')
            },
        ]
    },
    {
        path: '/basic_data',
        component: Layout,
        redirect: '/basic_data',
        children: [
            {
                path: 'contract-template',
                name: '合同模板',
                meta: {
                    i18n: 'contract-template'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/contract-template')
            },
        ]
    },
    {
        path: '/basic_data/project_manage_info',
        component: Layout,
        redirect: '/basic_data/project_manage_info',
        children: [
            {
                path: 'project_stage',
                name: '项目阶段',
                meta: {
                    i18n: 'project_stage'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/project_manage_info/project_stage')
            },
            {
                path: 'project_stage_form',
                name: '项目阶段制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'project_stage_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/project_manage_info/project_stage_form')
            },
            {
                path: 'project_type',
                name: '项目类型',
                meta: {
                    i18n: 'project_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/project_manage_info/project_type')
            },
            {
                path: 'project_type_form',
                name: '项目类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'project_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/project_manage_info/project_type_form')
            },
        ]
    },
    {
        path: '/basic_data/other_info',
        component: Layout,
        redirect: '/basic_data/other_info',
        children: [
            {
                path: 'common_carrier',
                name: '承运商',
                meta: {
                    i18n: 'common_carrier'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/other_info/common_carrier')
            },
            {
                path: 'common_carrier_form',
                name: '承运商制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'common_carrier_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/other_info/common_carrier_form')
            },
            {
                path: 'other_contacts_company',
                name: '其它往来单位',
                meta: {
                    i18n: 'other_contacts_company'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/other_info/other_contacts_company')
            },
            {
                path: 'other_contacts_company_form',
                name: '其它往来单位制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'other_contacts_company_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/other_info/other_contacts_company_form')
            },
        ]
    },
    {
        path: '/config/financial_config',
        component: Layout,
        redirect: '/config/financial_config',
        children: [
            {
                path: 'currency',
                name: '币别',
                meta: {
                    i18n: 'currency'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/currency')
            },
            {
                path: 'currency_form',
                name: '币别制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'currency_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/currency_form')
            },
            {
                path: 'subject',
                name: '科目',
                meta: {
                    i18n: 'currency'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/subject')
            },
            {
                path: 'subject_form',
                name: '科目制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'currency_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/subject_form')
            },
            {
                path: 'capital_account',
                name: '银行账户',
                meta: {
                    i18n: 'capital_account'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/capital_account')
            },
            {
                path: 'capital_account_form',
                name: '银行账户制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'capital_account_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/capital_account_form')
            },
            {
                path: 'company_account',
                name: '公司账户',
                meta: {
                    i18n: 'company_account'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/company_account')
            },
            {
                path: 'company_account_form',
                name: '公司账户制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'company_account_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/company_account_form')
            },
            {
                path: 'paymentsMeans',
                name: '结算方式',
                meta: {
                    i18n: 'paymentsMeans'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/paymentsMeans')
            },
            {
                path: 'paymentsMeansForm',
                name: '结算方式制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'paymentsMeansForm'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/paymentsMeansForm')
            },
            {
                path: 'register_type',
                name: '费用类型',
                meta: {
                    i18n: 'register_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/register_type')
            },
            {
                path: 'invoice_info',
                name: '开票信息',
                meta: {
                    i18n: 'invoice_info'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/invoice_info')
            },
            {
                path: 'register_type_form',
                name: '费用类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'register_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/register_type_form')
            },
            {
                path: 'fee_type',
                name: '费用类型',
                meta: {
                    i18n: 'fee_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/fee_type')
            },
            {
                path: 'fee_type_form',
                name: '费用类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'fee_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/fee_type_form')
            },
            {
                path: 'tax_code',
                name: '税收代码',
                meta: {
                    i18n: 'tax_code'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/tax_code')
            },
            {
                path: 'tax_code_form',
                name: '税收代码制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'tax_code_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/tax_code_form')
            },
            {
                path: 'receipt_type',
                name: '收款类型',
                meta: {
                    i18n: 'receipt_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/receipt_type')
            },
            {
                path: 'receipt_type_form',
                name: '收款类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'tax_code_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/receipt_type_form')
            },
            {
                path: 'payment_type',
                name: '付款类型',
                meta: {
                    i18n: 'payment_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/config/financial_config/payment_type')
            },
            {
                path: 'payment_type_form',
                name: '付款类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'payment_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/config/financial_config/payment_type_form')
            },
        ]
    },
    {
        path: '/config/goodsManager',
        component: Layout,
        redirect: '/config/goodsManager',
        children: [
            {
                path: 'goodsList',
                name: '商品列表',
                meta: {
                    i18n: 'goodsList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/goodsList')
            },
            {
                path: 'goodsListForm',
                name: '商品列表制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'goodsListForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/goodsListForm')
            },
            {
                path: 'brand',
                name: '商品品牌',
                meta: {
                    i18n: 'brand'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/brand')
            },
            {
                path: 'goods_tax_code',
                name: '商品税务编码',
                meta: {
                    i18n: 'goods_tax_code'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/goods_tax_code')
            },
            {
                path: 'goods_tax_code_form',
                name: '商品税务编码制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'goods_tax_code_form'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/goods_tax_code_form')
            },
            {
                path: 'category',
                name: '商品类目',
                meta: {
                    i18n: 'category'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/category')
            },
            {
                path: 'series',
                name: '商品系列',
                meta: {
                    i18n: 'series'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/series')
            },
            {
                path: 'seriesForm',
                name: '商品系列制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'seriesForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/seriesForm')
            },
            {
                path: 'brandForm',
                name: '商品品牌制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'brandForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/brandForm')
            },
            {
                path: 'measureunit',
                name: '计量单位',
                meta: {
                    i18n: 'measureunit'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/measureunit')
            },
            {
                path: 'measureunitForm',
                name: '计量单位制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'measureunitForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/measureunitForm')
            },
            {
                path: 'goodsManager/sales_info/project_type',
                name: '项目订单类型',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'measureunitForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/sales_info/project_type')
            },
            {
                path: 'goodsManager/sales_info/project_type_form',
                name: '项目订单类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'measureunitForm'
                },
                component: () =>
                    import('@/views/erp/sales/config/goodsManager/sales_info/project_type_form')
            },
        ]
    },
    /***********仓储End******************/
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
    /***********财务Start******************/
    {
        path: '/financial/capital-manage',
        component: Layout,
        redirect: '/financial/capital-manage',
        children: [
            {
                path: 'bank-account',
                name: '银行资金',
                meta: {
                    i18n: 'bank-account'
                },
                component: () =>
                    import('@/views/erp/financial/capital-manage/bank-account')
            },
            {
                path: 'stock-account',
                name: '库存资金',
                meta: {
                    i18n: 'stock-account'
                },
                component: () =>
                    import('@/views/erp/financial/capital-manage/stock-account')
            },
        ]
    },
    {
        path: '/financial/expense',
        component: Layout,
        redirect: '/financial/expense',
        children: [
            {
                path: 'financialFeeRegister',
                name: '费用登记单',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'financialFeeRegister'
                },
                component: () =>
                    import('@/views/erp/financial/expense/financialFeeRegister')
            },
            {
                path: 'financialFeeRegisterForm',
                name: '费用登记单制单',
                meta: {
                    i18n: 'financialFeeRegisterForm'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                component: () =>
                    import('@/views/erp/financial/expense/financialFeeRegisterForm')
            },
            {
                path: 'expenses-apply',
                name: '费用申请',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'expenses-apply'
                },
                component: () =>
                    import('@/views/erp/financial/expense/expenses-apply')
            },
            {
                path: 'expenses-apply-form',
                name: '费用申请制单',
                meta: {
                    i18n: 'expenses-apply-form'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                component: () =>
                    import('@/views/erp/financial/expense/expenses-apply-form')
            },
            {
                path: 'expense-reimburse',
                name: '费用报销',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'expense-reimburse'
                },
                component: () =>
                    import('@/views/erp/financial/expense/expense-reimburse')
            },
            {
                path: 'expense-reimburse-form',
                name: '费用报销制单',
                meta: {
                    i18n: 'expense-reimburse-form'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                component: () =>
                    import('@/views/erp/financial/expense/expense-reimburse-form')
            },
        ]
    },
    {
        path: '/financial/receivable',
        component: Layout,
        redirect: '/financial/receivable',
        children: [
            {
                path: 'receivable-init',
                name: '应收初始化',
                meta: {
                    i18n: 'receivable-init'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/receivable/receivable-init')
            },
            {
                path: 'receivable-init-form',
                name: '应收初始化制单',
                meta: {
                    i18n: 'receivable-init'
                },
                props: (route) => ({type: route.query.type, id: route.query.id}),
                component: () =>
                    import('@/views/erp/financial/receivable/receivable-init-form')
            },
            {
                path: 'receivables-statistics',
                name: '应收汇总表',
                meta: {
                    i18n: 'receivables-statistics'
                },
                component: () =>
                    import('@/views/erp/financial/receivable/receivables-statistics')
            },
            {
                path: 'receivables-detail',
                name: '应收明细',
                meta: {
                    i18n: 'receivables-detail'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/receivable/receivables-detail')
            },

            {
                path: 'sales-receivable',
                name: '收款单',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'sales-receivable'
                },
                component: () =>
                    import('@/views/erp/financial/receivable/sales-receivable')
            },
            {
                path: 'sales-receivable-form',
                name: '收款单制单',
                meta: {
                    i18n: 'sales-receivable-form'
                },
                props: (route) => ({ type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType}),
                component: () =>
                    import('@/views/erp/financial/receivable/sales-receivable-form')
            },
            {
                path: 'sales-invoice',
                name: '销售发票',
                meta: {
                    i18n: 'sales-invoice'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/receivable/sales-invoice')
            },
            {
                path: 'sales-invoice-form',
                name: '销售发票制单',
                meta: {
                    i18n: 'sales-invoice-form'
                },
                props: (route) => ({ type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType}),
                component: () =>
                    import('@/views/erp/financial/receivable/sales-invoice-form')
            },
            {
                path: 'sales-return-invoice',
                name: '销售退票',
                meta: {
                    i18n: 'sales-return-invoice'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/receivable/sales-return-invoice')
            },
            {
                path: 'sales-return-invoice-form',
                name: '销售退票制单',
                meta: {
                    i18n: 'sales-return-invoice-form'
                },
                props: (route) => ({ type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType}),
                component: () =>
                    import('@/views/erp/financial/receivable/sales-return-invoice-form')
            },
            {
                path: 'customer_reconciliation',
                name: '客户对账',
                meta: {
                    i18n: 'customer_reconciliation'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/receivable/customer_reconciliation')
            },
        ]
    },
    {
        path: '/financial/payable',
        component: Layout,
        redirect: '/financial/payable',
        children: [
            {
                path: 'purchase-invoice',
                name: '采购收票',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'purchase-invoice'
                },
                component: () =>
                    import('@/views/erp/financial/payable/purchase-invoice')
            }, {
                path: 'purchase_invoice_form',
                name: '采购收票制单',
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                meta: {
                    i18n: 'purchase_invoice_form'
                },
                component: () =>
                    import('@/views/erp/financial/payable/purchase_invoice_form')
            },
            {
                path: 'payable-init',
                name: '应付初始化',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'payable-init'
                },
                component: () =>
                    import('@/views/erp/financial/payable/payable-init')
            },
            {
                path: 'payable-init-form',
                name: '应付初始化制单',
                meta: {
                    i18n: 'payable-init-form'
                },
                props: (route) => ({type: route.query.type, id: route.query.id}),
                component: () =>
                    import('@/views/erp/financial/payable/payable-init-form')

            },
            {
                path: 'payable-detail',
                name: '应付明细',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'payable-detail'
                },
                component: () =>
                    import('@/views/erp/financial/payable/payable-detail')
            },
            {
                path: 'payable-statistics',
                name: '应付汇总表',
                meta: {
                    i18n: 'payable-statistics'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/payable/payable-statistics')
            },
            {
                path: 'purchase-payment',
                name: '付款单',
                meta: {
                    i18n: 'purchase-payment'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/payable/purchase-payment')
            },
            {
                path: 'purchase-payment-form',
                name: '付款单制单',
                meta: {
                    i18n: 'purchase-payment-form'
                },
                props: (route) => ({
                    type: route.query.type,
                    id: route.query.id,
                    billId: route.query.billId,
                    step: route.query.step,
                    taskType: route.query.taskType
                }),
                component: () =>
                    import('@/views/erp/financial/payable/purchase-payment-form')
            },
            {
                path: 'supplier_reconciliation',
                name: '供应商对账',
                meta: {
                    i18n: 'supplier_reconciliation'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/financial/payable/supplier_reconciliation')
            },
        ]
    },
    {
        path: '/config/financial_config',
        component: Layout,
        redirect: '/config/financial_config',
        children: []
    },
    /***********财务End******************/
    /***********客户Start******************/
    {
        path: '/crm/customer',
        component: Layout,
        redirect: '/crm/customer',
        children: [
            {
                path: 'customerInfo',
                name: '我的客户',
                meta: {
                    i18n: 'customerInfo'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/crm/customer/customerInfo')
            },
            {
                path: 'customerLinkman',
                name: '客户联系人',
                meta: {
                    i18n: 'customerLinkman'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/crm/customer/customerLinkman')
            },
        ]
    },
    /***********客户End******************/
    /***********基础数据管理Start******************/
    {
        path: '/adminSys/application_center',
        component: Layout,
        redirect: '/adminSys/application_center',
        children: [
            {
                path: 'added_services',
                name: '增值服务',
                meta: {
                    i18n: 'userManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/application_center/added_services')
            },
            {
                path: 'buy_record',
                name: '购买记录',
                meta: {
                    i18n: 'userManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/application_center/buy_record')
            },
        ]
    },
    {
        path: '/adminSys/baseManager',
        component: Layout,
        redirect: '/adminSys/baseManager',
        children: [
            {
                path: 'page_setting',
                name: '首页设置',
                meta: {
                    i18n: 'page_setting'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/page_setting')
            },
            {
                path: 'code_rule',
                name: '编码规则',
                meta: {
                    i18n: 'code_rule'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/code_rule')
            },
            {
                path: 'userManager',
                name: '用户管理',
                meta: {
                    i18n: 'userManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/userManager')
            },
            {
                path: 'userManagerForm',
                name: '用户管理制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'userManagerForm'
                },
                component: () =>
                    import('@/views/erp/adminSys/baseManager/userManagerForm')
            },
            {
                path: 'menuManager',
                name: '菜单管理',
                meta: {
                    i18n: 'menuManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/menuManager')
            },
            {
                path: 'dictManager',
                name: '数据字典',
                meta: {
                    i18n: 'dictManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/dictManager')
            },
            {
                path: 'gateLogManager',
                name: '操作日志',
                meta: {
                    i18n: 'gateLogManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/gateLogManager')
            },
            {
                path: 'groupManager',
                name: '角色权限',
                meta: {
                    i18n: 'groupManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/groupManager')
            },
            {
                path: 'tenantManager',
                name: '租户管理',
                meta: {
                    i18n: 'tenantManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/tenantManager')
            },
            {
                path: 'tenantManagerView',
                name: '租户管理详情',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'tenantManagerView'
                },
                component: () =>
                    import('@/views/erp/adminSys/baseManager/tenantManagerView')
            },
        ]
    },
    {
        path: '/adminSys',
        component: Layout,
        redirect: '/adminSys',
        children: [
            {
                path: 'data_backup',
                name: '数据备份',
                meta: {
                    i18n: 'data_backup'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/data_backup')
            },
            {
                path: 'version_update',
                name: '版本更新',
                meta: {
                    i18n: 'version_update'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/version_update')
            },
        ]
    },
    {
        path: '/adminSys/baseManager/parameterConfiguration',
        component: Layout,
        redirect: '/adminSys/baseManager/parameterConfiguration',
        children: [
            {
                path: 'business_configuration',
                name: '订单配置',
                meta: {
                    i18n: 'business_configuration'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/business_configuration')
            },
            {
                path: 'system_parameter',
                name: '系统参数',
                meta: {
                    i18n: 'system_parameter'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/system_parameter')
            },
            {
                path: 'stock_configuration',
                name: '库存设置',
                meta: {
                    i18n: 'stock_configuration'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/stock_configuration')
            },
            {
                path: 'capital_manager',
                name: '财务设置',
                meta: {
                    i18n: 'capital_manager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/capital_manager')
            },
            {
                path: 'process_configuration',
                name: '流程配置',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'process_configuration'
                },
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/process_configuration')
            },
            {
                path: 'process_configuration_form',
                name: '流程配置制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'process_configuration_form'
                },
                component: () =>
                    import('@/views/erp/adminSys/baseManager/parameterConfiguration/process_configuration_form')
            },
        ]
    },
    {
        path: '/adminSys/orgManager',
        component: Layout,
        redirect: '/adminSys/orgManager',
        children: [
            {
                path: 'departManager',
                name: '组织部门',
                meta: {
                    i18n: 'departManager'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/adminSys/orgManager/departManager')
            },
        ]
    },
    {
        path: '/adminSys/initial_entry',
        component: Layout,
        redirect: '/adminSys/initial_entry',
        children: [
            {
                path: 'stock_initial_entry',
                name: '期初库存',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'stock_initial_entry'
                },
                component: () =>
                    import('@/views/erp/adminSys/initial_entry/stock_initial_entry')
            },
            {
                path: 'stock_initial_entry_form',
                name: '期初库存制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'stock_initial_entry_form'
                },
                component: () =>
                    import('@/views/erp/adminSys/initial_entry/stock_initial_entry_form')
            },
            {
                path: 'beginning_bank',
                name: '期初银行资金',
                props: (route) => ({timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'beginning_bank'
                },
                component: () =>
                    import('@/views/erp/adminSys/initial_entry/beginning_bank')
            },
            {
                path: 'beginning_bank_form',
                name: '期初银行资金制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'beginning_bank_form'
                },
                component: () =>
                    import('@/views/erp/adminSys/initial_entry/beginning_bank_form')
            },
        ]
    },
    /***********基础数据管理End******************/
    /***********办公管理Start******************/
    {
        path: '/oa/task',
        component: Layout,
        redirect: '/oa/task',
        children: [
            {
                path: 'taskNowList',
                name: '待办任务',
                meta: {
                    i18n: 'taskNowList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp, selectType: route.query.selectType}),
                component: () =>
                    import('@/views/erp/oa/task/taskNowList')
            },
            {
                path: 'taskHistoryList',
                name: '已办任务',
                meta: {
                    i18n: 'taskHistoryList'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/oa/task/taskHistoryList')
            },
        ]
    },
    {
        path: '/oa/oa',
        component: Layout,
        redirect: '/oa/oa',
        children: [
            {
                path: 'oaDocument',
                name: '公司文档',
                meta: {
                    i18n: 'oaDocument'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/oa/oa/oaDocument')
            },
        ]
    },
    /***********办公管理End******************/
    /***********基础资料Start******************/
    {
        path: '/basic_data/customer_info',
        component: Layout,
        redirect: '/basic_data/customer_info',
        children: [
            {
                path: 'customer_type',
                name: '客户类型',
                meta: {
                    i18n: 'customer_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_type')
            },
            {
                path: 'customer_type_form',
                name: '客户类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'customer_type_form'
                },
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_type_form')
            },
            {
                path: 'customer_grade',
                name: '客户等级',
                meta: {
                    i18n: 'customer_grade'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_grade')
            },
            {
                path: 'customer_grade_form',
                name: '客户等级制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'customer_grade_form'
                },
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_grade_form')
            },
            {
                path: 'customer_attribute',
                name: '客户属性',
                meta: {
                    i18n: 'customer_attribute'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_attribute')
            },
            {
                path: 'customer_attribute_form',
                name: '客户属性制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'customer_attribute_form'
                },
                component: () =>
                    import('@/views/erp/basic_data/customer_info/customer_attribute_form')
            },
        ]
    },
    {
        path: '/basic_data/purchase_info',
        component: Layout,
        redirect: '/basic_data/purchase_info',
        children: [
            {
                path: 'purchase_order_type',
                name: '采购订单类型',
                meta: {
                    i18n: 'purchase_order_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/purchase_info/purchase_order_type')
            },
            {
                path: 'purchase_order_type_form',
                name: '采购订单类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'purchase_order_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/purchase_info/purchase_order_type_form')
            },
            {
                path: 'supplier_type',
                name: '供应商类别',
                props: (route) => ({type: route.query.type, id: route.query.id, timeStamp: route.query.timeStamp}),
                meta: {
                    i18n: 'supplier_type'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/purchase_info/supplier_type')
            },
            {
                path: 'supplier_type_form',
                name: '供应商类别制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'supplier_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/purchase_info/supplier_type_form')
            },
        ]
    },
    {
        path: '/basic_data/sales_info',
        component: Layout,
        redirect: '/basic_data/sales_info',
        children: [
            {
                path: 'sales_order_type',
                name: '销售订单类型',
                meta: {
                    i18n: 'sales_order_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/wms/basic_data/sales_info/sales_order_type')
            },
            {
                path: 'sales_order_type_form',
                name: '销售订单类型制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'sales_order_type_form'
                },
                component: () =>
                    import('@/views/erp/wms/basic_data/sales_info/sales_order_type_form')
            },
        ]
    },
    {
        path: '/basic_data/hr_info',
        component: Layout,
        redirect: '/basic_data/hr_info',
        children: [
            {
                path: 'staff_type',
                name: '人员类别',
                meta: {
                    i18n: 'staff_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/hrm/staff_type')
            },
            {
                path: 'staff_type_form',
                name: '人员类别制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'staff_type_form'
                },
                component: () =>
                    import('@/views/erp/hrm/staff_type_form')
            },
            {
                path: 'job_type',
                name: '职称',
                meta: {
                    i18n: 'job_type'
                },
                props: (route) => ({timeStamp: route.query.timeStamp}),
                component: () =>
                    import('@/views/erp/hrm/job_type')
            },
            {
                path: 'job_type_form',
                name: '职称制单',
                props: (route) => ({type: route.query.type, id: route.query.id}),
                meta: {
                    i18n: 'job_type_form'
                },
                component: () =>
                    import('@/views/erp/hrm/job_type_form')
            },
        ]
    },
    /***********基础资料End******************/
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
