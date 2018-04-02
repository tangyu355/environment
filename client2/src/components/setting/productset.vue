<template>
	<div id="productset">
		<h3>工业源产品算法配置</h3>
    	<el-row :gutter="10" style="margin-bottom:10px;">
	    	<!--<el-col :span="3">
	        <el-select v-model="fillyear" placeholder="年份">
	         <el-option
	            v-for="item in state.yearlist"
	            :label="item"
	            :value="item">
	          </el-option>
	        </el-select>
	      </el-col>-->
				<el-col :span="5">
	      	<el-cascader
					  :options="state.tradelist"
					  v-model="trades"
					  placeholder="请选择行业"
					  change-on-select
					  clearable
					  :show-all-levels = "false"
					></el-cascader>
	      </el-col>
	      <el-col :span="5">
	      	<el-cascader
          :options="state.districtlist"
          v-model="district"
          change-on-select
          :show-all-levels="false"
          placeholder="选择地区"
          clearable>
        </el-cascader>
	      </el-col>
	      <el-col :span="3">
	      	<el-select v-model="setstatus">
	      		<el-option
	      			v-for="(s,sindex) in statelist"
	      			:value="sindex"
	      			:label="s">
	      		</el-option>
	      	</el-select>
	      </el-col>
	      <el-col :span="5">
		      	<el-input v-model="productname" placeholder="搜索关键字（公司名、产品名)" icon="search" :on-icon-click="search"></el-input>
	      </el-col>
	      <el-col :span="2">
       		<el-button icon="search" @click='search' type="primary">搜索</el-button>
      	</el-col>
	      <el-col :span="6" >
					<div v-if="isgroup == 0" style="margin:5px 5px;">
						<el-button type="danger" @click="unbind(null)">批量删除分组</el-button>
						<el-button  @click="batchSetGroup(null)">批量设置分组</el-button>
					</div>
					<div v-if="isgroup == 1 ">
						<el-button  @click="addGroup(false,1)">新建产品组</el-button>
					</div>
					<div v-if="isgroup == 2 ">
						<el-button  @click="addGroup(false,2)">新建原辅料组</el-button>
					</div>
				</el-col>

			</el-row>
	<div v-loading.body="show" element-loading-text="请稍候...">
	<el-tabs v-model="isgroup" type="card" @tab-click="search">
      <el-tab-pane label="产品" name="0" v-loading.body="loading" element-loading-text="加载中...">
      	 <table >
          <thead >
            <tr>
              <th>#</th>
              <th width="30%">公司</th>
              <th>产品</th>
              <th>
              	<el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
 							</th>
              <th>所属产品组</th>
              <th width="20%">产品组操作</th>
              <th width="8%">操作</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody v-for="(com,index) in state.showlist">
            <tr v-for="(prod,$index) in com.list">
              <td :rowspan="com.list.length" v-if="$index === 0 ">{{index+1}}</td>
              <td :rowspan="com.list.length" v-if="$index === 0 ">
               <router-link :to="{name:'detailcompany',params: {comId:com.companyId,year:fillyear,companyName:com.companyName}}">{{com.companyName}}</router-link>
              </td>
              <td >{{prod.productName}}</td>
              <td>
              	<label class="el-checkbox" >
              		<span :class="[ischeck[prod.productId]?'is-checked':'','el-checkbox__input']" >
              			<span class="el-checkbox__inner" ></span>
              			<input type="checkbox" :id="prod.productId" :value="prod.productId" v-model="checkvalue"/>
              		</span>
              	</label>

              </td>
              <td >
                <router-link :to="{ name:'factorset',params: {groupid:prod.groupid}}" v-if="prod.groupid !== prod.productId">
                  <el-tag>{{prod.groupName}}</el-tag>
                </router-link>
              </td>
              <td>
              	<el-button @click="batchSetGroup(prod.productId)" size="small">设置分组</el-button>

                <el-button v-if="prod.groupid !==prod.productId" type="danger" size="small" @click="unbind(prod.productId)">
                  删除分组
                </el-button>
              </td>

            <td>

              <router-link :to="{ name:'factorset',params: {groupid:prod.groupid}}" v-if="prod.groupid === prod.productId" tag="el-button" class="el-button--default el-button--small">
                查看因子
              </router-link>
            </td>
             <td>
              <el-tag v-if = "prod.status == 1" type="danger">未配置</el-tag>
              <el-tag v-if = "prod.status == 2" type="success">已配置</el-tag>

            </td>
          </tr>
        </tbody>
       </table>
    	</el-tab-pane>

      <el-tab-pane label="产品组" name="1">
      	<el-table element-loading-text="加载中..."
		      :data="state.showlist"
		      style="width: 100%"
		      v-loading.body="loading">
		      <el-table-column
		        label="产品名"
		        width="180">
		        <template scope="scope">
			        {{scope.row.list[0].productName}}
			      </template>
		      </el-table-column>
		      <el-table-column
		        label="状态"
		        width="180">
		        <template scope="scope">
			        <el-tag v-if = "scope.row.list[0].status == 1" type="danger">未配置</el-tag>
              <el-tag v-if = "scope.row.list[0].status == 2" type="success">已配置</el-tag>
			      </template>
		      </el-table-column>
		      <el-table-column
		        label="操作">
		        <template scope="scope">
			        <router-link :to="{ name:'factorset',params: {groupid:scope.row.list[0].groupid}}" v-if="scope.row.list[0].groupid === scope.row.list[0].productId" tag="el-button" class="el-button--default el-button--small">
                查看因子
              </router-link>
              <el-button @click="addGroup(scope.row.list[0],1)" type="primary" size="small">编辑</el-button>              
              <el-button @click="deleteGroup(scope.row.list[0].groupid)" type="danger" size="small">删除</el-button>
			      </template>
		      </el-table-column>
		    </el-table>
    	</el-tab-pane>
    	<!--<el-tab-pane label="原辅料组" name="2">
      	<el-table element-loading-text="加载中..."
		      :data="state.showlist"
		      style="width: 100%"
		      v-loading.body="loading">
		      <el-table-column
		        label="产品名"
		        width="180">
		        <template scope="scope">
			        {{scope.row.list[0].productName}}
			      </template>
		      </el-table-column>
		      <el-table-column
		        label="状态"
		        width="180">
		        <template scope="scope">
			        <el-tag v-if = "scope.row.list[0].status == 1" type="danger">未配置</el-tag>
              <el-tag v-if = "scope.row.list[0].status == 2" type="success">已配置</el-tag>
			      </template>
		      </el-table-column>
		      <el-table-column
		        label="操作">
		        <template scope="scope">
			        <router-link :to="{ name:'factorset',params: {groupid:scope.row.list[0].groupid}}" v-if="scope.row.list[0].groupid === scope.row.list[0].productId" tag="el-button" class="el-button--default el-button--small">
                查看因子
              </router-link>
              <el-button @click="addGroup(scope.row.list[0],2)" type="primary" size="small">编辑</el-button>
              <el-button @click="deleteGroup(scope.row.list[0].groupid)" type="danger" size="small">删除</el-button>
			      </template>
		      </el-table-column>
		    </el-table>
    	</el-tab-pane>-->
    </el-tabs>
 </div>
    <my-pagination></my-pagination>
    <el-dialog title="选择产品组" v-model="dialogFormVisible" class="window">
		  <el-form  label-width="120px" >
		    <el-form-item label="请选择行业" >
		      <el-cascader
					  :options="state.tradelist"
					  v-model="ctrades"
					  placeholder="请选择行业"
					  change-on-select
					  clearable
					  :show-all-levels = "false"
					></el-cascader>
		    </el-form-item>
		    <el-form-item label="搜索产品组" >
		      <el-input v-model="pgname"></el-input>
		      <el-button type="primary" @click="findgroup">查 询</el-button>
		    </el-form-item>

		    <el-form-item label="产品组"  v-if="grouplist.length > 0">
		      <el-select v-model="groupid">
		      	<el-option v-for="g in grouplist"
			      :label="g.list[0].productName"
			      :value="g.list[0].productId">
		      	</el-option>
		    	</el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="setPintoGroup">确 定</el-button>
		  </div>

		</el-dialog>
		<el-dialog :title="editText" v-model="pgsetDialog" class="window" :modal="false">
		  <el-form  label-width="120px" >
		    <el-form-item label="请选择行业" >
		      <el-cascader
					  :options="state.tradelist"
					  v-model="ctrades"
					  placeholder="请选择行业"
					  change-on-select
					  clearable
					  :show-all-levels = "false"
					></el-cascader>
		    </el-form-item>
		    <el-form-item label="产品组名" v-if="isgroup == 1">
		      <el-input v-model="groupdata.groupName"></el-input>
		    </el-form-item>
		    <el-form-item label="原辅料组名" v-if="isgroup == 2">
		      <el-input v-model="groupdata.groupName"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="pgsetDialog = false">取 消</el-button>
		    <el-button type="primary" @click="addupGroup(-1)" v-if="!isedit&&isgroup == 1">确 定</el-button>
		    <el-button type="primary" @click="addupGroup(true)" v-if="isedit&&isgroup == 1">确 定</el-button>
		    <el-button type="primary" @click="addupMaterial(-1)" v-if="!isedit&&isgroup == 2">确 定</el-button>
		    <el-button type="primary" @click="addupMaterial(true)" v-if="isedit&&isgroup == 2">确 定</el-button>
		  </div>

		</el-dialog>
	</div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
