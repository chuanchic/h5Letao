
$(function() {

  // 功能1: 获取地址栏的productId, 发送ajax请求, 进行商品渲染
  var productId = getSearch("productId");

  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function( info ) {
      var htmlStr = template("productTpl", info);
      $('.lt_main .mui-scroll').html( htmlStr );

      // mui框架默认会初始化轮播组件，但是动态获取的数据有延迟，所以就无法进行初始化
      // 需要在获取到数据之后，手动进行轮播初始化
      // 获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 同轮播图一样，也需要手动初始化 数字框
      mui(".mui-numbox").numbox()
    }
  });

  // 功能2: 让尺码可以选中 (通过事件委托注册)
  $('.lt_main').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });

  // 功能3: 加入购物车功能
  $('#addCart').click(function() {
    // 获取尺码
    var size = $('.lt_size span.current').text();
    if ( !size ) {
      mui.toast("请选择尺码");
      return;
    }
    // 获取数量
    var num = $('.mui-numbox-input').val();

    // 发送ajax
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      dataType: "json",
      success: function( info ) {
        // 加入购物车操作需要登陆
        if ( info.error === 400 ) {// 未登录
          // 跳转到登陆页, 将来登录完成还要跳回来, 可以将当前页的地址传过去即可
          location.href = "login.html?retUrl=" + location.href;
        }else if ( info.success ) {// 已登陆, 加入成功, 提示用户
          mui.confirm( "添加成功", "温馨提示", ["去购物车", "继续浏览" ], function( e ) {
            if ( e.index === 0 ) {// 去购物车
              location.href = "cart.html";
            }
          })
        }
      }
    })
  })

  // 清空浏览器退出登录状态: 清空了cookie中的数据, 就相当于清空了浏览器端的 sessionId

});