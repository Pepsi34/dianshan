// 引入用来发送请求的方法 一定要把路径补全
import {getSetting,chooseAddress,openSetting} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({

  data: {
    address:{},
    cart:[],
    totalPrice: 0,
    totalNum: 0
  },
  /*
    使用onShow周期函数是因为购物车需要频繁被打开和隐藏，
    重新打开可以初始化页面
  */
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v=>v.checked);
    this.setData({
      address
    })
    // 计算总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  }
})