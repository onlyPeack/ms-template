<template>
    <div style="margin-top: 8px;">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['timeStamp', 'page'],
        created() {
            this.__cachehandleGetbill = {};
            this.__cachehandleGetbill[this.moduleKey] = this.timeStamp;
        },
        data() {
            return {
                moduleKey: Math.random()
            }
        },
        watch: {
            timeStamp() {
                this.timeStampChange();
            }
        },
        methods: {
            timeStampChange() {
                const _this = this;
                var moduleKey = this.moduleKey;
                //如果timeStamp值相同，不刷新页面
                if (_this.timeStamp) {
                    if (_this.__cachehandleGetbill[moduleKey] === _this.timeStamp) {
                        return;
                    }
                    _this.__cachehandleGetbill[moduleKey] = _this.timeStamp;
                } else {
                    delete _this.__cachehandleGetbill[moduleKey];
                }

                // 刷新页面数据
                _this.$emit('reload', this.page);
            }
        }
    };
</script>
