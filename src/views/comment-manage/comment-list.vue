<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <el-select v-model="listQuery.score" placeholder="评分" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in scoreList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.status" placeholder="显示" style="width: 160px">
            <el-option label="全部" value="" />
           <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员昵称/酒店名称/评论内容" style="width:300px" class="filter-item" />
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
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.member_nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" align="left" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span  class="pop-content">{{ row.content }}</span>
          <!-- @click="lookDetail(row.content)" -->
        </template>
      </el-table-column>
      <el-table-column label="回复" align="left" :show-overflow-tooltip="true" >
        <template slot-scope="{row}">
          <span v-if="row.reply == null || row.reply  ==''">-</span>
          <span v-else v-html="row.reply" class="pop-content"></span>
           <!-- @click="lookDetail(row.reply)" -->
        </template>
      </el-table-column>
       <el-table-column label="评论标签" align="center" width="170" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.tags == null || row.tags ==''">-</span>
          <span v-else class="back-color table-back">{{row.tags}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论/回复时间" align="center" width="160">
        <template slot-scope="{row}">
          <div>{{ row.create_time }}</div>
          <div v-if="row.reply_time == '' || row.reply_time == null">-</div>
          <div v-else>{{ row.reply_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnAry.findIndex(x => x.id == '501')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" style="margin-bottom:10px">
            回复
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '502')!=-1" type="danger" size="mini" icon="el-icon-close" @click.native="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="45%"> 
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:90%;margin-bottom:50px">
        <el-form-item label="酒店名称" class="no-edit">
          <span>{{editItem.hotel_name}}</span>
        </el-form-item>
        <el-form-item label="评分" class="no-edit">
          <span>{{editItem.score}}</span>
        </el-form-item>
        <el-form-item label="评论内容" class="no-edit">
          <span>{{editItem.content}}</span>
        </el-form-item>
        <el-form-item label="评论标签" class="no-edit">
          <span class="back-color" style="padding:0px 10px">{{editItem.tags}}</span>
        </el-form-item>
        <el-form-item label="评论图片" class="no-edit">
          <!-- <img v-for="(item,index) in editList" :key="index" :src="item" class="comment-img"> -->
          <el-image v-for="(item,index) in editList" :key="index"  style="width:100px;;margin-right:10px" :src="item"  :preview-src-list="srcList">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="评论时间" class="no-edit">
          <span>{{editItem.create_time}}</span>
        </el-form-item>
        <el-form-item label="会员昵称" class="no-edit">
          <span>{{editItem.member_nickname}}</span>
        </el-form-item>
        <el-form-item label="会员姓名" class="no-edit">
          <span>{{editItem.member_realname}}</span>
        </el-form-item>
        <el-form-item label="显示" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回复内容" prop="reply">
          <!-- <tinymce ref="tinymce" v-model="editForm.reply"  :height="250" style="min-width:600px;width:80%"/> -->
          <el-input type="textarea" v-model="editForm.reply" rows="5"></el-input>
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
  </div>
</template>

<script>
import { getCommentList, getCommentEdit,getCommentDel} from '@/api/comment-manage/comment-list'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import mix from '@/mixs/mix'
import a from 'file-saver'
export default {
  components: { Pagination,Tinymce },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        // nickname: '',
        page: 1,
        size: 20,
        score:null,
        status:null,
        keyword:'',
      },
      scoreList:[
        {name:'1',value:'1星'},
        {name:'2',value:'2星'},
        {name:'3',value:'3星'},
        {name:'4',value:'4星'},
        {name:'5',value:'5星'}
      ],
      statusList:[
        {name:'否',value:'0'},
        {name:'是',value:'1'},
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
        reply: '',
        status:0,
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
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 31 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getCommentList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20,
        score:null,
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
      this.detailContent = ''
      this.detailVisible = true
      this.detailContent = row
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      // this.dialogTitle = item.name+'-编辑'
      this.dialogTitle ='回复-'+item.member_nickname
      this.editId = item.id
      this.editFlag = false
      this.editItem = item
      this.editList=[]
      if(item.list_pic == '' || item.list_pic == null){

      }else{
        this.editList= item.list_pic.split(',')
      }
      this.srcList = this.editList
      this.editForm = {
        reply: item.reply,
        status: item.status.toString(),
      }
      // setTimeout(()=>{
      //   if(item.reply == null || item.reply == ''){}else{
      //       this.$refs.tinymce.setContent(item.reply)
      //   }
      // },500)
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
           this.editForm.sorts = parseInt(this.editForm.sorts)
          if (this.editFlag) {
           
          } else {
            const params =  Object.assign(this.editForm,{id:this.editId}) 
            getCommentEdit(params).then(res => {
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
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '562') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      let text
      if (row.status == 1) {
        text = '不显示'
      } else if (row.status == 0) {
        text = '显示'
      }
      this.$confirm('确定要改为' + text + '状态吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status
        if (row.status == 0) {
          status = 1
        } else if (row.status == 1) {
          status = 0
        }
        const params = {
          id: row.id,
          status: status
        }
        getCommentEdit(params).then(res => {
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
            ids: row.id
          }
          getCommentDel(params).then(res => {
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
            ids: idArr.join(',')
          }
          getCommentDel(params).then(res => {
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
