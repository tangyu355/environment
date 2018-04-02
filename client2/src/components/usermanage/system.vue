<template>
  <div id="system">
    <h3>系统设置</h3>
    <el-card class="box-card">
    <el-form :model="ruleForm2"  ref="ruleForm2" label-width="100px" >
        <el-form-item label="文件上传路径:">
          <el-input type="text" v-model="ruleForm2.newrouter" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item >
          <el-button type="primary" @click="save('fileupload_dir')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui';

export default {
  components: {
  },
  data () {
    return {
      state: state,
      ruleForm2: {
        newrouter: ''
      },
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
		getvalue : function (){
			var vm = this;
					api.usermanage.getvalue('fileupload_dir').then(function(res) {
						vm.ruleForm2.newrouter = res.data.value;
					}, function(bad) {})
			},
		 save:function(valuekey){
					var vm = this;
					var odata = {key:valuekey}
					if(valuekey === 'fileupload_dir'){
						odata.value = this.ruleForm2.newrouter
					}
					api.usermanage.save(odata).then(function(res){
						console.log(res);
						if(res.data.status == 0){
							  Message({
	              type: 'success',
	              message: '操作成功!'
	            })
							vm.getvalue();
						}else{
							 Message.error(res.data.msg)
						}
					},function(bad){})
				}			
		},
		mounted() {
			this.$nextTick(() => {
		  this.getvalue();
		})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.redtext {
  color: red;
}
.big {
  font-size: 140%;
}
.pull-right span{
	cursor: pointer;
}
.el-select,.el-input,.el-cascader{
    width: 260px;
}
</style>
