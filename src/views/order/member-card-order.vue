<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
    <div class="filter-container" style="margin:5px 0px">
      <div class="right-font">
          <span  style="margin-right:10px">订单总价：<span class="top-num">￥{{totalData.total_order_money}}</span>元</span>
          <span  style="margin-right:10px">实付金额：<span class="top-num">￥{{totalData.total_pay_money}}</span>元</span>
          <span  style="margin-right:10px">订单数：<span class="top-num">{{totalData.order_nums}}</span>个</span>
      </div>
    </div>
    <div class="filter-container">
        <!-- <el-button v-if="btnAry.findIndex(x => x.id == '550')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '551')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button> -->
        <span class="filter-item">
            <span class="select-title">时间范围：</span>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
            end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </span>
        <span class="filter-item">
          <span class="select-title">付款方式：</span>
            <el-select  v-model="listQuery.pay_way" filterable clearable  placeholder="请选择付款方式" style="width:150px">
            <el-option v-for="item in payWayList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>
        </span>
        <span class="filter-item">
          <span class="select-title">会员卡等级：</span>
            <el-select  v-model="listQuery.vip_level_id" filterable clearable  placeholder="请选择" style="width:150px">
            <el-option label="全部" value="" ></el-option>
            <el-option v-for="item in memberLevelList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>
        </span>
        <span class="filter-item" style="margin-right:10px">
          <span class="select-title">会员：</span>
            <el-select  v-model="listQuery.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
              <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
              <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </span>
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="订单号" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员" align="left"  width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.member_nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员卡等级" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.member_level_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际付款价格" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pay_total_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总价" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.pay_time == '' || row.pay_time == null">-</span>
          <span>{{ row.pay_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" >
        <template slot-scope="{row}">
            <span v-if="row.source=='wechat'" >公众号</span>
            <span v-if="row.source=='android'" >安卓</span>
            <span v-if="row.source=='ios'" >IOS</span>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" align="center" >
        <template slot-scope="{row}">
          <div v-if="row.pay_way == '' || row.pay_way == null">-</div>
          <div v-else>
            <span v-if="row.pay_way==1" >微信</span>
            <span v-if="row.pay_way==2" >支付宝</span>
            <span v-if="row.pay_way==3" >余额</span>
            <span v-if="row.pay_way ==4">现金</span>
            <span v-if="row.pay_way==5">银联</span>
            <span v-if="row.pay_way == 8">微信汇聚</span>
            <span v-if="row.pay_way == 9">支付宝汇聚</span>
          </div>
        </template>
      </el-table-column>
       <el-table-column label="状态" align="center" >
        <template slot-scope="{row}">
          <span v-if="row.status==0">待付款</span>
          <span v-if="row.status==1" >已付款</span>
          <span v-if="row.status==2" >已取消</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="btnAry.findIndex(x => x.id == '610')!=-1" label="操作" align="center" width="100" class-name="fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.score == 0">-</span>
          <el-button v-else type="primary" size="mini" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
  </div>
</template>

<script>
import { getMemberCardOrderList,getMemberLevel} from '@/api/order/order-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination, },
  mixins: [mix],
  data() {
    return {
      listQuery:{
        member_id:'',
        pay_way:'',
        vip_level_id:'',
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
      activeName:'all',
      orderStatusList:[
        {name:'待付款',value:'0'},
        {name:'已付款',value:'1'},
        {name:'已取消',value:'2'},
      ],
      loadingSearch:false,
      memberList:[],
      payWayList:[
          {name:'全部',id:''},
          {name:'微信',id:1},
          {name:'支付宝',id:2},
          {name:'余额',id:3},
          {name:'现金',id:4},
          {name:'银联',id:5}
      ],
      totalData:{
        order_nums: 0,//订单数
        total_pay_money: 0,//实付金额
        total_order_money: 0//订单总价
      },
      memberLevelList:[],
    }
  },
  mounted () {
    this.getMemberLevelList()
    this.getList();
    // this.$store.dispatch('user/showBtn', { id: 609 }).then(res => {
    //   // console.log('res', res)
    //   this.btnAry = res.children
    // })
  },
  methods: {
    //获取会员卡等级
    getMemberLevelList(){
      getMemberLevel().then(res=>{
        this.memberLevelList = res.data
      })
    },
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
        getMemberCardOrderList(this.listQuery).then(res => {
            this.list = res.data.data.data
            this.total = res.data.data.total
            this.totalData = res.data.totalData
            this.listLoading = false
        })
    },
    //刷新
    refresh(){
      this.listQuery = {
        member_id:'',
        pay_way:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20,
      }
      this.dateRange = []
      this.activeName = 'all'
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
.filter-container{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        margin-left: 10px;
        margin-right: 30px;
        .top-num{
          color:red;
          margin-right: 2px;
        }
    }
}
</style>
