<template>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="50%" >
        <el-form :model="payForm" :rules="payRules" ref="payForm" label-width="100px">
        <el-form-item label="充值类型" prop="type">
          <el-radio-group v-model="typeRadio">
            <el-radio label="1">积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item  label="积分">
          <span>{{scoreItem.score}}</span>
        </el-form-item> -->
        <el-form-item label="会员" prop="member_id">
            <el-select  v-model="payForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
                :remote-method="remoteMethod" :loading="loadingSearch" >
                <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
                    <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                    <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="payForm.type">
            <el-radio v-for="(item,index) in typeList1" :key="index" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-input v-model="payForm.score" style="width:200px" placeholder="请输入数量" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="detailDialogVisible = false">取消</el-button>
        <el-button :loading="btnLoading" size="small" type="primary" @click="paySubmit">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {rechargeScore } from '@/api/hotel-manage/hotel-list'
import { getSearchMemberList} from '@/api/member-manage/member-list'
    export default {
        data() {
            return {
                dialogTitle: "",
                detailDialogVisible: false,
                typeRadio:'1',
                payForm:{
                    hotel_id:'',
                    type:1,
                    member_id:'',
                    score:'',
                },
                payRules:{
                    score: [{ required: true, message: '请输入内容', trigger: 'blur' },],
                    member_id: [{ required: true, message: '请选择', trigger: 'change' }],
                    type: [{ required: true, message: '请选择', trigger: 'change' }],
                },
                typeList1:[
                    {value:1,label:'增加'},
                    {value:2,label:'减少'},
                    {value:3,label:'最终'}
                ],
                scoreItem:'',
                loadingSearch: false,
                memberList: [],
                btnLoading:false,
            }
        },
        methods: {
            init(item) {
                // console.log(item)
                this.detailDialogVisible = true
                this.dialogTitle = `充值`
                this.payForm.hotel_id = item.id
                this.scoreItem = item
            },
            // 搜索会员
            remoteMethod(query) {
                if (query == '' || query == null) {
                    this.memberList = []
                } else {
                    this.loadingSearch = true
                    getSearchMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
                    this.loadingSearch = false
                    this.memberList = res.data.data
                    })
                }
            },
            paySubmit(){
                this.$refs.payForm.validate((valid) => {
                    if (valid) {
                        this.btnLoading = true
                        rechargeScore(this.payForm).then(res=>{
                            this.btnLoading = false
                            if(res.code == 0){
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                })
                                this.detailDialogVisible = false
                                this.$emit('successRecharge')
                            }
                        })
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.pop-btn-box{
    text-align: center;
    margin-top: 40px;
}
</style>