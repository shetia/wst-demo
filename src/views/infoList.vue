<template>
  <div  class='info'>
    <div class="info-warp" v-for="(item, index) in list" :key="index">
      <div class="info-item" v-if="item.type !== 'tip'" :class="{'self': item.type ==='right'}">
          <img :src="imgs[item.img]" alt="">
          <div class="item-content">
            <span class="name">{{item.msgUser.name}}</span>
            <span class="msg-box">{{item.msg}}</span>
          </div>
      </div>
      <div v-else class="info-tip">
        <span>{{item.name}}{{item.msg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    imgs: {
      type: Object,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.info{
  .info-warp{
    .info-item{
      display:flex;
      align-items:center;
      margin-bottom: 12px;
      &.self{
        flex-direction: row-reverse;
        .item-content{
          margin-right: 12px;
          .msg-box{
            background: #499eff;
            color: #fff;
            white-space: normal;
            max-width: 150px;
          }
        }
      }
      img{
        width: 35px;
        height: 35px;
      }
      .item-content{
        display:flex;
        flex-direction: column;
        margin-left: 12px;
        font-size: 12px;
        .name{
          color: #aaa;
          margin-bottom: 8px;
        }
        .msg-box{
          padding: 8px 12px;
          background: #fff;
          border-radius: 5px;
        }
      }
    }
    .info-tip{
      text-align: center;
      margin: 12px;
      span{
        display: inline-block;
        color: #fff;
        font-size:12px;
        padding: 4px 8px;
        background: #ccc;
        border-radius: 3px;
      }
    }
  }
}
</style>
