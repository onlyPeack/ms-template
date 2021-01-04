<template>
    <div  style="margin-top: 8px;">
        <slot></slot>
    </div>
</template>

<script>
    //函数防抖
    function antiShake(fn) {
        var timeout = null;
        return function (...params) {
            let _this = this;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(_this, params);
            })
        }
    }

    export default {
        props: ['id', 'type','timeStamp'],
        inject: ['index'],
        created() {
            this.__cachehandleGetbill = {};
            this.__cachetype = {};
            this.__cachehandleGetbill[this.moduleKey] = this.id;
            this.__cachetype[this.moduleKey] = this.type;
        },
        data() {
            return {
                moduleKey: Math.random()
            }
        },
        watch: {
            type() {
                this.typeChange('type');
            },
            id() {
                this.typeChange('id');
            },
            timeStamp() {
                this.typeChange('timeStamp');
            }
        },
        methods: {
            typeChange: antiShake(function (attrName) {
                const _this = this;
                var moduleKey = this.moduleKey;
                //如果点击相同单据，不刷新页面，不更新form表单
                if (_this.id) {
                    if (_this.__cachehandleGetbill[moduleKey] === _this.id && attrName == 'id') {
                        return;
                    }
                    _this.__cachehandleGetbill[moduleKey] = _this.id;
                } else {
                    delete _this.__cachehandleGetbill[moduleKey];
                }
                _this.__cachetype[moduleKey] = _this.type;
                // 刷新页面数据
                _this.$emit('reload');
            }),
            refreshId(id) {
                this.__cachehandleGetbill[this.moduleKey] = id;
            }
        }
    };
</script>
