let app = getApp();

Page({
  data: {
    scheduleDetailId: '',
    imgPaths: [],
    host: '',
    longitude: '',
    latitude: '',
    location: '',
    area: null,
    remark: '',
    growerName: ''
  },
  onLoad(query) {
    this.setData({ scheduleDetailId: query.id, growerName: query.name, host: app.globalData.host });
  },
  bindTextAreaBlur: function(e) {
    //console.log('描述是：',e.detail.value)
    this.setData({ area: e.detail.value });
  },
  bindTextRemarkBlur: function() {
    this.setData({ remark: e.detail.value });
  },
  getImgPaths(imgs, type){
    if(type == 1) {
      let imgstrs = '';
      for(var i in imgs){
        imgstrs += imgs[i];
        if(i != imgs.length - 1){
          imgstrs += ',';
        }
      }
      return imgstrs;
    } else {
      let imgarr = [];
      for(var i in imgs){
        imgarr.push(app.globalData.host + imgs[i]);
      }
      return imgarr;
    }
  },
  chooseImage() {
    var that = this;
    const imgpaths = that.data.imgPaths;
    if (imgpaths.length >= 3) {
      dd.alert({ title: `亲`, content: `采集照片已经超过3张`, buttonText: '确定' });
      return;
    }
    dd.showLoading();
    dd.chooseImage({
      sourceType: ['camera'],
      count: 1,
      success: res => {
        const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
        dd.uploadFile({
          url: that.data.host + 'GYISMSFile/FilesPostsAsync',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          success: (res) => {
            dd.hideLoading();
            const data = JSON.parse(res.data);
            const imgpaths = that.data.imgPaths;
            imgpaths.push(data.result);
            that.setData({
              imgPaths: imgpaths
            });
          },
          fail: function(res) {
            dd.hideLoading();
            dd.alert({ title: `上传失败：${JSON.stringify(res)}`, buttonText: '确定' });
          },
        });
      },
      fail: () => {
        dd.hideLoading();
        dd.showToast({
          content: '调用拍照异常', // 文字内容
        });
      }
    })
  },
  previewImage() {
    var that = this;
    const imgurls = that.getImgPaths(that.data.imgPaths, 2)
    dd.previewImage({
      current: 0,
      urls: imgurls,
    });
  },
  getLocation() {
    var that = this;
    dd.getLocation({
      type: 1,
      success(res) {
        dd.hideLoading();
        that.setData({
          location: res.address,
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败', buttonText: '确定' });
      },
    })
  },
  onShow() {

  },
  saveArea() {

  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '面积落实',
      desc: '面积落实列表',
      path: 'pages/task/area/area',
    };
  }
});