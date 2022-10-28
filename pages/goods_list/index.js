import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodList();
  },

  // 获取商品列表数据
  async getGoodList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // 总条数
    const {total} = res;
    // 计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    // 拼接请求返回的数据 以前的数据和新的数据进行拼接
    // res.forEach(v => v.navigator_url = v.navigator_url.replace("/goods_list","/goods_list/index"));
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    });
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 滚动条触底事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据'
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },

  //下拉刷新功能
  onPullDownRefresh(){
    // 重置数据数组
    this.goodsList = [];
    // 重置页码为 1
    this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodList();
  }
})