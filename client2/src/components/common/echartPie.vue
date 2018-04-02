<template>
	<div id="pie">
		<div id="pan3"style="height: 350px;width:100%;">   
		</div>
	</div>

</template>

<script>
export default {
	props:{
		legenddata:Array,
		 piedata:Array
	},
	data () {
		return {
			msg: 'hello word'
		}
	},
	computed: {
		options: function() {
			let vm = this
			return {	
			    title : {
			        text: '',
			        subtext: '',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:this.legenddata
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {
			                show: true, 
			                x:'right',
                            y:'top',
			                type: ['pie', 'funnel'],
			                option: {
			                    funnel: {
			                        x: '25%',
			                        width: '80%',
			                        funnelAlign: 'left',
			                        max: 1548
			                    }
			                }
			            },
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    series : this.piedata					
  		  }
		}
	},
	watch: {
     'piedata' : 'getinfo',
     'options' : {
	      handler: 'getinfo',
	      deep: true
	    }
	},
	methods: {

		getinfo() {
			let vm = this
			console.log(this.piedata)
			var echarts = require('echarts/lib/echarts');
			// 引入柱状图
			require('echarts/lib/chart/pie');
			// 引入提示框和标题组件
			require('echarts/lib/component/tooltip');
			require('echarts/lib/component/title');
			require('echarts/lib/component/toolbox');
			//require('echarts/lib/component/markArea');
			
			var myChart = echarts.init(document.getElementById('pan3'));
					// 绘制图表
			myChart.setOption(this.options)
		},
		fetchData () {
			
		}
	},
	mounted () {
		this.$nextTick(() => {
	      // 代码保证 this.$el 在 document 中
	      this.getinfo()
	    })
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-icon{
	margin-right: 10px;
	color: #20A0FF;
}
</style>
