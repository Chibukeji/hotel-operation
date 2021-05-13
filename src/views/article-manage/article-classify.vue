<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '140')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <!-- <el-button v-if="btnAry.findIndex(x => x.id == '142')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button> -->
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-down" @click="treeOpen('1')">展开</el-button>
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-up" @click="treeOpen('2')">折叠</el-button>
    </div>
    <el-table v-if="refreshTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange"
    row-key="id" :default-expand-all="expandIf" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column type="" label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" cell-class-name="table-tree">
        <template slot-scope="{row}" >
          <span >{{ row.title }}</span>
        </template>
      </el-table-column>
       <el-table-column label="排序" align="center" width="150">
        <template slot-scope="{row}">
          <!-- <el-input v-model="row.sort" /> -->
          <span>{{row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="150">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="btnAry.findIndex(x => x.id == '141')!=-1 && row.id!=1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '142')!=-1 && row.id!=1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <span v-if="row.id==1">-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="上级" prop="pid">
          <el-select v-model="editForm.pid" placeholder="不选择默认为顶级" style="width:100%" clearable>
            <!-- <el-option label="顶级" :value="0"></el-option> -->
            <el-option v-for="(item,index) in selectList" :key="index" :label="item.title" :value="item.id" :disabled="item.id==1">
              <span :style="{'padding-left':item.leftpin+'px'}">{{item.lefthtml}}{{item.title}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')"/>
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
  </div>
</template>

<script>
import { getArtileCateList,  getArtileCateAdd,  getArtileCateEdit,  getArtileCateDel } from '@/api/article-manage/article-classify'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
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
        // pid:[{ required: true, message: '请选择', trigger: 'change' }]
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        title: '',
        status: '1',
        sort:0,
        pid:''
      },
      calendarTypeOptions: [],
      editFlag:'',
      expandIf: true,
      refreshTable: true,
      btnAry:[],
      selectList:[],
      pTitle:'',
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 138 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getArtileCateList({type:'children'}).then(res => {
        this.list = res.data.data
        // this.total = res.data.data.total
        this.listLoading = false
      })
      getArtileCateList().then(res => {
        this.selectList = res.data.data
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
    // paginHandle(val) {
    //   if (val != undefined) {
    //     const json = JSON.parse(JSON.stringify(val))
    //     this.listQuery.page = parseInt(json.page)
    //     this.listQuery.size = parseInt(json.limit)
    //   }
    //   this.getList()
    // },
    // 点击节点
    handleCheck: function(val) {
      this.pTitle = val.title
      this.editForm.pid = val.id
    },
    // 清空
    handleClear: function(val) {
      if (!val || val === '') {
        this.editForm.pid = ''
      }
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editForm = {
        title: '',
        status: '1',
        sort:0,
        pid:''
      }
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      console.log(item)
      this.editDialogVisible = true
      this.dialogTitle = item.title+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.editForm = {
        title: item.title,
        status: item.status.toString(),
        sort:item.sort,
        pid:item.pid,
      }
      if(this.editForm.pid == 0){
        this.editForm.pid = ''
      }
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
          this.editForm.sort = parseInt(this.editForm.sort)
          let params = {
            title: this.editForm.title,
            status:this.editForm.status,
            sort:this.editForm.sort,
            pid:pid,
          }
          if (this.editFlag) {
            getArtileCateAdd(params).then(res => {
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
            let params = {
              id:this.editId,
              title:this.editForm.title,
              sort:this.editForm.sort,
              status:this.editForm.status
            }
            getArtileCateEdit(params).then(res => {
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
      if (row.id == 1) {
        this.$message({
          type: 'warning',
          message: '此项不能修改'
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
        getArtileCateEdit(params).then(res => {
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
      // if(row.pid == 0){
      //   this.$message({
      //     type: 'warning',
      //     message: '请先删除完子级再删除父级'
      //   })
      //   return
      // }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          getArtileCateDel(params).then(res => {
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
          getArtileCateDel(params).then(res => {
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
/deep/.el-tabs__header {
  margin: 0 0 20px;
}
</style>
