$(function() {

  var currentPage = 1;  // 当前页
  var pageSize = 2;    // 每页多少条

  function render( callback ) {
    //显示加载框，通过mui框架的加载提示，这儿就不需要显示了
    //$('.lt_product').html('<div class="loading"></div>');

    //请求参数
    // 1. 必传的 3 个参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;

    // 2. 两个可传可不传的参数
    var $current = $('.lt_sort a.current');
    if ( $current.length > 0 ) {
      // 有高亮的, 需要进行排序
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      params[ sortName ] = sortValue;
    }

    //模拟请求接口时间，添加延时
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          // 真正拿到数据后执行的操作, 通过callback函数传递进来了
          callback && callback( info );
        }
      })
    }, 500 );
  }

  // 功能1: 获取地址栏参数赋值给 input
  var key = getSearch("key");
  $('.search_input').val( key );
  // render();//通过配置mui的下拉刷新来首次调用render()

  // 配置 下拉刷新、上拉加载 注意点:
  // 下拉刷新是对原有数据的覆盖, 执行的是 html 方法
  // 上拉加载是在原有结构的基础上进行追加, 执行的是 append 方法
  mui.init({
    // 配置pullRefresh
    pullRefresh : {
      //下拉刷新容器标识，querySelector能定位的css选择器均可
      container:".mui-scroll-wrapper",
      // 配置下拉刷新
      down : {
        // 配置一进入页面, 就自动下拉刷新一次
        auto: true,
        callback : function(){
          // 加载第一页的数据
          currentPage = 1;
          // 拿到数据后的回调
          render(function( info ) {
            //重新渲染页面
            var htmlStr = template("productTpl", info );
            $('.lt_product').html( htmlStr );
            // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            // 第一页数据被重新加载之后, 如果上拉加载已经被禁用了, 需要重新启用上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
          });
        }
      },
      // 配置上拉加载
      up : {
        callback: function() {
          // 需要加载下一页的数据, 更新当前页
          currentPage++;
          render(function( info ) {
            var htmlStr = template("productTpl", info );
            $('.lt_product').append( htmlStr );

            // 当数据回来之后, 需要结束上拉加载
            // 1. 如果传 true, 会显示没有更多数据的提示语, 会自动禁用上拉加载更多, 防止发送无效的ajax
            // 2. 如果传 false, 还有更多数据
            if ( info.data.length === 0 ) {
              // 没有更多数据了, 显示提示语句
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( true );
            } else {
              // 还有数据, 正常结束上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( false );
            }
          });
        }
      }
    }
  });

  // 功能2: 点击搜索按钮, 实现搜索功能
  $('.search_btn').click(function() {
    var key = $('.search_input').val(); // 获取搜索关键字
    if ( key.trim() === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }

    // 执行一次下拉刷新即可, 调用 pulldownLoading
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()

    // 有搜索内容, 需要添加到本地存储中
    var arr = JSON.parse( localStorage.getItem("search_list") || '[]' );
    // 1. 不能重复
    var index = arr.indexOf( key );
    if ( index != -1 ) {
      arr.splice( index, 1 );// 删除对应重复项
    }
    // 2. 不能超过 10
    if ( arr.length >= 10 ) {
      arr.pop();// 删除最后一项
    }
    // 3. 往数组最前面追加
    arr.unshift( key );
    // 转成 json, 存到本地
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  })

  // 功能3: 添加排序功能(点击切换类即可)
  // (1) 自己有current, 切换箭头方向
  // (2) 自己没有current, 给自己加上, 让其他的移除

  // mui 认为在下拉刷新和上拉加载容器中, 使用 click 会有 300ms延迟, 性能方面不足
  // 禁用了默认的 a 标签的 click 事件, 需要绑定 tap 事件
  // http://ask.dcloud.net.cn/question/8646 文档说明地址

  $('.lt_sort a[data-type]').on("tap", function() {
    if ( $(this).hasClass("current") ) {
      // 切换箭头方向
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      // 没有 current, 给自己加上, 并排他
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 执行一次下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });

  // 功能4: 点击每个商品实现页面跳转, 注册点击事件, 通过事件委托注册, 注册 tap 事件
  $('.lt_product').on("tap", "a", function() {
    var id = $(this).data("id");
    location.href = "product.html?productId=" + id;
  });

});