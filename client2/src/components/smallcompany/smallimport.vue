<template>
  <div id="alter">
    <h3>小散企业批量导入</h3>
  	<el-card class="box-card">
			  <div slot="header" class="clearfix">
			    <span style="line-height: 36px;color: #E4393C;">只能上传excel文件</span>
			    <span style="float: right;">
			    	<el-upload
      	  class="upload-demo"
      	  action="apserver/excelup/smallCompany"
      	  :on-remove="handleRemove"
      	  :data = "upload"
      	  :name="filename"
      	  :on-success ="success"
      	  :show-file-list = 'false'
      	  :before-upload="beforeUpload"
      	  >
      	  <el-button size="small" type="primary" style="margin-top:10px">点击上传</el-button>
      	</el-upload>
			    </span>			    
			  </div>
			   <div class="text item">
			   	<el-form ref="form" inline>
	      	<el-col :span="12">
	      		<el-form-item label="">
	      			<a  href="../../../static/小散企业汇总表-样表.xlsx">点击下载样表</a>
	          </el-form-item>
	         </el-col>
	       </el-form>
			   </div>
			</el-card>
  </div>
</template>

<script>
import {state, actions} from 'src/store'

  export default {
    data() {
      return {
        upload:{
         fillyear: state.watchyear,
        },
        filename:'import',
        state: state,
        fileList: []
      };
    },
    watch:{
    	 'state.watchyear':{
	    	handler: function (val, oldVal) {
	    		console.log(val)
	  			this.upload.fillyear = val
	  		},
	      deep: true
	    }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      success(response, file, fileList){
      	console.log(response);
      	if(response.status==0){
      	   this.$message({message:'上传成功,到相应页面查看小散企业信息！', type:"success"})
      	} else{
      	  this.$message.error(response.msg)
      	}
      }      
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

</style>
