<template>
    <div>
        <el-dialog :visible.sync="merchantDialogVisible" title="酒店运营人员" width="40%" class="center-dialog">
            <div class="content-box">
                <div class="radio-box">
                     <el-radio-group v-model="radio">
                        <el-radio v-for="(item,index) in adminList" :key="index" :label="item.id" class="radio-btn">{{item.truename}}</el-radio>
                    </el-radio-group>
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
import { getHotelAdmin } from '@/api/hotel-manage/hotel-list'
    export default {
        data() {
            return {
                merchantDialogVisible: false,
                adminList:[],
                radio:''
            }
        },
        mounted () {
            
        },
        methods: {
            init(){
                this.merchantDialogVisible = true
                this.getHotelAdminList();
            },
            // 获取运营人员
            getHotelAdminList(){
                getHotelAdmin().then(res=>{
                    this.adminList = res.data
                })
            },
            // 点击确定
            submit(){
                let data
                this.adminList.map(item=>{
                    if(item.id == this.radio){
                       data = item 
                       this.$emit('getAdminDatd',data)
                       this.merchantDialogVisible = false
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.content-box{
   
    .radio-box{
        margin-bottom: 20px;
        .radio-btn{
            margin-bottom: 20px;
            width: 33%;
            margin-right: 0px;
        }
    }
}
/deep/.el-radio-group{
    width: 100%;
}
/deep/.el-radio__label{
    width: calc(100% - 15px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    display: inline-block;
}
</style>