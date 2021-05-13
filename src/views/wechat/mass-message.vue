<template>
  <div class="mass-message-page">
    <div class="top-box">
        <div style="color:red;margin-bottom:20px">给48小时内交互用户推送内部消息</div>
        <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px">
            <el-form-item label="客户端" prop="type">
                <el-checkbox-group v-model="editForm.type">
                    <el-checkbox label="4" name="type">公众号</el-checkbox>
                    <el-checkbox label="5" name="type">IOS(苹果)</el-checkbox>
                    <el-checkbox label="6" name="type">APK(安卓)</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="标题" prop="title" style="width:500px">
                <el-input v-model="editForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容" prop="content" style="width:500px">
                <el-input type="textarea" v-model="editForm.content" placeholder="请输入内容" rows="4" />
            </el-form-item>
        </el-form>
        <div class="btn-bottom"  style="margin-bottom:20px;margin-left:80px;">
            <el-button v-if="btnAry.findIndex(x => x.id == '633')!=-1" size="small" type="primary" @click="sendHandle">定时发送</el-button>
            <el-button v-if="btnAry.findIndex(x => x.id == '634')!=-1" size="small" type="primary" @click="submitHandle">提交</el-button>
        </div>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" width="300px" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span class="desc-box-div">{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.send_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户端" align="center">
          <template slot-scope="{row}">
            <span v-if="row.send_type.includes(4)" class="back-color">公众号</span>
            <span v-if="row.send_type.includes(5)" class="back-color">IOS</span>
            <span v-if="row.send_type.includes(6)" class="back-color">APK</span>
          </template>
        </el-table-column>
        <el-table-column label="发送总人数" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.member_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功/失败" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.success }}</span>/
            <span>{{ row.fail }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="btnAry.findIndex(x => x.id == '635')!=-1" label="操作" align="center" width="100" class-name="fixed-width">
            <template slot-scope="{row,$index}">
                <el-button size="mini" type="danger"  @click="handleDelete(row,$index)">
                    删除
                </el-button>
            </template>
      </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    </div>
     <!-- 内容详情弹窗 -->
    <el-dialog  :visible.sync="logDialogVisible" title="内容详情" width="30%">
      <div>{{itemDetail}}</div>
    </el-dialog>
     <!--定时弹窗 -->
    <el-dialog  :visible.sync="timeDialogVisible" title="选择时间"  width="400px">
        <span>发送时间：</span>
       <el-date-picker class="hide-btn-pick" v-model="time" type="datetime" placeholder="选择日期时间" 
       :picker-options="pickerOptionsStart" @change="handleSelectDate()" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
       <div class="time-pop-btn">
        <el-button size="small" @click="timeDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="timeClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSengMessageList,getSengMessageAdd,getSengMessageDel} from '@/api/wechat/mass-message'
import { getToken } from '@/utils/auth' 
import { parseTime } from '@/utils'
export default {
  components: { Pagination },
  data() {
    return {
      editForm:{
        type:['4'],
        title:'',
        content:'',
      },
      rules:{
        type:[{ type: 'array', required: true, message: '请至少选择一个客户端', trigger: 'change' }],
        title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
        content:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
      listLoading: false,
      list: [],
      menuList:[],
      logDialogVisible:false,
      itemDetail:'',
      timeDialogVisible:false,
      time:'',
       pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      btnAry:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 632 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    //提交
    submitHandle(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let date = new Date()
          let time = parseTime(date,'{y}-{m}-{d} {h}:{i}')
          let params = {
            send_type:this.editForm.type.join(','),
            title:this.editForm.title,
            content:this.editForm.content,
            send_time:time,
          }
          getSengMessageAdd(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getList()
            }
          })
        }
      })
    },
    //定时发送
    sendHandle(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.timeDialogVisible = true
          this.time = ''
        }
      })
    },
    timeClick(){
      if(this.time == '' || this.time == null){
         this.$message({
              message: '请选择发送时间',
              type: 'warning',
              duration: 5 * 1000
          }) 
          return
      }
      if(this.sendTimeIo){
          this.$message({
              message: '发送时间最早也要为5分钟之后',
              type: 'warning',
              duration: 5 * 1000
          }) 
          return
      }
      let params = {
        send_type:this.editForm.type.join(','),
        title:this.editForm.title,
        content:this.editForm.content,
        send_time:this.time,
      }
      getSengMessageAdd(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
          this.timeDialogVisible = false
        }
      })
    },
    handleSelectDate(){
      const startAt =new Date(this.time)
      let date = new Date()
      date.setMinutes(date.getMinutes()+5)
    //   console.log(startAt)
    //   console.log(date)
      if(startAt < date){
        this.$message({
          message: '发送时间最早也要为5分钟之后',
          type: 'warning',
          duration: 5 * 1000
        })
        this.sendTimeIo = true
        // this.time = ''
      }else{
        this.sendTimeIo = false
      }
    },
    //获取列表
    getList(){
      getSengMessageList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    //内容详情
    detailHandle(row){
      this.logDialogVisible = true
      this.itemDetail = row.content
    },
    // 删除单条数据
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          const params = {
            id: row.id
          }
          getSengMessageDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
  },
}
</script>

<style lang="scss" scoped>
.mass-message-page{
  .top-box{
    margin-bottom:20px;
    border-bottom: 1px solid #dedede;
  }
  .time-pop-btn{
      margin-top: 20px;
      text-align: center;
  }
  .back-color{
    background: #e8f4ff;
    padding: 5px 10px;
    font-size: 12px;
  }
}
.desc-box-div{
  cursor: pointer;
  color: #409eff;
}
 
</style>
