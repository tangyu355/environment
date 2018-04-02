<template>
	<div id="pie">
		<div id="pan3"style="height: 350px;width:100%;">   
		</div>
	</div>

</template>

<script>
export default {
	props:{
		 legendlist:Array,
		 serieslist:Array,
		 xname:Array
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
    tooltip : {
        trigger: 'axis'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    legend: {
        data:this.legendlist,
    },
    xAxis : [
        {
            type : 'category',
            data : this.xname
        }
    ],
    yAxis : [
        {
            type : 'value',
            name : '',
            axisLabel : {
                formatter: '{value} '
            }
        },
        {
            type : 'value',
            name : '',
            axisLabel : {
                formatter: '{value} '
            }
        }
    ],
    series : this.serieslist				
  		  }
		}
	},
	watch: {
		'serieslist' : 'getinfo',
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
			
			var myChart = echarts.init(document.getElementById('pan3'));
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
