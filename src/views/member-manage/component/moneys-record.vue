<template>
    <div>
        <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="70%" class="center-dialog" >
            <el-table v-if="flag == 1" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="id" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="订单号" align="center" width="200">
                    <template slot-scope="{row}">
                    <span>{{ row.order_sn }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag == 2 || flag == 3" label="积分" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="flag == 1 " label="余额" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.money }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="left">
                    <template slot-scope="{row}">
                    <span>{{ row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="flag == 2 || flag == 3" >
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="first"></el-tab-pane>
                    <el-tab-pane label="可用积分" name="second"></el-tab-pane>
                    <el-tab-pane label="过期积分" name="third"></el-tab-pane>
                </el-tabs>
                <aside>
                    <span>总积分：</span>
                    <span class="color-text" style="margin-right:20px;color:red">{{totalData.total_score}}</span>
                </aside>
                <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="id" align="center" width="80">
                        <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="酒店" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="{row}">
                        <span>{{ row.hotel_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="过期时间" align="center" width="160">
                        <template slot-scope="{row}">
                        <span>{{ row.validly_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="订单号" align="center" width="200">
                        <template slot-scope="{row}">
                        <span>{{ row.order_sn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="flag == 2 || flag == 3" label="积分" align="center" width="100">
                        <template slot-scope="{row}">
                        <span>{{ row.score }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="flag == 1 " label="余额" align="center" width="100">
                        <template slot-scope="{row}">
                        <span>{{ row.money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" align="left">
                        <template slot-scope="{row}">
                        <span>{{ row.remark }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" align="center" width="160">
                        <template slot-scope="{row}">
                        <span>{{ row.create_time }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
             <el-table v-if="flag == 4" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="id" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="金币" align="center" width="100">
                    <template slot-scope="{row}">
                    <span>{{ row.gold }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员" align="left"  :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <div style="display:flex">
                        <img v-if="row.head_pic == '' || row.head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                        <img v-else :src="row.head_pic" class="heder-img">
                        <span class="member-name">{{row.member_name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="left">
                    <template slot-scope="{row}">
                    <span>{{ row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getMoneySource,getDivtimeSource,getExclusiveSource,getGoldSource } from '@/api/member-manage/member-list'
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
                flag:'',
                totalData:{
                    total_score:0,
                },
                activeName:'first',
            }
        },
        methods: {
            init(item,flag) {
                this.detailDialogVisible = true
                let text 
                if(flag == 1){
                    text = '余额'
                }else if(flag == 2){
                    text = '分时积分'
                }else if(flag == 3){
                    text = '专属积分'
                }else if(flag == 4){
                    text = '商城金币'
                }
                this.dialogTitle = `${item.nickname}-${text}记录`
                this.detailItem = item
                this.flag = flag
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                let flag = this.flag 
                this.listLoading = true
                let is_validly
                if(this.activeName == 'first'){
                   is_validly = 0
                }else if(this.activeName == 'second'){
                   is_validly = 1
                }else if(this.activeName == 'third'){
                   is_validly = 2
                }
                let params1={
                    member_id:this.detailItem.id,
                    page:this.listQuery.page, 
                    size:this.listQuery.size,
                }
                let params2={
                    member_id:this.detailItem.id,
                    page:this.listQuery.page, 
                    size:this.listQuery.size,
                    is_validly:is_validly
                }
                if(flag == 1){
                    getMoneySource(params1).then(res=>{
                        this.list = res.data.data.data
                        this.total = res.data.data.total
                        this.listLoading = false
                    })
                }else if(flag == 2){

                    getDivtimeSource(params2).then(res=>{
                        this.list = res.data.data.data
                        this.total = res.data.data.total
                        this.totalData = res.data.totalData
                        this.listLoading = false
                    })
                }else if(flag == 3){
                    getExclusiveSource(params2).then(res=>{
                        this.list = res.data.data.data
                        this.total = res.data.data.total
                        this.totalData = res.data.totalData
                        this.listLoading = false
                    })
                }else if(flag == 4){
                   getGoldSource(params1).then(res=>{
                        this.list = res.data.data.data
                        this.total = res.data.data.total
                        this.listLoading = false
                    })
                }
               
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
            //点击tab
            handleClick(){
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