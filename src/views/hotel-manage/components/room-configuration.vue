<template>
    <div>
        <el-dialog :visible.sync="configurationDialogVisible" :title="dialogTitle"  width="500px">
            <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="110px" style="width:80%;margin-bottom:50px">
                <el-form-item label="分佣" prop="rate">
                    <el-select v-model="editForm.rate" placeholder="请选择分佣">
                        <el-option v-for="item in 8" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span>%</span>
                    <div style="color:red;">0表示取系统默认值</div>
                </el-form-item>
                <el-form-item label="扫码订单分佣" prop="code_rate">
                    <el-select v-model="editForm.code_rate" placeholder="请选择">
                        <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span>%</span>
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
import { getHouseTypeEdit} from '@/api/hotel-manage/house-type'
    export default {
        data() {
            return {
                configurationDialogVisible: false,
                dialogTitle:'',
                list:'',
                editForm:{
                    rate:'',
                    code_rate:'',
                },
                rules:{
                    rate:[{ required: true, message: '请选择', trigger: 'change' }],
                    code_rate:[{ required: true, message: '请选择', trigger: 'change' }]
                }
            }
        },
        methods: {
            init(row) {
                this.configurationDialogVisible = true
                this.list = row
                this.editForm.rate = row.rate
                this.editForm.code_rate = row.code_rate
                this.dialogTitle = row.room_name+'-房型配置'
            },
            submitHandle(){
                let params =  Object.assign(this.editForm,{id:this.list.id}) 
                getHouseTypeEdit(params).then(res => {
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