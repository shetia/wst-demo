<template>
  <div class='pop-up' v-if="show" @click="close">
    <div class="box" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  computed: {
    show: {
      get(){
        return this.visible
      },
      set(val){
        this.$emit('close', val)
      }
    }
  },
  methods: {
    close(){
      this.$emit('close', false)
    }
  }
}
</script>

<style lang='scss' scoped>
 .pop-up{
    position:absolute;
    z-index: 99;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: rgba(0,0,0, 0.5);
    display:flex;
    align-items: center;
    justify-content: center;
    .box{
      width: 80%;
      background: #fff;
      border-radius: 3px;
      padding: 12px;
      min-height: 50px;
    }
  }
</style>
