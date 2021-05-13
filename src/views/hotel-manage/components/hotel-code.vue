<template>
    <div>
        <el-dialog :visible.sync="codeDialogVisible" :title="dialogTitle"  width="300px">
            <!-- <vue-qr  text="codeUrl" :size="200"></vue-qr> -->
            <div v-if="imgLoading" v-loading="imgLoading" class="code-box"></div>
            <img v-else  class="code-box" :src="codeUrl" alt="">
            <div  class="dialog-footer-btn">
                <el-button size="small" type="primary" @click="downloadCodeImg">下载</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import vueQr from 'vue-qr'
import { getHotelQrcode} from '@/api/hotel-manage/hotel-list'
    export default {
        // components: {vueQr},
        data() {
            return {
                codeDialogVisible: false,
                dialogTitle:'',
                list:'',
                codeUrl:'',
                imgLoading:false,
            }
        },
        methods: {
            init(row) {
                this.codeDialogVisible = true
                this.list = row
                this.dialogTitle = row.title+'-二维码'
                this.creatQrCode()
            },
            //生成二维码
            creatQrCode() {
                this.imgLoading = true
                getHotelQrcode({hotel_id:this.list.id}).then(res=>{
                    this.imgLoading = false
                    this.codeUrl =  res.data
                })
            },
            downloadCodeImg(){
                window.open(this.codeUrl)
            }
        },
    }
</script>

<style lang="scss" scoped>
.dialog-footer-btn{
    text-align: center;
}
.code-box{
    width: 170px;
    height: 170px;
    margin: auto;
    display: block!important;
    margin-bottom: 20px;
}
</style>