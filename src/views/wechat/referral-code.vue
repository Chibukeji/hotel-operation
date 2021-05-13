<template>
  <div class="referral-code-page">
        <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="基本设置" name="first"></el-tab-pane>
        </el-tabs>
      <div class="top-upload-box">
        <div class="text-event" :style="{'background-image': 'url('+backImg+')'}">
            <vue-draggable-resizable
            :w="er_info.width"
            :h="er_info.height"
            :x="er_info.x"
            :y="er_info.y"
            :min-width="50"
            :min-height="50"
            :parent="true"
            :aspectRatio="true"
            :lock-aspect-ratio="true"
            :grid="[10, 10]"
            class-name="dragging1"
            @dragging="onDrag"
            @resizing="onResize"
            v-if="codeShow"
            >
            <img  src="../../assets/images/wechat-code.png" alt="" style="width:100%;height:100%">
            </vue-draggable-resizable>
        </div>
        <div style="padding:0 50px;border-right: 1px solid #dedede;">
            <div class="top-item">
                <span class="left-title">背景图片：</span>
                <div>
                    <img :src="backImg" alt="" class="small-back-img">
                    <div class="img-explain">背景图片尺寸：640*1008</div>
                </div>
            </div>
            <div class="top-item">
                <span class="left-title">海报元素：</span>
                <div>
                    <el-checkbox-group v-model="checkList" @change="selectCode">
                        <el-checkbox :label="1">二维码</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div style="margin-top:80px">
                <el-button type="primary" size="small" @click="selectImg('1')" style="width:150px;height:38px" >选择图片</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '630')!=-1" type="primary" size="small" @click="saveInfoClick" style="width:150px;height:38px" >保存</el-button>
            </div>
        </div>
        <div style="flex:1;margin-left:20px">
            <div class="bottom-select">
                 <div class="right-btn-box">
                    <el-button v-if="!saveShow && btnAry.findIndex(x => x.id == '631')!=-1" type="primary" size="small" @click="editClick" class="img-btn">编辑</el-button>
                    <el-button v-if="saveShow" type="primary" size="small" @click="saveClick" class="img-btn">保存</el-button>
                </div>
                <div>
                    <el-radio-group v-model="radioBack"  class="radioImg" @change="radioBackImg">
                            <el-radio v-for="(item,index) in backImgList" :key="index" :label="item.id" class="back-select-box">
                                <img :src="item.url" alt="" class="small-back-img border-img">
                                <!-- <div>背景图片{{index+1}}</div> -->
                                <div class="delete-icon" v-if="saveShow && radioBack!=item.id" @click.prevent="delImg(item,index)">
                                    <i class="el-icon-circle-close"></i>
                                </div>
                            </el-radio>
                        </el-radio-group>
                </div>
            </div>
        </div>
      </div>
      <!-- <div class="bottom-select">
         
      </div> -->
      <!-- 图片库 -->
     <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import ImgGallery from '@/components/ImgGallery'
