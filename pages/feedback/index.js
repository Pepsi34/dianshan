Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
  // 文本域的内容
    textVal:""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击 “+” 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接 
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  // 根据索引删除上传的图片
  handleRemoveImg(e){
    // 1 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // 2 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 3 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入的事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  //提交按钮的点击
  handleFormSubmit(){
    // 1 获取文本域的内容 图片数组
    const {textVal, chooseImgs}=this.data;
    // 2 合法性的验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title:'输入不合法',
        icon:'none',
        // 防止反复点击
        mask: true
      });
      return;
    }

    // 3 准备上传图片到专门的图片服务器
    // 上传文件的api不支持多个文件同时上传 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title:"正在上传中...",
      mask: true
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          // 图片要上传到哪里(使用图床)
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称后台来获取文件file
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) =>{
            console.log(result);
            let url=JSON.parse (result.data);
            this.UpLoadImgs.push(url);
            // 所有的图片都上传完毕了才触发
            if(i===chooseImgs.length-1){

              // 关闭正在等待的图片
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组提交到后台中");
              // 提交都成功了
              // 重置页面
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
            console.log(this.UpLoadImgs);
          },
        })

      })

    }else{
      // 关闭弹窗
      wx.hideLoading();
      console.log("只是提交了文");
      // 返回上个页面
      wx.navigateBack({
        delta:1
      });
    }
  }
})
