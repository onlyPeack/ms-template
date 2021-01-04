/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from './store'
import {validatenull} from '@/util/validate'
import {getToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false});
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
    //console.log('before',from,to)
    const meta = to.meta || {};
    const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
    store.commit('SET_IS_MENU', isMenu === undefined);
    if (to.query.accessKey) {
        store.commit('SET_TOKEN', to.query.accessKey);
    }
    //console.log('观测点2')
    if (getToken()) {
        //console.log('观测点1')
        if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
            next({path: lockPage})
        } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
            if (to.query.urlName) {
                next({name: to.query.urlName, path: '/' + to.query.url, replace: true})
            } else {
                if (to.query.url) {
                    next({name: to.query.urlName, path: '/' + to.query.url})
                } else if (to.path.indexOf('print') > -1) {
                    next({...to, replace: true})
                } else {
                    next({path: '/'})
                }
            }

        } else {

            //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
            if (!store.getters.roles || store.getters.roles == '') {
                store.dispatch('GetUserInfo').then(() => {
                    if (to.query.urlName) {
                        next({name: to.query.urlName, path: '/' + to.query.url, replace: true})
                    } else {
                        if (to.query.url) {
                            next({name: to.query.urlName, path: '/' + to.query.url})
                        } else if (to.path.indexOf('print') > -1) {
                            next({...to, replace: true})
                        } else {
                            if(to.query.url==='bigPreview'){
                                next({ path: '/' + to.query.url,query:{id:to.query.id}})
                            }else{
                                next()
                            }
                        }
                    }
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        next(window.location.href = "http://erp.msebc.com/msycs.html")
                    })
                })
            } else {
                //console.log(2222,to.query)
                const value = to.path || to.fullPath;
                const label = to.query.name || to.name;
                const meta = to.meta || router.$avueRouter.meta || {};
                const i18n = to.query.i18n;
                if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
                    store.commit('ADD_TAG', {
                        label: label,
                        value: value,
                        params: to.params,
                        query: to.query,
                        meta: (() => {
                            if (!i18n) {
                                return meta
                            }
                            return {
                                i18n: i18n
                            }
                        })(),
                        group: router.$avueRouter.group || []
                    });
                }
                if(to.query.url==='bigPreview'){
                    next({ path: '/bigPreview',query:{id:to.query.id}})
                }else{
                    next()
                }
                // next({name: to.query.urlName, path: '/' + to.query.url})

            }
        }
    } else {
        if (to.query.accessKey) {
            store.commit('SET_TOKEN', to.query.accessKey);
            store.dispatch('GetUserInfo').then(() => {
                if (to.query.urlName) {
                    next({name: to.query.urlName, path: '/' + to.query.url, replace: true})
                } else {
                    next({...to, replace: true})
                }

            }).catch((err) => {
                store.dispatch('FedLogOut').then(() => {
                    next(window.location.href="http://erp.msebc.com/msycs.html")
                    // next({path:'/login'})
                })
            })
        } else {
            //判断是否需要认证，没有登录访问去登录页
            if (meta.isAuth === false) {
                //console.log('来了这',to.query.id)
                // if(to.query.url==='bigPreview'){
                //     next({path: '/' + to.query.url,query:{id:to.query.id,url:to.query.url}})
                // }else{
                //     next()
                // }
                next()
            } else {
                // next(window.location.href="http://erp.msebc.com/msycs.html")
                next({path:'/login'})
            }
        }

    }
})

router.afterEach(() => {
    NProgress.done();
    let title = store.getters.tag.label;
    let i18n = store.getters.tag.meta.i18n;
    title = router.$avueRouter.generateTitle(title, i18n)
    //根据当前的标签也获取label的值动态设置浏览器标题
    router.$avueRouter.setTitle(title);
});
