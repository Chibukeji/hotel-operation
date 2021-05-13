<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="团队人员" name="first">
          <div class="filter-container">
                <span class="filter-item">
                    <span class="select-title">时间范围：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-input v-model="listQuery.keyword" placeholder="会员昵称/手机号" style="width:300px" class="filter-item" />
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter('1')">搜索</el-button>
                <el-button class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
                <el-button class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
            </div>
            <el-table :data="teamList" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" align="center" >
                    <template slot-scope="{row}">
                    <span>{{ row.real_name }}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="昵称" align="left"  :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <div style="display:flex">
                      <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                      <img v-else :src="row.head_pic" class="heder-img">
                      <span class="member-name">{{row.nickname}}</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="推荐人姓名" align="center" >
                    <template slot-scope="{row}">
                    <span>{{ row.preal_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="推荐人昵称" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.pnickname }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="关注时间" align="center">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        </el-tab-pane>
        <el-tab-pane label="收益" name="second">
            <div class="filter-container">
                <span class="filter-item">
                    <span class="select-title">时间范围：</span>
                    <el-date-picker v-model="dateRange2" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter('2')">搜索</el-button>
                <el-button class="filter-item" type="primary" size="mini" :loading="exportAllloading2" @click="exportTable2('1')">全部导出</el-button>
                <el-button class="filter-item" type="primary" size="mini" @click="exportTable2('2')">按页导出</el-button>
                <!-- <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width:300px" class="filter-item" />
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter('2')">搜索</el-button> -->
            </div>
            <aside>
                <span>总金额：</span>
                <span>
                共
                <span style="color:red;">{{totalMoney}}</span>元
                </span>
            </aside>
            <el-table :data="teamCommissionList" v-loading="listLoading2" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                      <div style="display:flex">
                        <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                        <img v-else :src="row.head_pic" class="heder-img">
                        <span class="member-name">{{row.nickname}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column label="预定酒店" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <span>{{ row.hotel_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机" align="center" width="150">
                    <template slot-scope="{row}">
                    <span>{{ row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="消费时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.moneys }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini">
                            详情
                        </el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.size" @pagination="paginHandle2" />
        </el-tab-pane>
        <el-tab-pane label="团队订单" name="third">
            <div class="filter-container">
                <span class="filter-item">
                    <span class="select-title">时间范围：</span>
                    <el-date-picker v-model="dateRange3" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-input v-model="listQuery3.keyword" placeholder="昵称/手机号" style="width:300px" class="filter-item" />
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter('3')">搜索</el-button>
                <el-button class="filter-item" type="primary" size="mini" :loading="exportAllloading3" @click="exportTable3('1')">全部导出</el-button>
                <el-button class="filter-item" type="primary" size="mini" @click="exportTable3('2')">按页导出</el-button>
            </div>
            <aside>
                <span>总金额：</span>
                <span>
                共
                <span style="color:red;">{{totalMoney2}}</span>元
                </span>
            </aside>
            <el-table :data="teamOrderList" v-loading="listLoading3" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" align="center" width="180">
                    <template slot-scope="{row}">
                    <span>{{ row.real_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                      <div style="display:flex">
                        <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                        <img v-else :src="row.head_pic" class="heder-img">
                        <span class="member-name">{{row.nickname}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column label="酒店名称" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <span>{{ row.order_title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付金额" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.pay_total_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="消费时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total3" :page.sync="listQuery3.page" :limit.sync="listQuery3.size" @pagination="paginHandle3" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getMemberTeamList,   getMemberTeamOrderList, getMemberTeamCommissionList,
getTeamListExportExcel,getTeamOrderExportExcel,getTeamCommissionExportExcel } from '@/api/member-manage/member-list'
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
      dateRange2:[],
      dateRange3:[],
      listQuery:{
        keyword:'',
        page: 1,
        size: 10,
        start_time:'',
        end_time:'',
      },
      listQuery2:{
        page: 1,
        size: 10,
        start_time:'',
        end_time:'',
      },
      listQuery3:{
        page: 1,
        size: 10,
        start_time:'',
        end_time:'',
      },
      total: 0,
      total2: 0,
      total3: 0,
      list: [],
      teamList:[],
      teamOrderList:[],
      teamCommissionList:[],
      listLoading:false,
      listLoading2:false,
      listLoading3:false,
      totalMoney:0,
      totalMoney2:0,
      exportAllloading:false,
      exportAllloading2:false,
      exportAllloading3:false,
    };
  },
  mounted() {},
  methods: {
    init(item) {
        this.detailDialogVisible = true
        this.detailItem = item
        this.dialogTitle = `查看[${item.nickname}]团队信息`
        this.listQuery.page = 1
        this.listQuery2.page = 1
        this.listQuery3.page = 1
        this.memberTeamList()
        this.memberTeamOrderList()
        this.memberTeamCommissionList()
    },
    // 点击搜索
    handleFilter(flag) {
      if(flag == 1){
        this.listQuery.page = 1
        this.memberTeamList()
      }else if(flag == 2){
        this.listQuery2.page = 1
        this.memberTeamCommissionList()
      }else if(flag == 3){
        this.listQuery3.page = 1
        this.memberTeamOrderList()
      }
      
    },
    //获取团队人数
    memberTeamList(){
        if (this.dateRange == null || this.dateRange.length == 0) {
            this.listQuery.start_time = ''
            this.listQuery.end_time = ''
        } else {
            this.listQuery.start_time = this.dateRange[0] / 1000
            this.listQuery.end_time = this.dateRange[1] / 1000
        }
        let params={
            member_id:this.detailItem.id,
            keyword:this.listQuery.keyword,
            page: this.listQuery.page,
            size: this.listQuery.size,
            start_time:this.listQuery.start_time,
            end_time:this.listQuery.end_time,
        }
        this.listLoading = true
        getMemberTeamList(params).then(res=>{
            this.teamList = res.data.data
            this.total = res.data.total
            this.listLoading = false
        })
    },
    // 获取团队收益
    memberTeamCommissionList(){
        if (this.dateRange2 == null || this.dateRange2.length == 0) {
            this.listQuery2.start_time = ''
            this.listQuery2.end_time = ''
        } else {
            this.listQuery2.start_time = this.dateRange2[0] / 1000
            this.listQuery2.end_time = this.dateRange2[1] / 1000
        }
        let params={
            member_id:this.detailItem.id,
            page: this.listQuery2.page,
            size: this.listQuery2.size,
            start_time:this.listQuery2.start_time,
            end_time:this.listQuery2.end_time,
        }
        this.listLoading2 = true
        getMemberTeamCommissionList(params).then(res=>{
            this.teamCommissionList = res.data.data.data
            this.total2 = res.data.data.total
            this.totalMoney =  res.data.money
            this.listLoading2 = false
        })
    },
    // 获取团队订单
    memberTeamOrderList(){
        if (this.dateRange3 == null || this.dateRange3.length == 0) {
            this.listQuery3.start_time = ''
            this.listQuery3.end_time = ''
        } else {
            this.listQuery3.start_time = this.dateRange3[0] / 1000
            this.listQuery3.end_time = this.dateRange3[1] / 1000
        }
        let params={
            member_id:this.detailItem.id,
            keyword:this.listQuery3.keyword,
            page: this.listQuery3.page,
            size: this.listQuery3.size,
            start_time:this.listQuery3.start_time,
            end_time:this.listQuery3.end_time,
        }
        this.listLoading3 = true
        getMemberTeamOrderList(params).then(res=>{
            this.teamOrderList = res.data.data.data
            this.total3 = res.data.data.total
            this.totalMoney2 =  res.data.money
            this.listLoading3 = false
        })
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.memberTeamList()
    },
    paginHandle2(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery2.page = parseInt(json.page)
        this.listQuery2.size = parseInt(json.limit)
      }
      this.getList()
    },
    paginHandle3(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery3.page = parseInt(json.page)
        this.listQuery3.size = parseInt(json.limit)
      }
      this.getList()
    },
    //导出团队人员数据
    exportTable(flag){
      let params
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if(flag == '1'){
        this.exportAllloading = true
        params={
            member_id:this.detailItem.id,
            keyword:this.listQuery.keyword,
            start_time:this.listQuery.start_time,
            end_time:this.listQuery.end_time,
        }
      }else{
        params = Object.assign(this.listQuery,{member_id:this.detailItem.id}) 
      }
      getTeamListExportExcel(params).then(res=>{
        // console.log(res)
        this.exportAllloading = false
        if(res.code == 0){
          window.open(res.data)
        }
      })
    },
    //导出团队收益数据
    exportTable2(flag){
      let params
      if (this.dateRange2 == null || this.dateRange2.length == 0) {
        this.listQuery2.start_time = ''
        this.listQuery2.end_time = ''
      } else {
        this.listQuery2.start_time = this.dateRange2[0] / 1000
        this.listQuery2.end_time = this.dateRange2[1] / 1000
      }
      if(flag == '1'){
        this.exportAllloading2 = true
        params={
            member_id:this.detailItem.id,
            start_time:this.listQuery2.start_time,
            end_time:this.listQuery2.end_time,
        }
      }else{
         params = Object.assign(this.listQuery2,{member_id:this.detailItem.id})
      }
      getTeamCommissionExportExcel(params).then(res=>{
        this.exportAllloading2 = false
        if(res.code == 0){
          window.open(res.data)
        }
      })
    },
    //导出团队订单数据
    exportTable3(flag){
      let params
      if (this.dateRange3 == null || this.dateRange3.length == 0) {
            this.listQuery3.start_time = ''
            this.listQuery3.end_time = ''
        } else {
            this.listQuery3.start_time = this.dateRange3[0] / 1000
            this.listQuery3.end_time = this.dateRange3[1] / 1000
        }
      if(flag == '1'){
        this.exportAllloading3 = true
        params={
            member_id:this.detailItem.id,
            keyword:this.listQuery3.keyword,
            start_time:this.listQuery3.start_time,
            end_time:this.listQuery3.end_time,
        }
      }else{
         params = Object.assign(this.listQuery3,{member_id:this.detailItem.id})
      }
      getTeamOrderExportExcel(params).then(res=>{
        this.exportAllloading3 = false
        if(res.code == 0){
          window.open(res.data)
        }
      })
    }
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