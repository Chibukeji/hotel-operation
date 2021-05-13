<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
      <!-- <el-tabs v-model="activeName">
        <el-tab-pane label="会员信息" name="first">
          <div class="user-info">
            <div class="left-box">
              <div class="member-grade">
                <span class="text-title">总佣金：</span>
                <span >0</span>
              </div>
              <div class="member-grade">
                <span class="text-title">已结算：</span>
                <span >0</span>
              </div>
              <div class="member-grade">
                <span class="text-title">已提现：</span>
                <span >0</span>
              </div>
              <div class="member-grade">
                <span class="text-title">当前绑定的酒店：</span>
                <span >0</span>
              </div>
            </div>
            <div class="right-box">
              <div class="member-grade">
                <span class="text-title">待结算：</span>
                <span>0</span>
              </div>
               <div class="member-grade">
                <span class="text-title">可提现：</span>
                <span>0</span>
              </div>
               <div class="member-grade">
                <span class="text-title">提现审核中：</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单详情" name="second"> -->
            <aside>
              <div>
                <span>
                  <span class="text-title">总佣金：</span>
                  <span >0</span>
                </span>
                <span class="margin-left-20">
                  <span class="text-title">待结算：</span>
                  <span>0</span>
                </span>
                <span class="margin-left-20">
                  <span class="text-title">已结算：</span>
                  <span >0</span>
                </span>
                <span class="margin-left-20">
                  <span class="text-title">可提现：</span>
                  <span>0</span>
                </span>
                <span class="margin-left-20">
                  <span class="text-title">已提现：</span>
                  <span >0</span>
                </span>
                <span class="margin-left-20">
                  <span class="text-title">提现审核中：</span>
                  <span>0</span>
                </span>
              </div>
              <div>
                <span class="text-title">当前绑定的酒店：</span>
                <span >酒店，酒店</span>
              </div>
            </aside>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="酒店名称" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.order_title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总佣金" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.link_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="待结算" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.link_phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已结算" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        <!-- </el-tab-pane>
      </el-tabs> -->
    </el-dialog>
  </div>
</template>

<script>
import { getMemberOrderList } from '@/api/member-manage/member-list'
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
      ]
    };
  },
  mounted() {},
  methods: {
    init(item) {
        this.detailDialogVisible = true
        this.detailItem = item
        this.dialogTitle = `查看[${item.name}]佣金信息`
        // this.memberOrderList()
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
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.memberOrderList()
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  .left-box,
  .right-box {
    width: 50%;
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
.margin-left-20{
  margin-left: 20px;
  font-size: 14px;
}
</style>