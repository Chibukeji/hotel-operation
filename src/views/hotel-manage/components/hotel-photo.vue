<template>
    <div>
        <el-dialog :visible.sync="photoDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%">
            <el-tabs v-model="activeNamePhoto">
                <el-tab-pane v-for="(item,index) in photoList" :key="index" :label="item.name" :name="item.id.toString()">
                    <el-button type="primary" size="small" @click="selectImg(index)" >选择图片</el-button>
                    <el-button v-if="imgList.length>0 && imgList[index].length>0" type="danger" size="small" @click="delCoverImg(index)">删除</el-button>
                    <div class="merchant-img-box" v-if="merchantInit">
                        <div class="img-box" v-for="(item,j) in imgList[index]" :key="j">
                            <el-image class="img-merchant"  :src="item.file_url" @click="selectMerchantImg(item)"></el-image>
                            <div  v-if="item.coverFlag" class="select-mask" @click="selectMerchantImg(item)">
                                <i class="el-icon-check" />
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div  slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
        <!-- 图片库 -->
        <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
    </div>
</template>

<script>
    import {getHotelPhoto,getHotelEdit } from '@/api/hotel-manage/hotel-list'
    import ImgGallery from '@/components/ImgGallery'
    export default {
        components: { ImgGallery},
        data() {
            return {
                photoDialogVisible: false,
                dialogTitle:'酒店相册',
                activeNamePhoto:'first',
                photoList:[],
                merchantImgList:[],
                merchantInit:true,
                imgList:[]
            }
        },
        mounted () {
           
        },
        methods: {
            init(row){
                this.photoDialogVisible = true
                this.itemDetail = row
                this.dialogTitle = row.title+'-酒店相册'
                this.getHotelPhotoList(row)
                // console.log(row)
                // this.imgList = []
            },
            //获取酒店相册名列表
            getHotelPhotoList(row){
                getHotelPhoto().then(res=>{
                    this.photoList = res.data.data.data
                    this.activeNamePhoto = res.data.data.data[0].id.toString()
                    this.photoList.map((item,i)=>{
                        this.imgList[i] = []
                    })
                    if(row.photo_list == null || row.photo_list == ''){
                    }else{
                        if(row.photo_list.length>0){
                            let arr = row.photo_list
                            arr.map((item,i)=>{
                                this.photoList.map((photoItem,j)=>{
                                    if(item.hotel_photo_attr_id == photoItem.id){
                                        this.imgList[j] = []
                                        let url = item.pic_list.split(',')
                                        if(url != ''){
                                            url.map(item2=>{
                                                let list = {file_url:item2,coverFlag:false}
                                                this.imgList[j].push(list) 
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    }
                    // console.log(this.imgList)
                })
            },
            //弹出图片库
            selectImg(flag) {
                this.$refs.imgGalleryChild.init(flag,2,this.itemDetail.id)
            },
            //获取选择的图片
            selectImgList(data){
                this.merchantInit = false
                let i = parseInt(data.flag) 
                let arr = [...this.imgList[i],...data.item]
                const res = new Map();  //定义常量 res,值为一个Map对象实例
                //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
                this.imgList[i] = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
                this.imgList[i].map(item=>{
                    item.coverFlag = false
                })
                // console.log(this.imgList)
                this.merchantInit = true
            },
            // 选择商家图片
            selectMerchantImg(item){
                this.merchantInit = false
                if(item.coverFlag){
                    item.coverFlag = false
                }else{
                    item.coverFlag = true
                }
                this.merchantInit = true
            },
            //删除图片
            delCoverImg(i){
                let arr = []
                this.imgList[i].map((item,index)=>{
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
                    this.merchantInit = false
                    this.imgList[i] = this.imgList[i].filter(item=>!item.coverFlag)
                    this.merchantInit = true
                }
            },
            submitHandle(){
                let photo_list = []
                this.imgList.map((item,i)=>{
                    let addUrl = item.map(x => { return x.file_url })
                    let json={
                        id:this.photoList[i].id,
                        value:addUrl.join(',')
                    }
                    photo_list.push(json)
                })
                let params ={
                    id:this.itemDetail.id,
                    photo_list:photo_list
                }
                getHotelEdit(params).then(res=>{
                    if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '编辑成功!'
                    })
                    this.$emit('successPhoto')
                    this.photoDialogVisible = false
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
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