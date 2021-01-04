import {setToken, removeToken} from '@/util/auth'
import {setStore, getStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {deepClone} from '@/util/util'
import webiste from '@/config/website'
import {loginByUsername, getUserInfo, getMenu, getTopMenu, logout, refeshToken,insertLog,beforeLoginOut} from '@/api/user'
import {parameterList} from '@/api/erp/manager/config/index'

function addPath(ele, first) {
    const menu = webiste.menu;
    const propsConfig = menu.props;
    const propsDefault = {
        label: propsConfig.label || 'label',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const icon = ele[propsDefault.icon];
    ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
    if (!isChild && first && !isURL(ele[propsDefault.path])) {
        ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    } else {
        ele[propsDefault.children].forEach(child => {
            if (!isURL(child[propsDefault.path])) {
                child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
            }
            addPath(child);
        })
    }

}

const user = {
    state: {
        userInfo: {},
        permission: {},
        roles: undefined,
        sysParam: {},
        menuId: getStore({name: 'menuId'}) || [],
        menu: getStore({name: 'menu'}) || [],
        menuAll: getStore({name: 'menuAll'}) || [],
        token: getStore({name: 'token'}) || '',
        elements: [],
    },
    actions: {
        //根据用户名登录
        LoginByUsername({commit}, user) {
            return new Promise((resolve) => {
                loginByUsername(user.username, user.password, user.tenantId).then(res => {
                    const data = res.data;
                    commit('SET_TOKEN', data.access_token);
                    commit('SET_USERIFNO', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    insertLog().then(res=>{
                    })
                    parameterList().then((res) => {
                        const list = res.data.data.records;
                        var sysParam = {
                            discountDecimal: 2,
                            amountDecimal: 2
                        };
                        if (list.length > 0) {
                            let index1 = list.findIndex(item => item.name == '折扣小数配置');
                            let index2 = list.findIndex(item => item.name == '金额小数配置');
                            sysParam.discountDecimal = index1 > -1 ? list[index1].value : 2;
                            sysParam.amountDecimal = index2 > -1 ? list[index2].value : 2;
                        }
                        commit('SET_SYSPARAM', sysParam);
                    }, error => {
                    });
                    resolve();
                })
            })
        },
        //根据手机号登录
        LoginByPhone({commit}, userInfo) {
            return new Promise((resolve) => {
                loginByUsername(userInfo.phone, userInfo.code).then(res => {
                    const data = res.data.data;
                    insertLog().then(res=>{
                    })
                    commit('SET_TOKEN', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    resolve();
                })
            })
        },
        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data;
                    commit('SET_USERIFNO', data);
                    commit('SET_ROLES', 'admin');
                    const menus = {};
                    for (let i = 0; i < data.menus.length; i++) {
                        menus[data.menus[i].code] = true
                    }
                    commit('SET_MENUS', menus);
                    const elements = {};
                    for (let i = 0; i < data.elements.length; i++) {
                        elements[data.elements[i].code] = true
                    }
                    commit('SET_ELEMENTS', elements);
                    // commit('SET_PERMISSION', data.permission);
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        //刷新token
        RefeshToken({state, commit}) {
            return new Promise((resolve, reject) => {
                // refeshToken(state.refeshToken).then(res => {
                //     const data = res.data.data;
                //     commit('SET_TOKEN', data);
                //     resolve(data);
                // }).catch(error => {
                //     reject(error)
                // })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {

                logout(user.state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_MENUID', {})
                    commit('SET_MENUALL', []);
                    commit('SET_MENU', [])
                    commit('SET_ROLES', '')
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_MENUID', {})
                commit('SET_MENUALL', []);
                commit('SET_MENU', [])
                commit('SET_ROLES', '')
                commit('DEL_ALL_TAG');
                commit('CLEAR_LOCK');
                removeToken()
                resolve()
            })
        },
        GetTopMenu({commit}) {
            return new Promise(resolve => {
                getTopMenu().then((res) => {
                    const data = res.data || [];
                    commit('SET_MENU', data);
                    if (user.state.menuId.length < 1) {
                        commit('SET_MENUID', [data[0]]);
                    }
                    resolve(data)
                })
            })
        },
        //获取系统菜单
        GetMenu({commit}, parentId) {
            return new Promise(resolve => {
                getMenu(parentId).then((res) => {
                    const data = res.data.data
                    let menu = deepClone(data);
                    menu.forEach(ele => {
                        addPath(ele, true);
                    })
                    commit('SET_MENU', menu)
                    resolve(menu)
                })
            })
        },
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            setToken(token)
            state.token = token;
            setStore({name: 'token', content: state.token, type: 'session'})
        },
        SET_MENUID(state, menuId) {
            state.menuId = menuId;
            setStore({name: 'menuId', content: state.menuId, type: 'session'})
        },
        SET_USERIFNO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_MENUALL: (state, menuAll) => {
            state.menuAll = menuAll
            setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
        },
        SET_ELEMENTS: (state, elements) => {
            state.elements = elements;
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            let menuAll = state.menuAll;
            if (!validatenull(menu)) {
                const obj = menuAll.filter(ele => ele.path === menu[0].path)[0]
                if (!obj) {
                    menuAll = menuAll.concat(menu);
                    state.menuAll = menuAll
                }
                setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
            }
            setStore({name: 'menu', content: state.menu, type: 'session'})
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_SYSPARAM: (state, sysParam) => {
            state.sysParam = sysParam;
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = {};
            permission.forEach(ele => {
                state.permission[ele] = true;
            });
        }
    }

}
export default user