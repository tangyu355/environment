<template>
  <div id="vihiclefactor">
		<h3>机动车排放因子</h3>	
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 36px;">下载机动车排放因子样表，填写后上传文件。</span>
		    <div style="float: right;">
		    	<a class="el-button" href="../../../static/机动车因子表.xlsx" style="margin-right:10px;">下载样表</a>
		    	<el-upload
		    		style="display:inline;"
					  action="apserver/excelup/vehicleFactor"
					  :on-remove="handleRemove"
					  :data = "{tabletype:'ap_vehicle_factor'}"
					  :name="filename"
					  :show-file-list = "false"
					  :on-success ="success"
					  :before-upload="beforeUpload"
					  >
					  <el-button size="" type="primary">点击上传</el-button>
					</el-upload>
		    </div>
		  </div>
		  <div class="mytable" v-loading="loading" element-loading-text="正在上传中...">
				<table class = "table table-bordered" >
					<thead>
						<tr>
							<th rowspan="2" style="min-width:100px;" class="text-center" >车型</th>
							<th rowspan="2" class="text-center" style="min-width:80px;">污染物</th>
							<th :colspan = "vnum" class="text-center" >排放标准</th>
						</tr>
						<tr>
							<th v-for = "i in vnum" class="text-center" style="min-width:150px;">{{valuelist[0].pany[0].polist[i-1].standard}}</th>
						</tr>
					</thead>
					<tbody v-for = "city in valuelist" >
						<tr v-for="(i,$index) in city.pany">
							<td :rowspan="snum" class="text-center" v-if="$index === 0">{{city.vehiclemodel}}</td>
							<td class="text-center">{{i.pollutantName}}</td>
							<td v-for="x in i.polist" class="text-center">{{x.factor}}</td>
						</tr>
					</tbody>
	      </table>
			</div>
		</el-card>
	</div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
	components: {},
	data() {
		return {
			fileList: [],
			filename:'vehicle',
			listdata:{},
			valuelist:[],
			cnum:'',
			snum: '',
		    vnum: '',
		    loading:false
		}
	},
	computed: {},
	watch: {},
	methods: {
		handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    success(response, file, fileList){
    	console.log(response);
    	if(response.status==0){
    	   this.fileList = fileList
    	   this.loading = false
    	   this.$message({message:'上传成功！', type:"success"})
    	} else{
    	  this.$message.danger(response.msg)
    	}
    },
    beforeUpload(file){
    	console.log('准备上传')
    	// console.log(file)
    	this.loading = true
    },
    checkexcel:function(){
			var vm=this;
			api.setting.uploadfile('ap_vehicle_factor/0').then(function(res){
			 	console.log(res)
			 	vm.listdata = res.data.findname
			})
		},
		showtab:function(){			    	
    	var vm=this;
    	vm.show=true;
			api.setting.lookupfile().then(function(res){
     		console.log(res)
     			if(res.data.status===0){
	       		vm.valuelist=res.data.flist
					 	vm.cnum = vm.valuelist.length;
					 	vm.snum = vm.valuelist[0].pany.length;
					 	vm.vnum = vm.valuelist[0].pany[0].polist.length;
     			}else{
     			 	this.$message.danger(res.data.msg)
     			}
    	})
		},
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this
			this.checkexcel()
			this.showtab()
		})
	}
}
</script>
<style scoped>

</style>