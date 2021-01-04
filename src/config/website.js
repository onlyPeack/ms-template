/**
 * 全局配置文件
 */
export default {
    // title: "梅施云ERP",
    title: "商城管理中心",
    logo: "A",
    key: 'avuex',//配置主键,目前用于存储
    // indexTitle: '梅施云ERP',
    indexTitle: '商城管理中心',
    lockPage: '/lock',
    tokenTime: 6000,
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [400],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        meta: {
            i18n: 'dashboard'
        },
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        iconDefault: 'icon-caidan',
        props: {
            title: 'title',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}
