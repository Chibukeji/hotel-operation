<template>
  <div>
    <div class="filter-container">
        <span class="filter-item">
            <span class="select-title">时间范围：</span>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
            end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </span>
         <span class="filter-item">
          <span class="select-title">酒店：</span>
            <el-select  v-model="listQuery.hotel_id" filterable clearable  remote placeholder="请输入酒店名称/酒店ID"
              :remote-method="remoteMethod" :loading="loadingSearch" style="width:300px">
            <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </span>
        <el-input v-model="listQuery.keyword" placeholder="订单号/产品名称/联系人" style="width:300px" class="filter-item" />
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '664')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '663')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
     </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width:100%;">
      <el-table-column label="订单号" align="center" width="200">
        <template slot-scope="{row}">
           <span v-if="btnAry.findIndex(x => x.id == '662')!=-1" style="color:#008ed8;cursor: pointer;"  @click="handleDetail(row,'none')">{{ row.order_sn }}</span>
          <span v-else>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店名称" align="left">
        <template slot-scope="{row}">
          <span>{{row.hotel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房型" align="left" width="200" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.order_title == '' || row.order_title  == null">-</span>
          <span v-else>{{ row.order_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" align="left" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex"> 
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员姓名" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.member_real_name== '' || row.member_real_name ==null">-</span>
          <span>{{ row.member_real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额/积分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
          <div>{{row.refund_score}}</div>
        </template>
      </el-table-column>
      <el-table-column label="退款方式" align="center" width="140">
        <template slot-scope="{row}">
          <span v-if="row.pay_type == null || row.pay_type == ''">-</span>
          <div v-else>
            <!-- <span v-if="row.pay_way == 1">微信</span>
            <span v-if="row.pay_way == 2">支付宝</span>
            <span v-if="row.pay_way == 3">余额</span>
            <span v-if="row.pay_way == 4">现金</span>
            <span v-if="row.pay_way == 5">银联</span>
            <span v-if="row.pay_way == 6">分时积分</span>
            <span v-if="row.pay_way == 7">专属积分</span> -->
            <span>{{row.pay_type}}</span>
          </div>
        </template>
      </el-table-column>
       <el-table-column label="申请时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{row.create_time}}</span>
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
      <el-table-column label="备注" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.audit_reason == '' || row.audit_reason == null">-</span>
          <span v-else>{{row.audit_reason}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini"  v-if="row.status == 0 && btnAry.findIndex(x => x.id == '661')!=-1" @click="handleRefund(row)">退款</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '662')!=-1" type="primary" size="mini"  @click="handleDetail(row,'none')">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 订单详情 -->
    <refund-detail ref="orderDetailChild" />
    <!-- 退款弹窗 -->
    <el-dialog :visible.sync="refundDialogVisible" :title="refundTitle"  width="600px">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="100px" style="width:80%;margin-bottom:50px">
            <el-form-item label="退款" prop="type">
                <el-radio-group v-model="editForm.type">
                    <el-radio :label="1">同意退款</el-radio>
                    <el-radio :label="2">拒绝退款</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="原因" prop="reason">
                <el-input v-model="editForm.reason"></el-input>
            </el-form-item>
        </el-form>
        <div style="text-align:center;">
            <el-button size="small" @click="refundDialogVisible = false">取消</el-button>
            <el-button :loading="refundLoading" size="small" type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRefundOrderList,refundOrder } from '@/api/order/refund-order'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
import RefundDetail from "./component/refund-detail";
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,RefundDetail },
  mixins: [mix],
  data() {
    return {
      listQuery:{
        hotel_id:'',
        keyword:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20,
      },
      total: 0,
      listLoading: false,
      dateRange:[],
      list: [],
      exportAllloading:false,
      refundDialogVisible:false,
      refundTitle:'',
      refundId:'',
      rules:{
        type:[{ required: true, message: '请选择活', trigger: 'change' }]
      },
      editForm:{
        type:1,
        reason:'',
      },
      btnAry:[],
      refundLoading:false,
      loadingSearch:false,
      hotelList:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 660 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
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
        this.list = []
        getRefundOrderList(this.listQuery).then(res => {
            this.list = res.data.data.data
            this.total = res.data.data.total
            this.listLoading = false
        })
    },
     //刷新
    refresh(){
      this.listQuery = {
        hotel_id:'',
        keyword:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 20,
      }
      this.dateRange = []
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
        this.$refs.orderDetailChild.init(row,flag)
    },
    //退款
    handleRefund(row){
        this.refundDialogVisible = true
        this.refundTitle = row.order_sn+'订单-退款'
        this.refundId = row.id
        
    },
    //退款弹窗
    handleSubmit(){
        this.$refs.editForm.validate((valid) => {
            if (valid) {
                let params = {
                    id: this.refundId,
                    type:this.editForm.type,
                    reason:this.editForm.reason
                }
                this.refundLoading = true
                refundOrder(params).then(res=>{
                    this.refundLoading = false
                    if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '操作成功!'
                      })
                      this.getList()
                      this.refundDialogVisible = false
                    }
                })
            }
        })
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
        this.exportAllloading = false
        // console.log(res)
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
</style>
