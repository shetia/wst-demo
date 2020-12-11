<template>
  <div  class='chart'>
    <div class="chart-head">
      <span>
        <img :src="picture" alt="">
      </span>
      <span @click="isPopup=true">{{userInfo.group}}</span>
      <span>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div class="chart-main" ref="scroll">
      <InfoList :imgs="imgs" :list="infoList"></InfoList>
    </div>
    <div class="chart-foot">
      <el-input v-model="text" @keyup.enter.native.stop="send"/>
      <el-button type="primary" @click="send">发送</el-button>
    </div>
    <Popup :visible="isPopup" @close="isPopup=false">
      <div class="popup-box">
        <div v-for="(item, index) in onlineUserList" :key="index" class="popup-box__item">
          <img  :src="imgs[item.img]" width="35" alt="">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div v-if="!onlineUserList.length" style="text-align:center;">
        暂无成员
      </div>
    </Popup>
  </div>
</template>

<script>
import InfoList from './infoList'
import Popup from './popup'
import io from '@/assets/js/socket.io.js'
const imgs = {
  1: require('@/assets/img/1.png'),
  2: require('@/assets/img/2.png'),
  3: require('@/assets/img/3.png'),
  4: require('@/assets/img/4.png'),
  5: require('@/assets/img/5.png'),
  6: require('@/assets/img/6.png'),
  7: require('@/assets/img/7.png'),
  8: require('@/assets/img/8.png'),
  9: require('@/assets/img/9.png'),
  10: require('@/assets/img/10.png'),
}
const HOST = 'http://localhost:3001'
export default {
  components:{
    InfoList,
    Popup
  },
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      picture: imgs[this.userInfo.img],
      text: '',
      connectState: false,
      httpServer: null,
      onlineUserList: [],
      imgs,
      infoList: [],
      isPopup: false
    }
  },
  mounted () {
    this.connect()
  },
  beforeDestroy(){
    this.httpServer.on('disconnect', this.userInfo)
  },
  methods: {
    connect(){
      this.httpServer = io.connect(HOST)
      this.httpServer.emit('login', this.userInfo)
      this.httpServer.on('login', data => {
        this.infoList.push({
          type: 'tip',
          msg: `用户${data.msgUser.name}加入聊天`,
          msgUser: data.msgUser
        })
        this.onlineUserList = data.onlineUserList
      })

      this.httpServer.on('loginSuccess', data => {
        if(data.sign === 1) {
          this.connectState = true
          console.log(`${this.userInfo.name}端: ${data.user.name}连接好了`)
          this.onlineUserList = data.onlineUserList
        }
      })

      this.httpServer.on('message', data => {
        // 接收其他人发送的消息
        this.onlineUserList = data.onlineUserList
        this.infoList.push({
          type: 'left',
          msg: data.msg,
          img: data.user.img,
          msgUser: data.user
        })
        this.scroll()
      })

      // 退出登录
      this.httpServer.on('logout', data => {
        console.log(data, '退出登录')
        this.infoList.push({
          type: 'tip',
          msg: `用户${data.msgUser.name}退出群聊`,
          msgUser: data.msgUser
        })
        this.onlineUserList = data.onlineUserList
        this.$emit('logout', data.onlineUserList)
      })
    },
    send () {
      let text = this.text.trim()
      if (text) {
        this.httpServer.emit('message', {
          msg: text,
          user: this.userInfo
        })
        // 自己发的消息,自己加到聊天列表
        this.infoList.push({
          type: 'right',
          msg: text,
          img: this.userInfo.img,
          msgUser: this.userInfo
        })
        this.text = ''
        this.scroll()
      }
    },
    logout () {
      this.httpServer.emit('exit', this.userInfo)
    },
    scroll () {
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.chart{
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  &-head{
    height: 50px;
    background: #50dcca;
    display:flex;
    align-items: center;
    padding: 0 12px;
    justify-content: space-between;
    img{
      width: 45px;
      height: 45px;
      display:block;
      overflow: auto;
    }
    >span{
      // flex: 1;
    }
  }
  &-main{
    flex: 1;
    height: 100%;
    padding: 12px;
    overflow: auto;
  }
  &-foot{
    height: 50px;
    display:flex;
    align-items: center;
    padding: 0 12px;
    background: #fff;
  }
  .popup-box{
    display:flex;
    flex-wrap: wrap;
    &__item{
      display: flex; 
      flex-direction: column;
      text-align:center;
      justify-content: center;
      font-size: 12px;
      color: #ccc;
      margin-right: 12px;
      overflow: hidden;
      width: 40px;
      >span{
        line-height: 20px;
        display:inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
