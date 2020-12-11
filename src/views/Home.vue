<template>
  <div class="home">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  }
}
</script>
<style lang="scss" scope>
.home {
  width: 100%;
  height: 100%;
}
.el-container{
   height: 100%;
}
.el-header {
  background-color:hsl(172, 67%, 59%);
  color: #333;
  height: 60px;
  display: flex;
  align-items: center;
}


.el-main {
  background-color: #E9EEF3;
  color: #333;
}

</style>