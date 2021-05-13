<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">代理等级：</span>
        <el-select v-model="listQuery.level" placeholder="代理等级" style="width: 160px" >
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in levelList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="会员名称/电话" style="width: 350px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '579')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '581')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <el-table-column label="会员昵称" align="left" width="180" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex"> 
            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.member_head_pic" class="heder-img">
            <span class="member-name">{{row.member_nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员真实姓名" align="center">
        <template slot-scope="{row}">
          <span v-if="row.member_real_name == '' || row.member_real_name ==null">-</span>
          <span v-else>{{ row.member_real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span v-if="row.member_phone == '' || row.member_phone ==null">-</span>
          <span v-else>{{ row.member_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理等级" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.level == 6">省代理</span>
          <span v-if="row.level == 7">市代理</span>
          <span v-if="row.level == 8">区/县代理</span>
        </template>
      </el-table-column>
      <el-table-column label="代理区域" align="center">
        <template slot-scope="{row}">
          <span>{{ row.area_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.rate }}</span>
        </template>
      </el-table-column>
       <el-table-column label="添加时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理" align="center" width="270" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnAry.findIndex(x => x.id == '580')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.level == 6 && btnAry.findIndex(x => x.id == '589')!=-1" type="primary" size="mini" @click="cityDetail(row)">查看下级</el-button>
          <el-button v-if="row.level == 7 && btnAry.findIndex(x => x.id == '589')!=-1" type="primary" size="mini" @click="countyDetail(row)">查看下级</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '581')!=-1" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:90%;margin-bottom:50px">
        <el-form-item label="会员昵称" prop="member_id">
           <el-select  v-model="editForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
              <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
              <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
           <el-radio-group v-model="editForm.level" @change="getLevelRate">
                <el-radio v-for="(item,index) in levelList" :key="index" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="佣金比例" prop="rate">
          <span style="margin-right:10px"><el-input v-model="editForm.rate" style="display: inline-block;width:205px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>%</span>
        </el-form-item>
        <el-form-item label="代理地址" prop="code">
            <el-select  v-model="editForm.code" filterable clearable  remote  placeholder="请输关键词搜索"
            :remote-method="remoteAddressMethod" :loading="loadingSearch2" popper-class="address-select" :popper-append-to-body="false" style="width: 300px;">
            <el-option v-for="item in addressList" :key="item.code" :label="item.name" :value="item.code" >
              <div>{{item.name}}</div>
              <div class="explain">{{item.title}}</div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 城市代理 -->
    <city-agent ref="cityAgentChild" />
    <!-- 区县代理 -->
    <county-agent ref="countyAgentChild" />
  </div>
</template>

<script>
import { getAgentList,  getAgentAdd,  getAgentEdit,  getAgentDel,getRate,searchArea } from '@/api/agent-manage/agent-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
import { allAddressList } from '@/api/common'
import Pagination from '@/components/Pagination'
import  CityAgent from './components/city-agent' 
import CountyAgent from './components/county-agent'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,CityAgent,CountyAgent},
  mixins: [mix],
  data() {
    return {
      listQuery: {
        keyword: '',
        level:'',
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
        member_id:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        level:[{ required: true, message: '请输入内容', trigger: 'change' }],
        rate:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        code:[{ required: true, message: '请选择', trigger: 'change' }]
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        member_id: '',
        level:'',
        rate:'',
        code:'',
      },
      calendarTypeOptions: [],
      editFlag:'',
      loadingSearch: false,
      memberList: [],
      provinceList:[],
      loadingSearch2:false,
      addressList:[],
      btnAry:[],
    }
  },
  mounted () {
    this.getList();
    this.$store.dispatch('user/showBtn', { id: 577 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getAgentList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //获取省市区街道地址
    getAddressList(flag){
        let code
        if(flag == undefined){
            code = null
        }else{

        }
        allAddressList({code:code}).then(res=>{
            if(flag == undefined){
                this.provinceList = res.data.data
            }else{

            }
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
        this.$refs.editForm.resetFields();
        this.editForm.level = 6
        this.getLevelRate()
      })
      this.editFlag = true
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = item.member_nickname+'-编辑'
      this.editId = item.id
      this.editFlag = false
      this.$nextTick(()=>{
        for (const key in item) {
            if (this.editForm[key] != undefined) {
                this.editForm[key] = item[key]
            }
        }
        this.editForm.code = item.code.toString()
        // this.getLevelRate()
        this.remoteMethod(item.member_nickname)
        this.remoteAddressMethod(item.area_name)
      })
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
    // 搜索地址
    remoteAddressMethod(query) {
      if (query !== '') {
        this.loadingSearch2 = true
        searchArea({ name: query}).then(res => {
          this.loadingSearch2 = false
          this.addressList = res.data
        })
      } else {
        this.addressList = []
      }
    },
    //获取分润比例
    getLevelRate(){
      getRate({level:this.editForm.level}).then(res=>{
        this.editForm.rate = res.data
      })  
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.editFlag) {
            const params = this.editForm
            getAgentAdd(params).then(res => {
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
            getAgentEdit(params).then(res => {
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
    //查看下级
    cityDetail(row){
      this.$refs.cityAgentChild.init(row)
    },
    countyDetail(row){
      this.$refs.countyAgentChild.init(row)
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
          getAgentDel(params).then(res => {
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
          getAgentDel(params).then(res => {
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
