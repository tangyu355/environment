<template>
	<div id="bar">
		<div id="pan4" style="height: 350px;width:104%;margin-left:0">   
		</div>
	</div>

</template>

<script>
export default {
	props:{
		bardata:Array,
		xname:Array,
		legenddata:Array
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
			        text: ''
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:this.legenddata
			    },
			    toolbox: {
			        color: '#404a59',
					    show : true, 
					     x:'right',
               			 y:'top',
               			 padding:20,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        },
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : this.xname,
			            axisLabel :{  
   							interval:0,
   							rotate:15,
   							margin:5
					    }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : this.bardata			
  		  }
		}
	},
	watch: {
     'bardata' : 'getinfo',
     'options' : {
	      handler: 'getinfo',
	      deep: true
	    }
	},
	methods: {

		getinfo() {
			let vm = this
			var echarts = require('echarts/lib/echarts');
			// 引入柱状图
			require('echarts/lib/chart/bar');
			// 引入提示框和标题组件
			require('echarts/lib/component/tooltip');
			require('echarts/lib/component/title');
			require('echarts/lib/component/toolbox');
			//require('echarts/lib/component/markArea');
			
			var myChart = echarts.init(document.getElementById('pan4'));
					// 绘制图表
			myChart.setOption(this.options)
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
