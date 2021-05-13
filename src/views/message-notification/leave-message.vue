<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">会员：</span>
        <el-select  v-model="listQuery.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
          :remote-method="remoteMethod" :loading="loadingSearch" >
          <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
            <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
            <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
          </el-option>
        </el-select>
      </span>
      <span class="filter-item">
        <span class="select-title">状态：</span>
        <el-select v-model="listQuery.status" placeholder="请选择" style="width：150px">
            <el-option label="全部" value=""></el-option>
            <el-option label="待回复" :value="1"></el-option>
            <el-option label="已回复" :value="2"></el-option>
        </el-select>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '622')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="会员/手机号码" align="left"  width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.member_name}}</span>
          </div>
          <div>{{ row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="250">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="left" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="left" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
           <span v-if="row.reply == '' || row.reply == nul">-</span>
          <span v-else>{{row.reply}}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.status==1">待回复</span>
          <span v-if="row.status==2">已回复</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status==1 && btnAry.findIndex(x => x.id == '623')!=-1" type="primary" size="mini" @click="handleReply(row)">回复</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '622')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="margin-bottom:50px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="editForm.title" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <!-- <tinymce ref="tinymce" v-model="editForm.content"  :height="250" style="min-width:600px;width:80%"/> -->
                <el-input type="textarea" v-model="editForm.content" style="width:80%" rows="5"></el-input>
            </el-form-item>
        </el-form>
        <div  slot="footer" class="dialog-footer">
            <el-button size="small" @click="editDialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLeaveMessageList,getLeaveMessageDel,getLeaveMessageReply} from '@/api/message-notification/leave-message'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,Tinymce },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        member_id: '',
        status:'',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      btnAry:[],
      loadingSearch:false,
      memberList:[],
      editDialogVisible:false,
      dialogTitle:'',
      editForm:{
        title:'',
        content:''
      },
      rules:{
        title:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        content:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      replyItem:'',
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 621 }).then(res => {
    //   console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getLeaveMessageList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        member_id: '',
        status:'',
        page: 1,
        size: 20
      }
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
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    //搜索
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    //回复
    handleReply(row){
        this.replyItem = row
        this.editDialogVisible = true
        this.dialogTitle ='回复'
        this.editForm = {
            title:'',
            content:''
        }
        // setTimeout(()=>{
        //     this.$refs.tinymce.setContent('')
        // },500)
    },
    submitHandle(){
        this.$refs.editForm.validate((valid) => {
            if (valid) {
                let params={
                    id:this.replyItem.id,
                    title:this.editForm.title,
                    content:this.editForm.content,
                }
                getLeaveMessageReply(params).then(res=>{
                    if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '回复成功!'
                    })
                    this.editDialogVisible = false
                    this.getList()
                    }
                })
            }
        
        })
    },
    // 删除单条数据
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          getLeaveMessageDel(params).then(res => {
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
     //删除多条数据
    delMore() {
      if(this.multipleSelection.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        })
        return
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = this.multipleSelection.map(x => { return x.id })
          const params = {
            id: idArr.join(',')
          }
          getLeaveMessageDel(params).then(res => {
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
