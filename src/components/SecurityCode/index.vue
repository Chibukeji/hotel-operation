<template>
    <div>
        <!-- 操作码弹窗 -->
        <el-dialog title="安全码" :visible.sync="delVisible" width="500px">
            <el-form :model="delForm" :rules="delRules" ref="delForm" label-width="100px">
                <el-form-item label="安全码：" prop="safe_password">
                <el-input v-model="delForm.safe_password" style="width:80%" placeholder="请输入安全码"></el-input>
                </el-form-item>
            </el-form>
            <div class="pop-btn-box">
                <el-button type="primary" size="small " @click="delSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { checkSafePwd } from '@/api/security-code'
    export default {
        data() {
            return {
                delVisible: false,
                delForm:{
                    safe_password:''
                },
                delRules:{
                    safe_password: [
                        { required: true, message: '请输入安全码', trigger: 'blur' },
                    ],
                },
                detailItem:'',
                flag:'',
            }
        },
        methods: {
            init(item,flag){
                this.delVisible = true
                this.delForm.code = ''
                this.detailItem = item
                this.delForm.safe_password = '',
                this.flag = flag
            },
            delSubmit() {
                this.$refs.delForm.validate((valid) => {
                    if (valid) {
                        let params={
                            password:this.delForm.safe_password
                        }
                        checkSafePwd(params).then(res=>{
                            if(res != undefined && res.code == 0){
                                // this.$message({
                                //     type: 'success',
                                //     message: res.msg
                                // })
                                this.delVisible = false
                                this.$emit('confirmSubmit',this.flag)
                            }
                            
                        })
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