import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品对象
    goodsObj: {},
    // 商品是否被收藏
    isCollect:false
  },

  // 全局商品信息
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options; 
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some((v) => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        // /\.webp/g 的 g 代表全部替换
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: goodsObj.pics,
      },
      isCollect,
    });
  },

  // 轮播图放大预览
  handlePreviewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },

  //点击 加入购物车
  handleCartAdd(e) {
    // 1 获取缓存中的购物车数据 数组格式 如果没有赋予空数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断 商品对象是否存在于购物车中
    // findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    console.log(index);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      // 4 填充回缓存中
      cart.push(this.GoodsInfo);
    } else {
      // 4 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: "加入成功",
      icon: "success",
      // true 防止用户 手抖 疯狂点击按钮
      mask: true,
    });
  },
   // 点击 商品收藏图标
   handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(
      (v) => v.goods_id === this.GoodsInfo.goods_id
    );
    // 3 当index！=-1表示 已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        mask: true,
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect,
    });
  },
});
