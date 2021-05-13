<template>
  <div class="upload-container">
    <el-button v-if="uploadShow" :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible" title="上传" append-to-body>
      <!-- <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      > -->
      <div>
        <!-- <div>
          <el-image v-if="imageSrc!= ''" class="img-certificate" :src="imageSrc"></el-image>
        </div> -->
        <el-button size="small" type="primary" @click="selectImg('1')">
          点击上传
        </el-button>
        <el-button v-if="merchantIconList.length>0" type="danger" size="small" @click="delCoverIcon()">删除</el-button>
        <div class="merchant-img-box" v-if="merchantIconInit">
            <div class="img-box" v-for="(item,index) in merchantIconList" :key="index">
                <el-image class="img-merchant"  :src="item.file_url" @click="selectMerchantIcon(item)"></el-image>
                <div  v-if="item.coverFlag" class="select-mask" @click="selectMerchantIcon(item)">
                  <i class="el-icon-check" />
                </div>
            </div>
        </div>
      </div>
      <!-- </el-upload> -->
      <div class="bottom-btn-box">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
      
    </el-dialog>
     <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import ImgGallery from '@/components/ImgGallery'
export default {
  components: {ImgGallery},
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    uploadShow:{
      type: Boolean,
      default: false
    },
    hotelId:{
      type:String,
      default: ''
    },
    group_type:{
      type:String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      imageSrc:'',
      merchantIconList:[],
      merchantIconInit:true,
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      // const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      // const arr =[{url:this.imageSrc}]
      // if (!this.checkAllSuccess()) {
      //   this.$message('请等待所有图片上传成功。如果有网络问题，请刷新页面并重新上传!')
      //   return
      // }
      this.$emit('successCBK', this.merchantIconList)
      // this.listObj = {}
      // this.fileList = []
      // this.imageSrc = ''
      this.merchantIconList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    },
    //弹出图片库
    selectImg(flag) {
      let id  = ''
      if(this.editFlag){
        id  = ''
      }else{
        id = this.editId
      }
      this.$refs.imgGalleryChild.init(flag,this.group_type,this.hotelId)
    },
    //删除图标
    delCoverIcon(){
      let arr = []
      this.merchantIconList.map((item,index)=>{
        if(item.coverFlag){
          arr.push(index)
        }
      })
      if(arr.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的图片'
        })
      }else{
        this.merchantIconInit = false
        this.merchantIconList = this.merchantIconList.filter(item=>!item.coverFlag)
        this.merchantIconInit = true
      }
    },
    // 选择图片
    selectMerchantIcon(item){
      this.merchantIconInit = false
      if(item.coverFlag){
        item.coverFlag = false
      }else{
        item.coverFlag = true
      }
      this.merchantIconInit = true
    },
    //删除图片
    delCoverIcon(){
      let arr = []
      this.merchantIconList.map((item,index)=>{
        if(item.coverFlag){
          arr.push(index)
        }
      })
      if(arr.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的图片'
        })
      }else{
        this.merchantIconInit = false
        this.merchantIconList = this.merchantIconList.filter(item=>!item.coverFlag)
        this.merchantIconInit = true
      }
    },
     //获取选择的图片
    selectImgList(data){
      // console.log(data)
      if(data.flag == '1'){
        let arr = [...this.merchantIconList,...data.item]
        const res = new Map();  //定义常量 res,值为一个Map对象实例
        //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        this.merchantIconList = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
        // console.log(this.merchantIconList)
        this.merchantIconList.map(item=>{
          item.coverFlag = false
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
.bottom-btn-box{
  text-align: center;
  margin-top: 30px;
}
.img-certificate{
    width: 120px;
    margin-top: 10px;
}
.merchant-img-box{
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    .img-box{
        margin-right: 15px;
        // border: 1px solid #DCDFE6;
        // padding: 0 10px;
        position: relative;
        cursor: pointer;
        .img-merchant{
            width: 100px;
            position: relative;
            // cursor:pointer;
        }
        .top-tool{
            position: absolute;
            z-index: 99;
            // pointer-events: none;
            .btn-back{
                display: inline-block;
                padding: 0 5px;
                height: 22px;
                line-height: 22px;
                font-size: 12px;
                color: #fff;
                background: rgba(0,0,0,.6);
                position: relative;
                cursor:pointer;
                top: -8px;
            }
            .actvie-btn-back{
              background: #42b983;
            }
            .el-icon-close{
              right: -15px;
            }
        }
        .select-mask{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.3);
                text-align: center;
                z-index: 100;
                .el-icon-check{
                    font-size: 50px;
                    color: #fff;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
    }
}
</style>
