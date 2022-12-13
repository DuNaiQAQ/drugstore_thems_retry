<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 药品进货/库存信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加信息</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="批次ID"></el-table-column>
        <el-table-column prop="drug_name" label="药品名称"></el-table-column>
        <el-table-column prop="product_fac_name" label="制造商名称"></el-table-column>
        <el-table-column prop="produce_time" label="生产时间">
          <template #default="scope">
            {{dateFormat(scope.row,"produce_time")}}
          </template>
        </el-table-column>
        <el-table-column prop="validity" label="保质期">
          <template #default="scope">
            {{dateFormat(scope.row,"validity")}}
          </template>
        </el-table-column>
        <el-table-column prop="purchase_num" label="现库存数"></el-table-column>
        <el-table-column prop="purchase_value" label="进货单价"></el-table-column>
        <el-table-column prop="purchase_value_sum" label="进货总价"></el-table-column>
        <el-table-column prop="purchase_time" label="购买时间">
          <template #default="scope">
            {{dateFormat(scope.row,"purchase_time")}}
          </template>
        </el-table-column>
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
        <el-form-item label="批次ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属药品">
          <el-select v-model="form.drug_id">
            <el-option
                v-for="items in options2"
                :key="items.id"
                :label="items.name"
                :value="items.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制造商">
          <el-select v-model="form.product_fac_id">
            <el-option
                v-for="items in options"
                :key="items.id"
                :label="items.name"
                :value="items.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产时间">
          <el-date-picker v-model="form.produce_time"></el-date-picker>
        </el-form-item>
        <el-form-item label="保质期">
          <el-date-picker  v-model="form.validity"></el-date-picker>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="form.purchase_num" disabled></el-input>
        </el-form-item>
        <el-form-item label="入库单价">
          <el-input v-model="form.purchase_value"></el-input>
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker type="datetime" v-model="form.purchase_time"></el-date-picker>
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
    <el-dialog title="添加信息" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="批次ID">
          <el-input v-model="add_form.id"></el-input>
        </el-form-item>
        <el-form-item label="所属药品">
          <el-select v-model="add_form.drug_id">
            <el-option
                v-for="items in options2"
                :key="items.id"
                :label="items.name"
                :value="items.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制造商">
          <el-select v-model="add_form.product_fac_id">
            <el-option
                v-for="items in options"
                :key="items.id"
                :label="items.name"
                :value="items.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产时间">
          <el-date-picker  v-model="add_form.produce_time"></el-date-picker>
        </el-form-item>
        <el-form-item label="保质期">
          <el-date-picker  v-model="add_form.validity"></el-date-picker>
        </el-form-item>
        <el-form-item label="入库数量">
          <el-input v-model="add_form.purchase_num"></el-input>
        </el-form-item>
        <el-form-item label="入库单价">
          <el-input v-model="add_form.purchase_value"></el-input>
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker type="datetime" v-model="add_form.purchase_time"></el-date-picker>
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
import {StoreHouseHelper} from "../../api/storehouse"
import {DrugHelper} from "../../api/drug";
import {FactoryHelper} from "../../api/factory";

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
    const options2= ref([]);
    // 获取表格数据
    const getData = () => {
      StoreHouseHelper.get_pur().then(info => {
        if(info.code===200){
          tableData.value=info.res.items;
          pageTotal.value=info.res.itemNums;
        }else {
          ElMessage.error(info.message)
        }
      })

      FactoryHelper.getfacinfo().then(info=>{
        if(info.code===200){
          options.value=info.res.items;
        }else {
          ElMessage.error(info.message)
        }
      })

      DrugHelper.get_druginfo().then(info=>{
        if(info.code===200){
          options2.value=info.res.items;
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
            StoreHouseHelper.pur_del(index).then((info)=>{
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
      drug_id: "",
      product_fac_id:"",
      produce_time:"",
      validity:"",
      purchase_num:"",
      purchase_value:"",
      purchase_value_sum:"",
      purchase_time:"",
    });

    // 添加表格
    const addVisible = ref(false);
    let add_form = reactive({
      id: "",
      drug_id: "",
      product_fac_id:"",
      produce_time:"",
      validity:"",
      purchase_num:"",
      purchase_value:"",
      purchase_value_sum:"",
      purchase_time:"",
    });

    const handleAdd = () => {
      addVisible.value=true;
    }

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        id:add_form.id,
        drug_id:add_form.drug_id,
        product_fac_id:add_form.product_fac_id,
        produce_time:add_form.produce_time,
        validity:add_form.validity,
        purchase_num:add_form.purchase_num,
        purchase_value:add_form.purchase_value,
        purchase_value_sum:add_form.purchase_value_sum,
        purchase_time:add_form.purchase_time,
      })
      StoreHouseHelper.pur_add(params).then((info)=>{
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
        drug_id:form.drug_id,
        product_fac_id:form.product_fac_id,
        produce_time:form.produce_time,
        validity:form.validity,
        purchase_num:form.purchase_num,
        purchase_value:form.purchase_value,
        purchase_value_sum:form.purchase_value_sum,
        purchase_time:form.purchase_time,
      })
      StoreHouseHelper.pur_change(params).then((info)=>{
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
      options2,
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