/*
 * 简化版的 vuex
 * state 保存一些全局状态和数据，只通过 actions 中的方法修改
 */
import api from 'src/api'
import Locals from 'src/lib/locals'
import _ from 'lodash'

export const state = {

  user: {},
  pagekey:{},
  permissionlist: [],
  showcom:true,
  startyear:2016,
  listinfo: {
    numperPage: 10,
    count: 0,
    currentPage: 1
  },
  typelist:[{id:0,name:'规模以上'},{id:1,name:'小散企业'},{id:2,name:'所有'}],
  typeidList:[{id:1,name:'省级计算'},{id:2,name:'市级计算'}],
  listnow:'',
  pageSize: [5,10, 15, 20, 30],
  showlist: [],
  watchyear: 2016,
  yearlist: [],
  districtlist: [],
  Districtlist:[],
  tradelist: [],
  citylist:[],
  prihash:{},
  changed: false,
  year:{},
  roleId:-1,
  cityId:-1,
  town:-1,
  /*
   * Int isLogin
   * -1：未知，0：未登录，1：已登录
   */
  isLogin: -1,
}
export let actions = {
  login (userinfo,permission,year) {
  	console.log(year)
  	state.yearlist = year
  	if(new Locals('startyear').data==undefined){
	  	state.year.watchyear = state.watchyear
	  	actions.yearchanged(state.year)
  	}
    state.user = userinfo
    state.roleId = userinfo.role_id 
    state.town = userinfo.town 	
	console.log(state.Districtlist)
    state.cityId = userinfo.city
    state.permissionlist = permission
    state.prihash = actions.sethash(permission.list)   
    actions.getAllDistrict()
    actions.getAllTrade()	
    //console.log(permission)
    console.log(userinfo)
    state.isLogin = 1
  },
  savetrade (list) {
  	console.log(list)
  	state.tradelist = list
  },
  getAllDistrict (){
  		api.staticinformation.getAllDistrict().then((res) => {
  			console.log(res)
  			 if (res.data.status === 0) {
  			  actions.savedistrict(res.data.list)
  			}
  		})
  },
  getAllTrade (){
  		api.staticinformation.getAllTrade().then((res) => {
  			console.log(res)
  			if (res.data.status === 0) {
  			   actions.savetrade(res.data.list)
  			}
  		})
  	},
   savedistrict (list) {
  	state.districtlist = list
	if(state.roleId==2){            
        state.Districtlist = []
		_.forEach(state.districtlist, function(ob){         	 	    
			_.forEach(ob.children, function(oob){       	 	    		       	 	    		
					if(oob.value==state.cityId){						
						state.Districtlist.push({
							label:'四川省',
							value:1,
							children:[oob]
						})
					}
				}) 	 	    
 		})
       console.log(state.Districtlist)			
	}
  },
  logout () {
    state.user = {}
    state.isLogin = 0
  },
  notLogin () {
    state.isLogin = 0
  },
  handleSizeChange (val) {
    //console.log(`每页 ${val} 条`);
    state.listinfo.numperPage = val
    state.listnow = JSON.stringify(state.listinfo)
  },
  handleCurrentChange (val) {
    state.listinfo.currentPage = val;
    //console.log(`当前页: ${val}`);
    state.listnow = JSON.stringify(state.listinfo)
  },
  setShowList (list, page) {
  	state.showlist = []
    state.listinfo.count = list.length    
    if (page) {
      state.listinfo.currentPage = page
    }
    state.showlist = list.slice((( state.listinfo.currentPage - 1) * state.listinfo.numperPage), ( state.listinfo.currentPage * state.listinfo.numperPage))
    console.log(state.showlist)
    state.listnow = JSON.stringify(state.listinfo)
  },
  yearchanged(obj){
  	new Locals('startyear',obj)   	
  	api.user.changeyear(obj.watchyear).then(function(res){
  		console.log(res)
  		if(res.data.status==0){ 
  			state.watchyear = new Locals('startyear',obj).data.watchyear
  		}
  	})
  },
  sethash (list) {
  	//console.log(list)
    let hashlist = {}
    _.forEach(list, function (ob) {
    	//console.log(ob)
      _.forEach(ob.list, function (ob){
      	_.forEach(ob.list, function (ob){
          hashlist[ob.id] = ob.enable
        })
      })
    })
    return hashlist
  },
}

export default {
  state,
  actions
}
