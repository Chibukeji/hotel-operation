<template>
  <div class="mixin-components-container">
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">时间范围：</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
        />
      </span>
      <span class="filter-item">
        <span class="select-title">状态：</span>
        <el-select v-model="listQuery.status" placeholder="状态" style="width: 160px">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-input v-model="listQuery.keyword" placeholder="会员昵称/会员电话/会员ID" style="width: 250px" />
      </span>
      <span class="filter-item">
        <el-input v-model="listQuery.order_sn" placeholder="订单号" style="width: 250px" />
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '680')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '681')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
    </div>
    <div style="margin-bottom:20px">
      <el-tabs v-model="listQuery.status" type="card" @tab-click="handleFilter">
        <el-tab-pane v-for="(item,index) in statusList" :key="index" :label="item.name" :name="item.id"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="60" prop="id" />
        <el-table-column label="会员" align="left"   :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <div style="display:flex">
              <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
              <img v-else :src="row.member_head_pic" class="heder-img">
              <span class="member-name">{{row.member_nickname}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间" width="220" >
              <template slot-scope="{row}">
                <span >{{row.apply_time}}</span>
              </template>
          </el-table-column>
        <el-table-column align="center" label="订单号" width="160" prop="order_code" />
        <el-table-column align="center" label="提现金额" width="140" prop="money" />
        <el-table-column align="center" label="提现手续费" width="140" prop="fee" />
        <el-table-column align="center" label="实际到账金额" width="140" prop="receive_money" />
        <el-table-column label="收款方式" align="center" width="140">
          <template slot-scope="{row}">
            <span v-if="row.pay_way==3">银行</span>
            <span v-if="row.pay_way==2">支付宝</span>
            <span v-if="row.pay_way==1">微信</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="140">
          <template slot-scope="{row}">
            <span v-if="row.status==0">申请中</span>
            <span v-if="row.status==1">审核通过</span>
            <span v-if="row.status==2" style="color:red">审核未通过</span>
            <span v-if="row.status==3">已打款</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="200">
          <template slot-scope="{row}">
            <span v-if="row.remark==null || row.remark==''">-</span>
            <span v-else>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1 && btnAry.findIndex(x => x.id == '678')!=-1" type="primary" size="mini" @click="remitList(scope.row)">打款</el-button>
            <el-button v-if="(scope.row.status==0 ||scope.row.status==2 ) && btnAry.findIndex(x => x.id == '677')!=-1" type="primary" size="mini" @click="checkList(scope.row)">审核</el-button>
            <el-button v-if="btnAry.findIndex(x => x.id == '679')!=-1" type="primary" size="mini" @click="detailList(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <!--明细-->
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" class="center-dialog" width="90%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="提现详细" name="first">
          <div class="order-detail">
            <div class="second-line commont-border">
              <div class="left-box item-box">
                <span class="title-name">实际到账金额:</span>
                <span>
                  <div class="item-money first-item">
                    <span class="final-statement">￥{{billDetail.receive_money}}</span>
                    <span class="final-statement"></span>
                  </div>
                  <div class="item-money">
                    <span>提现金额：</span>
                    <span>{{billDetail.money}}</span>
                  </div>
                  <div class="item-money">
                    <span>提现手续费：</span>
                    <span>{{billDetail.fee}}</span>
                  </div>
                  <!-- <div class="item-money" v-if="billDetail.status==3">
                    <span class="remit-title">打款凭证：</span>
                     <el-image :src="billDetail.pay_image" :preview-src-list="srcList" class="remit-img"></el-image>
                  </div> -->
                </span>
              </div>
              <div class="left-box item-box">
                <span class="title-name">打款方式:</span>
                <span>
                  <div class="item-money first-item">
                    <span v-if="billDetail.pay_way==3" class="bank-card">银行</span>
                    <span v-if="billDetail.pay_way==2" class="bank-card">支付宝</span>
                    <span v-if="billDetail.pay_way==1" class="bank-card">微信</span>
                  </div>
                   <div v-if="billDetail.pay_way==3">
                    <div class="item-money">
                      <span>姓名：</span>
                      <span>{{billDetail.bank_acount_name}}</span>
                    </div>
                    <div class="item-money"  v-if="billDetail.pay_way==3">
                      <span>卡号：</span>
                      <span>{{billDetail.bank_card_number}}</span>
                    </div>
                    <div class="item-money"  v-if="billDetail.pay_way==3">
                      <span>银行：</span>
                      <span>{{billDetail.bank_name}}</span>
                    </div>
                  </div>
                  <div v-if="billDetail.pay_way==2">
                    <div class="item-money">
                      <span>支付宝账号：</span>
                      <span>{{billDetail.alipay_account}}</span>
                    </div>
                    <div class="item-money">
                      <span>支付宝账户姓名：</span>
                      <span>{{billDetail.alipay_account_name}}</span>
                    </div>
                  </div>
                  <div v-if="billDetail.pay_way==1">
                    <div class="item-money">
                      <span>微信账号：</span>
                      <span>{{billDetail.wechat_account}}</span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div class="no-withdraw-deposit-box">
              <div class="no-withdraw-deposit-btn">
                <span v-if="billDetail.status==0" class="no-pay-btn">审核中</span>
                <span v-if="billDetail.status==1" class="no-pay-btn">通过</span>
                <span v-if="billDetail.status==2" class="no-pay-btn">未通过</span>
                <span v-if="billDetail.status==3" class="alredy-pay-btn">已打款</span>
                <el-button v-if="billDetail.status==1 && btnAry.findIndex(x => x.id == '678')!=-1" @click="remitList(billDetail)" type="success">打款</el-button>
                <el-button v-if="billDetail.status==0 && btnAry.findIndex(x => x.id == '677')!=-1" @click="checkList(billDetail)" type="success">审核</el-button>
              </div>
              <div class="margin-10" v-if="billDetail.status==3">
                <span>申请会员：</span>
                <div style="display:flex">
                  <img v-if="billDetail.member_head_pic == '' || billDetail.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
                  <img v-else :src="billDetail.member_head_pic" class="heder-img">
                  <span class="member-name">{{billDetail.member_nickname}}</span>
                </div>
              </div>
              <div class="margin-10" v-if="billDetail.status==3">
                <span>打款时间：</span>
                <span>{{billDetail.payment_time}}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="detailStatus ==3" label="打款明细" name="third">
          <el-table :data="remitDetail" border style="width: 100%;margin-top:30px">
            <el-table-column label="打款时间" prop="payment_time" align="center" />
            <el-table-column align="center" label="提现金额" width="140" prop="money" />
            <el-table-column align="center" label="提现手续费" width="140" prop="fee" />
            <el-table-column align="center" label="实际到账金额" width="140" prop="receive_money" />
            <el-table-column label="状态" align="center">
              <template slot-scope="{row}">
                <span v-if="row.status==3">已打款</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 审核弹窗 -->
    <el-dialog :title="checkTitle" :visible.sync="checkVisible"  width="40%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;">
        <el-form-item label="审核" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="editForm.status == 0" label="原因" prop="desc">
          <el-input v-model="editForm.desc" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="checkVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="checkSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 打款弹窗 -->
    <el-dialog :title="remitTitle" :visible.sync="remitVisible"  width="40%">
      <el-form ref="remitForm" :rules="remitRules" :model="remitForm" label-position="left" label-width="120px" style="width:80%;">
        <el-form-item label="打款凭证" prop="pay_image">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          :multiple="false"
          :action="uploadUrl"
          name="image"
          :headers="headers"
          :on-success="addUploadImgSuccess"
          list-type="picture"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="remitForm.pay_image" :src="remitForm.pay_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="remitVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="remitSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // 分页
import { getWithdrawList, getWithdrawAudit, getWithdrawPayment,getWithdrawExport} from '@/api/commissions-detail/withdraw-list'
import mix from '@/mixs/mix'

export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      dateRange: [],
      hotelList: [],
      statusList: [
        { name: '全部', id: '-1' },
        { name: '审核中', id: '0' },
        { name: '审核通过', id: '1' },
        { name: '审核未通过', id: '2' },
        { name: '已打款 ', id: '3' }
      ],
      list: [],
      listQuery: {
        status: '-1',
        keyword:'',
        order_sn:'',
        start_time: '',
        end_time: '',
        page: 1,
        size: 20
      },
      total: 0,
      detailVisible: false,
      DetailTotal: 0,
      detailForm: {
        page: 1,
        size: 10
      },
      billDetail: {},
      activeName: 'first',
      detailTitle: '',
      exportAllloading: false,
      loadingSearch:false,
      merchantList:[],
      detailStatus: "",
      checkTitle:'',
      checkVisible:false,
      checkItme:'',
      rules:{
        status: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      editForm:{
        status:'1',
        desc:'',
      },
      remitTitle:'',
      remitVisible:false,
      remitItme:'',
      remitRules:{
        pay_image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      },
      remitForm:{
        pay_image:''
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + 'uploadImage',
      remitDetail:[],
      srcList:[],
      btnAry:[],
    }
  },
  mounted() {
    this.getList()
    this.$store.dispatch('user/showBtn', { id: 676 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    getList(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      let start_time, end_time
      if (this.dateRange == null || this.dateRange.length === 0) {
        start_time = ''
        end_time = ''
      } else {
        start_time = this.dateRange[0] / 1000
        end_time = this.dateRange[1] / 1000
      }
      let status
      if(this.listQuery.status == '-1'){
        status = ''
      }else{
        status = this.listQuery.status
      }
      const params = {
        start_time: start_time,
        end_time: end_time,
        keyword: this.listQuery.keyword,
        order_sn: this.listQuery.order_sn,
        status:status,
        page: this.listQuery.page,
        size: this.listQuery.size
      }
      getWithdrawList(params).then(res => {
        this.total = res.data.data.total
        this.list = res.data.data.data
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        status: '-1',
        keyword:'',
        order_sn:'',
        start_time: '',
        end_time: '',
        page: 1,
        size: 20
      }
      this.dateRange = []
      this.getList();
    },
    // 搜索商家
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.merchantList = []
      } else {
        this.loadingSearch = true
        getMerchList({ name: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch = false
          this.merchantList = res.data
        })
      }
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    //审核
    checkList(row){
      this.checkItme = row
      this.checkTitle = row.merch_name+'-审核'
      this.checkVisible = true
    },
    checkSubmit(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let params={
            id:this.checkItme.id,
            type:this.editForm.status,
            refuse_remark:this.editForm.desc
          }
          getWithdrawAudit(params).then(res=>{
            if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.checkVisible = false;
                this.detailVisible = false
              }
          })
        }
      })
      
    },
    //打款
    remitList(row){
      this.remitItme = row
      // this.remitTitle = row.merch_name+'-打款'
      // this.remitVisible = true
      // this.remitForm.pay_image = ''
      this.$confirm('确定要打款吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          const params = {
            id: row.id
          }
          getWithdrawPayment(params).then(res => {
              if (res.code === 0) {
              this.$message({
                  type: 'success',
                  message: '打款成功!'
              })
              this.getList()
              }
          })
          })
          .catch(() => {
          this.$message({
              type: 'info',
              message: '已取消'
          })
      })
    },
    addUploadImgSuccess(res, file, fileList) {
      this.remitForm.pay_image = res.data.file_url
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg,jpeg,png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    remitSubmit(){
      this.$refs.remitForm.validate((valid) => {
        if (valid) {
          let params={
            id:this.remitItme.id,
            pay_image:this.remitForm.pay_image,
          }
          getMerchPayment(params).then(res=>{
            if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.remitVisible = false;
                this.detailVisible = false
              }
          })
        }
      })
    },
    detailList(row) {
      this.detailVisible = true
      this.detailForm.page = 1
      this.detailTitle = '提现单详情'
      this.activeName = "first";
      if (row == undefined) {

      } else {
        this.srcList = []
        this.remitDetail = [];
        this.billDetail = row
        this.detailStatus = row.status;
        this.remitDetail.push(row);
        this.srcList.push(row.pay_image)
      }
    },
    // 导出数据
    exportTable(flag) {
      let params
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      let status
      if(this.listQuery.status == '-1'){
        status = ''
      }else{
        status = this.listQuery.status
      }
      if (flag == '1') {
        this.exportAllloading = true
        params = {
          status: status,
          keyword: this.listQuery.keyword,
          order_sn: this.listQuery.order_sn,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time
        }
      } else {
        params = {
          status: status,
          keyword: this.listQuery.keyword,
          order_sn: this.listQuery.order_sn,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time,
          page:this.listQuery.page,
          size:this.listQuery.size,
        }
      }
      getWithdrawExport(params).then(res => {
        // console.log(res)
        this.exportAllloading = false
        if (res.code == 0) {
          window.open(res.data)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-container {
  margin: 10px;
}
.mixin-components-container {
 padding-top:5px ;
}
.component-item {
  min-height: 10px;
}
.el-divider {
  margin: 10px 0;
}
.bank-card {
  // background-color: #f0f2f5;
  height: 150px;
}
.bank-header {
  width: 100%;
  font-size: 17px;
  margin-right: 2%;
}
.bank-header p {
  color: blue;
  font-size: 25px;
  line-height: 0px;
}
.bank {
  width: 23%;
  float: left;
  font-size: 12px;
  margin-right: 2%;
}
.bank p {
  color: blue;
  font-size: 14px;
}
.add-card {
  background-color: #f0f2f5;
  height: 180px;
}
.add-header {
  width: 100%;
  font-size: 17px;
  margin-right: 2%;
}
.add-header p {
  color: rgb(241, 96, 12);
  font-size: 25px;
  line-height: 0px;
}
.add {
  width: 90%;
  float: left;
  font-size: 12px;
  margin-right: 2%;
  margin-bottom: 4px;
}
.add b {
  color: rgb(241, 96, 12);
  font-size: 14px;
}
.el-alert {
  margin-bottom: 10px;
  height: 40px;
}
.el-form-item {
  margin-bottom: 10px;
}
.card-wrap {
  display: flex;
  justify-content: space-between;
  .card-box {
    // width:20%
    flex: 1;
    margin-right: 12px;
  }
  .card-box:last-child {
    margin-right: 0px;
  }
}
.link-type {
  color: blue;
}
.commont-border {
  border-bottom: 1px solid #DCDFE6;
  display: flex;
  padding: 10px 0;
}
.item-box {
  width: 50%;
  display: flex;
  .title-name {
    font-size: 14px;
    color: #606266;
    display: inline-block;
    width: 100px;
    font-weight: bold;
  }
  .final-statement {
    font-size: 24px;
    color: #42b983;
  }
  .item-money {
    margin: 15px 0;
  }
  .first-item {
    margin-top: 0;
  }
  .bank-card {
    color: #1654cc;
  }
}
.no-withdraw-deposit-box {
  margin-top: 20px;
  margin-left: 100px;
  .no-withdraw-deposit-btn {
    font-size: 24px;
    width: 120px;
    text-align: center;
  }
}
.no-pay-btn {
  border: 2px solid orange;
  color: orange;
  padding: 10px;
  display: inline-block;
  margin-bottom: 10px;
}
.alredy-pay-btn {
  border: 2px solid #42b983;
  color: #42b983;
  padding: 10px;
  display: inline-block;
}
.margin-10 {
  margin: 15px 0;
}
/deep/.el-tabs__header{
  margin: 0;
}
.pop-btn-box{
    text-align: center;
    margin-top: 40px;
}
.avatar-uploader {
  /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.el-upload:hover {
    border-color: #409EFF;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  display: block;
}
.remit-title{
  position: absolute;
}
.remit-img{
  width: 100px;
  margin-left: 75px;
}
.order-detail{
  margin-top: 20px;
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
