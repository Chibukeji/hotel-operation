<template>
    <div>
        <!-- 操作码弹窗 -->
        <el-dialog title="选择酒店" :visible.sync="delVisible" width="500px">
            <el-form :model="editForm" :rules="delRules" ref="editForm" label-width="100px">
                <el-form-item label="酒店：" prop="hotel_id">
                    <el-select  v-model="editForm.hotel_id" filterable clearable remote placeholder="请输入酒店名称/酒店编号搜索"
                    :remote-method="remoteMethod" :loading="loadingSearch" style="width:300px">
                    <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
                </el-form-item>
            </el-form>
            <div class="pop-btn-box">
                <el-button type="primary" size="small " @click="delVisible = false">取消</el-button>
                <el-button type="primary" size="small " @click="delSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHotelList} from '@/api/hotel-manage/hotel-list'
    export default {
        data() {
            return {
                delVisible: false,
                editForm:{
                    hotel_id:'',
                },
                delRules:{
                    hotel_id:[{ required: true, message: '请选择酒店', trigger: 'change' }],
                },
                loadingSearch:false,
                hotelList:[],
            }
        },
        methods: {
            init(item){
                this.delVisible = true
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
            delSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                       this.delVisible = false
                       const index =  this.hotelList.findIndex((item) => item.id === this.editForm.hotel_id)
                       this.$emit('successHotel',this.hotelList[index])
                    } else {
                        return false;
                    }
                });
               
            }
        },
    }
</script>

<style lang="scss" scoped>
.pop-btn-box{
    text-align: center;
}
</style>