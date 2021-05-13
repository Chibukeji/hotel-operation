<template>
    <div class="data-detail-page">
        <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%">
            <div class="filter-container">
                <span class="filter-item">
                    <el-select  v-model="hotel_id" filterable clearable remote placeholder="请输入酒店名称/酒店编号搜索"
                    :remote-method="remoteMethod" :loading="loadingSearch" style="width:300px">
                    <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
                </span>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
            </div>
            <div>
                <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" >
                    <el-table-column label="酒店名称" align="center" >
                        <template slot-scope="{row}">
                        <span>{{row.hotel_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="标签名称" align="center">
                        <template slot-scope="{row}">
                        <span>{{ row.tags_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100" class-name="fixed-width">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getScreenTagsDetailList,  getScreenTagsDetailListAdd,  getScreenTagsDetailListDel} from '@/api/intelligent-filter/intelligent-list'
import { getHotelList} from '@/api/hotel-manage/hotel-list'
    export default {
        components: { Pagination},
        data() {
            return {
               editDialogVisible:false, 
               dialogTitle:'',
               detailItem:'',
               listLoading:false,
               list:[],
               listQuery:{
                   page:1,
                   size:20,
               },
               total:0,
               loadingSearch:false,
               hotel_id:'',
               hotelList:[],
            }
        },
        methods: {
            init(item) {
                this.editDialogVisible = true
                this.detailItem = item
                this.dialogTitle = item.title+"-数据列表"
                this.getList()
            },
            getList(){
                this.listLoading = true
                getScreenTagsDetailList({screen_tags_id:this.detailItem.id}).then(res=>{
                    this.list = res.data.data.data
                    this.total = res.data.data.total
                    this.listLoading = false
                })
            },
            //搜索酒店
            remoteMethod(query) {
                if (query !== '') {
                    this.loadingSearch = true
                    getHotelList({ keyword: query, page: 1, size: 9999,}).then(res => {
                        this.loadingSearch = false
                        this.hotelList = res.data.data.data
                    })
                } else {
                    this.hotelList = []
                }
            },
            handleCreate(){
                if(this.hotel_id == '' || this.hotel_id == null){
                    this.$message({
                        type: 'warning',
                        message: '请选择酒店!'
                    })
                    return
                }
                let params={
                    hotel_id:this.hotel_id,
                    screen_tags_id:this.detailItem.id
                }
                getScreenTagsDetailListAdd(params).then(res=>{
                    if(res.code == 0){
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        })
                        this.getList()
                    }
                })
            },
           // 删除单条数据
            handleDelete(row) {
            this.$confirm('确认要删除吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                    ids: row.id
                }
                getScreenTagsDetailListDel(params).then(res => {
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
            // 点击翻页
            paginHandle(val) {
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery.page = parseInt(json.page)
                    this.listQuery.size = parseInt(json.limit)
                }
                this.getList()
            },
        },
    }
</script>

<style lang="scss" scoped>
.data-detail-page{

}
</style>