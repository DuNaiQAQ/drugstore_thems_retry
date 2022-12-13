<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 日志查看
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="operation_type" label="操作类型"></el-table-column>
        <el-table-column prop="things" label="事件"></el-table-column>
        <el-table-column prop="time" label="时间">
          <template #default="scope">
            {{dateFormat(scope.row,"time")}}
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="操作用户ID"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total,prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import {DrugHelper} from "../../api/drug"
import {LogHelper} from "../../api/log";

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

    const getData = () => {
      LogHelper.getLog().then(info=>{
        if(info.code===200){
          tableData.value=info.res.items
          pageTotal.value=info.res.itemNums || 50
        }
      })
    };
    getData();


    //选项
    // 查询操作
    const handleSearch = () => {
      searchVisible.value=true;
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const searchVisible = ref(false);
    let form = reactive({
      id:"",
      drug_id:"",
      batch_id:"",
      sold_num:"",
      sold_sum:"",
      sold_time:"",
      sold_user:"",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      id:"",
      drug_id:"",
      batch_id:"",
      sold_num:"",
      sold_time:"",
      drugname:"",
      value:"",
    });



    let idx = -1;
    const handleAdd = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      searchVisible.value = true;
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
      searchVisible,
      search_tableData,
      dateFormat,
      handleAdd,
      handleSearch,
      handlePageChange,
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
