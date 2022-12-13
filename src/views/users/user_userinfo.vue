<template>
  <div class="header">
    <div class="logo" style="margin-left: 2%">药店管理系统-用户端</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="user">个人中心</el-dropdown-item>
              <el-dropdown-item command="buy">购买药品</el-dropdown-item>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="密码：">
              <el-input type="password" v-model="add_form.old"></el-input>
            </el-form-item>
            <el-form-item label="重复密码：">
              <el-input type="password" v-model="add_form.new"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePass">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import {DrugHelper} from "../../api/drug"
import {BillHelper} from "../../api/bill";
import {UserHelper} from "../../api/user";
import {useStore} from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "basetable",
  setup() {
    const query = reactive({
      type: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const options = ref([]);
    const search_tableData = ref([]);
    const total_money = ref(0);

    //选项
    // 查询操作
    const handleSearch = () => {
      searchVisible.value=true;
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
    };
    const changePass = () =>{
      if(add_form.new==add_form.old){
        var params=JSON.stringify({
          username:username,
          password:add_form.old,
        })
        if(form.old===""||forn.new==="") {
          ElMessage.error("请输入密码!");
        }else {
          UserHelper.changePass_admin(params).then((info) => {
            if (info.code === 200) {
              ElMessage.success("修改密码成功");
            } else {
              ElMessage.error("错误:" + info.message);
            }
          })
        }
      }else{
        ElMessage.error("错误:两次输入的密码不一致");
      }
    }


    let add_form = reactive({
      id:"",
      new:"",
      old:"",
    });

    const username = localStorage.getItem("ms_username");
    const message = 2;

    const store = useStore();
    const collapse = computed(() => store.state.collapse);
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit("handleCollapse", !collapse.value);
    };

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });

    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = (command) => {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        UserHelper.logout_user().then((info)=>{
          if(info.code===200){
            ElMessage.success("退出登录成功")
            router.push("/login")
          }else{
            ElMessage.error(info.message)
            router.push("/login");
          }
        })
      } else if (command == "user") {
        router.push("/user_info");
      }else if (command=="buy"){
        router.push("/user_find")
      }
    };

    return {
      query,
      tableData,
      pageTotal,
      add_form,
      options,
      search_tableData,
      total_money,
      handleSearch,
      handlePageChange,
      changePass,
      username,
      message,
      collapse,
      collapseChage,
      handleCommand,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
