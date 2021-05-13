<template>
    <div>
        <div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <el-form :model="editForm" :rules="rules" ref="editForm" label-width="160px" class="demo-ruleForm" style="width:600px">
                        <el-form-item label="公众号名称" prop="name">
                            <el-input v-model="editForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="微信号" prop="wechat_account">
                        <el-input v-model="editForm.wechat_account" />
                        </el-form-item>
                        <el-form-item label="原始ID" prop="original_id">
                        <el-input v-model="editForm.original_id" />
                        </el-form-item>
                        <el-form-item label="AppId" prop="appid">
                        <el-input v-model="editForm.appid" />
                        </el-form-item>
                        <el-form-item label="Appsecre" prop="appsecre">
                        <el-input v-model="editForm.appsecre" />
                        </el-form-item>
                        <el-form-item label="客服二维码" prop="qrcode_thumb_url" class="img-wrap">
                            <el-button type="primary" size="small" @click="selectImg('1')" class="img-btn">选择图片</el-button>
                            <img class="img-certificate" :src="editForm.qrcode_thumb_url"/>
                        </el-form-item>
                        <el-form-item label="关注二维码" prop="sub_thumb_url" class="img-wrap">
                        <el-button type="primary" size="small" @click="selectImg('2')" class="img-btn">选择图片</el-button>
                            <img class="img-certificate" :src="editForm.sub_thumb_url"/>
                        </el-form-item>
                        <el-form-item v-if="btnAry.findIndex(x => x.id == '554')!=-1">
                            <el-button size="small" type="primary" @click="saveHandle" class="save-btn">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="微信服务器配置" name="second">
                    <el-form :model="editForm" :rules="rules" ref="editForm" label-width="160px" class="demo-ruleForm" style="width:600px">
                        <el-form-item label="授权url" prop="authorized_url">
                            <el-input v-model="editForm.authorized_url" />
                        </el-form-item>
                        <el-form-item label="对接服务器url" prop="url">
                            <el-input v-model="editForm.url" />
                        </el-form-item>
                        <el-form-item label="token(令牌)" prop="token">
                            <el-input v-model="editForm.token" />
                        </el-form-item>
                        <el-form-item label="EncodingAESKey(消息加解密密钥)" prop="encoding">
                            <el-input v-model="editForm.encoding" />
                        </el-form-item>
                        <el-form-item label="公众号域名证明文件" prop="verify_file_id">
                            <el-upload
                                ref="proveList"
                                class="upload-demo"
                                :action="uploadFileUrl"
                                drag
                                name="files"
                                :headers="headers"
                                :on-remove="proveRemove"
                                :file-list="proveList"
                                :multiple="false"
                                :on-success="proveUploadSuccess"
                            >
                            <i class="el-icon-upload" />
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item v-if="btnAry.findIndex(x => x.id == '554')!=-1" >
                            <el-button size="small" type="primary" @click="saveHandle" class="save-btn">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 图片库 -->
        <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
    </div>
</template>

<script>
import { getWechatInfo,wechatInfoEdit } from '@/api/wechat/wechat-configuration'
import ImgGallery from '@/components/ImgGallery'
    export default {
        components: { ImgGallery},
        data() {
            return {
                activeName:'first',
                uploadFileUrl: process.env.VUE_APP_BASE_API + '/main/uploadFile',
                editForm: {
                    id:'',
                    name:'',
                    wechat_account:'',
                    original_id:'',
                    appid:'',
                    appsecre:'',
                    authorized_url:'',
                    url:'',
                    token:'',
                    encoding:'',
                    pay_url:'',
                    read_url:'',
                    qrcode_thumb_id:'',
                    qrcode_thumb_url:'',
                    sub_thumb_id:'',
                    sub_thumb_url:'',
                    verify_file_id:'',
                    verify_file_url:'',
                },
                rules:{
                    name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    wechat_account:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    original_id:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    appid:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    appsecre:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    authorized_url:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    url:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    token:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    encoding:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    pay_url:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    read_url:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    qrcode_thumb_url:[{ required: true, message: '请选择', trigger: 'blur' }],
                },
                headers:{
                    authorization:''
                },
                proveList:[],
                btnAry:[]
            }
        },
        mounted () {
            this.headers.authorization = this.$store.getters.token;
            this.getWechatInfoList()
            this.$store.dispatch('user/showBtn', { id: 51 }).then(res => {
                // console.log('res', res)
                this.btnAry = res.children
            })
        },
        methods: {
            //获取配置信息
            getWechatInfoList(){
                getWechatInfo().then(res=>{
                    let json = res.data
                    for (const key in json) {
                        if (this.editForm[key] != undefined) {
                            this.editForm[key] = json[key]
                        }
                    }
                    const arr = this.editForm.verify_file_url.split('/')
                    const name = arr.splice(arr.length - 1, arr.length)[0]
                    this.proveList = [{
                        name,
                        url: this.editForm.verify_file_url
                    }]
                })
            },
            //弹出图片库
            selectImg(flag) {
                this.$refs.imgGalleryChild.init(flag,0,'')
            },
            //获取选择的图片
            selectImgList(data){
                if(data.flag == '1'){
                    this.editForm.qrcode_thumb_id = data.item[0].id
                    this.editForm.qrcode_thumb_url = data.item[0].file_url
                }else if(data.flag == '2'){
                    this.editForm.sub_thumb_id = data.item[0].id
                    this.editForm.sub_thumb_url = data.item[0].file_url
                }
            },
            // 证明文件上传成功
            proveUploadSuccess(res, file, fileList) {
                this.editForm.verify_file_id = res.data.id
                this.editForm.verify_file_url = res.data.file_url
                this.proveList = fileList.splice(fileList.length - 1)
                // console.log(this.proveList)
            },
            // 证明文件删除
            proveRemove() {
                this.add.form.verify_file_id = ''
            },
            //保存
            saveHandle(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        wechatInfoEdit(this.editForm).then(res=>{
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                })
                            }
                        })
                    } else {
                        return false;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.img-wrap{
    position: relative;
    .img-btn{
        position: absolute;
    }
    .img-certificate{
        width: 100px;
        margin-left: 120px;
    }
}
/deep/.el-upload-dragger{
    width: 210px;
    height: 100px;
    .el-icon-upload {
        margin: 10px 0 0px;
        font-size: 58px;
    }
    .el-upload__text{
        margin-top: -10px;
    }
}
.save-btn{
    margin-top: 50px;
}
</style>