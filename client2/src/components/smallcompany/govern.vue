<template>
  <div id="alter">
   <el-row class="tabcss">
   	 <el-button type="success" @click="handlepass" size="small">全部通过</el-button>
     <el-button type="danger"  @click="handleunpass" size="small">全部不通过</el-button>
   </el-row>
  <el-table
    ref="multipleTable"
    :data="state.showlist"
    border
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column
      label="企业名称"
      >
      <template scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>联系人: {{ scope.row.name }}</p>
          <p>联系电话: {{ scope.row.contactNo }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag>{{ scope.row.companyName}}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
	<el-table-column	      
	      label="脱硫工艺"	      
	      >
	       <template scope="scope">
	      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
          <td v-if="!isedit" style="border:0;background:rgba(0, 0, 0, 0);">{{line.techniqueName1}}</td>
          <td v-if="isedit&&indexof===index" style="border:0;background:rgba(0, 0, 0, 0);">
          	<el-input v-model="small.techniqueName1" placeholder="0" style="width:100%"></el-input>
          </td>
        </tr>
	      </template>
	    </el-table-column>	
	<el-table-column
	      label="脱硝工艺"
	      >
	      <template scope="scope">
	      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
          <td v-if="!isedit" style="border:0;background:rgba(0, 0, 0, 0);">{{line.techniqueName2}}</td>
          <td v-if="isedit&&indexof===index" style="border:0;background:rgba(0, 0, 0, 0);">
          	<el-input v-model="small.techniqueName2" placeholder="" style="width:100%"></el-input>
          </td>
        </tr>
	      </template>
	    </el-table-column>
	<el-table-column
	      label="除尘工艺"
	      >
	      <template scope="scope">
	      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
          <td v-if="!isedit" style="border:0;background:rgba(0, 0, 0, 0);">{{line.techniqueName3}}</td>
          <td v-if="isedit&&indexof===index" style="border:0;background:rgba(0, 0, 0, 0);">
          	<el-input v-model="small.techniqueName3" placeholder="0" style="width:100%"></el-input>
          </td>
        </tr>
	      </template>
	   </el-table-column>
	<el-table-column
	      label="挥发性有机物治理工艺"
	      >
	      <template scope="scope">
	      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
          <td v-if="!isedit" style="border:0;background:rgba(0, 0, 0, 0);">{{line.techniqueName4}}</td>
          <td v-if="isedit&&indexof===index" style="border:0;background:rgba(0, 0, 0, 0);">
          	<el-input v-model="small.techniqueName4" placeholder="0" style="width:100%"></el-input>
          </td>
        </tr>
	      </template>
	   </el-table-column>	   
    <el-table-column label="操作" width="210">
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
          <td  style="border:0;background:rgba(0, 0, 0, 0);"></td>
          <el-button
          size="small"
          @click="handleEdit(index,line)" v-if="!isedit">编辑</el-button>
        <el-button
          size="small"
          @click="save" v-if="isedit&&indexof===index">保存</el-button>
        <el-button
          size="small"
          @click="cancel" v-if="isedit&&indexof===index">取消</el-button>
        <el-button
          size="small"
          type="success"
          @click="handlepass(index,line)" v-if="!isedit">通过</el-button>
          <el-button
          size="small"
          type="danger"
          @click="handleunpass(index,line)" v-if="!isedit">不通过</el-button>            
          </td>
       </tr>        
      </template>
    </el-table-column>	 
    <el-table-column label="状态">
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border:0;background:rgba(0, 0, 0, 0);">
      	<td  style="border:0;background:rgba(0, 0, 0, 0);"></td>
      	<el-tag type="success" v-if="line.status==3">已审核</el-tag>
      	<el-tag type="warning" v-if="line.status==2">待审核</el-tag>
      	<el-tag type="danger" v-if="line.status==1">未上报</el-tag>
      	 </td>
       </tr> 
      </template>
      </el-table-column>
	  </el-table>
   <my-pagination></my-pagination>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui';

export default {
   props: {
       searchValue: Object
   },	
  components: {
  },
  data () {
    return {
      state: state,
      action: actions,
      small: {
         techniqueName1: '',
         techniqueName2: '',
         techniqueName3: '',
         techniqueName4: '',
      },
      isedit:false,
      recordlist:[],
      idlist: [],
      multipleSelection: [],
      ids: [],
      indexof: ''
    }
  },
  computed: {
  },
  watch: {
  	'searchValue': {
  		handler: function (val, oldVal) {
  			this.getAllsmallcompany(val)
  		},
      	deep: true
  	}
  },
  methods: {
	  getAllsmallcompany (data){
	  		api.creport.getAllsmallcompany(data).then((res) => {
	  			console.log(res)
	  			if(res.data.list.length){
	  			    this.recordlist = res.data.list
              this.action.setShowList(this.recordlist)
           }
	  		})
	  	},
	  handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
        this.idlist = []
		  for(var i in this.multipleSelection){
			if(this.multipleSelection[i].slist.length){
				 for(var j in this.multipleSelection[i].slist){
		      this.idlist.push(this.multipleSelection[i].slist[j].id)
		    }		     
		   }
		}    	
       console.log(this.idlist)
      },
      handleEdit (index,row){
      	console.log(index,row)
      	this.indexof = index
      	this.isedit = true
      	_.assign(this.small,row)	
      	
      },
      handlepass (index,row){
      	this.ids= []
      	if(this.idlist.length){    
      		this.ids = this.idlist
      	} else{
      	  this.ids.push(row.id)
      	}
      	console.log(this.ids)
      	api.creport.companychecked(JSON.stringify({
      		companyId:this.ids,
      		fillyear:this.searchValue.fillyear,
      		type:3
      	})).then((res) => {
      		console.log(res)
      		if(res.data.status==0){
      			this.getAllsmallcompany(this.searchValue)
      		}
      	})
      },
      handleunpass (index,row){
      	this.ids= []
      	if(this.idlist.length){    
      		this.ids = this.idlist
      	} else{
      	  this.ids.push(row.id)
      	}
      	console.log(this.ids)
      	api.creport.companyrollback(JSON.stringify({
      		companyId:this.ids,
      		fillyear:this.searchValue.fillyear,
      		type:3
      	 })).then((res) => {
      		if(res.data.status==0){
      			this.getAllsmallcompany(this.searchValue)
      		}
      	})
      },
      save () {
      	console.log(this.small)
      	api.creport.smallFacilityaddup(this.small).then((res) => {
      		console.log(res)
      		if(res.data.status==0){      			
      			this.isedit = false
      			this.getAllsmallcompany(this.searchValue)
      		} else{
      			Message.error(res.data.msg)
      		}
      	})
      },
      cancel (){
      	this.isedit = false
      },
      resettable (){
      	
      },
  },
  mounted () {
    this.$nextTick(() => { 
    	this.searchValue.type = 3
    	this.getAllsmallcompany(this.searchValue)
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
.tabcss{
	margin:10px;
}
</style>
