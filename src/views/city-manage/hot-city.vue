<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '508')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '510')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
      <!-- <el-input v-model="listQuery.nickname" placeholder="输入用户名称或真实姓名" style="width: 300px;margin-left:20px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="排序" align="center" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.sort" oninput="value=value.replace(/[^\d]/g,'')" @change="changeSort($event,row)"/>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.city_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="150">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">是</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button v-if="btnAry.findIndex(x => x.id == '509')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button> -->
          <el-button v-if="btnAry.findIndex(x => x.id == '510')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item prop="province_id" v-if="editFlag">
            <span slot="label">
                <span style="color:red">*</span>
                <span>选择城市</span>
            </span>
            <el-cascader v-model="destination" :placeholder="citys_name" :props="belongRegoinProps" clearable style="width:100%" class="city-select"></el-cascader>
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
import { getHotCityList,  getHotCityAdd,  getHotCityEdit,  getHotCityDel } from '@/api/city-manage/hot-city'
import { allAddressList } from '@/api/common'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
        belongRegoinProps: {
            // checkStrictly: true,
            value:'code',
            label:'name',
            lazy: true,
            lazyLoad: (node, resolve) => {
              this.$nextTick(()=>{
                this.getAreaForLazyLoad(node, resolve)
              })
            }
        },//级联框prop
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
            city_name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        },
        editDialogVisible: false,
        dialogTitle: '',
        editForm: {
            city_name: '',
            status: '1',
            sort:0,
        },
        calendarTypeOptions: [],
        editFlag:'',
        citys_name:'',
        destination:[],
        btnAry:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 35 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getHotCityList().then(res => {
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
    getAreaForLazyLoad(node, resolve) {
        // console.log(node)
        const  level  = node.level
        if(level >= 2){
            resolve()
            return
        }
        let params = {
          code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
              childProjects = res.data.data
              childProjects.map(item => {
                item.leaf = level >= 1; //判断是否为末尾节点
              })
              resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
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
        city_name: '',
        status: '1',
        sort:0,
      }
      this.editFlag = true
      this.citys_name = ''
      this.destination = []
    },
    // 更新排序
    changeSort(sort, row) {
      getHotCityEdit({
        id: row.id,
        sort
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '排序成功!'
          })
          this.getList()
        }
      })
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.city_name+'-编辑'
      this.editId = item.id
      this.editFlag = false
      // this.destination =[]
      // this.destination[1] =item.code
      this.editForm = {
        // code:item.code,
        status: item.status.toString(),
        sort:item.sort,
      }
      this.citys_name = item.city_name
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
            this.editForm.sort = parseInt(this.editForm.sort)
            if (this.editFlag) {
              if(this.destination.length == 0){
                this.$message({
                  type: 'warning',
                  message: '请选择城市!'
                })
                return
              }else{
                this.editForm.code = this.destination[1]
              }
                const params = this.editForm
                getHotCityAdd(params).then(res => {
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
                const params ={
                  id:this.editId,
                  status: this.editForm.status,
                  sort:this.editForm.sort,
                }  
                getHotCityEdit(params).then(res => {
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
      if (this.btnAry.findIndex(x => x.id == '563') == -1) {
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
        getHotCityEdit(params).then(res => {
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
          getHotCityDel(params).then(res => {
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
          getHotCityDel(params).then(res => {
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
.city-select{
  /deep/.el-input__inner::placeholder{
    color: #606266;
  }
}
</style>
