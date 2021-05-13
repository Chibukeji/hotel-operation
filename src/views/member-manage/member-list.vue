<template>
  <div>
    <div class="filter-container">
      <div>
      <span class="filter-item">
        <!-- <el-select v-model="listQuery.idcard_verify_status" placeholder="实名认证" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in verifyList" :key="index" :label="item.name" :value="item.value" />
        </el-select> -->
      </span>
       <span class="filter-item">
        <el-select v-model="listQuery.source" placeholder="会员来源" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in sourceList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.sex" placeholder="会员性别" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in sexList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.rate_level" placeholder="分佣级别"  style="width: 160px">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in profitList" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员昵称/手机号/邮箱" style="width:300px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <span class="right-font filter-item">上周会员注册数：{{lastWeekMember}}</span>
        <span class="right-font filter-item">本周会员注册数：{{thisWeekMember}}</span>
        <span class="right-font filter-item">分时积分：{{time_score_all}}</span>
        <span class="right-font filter-item">专属积分：{{exclusive_score_all}}</span>
      </div>
      <div>
        <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '573')!=-1"  class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
        <el-button v-if="btnAry.findIndex(x => x.id == '574')!=-1"  class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员昵称" align="left" width="210" >
        <template slot-scope="{row}">
          <div v-if="row.pname == null || row.pname == ''" style="display:flex;cursor: pointer;" @click="handleDetail(row,'first')">
             <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.nickname}}</span>
          </div>
          <div v-else>
          <el-popover placement="top-start"  width="200"  trigger="hover">
            <div style="padding-bottom:5px">推荐人</div>
            <div style="border-top:1px solid #dedede;padding-top:10px">
              <img :src="row.phead_pic" class="heder-img">
              <span style="vertical-align: middle;margin-left:5px;">{{row.pname}}</span>
            </div>
            <div slot="reference" style="display:flex;cursor:pointer;" @click="handleDetail(row,'first')">
              <img :src="row.head_pic" class="heder-img">
              <span style="vertical-align: middle;color:#008ed8;margin-left:5px;">{{row.nickname}}</span>
            </div>
          </el-popover>
          
          </div>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="{row}">
          <span v-if="row.real_name == null ||row.real_name == ''">-</span>
          <span v-else>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="{row}">
          <span v-if="row.phone == null ||row.phone == ''">-</span>
          <span v-else>{{row.phone}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="推荐人" align="center">
        <template slot-scope="{row}">
          <span v-if="row.pname == null ||row.pname == ''">-</span>
          <span v-else>{{ row.pname }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="会员级别" align="center" width="100">
        <template slot-scope="{row}">
          <!-- <span v-if="row.vip_level == 0" >初始会员</span> -->
          <span >{{row.member_level_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="直推等级" align="center" width="90">
        <template slot-scope="{row}">
            <span v-if="row.direct_level == 1" >会员直推</span>
            <span v-else-if="row.direct_level == 2" >酒店员工</span>
            <span v-else-if="row.direct_level == 3" >导游推荐</span>
            <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="代理等级" align="center" width="90">
        <template slot-scope="{row}">
            <span v-if="row.agent_level == 6" >省代理</span>
            <span v-else-if="row.agent_level == 7" >市代理</span>
            <span v-else-if="row.agent_level == 8" >区县代理</span>
            <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="服务等级" align="center" width="90">
        <template slot-scope="{row}">
            <span v-if="row.service_level == 4" >运营人员</span>
            <span v-else-if="row.service_level == 5" >服务商</span>
            <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" align="center" width="100">
        <template slot-scope="{row}">
          <span >{{row.order_nums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" width="100">
        <template slot-scope="{row}">
          <span class="member-source" @click="recordDetail(row,'1')">{{row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分时积分" align="center" width="100">
        <template slot-scope="{row}">
          <span class="member-source"  @click="recordDetail(row,'2')">{{row.time_score}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专属积分" align="center" width="100">
        <template slot-scope="{row}">
          <span class="member-source"  @click="recordDetail(row,'3')">{{row.exclusive_score}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商城金币" align="center" width="100">
        <template slot-scope="{row}">
          <span class="member-source"  @click="recordDetail(row,'4')">{{row.gold}}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员来源" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.source == 0" class="member-source" @click="soureHotelDetail(row)">公众号</span>
          <span v-if="row.source == 1" class="member-source" @click="soureHotelDetail(row)">安卓</span>
          <span v-if="row.source == 2" class="member-source" @click="soureHotelDetail(row)">ios</span>
          <span v-if="row.source == 3" class="member-source" @click="soureHotelDetail(row)">美团</span>
        </template>
      </el-table-column>
       <el-table-column label="注册时间/最后登录" align="center" width="160">
        <template slot-scope="{row}">
          <div class="font-12">{{row.create_time}}</div>
          <div  v-if="row.login_time == null ||row.login_time == ''">-</div>
          <div  class="font-12" v-else>{{ row.login_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button v-if="btnAry.findIndex(x => x.id == '546')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '545')!=-1" type="primary" size="mini" @click="handleRecharge(row)">充值</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '547')!=-1" type="primary" size="mini"  @click="handleDetail(row)">
            订单详情
          </el-button> -->
           <el-dropdown trigger="click" class="my-dropdown">
             <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '546')!=-1"  @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '545')!=-1" @click.native="handleRecharge(row)">充值</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '547')!=-1" @click.native="handleDetail(row,'second')">订单详情</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '547')!=-1" @click.native="handleDetail(row,'third')">佣金明细</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '548')!=-1"  @click.native="handleTeamDetail(row)">团队详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:100%;margin-bottom:50px">
        <el-form-item label="会员昵称" prop="nickname" style="width:80%;">
          <el-input v-model="editForm.nickname" placeholder="请输入会员昵称" />
        </el-form-item>
        <el-form-item label="分润等级" prop="direct_level" style="width:80%;">
          <el-select v-model="editForm.direct_level" placeholder="请选择" >
            <el-option v-for="(item,index) in profitListEdit" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name" style="width:80%;">
          <el-input v-model="editForm.real_name" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email" style="width:80%;">
          <el-input v-model="editForm.email" placeholder="请输入电子邮件"/>
        </el-form-item>
         <el-form-item label="微信号" prop="wechat_no" style="width:80%;">
          <el-input v-model="editForm.wechat_no" placeholder="请输入微信号"/>
        </el-form-item>
         <el-form-item label="籍贯" prop="native_place" style="width:80%;">
          <el-input v-model="editForm.native_place" placeholder="请输入籍贯"/>
        </el-form-item>
        <el-form-item label="性别" prop="status" style="width:80%;">
          <el-radio-group v-model="editForm.sex" style="width:100%;text-align: left;">
            <el-radio v-for="(item,index) in sexList" :key="index" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推荐人" prop="pid" style="width:100%;">
          <el-select  v-model="editForm.pid" filterable clearable remote placeholder="请输入会员昵称搜索"
          :remote-method="remoteMethod" :loading="loadingSearch" style="width:250px" @change="selectPname">
          <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
            <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
            <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
          </el-option>
        </el-select>
        <span v-if="selectItem.id == '' || selectItem.id == null" ></span>
        <span v-else>
          <img :src="selectItem.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
          <span style="vertical-align: middle;">{{selectItem.nickname}}(id:{{selectItem.id}})</span>
        </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 订单详情 -->
    <member-detail ref="memberDetailChild" />
    <!-- 团队详情 -->
    <team-detail ref="teamDetailChild" />
    <!-- 充值弹窗 -->
    <recharge-form ref="rechargeDetailChild" @successRecharge="successRecharge"/>
    <!-- 来源酒店 -->
    <source-hotel ref="sourceHotelChild" />
    <!-- 余额,分时积分,专属积分,商城金币记录 -->
    <moneys-record ref="moneysRecordChild" />
  </div>
</template>

<script>
import { getMemberList,getSearchMemberList, getMemberEdit, getMemberWeekNumsList,getMemberExportExcel } from '@/api/member-manage/member-list'
import MemberDetail from "./component/member-detail";
import TeamDetail from "./component/team-detail";
import RechargeForm from "./component/recharge-form";
import SourceHotel from "./component/source-hotel";
import MoneysRecord from "./component/moneys-record";
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,MemberDetail,TeamDetail,RechargeForm,SourceHotel,MoneysRecord },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        keyword: '',
        // idcard_verify_status:'',
        source:null,
        sex:null,
        rate_level:null,
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        nickname:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        direct_level:[{ required: true, message: '请输入内容', trigger: 'change' }],
        email:[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        // pid:[{ required: true, message: '请选择', trigger: 'change' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        nickname:'',
        real_name:'',
        email:'',
        wechat_no:'',
        native_place:'',
        sex:0,
        direct_level:1,
        pid:'',
      },
      calendarTypeOptions: [],
      editFlag:'',
      verifyList:[
          {name:'未认证',value:0},
          {name:'审核中',value:1},
          {name:'通过',value:2},
          {name:'不通过',value:3}
      ],
      sourceList:[
        {name:'公众号',value:0},
        {name:'安卓',value:1},
        {name:'ios',value:2},
        {name:'美团',value:3}
      ],
      sexList:[
        {name:'保密',value:0},
        {name:'男',value:1},
        {name:'女',value:2},
      ],
      lastWeekMember:0,
      thisWeekMember:0,
      exportAllloading:false,
      profitList:[
        {name:'会员直推',value:1},
        {name:'酒店员工',value:2},
        {name:'导游推荐',value:3},
        {name:'运营人员',value:4},
        {name:'服务商',value:5},
        {name:'省代理',value:6},
        {name:'市代理',value:7},
        {name:'区县代理',value:8}
      ],
      profitListEdit:[
        {name:'会员直推',value:1},
        // {name:'酒店员工',value:2},
        {name:'导游推荐',value:3}
      ],
      btnAry:[],
      loadingSearch:false,
      memberList:[],
      selectItem:{
        id:'',
        head_pic:'',
        nickname:'',
      },
      time_score_all:0,
      exclusive_score_all:0,
    }
  },
  mounted () {
    this.getList();
    this.memberWeekNumsList()
    this.$store.dispatch('user/showBtn', { id: 47 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMemberList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //会员上周和本周注册数接口
    memberWeekNumsList(){
        getMemberWeekNumsList().then(res=>{
            this.lastWeekMember = res.data.last_num
            this.thisWeekMember = res.data.now_num
            this.time_score_all = res.data.time_score
            this.exclusive_score_all = res.data.exclusive_score
        })
    },
    //刷新
    refresh(){
      this.listQuery = {
        keyword: '',
        source:null,
        sex:null,
        rate_level:null,
        page: 1,
        size: 20
      }
      this.getList();
      this.memberWeekNumsList()
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.nickname+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.remoteMethod(item.pname)
      for (const key in item) {
        if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
        }
      }
      this.editForm.pid = item.pid
      this.selectItem = {
        id:item.pid,
        head_pic:item.phead_pic,
        nickname:item.pname,
      }
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
    selectPname(){
      this.memberList.map(item=>{
        if(item.id == this.editForm.pid){
          this.selectItem = item
        }
      })
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
           this.editForm.sorts = parseInt(this.editForm.sorts)
          if (!this.editFlag) {
            const params =  Object.assign(this.editForm,{id:this.editId}) 
            getMemberEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    //查看订单详情
    handleDetail(row,flag){
        this.$refs.memberDetailChild.init(row,flag)
    },
    // 团队详情
    handleTeamDetail(row){
        this.$refs.teamDetailChild.init(row)
    },
    //充值
    handleRecharge(row){
       this.$refs.rechargeDetailChild.init(row) 
    },
    successRecharge(){
      this.getList();
      this.memberWeekNumsList()
    },
    //来源酒店
    soureHotelDetail(row){
      this.$refs.sourceHotelChild.init(row) 
    },
    //余额,分时积分,专属积分,商城金币记录
    recordDetail(row,flag){
      this.$refs.moneysRecordChild.init(row,flag)
    },
    //导出数据
    exportTable(flag){
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          source:this.listQuery.source,
          sex:this.listQuery.sex,
        }
      }else{
        params = this.listQuery
      }
      getMemberExportExcel(params).then(res=>{
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
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        font-size: 14px;
        margin-left: 10px;
    }
}
.my-dropdown{
  /deep/.el-button-group>.el-button+.el-button {
    height: 28px;
  }
}
/deep/.el-dropdown-menu__item {
  padding: 5px 30px;
}
.font-12{
  font-size: 12px;
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
  color:#008ed8
}
.member-source{
  color:#008ed8;
  cursor: pointer;
}
/deep/.el-tab-pane{
  margin-top: 15px;
}
</style>
