<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">会员：</span>
        <el-select  v-model="listQuery.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
          :remote-method="remoteMethod" :loading="loadingSearch" style="width:250px">
          <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
            <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
            <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
          </el-option>
        </el-select>
      </span>
      <span class="filter-item">
        <span class="select-title">时间范围：</span>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
        end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <aside>
        <span>合计佣金：</span>
        <span class="color-text" >{{totalMoney.moneys}}</span>
        <span>元</span>
    </aside>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" >
      <el-table-column label="订单号" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员" align="left"   :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.member_name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="佣金" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.moneys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分佣级别" align="center" >
        <template slot-scope="{row}">
        <span>{{ row.rate_name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="时间" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
  </div>
</template>

<script>
import { getCommissionsLogList} from '@/api/commissions-detail/commissions-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        member_id: '',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      btnAry:[],
      loadingSearch:false,
      memberList:[],
      dateRange:[],
      totalMoney:{
          moneys:0,
      }
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
     if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      this.listLoading = true
      getCommissionsLogList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.totalMoney = res.data.totalData
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        member_id: '',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20
      }
      this.dateRange = []
      this.getList();
    },
    // 搜索会员
    remoteMethod(query) {
      if (query !== '') {
        this.loadingSearch = true
        getSearchMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
          this.loadingSearch = false
          this.memberList = res.data.data
        })
      } else {
        this.memberList = []
      }
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
    //搜索
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
  }
}
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
.color-text{
  color: red;
  margin-right: 5px;
}
</style>
