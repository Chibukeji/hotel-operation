<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="80%" class="center-dialog" append-to-body>
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员昵称" align="left" width="180" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                      <div style="display:flex"> 
                          <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                          <img v-else :src="row.member_head_pic" class="heder-img">
                          <span class="member-name">{{row.member_nickname}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column label="会员真实姓名" align="center">
                    <template slot-scope="{row}">
                    <span v-if="row.member_real_name == '' || row.member_real_name ==null">-</span>
                    <span v-else>{{ row.member_real_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" align="center">
                    <template slot-scope="{row}">
                    <span v-if="row.member_phone == '' || row.member_phone ==null">-</span>
                    <span v-else>{{ row.member_phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="代理等级" align="center" width="150">
                    <template slot-scope="{row}">
                    <span v-if="row.level == 6">省代理</span>
                    <span v-if="row.level == 7">市代理</span>
                    <span v-if="row.level == 8">区/县代理</span>
                    </template>
                </el-table-column>
                <el-table-column label="代理区域" align="center" >
                    <template slot-scope="{row}">
                    <span>{{ row.area_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="佣金比例" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.rate }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
    </el-dialog>
  </div>
</template>

<script>
import {getAgentChild} from '@/api/agent-manage/agent-list'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      dialogTitle: "",
      detailDialogVisible: false,
      detailItem:'',
      listQuery:{
        id:'',
        page: 1,
        size: 10,
      },
      total: 0,
      list: [],
      listLoading:false,
    };
  },
  mounted() {},
  methods: {
    init(item) {
        this.detailDialogVisible = true
        this.detailItem = item
        this.dialogTitle = `${item.area_name}-区/县代理`
        this.listQuery.page = 1
        this.getList()
    },
    //获取订单信息
    getList(){
      this.listLoading = true
      this.listQuery.id = this.detailItem.id
      getAgentChild(this.listQuery).then(res=>{
        this.list = res.data.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
     // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
  },
};
</script>

<style lang="scss" scoped>
.heder-img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.member-name{
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
}
</style>