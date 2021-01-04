<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
    import echarts from 'echarts'

    require('echarts/theme/macarons') // echarts theme
    import {debounce} from '@/util'

    export default {
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '360px'
            },
            vocational: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.initChart()
            this.__resizeHanlder = debounce(() => {
                if (this.chart) {
                    this.chart.resize()
                }
            }, 100)
            window.addEventListener('resize', this.__resizeHanlder)
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            window.removeEventListener('resize', this.__resizeHanlder)
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            initChart() {
                console.log(this.$el);
                this.chart = echarts.init(this.$el, 'macarons')

                this.chart.setOption(this.vocational)
                console.log(this.$el);
            }
        }
    }
</script>
