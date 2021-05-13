<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '143')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '145')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
      <!-- <el-input v-model="listQuery.nickname" placeholder="输入用户名称或真实姓名" style="width: 300px;margin-left:20px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="文章标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章副标题" align="center">
        <template slot-scope="{row}">
          <span v-if="row.subtitle == '' || row.subtitle == null">-</span>
          <span v-else>{{ row.subtitle }}</span>
        </template>
      </el-table-column>
       <el-table-column label="缩略图" align="center" width="90">
        <template slot-scope="{row}">
          <img style="width:60px" :src="row.thumb" alt="">
        </template>
      </el-table-column>
       <el-table-column label="分类名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.article_cate_name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="作者" align="center">
        <template slot-scope="{row}">
          <span v-if="row.author == '' || row.author == null">-</span>
          <span v-else>{{ row.author }}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column label="文章简介" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
           <span v-if="row.descript == '' || row.descript == null">-</span>
          <span v-else>{{ row.descript }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="显示" align="center" width="150">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="fixed-width">
        <template slot-scope="{row,$index}">
           <el-button type="primary" size="mini"  @click="copyLink(row)">
            复制链接
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '144')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '145')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="60%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="文章副标题" prop="subtitle">
          <el-input v-model="editForm.subtitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item  prop="thumb">
          <span slot="label">
              <span style="color:red">*</span>
              <span>缩略图</span>
          </span>
          <el-button type="primary" size="small" @click="selectImg('1')" style="display: block;">选择图片</el-button>
          <span v-if="editForm.thumb== '' || editForm.thumb== null"></span>
          <el-image v-else class="img-certificate" :src="editForm.thumb"></el-image>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editForm.author" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分类" prop="article_cate_id">
          <el-select v-model="editForm.article_cate_id" placeholder="请选择分类" style="width:100%">
            <el-option v-for="(item,index) in artileCateList" :key="index" :label="item.title" :value="item.id" :disabled="item.is_father==1">
              <span :style="{'padding-left':item.leftpin+'px'}">{{item.lefthtml}}{{item.title}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="descript">
          <el-input type="textarea" rows="5" v-model="editForm.descript" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="显示" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <tinymce ref="tinymce" v-model="editForm.content" :uploadShow="true" :group_type="'0'" :height="250" style="min-width:600px;width:80%"/>
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sorts">
          <el-input v-model="editForm.sorts" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 复制url -->
    <el-dialog title="复制链接" :visible.sync="urlVisible" width="500px">
      <el-form :model="linkForm"  ref="linkForm" label-width="80px">
          <el-form-item label="H5页面：" prop="url1" >
            <!-- <el-input  v-model="linkForm.url1" :disabled="true" ></el-input> -->
            <span @click="copy(linkForm.url1)" class="link-type tag">{{linkForm.url1}}</span>
          </el-form-item>
          <el-form-item label="微信：" prop="urlWechat" >
            <!-- <el-input  v-model="linkForm.urlWechat" :disabled="true" ></el-input> -->
            <span @click="copy(linkForm.urlWechat)" class="link-type tag">{{linkForm.urlWechat}}</span>
          </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button  size="small " @click="urlVisible = false">取消</el-button>
      </div>
    </el-dialog>
     <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>

<script>
import { getArticleList,  getArticleAdd,  getArticleEdit,  getArticleDel,getArticleInfo } from '@/api/article-manage/article-list'
import { getArtileCateList} from '@/api/article-manage/article-classify'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import ImgGallery from '@/components/ImgGallery'
import mix from '@/mixs/mix'
import Clipboard from 'clipboard' // 复制
export default {
  components: { Pagination,Tinymce,ImgGallery },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        // nickname: '',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        title:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        article_cate_id:[{ required: true, message: '请选择', trigger: 'change' }],
        status:[{ required: true, message: '请选择', trigger: 'change' }],
        content:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        article_cate_id:'',
        title:'',
        subtitle:'',
        author:'',
        descript:'',
        content:'',
        status:1,
        thumb:'',
      },
      calendarTypeOptions: [],
      editFlag:'',
      btnAry:[],
      artileCateList:[],
      urlVisible:false,
      linkForm:{
        url1:'',
        urlWechat:'',
      }
    }
  },
  mounted () {
    this.getList();
    this.getArtileCate()
    this.$store.dispatch('user/showBtn', { id: 139 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getArticleList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20
      }
      this.getList();
    },
    //获取分类列表
    getArtileCate(){
        getArtileCateList().then(res=>{
            this.artileCateList = res.data.data
        })
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
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editForm = {
        article_cate_id:'',
        title:'',
        subtitle:'',
        author:'',
        descript:'',
        content:'',
        status:'1',
        thumb:'',
      }
      this.editFlag = true
      setTimeout(()=>{
        this.$refs.tinymce.setContent('')
      },500)
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.title+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.editForm = {
        status: item.status.toString(),
        // sorts:item.sorts,
        article_cate_id:item.article_cate_id,
        title:item.title,
        subtitle:item.subtitle,
        author:item.author,
        descript:item.descript,
        content:item.content,
        thumb:item.thumb,
      }
      //获取文章内容
      getArticleInfo({id:item.id}).then(res=>{
        let content = res.data.content
        if(content == null || content == ''){
          this.$refs.tinymce.setContent('')
        }else{
          this.$refs.tinymce.setContent(content)
        }
        this.editForm.content = content
      })
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if(this.editForm.thumb == '' || this.editForm.thumb == null){
              this.$message({
                  type: 'warning',
                  message: '请选择缩略图!'
              })
              return
            }
          if (this.editFlag) {
            const params = this.editForm
            getArticleAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          } else {
            const params =  Object.assign(this.editForm,{id:this.editId}) 
            getArticleEdit(params).then(res => {
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
    //复制链接
    copyLink(row){
      this.urlVisible = true
      this.linkForm = {
        url1:row.h5_url,
        urlWechat:row.wechat_url,
      }
    },
    // 复制
    copy(data) {
      const clipboard = new Clipboard('.tag', {
        text: function() {
          return data
        }
      })
      clipboard.on('success', e => {
        this.$message({ message: '复制成功', showClose: true, type: 'success' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message({ message: '复制失败,', showClose: true, type: 'error' })
        clipboard.destroy()
      })
    },
    //弹出图片库
    selectImg(flag) {
      let id  = ''
      if(this.editFlag){
        id  = ''
      }else{
        id = this.editId
      }
      this.$refs.imgGalleryChild.init(flag,0,'')
    },
    //获取选择的图片
    selectImgList(data){
      // console.log(data)
      if(data.flag == '1'){
        this.editForm.thumb = data.item[0].file_url
      }
    },
    // 点击修改状态
    handleStatus(row) {
      // if (this.btnAry.findIndex(x => x.id == '565') == -1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '您没有权限修改'
      //   })
      //   return
      // }
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
        getArticleEdit(params).then(res => {
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
          getArticleDel(params).then(res => {
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
          getArticleDel(params).then(res => {
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
.right-dialog{
    /deep/.el-dialog{
        min-width: 750px;
    }
}
.pop-btn-box{
  text-align: center;
}
.img-certificate{
    width: 120px;
    margin-top: 10px;
}
</style>
