<template>
  <div class="wechat-menu-wrap-box">
    <div class="left-box">
        <div class="mobile-box">
            <!-- <div class="mobile-head-title"></div> -->
            <div class="mobile-foot" id="sortFirseMenu">
              <div class="menu-item" v-for="(item,i) in menu" :key="i" @click="firstMenu(i,item)" >
                <a href="javascript:;" class="menu-link" :class="{'menu-active':menuActive==i}">
                  <el-dropdown :hide-on-click="false" placement="top" trigger="click" :ref="'downHide'+i" :default-openeds="true">
                    <span class="el-dropdown-link" >
                      {{item.name}}
                    </span>
                    <el-dropdown-menu slot="dropdown" >
                      <div :id="'sortLable'+i">
                        <el-dropdown-item  v-for="(list,j) in item.sub_button" :key="j" style="text-align: center;" @click.native="childHandle(i,j,list)">{{list.name}}</el-dropdown-item>
                      </div>
                        <el-dropdown-item class="down-item" @click.native="addChildHandle(i,item)">
                          &nbsp;&nbsp;
                          <i class="el-icon-plus"></i>
                          &nbsp;&nbsp;
                        </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </a>
                
              </div>
              <div class="menu-item" v-if="menu.length<3" @click="firstMenuAdd()">
                 <a href="javascript:;" class="menu-link" :class="{'menu-active':firstMenuActive}">
                   <i class="el-icon-plus"></i>
                 </a>
              </div>
            </div>
        </div>
        <div class="bottom-text">
            <i class="fa fa-lightbulb-o"></i>
            <span class="reminder-text">可直接拖动菜单排序</span>
        </div>
    </div>
    <div class="rigth-box">
      <div v-if="rigthShow == 1" class="right-reminder">点击左侧菜单进行编辑操作</div>
      <div class="backgr-box" v-if="rigthShow != 1">
        <span>{{rigthTopText}}</span>
        <el-divider />
        <el-form v-if="rigthShow == 2" :model="firstMenuForm" :rules="firstMenuRules" ref="firstMenuForm" label-width="110px" class="demo-ruleForm" style="width:60%">
          <el-form-item label="菜单标题：" prop="name">
            <el-input v-model="firstMenuForm.name"></el-input>
            <span style="color:red">菜单最好不要出现“充值”字眼哦~</span>
          </el-form-item>
        </el-form>
        <el-form v-if="rigthShow == 3" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-form-item label="子菜单标题：" prop="name">
            <el-input v-model="ruleForm.name" style="width:60%"></el-input>
            <span style="color:red">菜单最好不要出现“充值”字眼哦~</span>
          </el-form-item>
          <el-form-item label="子菜单内容：" prop="type">
            <el-radio-group v-model="ruleForm.type" @change="changeType">
              <el-radio label="view">跳转网页</el-radio>
              <el-radio label="click">签到自动回复</el-radio>
              <el-radio label="1" :disabled="this.ruleForm.name == ''">关键字回复</el-radio>
              <el-radio label="2" :disabled="this.ruleForm.name == ''">图片回复</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.type=='view'">
            <div class="reminder-text">点击该子菜单会跳到以下链接</div>
            <el-form-item label="页面地址：" prop="url">
              <el-input v-model="ruleForm.url" style="width:60%"></el-input>
            </el-form-item>
            <!-- <el-form-item label="常用链接：" prop="url_name">
              <el-radio-group v-model="ruleForm.url_name" style="100%" @change="changeCommonLink">
                <el-radio-button v-for="(item,i) in commonLinkList" :key="i" :label="item.name">{{item.name}}</el-radio-button>
              </el-radio-group>
            </el-form-item> -->
          </div>
          <div v-if="ruleForm.type=='1'">
            <el-form-item label="回复内容：" prop="content">
              <el-input type="textarea" v-model="ruleForm.content" style="width:60%" rows="4"></el-input>
            </el-form-item>
          </div>
          <div v-if="ruleForm.type=='2'">
            <el-form-item label="回复图片：" class="img-wrap">
              <el-button type="primary" size="small" @click="selectImg('1')" class="img-btn">选择图片</el-button>
              <img class="img-certificate" :src="ruleForm.img_url" />
            </el-form-item>
          </div>
        </el-form>
        <div>
          <el-button v-if="btnAry.findIndex(x => x.id == '556')!=-1" type="danger" @click="handleDelMenu()">删除该菜单</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '557')!=-1" type="primary" @click="handleSaveMenu(0)">保存</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '558')!=-1" type="primary" @click="handleSaveMenu(1)" :loading="savePublishLoading">保存并发布</el-button>
          <el-button v-if="btnAry.findIndex(x => x.id == '559')!=-1" type="primary" plain @click="handleDefaultMenu" :loading="defaultMenuLoading">恢复系统默认菜单</el-button>
        </div>
      </div>
    </div>
    <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>