import src from '../../assets/images/back.jpg'
import { getRecommendCode,getRecommendCodeUpdate,delBackgroundImg } from '@/api/wechat/referral-code'
export default {
  components: { VueDraggableResizable,ImgGallery },
  data: function() {
    return {
      aspectRatio:true,
      backImg:'',
      background_img_id:'',
      checkList:[1],
      activeName:'first',
      radioBack:null,
      backImgList:[],
      saveShow:false,
      er_info:{
        width: 100,
        height: 100,
        x: 110,
        y: 200,
      },
      oldImg:{
        background_img_url:'',
        background_img_id:'',
      },
      delImgList:[],
      btnAry:[],
      codeShow:true,
    };
  },
  mounted () {
    this.getRecommendCodeData();
    this.$store.dispatch('user/showBtn', { id: 629 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    onResize: function(x, y, width, height) {
      this.aspectRatio = false
      this.er_info.x = x;
      this.er_info.y = y;
      this.er_info.width = width;
      this.er_info.height = height;
      this.aspectRatio = true
    },
    onDrag: function(x, y) {
      this.er_info.x = x;
      this.er_info.y = y;
    },
    // 获取信息
    getRecommendCodeData(){
        getRecommendCode().then(res=>{
            this.backImgList = res.data.background_img_list
            this.background_img_id = res.data.background_img_id
            this.backImg = res.data.background_img_url
            this.oldImg.background_img_url = res.data.background_img_url
            this.oldImg.background_img_id = res.data.background_img_id
            this.er_info = res.data.er_info
        })
    },
    //弹出图片库
    selectImg(flag) {
        this.$refs.imgGalleryChild.init(flag,0,'')
    },
    //获取选择的图片
    selectImgList(data){
        // console.log(data)
        if(data.flag == '1'){
            this.background_img_id = data.item[0].id
            this.backImg = data.item[0].file_url
        }
    },
    saveInfoClick(){
        if(!this.codeShow){
            this.$message({
                type: 'warning',
                message: '请选择二维码!'
            })
            return
        }
        let params={
            background_img_id:this.background_img_id,
            er_info:JSON.stringify(this.er_info)
        }
        getRecommendCodeUpdate(params).then(res=>{
            if (res.code === 0) {
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.getRecommendCodeData();
            }
        })
    },
    //选择二维码
    selectCode(){
        if(!this.checkList.includes(1)){
            this.codeShow = false
        }else{
            this.codeShow = true
        }
    },
    //点击编辑
    editClick(){
        this.saveShow = true
    },
    // 点击保存
    saveClick(){
        this.saveShow = false
        if(this.delImgList.length==0){
            return
        }
        let params={
            img_id:this.delImgList.join(',')
        }
        delBackgroundImg(params).then(res=>{
            if (res.code === 0) {
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.getRecommendCodeData();
            }
        })
    },
    //删除图片
    delImg(item,i){
        this.delImgList.push(item.id)
        this.backImgList.splice(i,1)
    },
    //选择背景图
    radioBackImg(){
        let index =  this.backImgList.findIndex((item) => item.id === this.radioBack)
        this.background_img_id = this.backImgList[index].id
        this.backImg = this.backImgList[index].url
    }
  }
};
</script>

<style lang="scss" scoped>
.referral-code-page{
    .top-upload-box{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .text-event {
            height: 1008px;
            width: 640px;
            border: 1px solid #dedede;
            position: relative;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .img-btn{
            height: 32px;
        }
        .top-item{
            display: flex;
            margin-bottom: 20px;
            .left-title{
                font-size: 14px;
            }
            .img-explain{
                font-size: 14px;
                color: #999;
            }
        }
    }
    .bottom-select{
        // border-top: 1px solid #dedede;
        // padding-top: 20px;
        // margin-top: 20px;
        .right-btn-box{
            text-align: right;
        }
        .back-select-box{
            position: relative;
            .delete-icon{
                position: absolute;
                top:-25px;
                right:-22px;
                z-index: 9;
                .el-icon-circle-close{
                    font-size: 24px;
                    color: #F56C6C;
                }
            }
        }
    }
    .dragging1 {
        border: 1px solid #000;
        color: #000;
    }
    /deep/.el-tabs__header {
        margin: 0 0 20px;
    }
    .small-back-img{
        width: 160px;
        height: 252px;
    }
   
}
.radioImg{
    /deep/.el-radio__input {
        display: none;
    }
    /deep/.el-radio__inner {
        display: none;
    }
    /deep/.el-radio .is-bordered {
        padding: 0px;
    }
    /deep/.el-radio {
        margin: 10px;
    }
    /deep/.el-radio__label div {
        text-align: center;
        margin-top: 10px;
    }
    /deep/.el-radio__label .v-image__image {
        margin: 0;
    }
    /deep/.el-radio.is-bordered + .el-radio.is-bordered {
        margin: 10px;
    }
    /deep/.el-radio__input.is-checked+.el-radio__label img{
        border: 1px solid #1890ff;
        padding: 10px;
    }
}
</style>