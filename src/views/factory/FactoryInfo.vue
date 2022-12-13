<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 制造商信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="name" label="制造商名称"></el-table-column>
        <el-table-column label="照片" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="scope.row.logo" :preview-src-list="[scope.row.logo]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="about" label="简介"></el-table-column>
        <el-table-column prop="contact_number" label="联系人手机号"></el-table-column>
        <el-table-column prop="contact_name" label="联系人姓名"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="40%">
      <el-form label-width="70px">
        <el-form-item label="LOGO">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/upload/factory"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :data="{'id':add_form.id,'name':add_form.name}"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="制造商ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="制造商名字">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="制造商简介">
          <el-input v-model="form.about"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contact_number"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="form.contact_name"></el-input>
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
    <el-dialog title="编辑" v-model="addVisible" width="40%">
      <el-form label-width="70px">
        <el-form-item label="LOGO">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/upload/factory"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :data="{'name':add_form.name}"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="制造商名字">
          <el-input v-model="add_form.name"></el-input>
        </el-form-item>
        <el-form-item label="制造商简介">
          <el-input v-model="add_form.about"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="add_form.contact_number"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="add_form.contact_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addInfo">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import { ElUpload } from 'element-plus'
import {FactoryHelper} from "../../api/factory"

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
    // 获取表格数据
    const getData = () => {
      // fetchData(query).then((res) => {
      //   tableData.value = res.list;
      //   pageTotal.value = res.pageTotal || 50;
      // });
      //获取员工信息
      FactoryHelper.getfacinfo().then(info => {
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })
      //获取职位信息
      FactoryHelper.getfacinfo().then(info=>{
        if(info.code===200){
          options.value=info.res.items;
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
            FactoryHelper.delfac(value).then((info)=>{
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
      logo: "",
      id: "",
      name: "",
      about: "",
      contact_number: "",
      contact_name: "",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      logo: "",
      id: "",
      name: "",
      about: "",
      contact_number: "",
      contact_name: "",
    });

    const handleAdd = () => {
      addVisible.value=true;
    }

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        logo:add_form.logo,
        id:add_form.id,
        name:add_form.name,
        about:add_form.about,
        contact_number:add_form.contact_number,
        contact_name:add_form.contact_name,
      })
      FactoryHelper.addfac(params).then((info)=>{
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
      add_form.logo=res;
      form.logo=res;
      console.log(res);
    }

    const beforeAvatarUpload = (file) => {
      let haveId = true;
      let haveName = true;

      if(add_form.name===""){
        ElMessage.error("上传图片之前请先制造商名称")
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
        logo:form.logo,
        id:form.id,
        name:form.name,
        about:form.about,
        contact_number:form.contact_number,
        contact_name:form.contact_name,
      })

      FactoryHelper.updatefac(params).then((info)=>{
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
