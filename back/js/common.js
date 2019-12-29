
//整个页面里第一个ajax请求开始时的事件
$(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
});

//整个页面里所有的ajax请求完成时的事件
$(document).ajaxStop(function () {
    //结束进度条
    NProgress.done();
});

// 登录拦截功能, 登录页面不需要校验, 不用登录就能访问
// 前后分离, 前端是不知道该用户是否登录, 后台知道，发送ajax请求, 查询用户状态
// (1) 用户已登录, 啥都不用做, 让用户继续访问
// (2) 用户未登录, 拦截到登录页
// 地址栏中没有 login.html, 说明不是登录页, 需要进行登录拦截
// if ( location.href.indexOf("login.html") === -1 ) {
//     $.ajax({
//         type: "get",
//         url: "/employee/checkRootLogin",
//         dataType: "json",
//         success: function( info ) {
//             if ( info.success ) {
//                 // 已登录, 让用户继续访问
//             }else if ( info.error === 400 ) {
//                 // 未登录, 拦截到登录页
//                 location.href = "login.html";
//             }
//         }
//     })
// }

$(function () {

    //分类管理的切换
    $('.nav .category').click(function () {
        //切换child的显示和隐藏
        $('.nav .child').stop().slideToggle();
    });

    //左侧侧边栏的切换
    // 1.通过加类来修改侧边栏的left值来实现，加过渡动画
    // 2.通过加类来修改右边主体部分的padding-left，加过渡动画
    $('.icon_menu').click(function () {
        //切换侧边栏的显示和隐藏
        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main .lt_topbar').toggleClass("hidemenu");
        $('.lt_main').toggleClass("hidemenu");
    });

    //点击topbar退出按钮, 弹出模态框
    $('.icon_logout').click(function() {
        // 显示模态框
        $('#logoutModal').modal("show");
    })

    //点击模态框的退出按钮, 实现退出功能
    $('#logoutBtn').click(function() {
        // 发送 ajax 请求, 进行退出
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function( info ) {
                if ( info.success ) {
                    // 退出成功, 跳转到登录页
                    location.href = "login.html";
                }
            }
        })
    })

});