<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="900px" class="center-dialog" append-to-body>
        <div id="copy_container" class="copy-wrap-page">
            <div class="top-box">
                <div class="center-title" style="text-align: center;font-weight: bold;color: #000;">温泉酒店
                    <div>账单</div>
                </div>
                <div class="top-content">
                    <!-- <div class="flex-box">
                        <span class="left-box">客人账号：6572424</span>
                        <span>No：2</span>
                    </div>
                    <div class="flex-box">
                        <span class="left-box">姓名Name：6572424</span>
                        <span>房型RoomType：2576574546566t4564645665464565787686869</span>
                    </div>
                    <div class="flex-box">
                        <span class="left-box">入住时间AD：6572424</span>
                        <span>离店时间PT：2576574546566</span>
                    </div>
                    <div class="flex-box">
                        <span class="left-box">客户Customer：6572424</span>
                        <span>房价RoomPrice：2576574546566</span>
                    </div>
                    <div class="flex-box">
                        <span class="left-box">手机号PhoneNumber：6572424</span>
                        <span>客人类型GuestType：驰步优宿</span>
                    </div> -->
                    <div class="left-content">
                        <div class="left-box">客人账号：{{InfoList.member_id}}</div>
                        <div class="left-box">姓名Name：{{InfoList.link_name}}</div>
                        <div class="left-box">入住时间AD：{{InfoList.consume_time}}</div>
                        <div class="left-box">客户Customer：{{InfoList.source}}</div>
                        <div class="left-box">手机号PhoneNumber：{{InfoList.link_phone}}</div>
                    </div>
                    <div class="right-content">
                        <!-- <div>No：{{InfoList.}}</div> -->
                        <div>房型RoomType：{{InfoList.room_name}}</div>
                        <div>离店时间PT：{{InfoList.finish_time}}</div>
                        <div>房价RoomPrice：{{InfoList.order_money}}</div>
                        <div>客人类型GuestType：驰步优宿</div>
                    </div>
                </div>
            </div>
            <div class="center-box" style="width: 100%">
                <el-table :data="InfoList.order_child" style="width: 100%">
                    <el-table-column  prop="use_in_date" label="日期" width="160" align="center"></el-table-column>
                    <el-table-column prop="room_name" label="房型"  align="center"></el-table-column>
                    <el-table-column prop="link_name" label="姓名" width="120" align="center"></el-table-column>
                    <el-table-column prop="price" label="消费" width="100" align="center"></el-table-column>
                    <el-table-column prop="price" label="结算" width="120" align="center"></el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center" ></el-table-column>
                </el-table>
            </div>
            <div class="bottom-box top-box">
                <div class="top-content">
                     <div class="left-content">
                        <div class="left-box">打印人：{{InfoList.printer}}</div>
                        <div class="left-box">打印次数：1</div>
                        <div class="left-box">打印时间：{{InfoList.create_time}}</div>
                    </div>
                    <div class="right-content">
                        <div>总计： <span>{{InfoList.order_money}}</span> <span style="margin-left:80px">{{InfoList.order_money}}</span></div>
                        <div>余额：{{InfoList.member_money}}</div>
                    </div>
                </div>
            </div>
            <div class="guest-sign-box">
                <div class="sign-wrap-box">
                    <div>客户签名</div>
                    <div ><span>GuestSign：</span> <span class="line-bitom"></span></div>
                    <!-- <span class="line-bitom"></span> -->
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer copy-btn-box">
            <el-button size="small" type="primary" @click="copyHandle()">打印</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPrintInfo } from '@/api/order/order-list'
import Pagination from '@/components/Pagination'
import Print from 'print-js'
export default {
  components: { Pagination },
  data() {
    return {
      dialogTitle: "打印",
      detailDialogVisible: false,
      detailItem:'',
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市bmfombgfopmhboftmhothmotm'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市'
          }],
        InfoList:{},
    };
  },
  mounted() {},
  methods: {
    init(item) {
        this.detailDialogVisible = true
        this.detailItem = item
        this.getPrintInfoList()
    },
    //获取打印信息
    getPrintInfoList(){
        getPrintInfo({order_id:this.detailItem.id}).then(res=>{
            this.InfoList = res.data
        })
    },
    copyHandle(){
        console.log(111)
        Print({
          printable: 'copy_container',
          type: 'html',
          // 继承原来的所有样式
          targetStyles: ['*']
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-wrap-page{
    padding:0 50px ;
    .top-box{
        border-bottom:1px solid #666; 
        .center-title{
            text-align: center;
            font-weight: bold;
            color: #000;
            margin-top: 10px;
        }
        .top-content{
            margin-top: 20px;
            width: 100%;
            display: flex;
            color: #000;
            .left-content{
                width: 410px;
                div{
                    margin-bottom: 5px;
                }
            }
            .right-content{
                flex: 1;
                div{
                    margin-bottom: 5px;
                }
            }
            .left-box{
                width: 410px;
            }
        }
    }
    .center-box{
        width: 100%;
        border-top:1px solid #666; 
        border-bottom:2px solid #666; 
    }   
    .bottom-box{
        border-bottom:none; 
        .flex-box{
                .left-box{
                    width: 410px!important;
                }
            }
    }
    /deep/.el-table th.is-leaf {
        border-bottom: none;
    }
    /deep/.el-table td {
        border-bottom: none;
    }
    .el-table::before {
        background-color: #fff;
    }
    .el-table{
    //    border-top:1px solid #666; 
    //    border-bottom:1px solid #666; 
    }
    /deep/.el-table th>.cell{
        color: #000;
    }
    .guest-sign-box{
        // position: absolute;
        // right: 200px;
        width: 100%;
        .sign-wrap-box{
            float: right;
            margin-right: 100px;
            color: #000;
            margin-top: 10px;
            width: 200px;
            .line-bitom{
                border-bottom:1px solid #666;
                display: inline-block;
                width: 80px;
            }
        }
    }
    /deep/.el-table td>.cell {
        color:#000;
    }
}
.copy-btn-box{
  text-align: center;
}
</style>