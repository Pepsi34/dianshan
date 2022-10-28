// export代表导出promise对象(这里指request变量名)
// 同时发布异步请求的次数
let ajaxTimes = 0;
export const request=(params)=>{
  ajaxTimes++;
  // 显示加载中的图标
  // 注意:无论你发送多少次请求, 虽然多次调用wx.showLoading, 但都只显示一个图标
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  // 创建一个Promise对象
  // resolve,reject 是 Promise 内置方法
  return new Promise((resolve,reject)=>{
    // 发起异步请求
    wx.request({
      // 解构params
      // 即...params = url: 'https://api-hmugo-web.省略'
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        // 返回一个以给定值解析后的 Promise 对象
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          wx.hideLoading();
          wx.startCompass({
            complete: (res) => {},
          })
        }
      }
    });
  })
}