// 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList: [],
    navigator_url: "",
  },
  //options(Object)
  onLoad: function (options) {
    // 原生的请求
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });

    // 使用promise优化原生的请求
    /* 
      这三行代码可以这么理解为: 
        1 一开始同时发送请求,谁先回来谁后回来,没有强制要求
        2 所以首页的请求代码,没有必要使用async语法
    */
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" }).then((result) => {
      // 这里 result 相当于request的index.js文件中的 success:(result)=>{...}
      result.forEach(
        (v) => (v.navigator_url = v.navigator_url.replace("main", "index"))
      );
      this.setData({
        swiperList: result,
      });
    });
  },

  //获取导航栏数据
  getCateList() {
    request({ url: "/home/catitems" }).then((result) => {
      this.setData({
        cateList: result,
      });
    });
  },

  //获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" }).then((result) => {
      this.setData({
        floorList: result,
      });
    });
  },
});
