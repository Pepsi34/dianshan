// 引入用来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    currentIndex: 0,
    scrollTop:0
  },
  // 为了方便使用数据，在data同层级下创建Cates空数组接收接口返回的数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      1 先判断一下本地存储中有没有旧的数据
        {time:Date.now(),data:[...]}
      2 没有旧数据 直接发送新请求 
      3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
    */

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync('cates');
    //  2 判断  
    if(!Cates){
      // 不存在 发送请求获取数据
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间5分钟 1000ms = 1s
      if(Date.now()-Cates.time>1000*300){
        // 重新发送请求
        this.getCates();
      }else{
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // 构造右侧的大菜单数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  // async function() 
  // 用来定义一个返回 AsyncFunction 对象的异步函数
  async getCates(){
    // request({url: '/categories'})
    //   .then(res=>{
    //     this.Cates = res.data.message;
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v=>v.cat_name);
    //     // 构造右侧的大菜单数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    // 使用es7的async await来发送请求
    const res = await request({url:"/categories"});
    // this.Cates = res.data.message; 简化
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构造右侧的大菜单数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})