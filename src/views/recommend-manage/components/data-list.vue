<template>
    <div>
        <el-dialog :visible.sync="dataDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="900px">
            <div style="margin-bottom:10px;color:red">上传图片尺寸为：
                <span v-if="list.length==1">649*225</span>
                <span v-if="list.length==2">314*304</span>
                <span v-if="list.length==3">314*251和314*152</span>
                <span v-if="list.length==4">314*152</span>
            </div>
            <div class="wrap-box">
                <div class="img-box img-box-template3" v-if="list.length==3">
                    <div class="img-item img-item-template3" v-for="(item,index) in list" :key="index" :style="{background:(item.image_url == '' || item.image_url == null?'#d8d8d8':'#fff')}">
                        <div>
                            <span v-if="item.image_url == '' || item.image_url == null" class="number" >{{index+1}}</span>
                            <img v-else :src="item.image_url" class="left-img">
                        </div>
                    </div>
                </div>
                <div class="img-box" v-else>
                    <div class="img-item" v-for="(item,index) in list" :key="index" :style="{background:(item.image_url == '' || item.image_url == null?'#d8d8d8':'#fff'),'height':imgHeight+'px',width:imgWidth+'px'}">
                        <div>
                            <span v-if="item.image_url == '' || item.image_url == null" class="number" >{{index+1}}</span>
                            <img v-else :src="item.image_url" class="left-img" :style="{'height':imgHeight+'px',width:imgWidth+'px'}">
                        </div>
                    </div>
                </div>
                <div class="line">
                    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row class="table-box">
                        <el-table-column label="序号" type="index" align="center"  width="50" />
                        <el-table-column label="选择图片" align="center"  width="100">
                            <template slot-scope="{$index}">
                                <el-button type="primary" size="mini" @click="selectImg($index)" style="display: block;">选择图片</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="标题" align="center" >
                            <template slot-scope="{row}">
                                <el-input v-model="row.name" placeholder="请输入标题"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="跳转类型" align="center" width="130">
                            <template slot-scope="{row,$index}">
                                <el-select v-model="row.jump_type" placeholder="请选择" @change="changeHotel(row,$index)">
                                    <el-option label="酒店ID" :value="1"></el-option>
                                    <el-option label="H5页面" :value="2"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="数据" align="center" >
                            <template slot-scope="{row,$index}">
                                <div class="select-hotel">
                                    <el-input v-if="row.jump_type == 1" v-model="row.hotel_name" clearable :disabled="true"></el-input>
                                    <el-input v-if="row.jump_type == 2" v-model="row.url" clearable placeholder="请输入内容" @blur="getContent"></el-input>
                                    <el-button v-show="row.jump_type ==1" type="primary" size="mini" @click="selectHotel($index)" style="margin-left:10px;padding:0 7px">选择酒店</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dataDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
        <!-- 图片库 -->
        <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
        <!-- 选择酒店 -->
        <select-hotel ref="selectHotelChild" @successHotel="successHotel"/>
    </div>
</template>

