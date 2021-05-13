<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
        <!-- <el-button v-if="btnAry.findIndex(x => x.id == '550')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '551')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button> -->
        <span class="filter-item">
            <span class="select-title">时间范围：</span>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
            end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </span>
        <!-- <el-input v-model="listQuery.keyword" placeholder="酒店名称/酒店名ID" style="width:250px" class="filter-item" /> -->
        <span class="filter-item">
          <span class="select-title">酒店：</span>
            <el-select  v-model="listQuery.hotel_id" filterable clearable  remote placeholder="请输入酒店名称/酒店ID"
              :remote-method="remoteMethod" :loading="loadingSearch" style="width:300px">
            <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </span>
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店名称" align="left">
        <template slot-scope="{row}">
          <span>{{row.hotel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算日期" align="center" >
        <template slot-scope="{row}">
          <span>{{row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="人数" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.nums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总积分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.total_score}}</span>
        </template>
      </el-table-column>
      <el-table-column label="返还积分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
       <el-table-column label="状态" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.status==0">未提现</span>
          <span v-if="row.status==1" >提现审核中</span>
          <span v-if="row.status==2" >已提现</span>
          <span v-if="row.status==3" style="color:red">未通过</span>
          <span v-if="row.status ==4">不可提现</span>
        </template>
      </el-table-column>
      <el-table-column v-if="btnAry.findIndex(x => x.id == '610')!=-1" label="操作" align="center" width="100" class-name="fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.score == 0">-</span>
          <el-button v-else type="primary" size="mini" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 订单详情 -->
    <overdue-detail ref="overdueDetailChild" />
  </div>
</template>

<script>
import { getOverdueOrderList} from '@/api/order/overdue-order'
import OverdueDetail from "./component/overdue-detail";
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,OverdueDetail },
  mixins: [mix],
  data() {
    return {
      listQuery:{
        hotel_id:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20,
      },
      total: 0,
      listLoading: false,
      list: [],
      exportAllloading:false,
      btnAry:[],
      dateRange:[],
      activeName:'0',
      orderStatusList:[
        {name:'未提现',value:'0'},
        {name:'提现中',value:'1'},
        {name:'已提现',value:'2'},
        {name:'未通过',value:'3'},
      ],
      loadingSearch:false,
      hotelList:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 609 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
        this.listLoading = true
        if(this.activeName == 'all'){
          this.listQuery.status = ''
        }else{
          this.listQuery.status = parseInt(this.activeName) 
        }
        if (this.dateRange == null || this.dateRange.length == 0) {
            this.listQuery.start_time = ''
            this.listQuery.end_time = ''
        } else {
            this.listQuery.start_time = this.dateRange[0] / 1000
            this.listQuery.end_time = this.dateRange[1] / 1000
        }
        getOverdueOrderList(this.listQuery).then(res => {
            this.list = res.data.data.data
            this.total = res.data.data.total
            this.listLoading = false
        })
    },
     //刷新
    refresh(){
      this.listQuery = {
        hotel_id:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20,
      }
      this.dateRange = []
      this.activeName = 'all'
      this.getList();
    },
     // 搜索酒店
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.hotelList = []
      } else {
        this.loadingSearch = true
        getHotelList({ keyword: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch = false
          this.hotelList = res.data.data.data
        })
      }
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    //点击tab
    handleClick(){
      this.listQuery.page = 1
      this.listQuery.size = 20
      this.getList();
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
    //查看订单详情
    handleDetail(row){
      this.$refs.overdueDetailChild.init(row)
    },
    //导出数据
    exportTable(flag){
      if (this.dateRange == null || this.dateRange.length == 0) {
          this.listQuery.start_time = ''
          this.listQuery.end_time = ''
      } else {
          this.listQuery.start_time = this.dateRange[0] / 1000
          this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if(this.activeName == 'all'){
        this.listQuery.status = ''
      }else{
        this.listQuery.status = parseInt(this.activeName) 
      }
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          start_time:this.listQuery.start_time,
          end_time:this.listQuery.end_time,
        }
      }else{
        params = this.listQuery
      }
      getOrderExportExcel(params).then(res=>{
        // console.log(res)
        this.exportAllloading = false
        if(res.code == 0){
          window.open(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
