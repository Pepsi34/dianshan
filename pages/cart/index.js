// 引入用来发送请求的方法 一定要把路径补全
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({

  data: {
    address:{},
    cart:[],
    allChecked: false,
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
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },
  
  async handleChooseAddress(e){
    try {
      // 1 获取权限状态
      const res1 = await getSetting(); 
      // 发现一些属性名称很怪异的时候，都要使用 []形式来获取属性
      const scopeAddress = res1.authSetting["scope.address"]
      // 2 判断权限状态
      if(scopeAddress === false){
        await openSetting();
      }
      // 4 调用获取收获地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5 存入到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },

  // 商品选中
  handleItemChange(e){
    // 获取商品的 goods_id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 获取被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    // 被选中状态取反
    cart[index].checked = !cart[index].checked;
    // 重新计算总价格和总数量
    this.setCart(cart);
  },

  // 全选和反选
  handleAllChange(){
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        // 4.2 从index位开始，删除一个元素
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 5 进行修改数量
      cart[index].num += operation;
      // 6 设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 结算按钮
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.data;
    // 判断有没有收货地址
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },

  // 计算总价格和总数量
  setCart(cart){
    let allChecked = true;
    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  }
})