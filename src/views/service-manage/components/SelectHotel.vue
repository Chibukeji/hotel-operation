<template>
    <div>
        <el-dialog :visible.sync="merchantDialogVisible" title="选择酒店" width="40%" class="center-dialog">
            <div class="content-box">
                <div class="top-tool">
                    <el-input v-model="listQuery.keyword" placeholder="搜索酒店" style="width: 300px" class="filter-item" />
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter" style="height:36px">搜索</el-button>
                </div>
                <div class="radio-box" v-loading="listLoading">
                     <el-checkbox-group v-model="radio">
                        <el-checkbox v-for="(item,index) in merchantList" :key="index" :label="item.id" class="radio-btn">{{item.title}}</el-checkbox>
                    </el-checkbox-group>
                    <el-button v-if="this.listQuery.page < this.total" size="small" type="primary" 
                    style="display:block;margin:20px auto 40px;" @click="loadMore" :loading="btnMore">加载更多</el-button>
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
import { getHotelList } from '@/api/hotel-manage/hotel-list'

    export default {
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
                    size:20,
                },
                total:0,
                radio:[],
                merchantList:[],
                businessScope:[],
                classify:[],
                btnMore:false,
            }
        },
        mounted () {
            
        },
        methods: {
            init(){
                this.merchantDialogVisible = true
                this.getList()
            },
            // 获取列表
            getList() {
                this.listLoading = true
                getHotelList(this.listQuery).then(res => {
                    this.merchantList = res.data.data.data
                    this.total = res.data.data.total
                    this.listLoading = false
                    // console.log(this.merchantList)
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            //加载更多
            loadMore(){
                let page
                if(this.listQuery.page < this.total){
                    page = this.listQuery.page+1
                }else{
                    return
                }
                let params={
                    page:page,
                    size:this.listQuery.size
                }
                this.btnMore = true
                getHotelList(params).then(res => {
                    this.btnMore = false
                    let arr = res.data.data.data
                    arr.map(item=>{
                        this.merchantList.push(item)
                    })
                })
            },
            // 点击确定
            submit(){
                let arr=[]
                let arr1 = this.radio.map(item =>item);
                this.merchantList.map((item,index)=>{
                    if (arr1.includes(item.id)) {
                        arr.push(item)
                    }
                })
                // console.log(arr)
                this.$emit('getHotelData',arr)
                this.merchantDialogVisible = false
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
        }
    }
}
/deep/.el-dialog .el-dialog__body {
    // height: auto;
}
</style>