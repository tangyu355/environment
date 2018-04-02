<template>
  <div id="mymenu"> 
 <el-menu default-active = "1"  :default-active = "paths" class="left-menu" @open="handleOpen" @close="handleClose" router>
      <el-menu-item-group>
        <div v-for="(m1,m1index) in menuinfo">
          <el-submenu v-if="m1.second" :index="setindex(m1index)" >
            <template slot="title">
              <i :class="m1.icon" style="margin-right:5px;color: rgb(32, 160, 255);"></i>
              {{m1.title}}
            </template>
            <div v-for="(m2,m2index) in m1.second">
              <el-submenu v-if="m2.list" :index="setindex((m1index+'-'+m2index))" >
                <template slot="title">{{m2.title}}</template>
                <el-menu-item v-for="(m3,m3index) in m2.list" :route="setroute(m3)" :index="setindex((m1index+'-'+m2index+'-'+m3index))">{{m3.pname}}</el-menu-item>
              </el-submenu>
              <el-menu-item :route="setroute(m2)" :index="setindex((m1index+'-'+m2index))" v-else>{{m2.title}}</el-menu-item>
            </div>
            
          </el-submenu>
        </div>
        
      </el-menu-item-group>
    </el-menu>        
  </div>
</template>

<script>
import store from 'src/store'
import _ from 'lodash'
import api from 'src/api'

export default {
  name: 'mymenu',
  data () {
    return {
      menu1: '',
      menu2: '',
      show: true,
      state: store.state,
      action: store.actions,
      showmenu: true,
      username: '',
      user: store.state.user,
      paths: ''
    }
  },
  computed: {
    menuinfo () {
      let list = []
      console.log(this.state.permissionlist.list)
      _.forEach(this.state.permissionlist.list, (m1) => {
        // console.log(m1)
        let slist = []
        if (m1.list.length > 0 && m1.enable) {
          _.forEach(m1.list, (m2) => {
            if (m2.link) {
              let l = m2.link ? m2.link: ''
              //console.log(l, m2.link)
              slist.push({
                title: m2.pname,
                link: m2.link ? m2.link: ''
              })
            } else{
            	slist.push({
                title: m2.pname, 
                link:'',
                list:m2.list
              })
            }
          })
          list.push({
            title: m1.pname,
            icon: m1.icon,
            second: slist,
          })
        }
        if(m1.list.length > 0 && !m1.enable){
        	 _.forEach(m1.list, (m2) => {
        	 	//console.log(m2)
        	 	if(m2.enable){
        	 		if(m2.link){
        	 		slist.push({
                title: m2.pname,
                link: m2.link ? m2.link: ''
              })
        	 		} else{
        	 			slist.push({
                title: m2.pname, 
                link:'',
                list:m2.list
              })
        	 		}
        	 	}
        	 })
        	 if(slist.length){
	        	  list.push({
	            title: m1.pname,
	            icon: m1.icon,
	            second: slist           
	            })
        	 }
        }
        else {
          list.push({
            title: m1.pname,
            icon: 'fa fa-home',
            link:'/home',
          })
        }
      
      })
      
      let vm = this
      _.pull(list, null)
      return list
    }  	
  },
  methods: {
  	 setindex(x) {
      return x.toString()
    },
    setroute (r) {
    	  if(r.link[0]!=='/'){
    	    return JSON.parse(r.link)
    	  } else{
    	  	return {path:r.link}
    	  }
    },
    logout () {
      api.user.signout().then((res) => {
        if (res.data.status === 0) {
          store.actions.logout()
        }
      }, () => {})
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }    
  },
  mounted: function () {
    this.$nextTick(function () {
    	console.log(this.$route)
      this.paths = this.$route.path      
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left-menu{
  width:235px;
}
.el-submenu__icon-arrow{
	margin-left: 15px;
}
</style>
