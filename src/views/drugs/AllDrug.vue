<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> GSP退货
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加信息</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="药品ID" align="center"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="category_name" label="药品类别"></el-table-column>
        <el-table-column prop="stock_num" label="存储数量"></el-table-column>
        <el-table-column prop="position" label="存储位置"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column prop="tips" label="注意事项"></el-table-column>
        <el-table-column prop="value" label="单价"></el-table-column>
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
        <el-form-item label="药品ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="药品类别">
          <el-select v-model="form.category_id">
            <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label"
            >
              <el-option
                  v-for="item in group.option"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="form.stock_num" disabled></el-input>
        </el-form-item>
        <el-form-item label="存放位置">
          <el-input v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.specification"></el-input>
        </el-form-item>
        <el-form-item label="注意事项">
          <el-input v-model="form.tips"></el-input>
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
        <el-form-item label="药品名称">
          <el-input v-model="add_form.name"></el-input>
        </el-form-item>
        <el-form-item label="药品类别">
          <el-select v-model="add_form.category_id">
            <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label"
            >
              <el-option
                  v-for="item in group.option"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="add_form.stock_num"></el-input>
        </el-form-item>
        <el-form-item label="存放位置">
          <el-input v-model="add_form.position"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="add_form.value"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="add_form.unit"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="add_form.specification"></el-input>
        </el-form-item>
        <el-form-item label="注意事项">
          <el-input v-model="add_form.tips"></el-input>
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
import {DrugHelper} from "../../api/drug"

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
      DrugHelper.get_druginfo().then(info => {
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })

      DrugHelper.get_category_form().then(info => {
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
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            DrugHelper.del_druginfo(index).then((info)=>{
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
      name:"",
      category_id:"",
      stock_num:"",
      position:"",
      category_name:"",
      unit:"",
      specification:"",
      tips:"",
      value:"",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      id: "",
      name:"",
      category_id:"",
      category_name:"",
      stock_num:"",
      position:"",
      unit:"",
      specification:"",
      tips:"",
      value:"",
    });

    const handleAdd = () => {
      addVisible.value=true;
    }

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        id:add_form.id,
        name:add_form.name,
        category_id:add_form.category_id,
        stock_num:add_form.stock_num,
        position:add_form.position,
        unit:add_form.unit,
        specification:add_form.specification,
        tips:add_form.tips,
        value:add_form.value,
      })
      DrugHelper.add_druginfo(params).then((info)=>{
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
        category_id:form.category_id,
        stock_num:form.stock_num,
        position:form.position,
        unit:form.unit,
        specification:form.specification,
        tips:form.tips,
        value:form.value,
      })
      DrugHelper.update_druginfo(params).then((info)=>{
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
      options,
      dateFormat,
      addInfo,
      handleAdd,
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
