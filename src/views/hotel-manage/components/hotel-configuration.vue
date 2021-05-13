<template>
    <div>
        <el-dialog :visible.sync="configurationDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%">
            <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="140px" style="width:80%;margin-bottom:50px">
                <el-form-item label="平台分佣" prop="rate">
                    <el-select v-model="editForm.rate" placeholder="请选择分佣">
                        <el-option v-for="item in 8" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span>%</span>
                    <span style="color:red;margin-left:20px">0表示取系统默认值</span>
                </el-form-item>
                 <el-form-item label="截止申请退款时间" prop="cancel_time">
                    <el-time-picker v-model="editForm.cancel_time" placeholder="选择时间"  value-format="HH:mm" format='HH:mm'></el-time-picker>
                </el-form-item>
                <el-form-item label="扫码订单分佣" prop="code_rate">
                    <!-- <el-select v-model="editForm.code_rate" placeholder="请选择分佣">
                        <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                    </el-select> -->
                    <el-input v-model="editForm.code_rate" style="display: inline-block;width:150px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    <span>%</span>
                    <span style="color:red;margin-left:20px">0表示取系统默认值</span>
                </el-form-item>
            </el-form>
            <div  slot="footer" class="dialog-footer">
                <el-button size="small" @click="configurationDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHotelEdit} from '@/api/hotel-manage/hotel-list'
    export default {
        data() {
            return {
                configurationDialogVisible: false,
                dialogTitle:'',
                list:'',
                editForm:{
                    rate:8,
                    code_rate:0,
                    cancel_time:'18:00'
                },
                rules:{
                    rate:[{ required: true, message: '请选择', trigger: 'change' }],
                    cancel_time:[{ required: true, message: '请选择', trigger: 'change' }],
                    code_rate: [{ required: true, message: '请输入内容', trigger: 'blur' },
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                }
            }
        },
        methods: {
            init(row) {
                this.configurationDialogVisible = true
                this.list = row
                this.editForm.rate = row.rate
                this.editForm.code_rate = row.code_rate
                this.editForm.cancel_time = row.cancel_time
                this.dialogTitle = row.title+'-酒店配置'
            },
            submitHandle(){
                if(this.editForm.cancel_time == null || this.editForm.cancel_time == ''){
                    this.$message({
                        type: 'warning',
                        message: '请选择免费取消订单时间!'
                    })
                    return
                }
                if(this.editForm.code_rate>10){
                    this.$message({
                        type: 'warning',
                        message: '扫码订单分佣不能大于10%!'
                    })
                    return
                }
                let params =  Object.assign(this.editForm,{id:this.list.id}) 
                getHotelEdit(params).then(res => {
                    if (res.code === 0) {
                        this.$message({
                        type: 'success',
                        message: '编辑成功!'
                        })
                        this.configurationDialogVisible = false
                        this.$emit('successConfiguration')
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>