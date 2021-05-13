<template>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="50%" >
        <el-form :model="payForm" :rules="payRules" ref="payForm" label-width="100px">
        <el-form-item label="充值类型：" prop="type">
          <el-radio-group v-model="payForm.type">
            <el-radio label="1">余额</el-radio>
            <!-- <el-radio label="2">充值[季度/年费]会员</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="payForm.type ==1" label="金额：" prop="gold">
          <span>{{payForm.gold}}</span>
        </el-form-item>
        <el-form-item label="类型：">
          <el-radio-group v-if="payForm.type ==1" v-model="payForm.addType1">
            <el-radio v-for="(item,index) in typeList1" :key="index" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
          <el-radio-group v-else  v-model="payForm.addType2">
            <el-radio v-for="(item,index) in typeList2" :key="index" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="payForm.type ==1" prop="num">
            <span slot="label">
                <span style="color:red">*</span>
                <span>数量</span>
            </span>
          <el-input v-model="payForm.num" style="width:50%" placeholder="请输入数量" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item v-if="payForm.type ==2" prop="vipOverTime">
            <span slot="label">
                <span style="color:red">*</span>
                <span>到期时间</span>
            </span>
           <el-date-picker
              v-model="payForm.vipOverTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              style="width: 50%;"
              :picker-options="pickerOptionsStart"
              @change="handleSelectDate()"
            />
        </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="detailDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="paySubmit">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { getMemberRecharge } from '@/api/member-manage/member-list'
    export default {
        data() {
            return {
                dialogTitle: "",
                detailDialogVisible: false,
                payForm:{
                    type:'1',
                    gold:0,
                    addType1:1,
                    addType2:4,
                    num:'',
                    vipOverTime:''
                },
                payRules:{
                    // num: [
                    // { required: true, message: '请输入', trigger: 'blur' },
                    // ],
                    // vipOverTime: [
                    // { type: 'date', required: true, message: '请选择', trigger: 'change' }
                    // ],
                },
                typeList1:[
                    {
                    value:1,
                    label:'增加'
                    },
                    {
                    value:2,
                    label:'减少'
                    },
                    {
                    value:3,
                    label:'最终'
                    }
                ],
                typeList2:[
                    {
                    value:4,
                    label:'普通会员'
                    },
                    {
                    value:5,
                    label:'季度会员'
                    },
                    {
                    value:6,
                    label:'年费会员'
                    }
                ],
                pickerOptionsStart: {
                    disabledDate: time => {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
                payMemberId:'',
            }
        },
        methods: {
            init(item) {
                this.detailDialogVisible = true
                this.dialogTitle = `${item.nickname}-充值`
                this.payMemberId = item.id
                this.payForm.gold = item.money
            },
            handleSelectDate(){
               if(this.payForm.vipOverTime == '' || this.payForm.vipOverTime == null){
                    return
                }
                let startAt = parseInt(new Date(this.payForm.vipOverTime)/100000)
                let now = parseInt((Date.now()).valueOf()/100000)
                // console.log(startAt)
                // console.log(now)
                if(startAt < now){
                    this.$message({
                    message: '选择时间不能为过期时间',
                    type: 'warning',
                    duration: 5 * 1000
                    })
                    this.payForm.vipOverTime = ''
                }
                },
            paySubmit(){
                let params
                if(this.payForm.type == 1){
                    if(this.payForm.num == ''){
                        this.$message({
                            type: 'warning',
                            message: '请输入数量'
                        })
                        return
                    }
                    params={
                        member_id:this.payMemberId,
                        type:this.payForm.addType1,
                        money:this.payForm.num
                    }
                }else if(this.payForm.type == 2){
                    if(this.payForm.vipOverTime == ''  || this.payForm.vipOverTime == null){
                        this.$message({
                            type: 'warning',
                            message: '请选择时间'
                        })
                        return
                    }
                    params={
                        member_id:this.payMemberId,
                        type:this.payForm.addType2,
                        vipOverTime:this.payForm.vipOverTime/1000
                    }
                }
                getMemberRecharge(params).then(res=>{
                    if(res.code == 0){
                        this.$message({
                            type: 'success',
                            message: '提交成功'
                        })
                        this.detailDialogVisible = false
                        this.$emit('successRecharge')
                    }else{
                        this.$message({
                            type: 'error',
                            message: '提交失败'
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