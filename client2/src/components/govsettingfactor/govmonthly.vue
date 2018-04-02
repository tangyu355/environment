<template>
  <div id="fuelset">
		<h3>每月系数配置</h3>	
		<div class="mytable">
			<table class = "">						
				<thead>
					<tr>
						<th></th>
						<th v-for="name in obdata[0].list"  class="text-center">{{name.month}}月</th>
					</tr>
				</thead>
				<tbody >
					<tr v-for="item in obdata">
						<td><p  style="min-width: 75px;">{{item.name}}</p></td>
	          <td  v-for="x in item.list">
	          	<div style="min-width: 75px;">
	          		<el-input v-model="x.value"  style="padding:0;"></el-input>
	          	</div>
	          </td>
          </tr>
          <tr>
          	<th colspan="1">
          		操作
          	</th>
          	<td colspan="12">
          		<el-button type="success" size="small" @click="save">保存设置</el-button>
          	</td>
          </tr>
				</tbody>
			</table>	
		</div>			
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
			isedit:false,
			obdata: [{
				list: []
			}],
			valuelist: [],
			pname: [],
			fobject:{}
		}
	},
	computed: {},
	watch: {},
	methods: {
		save: function() {
			console.log(this.obdata)
			var vm = this
			api.setting.editprop(JSON.stringify({list:this.obdata})).then((res) => {
				if(res.data.status == 0){
						vm.$message({
	            type: 'success',
	            message: '修改成功!'
	          });
	          vm.isedit = false
						vm.get();
					}else{
						vm.$message.error(res.data.msg)
					}
			})
		},
		get: function(callback) {
			api.setting.getproportion().then(callback)
		},
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this;
			this.get(function(res) {
				console.log(res)
				vm.obdata = res.data.list;
			})
		})
	}
}
</script>
<style scoped>

</style>