<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '593')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '595')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐位名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板" align="center" width="90">
        <template slot-scope="{row}">
          <!-- <img  class="img-table" :src="templateList[row.template].name" /> -->
          <span>模板{{row.template}}</span>
        </template>
      </el-table-column>
       <el-table-column label="适用端" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.type==0">通用</span>
          <span v-if="row.type==1">公众号</span>
          <span v-if="row.type==2">安卓</span>
          <span v-if="row.type==3">IOS</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="btnAry.findIndex(x => x.id == '597')!=-1" type="primary" size="mini"  @click="handleDataList(row)">
           数据列表
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '594')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '595')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
        <el-form-item label="推荐位名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入推荐位名称" />
        </el-form-item>
        <el-form-item label="选择端" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板" prop="template">
          <el-radio-group v-model="editForm.template" style="width:100%;text-align: left;">
            <span class="template-box" v-for="(item,index) in templateList" :key="index">
              <img :src="item.src" class="template-item">
              <el-radio  :label="item.id">
                <span>{{item.name}}</span>
              </el-radio>
            </span>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 数据类表 -->
    <data-list ref="dataListChild" />
  </div>
</template>

<script>
import { getRecommendList,  getRecommendAdd,  getRecommendEdit,  getRecommendDel } from '@/api/recommend-manage/recommend-list'
import Pagination from '@/components/Pagination'
import DataList from './components/data-list'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,DataList},
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
        type:[{ required: true, message: '请选择', trigger: 'change' }],
        template:[{ required: true, message: '请选择', trigger: 'change' }],
        status:[{ required: true, message: '请选择', trigger: 'change' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        name: '',
        status:'',
        template:'',
        type:0,
      },
      typeList:[
          {name:'通用',id:0},
          {name:'公众号',id:1},
          {name:'安卓',id:2},
          {name:'IOS',id:3},
      ],
      templateList:[
        {src:require('../../assets/images/recommend/template1.png'),name:'模板1',id:1},
        {src:require('../../assets/images/recommend/template2.png'),name:'模板2',id:2},
        {src:require('../../assets/images/recommend/template3.png'),name:'模板3',id:3},
        {src:require('../../assets/images/recommend/template4.png'),name:'模板4',id:4},
      ],
      calendarTypeOptions: [],
      editFlag:'',
      btnAry:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 591 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getRecommendList(this.listQuery).then(res => {
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
        status: '0',
        template:1,
        type:0,
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
        status: item.status.toString(),
        type:item.type,
        template:item.template,
      }
    },
    // 弹窗确定
    submitHandle() {
        // console.log(this.editForm)
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.editFlag) {
            const params = this.editForm
            getRecommendAdd(params).then(res => {
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
            getRecommendEdit(params).then(res => {
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
    handleDataList(row){
      this.$refs.dataListChild.init(row)
    }, 
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '596') == -1) {
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
        getRecommendEdit(params).then(res => {
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
          getRecommendDel(params).then(res => {
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
          getRecommendDel(params).then(res => {
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
.template-box{
  text-align: center;
  display: inline-block;
  width: 25%;
  .template-item{
    width: 100%;
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  // /deep/.el-radio__input{
  //   top: 70px;
  //   left: -20px;
  // }
  /deep/.el-radio__label{
    padding-left: 2px;
  }
}
</style>
