<template>
  <div>
    <div class="filter-container">
      <!-- <span class="filter-item">
        <span class="select-title">代理等级：</span>
        <el-select v-model="listQuery.level" placeholder="代理等级" style="width: 160px" >
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in levelList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员名称/电话" style="width: 350px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '601')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '603')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-down" @click="treeOpen('1')">展开</el-button>
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-up" @click="treeOpen('2')">折叠</el-button>
    </div>
    <el-table v-if="refreshTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
    row-key="id" :default-expand-all="expandIf" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="ID" align="center" width="80" type="">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="标签名称" align="center" >
        <template slot-scope="{row}">
          <span>{{row.title}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="父ID" align="center">
        <template slot-scope="{row}">
          <span v-if="row.pid == '' || row.pid ==null">-</span>
          <span v-else>{{ row.pid }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.is_recommend == 1">是</span>
          <span v-if="row.is_recommend == 0">否</span>
        </template>
      </el-table-column>
       <el-table-column label="列表展示" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.is_list_show == 1">是</span>
          <span v-if="row.is_list_show == 0">否</span>
        </template>
      </el-table-column>
        <el-table-column label="显示" align="center" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="酒店数量" align="center" width="100">
        <template slot-scope="{row}">
          <span >{{row.hotel_nums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理" align="center" width="270" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.is_list == 1 && btnAry.findIndex(x => x.id == '605')!=-1" type="primary" size="mini" @click="dataDetail(row)">数据列表</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '602')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '603')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:90%;margin-bottom:50px">
        <el-form-item label="标签名称" prop="title">
            <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="父级" prop="pid"> 
          <el-select v-model="editForm.pid" class="filter-item" placeholder="不选择默认为顶级" style="width:100%;" clearable>
            <!-- <el-option v-for="(item,index) in pidList" :key="index" :label="item.title" :value="item.id" /> -->
            <el-option v-for="(item,index) in pidList" :key="index" :value="item.id" :label="item.title " :disabled="item.id == editId">
              <div v-if="item.pid == 0">{{ item.title }}</div>
              <div v-else>—— {{ item.title }}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="editForm.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="推荐" prop="is_recommend">
          <el-radio-group v-model="editForm.is_recommend" style="width:100%;text-align: left;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="列表展示" prop="is_list_show">
          <el-radio-group v-model="editForm.is_list_show" style="width:100%;text-align: left;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
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
    <!-- 数据列表 -->
    <data-detail ref="dataDetailChild" />
  </div>
</template>

<script>
import { getScreenTagsList,  getScreenTagsAdd,  getScreenTagsEdit,  getScreenTagsDel,getScreenTagsParent } from '@/api/intelligent-filter/intelligent-list'
import Pagination from '@/components/Pagination'
import  DataDetail from './components/data-detail' 
import mix from '@/mixs/mix'
export default {
  components: { Pagination,DataDetail},
  mixins: [mix],
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20
      },
      levelList:[
        {name:'省代理',value:6},
        {name:'市代理',value:7},
        {name:'区/县代理',value:8}
      ],
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        title:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        // pid:[{ required: true, message: '请选择', trigger: 'change' }],
        is_recommend:[{ required: true, message: '请选择', trigger: 'change' }],
        is_list_show:[{ required: true, message: '请选择', trigger: 'change' }],
        status:[{ required: true, message: '请选择', trigger: 'change' }],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        title:'',
        pid:'',
        sort:0,
        is_recommend:'',
        is_list_show:'',
        status:'',
        color:'#323233'
      },
      calendarTypeOptions: [],
      editFlag:'',
      loadingSearch: false,
      memberList: [],
      provinceList:[],
      loadingSearch2:false,
      addressList:[],
      btnAry:[],
      pidList:[],
      expandIf: false,
       refreshTable: true,
    }
  },
  mounted () {
    this.getList();
    this.getParentList();
    this.$store.dispatch('user/showBtn', { id: 599 }).then(res => {
    //   console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getScreenTagsList().then(res => {
        this.list = res.data.data
        // this.total = res.data.data.total
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
    //获取父级
    getParentList(){
        getScreenTagsParent().then(res=>{
            let list=[]
            for (const item in res.data) {
              const obj = {}
              let children = []
              for (const key in res.data[item]) {
                if (key === 'children') {
                  children = res.data[item][key]
                } else {
                  obj[key] = res.data[item][key]
                }
              }
              list.push(obj)
              list = list.concat(children)
            }
            this.pidList = list
        })
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
     // 点击展开和折叠
    treeOpen(flag) {
      this.refreshTable = false
      if (flag == '1') {
        this.expandIf = true
      } else {
        // console.log(flag)
        this.expandIf = false
      }
      this.$nextTick(() => {
        this.refreshTable = true
      })
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
    handleFilter() {
        this.listQuery.page = 1
        this.getList()
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.$nextTick(()=>{
        this.editForm={
            title:'',
            pid:'',
            sort:0,
            is_recommend:'1',
            is_list_show:'1',
            status:'1',
            color:'#323233'
        }
      })
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.title+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.$nextTick(()=>{
        for (const key in item) {
            if (this.editForm[key] != undefined) {
                this.editForm[key] = item[key]
            }
        }
        this.editForm.is_recommend = item.is_recommend.toString()
        this.editForm.is_list_show = item.is_list_show.toString()
        this.editForm.status = item.status.toString()
        if(this.editForm.pid == 0){
          this.editForm.pid = ''
        }
      })
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let pid = ''
          if(this.editForm.pid == '' || this.editForm.pid ==null){
            pid = 0
          }else{
            pid = this.editForm.pid
          }
          let form ={
            title:this.editForm.title,
            pid:pid,
            sort:this.editForm.sort,
            is_recommend:this.editForm.is_recommend,
            is_list_show:this.editForm.is_list_show,
            status:this.editForm.status,
            color:this.editForm.color
          }
          if (this.editFlag) {
            const params = form
            getScreenTagsAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.getParentList()
                this.editDialogVisible = false
              }
            })
          } else {
            const params =  Object.assign(form,{id:this.editId}) 
            getScreenTagsEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.getParentList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    //查看数据列表
    dataDetail(row){
      this.$refs.dataDetailChild.init(row)
    },
     // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '604') == -1) {
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
        getScreenTagsEdit(params).then(res => {
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
    handleDelete(row) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            ids: row.id
          }
          getScreenTagsDel(params).then(res => {
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
          getScreenTagsDel(params).then(res => {
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
.hotel-name{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
    vertical-align: middle;
    margin-right: 10px;
    position: relative;
    background: #f1f1f1;
}
.el-icon-close{
    cursor: pointer;
}
/deep/.address-select{
  /deep/.el-select-dropdown__item{
    height: 44px!important;
    line-height: 20px;
    border-bottom: 1px solid #eee;
  }
  .explain{
    font-size: 12px;
    color: #aaa;
  }
}

</style>
