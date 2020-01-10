
$(function() {

  // 功能1: 获取地址栏传递过来的搜索关键字, 设置给 input
  var key = getSearch("key");
  $('.search_input').val( key );

  // 一进入页面, 渲染一次
  render();

  // 根据搜索关键字, 发送请求, 进行页面渲染
  function render() {
    // 准备请求数据, 显示加载中的效果
    $('.lt_product').html('<div class="loading"></div>');

    // 三个必传的参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = 1;
    params.pageSize = 100;

    // 两个可传可不传的参数
    // 价格: price    1升序，2降序
    // 库存: num      1升序，2降序
    // (1) 需要根据高亮的 a 来判断传哪个参数,
    // (2) 通过箭头判断, 升序还是降序

    // 对高亮的a(有current类)进行排序，四种排序(上架时间、价格、库存、折扣)同一时间只有一个会有current类
    var $current = $('.lt_sort a.current');
    if ( $current.length > 0 ) {
      // 获取传给后台的键
      var sortName = $current.data("type");
      // 获取传给后台的值, 通过箭头方向判断
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      // 添加到 params 中
      params[ sortName ] = sortValue;
    }

    //模拟请求接口的时间，加个延时
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          var htmlStr = template("productTpl", info);
          //显示商品内容，同时覆盖掉了加载框
          $('.lt_product').html( htmlStr );
        }
      });
    }, 500);
  }

  // 功能2: 点击搜索按钮, 实现搜索功能
  $('.search_btn').click(function() {

    // 需要将搜索关键字, 追加存储到本地存储中
    var key = $('.search_input').val();
    if ( key.trim() === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }

    //重新渲染页面
    render();

    // 1. 获取数组, 需要将 jsonStr => arr
    var arr = JSON.parse( localStorage.getItem("search_list") || '[]' );
    // 2. 删除重复的项
    var index = arr.indexOf( key );
    if ( index != -1 ) {
      arr.splice(index, 1);
    }
    // 3. 长度限制在 10
    if ( arr.length >= 10 ) {
      arr.pop();// 删除最后一项
    }
    // 4. 将关键字追加到 arr 最前面
    arr.unshift( key );
    // 5. 转成 json, 存到本地存储中
    localStorage.setItem("search_list", JSON.stringify( arr ) );

  });

  // 功能3: 排序功能
  // 通过属性选择器给价格和库存添加点击事件
  // (1) 如果自己有 current 类, 切换箭头的方向即可
  // (2) 如果自己没有 current 类, 给自己加上 current 类, 并且移除兄弟元素的 current
  $('.lt_sort a[data-type]').click(function() {

    if ( $(this).hasClass("current") ){
      // 有 current 类, 切换箭头即可
      // toggleClass()，有这个类就删除，没有就添加，一个类的切换调一次就行，两个类的切换需要调两次
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    } else {
      // 没有 current 类, 自己加上 current 类, 移除兄弟元素的 current
      $(this).addClass( "current" ).siblings().removeClass("current");
    }

    //重新渲染页面
    render();

  });

});