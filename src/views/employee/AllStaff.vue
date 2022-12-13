<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 所有员工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.address" placeholder="搜索方式" class="handle-select mr10">
          <el-option key="1" label="姓名" value="name"></el-option>
          <el-option key="2" label="职工号" value="id"></el-option>
        </el-select>
        <el-input v-model="query.name" placeholder="需要搜索的内容" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
      </div>
      <el-table
          :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
          border
          class="table"
          ref="multipleTableRef"
          header-cell-class-name="table-header"
          @selection-change="selectChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="职工号" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="照片" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="scope.row.photo" :preview-src-list="[scope.row.photo]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="birthday" label="生日">
          <template #default="scope">
            {{dateFormat(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="address" label="住址"></el-table-column>
        <el-table-column prop="type_name" label="员工类型"></el-table-column>
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
        <el-form-item label="员工头像">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/upload/head"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :data="{'id':add_form.id,'name':add_form.name}"
          >
            <img v-if="form.photo" :src="form.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="员工ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="form.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="员工职位">
          <el-select v-model="form.type" class="m-2" placeholder="员工职位">
            <el-option
                v-for="items in options"
                :key="items.id"
                :label="items.name"
                :value="items.id"
            >

            </el-option>
          </el-select>
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
    <el-dialog title="编辑" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="员工头像">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/upload/head"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :data="{'id':add_form.id,'name':add_form.name}"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="员工ID">
          <el-input v-model="add_form.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="add_form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="add_form.sex" label="男">男</el-radio>
          <el-radio v-model="add_form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="add_form.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="add_form.phone"></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="add_form.address"></el-input>
        </el-form-item>
        <el-form-item label="员工职位">
          <el-select v-model="add_form.type" class="m-2" placeholder="员工职位">
            <el-option
              v-for="items in options"
              :key="items.id"
              :label="items.name"
              :value="items.id"
              >

            </el-option>
          </el-select>
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
          <el-input v-model="add_form.id" placeholder="输入新密码"></el-input>
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
import { ref, reactive,getCurrentInstance,toRaw,toRefs,watch } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import { ElUpload } from 'element-plus'
import {StaffHelper} from "../../api/staff"
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
    const  instance = getCurrentInstance();
    const multipleTableRef = ref(null);
    const multipleSelection  = ref([]);
    // 获取表格数据
    const getData = () => {
      // fetchData(query).then((res) => {
      //   tableData.value = res.list;
      //   pageTotal.value = res.pageTotal || 50;
      // });
      //获取员工信息
      StaffHelper.getAllStaff().then(info => {
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })
      //获取职位信息
      StaffHelper.getTypes().then(info=>{
        if(info.code===200){
          options.value=info.res.items;
        }else {
          ElMessage.error(info.message)
        }
      })
    };
    getData();

    const selectChange=()=>{
      var ultipleTabInstance = toRefs(instance.refs.multipleTableRef)
      console.log(ultipleTabInstance.toggleRowSelection);
      if(rows){
        rows.forEach(row => {
          ultipleTabInstance.toggleRowSelection.value(row, undefined)
        });
      }else{
        ultipleTabInstance.clearSelection.value()
      }
    }

    const changePass = () =>{
      var params=JSON.stringify({
        id: add_form.id,
        password:add_form.password,
      })
      UserHelper.changePass(params).then((info)=>{
        if(info.code===200){
          ElMessage.success("修改密码成功");
          changeVisible.value=false;
          getData();
        }else {
          ElMessage.error("错误:"+info.message);
        }
      })
    }

    const handleChange=(index,row)=>{

      idx = index;
      Object.keys(form).forEach((item) => {
        add_form[item] = row[item];
      });
      changeVisible.value=true;
    }

    const changeVisible =ref(false);
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
            StaffHelper.deleteStaff(value).then((info)=>{
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
      photo: "",
      id: "",
      name: "",
      sex: "",
      birthday: "",
      phone: "",
      address: "",
      type: "",
      type_name:"",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      photo: "",
      id: "",
      name: "",
      sex: "",
      birthday: "",
      phone: "",
      address: "",
      type: "",
      password:"",
    });

    const handleAdd = () => {
      addVisible.value=true;
    }

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        photo:add_form.photo,
        id: add_form.id,
        name: add_form.name,
        sex: add_form.sex,
        birthday: add_form.birthday,
        phone: add_form.phone,
        address: add_form.address,
        type: add_form.type,
      })
      StaffHelper.addStaff(params).then((info)=>{
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
        photo:form.photo,
        id: form.id,
        name: form.name,
        sex: form.sex,
        birthday: form.birthday,
        phone: form.phone,
        address: form.address,
        type: form.type,
      })

      StaffHelper.updateInfo(params).then((info)=>{
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
      var date = new Date(row.birthday) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1): date.getMonth()+1) + '-'
      var D = date.getDate()
      return Y+M+D
    }

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
      changePass,
      changeVisible,
      handleChange,
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
      selectChange,
      instance,
      multipleSelection,
      multipleTableRef,
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
