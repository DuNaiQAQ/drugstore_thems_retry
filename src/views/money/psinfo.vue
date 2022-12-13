<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户购买信息查看
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="bar" :options="options2" ></schart>
        </el-card>
      </el-col>
    </el-row>
    <div class="container">
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="bill_type" label="操作类型">
          <template #default="scope">
            {{showType(scope.row.bill_type)}}
          </template>
        </el-table-column>
        <el-table-column prop="bill_info" label="事件"></el-table-column>
        <el-table-column prop="bill_time" label="时间">
          <template #default="scope">
            {{dateFormat(scope.row,"bill_time")}}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="操作金额"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox, } from "element-plus"
import {DrugHelper} from "../../api/drug"
import {BillHelper} from "../../api/bill";
import Schart from "vue-schart";

export default {
  components:{Schart},
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
    const options = reactive({
      type: "line",
      title: {
        text: "最近1-5天销售额统计",
      },
      labels:[] ,
      datasets: [
        {
          label:"售出",
          data:[],
        },
        {
          label:"买入",
          data:[],
        },
      ],
    },)

    const options2 = reactive({
      type: "line",
      title: {
        text: "最近1-5个月销售额统计",
      },
      labels: [],
      datasets: [
        {
          label:"售出",
          data:[],
        },
        {
          label:"买入",
          data:[],
        },
      ],
    },
    )

    const search_tableData = ref([]);

    const getData = () => {
      BillHelper.getBillInfo().then(info=>{
        if(info.code===200){
          tableData.value=info.res.items
          pageTotal.value=info.res.itemNums
        }
      })

      BillHelper.get_five_days().then(info=>{
        if(info.code===200){
          options.labels=info.res.label
          options.datasets[0].data=info.res.values
          options.datasets[1].data=info.res.out_values
        }
      })

      BillHelper.get_five_month().then(info=>{
        if(info.code===200){
          options2.labels=info.res.label
          options2.datasets[0].data=info.res.values
          options2.datasets[1].data=info.res.out_values
        }
      })
      // console.log(options)
      // console.log(options2)
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



    let idx = -1;
    const handleAdd = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      searchVisible.value = true;
    };

    const showType = (type) =>{
      if(type===1){
        return"药品购入"
      }else{
        return"药品售出"
      }
    }

    const dateFormat = (row, column) => {
      let dates = row[column];
      var date = new Date(parseInt(dates)-21600000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
      options,
      options2,
      searchVisible,
      search_tableData,
      showType,
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

.schart {
  width: 100%;
  height: 300px;
}
</style>