<script>
import { getWechatMenu,getWechatDefMenuMenu,saveWechatMenu,getComLink,getKeyWord} from "@/api/wechat/wechat-menu";
import Sortable from "sortablejs";
import ImgGallery from '@/components/ImgGallery'
export default {
  components: { ImgGallery},
  data() {
    return {
      ruleForm:{
        name:'',
        type:'view',
        url:'',
        url_name:'1',
        content:'',
        img_url:'',
      },
      rules:{
        name:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ]
      },
      firstMenuForm:{
        type:'view',
        name:'',
      },
      firstMenuRules:{
        name:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ]
      },
      menu:[],
      menuActive:0,
      rigthShow:1,
      rigthTopText:'',
      commonLinkList:[],
      firstMenuActive:false,
      menuRes:'',
      firstMenuIndex:'',
      subMenuIndex:'',
      editorFlag:true,
      menuFlag:'',
      saveFlag:false,
      defaultMenuLoading:false,
      savePublishLoading:false,
      btnAry:[],
      word:[],
    };
  },
  mounted() {
    this.getInitMenuList()
    this.getCommonLinkList()
    this.$store.dispatch('user/showBtn', { id: 52 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    //第一次获取微信菜单
    getInitMenuList(){
      getWechatMenu({wechat_id:''}).then(res=>{
        if(res.code == 0){
          let menu = res.data.menu
          this.menu = eval(menu)
          // console.log(this.menu)
          this.menuRes = res.data
          this.$nextTick(()=>{
            this.sortMove()
            this.sortMoveFirst()
          })
        }
      })
    },
    //获取微信菜单
    getMenuList(){
      getWechatMenu({wechat_id:''}).then(res=>{
        if(res.code == 0){
          let menu = res.data.menu
          this.menu = eval(menu)
          // console.log(this.menu)
          this.menuRes = res.data
        }
      })
    },
    //获取常用链接
    getCommonLinkList(){
      getComLink().then(res=>{
        if(res.code == 0){
          let data = res.data
          this.commonLinkList = data
          this.ruleForm.url_name = data[0].id
          // this.ruleForm.url = data[0].url
        }
      })
    },
    changeType(){
      // console.log(this.ruleForm.url_name)
      if(this.ruleForm.type=='1' || this.ruleForm.type=='2'){
       if(this.ruleForm.name == '' || this.ruleForm.name == null){
          this.$message.warning("请输入子菜单标题");
          return
       }
       getKeyWord({keyword:this.ruleForm.name}).then(res=>{
         if(res.code == 0){
            this.$set(this.ruleForm,"content",res.data.content)
            this.$set(this.ruleForm,"img_url",res.data.img_url)
         }
       })
      }
    },
    changeCommonLink(){
      let list = this.commonLinkList.find(x => x.name == this.ruleForm.url_name)
      this.ruleForm.url = list.url
    },
    //一级菜单拖动
    sortMoveFirst(){
      let vm = this
      let el = document.getElementById('sortFirseMenu');
      var sortable = Sortable.create(el,{
        onEnd: function(evt){
          if(evt.oldIndex!=evt.newIndex){
            // console.log(evt.oldIndex)
            // console.log(evt.newIndex)
            this.firstMenuIndex = evt.newIndex
            let li = el.children[evt.newIndex]
            let oldLi = el.children[evt.oldIndex]
            vm.sortArr(el,li,oldLi,vm.menu,evt.oldIndex,evt.newIndex,'1')
          }
        }
      });
    },
    //二级菜单拖动
    sortMove(){
      let vm = this
      this.menu.map((item,i)=>{
        let el = document.getElementById('sortLable'+i);
        this.firstMenuIndex = i
        var sortable = Sortable.create(el,{
          onEnd: function(evt){
            // console.log(evt.oldIndex)
            // console.log(evt.newIndex)
            if(evt.oldIndex!=evt.newIndex){
              let li = el.children[evt.newIndex]
              let oldLi = el.children[evt.oldIndex]
              vm.sortArr(el,li,oldLi,vm.menu[i].sub_button,evt.oldIndex,evt.newIndex,'2')
            }
          }
        });
      })
    },
    //一级菜单
    firstMenu(index,item){
      // console.log(this.menu)
      this.menuActive = index
      this.rigthTopText = item.name
      this.firstMenuIndex = index
      this.editorFlag = true
      this.menuFlag = 1
      if(item.sub_button != undefined && item.sub_button.length>0){
        this.rigthShow = 2
        this.firstMenuForm.name = item.name
      }else{
        this.rigthShow = 3
        for(var key in item){
          if(this.ruleForm[key] != undefined){
            this.ruleForm[key]=item[key]
          }
        }
      }
      this.saveFlag = true
      // console.log(this.menu)
    },
    firstMenuAdd(){
      this.menuActive = -1
      this.rigthShow = 3
      this.firstMenuActive = true
      this.rigthTopText = '添加菜单'
      this.editorFlag = false
      this.menuFlag = 1
      this.ruleForm = {
        name:'',
        type:'view',
        url:this.commonLinkList[0].url,
        url_name:this.commonLinkList[0].name
      }
      this.saveFlag = true
    },
    //二级菜单
    childHandle(i,j,row){
      this.rigthShow = 3
      this.rigthTopText = row.name
      this.firstMenuIndex = i
      this.subMenuIndex = j
      this.editorFlag = true
      this.menuFlag = 2
      for(var item in row){
        if(this.ruleForm[item] != undefined){
          this.ruleForm[item]=row[item]
        }
      }
      this.saveFlag = true
      this.changeType()
    },
    addChildHandle(i,item){
      if(item.sub_button !=undefined && item.sub_button.length>4){
        this.$message.warning("最多只能添加5个");
        return
      }
      this.firstMenuIndex = i
      this.rigthShow = 3
      this.rigthTopText = '添加子菜单'
      this.editorFlag = false
      this.menuFlag = 2
      this.ruleForm = {
        name:'',
        type:'view',
        url:'',
        // url:this.commonLinkList[0].url,
        url_name:this.commonLinkList[0].name
      }
      this.saveFlag = true
    },
    //拖动数组排序
    sortArr(el,li,oldLi,arr,oldIndex,newIndex,flag){
      // 先删除移动的节点
      el.removeChild(li)  
      // 再插入移动的节点到原有节点，还原了移动的操作
      if(newIndex > oldIndex) {
        el.insertBefore(li,oldLi)
      } else {
        el.insertBefore(li,oldLi.nextSibling)
      }
      // 更新items数组
      var item = arr.splice(oldIndex,1)
      arr.splice(newIndex,0,item[0])  
      if(flag == 1){
        this.menuActive = newIndex 
        this.firstMenu(newIndex,arr[newIndex])  
      }else{
        this.childHandle(this.firstMenuIndex,newIndex,arr[newIndex])
      }                                                                                                                                                       
      // console.log('menu',this.menu)
      // console.log(this.menuActive)
      this.saveSubmit(0,false)
    },
    //保存菜单
    handleSaveMenu(num){
      if(!this.saveFlag){
        this.$message({
          type: 'warning',
          message: '请重新点击添加按钮'
        })
        return
      }
      if(!this.editorFlag){
        this.saveFlag = false
      }
      let json 
      let word
      if(this.ruleForm.type=='view'){ 
        json={name:this.ruleForm.name,type:this.ruleForm.type,url:this.ruleForm.url}
        word = ''
      }else if(this.ruleForm.type=='click'){
        json={name:this.ruleForm.name,type:this.ruleForm.type,key:"SIGN_IN"}
        word = ''
      }else if(this.ruleForm.type=='1'){
        json={name:this.ruleForm.name,type:this.ruleForm.type,key:this.ruleForm.name}
        word = {content:this.ruleForm.content,type:this.ruleForm.type,keyword:this.ruleForm.name}
      }else if(this.ruleForm.type=='2'){
        json={name:this.ruleForm.name,type:this.ruleForm.type,key:this.ruleForm.name}
        word = {img_url:this.ruleForm.img_url,type:this.ruleForm.type,keyword:this.ruleForm.name}
      }
      //一级菜单
      if(this.menuFlag ==1){ 
        if(this.editorFlag){  //编辑
          if(this.rigthShow == 2){
            if(this.firstMenuForm.name == ''){
              this.saveFlag = true
              return
            }
            this.menu[this.firstMenuIndex].name = this.firstMenuForm.name
          }else{ //新增
            if(this.ruleForm.name == ''){
              this.saveFlag = true
              return
            }
            this.menu[this.firstMenuIndex] = json
            this.word.push(word)
          }
        }else{ 
          this.menu.push(json)
          this.word.push(word)
        }
      //二级菜单
      }else if(this.menuFlag ==2){
        if(this.ruleForm.name == ''){
            this.saveFlag = true
            return
          }
        if(this.editorFlag){  //编辑
          this.menu[this.firstMenuIndex].sub_button[this.subMenuIndex] = json
          this.word.push(word)
        }else{  //新增
          if(this.menu[this.firstMenuIndex].sub_button == undefined){
            this.menu[this.firstMenuIndex] = {name:this.menu[this.firstMenuIndex].name}
            this.menu[this.firstMenuIndex].sub_button =[]
          } 
          this.menu[this.firstMenuIndex].sub_button.push(json)
          this.word.push(word)
        }
      }
      this.saveSubmit(num,true)
    },
    saveSubmit(num,flag){
      if(num == 1){
        this.savePublishLoading = true
      }
      let params={
        id:this.menuRes.id,
        menu:this.menu,
        word:this.word
        // is_push:num
      }
      saveWechatMenu(params).then(res=>{
        if(res.code == 0){
          this.word = []
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          if(flag){
            this.getMenuList()
          }
          if(num == 1){
            this.savePublishLoading = false
          }
        }
      })
    },
    //获取默认菜单
    handleDefaultMenu(){
      this.$confirm('确认恢复系统默认菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.defaultMenuLoading = true
        getWechatDefMenuMenu({id:this.menuRes.id}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '恢复成功'
            }); 
            let menu = res.data.menu_default
            this.menu = eval(menu)
            // this.menu = res.data.menu_default
          }
          this.defaultMenuLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //删除菜单
    handleDelMenu(){
      let flag = true
      if(this.menuFlag ==1){
        if(this.menu[this.firstMenuIndex].sub_button!= undefined && this.menu[this.firstMenuIndex].sub_button.length>0){
          this.$message({
            type: 'warning',
            message: '请先删除该菜单的子菜单'
          })
          return
        }
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.menuFlag ==1){
          this.menu.splice(this.firstMenuIndex,1)
        }else if(this.menuFlag ==2){
          this.menu[this.firstMenuIndex].sub_button.splice(this.subMenuIndex,1)
          if(this.menu[this.firstMenuIndex].sub_button.length == 0){
            this.menu[this.firstMenuIndex]={
              name:this.menu[this.firstMenuIndex].name,
              type:'view',
              url:this.commonLinkList[0].url,
            }
            flag = false
          }
        }
        let params={
          id:this.menuRes.id,
          menu:this.menu
        }
        saveWechatMenu(params).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getMenuList()
            if(!flag){
              this.firstMenu(this.firstMenuIndex,this.menu[this.firstMenuIndex])
            }else{
              this.rigthShow =1
            }
            
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    //弹出图片库
    selectImg(flag) {
      this.$refs.imgGalleryChild.init(flag,0,'')
    },
    //获取选择的图片
    selectImgList(data){
      if(data.flag == '1'){
        this.ruleForm.img_url = data.item[0].file_url
        // console.log(this.ruleForm.img_url)
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.wechat-menu-wrap-box{
    display: flex;
    justify-content: space-between;
    padding: 20px;
    .left-box{
        .mobile-box{
            display: block;
            float: left;
            position: relative;
            width: 317px;
            height: 550px;
            background: transparent url('../../assets/images/wechat/wx_mobile_header_bg.png') no-repeat 0 0;
            background-position: 0 0;
            border: 1px solid #e7e7eb;
            .mobile-head-title{
                color: #fff;
                text-align: center;
                padding-top: 33px;
                font-size: 15px;
                width: auto;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
                margin: 0 40px 0 70px;
            }
            .mobile-foot{
                position: absolute;
                height: 50px;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 1px solid #e7e7eb;
                background: transparent url('../../assets/images/wechat/wx_mobile_footer_bg.png') no-repeat 0 0;
                background-position: 0 0;
                background-repeat: no-repeat;
                padding-left: 43px;
                margin: 0;
                display: flex;
                .menu-item{
                  // line-height: 50px;
                  position: relative;
                  float: left;
                  text-align: center;
                  flex: 1;
                  list-style: none;
                }
                .menu-link {
                  display: inline-block;
                  width: 100%;
                  line-height: 46px;
                  background-color: #fff;
                  border-left: 1px solid #e7e7eb;
                }
                .menu-active{
                  border: 1px solid #1890ff;
                  .el-dropdown-link{
                    color: #1890ff;
                  }
                }
               .el-dropdown{
                  width: 100%;
                  .el-dropdown-link{
                    display: inline-block;
                    width: 100%;
                    font-size: 12px;
                  }
                }
                
                
            }
        }
        .bottom-text{
            text-align: center;
            .fa-lightbulb-o{
              color:#e74c3c;
              padding-top:10px;
            }
            .reminder-text{
              color:#e74c3c;
              font-size: 14px;
            }
        }
    }
    .rigth-box{
        flex: 1;
        margin-left: 20px;
        position: relative;
        .backgr-box{
          background-color: #f4f5f9;
          border: 1px solid #e7e7eb;
          padding: 15px;
        }
        .right-reminder{
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          text-align: center;
        }
    }
    /deep/ .el-radio-button {
      margin-right: 20px;
      margin-bottom: 20px;
    }
    /deep/ .el-radio-button:first-child .el-radio-button__inner {
      border: 1px solid #DCDFE6;
      border-radius: 4px;
    }
    /deep/ .el-radio-button--medium .el-radio-button__inner {
      border: 1px solid #DCDFE6;
      border-radius: 4px;
    }
     /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      box-shadow: none;
    }
    .reminder-text{
      font-size: 14px;
      margin-bottom: 20px;
      margin-left: 5px;
    }
}
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
</style> 
<style lang="scss">
.el-dropdown-menu--medium{
    padding: 0;
    .el-dropdown-menu__item{
      border-bottom: 1px solid #e7e7eb;
      font-size: 12px;
      padding: 3px 17px;
    }
    .down-item{
      text-align: center;
      border-bottom: none;
      padding: 3px 17px;
      .el-icon-plus{
        font-size: 18px;
      }
    }
  }
</style>