export default {
	components: {
	},
	data () {
		return {
			editText:'',
			checkAll:false,
			isedit:false,
			state: state,
			actions:actions,
			trades: [],
			ctrades:[],
			pgname:'',
			district: [],
			isgroup:'0',
			grouplist:[],
			checkvalue:[],
			setstatus:0,
			groupid:'',
			productname:'',
			show: false,
			isMaterial:false,
			props: {
				label:'label',
             value: 'id',
        children: 'children'
      },
      companies: [],
      dialogFormVisible:false,
      pgsetDialog:false,
      statelist:['全部','未配置','已配置'],
      loading:false,
      groupdata:{
      	groupName:'',
        groupid: ''
      },
      fillyear:state.watchyear
	  }
	},
	computed: {
		ischeck() {
			let list = {}
			_.forEach(this.checkvalue,function(o){
				list[o] = true
			})
			console.log(list)
			return list
		}
	},
	watch: {
		'$route':'fetchData',
		'state.listnow' (newValue, oldValue) {
         console.log(newValue)
         this.actions.setShowList(this.companies,newValue.currentPage)
        },
        'state.watchyear':{
		    handler: function (val, oldVal) {
		    this.fillyear = val
		  	},
		   deep: true
		}
	},
	methods: {
		ischecked(id){
			return _.find(this.checkvalue,id)
		},
		fetchData () {
			this.loading = true
			console.log(this.$route)
			if (this.$route.query.tradeid && typeof(this.$route.query.tradeid) === 'string') {
				this.trades = [_.toNumber(this.$route.query.tradeid)]
			}else{
				console.log(this.$route.query.tradeid,)
				this.trades = _.map(this.$route.query.tradeid, _.ary(parseInt, 1));
			}
			console.log(this.trades)
			this.isgroup = this.$route.query.isgroup || '0'
			let pdata = {
           tradeid:_.last(this.trades) || 0,
          status:this.$route.query.status || 0,
          isgroup:this.$route.query.isgroup || '0',
          year:this.$route.query.year || this.state.watchyear,
           districtid:_.last(this.district) || 0
			}
			if (this.$route.query.productName) {
				pdata.productName = this.$route.query.productName
			}
			this.getproduct(pdata)
		},
		search () {
			this.$router.push({
				query:{
		          productName:this.productname,
		          tradeid:(this.trades),
		          status:this.setstatus,
		          isgroup:this.isgroup,
		          year:this.fillyear,
		          districtid:_.last(this.district)
				}
			})
		},
    getproduct (data){
      let vm = this;
      vm.show = true
      api.setting.searchproduct(data).then(function(res){
      	if (res.data.status === 0){
      		console.log(res)
      		vm.companies = res.data.productList;
        	actions.setShowList(vm.companies,vm.state.listnow.currentPage)
        	vm.loading = false
        	vm.show = false
      	} else{
      		vm.$message.error(res.data.msg)
      	}
      })
    },
    batchSetGroup(id) {
    	console.log('open')

    	if (id) {
    		this.checkvalue = [id]
    	} else {
    		if (this.checkvalue.length < 1) {
    			this.$message.error('请选择产品！')
    			return
    		}
    	}
    	this.dialogFormVisible = true
    	console.log(this.checkvalue)
    },
    findgroup () {
    	let vm = this
      api.setting.searchproduct({
        isgroup:1,
        productName:this.pgname,
        tradeid:_.last(this.ctrades)
      }).then(function(res){
      	if (res.data.status === 0) {
      		console.log(res)
        	vm.grouplist = res.data.productList;
      	} else {
      		vm.$message.error('异常，或者没有数据，请更换行业重试。')
      		vm.grouplist = []
      	}
      })
    },
    setPintoGroup () {
      let vm = this;
      let data={
        groupId:this.groupid,
        productId:this.checkvalue
      }
      api.setting.setPintoGroup(JSON.stringify(data)).then(function(res){
        //console.log(res);
        if(res.data.status == 0){
          vm.$message({
						type:'success',
          	message:'设置产品组成功！'
          })
          vm.fetchData()
        }else{
          vm.$message.error('设置产品组失败！')
        }
        vm.dialogFormVisible = false
        vm.checkvalue = []
      })
    },
    handleCheckAllChange(event){
    	let vm = this
    	this.checkvalue = []
    	if (event.target.checked) {
    		_.forEach(this.state.showlist,function(s){
	    		_.forEach(s.list,function(l){
	    			vm.checkvalue.push(l.productId)
	    		})
	    	})
    	}
    },
    unbind(id){
    	console.log(id)
    	let data = {}
    	let vm = this;
    	if (id) {
    		data = {
		      productId:[id]
		    }
    	} else {
    		if (this.checkvalue.length === 0) {
    			vm.$message.error('请选择要删除产品组的产品！')
    			return;
    		} else {
    			data = {
			      productId:this.checkvalue
			    }
    		}
    	}
	    api.setting.updateGroup(JSON.stringify(data)).then(function(res){
	      if(res.data.status == 0){
	        vm.$message({
				type:'success',
          	    message:'删除成功！'
          })
          vm.checkvalue = []
	        vm.fetchData()
	      }else{
	        vm.$message.error('删除产品组失败！')
	      }
	    })
    },
    deleteGroup:function(id){
	    let vm = this;

      this.$confirm('此分类下有产品，如果删除产品将失去分类配置，确定删除？','警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.setting.delGroup({groupId:id}).then(function(res){
          if(res.data.status == 0)
            vm.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

	  },	  
	  addGroup(data,index) {
	  	console.log(data)
	  	if(index==1){
		  	this.editText = '编辑产品组'
		  	if(!data){
		  		this.isedit = false
		  	}else{
		  		console.log(111)
		  		this.isedit = true
		  	}
		  	_.assign(this.groupdata,data)
	  	}
	  	if(index==2){
	  		this.editText = '编辑原辅料组'
	  	}
	  	this.groupdata.groupName = data.productName
	  	this.ctrades = []
	  	for (var i = 1; i <= 4; i++) {
	  		if (data['trade'+i] !== 0) {
	  			this.ctrades.push(data['trade'+i])
	  		}
	  	}
	  	console.log(this.groupdata,this.ctrades)
	  	this.pgsetDialog = true
	  },
	  addupMaterial(isedit){
	  	
	  },
	  addupGroup(isedit) {
	  	let vm = this;
        let data = {
        groupName:this.groupdata.groupName,
        //remark: vm.remark,
        groupId:this.groupdata.groupid
      };
      for (let i = 0;i< this.ctrades.length;i++) {
        data['trade'+(i*1+1)] = this.ctrades[i]
      };      
      if(isedit==-1){
      	api.setting.addProductGroup(data).then(function(res){
          if(res.data.status == 0){
		        vm.pgsetDialog = false
		        vm.fetchData()
            vm.$message({type:'success',message:'操作成功！'})
          }else{
            vm.$message.error(res.data.msg)
          }
        })
      }else{
        api.setting.updateProductGroup(JSON.stringify(data)).then(function(res){
          if(res.data.status == 0){
		        vm.pgsetDialog = false
		        vm.fetchData()
            vm.$message({type:'success',message:'操作成功！'})
          }else{
            vm.$message.error(res.data.msg)
          }
        })
      }
	  }
	},
	mounted() {
		this.$nextTick(() => {
			console.log('kaishi')
			this.fetchData()
		})
	}
}</script>
<style scoped>
.item {
	padding: 18px 0;
}
a {
  color: #337ab7;
  text-decoration: none;
}
table {
	display: table;
	border-collapse: separate;
	border-spacing: 0px;
	border-color: grey;
	border: 1px solid #dfe6ec;
}
table thead {
	background-color: #eef1f6;
}
table tr {
	height: 40px;
}
table th {
	background-color: #eef1f6;
	text-align: left;

}
table td {
	background-color: #fff;
	text-align: left;

}
table th,td {
	padding: 5px 15px;
	border-bottom: 1px solid #dfe6ec;
	border-right: 1px solid #dfe6ec;
}

.window{
	/*z-index:2001 !important;*/
}
.window .el-input,.window .el-cascader,.window .el-select {
	width:280px;
}
.el-checkbox__input input{
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    left: -999px;
}
</style>
