<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="70%" class="center-dialog">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单信息" name="first">
          <div class="user-info">
            <div class="left-box">
                <div class="wrap-box">
                    <span class="text-title">订单号：</span>
                    <span>{{detailItem.order_sn}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">下单时间：</span>
                    <span>{{detailItem.create_time}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">预定日期：</span>
                    <span>{{detailItem.use_start_date}}</span>-
                    <span>{{detailItem.use_end_date}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">入住时间：</span>
                    <span v-if="detailItem.consume_time == '' || detailItem.consume_time == null">无</span>
                    <span v-else>{{detailItem.consume_time}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">离店时间：</span>
                    <span v-if="detailItem.finish_time == '' || detailItem.finish_time == null">无</span>
                    <span v-else>{{detailItem.finish_time}}</span>
                </div>
            </div>
            <div class="center-box">
               <div class="wrap-box">
                    <span class="text-title">订单状态：</span>
                    <span v-if="detailItem.status == 0" >待处理</span>
                    <span v-if="detailItem.status == 1" >待付款</span>
                    <span v-if="detailItem.status == 2" >待酒店接受</span>
                    <span v-if="detailItem.status == 3" >订单取消</span>
                    <span v-if="detailItem.status == 4" >已退款</span>
                    <span v-if="detailItem.status == 5" >已接受待入住</span>
                    <span v-if="detailItem.status == 6" >已入住</span>
                    <span v-if="detailItem.status == 7" >交易完成</span>
                    <span v-if="detailItem.status == 8" >退款申请</span>
                </div>
                <!-- <div class="wrap-box" v-if="detailItem.status == 4">
                    <span class="text-title">退款理由：</span>
                    <span v-if="detailItem.finish_time == '' || detailItem.finish_time == null">无</span>
                    <span v-else>{{detailItem.finish_time}}</span>
                </div> -->
                <div class="wrap-box">
                    <span class="text-title">是否可退款：</span>
                    <span>{{detailItem.is_refund}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">订单来源：</span>
                    <span v-if="detailItem.source == 0" >公众号</span>
                    <span v-if="detailItem.source == 1" >安卓</span>
                    <span v-if="detailItem.source == 2" >ios</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">订单类型：</span>
                    <span v-if="detailItem.order_type == 0" >普通</span>
                    <span v-if="detailItem.order_type == 1" >扫码</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">会员：</span>
                    <img v-if="detailItem.member_head_pic == '' || detailItem.member_head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                    <img v-else :src="detailItem.member_head_pic" class="heder-img">
                    <span>{{detailItem.nickname}}</span>
                </div>
            </div>
            <div class="right-box">
               <div class="wrap-box">
                    <span class="text-title">商家：</span>
                    <span >{{detailItem.merch_name}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">付款方式：</span>
                    <!-- <span v-if="detailItem.pay_way == 1" >微信</span>
                    <span v-if="detailItem.pay_way == 2" >支付宝</span>
                    <span v-if="detailItem.pay_way == 3" >余额</span>
                    <span v-if="detailItem.pay_way == 4" >余额</span> -->
                    <span>{{detailItem.pay_type}}</span>
                </div>
                <div class="wrap-box">
                    <span class="text-title">产品名称：</span>
                    <span>{{detailItem.order_title}}</span>
                </div>
                 <!-- <div class="wrap-box">
                    <span class="text-title">联系人姓名：</span>
                    <span>{{detailItem.link_name}}</span>
                </div>
                 <div class="wrap-box">
                    <span class="text-title">联系人电话：</span>
                    <span>{{detailItem.link_phone}}</span>
                </div> -->
                 <div class="wrap-box">
                    <span class="text-title">联系人邮箱：</span>
                    <span v-if="detailItem.link_email == '' || detailItem.link_email == null">无</span>
                    <span v-else>{{detailItem.link_email}}</span>
                </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="住宿详情" name="second">
           <aside>
            <span>合计：</span>
             <span class="color-text" style="margin-right:20px">{{detailItem.total_pay_price}}元</span>
            <span v-for="(item,index) in orderChildTotal" :key="index" style="margin-right:20px">
              <span v-if="item.pay_type == 1">微信支付：</span>
              <span v-if="item.pay_type == 2">支付宝支付：</span>
              <span v-if="item.pay_type == 3">余额支付：</span>
              <span v-if="item.pay_type == 4">现金支付：</span>
              <span v-if="item.pay_type == 5">银联支付：</span>
              <span v-if="item.pay_type == 6">分时积分：</span>
              <span v-if="item.pay_type == 7">专属积分：</span>
              <span v-if="item.pay_type == 8">微信汇聚：</span>
              <span v-if="item.pay_type == 9">支付宝汇聚：</span>
              <span v-if="item.pay_type == null"></span>
              <span v-else class="color-text">{{item.money}}元</span>
            </span>
          </aside>
           <el-table :data="orderChildList" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="房型名称" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.room_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="日期" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.use_in_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.num }}晚</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="{row}">
                      <span v-if="row.status == 0">待入住</span>
                      <span v-if="row.status == 1">已完成</span>
                      <span v-if="row.status == 2">退款</span>
                      <span v-if="row.status == 3">申请退款</span>
                      <span v-if="row.status == 4">已入住</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式" align="center" width="100">
                    <template slot-scope="{row}">
                      <span v-if="row.pay_way == null || row.pay_way == ''">-</span>
                      <div v-else>
                        <span v-if="row.pay_way == 1">微信</span>
                        <span v-if="row.pay_way == 2">支付宝</span>
                        <span v-if="row.pay_way == 3">余额</span>
                        <span v-if="row.pay_way == 4">现金</span>
                        <span v-if="row.pay_way == 5">银联</span>
                        <span v-if="row.pay_way == 6">分时积分</span>
                        <span v-if="row.pay_way == 7">专属积分</span>
                        <span v-if="row.pay_way == 8">微信汇聚</span>
                        <span v-if="row.pay_way == 9">支付宝汇聚</span>
                      </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="优惠信息" name="third">
           <div class="user-info">
            <div class="left-box" style="width:33%">
                <div class="wrap-box">
                    <span class="text-title">使用优惠券：</span>
                    <span>{{detailItem.coupon}}</span>
                </div>
            </div>
            <div class="center-box" style="width:33%">
                <div class="wrap-box">
                    <span class="text-title">使用分时积分：</span>
                    <span>{{detailItem.time_score}}</span>
                </div>
            </div>
            <div class="right-box" style="width:33%">
                <div class="wrap-box">
                    <span class="text-title">使用专属积分：</span>
                    <span>{{detailItem.exclusive_score}}</span>
                </div>
            </div>
            <div class="right-box" style="width:33%">
                <div class="wrap-box">
                    <span class="text-title">使用会员折扣：</span>
                    <span>{{detailItem.discounts/10}}折</span>
                </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单日志" name="fourth">
            <el-table :data="orderLogList" v-loading="listLoading2" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单ID" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.order_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" align="center" >
                  <template slot-scope="{row}">
                    <span v-if="row.operation_type == 0" >创建订单</span>
                    <span v-if="row.operation_type == 1" >支付订单</span>
                    <span v-if="row.operation_type == 2" >酒店接受</span>
                    <span v-if="row.operation_type == 3" >酒店接受</span>
                    <span v-if="row.operation_type == 4" >取消订单</span>
                    <span v-if="row.operation_type == 5" >申请退款</span>
                    <span v-if="row.operation_type == 6" >退款确认</span>
                    <span v-if="row.operation_type == 7" >订单消费</span>
                    <span v-if="row.operation_type == 8" >订单完成</span>
                    <span v-if="row.operation_type == 9" >入驻酒店</span>
                  </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template slot-scope="{row}">
                    <span v-if="row.description == '' || row.description == null">-</span>
                    <span v-else>{{ row.description }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
        </el-tab-pane>
        <el-tab-pane label="住宿人信息" name="fifth">
          <el-table :data="orderPeopleList" v-loading="listLoading3" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="姓名" align="center">
                <template slot-scope="{row}">
                <span>{{ row.link_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="电话" align="center" >
                <template slot-scope="{row}">
                  <span v-if="row.link_phone == '' || row.link_phone == null">-</span>
                  <span v-else>{{ row.link_phone}}</span>
                </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="detailItem.status== 4|| detailItem.status == 7 || detailItem.status == 8" label="退款订单" name="sixth">
           <el-table :data="refundOrderList" v-loading="listLoading4" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="退款订单号" align="center" width="180">
                <template slot-scope="{row}">
                <span>{{ row.refund_sn }}</span>
                </template>
            </el-table-column>
            <el-table-column label="退款金额/积分" align="center" width="120">
              <template slot-scope="{row}">
                <span>{{ row.price }}</span>
                <div>{{row.refund_score}}</div>
              </template>
            </el-table-column>
            <el-table-column label="退款方式" align="center" width="120">
              <template slot-scope="{row}">
                <!-- <span v-if="row.pay_way == null || row.pay_way == ''">-</span>
                <div v-else>
                  <span v-if="row.pay_way == 1">微信</span>
                  <span v-if="row.pay_way == 2">支付宝</span>
                  <span v-if="row.pay_way == 3">余额</span>
                  <span v-if="row.pay_way == 4">现金</span>
                  <span v-if="row.pay_way == 5">银联</span>
                  <span v-if="row.pay_way == 6">分时积分</span>
                  <span v-if="row.pay_way == 7">专属积分</span>
                </div> -->
                <span>{{row.pay_type}}</span>
              </template>
            </el-table-column>
            <el-table-column label="退款理由" align="center" >
              <template slot-scope="{row}">
                <span>{{ row.refund_reason }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请退款时间" align="center" width="160">
              <template slot-scope="{row}">
                <span>{{row.create_time}}</span>
              </template>
            </el-table-column>
           <el-table-column label="审核人员名称" align="center" width="120">
              <template slot-scope="{row}">
                <span v-if="row.auditor_name == '' || row.auditor_name==null">-</span>
                <span v-else>{{row.auditor_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="审核时间" align="center" width="160">
              <template slot-scope="{row}">
                <span v-if="row.audit_time == '' || row.audit_time == null">-</span>
                <span v-else>{{row.audit_time}}</span>
              </template>
            </el-table-column>
             <el-table-column label="状态" align="center" width="100">
              <template slot-scope="{row}">
                <span v-if="row.status == 0">待审核</span>
                <span v-if="row.status == 1">通过</span>
                <span v-if="row.status == 2">不通过</span>
                <span v-if="row.status == 3">取消退款</span>
              </template>
            </el-table-column>
            <el-table-column label="审核理由" align="center" >
              <template slot-scope="{row}">
                <span v-if="row.audit_reason == '' || row.audit_reason == null">-</span>
                <span v-else>{{row.audit_reason}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="detailItem.status == 7" label="酒店结算" name="seventh">
          <div class="user-info">
            <div class="left-box">
                <div class="wrap-box">
                    <span class="text-title">酒店结算：</span>
                    <span>{{detailItem.hotel_money}}</span>
                </div>
            </div>
            <div class="center-box">
                <div class="wrap-box">
                    <span class="text-title">会员积分：</span>
                    <span>{{detailItem.divtime_score}}</span>
                </div>
            </div>
            <div class="right-box"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="detailItem.status == 7" label="订单分佣" name="eighth">
           <el-table :data="commissionsList" v-loading="listLoading8" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="订单号" align="center">
                <template slot-scope="{row}">
                <span>{{ row.order_sn }}</span>
                </template>
            </el-table-column>
            <el-table-column label="会员" align="left"  :show-overflow-tooltip="true">
              <template slot-scope="{row}">
                <div style="display:flex">
                  <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                  <img v-else :src="row.head_pic" class="heder-img">
                  <span class="member-name">{{row.member_name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="佣金" align="center">
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
          <pagination :total="total8" :page.sync="listQuery8.page" :limit.sync="listQuery8.size" :autoScroll='false'  @pagination="paginHandle8" />
        </el-tab-pane>
      </el-tabs>
       <div v-if="activeName == 'first'" slot="footer" class="dialog-footer copy-btn-box">
        <el-button size="small" type="primary" @click="copyHandle()">打印</el-button>
      </div>
    </el-dialog>
     <copy-detail ref="copyDetailChild" />
  </div>
</template>

<script>
import { getMemberOrderList,getMemberOrderChildList,getMemberOrderLogList,getStayPeopleList,getRefundOrderList,getOrderCommissionsList } from '@/api/order/order-list'
import Pagination from '@/components/Pagination'
import CopyDetail from './copy-detail'
export default {
  components: { Pagination,CopyDetail },
  data() {
    return {
      dialogTitle: "",
      detailDialogVisible: false,
      activeName: "first",
      detailItem:'',
      dateRange:[],
      listQuery:{
        order_id:'',
        page: 1,
        size: 10,
      },
      total: 0,
      listLoading:false,
      listLoading2:false,
      listLoading3:false,
      listLoading4:false,
      orderChildList:[],
      orderChildTotal:[],
      orderLogList:[],
      orderPeopleList:[],
      refundOrderList:[],
      total8:0,
      listQuery8:{
        page:1,
        size:10,
      },
      commissionsList:[],
      listLoading8:false,
    };
  },
  mounted() {},
  methods: {
    init(item) {
      this.detailDialogVisible = true
      this.detailItem = item
      this.listQuery.order_id = this.detailItem.id
      this.dialogTitle = `查看[${item.order_sn}]信息`
      this.listQuery.page = 1
      this.listQuery8.page = 1
      if(this.detailItem.status != 4 && this.detailItem.status != 8 && this.detailItem.status != 7){
        if(this.activeName == "sixth"){
          this.activeName = "first"
        }
      }
      if(this.detailItem.status != 7 ){
          if(this.activeName == "seventh" || this.activeName == "eighth"){
            this.activeName = "first"
          }
        }
      this.handleClick()
    },
    handleClick(){
      if(this.activeName == "second"){
        this.getMemberOrderChild()
      }else if(this.activeName == "fourth"){
        this.getMemberOrderLog()
      }else if(this.activeName == "fifth"){
        this.getStayPeople()
      }else if(this.activeName == "sixth"){
        this.getRefundOrder()
      }else if(this.activeName == "eighth"){
        this.getOrderCommissions()
      }
    },
    //获取子订单信息
    getMemberOrderChild(){
      this.listLoading = true
      getMemberOrderChildList({order_id:this.detailItem.id}).then(res=>{
        this.orderChildList = res.data.data
        this.orderChildTotal = res.data.total_data
        this.listLoading = false
      })
    },
    //获取订单日志
    getMemberOrderLog(){
      this.listLoading2 = true
      getMemberOrderLogList({order_id:this.detailItem.id}).then(res=>{
        this.orderLogList = res.data
        this.listLoading2 = false
      })
    },
    //获取入住人信息
    getStayPeople(){
      this.listLoading3 = true
      getStayPeopleList({order_id:this.detailItem.id}).then(res=>{
        this.orderPeopleList = res.data
        this.listLoading3 = false
      })
    },
    //退款订单
    getRefundOrder(){
      this.listLoading4 = true
      getRefundOrderList({order_id:this.detailItem.id}).then(res=>{
        this.refundOrderList = res.data
        this.listLoading4 = false
      })
    },
    //获取订单分佣
    getOrderCommissions(){
      this.listLoading8 = true
      let params={
        order_id:this.detailItem.id,
        page:this.listQuery8.page,
        size:this.listQuery8.size 
      }
      getOrderCommissionsList(params).then(res=>{
        this.commissionsList = res.data.data.data
        this.total8 = res.data.data.total
        this.listLoading8 = false
      })
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
    paginHandle8(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery8.page = parseInt(json.page)
        this.listQuery8.size = parseInt(json.limit)
      }
      this.getOrderCommissions()
    },
    //点击打印
    copyHandle(){
      this.$refs.copyDetailChild.init(this.detailItem)
    }
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  justify-content: center;
  margin-top: -15px;
  .left-box,
  .right-box,
  .center-box {
    width: 30%;
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
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .left-box{
    width: 40%;
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
  margin-right: 5px;
}
.copy-btn-box{
  text-align: center;
}
</style>