<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="服务商名称/服务商地址/联系人/手机号" style="width: 350px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="服务商名称" align="center" >
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理酒店" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hotel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务商地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{row.link_person}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.rate }}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column label="添加时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rate }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="270" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="rateDetail(row)">查看佣金</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
        <el-form-item label="服务商名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="editForm.password" placeholder="请输入登录密码"/>
        </el-form-item>
        <el-form-item label="联系人" prop="link_person">
          <el-input v-model="editForm.link_person" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号" oninput="value=value.replace(/[^\d]/g,'')"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入电子邮箱"/>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item  >
            <span slot="label">
                <span style="color:red">*</span>
                <span>管理酒店</span>
            </span>
          <el-button type="primary" size="small" @click="selectHotel" style="margin-right:20px">选择</el-button>
           <span class="hotel-name" v-for="(item,index) in hotelList" :key="index">{{item.title}}
               <i class="el-icon-close" @click="delHotel(index)"></i>
           </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 选择酒店弹窗 -->
    <select-hotel ref="selectHotelChild" @getHotelData="getHotelData"/>
    <!-- 佣金详情 -->
    <rate-detail ref="rateDetailChild" />
  </div>
</template>

<script>
import { getServiceList,  getServiceAdd,  getServiceEdit,  getServiceDel } from '@/api/service-manage/service-list'
import Pagination from '@/components/Pagination'
import  SelectHotel from './components/SelectHotel' 
import  RateDetail from './components/rate-detail' 
import mix from '@/mixs/mix'
export default {
  components: { Pagination,SelectHotel,RateDetail },
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
      if (reg.test(value)) {
        return callback()
      }
      callback('请输入正确的手机号')
    }
    return {
      listQuery: {
        keyword: '',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        password: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        mobile:[{  validator: checkPhone,required: true, message: '请输入正确的手机号码', trigger: 'blur' }],
        address:'',
        link_person:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        email:[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        name: '',
        password: '',
        mobile:'',
        address:'',
        link_person:'',
        email:'',
        hotel_ids:'',
      },
      calendarTypeOptions: [],
      editFlag:'',
      hotelList:[]
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getServiceList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
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
    handleFilter() {
        this.listQuery.page = 1
        this.getList()
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.$nextTick(()=>{
        this.editForm = {
        name: '',
        password: '',
        mobile:'',
        address:'',
        link_person:'',
        email:'',
        hotel_ids:'',
      }
      })
      this.editForm.hotel_ids = ''
      this.hotelList = []
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.name+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.$nextTick(()=>{
        for (const key in item) {
            if (this.editForm[key] != undefined) {
                this.editForm[key] = item[key]
            }
        }
        this.hotelList = []
        if(item.hotel_name == '' || item.hotel_name == null){
            
        }else{
            let arr = item.hotel_name.split(',')
            let arr2 = item.hotel_ids.split(',')
            arr.map((item,i)=>{
                let json={title:item,id:arr2[i]}
                this.hotelList.push(json)
            })
        }
        this.editForm.password = item.password_show
      })
    },
    // 选择酒店
    selectHotel(){
        this.$refs.selectHotelChild.init()
    },
    getHotelData(data){
        let arr = [...this.hotelList,...data]
        const res = new Map();  //定义常量 res,值为一个Map对象实例
        //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        this.hotelList = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1)) 
    },
    delHotel(i){
        this.hotelList.splice(i,1)
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let ids = this.hotelList.map(x => { return x.id })
          this.editForm.hotel_ids = ids.join(',')
          if (this.hotelList.length === 0) {
            this.$message({
                type: 'warning',
                message: '请选择酒店!'
            })
            return
          }
          if (this.editFlag) {
            const params = this.editForm
            getServiceAdd(params).then(res => {
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
            getServiceEdit(params).then(res => {
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
    //查看佣金
    rateDetail(row){
      this.$refs.rateDetailChild.init(row)
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
          getServiceDel(params).then(res => {
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
          getServiceDel(params).then(res => {
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
</style>
