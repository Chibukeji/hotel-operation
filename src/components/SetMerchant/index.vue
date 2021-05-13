<template>
    <div>
        <el-dialog :visible.sync="merchantDialogVisible" title="设置商家" width="750px" class="center-dialog">
            <div class="content-box">
                <div class="top-tool">
                    <span class="filter-item">
                        <el-select v-model="listQuery.merch_scope_id" placeholder="选择经营范围" style="width: 160px">
                            <el-option label="全部" value="" />
                            <el-option v-for="(item,index) in businessScope" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </span>
                    <span class="filter-item">
                        <el-select v-model="listQuery.merch_cate_id" placeholder="所属分类" style="width: 160px">
                            <el-option label="全部" value="" />
                            <el-option v-for="(item,index) in classify" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </span>
                    <el-input v-model="listQuery.keyword" placeholder="搜索商家" style="width: 200px" class="filter-item" />
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter" style="height:36px">搜索</el-button>
                </div>
                <div class="radio-box" v-loading="listLoading">
                     <el-radio-group v-model="radio">
                        <el-radio v-for="(item,index) in merchantList" :key="index" :label="item.id" class="radio-btn">{{item.name}}</el-radio>
                    </el-radio-group>
                    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
                </div>
            </div>
            <div  slot="footer" class="dialog-footer">
                <el-button size="small" @click="merchantDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getMerchantList,getBusinessScopeList,getMerchantClassifyList } from '@/api/merchant-manage/merchant-list'
import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination},
        data() {
            return {
                merchantDialogVisible: false,
                listLoading:false,
                listQuery:{
                    merch_scope_id:'',
                    merch_cate_id:'',
                    status:3,
                    keyword: '',
                    page:1,
                    size:40,
                },
                total:0,
                radio:'',
                merchantList:[],
                businessScope:[],
                classify:[],
            }
        },
        mounted () {
            
        },
        methods: {
            init(item){
                this.merchantDialogVisible = true
                this.getList()
                this.businessScopeList()
                this.merchantClassifyList()
                this.radio = item.merch_id
            },
            // 获取列表
            getList() {
                this.listLoading = true
                getMerchantList(this.listQuery).then(res => {
                    this.merchantList = res.data.data.data
                    this.total = res.data.data.total
                    this.listLoading = false
                    // console.log(this.merchantList)
                })
            },
            //获取经营范围
            businessScopeList() {
                getBusinessScopeList().then(res => {
                    this.businessScope = res.data
                })
            },
            //商家分类
            merchantClassifyList() {
                getMerchantClassifyList().then(res => {
                    this.classify = res.data
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
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
            // 点击确定
            submit(){
                let data
                this.merchantList.map(item=>{
                    if(item.id == this.radio){
                       data = item 
                       this.$emit('getMerchantDatd',data)
                       this.merchantDialogVisible = false
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.content-box{
    // overflow: hidden;
    .top-tool{
        margin-bottom: 30px;
    }
    .radio-box{
        // overflow: auto;
        // margin-top:30px ;
        // height: calc(100vh - 350px);
        // margin-bottom: 20px;
        .radio-btn{
            margin-bottom: 20px;
            width: 33%;
            margin-right: 0px;
        }
    }
}
/deep/.el-dialog .el-dialog__body {
    // height: auto;
}
/deep/.el-pagination .el-select .el-input {
    width: 85px;
}
/deep/.el-radio__label{
    width: calc(100% - 15px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    display: inline-block;
}
/deep/.el-pagination__jump{
    margin-left: 14px;
}
/deep/.el-pagination {
    padding: 2px 0px;
}
/deep/.el-radio-group{
    width: 100%;
}
/deep/.el-radio__inner{
    vertical-align: middle;
}
</style>