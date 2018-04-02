<template>
  <div id="upload">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <!--<el-col :span="3">
        <el-select v-model="searchdata.fillyear">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :span="6">
        <el-input
          placeholder="请输入关键字"
          icon="search"
          v-model="searchdata.name"
          :on-icon-click="search">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button icon="search" @click='search' type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <div class="mytable">
    <table >
    <thead>
      <tr>
        <th>用户名</th>
        <th>所属机构</th>
        <th>所属地区</th>
        <th>联系人</th>
        <th>联系电话</th>
        <th>报表类型</th>
        <th width="16%">下载文件</th>
        <th>导入文件</th>
        <th>状态</th>
        <th width="15%">操作</th>
      </tr>
    </thead>
    <tbody v-for="item in state.showlist"  v-loading="loading"
    element-loading-text="文件上传中...">
      <tr v-for="(file,findex) in item.allFile">
        <td v-if="findex == 0" :rowspan="item.allFile.length">{{item.name}}</td>
        <td v-if="findex == 0" :rowspan="item.allFile.length">{{item.govname}}</td>
        <td v-if="findex == 0&&item.cityName!==null" :rowspan="item.allFile.length">{{item.provinceName + " " + item.cityName}}</td>
        <td v-if="findex == 0&&item.cityName==null">省级账号</td>
        <td v-if="findex == 0" :rowspan="item.allFile.length">{{item.contact}}</td>
        <td v-if="findex == 0" :rowspan="item.allFile.length">{{item.contactNo}}</td>
        <td>{{file.reportDesp}}</td>
        <td>
          <span v-if="file.checkfile==null" style="color:red">未上报</span>
          <span v-if="file.checkfile!=null"><a @click="downfile({tabletype:file.reportname, accountid:item.id})"><span class="el-icon-document" style="margin-right:4px"></span>{{file.checkfile}}</a></span>
        </td>
        <td>
          <span v-if="file.reportname!=='ap_motor_vehicle'">
            <!--<a @click="uploadfile({tabletype:file.reportname, accountid:item.id}, file)">上传导入</a>-->
            <el-upload
    			  class="upload-demo"
    			  action="apserver/excelup/upload2"
    			  :data = "{tabletype:file.reportname, accountid:item.id,fillyear:searchdata.fillyear}"
    			  :name="filename"
    			  :on-success ="success"
    			  :show-file-list = 'false'
    			 >
			     <el-button size="small" type="primary">点击上传</el-button>
			     </el-upload>
          </span>
          <span v-else>
            <!--<a @click="uploadfile({tabletype:file.reportname, accountid:item.id}, file)">上传导入</a>-->
            <el-upload
    			  class="upload-demo"
    			  action="apserver/excelup/vehicleFactor"
    			  :data = "{tabletype:file.reportname, accountid:item.id,fillyear:searchdata.fillyear}"
    			  :name="motorname"
    			  :on-success ="success"
    			  :show-file-list = 'false'
    			  :before-upload="beforeUpload"
    			 >
			     <el-button size="small" type="primary">点击上传</el-button>
			     </el-upload>
          </span>
        </td>
        <td>
          <el-tag v-if="file.status<2" type="danger">未导入</el-tag>
          <el-tag v-if="file.status==2" type="primary">已导入</el-tag>
        </td>
        <td width="15%">
          <router-link :to="{name:'gov_upload_list',params:{gId:item.id,tablename:file.reportname,year:searchdata.fillyear,upkeyword:searchdata.name}}" tag="a" class="el-button el-button--small">查看</router-link>
          <el-button type="small" @click="clearfile(item.id,file.reportname,searchdata.fillyear)" v-if="file.reportname!=='ap_motor_vehicle'">清除</el-button>
          <el-button type="small" @click="delfile(item.id,searchdata.fillyear)" v-else>清除</el-button>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
    <my-pagination></my-pagination>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

