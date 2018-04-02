<template>
  <div id="alter">
   <el-row class="tabcss">
   	 <el-button type="success" @click="handlepass" size="small">全部通过</el-button>
     <el-button type="danger"  @click="handleunpass" size="small">全部不通过</el-button>
   </el-row>
  <el-table v-if="showdata"
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
	      label="填报时间"
	      width="200"
	      >
	      <template scope="scope">
          <span v-if="scope.row.clist">{{scope.row.clist.fillTime}}</span>
          <span v-else></span>
	      </template>
	   </el-table-column>
	<el-table-column	      
	      label="工业总产值"	      
	      >
	      <template scope="scope">	      	
	      	<span v-if="isedit&&editindex==scope.$index">
	      		<el-input v-model="small.gdp" placeholder="0" style="width:100%"></el-input>
	      	</span>
	      	<span v-if="!isedit&&scope.row.clist">{{scope.row.clist.gdp}}(万元)</span>
	      </template>
	    </el-table-column>	
	<el-table-column
	      label="年生产时间"
	      >
	      <template scope="scope">
	      	<span v-if="!isedit&&scope.row.clist">{{scope.row.clist.totalHour}}(小时)</span>
	      	<span v-if="isedit&&editindex==scope.$index">
	      		<el-input v-model="small.totalHour" placeholder="0" style="width:100%"></el-input>
	      	</span>
	      </template>
	    </el-table-column>
	<el-table-column
	      label="年用电量"
	      >
	      <template scope="scope">
	      	<span v-if="!isedit&&scope.row.clist">{{scope.row.clist.totalElec}}(万千瓦时)</span>
	      	<span v-if="isedit&&editindex==scope.$index">
	      		<el-input v-model="small.totalElec" placeholder="0" style="width:100%"></el-input>
	      	</span>
	      </template>
	   </el-table-column>
    <el-table-column label="操作" width="210">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index,scope.row)" v-if="!isedit&&scope.row.clist">编辑</el-button>
        <el-button
          size="small"
          @click="save" v-if="isedit&&editindex==scope.$index">保存</el-button>
        <el-button
          size="small"
          @click="cancel" v-if="isedit&&editindex==scope.$index">取消</el-button>
        <el-button
          size="small"
          type="success"
          @click="handlepass(scope.$index,scope.row)" v-if="!isedit&&scope.row.clist">通过</el-button>
          <el-button
          size="small"
          type="danger"
          @click="handleunpass(scope.$index,scope.row)" v-if="!isedit&&scope.row.clist">不通过</el-button>
      </template>
    </el-table-column>	 
    <el-table-column label="状态">
      <template scope="scope">
      	<el-tag type="success" v-if="scope.row.clist&&scope.row.clist.status==3">已审核</el-tag>
      	<el-tag type="warning" v-if="scope.row.clist&&scope.row.clist.status==2">待审核</el-tag>
      	<el-tag type="danger" v-if="scope.row.clist&&scope.row.clist.status==1">未上报</el-tag>
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
      	totalElec:'',
      	totalHour:'',
      	gdp: ''
      },
      showdata: false,
      isedit:false,
      recordlist:[],
      idlist: [],
      multipleSelection: [],
      ids: [],
      editindex: '',
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
	  			if(res.data.status==0){
	  				this.showdata= true
	  			 this.recordlist = res.data.list
           this.action.setShowList(this.recordlist)
          }
	  		})
	  	},
	  handleSelectionChange(val) {
        this.multipleSelection = val
        this.idlist = []
		for(var i in this.multipleSelection){
			if(this.multipleSelection[i].clist){
		     this.idlist.push(this.multipleSelection[i].clist[0].id)
		   }
		}    	
       console.log(this.idlist)
      },
      handleEdit (index,row){
      	this.editindex = index
      	if(row.clist){
      	this.isedit = true
      	console.log(index,row)
      	_.assign(this.small,row.clist[0])	
      	}
      },
      handlepass (index,row){
      	this.ids= []
      	if(this.idlist.length){    
      		this.ids = this.idlist
      	} else{
      	  this.ids.push(row.clist[0].id)
      	}
      	console.log(this.ids)
      	api.creport.companychecked(JSON.stringify({
      		companyId:this.ids,
      		fillyear:this.searchValue.fillyear,
      		type:1
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
      	  this.ids.push(row.clist[0].id)
      	}
      	console.log(this.ids)
      	api.creport.companyrollback(JSON.stringify({
      		companyId:this.ids,
      		fillyear:this.searchValue.fillyear,
      		type:1
      	 })).then((res) => {
      		if(res.data.status==0){
      			this.getAllsmallcompany(this.searchValue)
      		}
      	})
      },
      save () {
      	console.log(this.small)
      	api.creport.companyFill(this.small).then((res) => {
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
    	this.searchValue.type = 1
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
