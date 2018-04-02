<template>
  <div id="home">
    <img src="../../assets/2.gif" alt="" />
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      msg: ''
    }
  },
  computed: {
  },
  watch: {
    //'$route': 'fetchData'
  },
  methods: {
  },
  mounted () {
    this.$nextTick(() => {
      // 代码保证 this.$el 在 document 中
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#home{
	text-align: center;
	margin-top:10%;
}
</style>
