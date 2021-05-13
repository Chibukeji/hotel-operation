<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员信息" name="first">
          <div class="user-info">
            <div class="left-box">
              <img v-if="detailItem.head_pic == '' || detailItem.head_pic == null" src="@/assets/images/default_author_head.png" class="user-header-img">
              <img v-else :src="detailItem.head_pic" class="user-header-img" :class="{'img-no-border':detailItem.head_pic ==null}" />
              <div class="user-name" style="margin-top: 10px;">
                {{ detailItem.nickname }} ({{ detailItem.id }})
              </div>
              <div class="member-grade">
                <span class="text-title">会员等级</span>
                <span class="btn-grade">
                    <!-- <span v-if="detailItem.vip_level == 0" >初始会员</span> -->
                    <span >{{detailItem.member_level_name}}</span>
                </span>
              </div>
            </div>
            <div class="center-box">
              <div class="member-grade">
                <span class="text-title">
                  余额：
                  <span class="book-coin">{{ detailItem.money }}</span>
                </span>
              </div>
              <div class="member-grade">
                <span class="text-title">
                  分时积分：
                  <span class="book-coin">{{ detailItem.time_score }}</span>
                </span>
              </div>
              <div class="member-grade">
                <span class="text-title">
                  专属积分：
                  <span class="book-coin">{{ detailItem.exclusive_score }}</span>
                </span>
              </div>
              <div class="member-grade">
                <span class="text-title">
                  商城金币：
                  <span class="book-coin">{{ detailItem.gold }}</span>
                </span>
              </div>
            </div>
            <div class="right-box">
              <div class="wrap-box">
                <span class="text-title">性别：</span>
                <span class="content-text" v-if="detailItem.sex == 1">男</span>
                <span class="content-text" v-else-if="detailItem.sex == 2">女</span>
                <span class="content-text" v-else-if="detailItem.sex == 0">保密</span>
              </div>
              <div class="wrap-box">
                <span class="text-title">会员来源：</span>
                <span class="content-text" v-if="detailItem.source == 0" >公众号</span>
                <span class="content-text" v-if="detailItem.source == 1" >安卓</span>
                <span class="content-text" v-if="detailItem.source == 2" >ios</span>
                <span class="content-text" v-if="detailItem.source == 3" >美团</span>
              </div>
              <div class="wrap-box">
                <span class="text-title">推荐人：</span>
                <img :src="detailItem.phead_pic" class="heder-img">
                <span class="content-text">{{ detailItem.pname }}</span>
              </div>
              <div class="wrap-box">
                <span class="text-title">注册时间：</span>
                <span class="content-text">{{ detailItem.create_time }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单详情" name="second">
            <div class="filter-container">
                <span class="filter-item">
                    <el-select v-model="listQuery.status" placeholder="订单状态" style="width: 160px">
                      <el-option label="全部" value="" />
                    <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :value="item.value" />
                    </el-select>
                </span>
                <span class="filter-item">
                    <el-select v-model="listQuery.source" placeholder="订单来源" style="width: 160px">
                      <el-option label="全部" value="" />
                    <el-option v-for="(item,index) in sourceList" :key="index" :label="item.name" :value="item.value" />
                    </el-select>
                </span>
                <span class="filter-item">
                    <el-select v-model="listQuery.pay_way" placeholder="付款方式" style="width: 160px">
                      <el-option label="全部" value="" />
                    <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.name" :value="item.value" />
                    </el-select>
                </span>
                <span class="filter-item">
                    <span class="select-title">时间范围：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-input v-model="listQuery.keyword" placeholder="输入订单号查询" style="width:300px" class="filter-item" />
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="订单号" align="center" width="200">
                    <template slot-scope="{row}">
                    <span>{{ row.order_sn }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="酒店房型" align="left">
                    <template slot-scope="{row}">
                    <span>{{ row.order_title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系人" align="center" width="170">
                    <template slot-scope="{row}">
                    <span>{{ row.link_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" align="center" width="150">
                    <template slot-scope="{row}">
                    <span>{{ row.link_phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="下单日期" align="center" width="150">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用日期" align="center" width="150">
                    <template slot-scope="{row}">
                    <span>{{ row.use_start_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总价" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.total_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" align="center" width="120">
                <template slot-scope="{row}">
                  <span v-if="row.status == 0" >待处理</span>
                  <span v-if="row.status == 1" >待付款</span>
                  <span v-if="row.status == 2" >待酒店接受</span>
                  <span v-if="row.status == 3" >订单取消</span>
                  <span v-if="row.status == 4" >已退款</span>
                  <span v-if="row.status == 5" >已接受待入住</span>
                  <span v-if="row.status == 6" >已入住</span>
                  <span v-if="row.status == 7" >交易完成</span>
                  <span v-if="row.status == 8" >退款申请</span>
                  </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-tab-pane>
         <el-tab-pane label="佣金明细" name="third">
            <div class="filter-container">
                <span class="filter-item">
                    <span class="select-title">时间范围：</span>
                    <el-date-picker v-model="dateRange2" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter2">搜索</el-button>
            </div>
            <aside>
              <span>合计佣金：</span>
              <span class="color-text">{{totalMoney.moneys}}</span>
              <span>元</span>
            </aside>
            <el-table :data="list2" v-loading="listLoading2" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="订单号" align="left" >
                  <template slot-scope="{row}">
                    <span>{{ row.order_sn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="会员" align="left"   :show-overflow-tooltip="true">
                  <template slot-scope="{row}">
                    <div style="display:flex">
                      <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
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
            <pagination :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.size" :autoScroll='false' @pagination="paginHandle2" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getMemberOrderList } from '@/api/member-manage/member-list'
import { getCommissionsLogList} from '@/api/commissions-detail/commissions-list'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      dialogTitle: "",
      detailDialogVisible: false,
      activeName: "first",
      detailItem:'',
      dateRange:[],
      listQuery:{
        keyword:'',
        status:null,
        source:null,
        pay_way:null,
        start_time:'',
        end_time:'',
        member_id:'',
        page: 1,
        size: 10,
      },
      total: 0,
      list: [],
      listLoading:false,
      orderStatusList:[
        {name:'待处理',value:0},
        {name:'待付款',value:1},
        {name:'待酒店接受',value:2},
        {name:'订单取消',value:3},
        {name:'已退款',value:4},
        {name:'已接受待入住',value:5},
        {name:'已入住',value:6},
        {name:'交易完成',value:7},
        {name:'退款申请',value:8}
      ],
      sourceList:[
        {name:'公众号',value:0},
        {name:'安卓',value:1},
        {name:'ios',value:2},
      ],
      payTypeList:[
        {name:'微信',value:1},
        {name:'支付宝',value:2},
        {name:'余额',value:3},
        {name:'现金',value:4},
      ],
      listQuery2:{
        start_time:'',
        end_time:'',
        member_id:'',
        page: 1,
        size: 10,
      },
      dateRange2:[],
      total2: 0,
      list2: [],
      listLoading2:false,
      totalMoney:{
          moneys:0,
      },
    };
  },
  mounted() {},
  methods: {
    init(item,flag) {
        this.detailDialogVisible = true
        this.activeName = flag
        this.detailItem = item
        this.dialogTitle = `查看[${item.nickname}]信息`
        this.listQuery.page = 1
        this.listQuery2.page = 1
        this.handleClick()
    },
    handleClick(){
      if(this.activeName == "second"){
        this.memberOrderList()
      }else if(this.activeName == "third"){
        this.memberCommissionList()
      }
    },
    //获取订单信息
    memberOrderList(){
      this.listLoading = true
      this.listQuery.member_id = this.detailItem.id
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      getMemberOrderList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
     // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.memberOrderList()
    },
    handleFilter2(){
      this.listQuery2.page = 1
      this.memberCommissionList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.memberOrderList()
    },
    //获取佣金明细
    memberCommissionList(){
      this.listLoading2 = true
      this.listQuery2.member_id = this.detailItem.id
      if (this.dateRange2 == null || this.dateRange2.length == 0) {
        this.listQuery2.start_time = ''
        this.listQuery2.end_time = ''
      } else {
        this.listQuery2.start_time = this.dateRange2[0] / 1000
        this.listQuery2.end_time = this.dateRange2[1] / 1000
      }
      getCommissionsLogList(this.listQuery2).then(res=>{
        this.list2 = res.data.data.data
        this.total2 = res.data.data.total
        this.totalMoney = res.data.totalData
        this.listLoading2 = false
      })
    },
    // 点击翻页
    paginHandle2(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery2.page = parseInt(json.page)
        this.listQuery2.size = parseInt(json.limit)
      }
      this.memberCommissionList()
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  margin-top: -15px;
  .left-box,
  .right-box,
  .center-box {
    width: 30%;
    text-align: center;
    .user-header-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    .img-no-border{
        border-radius:0;
    }
    .user-name {
      font-size: 14px;
      margin-top: 20px;
    }
    .member-grade {
      margin-top: 20px;
      .btn-grade {
        display: inline-block;
        background-color: #1ab394;
        color: #fff;
        font-size: 10px;
        font-weight: 500;
        padding: 3px 8px;
        text-shadow: none;
        border-radius: 2px;
      }
      .book-coin {
        background-color: #f9f2f4;
        border-radius: 4px;
        color: #ca4440;
        font-size: 14px;
        padding: 2px 4px;
        white-space: nowrap;
      }
    }
    .text-title {
      padding-left: 10px;
      display: inline-block;
    }
    .wrap-box {
      margin-top: 20px;
    }
  }
  .right-box {
    text-align: left;
    .source-btn {
      color: #337ab7;
      cursor: pointer;
    }
  }
  .header-img-pop {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
  }
}
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
}
</style>