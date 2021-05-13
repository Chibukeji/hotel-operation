<template>
    <div>
        <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="70%" >
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="60">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员昵称" align="left" width="180" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                        <img v-else :src="row.head_pic" class="heder-img">
                        <span class="member-name">{{row.mnickname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="回复内容" align="left" :show-overflow-tooltip="true" >
                    <template slot-scope="{row}">
                    <span  class="pop-content">{{ row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否匿名" align="center" width="100">
                    <template slot-scope="{row}">
                        <div v-if="row.is_n == 1">是</div>
                        <div v-if="row.is_n == 0">否</div>
                    </template>
                </el-table-column>
                <el-table-column label="匿名名称" align="center" width="140">
                    <template slot-scope="{row}">
                        <div v-if="row.nickname == '' || row.nickname ==null">-</div>
                        <div v-else>{{ row.nickname }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="{row}">
                    <!-- <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">已审核</el-button> -->
                    <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">未审核</el-button>
                    <span v-if="row.status==1">已审核</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" class-name="fixed-width">
                    <template slot-scope="{row}">
                        <el-button  type="danger" size="mini" icon="el-icon-close" @click.native="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getAnswerList,getAnswerEdit,getAnswerDel} from '@/api/questions-answers/questions-list'
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
                this.dialogTitle = `回复内容`
                this.detailItem = item
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                this.listLoading = true
                getAnswerList({q_id:this.detailItem.id}).then(res=>{
                    this.list = res.data.data.data
                    this.total = res.data.data.total
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
            // 点击修改状态
            handleStatus(row) {
                // if (this.btnAry.findIndex(x => x.id == '562') == -1) {
                //   this.$message({
                //     type: 'warning',
                //     message: '您没有权限修改'
                //   })
                //   return
                // }
                // let text
                // if (row.status == 1) {
                //   text = ''
                // } else if (row.status == 0) {
                //   text = '显示'
                // }
                this.$confirm('确定要审核通过吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // let status
                    // if (row.status == 0) {
                    //   status = 1
                    // } else if (row.status == 1) {
                    //   status = 0
                    // }
                    const params = {
                        id: row.id,
                        status: '1'
                    }
                    getAnswerEdit(params).then(res => {
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
                    getAnswerDel(params).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getList()
                            this.$emit('delAnswersSuccess')
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