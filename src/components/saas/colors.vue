<template>
  <div class="colors">
    <a class="goods-type" :class="className" href="#">{{brandName}}</a>
  </div>
</template>

<script>
  export default {
    name: "colors",
    props: ['brandName'],
    computed: {
      className() {
        if (this.brandName == '施耐德') {
          return 'goods-38a03d';
        } else if(this.brandName == 'ABB') {
          return 'goods-ff000f';
        }else if(this.brandName == '欧姆龙'){
           return 'goods-0050c0';
        }else if(this.brandName == '西门子'){
          return 'goods-009999';
        }else if(this.brandName == '罗格朗'){
          return 'goods-e60012';
        }else if(this.brandName == '德力西'){
          return 'goods-d0111c';
        }else if(this.brandName == '正泰'){
          return 'goods-005bac';
        }else if(this.brandName == '和泉'){
          return 'goods-ae0e16';
        }else if(this.brandName == '穆尔'){
          return 'goods-3fb60c';
        }else if(this.brandName == '博世力士乐'){
          return 'goods-e41221';
        }else if(this.brandName == '欧时'){
          return 'goods-ef1b22';
        }else if(this.brandName == '3M'){
          return 'goods-ed1c22';
        }else if(this.brandName == '博世'){
          return 'goods-e22021';
        }else if(this.brandName == '明纬'){
          return 'goods-d14139';
        }else if(this.brandName == '菲尼克斯'){
          return 'goods-141517';
        }else if(this.brandName == '魏德米勒'){
          return 'goods-eb6826';
        }else if(this.brandName == 'SMC'){
          return 'goods-023494';
        }else if(this.brandName == '三菱电机'){
          return 'goods-ec1c24';
        }else if(this.brandName == '费斯托'){
          return 'goods-0591da';
        }else if(this.brandName == '爱马斯'){
          return 'goods-018438';
        }else if(this.brandName == '安思尔'){
          return 'goods-035b9b';
        }else if(this.brandName == '得伟'){
          return 'goods-fdca0b';
        }else{
          return 'goods-38a03d';
        }
      }
    },
  }
</script>

<style lang="less">
  .colors {
    display: inline-block;
    .goods-type {
      padding: 0 2px;
      display: inline-block;
      margin-right: 2px;
      font-size: 12px;
      line-height: 16px;
      border-radius: 2px;
    }
    .goods-38a03d {
      border: 1px #38a03d solid;
      color: #38a03d !important;
    }
    .goods-ff000f {
      border: 1px #ff000f solid;
      color: #ff000f !important;
    }
    .goods-0050c0 {
      border: 1px #0050c0 solid;
      color: #0050c0 !important;
    }
    .goods-009999 {
      border: 1px #009999 solid;
      color: #009999 !important;
    }
    .goods-e60012 {
      border: 1px #e60012 solid;
      color: #e60012 !important;
    }
    .goods-d0111c{
      border: 1px #d0111c solid;
      color: #d0111c !important;
    }
    .goods-005bac{
      border: 1px #005bac solid;
      color: #005bac !important;
    }
    .goods-ae0e16{
      border: 1px #ae0e16 solid;
      color: #ae0e16 !important;
    }
    .goods-3fb60c{
      border: 1px #3fb60c solid;
      color: #3fb60c !important;
    }
    .goods-e41221{
      border: 1px #e41221 solid;
      color: #e41221 !important;
    }
    .goods-ef1b22{
      border: 1px #ef1b22 solid;
      color: #ef1b22 !important;
    }
    .goods-ed1c22{
      border: 1px #ed1c22 solid;
      color: #ed1c22 !important;
    }
    .goods-e22021{
      border: 1px #e22021 solid;
      color: #e22021 !important;
    }
    .goods-d14139{
      border: 1px #d14139 solid;
      color: #d14139 !important;
    }
    .goods-141517{
      border: 1px #141517 solid;
      color: #141517 !important;
    }
    .goods-eb6826{
      border: 1px #eb6826 solid;
      color: #eb6826 !important;
    }
    .goods-023494{
      border: 1px #023494 solid;
      color: #023494 !important;
    }
    .goods-ec1c24{
      border: 1px #ec1c24 solid;
      color: #ec1c24 !important;
    }
    .goods-0591da{
      border: 1px #0591da solid;
      color: #0591da !important;
    }
    .goods-018438{
      border: 1px #018438 solid;
      color: #018438 !important;
    }
    .goods-035b9b{
      border: 1px #035b9b solid;
      color: #035b9b !important;
    }
    .goods-fdca0b{
      border: 1px #fdca0b solid;
      color: #fdca0b !important;
    }
  }
</style>
