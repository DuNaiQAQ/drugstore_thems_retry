<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>职工类别
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加员工职位</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="类别名称"></el-table-column>
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
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="类别名称">
          <el-input v-model="add_form.name"></el-input>
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
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {StaffHelper} from "../../api/staff";

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
    // 获取表格数据
    const getData = () => {
      // fetchData(query).then((res) => {
      //   tableData.value = res.list;
      //   pageTotal.value = res.pageTotal || 50;
      // });
      StaffHelper.getTypes().then((info)=>{
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })
    };
    getData();

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
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {

            StaffHelper.deleteType(index).then(info=>{
              if(info.code===200){
                ElMessage.success("删除信息成功")
              }else{
                ElMessage.success("错误")
              }
            })
          })
          .catch(() => {});
    };

    const addInfo=()=>{
      var params=JSON.stringify({
        id: add_form.id,
        name: add_form.name,
      })
      StaffHelper.addType(params).then(info=>{
        if(info.code===200){
          ElMessage.success("添加信息成功")
          addVisible.value=false;
          getData()
        }else{
          ElMessage.success("错误")
        }
      })
    }
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      id:"",
      name: "",
    });

    let add_form = reactive({
      id:"",
      name: "",
    });

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
      })
      StaffHelper.updateType(params).then(info=>{
        if(info.code===200){
          ElMessage.success("修改信息成功")
          editVisible.value=false;
          getData()
        }else{
          ElMessage.success("错误")
        }
      })
    };

    //添加框的弹出
    const addVisible = ref(false);
    const handleAdd = (index,row)=>{
      addVisible.value = true;
    }
    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      addInfo,
      add_form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      handleAdd,
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
</style>
