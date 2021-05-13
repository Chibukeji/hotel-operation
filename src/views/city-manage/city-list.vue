<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <span class="filter-item">
        <span class="select-title">选择默认城市：</span>
        <el-cascader v-model="placeOrigin" :placeholder="citys_name" :props="belongRegoinProps"  clearable class="city-select" style="width:300px"></el-cascader>
      </span>
      <el-button v-if="btnAry.findIndex(x => x.id == '561')!=-1" class="filter-item" type="primary" size="mini" @click="handleSave">保存</el-button>
    </div>
    <!-- <el-table v-if="refreshTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" 
    row-key="code" :default-expand-all="expandIf" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" lazy
    :load="load"> -->
    <el-table v-if="refreshTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type='' label="id" prop="id" width="250px" align="center"/>
      <el-table-column type='' label="code" prop="code" width="250px" align="center"/>
      <el-table-column label="城市" align="center">
        <template slot-scope="{row}" >
          <span @click="cityDetail(row)" class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="center-dialog" width="30%">
      <span style="font-weight: bold;">{{dialogTitle}}</span>
      <el-tree :props="props" :load="loadMore" lazy ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { allAddressList} from '@/api/common'
import { getDefaultCity,setDefaultCity} from '@/api/city-manage/hot-city'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      belongRegoinProps: {
            checkStrictly: true,
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
      expandIf: false,
      refreshTable: true,
      editDialogVisible:false,
      dialogTitle:'',
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      node_had:[],
      resolve_had:'',
      placeOrigin:[],
      citys_name:'',
      btnAry:[],
    }
  },
  mounted () {
    this.getList();
    this.getDefaultCityData()
    this.$store.dispatch('user/showBtn', { id: 34 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    // 获取省列表
    getList() {
      this.listLoading = true
      allAddressList().then(res => {
        this.list = []
        let arr = res.data.data
        arr.map(item=>{
            item.hasChildren = true
        })
        this.list = arr
        // this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //获取默认城市
    getDefaultCityData(){
      getDefaultCity().then(res=>{
        this.placeOrigin.push(res.data.code)
        this.citys_name = res.data.name
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20,
      }
      this.getList();
      this.getDefaultCityData()
    },
    //保存默认城市
    handleSave(){
      let code 
      if(this.placeOrigin.length == 2){
        code = this.placeOrigin[1]
      }else if(this.placeOrigin.length == 1){
        code = this.placeOrigin[0]
      }
      setDefaultCity({code:code}).then(res=>{
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: `保存成功!`
          })
        }
      })
    },
    load(tree, treeNode, resolve) {
        allAddressList({code:tree.code}).then(res => {
            let arr = res.data.data
            arr.map(item=>{
              if(tree.level === 3){
                item.hasChildren = false
              }else{
                item.hasChildren = true
              }
            }) 
            resolve(arr)
        })
    },
    // 点击翻页
    // paginHandle(val) {
    //   if (val != undefined) {
    //     const json = JSON.parse(JSON.stringify(val))
    //     this.listQuery.page = parseInt(json.page)
    //     this.listQuery.size = parseInt(json.limit)
    //   }
    //   this.handleClick()
    // },
    cityDetail(row){
      this.editDialogVisible = true
      this.dialogTitle = row.name
      this.editItem = row
      this.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadMore(this.node_had, this.resolve_had);
    },
    loadMore(node, resolve){
        if(typeof(resolve) != 'function' ){
          return
        }
        let code 
        if (node.level === 0) {
          this.node_had = node;
          this.resolve_had = resolve;
          code = this.editItem.code
        }else if (node.level >=1) {
          code = node.data.code
        }
        allAddressList({code:code}).then(res => {
            let arr = res.data.data
            if(node.level === 2){
               arr.map(item=>{
                   item.leaf = true
               }) 
            }
            resolve(arr)
        })
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
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-tabs__header {
  margin: 0 0 20px;
}
.city-select{
  /deep/.el-input__inner::placeholder{
    color: #606266;
  }
}
</style>
