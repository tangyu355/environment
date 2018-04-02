<template>
  <div id="alter">
    <h3>修改密码</h3>
    <el-card class="box-card">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item >

          <el-button type="primary" @click="submitForm('ruleForm2')">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      state: state,
      action: actions,
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 14, message: '密码最小6位，最长14位,由数字、字母、下划线组成', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 14, message: '密码最小6位，最长14位,由数字、字母、下划线组成', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    submitForm(formName) {
      let vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.usermanage.pwdupdate({
            id: this.state.user.id,
            password: this.ruleForm2.pass
          }).then((res) => {
            if(res.data.status == 0){
              vm.$message({
                type: 'success',
                message: '修改密码成功，请重新登陆!'
              })  
              this.action.logout()
            } else {
              this.$message.error("密码修改失败");
            }   
          })  
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted () {
    this.$nextTick(() => {
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