<script>
import { getRecommendDataList,getRecommendDataEdit } from '@/api/recommend-manage/recommend-list'
import ImgGallery from '@/components/ImgGallery'
import SelectHotel from '@/components/SelectHotel'
    export default {
        components: { ImgGallery,SelectHotel},
        data() {
            return {
                dataDialogVisible: false,
                dialogTitle:'数据列表',
                listLoading:false,
                list:[],
                imgShowInit:true,
                dataItem:'',
                imgHeight:0,
                imgWidth:0,
                hotelIndex:'',
                oldList:[],
            }
        },
        methods: {
            init(item) {
                this.list = []
                this.dataDialogVisible = true
                this.dialogTitle = item.name+'-数据列表'
                this.dataItem = item
                this.getRecommendData()
            },
            //获取列表数据
            getRecommendData(){
                getRecommendDataList({recommend_id:this.dataItem.id}).then(res=>{
                    // console.log(res.data.data.data)
                    let list = res.data.data.data
                    if(list.length == 0){
                        for(let i=0;i<this.dataItem.template;i++){
                            let json={image_url:'',name:'',jump_type:1,url:'',hotel_name:'',recommend_id:this.dataItem.id}
                            this.list.push(json)
                        }
                    }else{
                        this.list = list
                    }
                    this.oldList = JSON.parse(JSON.stringify(this.list))//深度拷贝
                    if(this.list.length == 1){
                       this.imgHeight = 225 
                        this.imgWidth = 649
                    }else if(this.list.length == 2){
                       this.imgHeight = 304 
                        this.imgWidth = 314
                    }else if(this.list.length == 4){
                       this.imgHeight = 152
                        this.imgWidth = 314
                    }
                })
            },
            //弹出图片库
            selectImg(flag) {
                // console.log(flag)
                this.$refs.imgGalleryChild.init(flag,0,'')
            },
            //获取选择的图片
            selectImgList(data){
                this.list[data.flag].image_url = data.item[0].file_url
            },
            //选择跳转类型
            changeHotel(row,i){
                if(this.oldList[i].jump_type == row.jump_type){
                    row.hotel_name = this.oldList[i].hotel_name
                    row.url = this.oldList[i].url
                }else {
                    row.url = ''
                    row.hotel_name = ''
                }
            },
            //选择酒店
            selectHotel(index){
                this.hotelIndex = index
                this.$refs.selectHotelChild.init()
            },
            successHotel(item){
                // console.log(item)
                this.list[this.hotelIndex].url = item.id
                this.list[this.hotelIndex].hotel_name = `(id:${item.id})${item.title}`
                this.$set(this.list)
                this.oldList = JSON.parse(JSON.stringify(this.list))//深度拷贝
            },
            //保存输入的url内容
            getContent(){
                this.oldList = JSON.parse(JSON.stringify(this.list))//深度拷贝
            },
            // 确定
            submitHandle(){
                for(let i = 0;i<this.list.length;i++){
                    if(this.list[i].image_url == '' || this.list[i].image_url == null){
                        this.$message({
                            type: 'warning',
                            message: '请选择图片!'
                        })
                        return
                    }
                    if(this.list[i].name == '' || this.list[i].name == null){
                        this.$message({
                            type: 'warning',
                            message: '请填写标题!'
                        })
                        return
                    }
                    if(this.list[i].url == '' || this.list[i].url == null){
                        if(this.list[i].jump_type == 1){
                            this.$message({
                                type: 'warning',
                                message: '请选择酒店!'
                            })
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '请填写url!'
                            })
                        }
                        return
                    }
                }
                let params={
                    recommend_id:this.dataItem.id,
                    data:this.list
                }
                getRecommendDataEdit(params).then((res)=>{
                     if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '提交成功!'
                        })
                        this.getRecommendData()
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

.img-table{
    width: 60px;
}
.wrap-box{
    // display: flex;
    // justify-content: space-between;
    .line{
        height: 100%;
    }
    .img-box{
        display: flex;
        justify-content: left;
        flex-flow: wrap;
        width: 708px;
        height:100%;
        padding-right: 10px;
        margin-bottom: 20px;
        .img-item{
            width: 314px;
            // border: 1px solid #ccc;
            margin: 20px 20px;
            margin-top: 0;
            position: relative;
            height: 162px;
            text-align: center;
            .left-img{
                width: 314px;
                height: 152px;
            }
            .number{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                width: 20px;
                height: 20px;
                background: #fff;
                border-radius: 50%;
            }
        }
        .img-item:nth-child(odd) {
            margin-right: 0;
            margin-left: 0;
        }
        .img-item:nth-child(2n+2) {
            border-left: none;
        }
    }
    .img-box-template3{
        justify-content: flex-end;
        .img-item{
            margin-left: 0;
            height: 152px;
            position: relative;
            left: -30px;
        }
        .img-item:nth-child(odd) {
            margin-right: 20px;
        }
        .img-item:first-child{
            height: 325px;
           
            .left-img{
                width: 314px;
                height: 325px;
            }
        }
        .img-item:nth-child(n+3) {
            margin-top: -173px;
        }
    }
}
.select-hotel{
    display: flex;
    justify-content: space-between;
}
</style>