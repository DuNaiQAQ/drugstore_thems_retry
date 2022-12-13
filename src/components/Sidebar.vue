<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
             text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index" >
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {computed, watch} from "vue";
import { ref, reactive } from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

export default {
  setup() {
    const items = [
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: " 系统首页",
        rule:"all",
      },
      {
        icon: "el-icon-lx-people",
        index: "1",
        title: " 员工信息管理",
        rule:"admin",
        subs: [
          {
            index: "/allstaff",
            title: "所有员工管理",
            rule:"admin",
          },
          {
            index: "/stafftype",
            title: "员工职称管理",
            rule:"admin",
          },
        ],
      },
      {
        icon: "el-icon-lx-goods",
        index: "2",
        title: " 药品管理",
        rule:"admin",
        subs: [
          {
            index: "/drugs",
            title: "药品信息管理",
            rule:"admin",
          },
          {
            index: "/drugtype",
            title: "药品类别管理",
            rule:"admin",
          },
        ],
      },
      {
        icon: "el-icon-lx-punch",
        index: "3",
        title: " 库存管理",
        rule:"admin",
        subs: [
          {
            index: "/purchase",
            title: "入库管理",
            rule:"admin",
          },
          {
            index: "/out",
            title: "出库管理",
            rule:"admin",
          }
        ],
      },
      {
        icon:"el-icon-lx-shop",
        index:"/factory",
        title:" 制造商管理",
        rule:"admin",
      },
      {
        icon:"el-icon-lx-cart",
        index:"6",
        title:" 收银管理",
        rule:"admin",
        subs: [
          {
            index: "/sell",
            title: "药品购买/搜素",
            rule:"all",
          },
          {
            index: "/allmoney",
            title:"所有收银信息及统计",
            rule:"admin",
          },
          {
            index: "/buy",
            title:"用户购买药品统计",
            rule:"all",
          },
        ],
      },
    ];


    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.collapse);


    return {
      items,
      onRoutes,
      collapse,
    };


  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
