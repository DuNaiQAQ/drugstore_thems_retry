<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>药品分类
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加药品分类</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="类别名称"></el-table-column>
        <el-table-column label="parent" width="180" align="center">
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
        <el-form-item label="父类别">
          <el-select v-model="form.parent_id" class="m-2">
            <el-option>
              <el-option
                  v-for="items in options"
                  :key="items.id"
                  :label="items.name"
                  :value="items.id"
              >

              </el-option>
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

    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="类别名称">
          <el-input v-model="add_form.name"></el-input>
        </el-form-item>
        <el-form-item label="父类别">
          <el-select v-model="add_form.parent_id" class="m-2">
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
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {DrugHelper} from "../../api/drug";

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
      DrugHelper.get_category().then((info)=>{
        if(info.code===200){
          tableData.value=info.res.items;
          options.value=info.res.items;
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
            DrugHelper.del_category(index).then((info)=>{
              if(info.code===200){
                ElMessage.success("删除成功");
                getData();
              }
            })
          })
          .catch((info) => {
            ElMessage.success("删除失败"+info.message);
          })
          .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const addVisible = ref(false);
    let add_form = reactive({
      id:"",
      name:"",
      parent_id:"",
      parent_name:"",
    });

    let form = reactive({
      id:"",
      name:"",
      parent_id:"",
      parent_name:"",
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
        id:form.id,
        name:form.name,
        parent_id:form.parent_id,
        parent_name:form.parent_name,
      })
      DrugHelper.update_category(params).then((info)=>{
        if(info.code===200){
          editVisible.value = false;
          ElMessage.success("修改信息成功!");
          getData();
        }else{
          ElMessage.error("修改信息失败!");
          console.log(info.message);
        }
      });
    };

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        id:add_form.id,
        name:add_form.name,
        parent_id:add_form.parent_id,
        parent_name:add_form.parent_name,
      })
      DrugHelper.add_category(params).then((info)=>{
        //以下是响应部分
        if(info.code===200){
          ElMessage.success("添加信息成功");
          addVisible.value=false;
          getData();
        }else {
          ElMessage.error("添加信息失败");
        }
      })
    };

    const handleAdd = ()=>{
      addVisible.value = true;
    }
    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      add_form,
      options,
      addInfo,
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
