<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
            <span class="icon-shopping_cart"></span>
          </div>
        </div>
        <div class="price border-right" :class="{'highlight': totalCount > 0}">
          ￥{{totalPrice}}
        </div>
        <div class="desc"></div>
      </div>
      <div class="content-right">
        <div class="pay" :class="this.totalPrice < this.minPrice ? 'not-enough' : 'enough'">{{payDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shopcart',
  props: {
    selectPros: { // 全部已选择商品集合（数组）
      type: Array
    },
    deliveryPrice: { // 配送费
      type: Number,
      default: 0
    },
    minPrice: { // 起送费
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice () { // 计算订单总金额
      let total = 0
      this.selectPros.forEach((Pro) => {
        total += Pro.price * Pro.count
      })
      /* for (let i = 0; i < this.selectPros.length; i++) {
        total += this.selectPros[i].price * this.selectPros[i].count
      } */
      return total
    },
    totalCount () { // 计算订单总量
      let count = 0
      this.selectPros.forEach((Pro) => {
        count += Pro.count
      })
      return count
    },
    payDesc () { // 购买按钮说明
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    .content
      display: flex
      height: .96rem
      color: #80858a
      background-color: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          position: relative
          top: -.2rem
          display: inline-block
          margin: 0 .24rem
          padding: .12rem
          width: 1.12rem
          height: 1.12rem
          border-radius: 50%
          background-color: #141d27
          .logo
            position: relative
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background-color: #2b343c
            &.highlight
              background-color: #00a0dc
              .icon-shopping_cart
                color: #fff
            .num
              position: absolute;
              top: -.13rem;
              right: 0;
              transform: translateX(40%)
              padding: 0 .1rem
              min-width: .36rem;
              height: .36rem;
              line-height: .36rem;
              text-align: center;
              border-radius: .36rem;
              font-size: .2rem;
              color: #fff;
              background: #f01414;
              box-shadow: 0 4px 8px 0 rgba(0,0,0,.4)
            .icon-shopping_cart
              font-size: .6rem
              line-height: .88rem
              font-size: .48rem
        .price
          display: inline-block
          vertical-align: top
          margin-top: .24rem
          padding-right: .24rem
          height: .48rem
          line-height: .48rem
          font-size: .32rem
          font-weight: 700
          &.highlight
            color: #fff
          &::before
            border-right-color: rgba(255, 255, 255, .5)
        .desc
          display: inline-block
          vertical-align: top
          margin: .24rem 0 0 .24rem
          height: .48rem
          line-height: .48rem
          font-size: .2rem
      .content-right
        flex: 0 0 2.1rem
        .pay
          height: .96rem
          line-height: .96rem
          font-size: .24rem
          font-weight: 700
          text-align: center
          &.not-enough
            background-color: #2b333b
          &.enough
            color: #fff
            background-color: #00b43c
</style>
