<template>
    <div>
        <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="50%" class="center-dialog">
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="会员" align="left" width="220" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <div style="display:flex"> 
                            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                            <img v-else :src="row.member_head_pic" class="heder-img">
                            <span class="member-name">{{row.member_nickname}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="过期积分" align="center" >
                    <template slot-scope="{row}">
                    <span>{{row.validly_score}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过期时间" align="center">
                    <template slot-scope="{row}">
                    <span>{{row.validly_time}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getOverdueOrderDetailList} from '@/api/order/overdue-order'
import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination},
        data() {
            return {
                detailDialogVisible: false,
                dialogTitle:'',
                listLoading:false,
                list:[],
                detailItem:'',
                total:0,
                listQuery:{
                    page: 1,
                    size: 20,
                },
            }
        },
        methods: {
            init(item) {
                this.detailDialogVisible = true
                this.detailItem = item
                this.dialogTitle = item.hotel_name+'-详情'
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                this.listLoading = true
                let params= Object.assign(this.listQuery,{id:this.detailItem.id})
                getOverdueOrderDetailList(params).then(res=>{
                    this.list = res.data.data
                    this.total = res.data.total
                    this.listLoading = false
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