var tablemap = {
      ap_canyin_stat:{
        api_base: 'canyin/stat',
      },
      ap_canyin_certified:{
        api_base: 'canyin/certified',
      },
      ap_canyin_nocert:{
        api_base: 'canyin/nocert',
      },
      ap_animals_farm: {
        api_base: 'animals/farm',
      },
      ap_animals_wild:{
        api_base: 'animals/wild',
      },
      ap_industry:{
        api_base: 'industry',
      },
      ap_oildepot: {
        api_base: 'oildepot',
      },
      ap_gasstation:{
        api_base: 'gasstation',
      },
      ap_vehicle_action:{
        api_base: 'vehicle/action',
      },
      ap_gknumber: {
        api_base: 'gknumber',
      },
      ap_plane: {
        api_base: 'plane',
      },
      ap_dump_field: {
        api_base: 'dump/field',
      },      
    }
export default {
  components: {
  },
  data () {
    
    return {
      state: state,
      action: actions,
      tablelist: [],
      filename:'import',
      motorname:'vehicle',
      loading:false,
      searchdata:{
        name:'',
        fillyear:state.watchyear
      },
    }
  },
  computed: {
  },
  watch: {
    'state.listnow' (newValue, oldValue) {
      console.log(newValue)
      this.action.setShowList(this.tablelist)
    },
    'state.watchyear':{
    	handler: function (val, oldVal) {
    		console.log(val)
  			this.searchdata.fillyear = val
  		},
      deep: true
    }
  },
  methods: {
        search:function(){
          var vm = this
          api.creport.searchgov(this.searchdata).then(function(res){
            console.log(res)
            if (res.data.status === 0&&res.data.data.length!=0) {
	              vm.tablelist = res.data.data
		            vm.action.setShowList(vm.tablelist,vm.state.listnow.currentPage)
            } 
            else {
              vm.$message({
	              type: 'warning',
	              message: '没有数据!'
	            })
            }           
          })
        },
        delfile:function(id,year){
        	var vm = this
        	vm.$http.post('vehicle/action/deletelast',{accountid:id,fillyear:year}).then(function(res){
        		console.log(res)
        		if(res.data.status==0){
        			vm.$message({
								type: 'success',
								message: '操作成功!'
							});
        			vm.search()
        		}
        	})
        },
        clearfile:function(accountid,tablename,year){
          var vm = this;
            api.hand.clearFillsbyYearAid(tablemap[tablename].api_base, year,accountid).then(function(res) {
              if(res.data.status==0){
                console.log(tablename,accountid,year)
                api.hand.clearFilesbyYearAid({
                  tabletype:tablename,
                  fillyear:year,
                  accountid:accountid
                }).then(function(res) {
                  if(res.data.status==0){
                   vm.search()
                  }
                })
              }
            })
        },
        downfile: function(data) {
          var form=$("#downfile");
          if (form !== undefined) form.remove();
          
          form=$("<form id='downfile'>"); //定义一个form表单
          form.attr("style","display:none");
          form.attr("target","");
          form.attr("method","post");
          form.attr("action", 'apserver/exceldown/download');
          var input1=$("<input>");
          input1.attr("type","hidden");
          input1.attr("name","tabletype");
          input1.attr("value",data.tabletype);
          $("body").append(form); //将表单放置在web中
          form.append(input1);
          
          var input2=$("<input>");
          input2.attr("type","hidden");
          input2.attr("name","accountid");
          input2.attr("value",data.accountid);
          form.append(input2);

          var input3=$("<input>");
          input3.attr("type","hidden");
          input3.attr("name","fillyear");
          input3.attr("value",this.searchdata.fillyear);
          form.append(input3);

          form.submit(); //表单提交
        },
        beforeUpload(file){
        	console.log(file)
        	this.loading = true
        },
        success(response){
      	console.log(response)
      	if(response.status==0){
      		 this.loading = false
      	   this.search()
      	   this.$message({
						type: 'success',
						message: '上传成功!'
					});
      	} else{
      		if(response.msg!==null){
      	    this.$message.error(response.msg)
      	 } else{
      	 	  this.$message.error('上传失败！')
      	 }
      	}
      } 
  },
  created (){
  	this.searchdata.name = this.state.pagekey.upkeyword
  },
  mounted () {
    this.$nextTick(() => {
       this.search()
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
    width: 100% !important;
}
a {
    color: #337ab7;
    text-decoration: none;
}

</style>
