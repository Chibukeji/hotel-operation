<template>
    <div>
        <el-dialog :visible.sync="houseTypeDialogVisible" :title="propData.title +'-房型'" class="right-dialog" custom-class="left" width="80%">
            <div class="filter-container">
                <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '526')!=-1" class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '528')!=-1" class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button>
                <!-- <el-button class="filter-item" type="primary" size="mini">全部导出</el-button>
                <el-button class="filter-item" type="primary" size="mini">按页导出</el-button> -->
                <el-button v-if="btnAry.findIndex(x => x.id == '575')!=-1" class="filter-item" type="primary" size="mini"  @click="putaway('1')">上架</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '575')!=-1" class="filter-item" type="primary" size="mini"  @click="putaway('2')">下架</el-button>
            </div>
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column label="排序" align="center">
                <template slot-scope="{row}">
                <el-input v-model="row.password_show" />
                </template>
            </el-table-column> -->
            <el-table-column label="房型名称" align="left">
                <template slot-scope="{row}">
                <span>{{ row.room_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="上架时间" align="center" width="160">
                <template slot-scope="{row}">
                <span>{{ row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="添加人" align="center" width="140">
                <template slot-scope="{row}">
                <span>{{ row.admin_info }}</span>
                </template>
            </el-table-column>
             <el-table-column label="门市价" align="center" width="100">
                <template slot-scope="{row}">
                <span>{{ row.sellprice }}</span>
                </template>
            </el-table-column>
             <el-table-column label="当前价" align="center" width="100">
                <template slot-scope="{row}">
                <span>{{ row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否分时" align="center" width="100">
                <template slot-scope="{row}">
                <span v-if="row.is_share_time == 0">否</span>
                <span v-if="row.is_share_time == 1">是</span>
                </template>
            </el-table-column>
            <el-table-column label="上架状态" align="center" width="100">
                <template slot-scope="{row}">
                <el-button v-if="row.status == 0" type="danger" size="mini" @click="handleStatus(row)">下架</el-button>
                <el-button v-if="row.status == 1" type="primary" size="mini" @click="handleStatus(row)">上架</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
                <template slot-scope="{row}">
                <el-button v-if="btnAry.findIndex(x => x.id == '670')!=-1" type="primary" size="mini" @click="handleStatusChange(row)">房态</el-button>
                <el-button v-if="btnAry.findIndex(x => x.id == '527')!=-1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
                    编辑
                </el-button>
                <el-dropdown v-if="moreBtnFlag" trigger="click">
                    <el-button type="primary" size="mini">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '529')!=-1" @click.native="handleRoomConfiguration(row)">房型配置</el-dropdown-item>
                    <el-dropdown-item v-if="btnAry.findIndex(x => x.id == '528')!=-1"  @click.native="handleDelete(row)">删除房型</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
                    删除
                </el-button> -->
                </template>
            </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
        <!-- 添加编辑弹窗 -->
        <el-dialog  :visible.sync="editDialogVisible" :title="dialogTitle" class="center-dialog" width="60%">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="first">
                    <el-form ref="editForm1" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px">
                        <el-form-item label="当前酒店">
                            <span>{{propData.title}}</span>
                        </el-form-item>
                        <el-form-item label="房型名称" prop="room_name">
                            <el-input v-model="editForm.room_name" style="width:300px"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="房型类型" prop="room_type">
                            <el-select v-model="editForm.room_type" placeholder="请选择" style="width:300px">
                                <el-option v-for="(item,index) in roomTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="门市价（元）" prop="sellprice">
                            <el-input v-model="editForm.sellprice" style="display: inline-block;width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="当前价（元）" prop="price">
                            <el-input v-model="editForm.price" style="display: inline-block;width:300px" ></el-input>
                            <!-- <span style="color:red">用于分时互通，酒店补差价</span> -->
                        </el-form-item>
                        <el-form-item label="房间数" prop="nums">
                            <el-input v-model="editForm.nums" style="width:300px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                        </el-form-item>
                        <el-form-item label="退款类型" prop="refund_restriction">
                            <el-radio-group v-model="editForm.refund_restriction">
                                <el-radio :label="1">可退</el-radio>
                                <el-radio :label="0">不可退</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item  prop="is_share_time">
                            <span slot="label">
                                <span>是否分时</span>
                                <!-- <i class="el-icon-question" @click="merchantTypeDetail('1')"></i> -->
                            </span>
                            <el-radio-group v-model="editForm.is_share_time">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否专享" prop="is_vip">
                            <el-radio-group v-model="editForm.is_vip">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否会员折扣" prop="is_member_discount">
                            <el-radio-group v-model="editForm.is_member_discount">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item label="限购数量" prop="limit_number">
                            <span>每个账号限购</span>
                            <el-input v-model="editForm.limit_number" style="display: inline-block;width:80px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            <span>间</span>
                        </el-form-item> -->
                        <!-- <el-form-item label="提前预订时间" prop="booking_before">
                            <span>提前</span>
                            <el-input v-model="editForm.booking_before" style="display: inline-block;width:80px"></el-input>
                            <span>天预订，</span>
                            <el-input v-model="editForm.booking_before" style="display: inline-block;width:80px"></el-input>
                            <span>前结束当天预订</span>
                            <div style="color:#999">前台报价会根据提前时间来显示, 小时分钟均为00时，表示可以在23：59：59秒前预订</div>
                        </el-form-item> -->
                        <el-form-item label="房型促销标签" prop="icon_images">
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
                        <!-- <el-form-item label="会员预订方式" prop="pay_type">
                            <el-radio-group v-model="editForm.pay_type">
                                <el-radio :label="1">全额预订</el-radio>
                                <el-radio :label="2">定金预订</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="会员支付方式" prop="pay_way">
                            <el-checkbox-group v-model="pay_way">
                                <el-checkbox :label="1" name="type">线上支付</el-checkbox>
                                <el-checkbox :label="2" name="type">线下支付</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item> -->
                        <!-- <el-form-item label="会员卡支付" prop="pay_way">
                            <el-radio-group v-model="editForm.pay_way">
                                <el-radio :label="1">否</el-radio>
                                <el-radio :label="2">是</el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item label="待付款时限" prop="auto_close_time">
                            <el-input v-model="limitHour" style="display: inline-block;width:80px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            <span>小时</span>
                            <el-input v-model="limitMinute" style="display: inline-block;width:80px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            <span>分钟</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="房型说明" name="second">
                    <el-form ref="editForm2" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="margin-bottom:50px">
                        <el-form-item label="房间设施" prop="service_list">
                            <el-form-item v-for="(item,index) in hotelServiceList" :key="index" :label="item.service_name" prop="service_list">
                                <el-checkbox-group v-model="service_list">
                                <el-checkbox v-for="(item,m) in item.chlid" :key="m"  :label="item.id" name="type">{{item.service_name}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form-item>
                        <div v-for="(item,index) in roomAttrList" :key="index">
                            <el-form-item v-if="item.output == 'input'" :label="item.attr_name">
                                <el-input v-model="item.value" style="display: inline-block;width:250px"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.output == 'radio'" :label="item.attr_name" required>
                                <el-radio-group v-model="item.value">
                                    <el-radio v-for="(list,k) in item.children" :key="k" :label="list.attr_name" style="margin-bottom:10px">{{list.attr_name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <el-form-item label="房型说明" prop="content">
                            <tinymce ref="tinymce" v-model="editForm.content"  :height="250" style="min-width:600px;width:80%"/>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="房型价格/状态" name="third" v-if="editDialogFlag">
                    <el-form ref="editForm3"  label-position="left" label-width="120px" style="margin-bottom:50px">
                        <el-form-item label="房型报价" >
                            <el-button type="primary" size="small" style="height:32px;margin-top:2px" @click="addRoomPrice">添加报价</el-button>
                        </el-form-item>
                        <div class="demo-calendar" >
                            <el-calendar v-model="calendarValue">
                               <template slot="dateCell" slot-scope="{data}" class="calItem" >
                                   <div @click="editPrice(data.day)" class="calendar-box">
                                        <div class="dayItem"  v-if="data.day.substr(-2) < 10">{{ data.day.substr(-1)}}</div>
                                        <div class="dayItem"  v-else>{{ data.day.substr(-2)}}</div>
                                        <div v-for="(list,k) in roomPriceList" :key="k"  class="click-box">
                                            <div v-if="list.day == data.day">
                                                <div class="font">价格<span style="color:#f60" >￥{{list.price}}</span></div>
                                                <div class="font">是否分时
                                                    <span v-if="list.is_share_time==1" style="color:#1890ff" >是</span>
                                                    <span v-if="list.is_share_time==0" style="color:#1890ff" >否</span>
                                                </div>
                                                <div class="font">是否满房
                                                    <span v-if="list.is_full_house==1" style="color:#1890ff" >是</span>
                                                    <span v-if="list.is_full_house==0" style="color:#1890ff" >否</span>
                                                </div>
                                                <div class="font">库存
                                                    <span v-if="list.num == -1">充足</span>
                                                    <span v-else>{{list.num}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </el-calendar>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="房型图片" name="fourth">
                    <el-form ref="editForm4" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px">
                    <el-form-item label="商家图片" prop="piclist">
                        <span slot="label">
                            <span style="color:red">*</span>
                            <span>房型图片</span>
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
                </el-form>
                </el-tab-pane>
                <el-tab-pane label="入住须知" name="fifth">
                    <tinymce ref="tinymce1" v-model="editForm.check_in_info"  :height="250" style="min-width:600px;width:80%"/>
                </el-tab-pane>
            </el-tabs>
            <div  slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
        <!-- 图片库 -->
        <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
        <!-- 添加报价 -->
        <el-dialog :visible.sync="addOfferDialogVisible" :title="addPriceTitle"  width="50%">
            <el-form ref="addPriceForm" :rules="priceRules" :model="priceForm" label-position="left" label-width="150px" style="margin-bottom:50px">
                <el-form-item v-if="addPriceFlag">
                    <span slot="label">
                        <span style="color:red">*</span>
                        <span>报价日期</span>
                    </span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px" value-format="yyyy-MM-dd" :picker-options="expireTimeOption" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item  prop="type" v-if="addPriceFlag">
                    <el-radio-group v-model="priceForm.type">
                        <el-radio :label="1" >全部日期</el-radio>
                        <el-radio :label="2" >日期范围下的星期</el-radio>
                        <el-radio :label="3" >日期范围下的天</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="addPriceFlag && priceForm.type == 2" class="type-top">
                    <el-checkbox-group v-model="weekSelect" class="week-width">
                        <el-checkbox-button v-for="(item,index) in weekList" :key="index" :label="item">{{item}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="addPriceFlag && priceForm.type == 3" class="type-top">
                    <el-checkbox-group v-model="daySelect" class="day-width">
                        <el-checkbox-button v-for="(item,index) in 31" :key="index" :label="item">{{item}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="priceForm.price" style="display: inline-block;width:200px"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="num">
                    <el-radio-group v-model="inventory">
                        <el-radio :label="1" >不限</el-radio>
                        <el-radio :label="2" >数量</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="数量" v-if="inventory == 2">
                    <el-input v-model="priceForm.num" style="width:200px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item prop="is_share_time" v-if=" this.editItem.is_share_time == 1">
                    <span slot="label">
                        <span>分时抵扣</span>
                        <i class="el-icon-question" @click="merchantTypeDetail('1')"></i>
                    </span>
                    <el-radio-group v-model="priceForm.is_share_time">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="is_full_house" label="是否满房">
                    <el-radio-group v-model="priceForm.is_full_house">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button size="small" type="primary" @click="delAllPrice">清空报价</el-button>
                <el-button size="small" @click="addOfferDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="addPriceSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 类型解释 -->
        <el-dialog :visible.sync="merchantTypeHelp" title="详情" width="40%" >
            <div v-html="helpDetail" class="help-detail"></div>
        </el-dialog>
        <!-- 房型配置 -->
        <room-configuration ref="roomConfigurationChild" @successConfiguration="getList" />
    </div>
</template>

<script>
import { getHouseTypeList,  getHouseTypeAdd,  getHouseTypeEdit,  getHouseTypeDel,getRoomAttr,getRoomPriceList,
getRoomPriceAdd,getRoomPriceEdit,getRoomPriceDel,getHotelRoomStatus} from '@/api/hotel-manage/house-type'
import { getHotelService} from '@/api/hotel-manage/hotel-list'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'
import Tinymce from '@/components/Tinymce'
import RoomConfiguration from './components/room-configuration'
    export default {
        components: { Pagination,ImgGallery,Tinymce,RoomConfiguration},
        data() {
            return {
                houseTypeDialogVisible: false,
                pageDialogTitle:'',
                propData:'',
                listQuery: {
                    page: 1,
                    size: 10,
                    hotel_id:'',
                },
                total:0,
                list: [],
                listLoading:false,
                multipleSelection:[],
                editDialogVisible:false,
                dialogTitle:'',
                editId:'',
                activeName:'first',
                rules: {
                    room_name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                    room_type:[{ required: true, message: '请选择', trigger: 'change' }],
                    price:[{ required: true, message: '请输入内容', trigger: 'blur' },
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                    sellprice:[{ required: true, message: '请输入内容', trigger: 'blur' },
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                    refund_restriction:[{ required: true, message: '请选择', trigger: 'change' }],
                    is_share_time:[{ required: true, message: '请选择', trigger: 'change' }],
                    is_vip:[{ required: true, message: '请选择', trigger: 'change' }],
                    is_member_discount:[{ required: true, message: '请选择', trigger: 'change' }],
                    // limit_number:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                    // icon_images:[{ required: true, message: '请选择', trigger: 'blur' }],
                    pay_type:[{ required: true, message: '请选择', trigger: 'change' }],
                    // pay_way:[{ required: true, message: '请选择', trigger: 'change' }],
                    // service_list:[],
                    // auto_close_time:'',
                    // piclist:'',
                    // content:'',
                    nums:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                },
                editForm:{
                    room_name:'',
                    room_type:'',
                    price:'',
                    sellprice:'',
                    refund_restriction:'',
                    is_share_time:'',
                    limit_number:'',
                    icon_images:'',
                    pay_type:'',
                    pay_way:'',
                    service_list:'',
                    auto_close_time:'',
                    piclist:'',
                    content:'',
                    litpic:'',
                    attr_data:[],
                    nums:'',
                    is_vip:'',
                    check_in_info:'',
                    is_member_discount:'',
                },
                limitHour:'',
                limitMinute:'',
                service_list:[],
                pay_way:[],
                merchantIconList:[],
                merchantIconInit:true,
                roomAttrList:[],
                merchantImgList:[],
                merchantInit:true,
                addOfferDialogVisible:false,
                dateRange:[],
                hotelServiceList:[],
                roomPriceList:[],
                calendarValue: new Date(),
                priceForm:{
                    hotel_id:'',
                    room_id:'',
                    start_time:'',
                    end_time:'',
                    type:1,
                    price:'',
                    num:'',
                    datetime:'',
                    is_share_time:'',
                    is_full_house:'',
                },
                priceRules:{
                    type:[{ required: true, message: '请选择', trigger: 'change' }],
                    price:[{ required: true, message: '请输入内容', trigger: 'blur' },
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                    // num:[{ required: true, message: '请输入内容', trigger: 'blur' }],
                },
                inventory:1,
                addPriceTitle:'',
                addPriceFlag:'',
                addPriceId:'',
                editDialogFlag:false,
                addDataId:'',
                addIo:false,
                addList:[],
                editFlag:'',
                editItem:'',
                monthNum:0,
                weekList:['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
                weekSelect:[],
                daySelect:[],
                addPriceDay:'',
                editNum:0,
                expireTimeOption: {
                    disabledDate(date) {
                        return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
                merchantTypeHelp:false,
                helpDetail:'',
                roomTypeList:[
                    {name:'普通房',value:0},
                    {name:'包销房',value:1},
                    {name:'尾房',value:2},
                ],
                btnAry:[],
                moreBtnFlag:true,
            }
        },
        mounted () {
            this.$store.dispatch('user/showBtn', { id: 42 }).then(res => {
                let btn = res.children
                let item = btn.find(x => x.id == '524')
                this.btnAry = item.children
                // console.log(this.btnAry)
                if(this.btnAry.findIndex(x => x.id == '528')!=-1 || this.btnAry.findIndex(x => x.id == '529')!=-1){
                    this.moreBtnFlag = true
                }else{
                    this.moreBtnFlag = false
                }
            })
        },
        methods: {
            init(row) {
                this.houseTypeDialogVisible = true
                this.propData = row
                this.listQuery.hotel_id = row.id
                this.listQuery.page = 1
                this.getList();
                this.getRoomAttrList()
                this.getHotelServiceList()
            },
            // 获取列表
            getList() {
                this.listLoading = true
                getHouseTypeList(this.listQuery).then(res => {
                    this.list = res.data.data.data
                    this.total = res.data.data.total
                    this.listLoading = false
                })
            },
            //刷新
            refresh(){
                this.listQuery.page = 1
                this.getList();
            },
            //获取设施
            getHotelServiceList(){
                getHotelService({is_hotel:0}).then(res=>{
                    this.hotelServiceList = res.data
                })
            },
            // 获取房间属性
            getRoomAttrList(){
                getRoomAttr().then(res=>{
                    this.roomAttrList = res.data
                })
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
                this.activeName = 'first'
                this.editDialogFlag = false
                this.editFlag = true
                this.$nextTick(()=>{
                    this.$refs.editForm1.resetFields();
                    this.$refs.editForm2.resetFields();
                    this.editForm.attr_data = []
                    this.editForm.litpic = ''
                    this.editForm.piclist = ''
                    // console.log(this.editForm)
                    this.merchantImgList = []
                    this.merchantIconList = []
                    this.pay_way = [1]
                    this.editForm.pay_way = 1
                    this.editForm.pay_type = 1
                    this.editForm.refund_restriction = 1
                    this.editForm.is_share_time = 1
                    this.editForm.is_vip = 1
                    this.editForm.is_member_discount = 1
                    this.editForm.limit_number = 0
                    this.editForm.room_type = 0
                    this.limitHour = ''
                    this.limitMinute = ''
                    this.service_list = []
                    this.roomAttrList.map((item2,i)=>{
                        item2.value = ''
                    })
                    setTimeout(()=>{
                        this.$refs.tinymce.setContent('')
                        this.$refs.tinymce1.setContent('')
                    },500)
                })
            },
            //点击房态
            handleStatusChange(item){
                this.handleUpdate(item)
                this.activeName = 'third'
            },
            // 点击编辑
            handleUpdate(item) {
                // console.log(item)
                this.editItem = item
                this.editDialogVisible = true
                this.editId = item.id
                this.dialogTitle = item.room_name+'-编辑'
                this.editDialogFlag = true
                this.editFlag = false
                this.calendarValue =  new Date()
                this.editNum++
                this.$nextTick(()=>{
                    for (const key in item) {
                        if (this.editForm[key] != undefined) {
                            this.editForm[key] = item[key]
                        }
                    }
                    //房型图片
                    this.merchantImgList = []
                    if(item.piclist == null || item.piclist == ''){
                    }else{
                        if(item.piclist.length>1){
                            let json = item.piclist.split(',')
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
                            if(item.piclist == item.litpic){
                                coverImgIf =true
                            }else{
                                coverImgIf =false
                            }
                            let list = {file_url:item.piclist,coverFlag:false,coverImgIf:coverImgIf}
                            this.merchantImgList.push(list)
                        }
                    }
                    //房型促销标签
                    this.merchantIconList = []
                    if(item.icon_images == null|| item.icon_images == '' ){
                    }else{
                        if(item.icon_images.length>1){
                            let json = item.icon_images.split(',')
                            json.map((item,i)=>{
                            let list = {file_url:item,coverFlag:false,coverImgIf:false}
                            this.merchantIconList.push(list)
                            })
                        }else{
                            let list = {file_url:item.icon_images,coverFlag:false,coverImgIf:false}
                            this.merchantIconList.push(list)
                        }
                    }
                    //会员支付方式
                    this.pay_way = []
                    if(item.pay_way == null || item.pay_way == ''){
                    }else if(item.pay_way == 3){
                        this.pay_way = [1,2]
                    }else{
                        this.pay_way.push(item.pay_way)
                    }
                    //待付款时限
                    let time = item.auto_close_time
                    this.limitHour = parseInt(time/60)
                    this.limitMinute = parseInt(time%60)
                    //房型设施
                    this.service_list = []
                    if(item.service_list.length>0){
                        item.service_list.map(item=>{
                            this.service_list.push(item.service_id)
                        })
                    }
                    this.roomAttrList.map((item2,i)=>{
                        item.attr_data.map((item3,j)=>{
                            if(item2.id == item3.attr_id ){
                                item2.value = item3.attr_value
                            }
                        })
                    })
                    // 编辑器内容
                    setTimeout(()=>{
                        if(item.check_in_info == null || item.check_in_info == ''){
                            this.$refs.tinymce1.setContent('')
                        }else{
                            this.$refs.tinymce1.setContent(item.check_in_info)
                        }
                        if(item.content == null || item.content == ''){
                            this.$refs.tinymce.setContent('')
                        }else{
                            this.$refs.tinymce.setContent(item.content)
                        }
                    },500)
                    if(this.editNum == 1){
                        let vm = this
                        let calendarMonth = this.calendarValue.getMonth() + 1
                        let nowDate = new Date();
                        // 点击前上个月
                        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
                        prevBtn.addEventListener('click',() => {
                            vm.hourseTypePrice()
                            if(vm.calendarValue <= nowDate){
                                prevBtn.style.display="none"
                            }else{
                                nprevBt.style.display="block";
                            }
                        })
                        // 点击今天
                        let prevBtn3 = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)');
                        // prevBtn3.removeEventListener('click'); //解绑点击事件
                        prevBtn3.addEventListener('click',() => {
                            vm.hourseTypePrice()
                            prevBtn.style.display="none";
                        })
                        // 点击前下个月
                        let prevBtn2 = document.querySelector('.el-calendar__button-group .el-button-group>button:last-child');
                        prevBtn2.addEventListener('click',() => {
                            vm.hourseTypePrice()
                            if(vm.calendarValue <= nowDate){
                                prevBtn.style.display="none"
                            }else{
                                prevBtn.style.display="block";
                            }
                        })
                    }else{
                        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
                        prevBtn.style.display="none"
                    }
                })
                this.hourseTypePrice()
            },
            //获取房型报价
            hourseTypePrice(){
                let calendarMonth = this.calendarValue.getMonth() + 1
                let nowDate = new Date();
                let today = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' +nowDate.getDate()
                // nowDate.setMonth(nowDate.getMonth()+parseInt(this.monthNum))
                // let nowMonth = nowDate.getMonth()+1
                let date = {
                    year: this.calendarValue.getFullYear(),
                    month:(calendarMonth<10)?'0'+calendarMonth:calendarMonth,
                }
                let systemDate = date.year + '-' + date.month ;
                let params = {
                    room_id:this.editId,
                    time:systemDate
                }
                // nowDate.setDate(0);
                let dayArray = [];
                //获取某月份的天数
                let everyday = new Date(date.year,date.month,0); 
                var day = everyday.getDate();
                // console.log(day)
                for (let i = 1; i <= day; i++) {
                    let dd  = (i<10)?'0'+i:i
                    dayArray.push(date.year + '-' + date.month+'-'+dd);
                }
                getRoomPriceList(params).then(res=>{
                    this.roomPriceList = []
                    let monthDataArr = []
                    let resArray= res.data.data
                    //取出没有特价的日期
                    let day = resArray.map(item => item.day);
                    // console.log(day)
                    let nums
                    if(this.editItem.nums == '' || this.editItem.nums == null){
                        nums = '-1'
                    }else{
                        nums = this.editItem.nums
                    }
                    dayArray.map((item, index) => {
                        if (!day.includes(item)) {
                            let json={day: item,num: nums,price: this.editItem.price,is_share_time:this.editItem.is_share_time,is_full_house:0}
                            monthDataArr.push(json)
                        }
                    });
                    //加入特价的日期
                    resArray.map(item=>{
                        monthDataArr.push(item) 
                    }); 
                    //今天之前的日期不显示
                    var stdt = new Date(today.replace(/-/g, "/"));//最好使用replace(/\-/g, "\/")
                    // console.log(today)
                    // console.log(stdt)
                    monthDataArr.map(item=>{
                        var etdt = new Date(item.day.replace(/-/g, "/"));//replace(/\-/g, "\/")
                        if(stdt <= etdt){
                           this.roomPriceList.push(item)
                        }
                    })
                    // console.log(this.roomPriceList)
                })
            },
             //获取房型报价
            hourseTypePrice2(arrDay){
                let nowDate = new Date();
                let today = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' +nowDate.getDate()
                let systemDate = arrDay[0]+'-'+arrDay[1]
                let params = {
                    room_id:this.editId,
                    time:systemDate
                }
                let dayArray = [];
                //获取某月份的天数
                let year = parseInt(arrDay[0])
                let month = parseInt(arrDay[1])
                let everyday = new Date(year,month,0); 
                var day = everyday.getDate();
                for (let i = 1; i <= day; i++) {
                    let dd  = (i<10)?'0'+i:i
                    let mm = (month<10)?'0'+month:month
                    dayArray.push(year + '-' + mm+'-'+dd);   //选中月份的每一天
                }
                getRoomPriceList(params).then(res=>{
                    this.roomPriceList = []
                    let monthDataArr = []
                    let resArray= res.data.data
                    //取出没有特价的日期
                    let day = resArray.map(item => item.day);
                    // console.log(day)
                    let nums
                    if(this.editItem.nums == '' || this.editItem.nums == null){
                        nums = '-1'
                    }else{
                        nums = this.editItem.nums
                    }
                    dayArray.map((item, index) => {
                        if (!day.includes(item)) {
                            let json={day: item,num: nums,price: this.editItem.price,is_share_time:this.editItem.is_share_time,is_full_house:0}
                            monthDataArr.push(json)
                        }
                    });
                    // console.log(monthDataArr)
                    //加入特价的日期
                    resArray.map(item=>{
                        monthDataArr.push(item) 
                    }); 
                    //今天之前的日期不显示
                    var stdt = new Date(today.replace(/-/g, "/"));//最好使用replace(/\-/g, "\/")
                    // console.log(monthDataArr)
                    monthDataArr.map(item=>{
                        var etdt = new Date(item.day.replace(/-/g, "/"));//replace(/\-/g, "\/")
                        if(stdt <= etdt){
                           this.roomPriceList.push(item)
                        }
                    })
                    // console.log(this.roomPriceList)
                })
            },
            // 弹窗确定
            submitHandle() {
                this.$refs.editForm1.validate((valid) => {
                    if (valid) {
                        for(let i=0;i<this.roomAttrList.length;i++){
                            if(this.roomAttrList[i].output == 'radio'){
                                if(this.roomAttrList[i].value == '' || this.roomAttrList[i].value == null){
                                    this.$message({
                                        type: 'warning',
                                        message: `请选择${this.roomAttrList[i].attr_name}!`
                                    })
                                    this.activeName = 'second'
                                    return
                                }
                            }
                        }
                        if(this.merchantImgList.length == 0){
                            this.$message({
                                type: 'warning',
                                message: '请选择图片并设置封面图片!'
                            })
                            this.activeName = 'fourth'
                            return
                        }
                        if(parseFloat(this.editForm.sellprice) < parseFloat(this.editForm.price)){
                            this.$message({
                                type: 'warning',
                                message: '当前价必须小于或等于门市价!'
                            })
                            this.activeName = 'first'
                            return
                        }
                        //房型促销标签
                        let arr =[]
                        this.merchantIconList.map(item=>{
                            arr.push(item.file_url)
                        })
                        this.editForm.icon_images = arr.join(',')
                        //房型图片
                        let arr2 =[]
                        this.merchantImgList.map(item=>{
                            arr2.push(item.file_url)
                            if(item.coverImgIf){
                                this.editForm.litpic = item.file_url
                            }
                        })
                        this.editForm.piclist = arr2.join(',')
                        //待付款时限
                        this.editForm.auto_close_time = this.limitHour*60+parseInt(this.limitMinute)
                        //房间设施
                        this.editForm.service_list=this.service_list.join(',')
                        //会员支付方式
                        this.editForm.pay_way=this.pay_way.join(',')
                        //
                        this.editForm.attr_data=[]
                        this.roomAttrList.map(item=>{
                            let json={id:item.id,value:item.value}
                            this.editForm.attr_data.push(json)
                        })
                        if (this.editFlag) {
                            const params = Object.assign(this.editForm,{hotel_id:this.propData.id}) 
                            getHouseTypeAdd(params).then(res => {
                                if (res.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    })
                                    this.getList()
                                    // this.editDialogVisible = false
                                    this.addIo = true
                                    this.activeName = 'third'
                                    this.addDataId = res.data
                                    //获取添加到的那条数据
                                    getHouseTypeList({id:res.data}).then(res => {
                                        this.addList = res.data.data.data
                                        this.handleUpdate(this.addList[0])
                                    })
                                }
                            })
                        } else{
                            const params =  Object.assign(this.editForm,{id:this.editId}) 
                            getHouseTypeEdit(params).then(res => {
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
            //添加房型报价
            addRoomPrice(){
                this.addOfferDialogVisible = true
                this.addPriceTitle = '添加报价'
                this.addPriceFlag = true
                this.priceForm = {
                    hotel_id:'',
                    room_id:'',
                    start_time:'',
                    end_time:'',
                    type:1,
                    price:'',
                    num:'',
                    datetime:'',
                    is_share_time:1,
                    is_full_house:0,
                }
                this.inventory = 1
                this.dateRange = []
                this.weekSelect = []
                this.daySelect = []
            },
            //编辑报价
            editPrice(day){
                let list
                let date = new Date();
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let arrDay = day.split('-')
                // console.log(arrDay)
                let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
                let vm = this
                if( parseInt(arrDay[0]) == year){
                    if(month > parseInt(arrDay[1]) ){
                    }else if(month == parseInt(arrDay[1])){
                        this.hourseTypePrice2(arrDay)
                        prevBtn.style.display="none";
                    }else{
                        this.hourseTypePrice2(arrDay)
                        prevBtn.style.display="block";
                    }
                }else if(parseInt(arrDay[0]) >= year){
                    this.hourseTypePrice2(arrDay)
                    prevBtn.style.display="block";
                }else{
                    // prevBtn.style.display="none";
                }
                this.roomPriceList.map(item=>{
                    if(item.day ==day ){
                        list = item
                    }
                })
                if(list != undefined){
                    // console.log(list)
                    this.addOfferDialogVisible = true
                    this.addPriceTitle = `修改报价-${list.day}`
                    this.addPriceFlag = false
                    this.addPriceId = list.id
                    this.addPriceDay = list.day
                    this.priceForm.price = list.price
                    this.priceForm.num = list.num
                    this.priceForm.is_full_house = list.is_full_house
                    if(list.is_share_time == undefined){
                        this.priceForm.is_share_time = this.editItem.is_share_time 
                    }else{
                        this.priceForm.is_share_time = list.is_share_time
                    }
                    if(list.num == -1){
                        this.inventory = 1
                    }else{
                        this.inventory = 2
                    }
                }
            },
            //房型报价确定按钮
            addPriceSubmit(){
                this.$refs.addPriceForm.validate((valid) => {
                    if (valid) {
                        if(this.inventory == 2){
                            if(this.priceForm.num == ''){
                                this.$message({
                                    type: 'warning',
                                    message: '请填写库存数量'
                                })
                                return
                            }
                        }
                        if(this.addPriceFlag){
                            if (this.dateRange == null || this.dateRange.length == 0){
                                this.$message({
                                    type: 'warning',
                                    message: '请选择报价日期'
                                })
                                return
                            }
                            this.priceForm.hotel_id = this.propData.id
                            this.priceForm.room_id = this.editId
                            this.priceForm.start_time = this.dateRange[0]
                            this.priceForm.end_time = this.dateRange[1]
                            if(this.inventory == 1){
                                this.priceForm.num = -1
                            }
                            if(this.priceForm.type == 2){
                                this.priceForm.datetime = this.weekSelect.join(',')
                            }else if(this.priceForm.type == 3){
                                this.priceForm.datetime = this.daySelect.join(',')
                            }
                            let params = this.priceForm
                            getRoomPriceAdd(params).then(res=>{
                                if (res.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    })
                                    this.hourseTypePrice()
                                    this.addOfferDialogVisible = false
                                }
                            })
                        }else{
                            if(this.inventory == 1){
                                this.priceForm.num = -1
                            }
                            let params = {
                                // id:this.addPriceId,
                                hotel_id:this.propData.id,
                                room_id:this.editId,
                                day:this.addPriceDay,
                                price:this.priceForm.price,
                                num:this.priceForm.num,
                                is_share_time:this.priceForm.is_share_time,
                                is_full_house:this.priceForm.is_full_house
                            }
                            getRoomPriceEdit(params).then(res=>{
                                if (res.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑成功!'
                                    })
                                    this.hourseTypePrice()
                                    this.addOfferDialogVisible = false
                                }
                            })
                        }
                 }
                })
            },
            //清空报价
            delAllPrice(){
                if (this.dateRange == null || this.dateRange.length == 0){
                    this.$message({
                        type: 'warning',
                        message: '请选择报价日期'
                    })
                    return
                }
                this.$confirm('确认要清空报价吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        room_id:this.editId,
                        start_time:this.dateRange[0],
                        end_time:this.dateRange[1],
                    }
                    getRoomPriceDel(params).then(res=>{
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            })
                            this.hourseTypePrice()
                            this.addOfferDialogVisible = false
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
                this.$refs.imgGalleryChild.init(flag,2,this.listQuery.hotel_id)
            },
            //获取选择的图片
            selectImgList(data){
                if(data.flag == '1'){
                    let arr = [...this.merchantIconList,...data.item]
                    const res = new Map();  //定义常量 res,值为一个Map对象实例
                    //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
                    this.merchantIconList = arr.filter((arr) => !res.has(arr.file_url) && res.set(arr.file_url, 1)) 
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
            },
            //删除房型促销标签
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
            // 选择房型促销标签
            selectMerchantIcon(item){
                this.merchantIconInit = false
                if(item.coverFlag){
                    item.coverFlag = false
                }else{
                    item.coverFlag = true
                }
                this.merchantIconInit = true
            },
            // 选择房型图片
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
            //查看类型解释
            merchantTypeDetail(flag){
                this.merchantTypeHelp = true
                if(flag == '1'){
                    this.helpDetail = `<div>分时积分与当前价格相等，分时积分比例（1：1）</div>`
                }
            },
            //删除房型图片
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
            //点击房型配置
            handleRoomConfiguration(row){
                this.$refs.roomConfigurationChild.init(row)
            },
            // 点击修改状态
            handleStatus(row) {
            if (this.btnAry.findIndex(x => x.id == '575') == -1) {
              this.$message({
                type: 'warning',
                message: '您没有权限修改'
              })
              return
            }
                let text
                if (row.status == 1) {
                    text = '下架'
                } else if (row.status == 0) {
                    text = '上架'
                }
                this.$confirm('确定要改为' + text + '状态吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status
                    if (row.status == 0) {
                        status = 1
                    } else if (row.status == 1) {
                        status = 0
                    }
                    const params = {
                        id: row.id,
                        status: status
                    }
                    getHouseTypeEdit(params).then(res => {
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
            // 删除单条数据
            handleDelete(row, index) {
                this.$confirm('确认要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        ids: row.id
                    }
                    getHouseTypeDel(params).then(res => {
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
                }).then(() => {
                    const idArr = this.multipleSelection.map(x => { return x.id })
                    const params = {
                        ids: idArr.join(',')
                    }
                    getHouseTypeDel(params).then(res => {
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
                getHotelRoomStatus(params).then(res=>{
                    if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: `${text}成功!`
                    })
                    this.getList()
                    }
                })
            },
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
.demo-calendar{
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin-bottom: 20px;
}
.dayItem{
    text-align: center;
}
.center-dialog{
    /deep/.el-dialog__body {
        padding: 20px 20px;
    }
}
/deep/.el-checkbox-button--medium .el-checkbox-button__inner{
    padding: 10px;
    font-size: 12px;
}
/deep/.el-checkbox-button--medium .el-checkbox-button__inner {
    padding: 5px 0px;
    margin: 0px 5px;
    width: 30px;
    margin-top: 5px;
    text-align: center;
    border-left: 1px solid #DCDFE6;
}
/deep/.el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-left: none;
}
.week-width{
    /deep/.el-checkbox-button--medium .el-checkbox-button__inner {
        padding: 10px 0px;
        width: 70px;
        text-align: center;
    } 
}
.day-width{
    /deep/.el-checkbox-button--medium .el-checkbox-button__inner {
        padding: 10px 0px;
        width: 50px;
        text-align: center;
    } 
}
.type-top{
    margin-top: -20px;
}
/deep/.el-calendar__button-group .el-button-group>button:nth-child(1){
    display: none;
}
/deep/.el-calendar-day{
    padding: 0;
    .calendar-box{
        width: 100%;
        height: 100%;
        padding: 8px;
        box-sizing: border-box;
    }
}
/deep/.el-button-group>.el-button:not(:first-child):not(:last-child):after {
  content: '本月';
}
/deep/.el-button-group>.el-button:not(:first-child):not(:last-child) span {
  display: none;
}
.el-icon-question{
    cursor: pointer;
}
.my-dropdown{
  /deep/.el-button-group>.el-button+.el-button {
    height: 28px;
  }
}
/deep/.el-dropdown-menu__item {
  padding: 5px 30px;
}
.font{
    font-size: 12px;
}
/deep/.el-calendar-table .el-calendar-day{
    height: 100px;
}
</style>