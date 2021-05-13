<template>
  <div>
    <div class="filter-container" style="margin:5px 0px">
        <div class="right-font">
            <span  style="margin-right:10px">今日：<span class="top-num">￥{{dayJson.today_total}}</span>元</span>
            <span  style="margin-right:10px">昨日：<span class="top-num">￥{{dayJson.yesterday_total}}</span>元</span>
            <span  style="margin-right:10px">本周：<span class="top-num">￥{{dayJson.week_total}}</span>元</span>
            <span  style="margin-right:10px">本月：<span class="top-num">￥{{dayJson.month_total}}</span>元</span>
            <span>总销售额：<span class="top-num">￥{{dayJson.total_amonut}}</span>元</span>
        </div>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
    <div class="filter-container" style="margin:5px 0px">
        <div class="right-font">
            <span  style="margin-right:10px">订单：<span class="top-num">{{totalData.order_nums}}</span>个</span>
            <span  style="margin-right:10px">金额：<span class="top-num">￥{{totalData.total_order_money}}</span>元</span>
            <span  style="margin-right:10px">实收金额/积分：<span class="top-num">￥{{totalData.total_pay_money}}</span>元</span>
        </div>
        <div>
            <el-button  type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button v-if="btnAry.findIndex(x => x.id == '550')!=-1" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
            <el-button v-if="btnAry.findIndex(x => x.id == '551')!=-1"  type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
        </div>
    </div>
    <div class="filter-container">
      <div>
        <!-- <span class="filter-item">
            <el-select v-model="listQuery.status" placeholder="订单状态" style="width: 160px">
                <el-option label="全部" value="" />
                <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.name" :value="item.value" />
            </el-select>
        </span> -->
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
          <el-select  v-model="listQuery.hotel_id" filterable clearable remote placeholder="请输入酒店名称/酒店编号搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" style="width:250px">
            <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </span>
        <span class="filter-item">
            <el-cascader v-model="placeOrigin" :options="siteOptions"  :props="belongRegoinProps"
            clearable placeholder="所属城市" ></el-cascader>
        </span>
        <span class="filter-item">
            <span class="select-title">时间范围：</span>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
            end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </span>
        <el-input v-model="listQuery.keyword" placeholder="订单号/产品名称/联系人" style="width:250px" class="filter-item" />
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="订单号" fixed align="center" width="180">
        <template slot-scope="{row}">
          <span v-if="btnAry.findIndex(x => x.id == '552')!=-1" style="color:#008ed8;cursor: pointer;"  @click="handleDetail(row,'1')">{{ row.order_sn }}</span>
          <span v-else>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店名称" align="left" >
        <template slot-scope="{row}">
          <el-popover placement="top-start"  width="200"  trigger="hover">
            <div style="padding-bottom:5px">商家</div>
            <div style="border-top:1px solid #dedede;padding-top:10px">
              <span v-if="row.merch_name == null || row.merch_name == ''" style="vertical-align: middle;">暂无商家</span>
              <span v-else style="vertical-align: middle;">{{row.merch_name}}</span>
            </div>
            <div slot="reference" style="display:flex">
              <span style="vertical-align: middle;color:#008ed8">{{row.order_title}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="会员" align="left"  width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="住宿人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.link_name.split(',')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.link_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期/离店日期" align="center" width="160">
        <template slot-scope="{row}">
          <div>{{ row.create_time }}</div>
          <div>
            <span v-if="row.finish_time == null || row.finish_time == ''">-</span>
            <span v-else>{{row.finish_time}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="使用日期" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.use_start_date }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="数量" align="center" width="100">
        <template slot-scope="{row}">
          <div>{{row.total_num}}间房</div>
          <div>{{row.booking_num}}晚</div>
        </template>
      </el-table-column>
       <el-table-column label="总价" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{row.total_price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收金额/积分" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{row.total_pay_price}}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店结算" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.hotel_money == null || row.hotel_money == ''">-</span>
          <span v-else>{{row.hotel_money}}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column label="服务商结算" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.service_money == null || row.service_money == ''">-</span>
          <span v-else>{{row.service_money}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="平台佣金" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.platform_commission == null || row.platform_commission == ''">-</span>
          <span v-else>{{row.platform_commission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center"  width="110">
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
      <el-table-column label="订单类型" align="center"  width="80">
        <template slot-scope="{row}">
            <span v-if="row.order_type == 0" >普通</span>
            <span v-if="row.order_type == 1" >扫码</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center"  width="80">
        <template slot-scope="{row}">
          <span v-if="row.is_read == 0" style="color:red">未读</span>
          <span v-if="row.is_read == 1" >已读</span>
        </template>
      </el-table-column>
      <el-table-column v-if="btnAry.findIndex(x => x.id == '552')!=-1" label="管理" align="center" width="100" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" v-if="row.is_read == 1" @click="handleDetail(row,'1')">查看</el-button>
          <el-button type="primary" size="mini" v-if="row.is_read == 0" @click="handleDetail(row,'2')">未查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 订单详情 -->
    <order-detail ref="orderDetailChild" />
  </div>
</template>

<script>
import { getMemberOrderList,totalByDate,getMemberOrderReadList,getOrderExportExcel} from '@/api/order/order-list'
import { allAddressList } from '@/api/common'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import OrderDetail from "./component/order-detail";
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,OrderDetail },
  mixins: [mix],
  data() {
    return {
        belongRegoinProps: {
            checkStrictly: true,
            value:'code',
            label:'name',
            lazy: true,
            lazyLoad: (node, resolve) => {
              this.$nextTick(()=>{
                this.getAreaForLazyLoad(node, resolve)
              })
            }
        },//级联框prop
      activeName:'all',
      listQuery:{
        keyword:'',
        status:null,
        source:null,
        pay_way:null,
        hotel_id:null,
        start_time:'',
        end_time:'',
        member_id:'',
        province_id:'',
        city_id:'',
        area_id:'',
        street_id:'',
        page: 1,
        size: 20,
      },
      total: 0,
      listLoading: false,
      placeOrigin:[],
      dateRange:[],
      list: [],
      siteOptions:[],
      orderStatusList:[
        {name:'待付款',value:'1'},
        {name:'待酒店接受',value:'2'},
        {name:'订单取消',value:'3'},
        {name:'已退款',value:'4'},
        {name:'已接受待入住',value:'5'},
        {name:'已入住',value:'6'},
        {name:'交易完成',value:'7'},
        {name:'退款申请',value:'8'}
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
      dayJson:{
        today_total:0,
        yesterday_total:0,
        week_total:0,
        month_total:0,
        total_amonut:0,
      },
      exportAllloading:false,
      btnAry:[],
      hotelList:[],
      loadingSearch:false,
      totalData:{
        order_nums: 0,
        total_order_money: 0,
        total_pay_money: 0,
      }
    }
  },
  mounted () {
    this.getList();
    this.getTotalByDate()
    this.$store.dispatch('user/showBtn', { id: 49 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    //点击tab
    handleClick(){
      this.listQuery.page = 1
      this.listQuery.size = 20
      this.getList();
    },
    // 获取列表
    getList() {
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
        if(this.placeOrigin.length>0){
          this.placeOrigin.map((item,i)=>{
            if(i == 0){
              this.listQuery.province_id = item
              this.listQuery.city_id = ''
              this.listQuery.area_id = ''
              this.listQuery.street_id = ''
            }else if(i == 1){
              this.listQuery.city_id = item
            }else if(i == 2){
              this.listQuery.area_id = item
            }else if(i == 3){
              this.listQuery.street_id = item
            }
          })
        }else{
          this.listQuery.province_id = ''
          this.listQuery.city_id = ''
          this.listQuery.area_id = ''
          this.listQuery.street_id = ''
        }
        this.listLoading = true
        getMemberOrderList(this.listQuery).then(res => {
            this.list = res.data.data.data
            this.total = res.data.data.total
            this.totalData = res.data.totalData
            this.listLoading = false
        })
    },
    //刷新
    refresh(){
      this.listQuery = {
        keyword:'',
        status:null,
        source:null,
        pay_way:null,
        hotel_id:null,
        start_time:'',
        end_time:'',
        member_id:'',
        province_id:'',
        city_id:'',
        area_id:'',
        street_id:'',
        page: 1,
        size: 20,
      }
      this.dateRange = []
      this.placeOrigin = []
      this.activeName = 'all'
      this.getList();
      this.getTotalByDate()
    },
    //获取省市区地址
    getAreaForLazyLoad(node, resolve) {
        // console.log(node)
        const  level  = node.level
        if(level >= 4){
            resolve()
            return
        }
        let params = {
            code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
                // console.log(res)
                childProjects = res.data.data
                childProjects.map(item => {
                  item.leaf = level >= 3; //判断是否为末尾节点
                })
                resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
    },
    //获取统计金额
    getTotalByDate(){
        totalByDate().then(res=>{
            this.dayJson = res.data
        })
    },
    //搜索酒店
    remoteMethod(query) {
        if (query !== '') {
            this.loadingSearch = true
            getHotelList({ keyword: query, page: 1, size: 9999,}).then(res => {
                this.loadingSearch = false
                this.hotelList = res.data.data.data
            })
        } else {
            this.hotelList = []
        }
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
    //查看订单详情
    handleDetail(row,flag){
        this.$refs.orderDetailChild.init(row)
        if(row.is_read == 0){
            getMemberOrderReadList({ids:row.id}).then(res=>{
                if(res.code == 0){
                    this.getList()
                }
            })
        }
    },
    //导出数据
    exportTable(flag){
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
      if(this.placeOrigin.length>0){
        this.placeOrigin.map((item,i)=>{
          if(i == 0){
            this.listQuery.province_id = item
            this.listQuery.city_id = ''
            this.listQuery.area_id = ''
            this.listQuery.street_id = ''
          }else if(i == 1){
            this.listQuery.city_id = item
          }else if(i == 2){
            this.listQuery.area_id = item
          }else if(i == 3){
            this.listQuery.street_id = item
          }
        })
      }else{
        this.listQuery.province_id = ''
        this.listQuery.city_id = ''
        this.listQuery.area_id = ''
        this.listQuery.street_id = ''
      }
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          status:this.listQuery.status,
          source:this.listQuery.source,
          pay_way:this.listQuery.pay_way,
          merch_id:this.listQuery.merch_id,
          start_time:this.listQuery.start_time,
          end_time:this.listQuery.end_time,
          member_id:this.listQuery.member_id,
          province_id:this.listQuery.province_id,
          city_id:this.listQuery.city_id,
          area_id:this.listQuery.area_id,
          street_id:this.listQuery.street_id,
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
.filter-container{
    display: flex;
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        // font-size: 14px;
        margin-left: 10px;
        margin-right: 30px;
        .top-num{
            color:red;
            margin-right: 2px;
        }
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
</style>
