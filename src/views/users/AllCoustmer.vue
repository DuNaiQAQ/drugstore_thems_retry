<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="买家编号" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱地址"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="text" class="red"
                       @click="handleChange(scope.$index, scope.row)">更改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 弹出框 -->
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="add_form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="add_form.phone"></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="add_form.email"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addInfo">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <el-dialog title="密码更改" v-model="changeVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户ID">
          <el-input v-model="add_form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="add_form.password" placeholder="输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changePass">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>



<script>
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import { ElUpload } from 'element-plus'
import {UserHelper} from "../../api/user";

export default {
  name: "basetable",
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const options = ref([]);
    const options2=ref([]);
    const changeVisible=ref(false);
    // 获取表格数据
    const getData = () => {
      // fetchData(query).then((res) => {
      //   tableData.value = res.list;
      //   pageTotal.value = res.pageTotal || 50;
      // });
      //获取员工信息
      UserHelper.getCo().then(info => {
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })
    };
    getData();

    //选项
    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (value) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            UserHelper.deleteCo(value).then((info)=>{
              if(info.code===200){
                ElMessage.success("删除成功");
                getData();
              }
            })
          })
          .catch((info) => {
            ElMessage.success("删除失败"+info.message);
          });
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      id: "",
      name: "",
      phone: "",
      email:"",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      id: "",
      name: "",
      phone: "",
      email:"",
      password:"",
    });

    const handleChange=(index,row)=>{

      idx = index;
      Object.keys(form).forEach((item) => {
        add_form[item] = row[item];
      });
      changeVisible.value=true;
    }
    const handleAdd = () => {
      addVisible.value=true;
    }

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        id: add_form.id,
        name: add_form.name,
        phone: add_form.phone,
        email:add_form.email,
      })
      UserHelper.addCo(params).then((info)=>{
        //以下是响应部分
        if(info.code===200){
          ElMessage.success("添加信息成功");
          addVisible.value=false;
          getData();
        }else {
          ElMessage.error("添加信息失败");
        }
      })
    }

    //头像上传
    const imageUrl = ref('')
    const handleAvatarSuccess = (res, file) => {
      imageUrl.value = URL.createObjectURL(file.raw)
      add_form.photo=res;
      form.photo=res;
      console.log(res);
    }

    const changePass = () =>{
      var params=JSON.stringify({
        id: add_form.id,
        username:add_form.name,
        password:add_form.password,
      })
      UserHelper.changePass_admin(params).then((info)=>{
        if(info.code===200){
          ElMessage.success("修改密码成功");
         changeVisible.value=false;
          getData();
        }else {
          ElMessage.error("错误:"+info.message);
        }
      })
    }

    const beforeAvatarUpload = (file) => {
      let haveId = true;
      let haveName = true;

      if(add_form.id===""){
        ElMessage.error("上传图片之前请先填写ID和姓名");
        haveId=false;
      }

      if(add_form.name===""){
        ElMessage.error("上传图片之前请先填写ID和姓名")
        haveName=false;
      }

      return haveId && haveName
    }



let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };

    const saveEdit = () => {
      var params=JSON.stringify({
        id: form.id,
        name: form.name,
        phone: form.phone,
        email: form.email
      })
      UserHelper.updateCo(params).then((info)=>{
        if(info.code===200){
          editVisible.value = false;
          ElMessage.success("修改信息成功!");
          getData();
        }else{
          ElMessage.error("修改信息失败!");
          console.log(info.message);
        }
      })
    };


    const dateFormat = (row, column) => {
      let dates = row[column];
      var date = new Date(dates) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1): date.getMonth()+1) + '-'
      var D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' '
      var h =  (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds())

      return Y+M+D+h+m+s
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      addVisible,
      add_form,
      imageUrl,
      options,
      changeVisible,
      handleChange,
      changePass,
      dateFormat,
      addInfo,
      handleAdd,
      beforeAvatarUpload,
      handleAvatarSuccess,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
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
</style>
