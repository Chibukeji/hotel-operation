<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '585')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '587')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="排序" align="center" width="250">
        <template slot-scope="{row}">
          <!-- <el-input v-model="row.sorts" /> -->
          <span>{{row.sorts}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="90">
        <template slot-scope="{row}">
          <img v-if="imgShowInit" class="img-table" :src="row.image_url" />
        </template>
      </el-table-column>
      <el-table-column label="数据" align="left" width="200">
        <template slot-scope="{row}">
          <div v-if="row.jump_type == 1">
            <span>(id:{{row.url}}){{row.hotel_name}}</span>
          </div>
          <div v-if="row.jump_type == 2">
            <span>{{row.url}}</span>
          </div>
        </template>
      </el-table-column>
       <el-table-column label="适用端" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.type==0">通用</span>
          <span v-if="row.type==1">公众号</span>
          <!-- <span v-if="row.type==2">APP</span> -->
          <span v-if="row.type==3">安卓</span>
          <span v-if="row.type==4">IOS</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="btnAry.findIndex(x => x.id == '586')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '587')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="" prop="image_url">
            <span slot="label">
                <span style="color:red">*</span>
                <span>图片</span>
                <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
            </span>
            <el-button type="primary" size="small" @click="selectImg('1')" style="display: block;">选择图片</el-button>
            <img v-if="imgShowInit" class="img-certificate" :src="editForm.image_url" />
        </el-form-item>
        <el-form-item label="跳转类型" prop="status">
          <el-radio-group v-model="editForm.jump_type" style="width:100%;text-align: left;" @change="changeType">
            <el-radio :label="1">酒店ID</el-radio>
            <el-radio :label="2">H5页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="editForm.jump_type == 1" label="酒店"   class="select-hotel">
          <span slot="label">
              <span style="color:red">*</span>
              <span>酒店</span>
          </span>
          <el-input v-model="hotelName" :disabled="true"  style="margin-right:10px"/>
          <el-button type="primary" size="small" @click="selectHotel()">选择酒店</el-button>
        </el-form-item>
        <el-form-item v-if="editForm.jump_type == 2" label="跳转url" >
          <span slot="label">
              <span style="color:red">*</span>
              <span>跳转url</span>
          </span>
          <el-input v-model="inputUrl" placeholder="请输入url"/>
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input v-model="editForm.sorts" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>
        <el-form-item label="适用端" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
     <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
    <!-- 商家类型解释 -->
    <el-dialog :visible.sync="merchantTypeHelp" title="详情" width="40%" >
        <div v-html="helpDetail" class="help-detail"></div>
    </el-dialog>
    <!-- 选择酒店 -->
    <select-hotel ref="selectHotelChild" @successHotel="successHotel"/>
  </div>
</template>

<script>
import { getCarouselList,  getCarouselAdd,  getCarouselEdit,  getCarouselDel } from '@/api/slideshow-manage/slideshow-list'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'
import SelectHotel from '@/components/SelectHotel'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,ImgGallery,SelectHotel },
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
        name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        url:[{ required: true, message: '请输入url', trigger: 'blur' }],
        type:[{ required: true, message: '请选择', trigger: 'change' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        jump_type:1,
        name: '',
        sorts:0,
        image_url:'',
        status:'',
        url:'',
        type:0,
      },
      typeList:[
          {name:'通用',id:0},
          {name:'公众号',id:1},
          // {name:'APP',id:2},
          {name:'安卓',id:3},
          {name:'IOS',id:4},
      ],
      calendarTypeOptions: [],
      editFlag:'',
      btnAry:[],
      imgShowInit:true,
      merchantTypeHelp:false,
      helpDetail:'',
      hotelName:'',
      hotelId:'',
      inputUrl:'',
      oldHotelName:'',
      oldHotelId:'',
      oldUrl:'',
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 583 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getCarouselList(this.listQuery).then(res => {
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
      }
      this.getList();
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
    //查看商家类型解释
    merchantTypeDetail(flag){
        this.merchantTypeHelp = true
        if(flag == '1'){
            this.helpDetail = `<div>图片尺寸为：750* 360</div>`
        }
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editForm = {
        name: '',
        status: '1',
        sorts:0,
        image_url:'',
        url:'',
        type:0,
        jump_type:1,
      }
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      // this.dialogTitle = item.name+'-编辑'
      this.dialogTitle ='编辑'
      this.editId = item.id
      this.editFlag = false
      this.editForm = {
        name: item.name,
        sorts:item.sorts,
        image_url:item.image_url,
        status: item.status.toString(),
        url:item.url,
        type:item.type,
        jump_type:item.jump_type,
      }
      if(item.jump_type == 1){
        this.hotelName = `(id:${item.url})${item.hotel_name}`
        this.hotelId = item.url
      }else{
        this.hotelName = ''
        this.inputUrl = item.url
      }
    },
    //选择跳转类型
    changeType(){
      if(this.editForm.jump_type == 1){
        this.hotelName = this.oldHotelName
        this.hotelId = this.oldHotelId
        this.oldUrl = this.inputUrl
      }else if(this.editForm.jump_type == 2){
        this.oldHotelName = this.hotelName
        this.oldHotelId = this.hotelId
        this.inputUrl = this.oldUrl
      }
    },
    //选择酒店
    selectHotel(){
      this.$refs.selectHotelChild.init()
    },
    successHotel(item){
      // console.log(item)
      // this.editForm.url = item.id
      this.hotelId = item.id
      this.hotelName = `(id:${item.id})${item.title}`
    },
    //弹出图片库
    selectImg(flag) {
      this.$refs.imgGalleryChild.init(flag,0,'')
    },
    //获取选择的图片
    selectImgList(data){
      if(data.flag == '1'){
        this.imgShowInit = false
        this.editForm.image_url = data.item[0].file_url
        this.imgShowInit = true
      }
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if(this.editForm.jump_type == 1){
            // console.log(this.hotelId)
            this.editForm.url = this.hotelId
            if(this.editForm.url == '' || this.editForm.url==null){
              this.$message({
                  type: 'success',
                  message: '请选择酒店!'
                })
                return
            }
          }else{
            this.editForm.url = this.inputUrl
            if(this.editForm.url == '' || this.editForm.url==null){
              this.$message({
                  type: 'success',
                  message: '请填写url!'
                })
                return
            }
          }
           this.editForm.sorts = parseInt(this.editForm.sorts)
           if(this.editForm.image_url == '' || this.editForm.image_url==null){
                this.$message({
                  type: 'success',
                  message: '请选择图片!'
                })
                return
           }
          //  console.log(this.editForm)
          if (this.editFlag) {
            const params = this.editForm
            getCarouselAdd(params).then(res => {
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
            getCarouselEdit(params).then(res => {
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
      if (this.btnAry.findIndex(x => x.id == '588') == -1) {
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
        getCarouselEdit(params).then(res => {
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
          getCarouselDel(params).then(res => {
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
          getCarouselDel(params).then(res => {
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
.img-certificate{
    width: 120px;
    margin-top: 10px;
}
.img-table{
    width: 60px;
}
.select-hotel{
  /deep/.el-form-item__content{
    display: flex;
    justify-content: space-between;
  }
}
</style>
