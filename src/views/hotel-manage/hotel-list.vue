<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <el-cascader v-model="placeOrigin" :options="siteOptions" :props="belongRegoinProps"  clearable placeholder="所在城市" style="width:300px"></el-cascader>
      </span>
      <!-- <span class="filter-item">
        <el-select v-model="listQuery.type" placeholder="属性" style="width: 160px">
          <el-option v-for="(item,index) in propertyList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span> -->
      <span class="filter-item">
        <span class="select-title">添加时间：</span>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
        end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </span>
      <!-- <span class="filter-item">
        <el-select v-model="listQuery.type" placeholder="分时互通" style="width: 160px">
          <el-option v-for="(item,index) in certificationStatus" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span> -->
      <el-input v-model="listQuery.keyword" placeholder="酒店名称/酒店编号" style="width: 250px" class="filter-item" />
      <el-input v-model="listQuery.merch_name" placeholder="商家名称/商家编号" style="width: 250px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '519')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '521')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '522')!=-1" class="filter-item" type="primary" size="mini" :loading="exportAllloading" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '523')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '572')!=-1" class="filter-item" type="primary" size="mini"  @click="putaway('1')">上架</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '572')!=-1" class="filter-item" type="primary" size="mini"  @click="putaway('2')">下架</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
       <!-- <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <el-input v-model="row.password_show" />
        </template>
      </el-table-column> -->
      <el-table-column label="编号" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店名称" align="left">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="分时互通" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password_show }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="审核状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" v-if="row.status == 0" @click="handleCheck(row)">未审核</el-button>
          <span type="primary" size="mini" v-if="row.status == 1">通过</span>
          <span type="danger" size="mini" v-if="row.status == 2">不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店星级" align="center" width="100" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.rank_name == null ||row.rank_name == ''">-</span>
          <span v-else>{{row.rank_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在城市" align="left" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{row.citys_name}}</span>
        </template>
      </el-table-column>
       <el-table-column label="分时积分" align="center"  width="100">
        <template slot-scope="{row}">
          <span>{{row.member_score }}</span>
        </template>
      </el-table-column>
       <el-table-column label="专属积分" align="center"  width="100">
        <template slot-scope="{row}">
          <span>{{row.member_exclusive_score }}</span>
        </template>
      </el-table-column>
       <el-table-column label="创建时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
       <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <el-button v-if="row.is_show == 0" type="danger" size="mini" @click="handleStatus(row)">下架</el-button>
          <el-button v-if="row.is_show == 1" type="primary" size="mini" @click="handleStatus(row)">上架</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.is_recommend == 0">否</span>
          <span v-if="row.is_recommend == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="特价酒店" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.is_discount == 0">否</span>
          <span v-if="row.is_discount == 1">是</span>
        </template>
      </el-table-column>
       <el-table-column label="运营人" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.admin_name == null ||row.admin_name == ''">-</span>
          <span v-else>{{ row.admin_name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="添加人" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.admin_info == null ||row.admin_info == ''">-</span>
          <span v-else>{{ row.admin_info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnAry.findIndex(x => x.id == '520')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-dropdown v-if="moreBtnFlag" trigger="click">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '524')!=-1"  @click.native="handleHouseType(row)">房型管理</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '530')!=-1" @click.native="handleHousePhoto(row)">相册管理</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '531')!=-1" @click.native="handleHouseConfiguration(row)">酒店配置</el-dropdown-item>
              <el-dropdown-item  v-if="btnAry.findIndex(x => x.id == '606')!=-1"  @click.native="handleGive(row)">赠送管理</el-dropdown-item>
              <el-dropdown-item  @click.native="handleAccount(row)">员工列表</el-dropdown-item>
              <el-dropdown-item  @click.native="handleQRcode(row)">酒店二维码</el-dropdown-item>
              <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '521')!=-1" @click.native="handleDelete(row)">删除酒店</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-house"  @click="handleHouseType(row)">房型</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%" :close-on-click-modal="false">
        <el-tabs v-model="activeName" >
            <el-tab-pane label="基础信息" name="first">
                <el-form ref="editForm1" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px">
                    <el-form-item  prop="title">
                        <span slot="label">
                            <span>酒店名称</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
                        </span>
                        <el-input v-model="editForm.title" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="酒店分类" prop="hotel_cate_id">
                       <el-select v-model="editForm.hotel_cate_id" placeholder="请选择酒店分类" style="width:70%">
                          <el-option v-for="(item,index) in hotelCateList" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="province_id">
                         <span slot="label">
                            <span style="color:red">*</span>
                            <span>所在城市</span>
                        </span>
                        <!-- :placeholder="citys_name" -->
                        <el-cascader v-if="cascaderFlag" v-model="destination" :props="belongRegoinProps2" clearable style="width:70%" class="city-select"></el-cascader>
                    </el-form-item>
                    <el-form-item label="酒店地址" prop="address">
                      <span slot="label">
                        <span>酒店地址</span>
                        <i class="el-icon-question" @click="merchantTypeDetail('3')"></i>
                      </span>
                      <el-input v-model="editForm.address" style="width:70%"></el-input>
                    </el-form-item>
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
                    <el-form-item label="联系电话" prop="telephone">
                        <el-input v-model="editForm.telephone" oninput="value=value.replace(/[^\d]/g,'')" style="width:220px"></el-input>
                    </el-form-item>
                    <el-form-item label="开业时间" prop="open_time">
                      <span slot="label">
                          <span style="color:red">*</span>
                          <span>开业时间</span>
                      </span>
                      <el-date-picker v-model="open_time" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" style="width:220px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="装修时间" prop="decorate_time">
                        <el-date-picker v-model="decorate_time" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" style="width:220px"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="merch_id">
                        <span slot="label">
                            <span style="color:red">*</span>
                            <span>商家</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('2')"></i>
                        </span>
                        <el-button type="primary" size="small" @click="selectMerchant">选择</el-button>
                        <span style="margin-left:20px">{{merch_name}}</span>
                    </el-form-item>
                    <!-- <el-form-item prop="type">
                        <span slot="label">
                            <span>酒店属性</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('4')"></i>
                        </span>
                       <el-select v-model="editForm.region" placeholder="请选择酒店属性">
                            <el-option label="1" value="shanghai">平台商家</el-option>
                            <el-option label="2" value="beijing">第三方商家</el-option>
                        </el-select>
                    </el-form-item> -->
                     <el-form-item prop="hotel_rank_id">
                        <span slot="label">
                            <span>星级</span>
                            <!-- <i class="el-icon-question" @click="merchantTypeDetail('5')"></i> -->
                        </span>
                       <el-select v-model="editForm.hotel_rank_id" placeholder="请选择星级" style="width:220px">
                            <el-option v-for="(item,index) in hotelRankList" :key="index" :label="item.rank_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评分" prop="score">
                        <el-input v-model="editForm.score" oninput="value=value.replace(/[^\d]/g,'')" style="width:220px"></el-input>
                    </el-form-item>
                    <el-form-item label="酒店运营人员" prop="admin_id">
                      <el-button type="primary" size="small" @click="operateSelect">选择</el-button>
                      <span style="margin-left:20px">{{admin_name}}</span>
                    </el-form-item>
                    <el-form-item prop="icon_list">
                        <span slot="label">
                            <span>图标设置</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('5')"></i>
                        </span>
                        <el-button type="primary" size="small" @click="selectImg('1')" >选择图片</el-button>
                        <el-button v-if="merchantIconList.length>0" type="danger" size="small" @click="delCoverIcon()">删除</el-button>
                        <div class="merchant-img-box" v-if="merchantIconInit">
                            <div class="img-box" v-for="(item,index) in merchantIconList" :key="index">
                                <el-image class="img-merchant"  :src="item.file_url" @click="selectMerchantIcon(item)"></el-image>
                                <div  v-if="item.coverFlag" class="select-mask" @click="selectMerchantIcon(item)">
                                  <i class="el-icon-check" />
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="推荐酒店" prop="is_recommend">
                        <el-radio-group v-model="editForm.is_recommend">
                          <el-radio :label="1">是</el-radio>
                          <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="特价酒店" prop="is_discount">
                        <el-radio-group v-model="editForm.is_discount"> 
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="date_hour">
                      <span slot="label">
                            <span>分时入住时间</span>
                            <i class="el-icon-question" @click="merchantTypeDetail('6')"></i>
                        </span>
                      <!-- <el-input v-model="editForm.date_hour" oninput="value=value.replace(/[^\d]/g,'')" style="width:100px"></el-input> -->
                      <el-input-number v-model="editForm.date_hour" controls-position="right"  :min="17" :max="24" style="width:150px"></el-input-number>
                      <span>小时</span>
                    </el-form-item>
                    <el-form-item label="状态" prop="is_show">
                        <el-radio-group v-model="editForm.is_show">
                          <el-radio :label="1">上架</el-radio>
                          <el-radio :label="0">下架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="酒店图片" name="second">
                <el-form ref="editForm2" :rules="rules" :model="editForm" label-position="left" label-width="100px" style="width:100%;margin-bottom:50px">
                    <el-form-item label="商家图片" prop="pic_list">
                       <span slot="label">
                          <span style="color:red">*</span>
                          <span>商家图片</span>
                      </span>
                        <el-button type="primary" size="small" @click="selectImg('2')" >选择图片</el-button>
                        <el-button v-if="merchantImgList.length>0" type="primary" size="small" @click="setCoverImg()">设为封面</el-button>
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
                    <!-- <div class="line"></div>
                    <div class="photo-title">酒店相册</div> -->
                    
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="酒店设施" name="third">
                <el-form ref="editForm3" :rules="rules" :model="editForm" label-position="left" label-width="140px" style="width:100%;margin-bottom:50px">
                    <el-form-item v-for="(item,index) in hotelServiceList" :key="index" :label="item.service_name" prop="service_list">
                        <el-checkbox-group v-model="service_list">
                          <el-checkbox v-for="(item,m) in item.chlid" :key="m"  :label="item.id" name="type">{{item.service_name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="酒店详细" name="fourth">
              <tinymce ref="tinymce1" v-model="editForm.content"  :height="250" style="min-width:600px;width:80%"/>
            </el-tab-pane>
            <el-tab-pane label="周边景点" name="fifth">
               <tinymce ref="tinymce2" v-model="editForm.around_spots"  :height="250" :hotelId='editId.toString()' style="min-width:600px;width:80%"/>
            </el-tab-pane>
            <el-tab-pane label="服务项目" name="sixth">
               <tinymce ref="tinymce3" v-model="editForm.service_items"  :height="250" style="min-width:600px;width:80%"/>
            </el-tab-pane>
            <el-tab-pane label="交通指南" name="seventh">
               <tinymce ref="tinymce4" v-model="editForm.traffic"  :height="250" style="min-width:600px;width:80%"/>
            </el-tab-pane>
            <el-tab-pane label="预订须知" name="eighth">
               <tinymce ref="tinymce5" v-model="editForm.booking_notes"  :height="250" style="min-width:600px;width:80%"/>
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
    <!-- 设置商家 -->
    <set-merchant ref="merchantChild" @getMerchantDatd="getMerchantDatd"/>
    <!-- 酒店运营人员 -->
    <operate-people ref="operatePeopleChild" @getAdminDatd="getAdminDatd" />
    <!-- 房型 -->
    <house-type ref="houseTypeChild" />
    <!-- 酒店相册 -->
    <hotel-photo ref="housePhotoChild" @successPhoto="successPhoto" />
    <!-- 酒店配置 -->
    <hotel-configuration ref="houseConfigurationChild" @successConfiguration="successPhoto" />
    <!-- 赠送管理 -->
    <give-score ref="giveScoreChild" />
    <!-- 安全码弹窗 -->
    <security-code ref="securityCodeChild"  @confirmSubmit="confirmSubmit"/>
    <!-- 酒店账号 -->
    <!-- <el-dialog :visible.sync="accountDialogVisible" :title="accountDialogTitle"  width="500px">
      <div>
        账号：
        <span v-if="hoteLAccount == '' || hoteLAccount == null">未设置</span>
        <span v-else>{{hoteLAccount}}</span>
      </div>
      <div style="text-align: center;margin-top:30px">
        <el-button size="small" @click="accountDialogVisible = false">取消</el-button>
      </div>
    </el-dialog> -->
    <hotel-account ref="hotelAccountChild" />
    <!-- 酒店审核 -->
    <el-dialog :visible.sync="checkDialogVisible" :title="checkDialogTitle"  width="500px">
      <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="150px" >
        <el-form-item label="审核" prop="status">
          <el-radio-group v-model="checkForm.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: center;margin-top:30px">
        <el-button size="small" @click="checkDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="checkSure">确定</el-button>
      </div>
    </el-dialog>
    <!-- 酒店二维码 -->
    <hotel-code ref="hotelCodeChild" />
  </div>
</template>

<script>
import { getHotelList,  getHotelAdd,  getHotelEdit,  getHotelDel,getHotelRank,getHotelCate,
getHotelService,getHotelAdmin,getHotelExportExcel,getHotelStatus } from '@/api/hotel-manage/hotel-list'
import { allAddressList } from '@/api/common'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'
import Tinymce from '@/components/Tinymce'
import BaiduMapmy from '@/components/BaiduMapmy'
import SetMerchant from '@/components/SetMerchant'
import OperatePeople from '@/components/OperatePeople'
import SecurityCode from '@/components/SecurityCode'
import HotelPhoto from './components/hotel-photo'
import HotelConfiguration from './components/hotel-configuration'
import HotelCode from './components/hotel-code'
import HouseType from './house-type'
import GiveScore from './components/give-score'
import HotelAccount from './components/hotel-account'

import mix from '@/mixs/mix'
export default {
  components: { Pagination,ImgGallery,Tinymce,BaiduMapmy,SetMerchant,OperatePeople,
  HouseType,HotelPhoto,HotelConfiguration,GiveScore,SecurityCode,HotelAccount,HotelCode },
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
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
       belongRegoinProps2: {
            // checkStrictly: true,
            value:'code',
            label:'name',
            lazy: true,
            lazyLoad: (node, resolve) => {
              this.$nextTick(()=>{
                this.getAreaForLazyLoad2(node, resolve)
              })
            }
      },//级联框prop
      listQuery: {
        keyword: '',
        merch_name:'',
        page: 1,
        size: 20,
        // type:'',
        province_id:'',//省ID
        city_id:'',//城市ID
        area_id:'',//区域ID
        street_id:'',
        start_time:'',
        end_time:'',
      },
      placeOrigin:[],
      dateRange:[],
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      propertyList:[],
      certificationStatus:[],
      rules: {
        title:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        hotel_cate_id:[{ required: true, message: '请选择', trigger: 'change' }],
        address:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        telephone:[{ required: true,  trigger: 'blur',validator: checkPhone, }],
        lng:[{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      editForm: {
        title:'',
        // sellpoint:'',
        hotel_cate_id:'',
        hotel_rank_id:'',
        telephone:'',
        content:'',
        province_id:'',
        city_id:'',
        area_id:'',
        address:'',
        litpic:'',
        booking_notes:'',
        pic_list:'',
        open_time:'',
        decorate_time:'',
        lng:'',
        lat:'',
        is_recommend:'',
        is_discount:'',
        merch_id:'',
        is_show:'',
        around_spots:'',
        traffic:'',
        service_items:'',
        icon_list:'',
        admin_id:'',
        score:5,
        service_list:'',
        date_hour:24,
        group_ids:'',
      },
      open_time:'',
      decorate_time:'',
      admin_name:'',
      merch_name:'',
      service_list:[],
      destination:[],
      editDialogVisible: false,
      dialogTitle: '',
      rolePopLoading: false,
      activeName:'first',
      merchantTypeHelp:false,
      helpDetail:'',
      siteOptions: [],
      merchantImgList:[],
      siteLoading:false,
      hotelRankList:[],
      hotelCateList:[],
      hotelServiceList:[],
      merchantInit:true,
      merchantIconInit:true,
      merchantIconList:[],
      editId:'',
      editFlag:'',
      exportAllloading:false,
      citys_name:'',
      btnAry:[],
      moreBtnFlag:true,
      accountDialogVisible:false,
      accountDialogTitle:'',
      hoteLAccount:'',
      editItem:'',
      checkDialogVisible:false,
      checkDialogTitle:'',
      checkItem:'',
      checkForm:{
        status:1
      },
      checkRules:{
        status:[{ required: true, message: '请选择', trigger: 'change' }]
      },
      cascaderFlag:true,
      paramsFlag:false,
      marchId:'',
      deleteId:'',
    }
  },
  mounted () {
    if(this.$route.params.name != undefined){
      this.listQuery.merch_name = this.$route.params.name
      this.paramsFlag = true
      this.marchId = this.$route.params.id
    }else{
      this.paramsFlag = false
    }
    this.getList();
    // this.getAddressList()
    this.getHotelRankList()
    this.getHotelCateList()
    this.getHotelServiceList()
    this.$store.dispatch('user/showBtn', { id: 42 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
      if(this.btnAry.findIndex(x => x.id == '521')!=-1 || this.btnAry.findIndex(x => x.id == '524')!=-1
      || this.btnAry.findIndex(x => x.id == '530')!=-1 || this.btnAry.findIndex(x => x.id == '531')!=-1
      || this.btnAry.findIndex(x => x.id == '606')!=-1){
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
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if(this.placeOrigin.length>0){
        this.placeOrigin.map((item,i)=>{
          if(i == 0){
            this.listQuery.province_id = item
            this.listQuery.city_id = ''
            this.listQuery.area_id = ''
            this.listQuery.street_id = ''
          }else if(i == 1){
            this.listQuery.city_id = item
          }else if(i == 2){
            this.listQuery.area_id = item
          }else if(i == 3){
            this.listQuery.street_id = item
          }
        })
      }else{
        this.listQuery.province_id = ''
        this.listQuery.city_id = ''
        this.listQuery.area_id = ''
        this.listQuery.street_id = ''
      }
      this.listLoading = true
      // let merchName = ''
      // if(this.paramsFlag){
      //   merchName = this.marchId
      // }else{
      //   merchName = this.listQuery.merch_name
      // }
      let params={
        keyword:this.listQuery.keyword,
        merch_name:this.listQuery.merch_name,
        province_id:this.listQuery.province_id,//省ID
        city_id:this.listQuery.city_id,//城市ID
        area_id:this.listQuery.area_id,//区域ID
        street_id:this.listQuery.street_id,
        start_time:this.listQuery.start_time,
        end_time:this.listQuery.end_time,
        page: this.listQuery.page,
        size: this.listQuery.size,
      }
      getHotelList(params).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        keyword: '',
        merch_name:'',
        page: 1,
        size: 20,
        province_id:'',//省ID
        city_id:'',//城市ID
        area_id:'',//区域ID
        street_id:'',
        start_time:'',
        end_time:'',
      }
      this.dateRange = []
      this.placeOrigin = []
      this.getList();
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
        if(level >= 2){
            resolve()
            return
        }
        let params = {
          code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
              childProjects = res.data.data
              childProjects.map(item => {
                item.leaf = level >= 1; //判断是否为末尾节点
              })
              resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
    },
    getAreaForLazyLoad2(node, resolve) {
        // console.log(node)
        const  level  = node.level
        if(level >= 3){
            resolve()
            return
        }
        let params = {
          code: node.value
        }
        let childProjects = []
        allAddressList(params).then(res => {
            if (res.code == 0) {
              childProjects = res.data.data
              childProjects.map(item => {
                item.leaf = level >= 2; //判断是否为末尾节点
              })
              resolve(childProjects)
            }
        }).catch(err => { console.log(err) })
    },
    // 获取星级数据
    getHotelRankList(){
      getHotelRank().then(res=>{
        this.hotelRankList = res.data
      })
    },
    //获取酒店分类
    getHotelCateList(){
      getHotelCate().then(res=>{
        this.hotelCateList = res.data
      })
    },
    //获取设施
    getHotelServiceList(){
      getHotelService({is_hotel:1}).then(res=>{
        this.hotelServiceList = res.data
      })
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
        this.editForm.province_id = ''
        this.editForm.city_id = ''
        this.editForm.area_id = ''
        this.editForm.litpic = ''
        // console.log(this.editForm)
        this.merchantImgList = []
        this.destination = []
        this.open_time=''
        this.decorate_time=''
        this.admin_name=''
        this.merch_name=''
        this.service_list=[]
        this.merchantIconList = []
        this.editForm.content = ''
        this.editForm.around_spots = ''
        this.editForm.traffic = ''
        this.editForm.service_items = ''
        this.editForm.booking_notes = ''
        this.editForm.lat = ''
        this.editForm.is_recommend = 1
        this.editForm.is_discount = 0
        this.editForm.is_show = 0
        this.editForm.score = 5
        this.editForm.date_hour = 24
        this.citys_name = ''
        this.editForm.group_ids = ''
        setTimeout(()=>{
          this.$refs.tinymce1.setContent('')
          this.$refs.tinymce2.setContent('')
          this.$refs.tinymce3.setContent('')
          this.$refs.tinymce4.setContent('')
          this.$refs.tinymce5.setContent('')
        },500)
      })
      
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
    // 点击编辑
    handleUpdate(item) {
      // console.log(item)
      this.editDialogVisible = true
      this.editFlag = false
      this.cascaderFlag = false
      this.$nextTick(()=>{
        this.cascaderFlag = true
        this.dialogTitle = item.title+'-编辑'
        this.editId = item.id
        this.editItem = item
        for (const key in item) {
          if (this.editForm[key] != undefined) {
            this.editForm[key] = item[key]
          }
        }
        // 时间
        if(item.open_time == null || item.open_time == '0'){}else{
          this.open_time = item.open_time
        }
        if(item.decorate_time == null || item.decorate_time == '0'){}else{
          this.decorate_time = item.decorate_time
        }
        //所在城
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
        this.citys_name = item.citys_name
        // console.log(this.destination)
        //酒店图片
        this.merchantImgList = []
        if(item.pic_list == null || item.pic_list == ''){
        }else{
          if(item.pic_list.length>1){
            let json = item.pic_list.split(',')
            json.map((item2,i)=>{
              let coverImgIf
              if(item2 == item.litpic){
                coverImgIf =true
              }else{
                coverImgIf =false
              }
              let list = {file_url:item2,coverFlag:false,coverImgIf:coverImgIf}
              this.merchantImgList.push(list)
            })
          }else{
            let coverImgIf
            if(item.pic_list == item.litpic){
              coverImgIf =true
            }else{
              coverImgIf =false
            }
            let list = {file_url:item.pic_list,coverFlag:false,coverImgIf:coverImgIf}
            this.merchantImgList.push(list)
          }
        }
        // console.log(this.merchantImgList)
        this.admin_name = item.admin_name
        this.merch_name = item.merch_name
        //酒店设施
        this.service_list = []
        item.service_list.map(item=>{
          this.service_list.push(item.service_id)
        })
        // 编辑器内容
        setTimeout(()=>{
          if(item.content == null || item.content == ''){
            this.$refs.tinymce1.setContent('')
          }else{
            this.$refs.tinymce1.setContent(item.content)
          }
          if(item.around_spots == null || item.around_spots == ''){
            this.$refs.tinymce2.setContent('')
          }else{
            this.$refs.tinymce2.setContent(item.around_spots)
          }
          if(item.service_items == null || item.service_items ==''){
            this.$refs.tinymce3.setContent('')
          }else{
            this.$refs.tinymce3.setContent(item.service_items)
          }
          if(item.traffic == null || item.traffic == ''){
            this.$refs.tinymce4.setContent('')
          }else{
            this.$refs.tinymce4.setContent(item.traffic)
          }
          if(item.booking_notes == null || item.booking_notes == ''){
            this.$refs.tinymce5.setContent('')
          }else{
            this.$refs.tinymce5.setContent(item.booking_notes)
          }
        },500)
        //酒店图标
        this.merchantIconList = []
        if(item.icon_list == null || item.icon_list == ''){
        }else{
          if(item.icon_list.length>1){
            let json = item.icon_list.split(',')
            json.map((item,i)=>{
              let list = {file_url:item,coverFlag:false,coverImgIf:false}
              this.merchantIconList.push(list)
            })
          }else{
            let list = {file_url:item.icon_list,coverFlag:false,coverImgIf:false}
            this.merchantIconList.push(list)
          }
        }
        this.editForm.group_ids = ''
        // console.log(this.merchantIconList)
      })
    },
    
    //查看商家类型解释
    merchantTypeDetail(flag){
        this.merchantTypeHelp = true
        if(flag == '1'){
            this.helpDetail = `<div>旅游产品标题编写建议：</div>
            <div>（1）简洁清晰，包含产品关键要素</div>
            <div>（2）重要信息前置，语句通顺，能吸引人够买</div>
            <div>示例：</div>
            <div>峨眉山金顶-乐山大佛双汽1日游</div>
            <div>武侯祠门票</div>
            <div>香格里拉五星级大酒店</div>`
        }else if(flag == '2'){
            this.helpDetail = `<div>供应商配置位置：【供应商管理】</div>
            <div>（1）当没有使用供应商入驻功能时，通过供应商配置，便于业务管理产品与供应商的对应关系。</div>
            <div>（2）当启用供应商入驻应用时，可以通过供应商配置，实现产品订单与供应商之间的结算。</div>`
            // <div style="margin-top:20px">延伸帮助：</div>
            // <div>启用供应商入驻后，可以实现供应商自己添加管理产品，请参考<a href="" style="color:#006498">供应商产品管理帮助</a></div>
        }else if(flag == '3'){
            this.helpDetail = `<div>上面已选择所在城市，这里请填写详细地址。</div>`
        }else if(flag == '4'){
            this.helpDetail = `<div>设置位置：</div>
            <div>产品应用 >【配置】>【属性分类】</div>
            <div>设置作用：</div>
            <div>为产品设置不同的属性分类，方便用户在产品列表页中，按属性筛选所需产品。</div>
            <div>比如</div>
            <div>纯玩团，自由行，自驾游，度假游；</div>
            <div>五A景区，古镇，田园风光；</div>
            <div>五星级，豪华， 海景。</div>`
        }else if(flag == '5'){
            this.helpDetail = `<div>设置产品图标，便规范热推产品在商品中突出显示；</div>
            <div>也可用于对产品进行分类管理</div>`
            // <div>配置位置：</div>
            // <div>【全局设置】 > 【图标管理】</div>
        }else if(flag == '6'){
            this.helpDetail = `<div>分时入住积分计算起扣点（单位：小时）</div>`
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
      this.$refs.imgGalleryChild.init(flag,2,id)
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
      }else if(data.flag == '2'){
        let arr = [...this.merchantImgList,...data.item]
        const res = new Map();  //定义常量 res,值为一个Map对象实例
        //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        this.merchantImgList = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
        this.merchantImgList.map(item=>{
          item.coverFlag = false
          item.coverImgIf = false
        })
      }
      if(data.addFlagId.length>0){
        this.editForm.group_ids  = data.addFlagId.join(',')
      }
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
    // 选择商家图标
    selectMerchantIcon(item){
      this.merchantIconInit = false
      if(item.coverFlag){
        item.coverFlag = false
      }else{
        item.coverFlag = true
      }
      this.merchantIconInit = true
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
    // 选择商家属性
    selectMerchant(){
      if (this.btnAry.findIndex(x => x.id == '666') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有操作权限'
        })
        return
      }
      if(this.editFlag){
        this.$refs.merchantChild.init(this.editItem)
      }else{
        this.$refs.securityCodeChild.init(this.editItem,'1')
      }
    },
    //点击退房
    confirmSubmit(flag){
      if(flag == '1'){
        this.$refs.merchantChild.init(this.editItem)
      }else if(flag == '2'){
        const params = {
          ids:this.deleteId
        }
        getHotelDel(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }
    },
    getMerchantDatd(item){
      this.editForm.merch_id = item.id
      this.merch_name = item.name
    },
    // 选择酒店运营人员
    operateSelect(){
      if (this.btnAry.findIndex(x => x.id == '667') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有操作权限'
        })
        return
      }
      this.$refs.operatePeopleChild.init()
    },
    getAdminDatd(item){
      this.editForm.admin_id = item.id
      this.admin_name = item.truename
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm1.validate((valid) => {
        if (valid) {
          if(this.destination.length == 0){
            this.$message({
              type: 'warning',
              message: '请选择所在城市!'
            })
            return
          }
          if(this.editForm.lat == ''){
            this.$message({
              type: 'warning',
              message: '请填写坐标!'
            })
            return
          }
          if(this.editForm.merch_id == ''){
            this.$message({
              type: 'warning',
              message: '请选择商家!'
            })
            return
          }
          if(this.open_time == ''){
            this.$message({
              type: 'warning',
              message: '请选择开业时间!'
            })
            return
          }
          if(this.merchantImgList.length == 0){
            this.$message({
              type: 'warning',
              message: '请选择图片并设置封面图片!'
            })
            this.activeName = 'second'
            return
          }
          if(this.editForm.content == '' || this.editForm.content == null){
            this.$message({
              type: 'warning',
              message: '请填写酒店详细!'
            })
            this.activeName = 'fourth'
            return
          }
          this.editForm.open_time = this.open_time
          this.editForm.decorate_time = this.decorate_time
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
          // console.log(this.editForm)
          //图标
          let arr =[]
          this.merchantIconList.map(item=>{
            arr.push(item.file_url)
          })
          this.editForm.icon_list = arr.join(',')
          //酒店图片
          let arr2 =[]
          this.merchantImgList.map(item=>{
            arr2.push(item.file_url)
            if(item.coverImgIf){
              this.editForm.litpic = item.file_url
            }
          })
          this.editForm.pic_list = arr2.join(',')
          this.editForm.service_list=this.service_list.join(',')
          if (this.editFlag) {
            const params = this.editForm
            getHotelAdd(params).then(res => {
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
            getHotelEdit(params).then(res => {
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
        }
      })
    },
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '572') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      let text
      if (row.is_show == 1) {
        text = '下架'
      } else if (row.is_show == 0) {
        text = '上架'
      }
      this.$confirm('确定要改为' + text + '状态吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let is_show
        if (row.is_show == 0) {
          is_show = 1
        } else if (row.is_show == 1) {
          is_show = 0
        }
        const params = {
          id: row.id,
          is_show: is_show
        }
        getHotelEdit(params).then(res => {
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
    //审核
    handleCheck(item){
      if (this.btnAry.findIndex(x => x.id == '616') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      this.checkItem = item
      this.checkDialogTitle = item.title+'-审核'
      this.checkDialogVisible = true
      this.checkForm.status = 1
    },
    checkSure(){
      const params = {
        id: this.checkItem.id,
        status: this.checkForm.status
      }
      getHotelEdit(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.checkDialogVisible = false
          this.getList()
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
          this.$refs.securityCodeChild.init(row,'2')
          this.deleteId = row.id
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
      }).then(() => {
        const idArr = this.multipleSelection.map(x => { return x.id })
        this.$refs.securityCodeChild.init('','2')
        this.deleteId = idArr.join(',')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    //上架下架多条数据
    putaway(flag){
      if(this.multipleSelection.length == 0){
        this.$message({
          type: 'warning',
          message: '请选择要操作的项'
        })
        return
      }
      let params,text
      const idArr = this.multipleSelection.map(x => { return x.id })
      if(flag == '1'){
        params = {
          ids:idArr.join(','),
          type:1
        }
        text = '上架'
      }else if(flag == '2'){
        params = {
          ids:idArr.join(','),
          type:2
        }
        text = '下架'
      }
      getHotelStatus(params).then(res=>{
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: `${text}成功!`
          })
          this.getList()
        }
      })
    },
    //点击房型
    handleHouseType(row){
      this.$refs.houseTypeChild.init(row)
    },
    //点击相册
    handleHousePhoto(row){
      this.$refs.housePhotoChild.init(row)
    },
    successPhoto(){
      this.getList()
    },
    //点击酒店配置
    handleHouseConfiguration(row){
      this.$refs.houseConfigurationChild.init(row)
    },
    //赠送管理
    handleGive(row){
      this.$refs.giveScoreChild.init(row)
    },
    //酒店账号
    handleAccount(row){
      // this.accountDialogVisible = true
      // this.accountDialogTitle = row.title+'-酒店账号'
      // this.hoteLAccount = row.hotel_account
      this.$refs.hotelAccountChild.init(row)
    },
    //酒店二维码
    handleQRcode(row){
      this.$refs.hotelCodeChild.init(row)
    },
    //导出数据
    exportTable(flag){
      let params
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if(this.placeOrigin.length>0){
        this.placeOrigin.map((item,i)=>{
          if(i == 0){
            this.listQuery.province_id = item
            this.listQuery.city_id = ''
            this.listQuery.area_id = ''
            this.listQuery.street_id = ''
          }else if(i == 1){
            this.listQuery.city_id = item
          }else if(i == 2){
            this.listQuery.area_id = item
          }else if(i == 3){
            this.listQuery.street_id = item
          }
        })
      }else{
        this.listQuery.province_id = ''
        this.listQuery.city_id = ''
        this.listQuery.area_id = ''
        this.listQuery.street_id = ''
      }
      // let merchName = ''
      // if(this.paramsFlag){
      //   merchName = this.marchId
      // }else{
      //   merchName = this.listQuery.merch_name
      // }
      if(flag == '1'){
        this.exportAllloading = true
        params={
          keyword:this.listQuery.keyword,
          merch_name:this.listQuery.merch_name,
          province_id:this.listQuery.province_id,//省ID
          city_id:this.listQuery.city_id,//城市ID
          area_id:this.listQuery.area_id,//区域ID
          street_id:this.listQuery.street_id,
          start_time:this.listQuery.start_time,
          end_time:this.listQuery.end_time,
        }
      }else{
        params=this.listQuery
      }
      getHotelExportExcel(params).then(res=>{
        // console.log(res)
        this.exportAllloading = false
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
.city-select{
  /deep/.el-input__inner::placeholder{
    color: #606266;
  }
}
.line{
  border-bottom: 1px solid #DCDFE6;
}
.photo-title{
  font-size: 14px;
  color: #606266;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 5px;
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
