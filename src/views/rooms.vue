<template>
  <div  class='rooms'>
    <div class="rooms-head">
      <el-form :inline="true" :model="userForm" :rules="rules" ref="formRef" @submit.native.prevent>
        <el-form-item label="名字" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">加入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="rooms-main">
      <div class="room">
        <div class="room-item" v-for="(room, index) in rooms" :key="room.id">
          <Chart :userInfo="room" @logout="logout"></Chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './chart'
import shortid from 'shortid'
let group = '四海之内'
export default {
  components:{
    Chart
  },
  data () {
    return {
      userForm: {
        name: ''
      },
      rules:{
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ]
      },
      rooms: [
        {name: 'shetia', id: shortid.generate(), img: '1', group}
      ],
      
    }
  },
  mounted () {
    this.clean()
  },
  methods: {
    clean() {
      fetch('http://localhost:3001/cleanUserList').then(res => {
        return res.json()
      }).then(res => {
        console.log(res)
      })
    },
    add () {
      this.$refs['formRef'].validate(valid => {
        if(valid){
          this.rooms.push({
            group,
            name: this.userForm.name,
            id: shortid.generate(),
            img: ~~(Math.random() * 10) + 1
          })
        }
      })
    },
    logout (list) {
      let set = new Set(list.map(t => t.id))
      this.rooms = this.rooms.filter(t => set.has(t.id))
    }
  }
}
</script>

<style lang='scss' scoped>
.rooms{
  .rooms-main{
    .room{
      display:grid;
      grid-template-columns: repeat(4, 24%);
      column-gap: 12px;
      row-gap: 12px;
      .room-item{
        height: 500px;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
