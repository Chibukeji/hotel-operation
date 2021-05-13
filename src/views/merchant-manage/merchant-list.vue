<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <el-select v-model="listQuery.merch_scope_id" placeholder="经营范围" style="width: 160px">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in businessScope" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.merch_cate_id" placeholder="所属分类" style="width: 160px">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in classify" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.merch_type" placeholder="商家类型" style="width: 160px">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in merchantType" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <span class="filter-item">
        <el-select v-model="listQuery.status" placeholder="认证状态" style="width: 160px">
          <el-option label="全部" value="" />
          <el-option v-for="(item,index) in certificationStatus" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.keyword" placeholder="酒店名称/商家地址/联系人/手机号/邮箱" style="width: 300px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '512')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '514')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '516')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '517')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <el-input v-model="row.password_show" />
        </template>
      </el-table-column> -->
      <el-table-column label="商家名称" align="left" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经营范围" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.merch_scope == null ||row.merch_scope == ''">-</span>
          <span v-else>{{ row.merch_scope.replace(/\//g, '，') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="120">
        <template  slot="header">
            <span>商家类型 </span>
            <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
        </template>
        <template slot-scope="{row}">
          <span v-if="row.merch_type == 0">平台商家</span>
          <span v-if="row.merch_type == 1">第三方商家</span>
        </template>
      </el-table-column>
      <el-table-column label="管理酒店" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.hotel_num == 0">{{ row.hotel_num }}</span>
          <div v-else style="cursor: pointer;width:100%;height:100%" @click="handleManageHotel(row)">
            <span style="color: #409EFF" >{{ row.hotel_num }}</span>
           </div>
        </template>
      </el-table-column>
      <el-table-column label="是否认证" align="center"  width="100">
        <template slot-scope="{row}">
          <span v-if="row.status == 0">未认证</span>
          <span v-if="row.status == 1">审核中</span>
          <span v-if="row.status == 2">未通过</span>
          <span v-if="row.status == 3">已认证</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center"  width="150">
        <template slot-scope="{row}">
          <span v-if="row.link_person == null ||row.link_person == ''">-</span>
          <span v-else>{{ row.link_person }}</span>
        </template>
      </el-table-column>
       <el-table-column label="座机号码" align="center"  width="150">
        <template slot-scope="{row}">
          <span v-if="row.telephone == null ||row.telephone == ''">-</span>
          <span v-else>{{ row.telephone }}</span>
        </template>
      </el-table-column>
       <el-table-column label="手机号码" align="center"  width="150">
        <template slot-scope="{row}">
          <span v-if="row.mobile == null ||row.mobile == ''">-</span>
          <span v-else>{{ row.mobile }}</span>
        </template>
      </el-table-column>
       <el-table-column label="Email" align="center"  width="150">
        <template slot-scope="{row}">
          <span v-if="row.email == null ||row.email == ''">-</span>
          <span v-else>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <el-button v-if="row.is_disable == 0" type="primary" size="mini" @click="handleStatus(row)">开启</el-button>
          <el-button v-if="row.is_disable == 1"  type="danger" size="mini" @click="handleStatus(row)">关闭</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnAry.findIndex(x => x.id == '513')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row)">
            删除
          </el-button> -->
          <el-dropdown v-if="moreBtnFlag" trigger="click">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '515')!=-1"  @click.native="handleManageHotel(row)">管辖酒店</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '514')!=-1"  @click.native="handleDelete(row)">删除商家</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%" :close-on-click-modal="false">
        <el-tabs v-model="activeName" >
            <el-tab-pane label="基础信息" name="first">
                <el-form ref="editForm1" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
                    <el-form-item label="经营范围" prop="merch_scope_ids">
                        <el-checkbox-group v-model="merch_scope_ids">
                          <el-checkbox v-for="(item,index) in businessScope" :key="index" :label="item.id" name="type">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="merch_cate_id">
                        <span slot="label">
                            <span>所属分类</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('2')"></i>
                        </span>
                        <el-select v-model="editForm.merch_cate_id" placeholder="请选择所属分类" style="width:400px">
                          <el-option v-for="(item,index) in classify" :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商家类型" prop="merch_type">
                        <span slot="label">
                            <span>商家类型</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
                        </span>
                        <el-select v-model="editForm.merch_type" placeholder="请选择商家类型" style="width:400px">
                            <el-option v-for="(item,index) in merchantType" :key="index" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商家名称" prop="name">
                        <el-input v-model="editForm.name" style="width:400px"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="企业名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item> -->
                    <el-form-item label="联系电话" prop="telephone">
                        <el-input v-model="editForm.telephone" oninput="value=value.replace(/[^\d]/g,'')" style="width:400px"></el-input>
                    </el-form-item>
                    <el-form-item label="公司地址" prop="address">
                        <el-input v-model="editForm.address" style="width:400px"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="is_disable">
                        <el-radio-group v-model="editForm.is_disable">
                          <el-radio :label="1">关闭</el-radio>
                          <el-radio :label="0">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="认证材料" name="second">
                <el-form ref="editForm2" :rules="rules" :model="editForm" label-position="left" label-width="140px" style="width:100%;margin-bottom:50px">
                    <span style="color:red">注意：本功能是用于商家资质验证，标准用户不需要进行配置</span>
                    <el-form-item label="认证方式" prop="auth_type">
                        <el-radio-group v-model="editForm.auth_type">
                            <el-radio label="1">卫生许可证</el-radio>
                            <el-radio label="2">营业执照</el-radio>
                            <el-radio label="3">特种行业许可证</el-radio>
                            <el-radio label="4">消防证</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="editForm.auth_type == '1'">
                        <el-form-item label="卫生许可证号码" prop="license_no">
                            <el-input v-model="editForm.license_no" style="width:400px"></el-input>
                        </el-form-item>
                        <el-form-item label="卫生许可证图片" prop="license_image">
                            <el-button type="primary" size="small" @click="selectImg('1')" style="display: block;">选择图片</el-button>
                            <span v-if="editForm.license_image== '' || editForm.license_image== null"></span>
                            <el-image v-else class="img-certificate" :src="editForm.license_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '2'">
                        <el-form-item  label="营业执照" prop="certify_no">
                            <el-input v-model="editForm.certify_no" style="width:400px"></el-input>
                        </el-form-item>
                        <el-form-item label="营业执照图片" prop="certify_image">
                            <el-button type="primary" size="small" @click="selectImg('2')" style="display: block;">选择图片</el-button>
                            <span v-if="editForm.certify_image== '' || editForm.certify_image== null"></span>
                            <el-image v-else class="img-certificate" :src="editForm.certify_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '3'">
                        <el-form-item  label="特种行业许可证号码" prop="special_no">
                            <el-input v-model="editForm.special_no" style="width:400px"></el-input>
                        </el-form-item>
                        <el-form-item label="特种行业许可证图片" prop="special_image">
                            <el-button type="primary" size="small" @click="selectImg('3')" style="display: block;">选择图片</el-button>
                            <span v-if="editForm.special_image== '' || editForm.special_image== null"></span>
                            <el-image v-else class="img-certificate" :src="editForm.special_image"></el-image>
                        </el-form-item>
                    </div>
                    <div v-if="editForm.auth_type == '4'">
                        <el-form-item  label="消防证号码" prop="fire_no">
                            <el-input v-model="editForm.fire_no" style="width:400px"></el-input>
                        </el-form-item>
                        <el-form-item label="消防证图片" prop="fire_image">
                            <el-button type="primary" size="small" @click="selectImg('4')" style="display: block;">选择图片</el-button>
                            <span v-if="editForm.fire_image== '' || editForm.fire_image== null"></span>
                            <el-image v-else class="img-certificate" :src="editForm.fire_image"></el-image>
                        </el-form-item>
                    </div>
                    <el-form-item label="企业名称" prop="company_name">
                        <el-input v-model="editForm.company_name" style="width:400px"></el-input>
                    </el-form-item>
                    <el-form-item label="法人代表" prop="legal_person">
                        <el-input v-model="editForm.legal_person" style="width:400px"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="公司地址" prop="address">
                        <el-input v-model="editForm.address"></el-input>
                    </el-form-item> -->
                    <el-form-item label="认证状态" prop="status">
                        <el-radio-group v-model="editForm.status">
                          <el-radio v-for="(item,index) in certificationStatus" :key="index" :label="item.value">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="editForm.status ==2" label="未通过原因" prop="reason">
                        <el-input v-model="editForm.reason"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="联系人" name="third">
                <el-form ref="editForm3" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:80%;margin-bottom:50px">
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="editForm.mobile" oninput="value=value.replace(/[^\d]/g,'')" style="width:400px"></el-input>
                    </el-form-item>
                     <el-form-item label="姓名" prop="link_person">
                        <el-input v-model="editForm.link_person" style="width:400px"></el-input>
                    </el-form-item>
                     <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="editForm.email" style="width:400px"></el-input>
                    </el-form-item>
                     <el-form-item label="QQ" prop="qq">
                        <el-input v-model="editForm.qq" oninput="value=value.replace(/[^\d]/g,'')" style="width:400px"></el-input>
                    </el-form-item>
                     <el-form-item label="传真" prop="fax">
                        <el-input v-model="editForm.fax" style="width:400px"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级" name="fourth">
                <el-form ref="editForm4" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:100%;margin-bottom:50px">
                    <el-form-item label="坐标" prop="lng" class="coordinate-wrap">
                        <div class="coordinate-box">
                            <span>经度(Lng)：</span>
                            <el-input v-model="editForm.lng" style="display: inline-block;width:150px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </div>
                         <div class="coordinate-box">
                            <span>纬度(Lat)：</span>
                            <el-input v-model="editForm.lat" style="display: inline-block;width:150px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </div>
                        <el-button type="primary" size="small" style="height:32px;margin-top:2px" @click="mapSelect">选择</el-button>
                    </el-form-item>
                    <el-form-item label="所在城市" >
                      <el-cascader v-if="cascaderFlag" v-model="destination"  :options="siteOptions" :props="belongRegoinProps" clearable style="width:550px"></el-cascader>
                    </el-form-item>
                    <el-form-item label="商家图片" >
                        <el-button type="primary" size="small" @click="selectImg('5')" >选择图片</el-button>
                        <!-- <el-button v-if="merchantImgList.length>0" type="primary" size="small" @click="setCoverImg()">设为封面</el-button> -->
                        <el-button v-if="merchantImgList.length>0" type="danger" size="small" @click="delCoverImg()">删除</el-button>
                        <div class="merchant-img-box" v-if="merchantInit">
                            <div class="img-box" v-for="(item,index) in merchantImgList" :key="index">
                              <!-- v-on:mouseover="item.coverFlag = true" v-on:mouseout="item.coverFlag = false" -->
                                <div class="top-tool">
                                    <!-- <div v-if="item.coverFlag && !item.coverImgIf" class="btn-back" @click="setCoverImg(index)">设为封面</div> -->
                                    <div v-if="item.coverImgIf" class="btn-back" :class="{'actvie-btn-back':item.coverImgIf}">已设为封面</div>
                                    <!-- <i class="el-icon-close btn-back" v-if="item.coverFlag"></i> -->
                                </div>
                                <el-image class="img-merchant"  :src="item.file_url" @click="selectMerchantImg(item)"></el-image>
                                <div  v-if="item.coverFlag" class="select-mask" @click="selectMerchantImg(item)">
                                  <i class="el-icon-check" />
                                </div>
                            </div>
                        </div>
                        
                    </el-form-item>
                    <el-form-item label="商家介绍" prop="describe">
                        <tinymce ref="tinymce" v-model="editForm.describe" style="width:600px" :height="250"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="账号" name="fifth">
              <el-form ref="editForm5" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:100%;margin-bottom:50px">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="editForm.account" style="width:400px" :disabled="!editFlag"></el-input>
                  </el-form-item>
                 <el-form-item  prop="password">
                    <span slot="label">
                        <span>登录密码</span>
                        <!-- <i class="el-icon-question" @click="merchantTypeDetail('3')"></i> -->
                    </span>
                    <el-input v-model="editForm.password" style="width:400px"></el-input>
                  </el-form-item>
              </el-form>
            </el-tab-pane>
        </el-tabs>
        <div  slot="footer" class="dialog-footer">
            <el-button size="small" @click="editDialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
        </div>
    </el-dialog>
    <!-- 商家类型解释 -->
    <el-dialog :visible.sync="merchantTypeHelp" title="详情" width="40%" >
        <div v-html="helpDetail" class="help-detail"></div>
    </el-dialog>
    <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
    <!-- 百度地图 -->
    <baidu-mapmy ref="baiduMapChild" @getCoordinate="getCoordinate"/>
  </div>
</template>

<script>
import { getMerchantList,  getMerchantAdd,  getMerchantEdit,  getMerchantDel,getBusinessScopeList,getMerchantClassifyList,getMerchantExportExcel } from '@/api/merchant-manage/merchant-list'
import { allAddressList } from '@/api/common'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'
import Tinymce from '@/components/Tinymce'
import BaiduMapmy from '@/components/BaiduMapmy'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,ImgGallery,Tinymce,BaiduMapmy },
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
      // if(value == '' || value == null){
      //   return callback()
      // }
      if (reg.test(value)) {
        return callback()
      }
      callback('请输入正确的手机号')
    }
    return {
       belongRegoinProps: {
            checkStrictly: true,
            value:'code',
            label:'name',
            lazy: true,
            lazyLoad: (node, resolve) => {
              this.$nextTick(()=>{
                this.getAreaForLazyLoad(node, resolve)
              })
            }
      },//级联框prop
      listQuery: {
        merch_scope_id:null,
        merch_cate_id:null,
        merch_type:null,
        status:null,
        keyword: '',
        page: 1,
        size: 20,
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      businessScope:[],
      classify:[],
      merchantType:[
        {
          name: '平台商家',
          value: 0
        },
        {
          name: '第三方商家',
          value: 1
        }
      ],
      certificationStatus:[
        {
          name: '未认证',
          value: 0
        },
        {
          name: '审核中',
          value: 1
        },
        {
          name: '未通过',
          value: 2
        },
        {
          name: '已认证',
          value: 3
        }
      ],
      rules: {
        name:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        mobile:[{ validator: checkPhone, required: true, trigger: 'blur' }],
        email:[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        account:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        // password:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        merch_type:[{ required: true, message: '请输入内容', trigger: 'change' }],
        is_disable:[{ required: true, message: '请输入内容', trigger: 'change' }],
      },
      editForm: {
        name: '',
        telephone:'',
        mobile:'',
        address:'',
        link_person:'',
        email:'',
        qq:'',
        fax:'',
        province_id:'',
        city_id:'',
        area_id:'',
        legal_person:'',
        describe:'',
        images:'',
        status:0,
        reason:'',
        merch_cate_id:'',
        merch_type:'',
        merch_scope_ids:'',
        password:'',
        company_name:'',
        auth_type:'',
        license_no:'',
        license_image:'',
        certify_no:'',
        certify_image:'',
        special_no:'',
        special_image:'',
        fire_no:'',
        fire_image:'',
        lng:'',
        lat:'',
        account:'',
        is_disable:0,
      },
      editDialogVisible: false,
      dialogTitle: '',
      rolePopLoading: false,
      activeName:'first',
      merchantTypeHelp:false,
      helpDetail:'',
      siteOptions: [],
      merchantImgList:[],
      merch_scope_ids:[],
      destination:[],
      editId:'',
      siteLoading:false,
      merchantInit:true,
      editFlag:'',
      exportAllloading:false,
      btnAry:[],
      moreBtnFlag:true,
      cascaderFlag:true,
    }
  },
  mounted() {
    this.getList()
    this.businessScopeList()
    this.merchantClassifyList()
    // this.getAddressList()
    this.$store.dispatch('user/showBtn', { id: 39 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
      if(this.btnAry.findIndex(x => x.id == '514')!=-1 || this.btnAry.findIndex(x => x.id == '515')!=-1){
         this.moreBtnFlag = true
       }else{
         this.moreBtnFlag = false
       }
    })
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMerchantList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        merch_scope_id:null,
        merch_cate_id:null,
        merch_type:null,
        status:null,
        keyword: '',
        page: 1,
        size: 20,
      }
      this.getList();
    },
    //获取经营范围
    businessScopeList() {
      getBusinessScopeList().then(res => {
        this.businessScope = res.data
      })
    },
    //商家分类
    merchantClassifyList() {
      getMerchantClassifyList().then(res => {
        this.classify = res.data
      })
    },
    //获取省市区街道地址
    getAddressList(){
      this.siteLoading = true
      allAddressList().then(res=>{
        this.siteLoading = false 
        this.siteOptions = res.data.data
      })
    },
    getAreaForLazyLoad(node, resolve) {
        // console.log(node)
        const  level  = node.level
        if(level >= 4){
            resolve()
            return
        }
        let params = {
            code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
                // console.log(res)
                childProjects = res.data.data
                childProjects.map(item => {
                  item.leaf = level >= 3; //判断是否为末尾节点
                })
                resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editFlag = true
      this.$nextTick(()=>{
        this.$refs.editForm1.resetFields();
        this.$refs.editForm2.resetFields();
        this.$refs.editForm3.resetFields();
        this.$refs.editForm4.resetFields();
        this.$refs.editForm5.resetFields();
        this.editForm.lat = ''
        this.editForm.province_id = ''
        this.editForm.city_id = ''
        this.editForm.area_id = ''
        this.editForm.images = ''
        this.editForm.password = ''
        // console.log(this.editForm)
        this.merchantImgList = []
        this.merch_scope_ids = []
        this.destination = []
        let id = this.businessScope[0].id
        this.editForm.merch_scope_ids = id
        this.merch_scope_ids.push(id)
        this.editForm.auth_type = '1'
        this.editForm.is_disable = 0
        this.editForm.status = 0
        this.editForm.merch_cate_id = this.classify[0].id
        this.editForm.merch_type = this.merchantType[0].value
        setTimeout(()=>{
          this.$refs.tinymce.setContent('')
        },500)
        // console.log(this.editForm)
      })
    },
    
    // 点击编辑
    handleUpdate(item) {
      // console.log(item)
      this.editDialogVisible = true
      this.editFlag = false
      this.cascaderFlag = false
      this.$nextTick(()=>{
        this.cascaderFlag = true
        this.dialogTitle = item.name+'-编辑'
        this.editId = item.id
        for (const key in item) {
          if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
          }
        }
        this.editForm.auth_type = this.editForm.auth_type.toString()
        // 经营范围
        this.merch_scope_ids = []
        if(item.merch_scope_ids == null || item.merch_scope_ids == ''){
        }else{
          if(item.merch_scope_ids.length>1){
            let arr = item.merch_scope_ids.split(',')
            arr.map(item=>{
                this.merch_scope_ids.push(parseInt(item))
            })
          }else{
            this.merch_scope_ids.push(item.merch_scope_ids)
          }
        }
        setTimeout(()=>{
          if(item.describe == null || item.describe == ''){
            this.$refs.tinymce.setContent('')
          }else{
            this.$refs.tinymce.setContent(item.describe)
          }
        },500)
        //所在城市
        this.destination = []
        if(item.province_id == null || item.province_id == '') {}else{
          this.destination.push(item.province_id.toString())
        }
        if(item.city_id == null || item.city_id=='') {}else{
          this.destination.push(item.city_id.toString())
        }
        if(item.area_id == null || item.area_id == '') {}else{
          this.destination.push(item.area_id.toString())
        }
        if(item.street_id == null || item.street_id == '') {}else{
          this.destination.push(item.street_id.toString())
        }
        //商家图片
        this.merchantImgList = []
        if(item.images == null ){
        }else{
          if(item.images.length>1){
            let json = item.images.split(',')
            json.map((item,i)=>{
              let list = {file_url:item,coverFlag:false,coverImgIf:false}
              this.merchantImgList.push(list)
            })
          }else{
            let list = {file_url:item.images,coverFlag:false,coverImgIf:false}
            this.merchantImgList.push(list)
          }
        }
        //认证材料
        let item2 = item.qualification 
        if(item2){
          for (const key in item2.qualification) {
            if (this.editForm[key] != undefined) {
              this.editForm[key] = item2[key]
            }
          }
        }
        //所属分类
        this.classify.map(item=>{
          if(item.id == this.editForm.merch_cate_id){
          }else{
            this.editForm.merch_cate_id = ''
          }
        })
        this.editForm.password = ''
      })
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm1.validate((valid) => {
        if (valid) {
        this.$refs.editForm3.validate((valid) => {
        if (valid) {
          if(this.editForm.account == '' || this.editForm.account == null){
            this.$message({
              type: 'warning',
              message: '请填写账号!'
            })
            this.activeName = 'fifth'
            return
          }
          this.editForm.merch_scope_ids =  this.merch_scope_ids.join(',')
          this.destination.map((item,i)=>{
            if(i == 0){
              this.editForm.province_id = item
              this.editForm.city_id = ''
              this.editForm.area_id = ''
              this.editForm.street_id = ''
            }else if(i == 1){
              this.editForm.city_id = item
            }else if(i == 2){
              this.editForm.area_id = item
            }else if(i == 3){
              this.editForm.street_id = item
            }
          });
          let arr =[]
          this.merchantImgList.map(item=>{
            arr.push(item.file_url)
          })
          this.editForm.images = arr.join(',')
          if (this.editFlag) {
            if(this.editForm.password == '' || this.editForm.password == null){
              this.$message({
                type: 'warning',
                message: '请填写密码!'
              })
              this.activeName = 'fifth'
              return
            }
            const params = this.editForm
            getMerchantAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          } else{
            const params =  Object.assign(this.editForm,{id:this.editId}) 
            getMerchantEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
          }else{
            this.activeName = 'third'
          }
        })
        }else{
          this.activeName = 'first'
        }
      })
    },
    // 删除单条数据
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            ids: row.id
          }
          getMerchantDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
     //删除多条数据
    delMore() {
      if(this.multipleSelection.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        })
        return
      }
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = this.multipleSelection.map(x => { return x.id })
          const params = {
            ids: idArr.join(',')
          }
          getMerchantDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //查看商家类型解释
    merchantTypeDetail(flag){
        this.merchantTypeHelp = true
        if(flag == '1'){
            this.helpDetail = `<div>供应商类型分为第三方供应商和平台供应商。</div>
            <div>第三方供应商：</div>
            <div>可在供应商返佣中设置三方供应商的返佣金额，交易完成后平台会自动扣除佣金，将订单金额结算到供应商账户中。</div>
            <div>平台供应商：</div>
            <div>默认平台返佣比例为100%。交易完成后，订单金额全部打入平台账户中。</div>`
        }else if(flag == '2'){
            this.helpDetail = `<div>1.供应商所属分类</div>
            <div>a.作用：方便商家对供应商进行分类管理</div>
            <div>b.设置：请在供应商管理-供应商设置-供应商分类中进行设置</div>
            <div style="margin-top:20px">2.供应商经营范围</div>
            <div>a.经营范围：指供应商在系统中供应的产品类型。</div>
            <div>b.作用：1).方便商家根据供应商供应产品类型对供应商进行分类管理 2).供应商在供应商中心可操作的产品类型。</div>
            <div>c.经营范围的内容：与我的应用-供应商产品应用的安装情况有关</div>`
        }else if(flag == '3'){
            this.helpDetail = `<div>从后台添加的供应商账号，密码需要管理员手动设置。</div>
            <div>如果供应商忘记密码无法登陆，管理员也可以从此处帮其重置。</div>`
        }
    },
    //弹出图片库
    selectImg(flag) {
      let id  = ''
      if(this.editFlag){
        id  = ''
      }else{
        id = this.editId
      }
      this.$refs.imgGalleryChild.init(flag,1,id)
      // this.$refs.imgGalleryChild.init(flag,1,this.editId)
    },
    //选择地图
    mapSelect(){
      this.$refs.baiduMapChild.init()
    },
    // 获取地图坐标
    getCoordinate(data){
      // console.log(data)
      this.editForm.lng =data.lng
      this.editForm.lat =data.lat
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
    //设为封面图
    setCoverImg(){
      let arr = []
      this.merchantImgList.map((item,index)=>{
        if(item.coverFlag){
          arr.push(index)
        }
      })
      if(arr.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择设置的图片'
        })
        return
      }
      if(arr.length>1){
        this.$message({
          type: 'warning',
          message: '封面图只能设置一张'
        })
      }else{
        this.merchantInit = false
        this.merchantImgList.map((item,index)=>{
          item.coverImgIf = false
          item.coverFlag = false
        })
        this.merchantImgList[arr[0]].coverImgIf = true
        this.merchantInit = true
      }
    },
    //删除图片
    delCoverImg(){
      let arr = []
      this.merchantImgList.map((item,index)=>{
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
        this.merchantImgList = this.merchantImgList.filter(item=>!item.coverFlag)
        this.merchantInit = true
      }
    },
    //获取选择的图片
    selectImgList(data){
      // console.log(data)
      if(data.flag == '1'){
        this.editForm.license_image = data.item[0].file_url
      }else if(data.flag == '2'){
        this.editForm.certify_image = data.item[0].file_url
      }else if(data.flag == '3'){
        this.editForm.special_image = data.item[0].file_url
      }else if(data.flag == '4'){
        this.editForm.fire_image = data.item[0].file_url
      }else if(data.flag == '5'){
        let arr = [...this.merchantImgList,...data.item]
        const res = new Map();  //定义常量 res,值为一个Map对象实例
        //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        this.merchantImgList = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
        this.merchantImgList.map(item=>{
          item.coverFlag = false
          item.coverImgIf = false
        })
      }
    },
    //点击管辖酒店
    handleManageHotel(row){
      this.$router.push({
        name: 'hotel-list',
        params: {
          name: row.name,
          id:row.id,
        }
      })
    },
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '615') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      let text
      if (row.is_disable == 1) {
        text = '确定要改为开启状态吗'
      } else if (row.is_disable == 0) {
        text = '确定要关闭该商家吗？关闭后该商家下的酒店将会下架'
      }
      this.$confirm(text , '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let is_disable
        if (row.is_disable == 0) {
          is_disable = 1
        } else if (row.is_disable == 1) {
          is_disable = 0
        }
        const params = {
          id: row.id,
          is_disable: is_disable
        }
        getMerchantEdit(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    //导出数据
    exportTable(flag){
      let params
      if(flag == '1'){
        this.exportAllloading = true
        params={
          merch_scope_id:this.listQuery.merch_scope_id,
          merch_cate_id:this.listQuery.merch_cate_id,
          merch_type:this.listQuery.merch_type,
          status:this.listQuery.status,
          keyword: this.listQuery.keyword,
        }
      }else{
        params=this.listQuery
      }
      getMerchantExportExcel(params).then(res=>{
        this.exportAllloading = false
        // console.log(res)
        if(res.code == 0){
          window.open(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.help-detail{
    line-height:2;
}
.el-icon-question{
    cursor: pointer;
}
.img-certificate{
    width: 120px;
    margin-top: 10px;
}
.coordinate-wrap{
    /deep/.el-form-item__content{
        display: flex;
    }
    .coordinate-box{
        display: flex;
        margin-right:15px;
        span{
            display: inline-block;
        }
    }
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
.my-dropdown{
  /deep/.el-button-group>.el-button+.el-button {
    height: 28px;
  }
}
/deep/.el-dropdown-menu__item {
  padding: 5px 30px;
}
</style>
