<template>
    <div>
        <el-dialog :visible.sync="scoreDialogVisible" :title="propData.title +'-赠送专属积分'" class="right-dialog" custom-class="left" width="60%">
            <div class="filter-container">
                <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '607')!=-1" class="filter-item" type="primary" size="mini" @click="handleRecharge">充值</el-button>
            </div>
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="积分" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="充值时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员" align="left" width="200" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <img :src="row.member_head_pic" class="heder-img">
                    <span style="vertical-align: middle;">{{row.member_nickname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <span v-if="row.remark == '' || row.remark == null">-</span>
                        <span v-else>{{ row.remark }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
        <!-- 充值弹窗 -->
        <recharge-form ref="rechargeDetailChild" @successRecharge="successRecharge"/>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import RechargeForm from "./recharge-form";
import {getScoreList } from '@/api/hotel-manage/hotel-list'
    export default {
        components: { Pagination,RechargeForm},
        data() {
            return {
                scoreDialogVisible:false,
                propData: '',
                listQuery:{
                    page:1,
                    size:20,
                },
                total:0,
                listLoading:false,
                list:[],
                btnAry:[],
            }
        },
        mounted(){
             this.$store.dispatch('user/showBtn', { id: 42 }).then(res => {
                let btn = res.children
                let item = btn.find(x => x.id == '606')
                this.btnAry = item.children
                // console.log(this.btnAry)
            })
        },
        methods: {
            init(row) {
               this.scoreDialogVisible = true 
               this.propData = row
               this.listQuery.page = 1
               this.getList()
            },
            getList(){
                this.listLoading = true
                let params={
                    hotel_id:this.propData.id,
                    page:this.listQuery.page,
                    size:this.listQuery.size 
                }
                getScoreList(params).then(res=>{
                    this.list = res.data.data
                    this.total = res.data.total
                    this.listLoading = false
                })
            },
            //刷新
            refresh(){
                this.listQuery.page = 1
                this.getList();
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
            //充值
            handleRecharge(){
                this.$refs.rechargeDetailChild.init(this.propData) 
            },
            successRecharge(){
                this.getList();
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
</style>