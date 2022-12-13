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
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 药品购买
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索/添加购买药品信息</el-button>
      </div>
      <el-table :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="drug_name" label="药品名称"></el-table-column>
        <el-table-column prop="batch_id" label="批次编号"></el-table-column>
        <el-table-column prop="sold_num" label="购买数量"></el-table-column>
        <el-table-column prop="value" label="单价"></el-table-column>
        <el-table-column prop="sold_sum" label="药品总额"></el-table-column>
        <el-table-column prop="sold_user" label="购买用户"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="container">
        <div class="handle-box">
          <el-button type="primary" @click="showbuy"><i class="el-icon-lx-add"></i> 确认订单</el-button>
        </div>
        <div class="pagination">
          <el-pagination background layout="total, prev, pager, next"
                         :total="pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
      </div>

      <!-- 搜索框 -->
      <el-dialog title="搜索药品" v-model="searchVisible" width="80%">
        <div class="handle-box">
          <el-select v-model="query.type" placeholder="药品种类" class="handle-select mr10">
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
          <el-input v-model="query.name" placeholder="药品名称或者条码号" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="SearchInfo">搜索</el-button>
        </div>
        <el-table :data="search_tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column prop="id" label="批次ID"></el-table-column>
          <el-table-column prop="drug_name" label="药品名称"></el-table-column>
          <el-table-column prop="drug_id" label="药品ID"></el-table-column>
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
          <el-table-column prop="purchase_num" label="库存数量"></el-table-column>
          <el-table-column prop="value" label="药品单价"></el-table-column>
          <el-table-column prop="purchase_time" label="购买时间">
            <template #default="scope">
              {{dateFormat(scope.row,"purchase_time")}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleAdd(scope.$index,scope.row)">选择药品
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="searchVisible = false">取 消</el-button>
                    <el-button type="primary" @click="searchVisible = false">确 定</el-button>
                </span>
        </template>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog title="添加药品" v-model="addVisible" width="30%">
        <el-form label-width="70px">
          <el-form-item label="批次ID">
            <el-input v-model="add_form.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属药品">
            <el-select v-model="add_form.drug_id" disabled>
              <el-option
                  :key="add_form.drug_id"
                  :label="add_form.drugname"
                  :value="add_form.drug_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="add_form.purchase_num" disabled></el-input>
          </el-form-item>
          <el-form-item label="购买数量">
            <el-input v-model="add_form.sold_num"></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="add_form.value" disabled></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addInfo">确 定</el-button>
                </span>
        </template>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog title="添加药品" v-model="buyvisiable" width="30%">
        <picture>
          <img src="src/assets/img/qrcode.png">
        </picture>
        <h2>总价为:<strong>{{total_money}}</strong>元，请扫描二维码进行付款</h2>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="buyvisiable = false">取 消</el-button>
                    <el-button type="primary" @click="buy">已付款</el-button>
                </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox, } from "element-plus"
import {DrugHelper} from "../../api/drug"
import {BillHelper} from "../../api/bill";
import {useStore} from "vuex";
import { useRouter } from "vue-router";
import {UserHelper} from "../../api/user";

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
    const buyvisiable=ref(false);

    const showbuy=()=>{
      buyvisiable.value=true;
    }

    const getData = () => {
      BillHelper.getItems_user().then(info=>{
        if(info.code===200){
          tableData.value=info.res.items
          pageTotal.value=info.res.itemNums
          total_money.value=info.res.value_sum
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

    const SearchInfo = () => {
      var params=JSON.stringify({
        type:query.type,
        name:query.name
      })
      DrugHelper.search_info(params).then(info=>{
        if(info.code===200){
          ElMessage.success("搜索成功")
          search_tableData.value=info.res.items
        }else {
          ElMessage.error(info.message)
        }
      })
    };

    //选项
    // 查询操作
    const handleSearch = () => {
      searchVisible.value=true;
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
    };

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            Object.keys(add_form).forEach((item) => {
              add_form[item] = row[item];
            });
            var params=JSON.stringify({
              id:add_form.id,
              drug_id:add_form.drug_id,
              batch_id:add_form.batch_id,
              sold_num:add_form.sold_num,
              sold_sum:add_form.sold_num*add_form.value,
              sold_time:add_form.sold_time,
              sold_user:add_form.sold_user,
              drug_name:add_form.drug_name,
              value:add_form.value,
            })
            BillHelper.delitem_user(params).then((info)=>{
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

    const buy = () => {
            BillHelper.setSell_user().then((info)=>{
              if(info.code===200){
                ElMessage.success("付款成功！");
                buyvisiable.value=false;
                getData();
              }else{
                ElMessage.error("服务器错误"+info.message);
              }
            })
    }

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
      drug_name:"",
      sold_user:"",
      value:"",
      purchase_num:"",
    });

    const addInfo = () => {
      //请求添加，若添加成功则关闭，提示
      var params=JSON.stringify({
        batch_id:add_form.id,
        drug_id:add_form.drug_id,
        sold_num:add_form.sold_num,
        sold_sum:add_form.sold_num*add_form.value,
        sold_time:add_form.sold_time,
        value:add_form.value,
        drug_name:add_form.drug_name,
        sold_user:"",
      })
      if(add_form.purchase_num<add_form.sold_num){
        ElMessage.error("购买数量大于库存数量!");
      }else {
        BillHelper.addItem_user(params).then((info) => {
          //以下是响应部分
          if (info.code === 200) {
            ElMessage.success("添加信息成功");
            addVisible.value = false;
            getData()
          } else {
            ElMessage.error("添加信息失败");
          }
        })
      }
    };



    let idx = -1;
    const handleAdd = (index, row) => {
      idx = index;
      Object.keys(add_form).forEach((item) => {
        add_form[item] = row[item];
      });
      addVisible.value = true;
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
      editVisible,
      form,
      addVisible,
      add_form,
      options,
      searchVisible,
      search_tableData,
      total_money,
      showbuy,
      buyvisiable,
      SearchInfo,
      buy,
      dateFormat,
      addInfo,
      handleAdd,
      handleSearch,
      handlePageChange,
      handleDelete,
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
