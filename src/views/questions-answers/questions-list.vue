<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <el-select v-model="listQuery.is_n" placeholder="选择" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in scoreList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.status" placeholder="状态" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员昵称/酒店名称/问题内容" style="width:300px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table ref="table" v-loading="listLoading" :data="list" border fit highlight-current-row style="width:100%;" >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="酒店名称" align="left"  width="200" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.hotel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" align="left" width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.mnickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题标题" align="left" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span >{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题内容" align="left" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span  class="pop-content">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复" align="center" width="100" >
        <template slot-scope="{row}">
          <!-- <span v-if="row.reply == null || row.reply  ==''">-</span> -->
          <span v-if="row.answer_num == 0">{{row.answer_num}}条</span>
          <span v-else class="pop-content" @click="lookDetail(row)">{{row.answer_num}}条</span>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" align="center" width="160">
        <template slot-scope="{row}">
          <div>{{ row.create_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否匿名" align="center" width="100">
        <template slot-scope="{row}">
          <div v-if="row.is_n == 1">是</div>
          <div v-if="row.is_n == 0">否</div>
        </template>
      </el-table-column>
      <el-table-column label="匿名名称" align="center" width="160">
        <template slot-scope="{row}">
          <div v-if="row.nickname == '' || row.nickname ==null">-</div>
          <div v-else>{{ row.nickname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <!-- <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">已审核</el-button> -->
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">未审核</el-button>
          <span v-if="row.status==1">已审核</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnAry.findIndex(x => x.id == '674')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" style="margin-bottom:10px">
            回复
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '675')!=-1" type="danger" size="mini" icon="el-icon-close" @click.native="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="45%"> 
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:90%;margin-bottom:50px">
        <el-form-item label="回复内容" prop="content">
          <!-- <tinymce ref="tinymce" v-model="editForm.reply"  :height="250" style="min-width:600px;width:80%"/> -->
          <el-input type="textarea" v-model="editForm.content" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="是否匿名">
          <el-radio-group v-model="editForm.is_n">
            <el-radio :label="1">匿名</el-radio>
            <el-radio :label="0">未匿名</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="editForm.is_n == 2" label="会员昵称" prop="member_id">
            <span slot="label">
              <span style="color:red">*</span>
              <span>会员昵称</span>
            </span>
           <el-select  v-model="editForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
              <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
              <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 内容详情 -->
    <el-dialog :visible.sync="detailVisible" title="详情" width="30%" >
      <div v-html="detailContent" class="help-detail"></div>
    </el-dialog>
    <!-- 回复列表 -->
    <answers-list ref="answersListChild" @delAnswersSuccess="delAnswersSuccess" />
  </div>
</template>

<script>
import { getQuestionsList,getQuestionsDel,getQuestionsUpdate,getAnswerAdd} from '@/api/questions-answers/questions-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import AnswersList from './component/answers-list'
import mix from '@/mixs/mix'
import a from 'file-saver'
export default {
  components: { Pagination,Tinymce,AnswersList },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20,
        is_n:'',
        status:null,
        keyword:'',
      },
      scoreList:[
        {name:'匿名',value:'1'},
        {name:'未匿名',value:'0'}
      ],
      statusList:[
        {name:'未审核',value:'0'},
        {name:'已审核',value:'1'},
      ],
      total: 0,
      listLoading: false,
      list: [],
      rules: {
        reply:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        hotel_id:'',
        q_id:'',
        content: '',
        member_id:'',
        is_n:'1'
      },
      calendarTypeOptions: [],
      editFlag:'',
      editItem:'',
      editList:[],
      multipleSelection:[],
      srcList:[],
      btnAry:[],
      detailVisible:false,
      detailContent:'',
      loadingSearch: false,
      memberList: [],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 672 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getQuestionsList(this.listQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20,
        is_n:'',
        status:null,
        keyword:'',
      }
      this.getList();
    },
    //搜索
    handleFilter(){
      this.listQuery.page = 1
      this.getList();
    },
    delAnswersSuccess(){
      this.getList();
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
    //查看回复和评论详情
    lookDetail(row){
      this.$refs.answersListChild.init(row)
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      // this.dialogTitle = item.name+'-编辑'
      this.dialogTitle ='回复-'+item.mnickname
      this.editId = item.id
      this.editFlag = false
      this.editItem = item
      this.editForm = {
        hotel_id:item.hotel_id,
        q_id:item.id,
        content: '',
        member_id:'',
        is_n:1
      }
      // setTimeout(()=>{
      //   if(item.reply == null || item.reply == ''){}else{
      //       this.$refs.tinymce.setContent(item.reply)
      //   }
      // },500)
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
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
           this.editForm.sorts = parseInt(this.editForm.sorts)
          if (this.editFlag) {
          } else {
            getAnswerAdd(this.editForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '回复成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '673') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限审核'
        })
        return
      }
      // let text
      // if (row.status == 1) {
      //   text = ''
      // } else if (row.status == 0) {
      //   text = '显示'
      // }
      this.$confirm('确定要审核通过吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let status
        // if (row.status == 0) {
        //   status = 1
        // } else if (row.status == 1) {
        //   status = 0
        // }
        const params = {
          id: row.id,
          status: '1'
        }
        getQuestionsUpdate(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
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
          getQuestionsDel(params).then(res => {
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
          getQuestionsDel(params).then(res => {
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
.no-img-box{
  width: 60px;
  height: 60px;
  background: #f5f7fa;
  font-size: 12px;
  color: #c0c4cc;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-edit{
  margin-bottom: 5px!important;
}
.comment-img{
  width: 100px;
}
.back-color{
  display: inline-block;
  background: #e8f4ff;
  padding: 5px 10px;
}
.table-back{
  display: inline-block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
.pop-content{
  // box-sizing: border-box;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // word-break: break-all;
  cursor: pointer;
  color: #409eff;
}
</style>
