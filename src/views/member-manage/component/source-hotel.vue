<template>
    <div>
        <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="50%" >
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="酒店编号" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.hotel_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="酒店名称" align="left">
                    <template slot-scope="{row}">
                    <span>{{ row.hotel_name }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getmemberSource } from '@/api/member-manage/member-list'
import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination },
        data() {
            return {
                detailDialogVisible: false,
                dialogTitle:'',
                detailItem:'',
                listLoading:false,
                list:[],
                listQuery:{
                   page:1, 
                   size:10,
                },
                total:0,
            }
        },
        methods: {
            init(item) {
                this.detailDialogVisible = true
                this.dialogTitle = `${item.nickname}-来源酒店`
                this.detailItem = item
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                this.listLoading = true
                getmemberSource({member_id:this.detailItem.id}).then(res=>{
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

</style>