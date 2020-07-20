



$(function() {
	ydl.sessionData('plat_curplace','首页');
	
	  $('#page_wrap').append('<div class="home-main-nav"><div class="kuai-left"><div class="kuai-left-con"><span class="ydico-ish ydico-ish-T01_01_xtcd"></span><p>系统菜单</p></div></div><ul></ul></div>');
	  $('#page_wrap').append('<div class="submenu-keep hidden"><div class="submenu"><div class="submenu-content"><div class="submenu-list"></div></div></div></div>');
	  //操作记录页面
	  //$('#page_wrap').append('<div class="operation-record-shadow hidden"><div class="operation-record-content"><div class="operation-record-content-head"><span class="img-clock"></span><span class="operation-record-word">操作记录</span></div><ul class="operation-record-list"><li><span class="operation-record-date bold">2019年03月09日</span><span class="operation-record-time bold">19:30</span><span class="operation-record-axis"></span><span class="operation-record-pointer">◆</span><span class="operation-record-con ">公积金贷款账户信息</span></li></ul><div class="operation-record-content-foot"><span class="glyphicon glyphicon-menu-right operation-record-content-more"></span><span class="operation-record-content-more">查看更多</span></div><div class="operation-record-content-up"><span class="glyphicon glyphicon-menu-up"></span></div></div></div>')
	  
	  
	  tpl.getMenuData(function(menuData){
		  //首页菜单
		  var menuInfo = tpl.getMenuInfo(menuData);
		  var menuObj = menuInfo.menuObj;
		  var menuOrder = menuInfo.menuOrder;
		  var menuSeq = 0;
		  $.each(menuOrder,function(k, val){
			  var v = menuObj[val];
			  //是否为一级菜单
			  var isTopMenu = v.pid == '$$$$$$$$'; 
			  if (!isTopMenu) return;
			  var $li = $('<li data-bg="'+menuSeq+'" class="icon-bg'+(menuSeq++ % 5)+'" parentId="'+v.id+'"><a data-menuid="'+v.id+'" '+(v.url ? ('href="'+ydl.contexPath+v.url+'"') : '')+'><span class="ydico-ish ydico-ish-'+(v.sign||'zcxw')+'"></span><p>'+v.name+'</p></a></li>');
			  $li.data('list',v.list || []);
			  $('.home-main-nav ul').append($li);
		  });
		  $('.home-main-nav ul').addClass('col' + Math.min($('.home-main-nav li').length, 6));
	  });
	  
	  //一级菜单点击事件
	  var subShow = true;
	  $('.home-main-nav').on('click','li',function(){
		  
		  if ($(this).children('a').attr('href')) return;
		  var menuList = $(this).data('list');
		  //一级菜单名称
		  $('.submenu-head').html('<span>'+$(this).find('p').text()+'</span>');
		  $('.submenu-list').empty();
		  //添加二级菜单
		  if (menuList.length > 0) {
			  var group2Name = pageData['group2Name'];
			  var show2MenuName = group2Name != ''; //是否显示二级菜单名称
			  $('.submenu-list').toggleClass('exist-grouptitle',show2MenuName);
			  var group2menuList = '';
			  var mlist = '';
			  var group2Index = 0;
			  $.each(menuList || [], function (index,mEle){
				  if (mEle.list) {
					  mlist += '<div><span class="menu-group-desc'+(show2MenuName ? '' : ' hide')+'">'+mEle.name+'</span><div class="menulist3">' +'<div>'+$.map(mEle.list, function(ele3, index){
						  return (index % 5 == 0 && index!= 0? '*****' :'') + '<a href = '+ydl.contexPath+ele3.url+' data-desc="'+(ele3.fdesc||'')+'" data-menuid="'+ele3.id+'">◆ '+ele3.name+'</a>';
					  }).join('').split('*****').join('</div><div>')+'</div>'+ '</div></div>';
				  }
				  else {
					  group2menuList += (group2Index % 5 == 0 && group2Index!= 0? '*****' :'') + '<a href = '+ydl.contexPath+mEle.url+' data-menuid="'+mEle.id+'" data-desc="'+(mEle.fdesc||'')+'">◆ '+mEle.name+'</a>';
					  group2Index++;
				  }
			  });
			  var group2menuHtml = group2menuList == '' ? '' :'<div><span class="menu-group-desc'+(show2MenuName ? '' : ' hide')+'">'+group2Name+'</span><div class="menulist3"><div>'+group2menuList.split('*****').join('</div><div>')+'</div></div></div>';
			  $('.submenu-list').append(mlist + group2menuHtml);
		  }
		  //$('.submenu-keep').toggleClass('hidden');
		  
		  //获取并计算页面阴影需要的高度
		  if(subShow){
			  var height = $(".container-fluid").height();
			  var sheight = height + 122;
			  $('.submenu-keep').height(sheight);
			  $('.submenu-keep').removeClass("hidden")
			  subShow = false;
			  
		  }else{
			  $('.submenu-keep').addClass("hidden")
			  subShow = true;
		  }
		  
		  
		  
		  
		  $('.submenu').css('width','auto');
		  //定位
		  if ($('.submenu-keep').is(':visible')) {
			  var menuWidth = 46;
			  $('.submenu div.menulist3').each(function(){
				  menuWidth += 6;
				  $.each($(this).children('div'), function(){
					  menuWidth += this.clientWidth;
				  });
			  });
			  if (menuWidth == 46) menuWidth += $('.submenu-head')[0].clientWidth;
			  var menuOffset = $(this).offset();
			  var menuLeft = menuOffset.left + menuWidth > document.body.clientWidth ? (menuOffset.left + $(this).width() - menuWidth) : menuOffset.left;
			  if(menuLeft <= 0) menuLeft = 0;
			  /*$('.submenu').css({left: menuOffset.left + 110, top: menuOffset.top + 90,  width: 0, height: 0});
			  $('.submenu').animate({width: menuWidth, height: 350, left: menuLeft, top: menuOffset.top -90},'300');*/
		  
			  $('.submenu').css({left: menuOffset.left + 110, bottom: 0, width: 0, height: 0});
			  $('.submenu').animate({width: menuWidth, height: 268, left: menuLeft, bottom: 70},'300');
		  }
		});
	  //悬浮二级菜单，显示菜单描述
	  $('.submenu-keep').on('mouseover','a',function (){
		  var desc = $(this).data('desc');
		  if (desc != '') {
			  $('.submenu-keep .menudesc').text(desc);
			  $('.submenu-keep .glyphicon').removeClass('glyphicon-remove');
			  $('.submenu').addClass('desc');
		  }
	  }).on('mouseout','a',function(){
		  $('.submenu-keep .menudesc').text('');
		  $('.submenu-keep .glyphicon').addClass('glyphicon-remove');
		  $('.submenu').removeClass('desc');
		});
		//点击遮罩层关闭菜单
		$('.submenu-keep').on('click', function(e){
			var $target = $(e.target);
			if($target.hasClass('submenu-keep')) {
				$('.submenu-keep').addClass("hidden")
			  subShow = true;
			}
		});
	  //点击首页菜单设置当前位置
	  $('.submenu-keep').on('click','a',function(){
		  if (this.href) {
			  var menu1 = $(this).closest('.submenu').find('.submenu-head').text();
			  var place = menu1 + ' > ' + $(this).text().replace('◆ ','');
			  ydl.sessionData('plat_curplace', place);
			  ydl.sessionData('plat_curmenuid', $(this).data('menuid')||'');
		  }
	  });
	  //点击首页一级菜单设置当前位置
	  $('.home-main-nav').on('click','li a',function(){
		  ydl.sessionData('plat_curplace', $(this).find('p').text());
	  });
	  
	  //设置当前位置
	 if (poolSelect._TYPE == 'menu') {
	 	 var plat_curplace	= ydl.sessionData('plat_curplace');
		 if (plat_curplace) $('.neck-place').text(plat_curplace);
	 }
	 else {
		 var menuDescMap = ydl.sessionData('menuDescMap') ?  JSON.parse(ydl.sessionData('menuDescMap')) : {};
		 var menuDesc = menuDescMap[ydl.attribute.get('_MENUID')] || ydpxData[0].data.page_title;
		 $('.neck-place').text(menuDesc);
	 }
	  
	  //隐藏遮罩
	  /*$('.submenu-keep').click(function () {
		  $(this).addClass('hidden');
	  });*/
	  
	  
	  
	  
	  
	  
	  //操作记录
	  /*$(".operation-record").click(function(){
		  var height = $(".container-fluid").height();
		  var sheight = height + 122;
		  $('.operation-record-shadow').height(sheight);
		  $('.operation-record-shadow').removeClass("hidden");
		  $('.operation-record-content').css({height:0});
		  $('.operation-record-content').animate({height:400},'300');
	  })
	  $(".operation-record-content-up").click(function(){
		  setTimeout(function(){
			  $('.operation-record-shadow').addClass("hidden");
		  },400)
		  $('.operation-record-content').css({height:400});
		  $('.operation-record-content').animate({height:0},'300');
	  })*/
	  
	  //var myAccount = '/flow/menu/WFWDZH01';
	  
	//我的账户信息地址
		var asideMenuUrl = '/template/ish04/grst/gg/hqycxfk';
	  
	  //设置我的账户地址
	  //$('#headerMyAccount').attr('href', ydl.contexPath + myAccount);
		ydl.ajax(ydl.contexPath + asideMenuUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
			if(data.ywsj.wdzh && data.ywsj.wdzh == '1')	{
				$('#headerMyAccount').removeClass('hide').attr('href', getUrl(data.wdzhUrl));
			}
		}, {silent : true});
	  
	  //页面信息接口地址
	  var personInfoUrl = '/template/ish04/grst/grsy/hqgrzhjbxx';	//个人账户基本信息
	  var banliMessageUrl = '/template/ish04/grst/grsy/hqnknybl'; //您可能要办理
	  var shenbaoMessageUrl = '/template/ish04/grst/grsy/hqwdsb';//我的申报
	  var yuyueMessageUrl = '/template/ish04/grst/grsy/hqwdyy';		//我的预约		//我的预约
	  var dayinMessageUrl = '/template/ish04/grst/grsy/hqpzdy';			//凭证打印
	  var gonggongMessageUrl = '/template/ish04/grst/grsy/hqggyw';			//公共业务
	  var daikuanMessageUrl = '/template/ish04/grst/grsy/hqwddk';			//我的贷款
	  var operationRecordUrl = '/template/ish04/grst/grsy/hqzjczjl';	//操作记录
		
		//personInfoUrl = '';	//个人账户基本信息
	  //banliMessageUrl = ''; //您可能要办理
	  //shenbaoMessageUrl = '';//我的申报
	  //yuyueMessageUrl = '';		//我的预约		//我的预约
	  //dayinMessageUrl = '';			//凭证打印
	  //gonggongMessageUrl = '';			//公共业务
	  //daikuanMessageUrl = '';			//我的贷款
	  //operationRecordUrl = '';	//操作记录
	  
	  /*个人账户基本信息查询模拟接口*/
	  var data1 = {
				ywsj : {
						zhye : {
							label : '账户余额',
							value : '10000',
						},
						zhzt : {
							label : '账户状态',
							value : '01',
							text : '正常',
						},
						jzny : {
							label: '缴至年月',
							value : '2019-09',
						}

					},
					menu : [
									{
											id : 'wytq',
											label : '我要提取',
											icon : 'wydk',
											url : '/xx/xxx/',
											funccode : '123213123',
											children : []
							},
									{
											id : 'zhmx',
											label : '账户明细',
											icon : 'wydk',
											url : '/xx/xxx/',
											funccode : '123213123',
											children : []
							}
					],
          aqsz : [
							{
									id : 'cxmmbg',
									label : '查询密码变更',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
					},
							{
									id : 'zfmmzh',
									label : '支付密码找回',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
					}
				]
			};
		  //个人账户基本信息
		  //personInfo(data1);
			ydl.ajax(ydl.contexPath + personInfoUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
                personInfo(data);
			}, {'ajaxContainer' : $('.huijiao-message')});
		  /*您可能要办理模拟接口*/
		  var data2 = {
				menu : [
							{
									id : 'nknybl1',
									label : '您可能要办理1',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'nknybl2',
									label : '您可能要办理2您可能要办理2',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'nknybl3',
									label : '您可能要办理3您可能要办理3您可能要办理3',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'nknybl4',
									label : '您可能要办理4',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'nknybl5',
									label : '您可能要办理5',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							}
					]
			};
			//您可能要办理
			//banliMessage(data2);
			ydl.ajax(ydl.contexPath + banliMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
				banliMessage(data);
			}, {'ajaxContainer' : $('.banli-message')});
	  
			/*我的申报模拟接口*/
			var data3 = {
				ywsj : {
								text:'您在xxxxxxx的时候干了申报这件事。<a href="XXXXX">取消申报</a>',
								sbh:'11',
				},
				menu : [
							{
								id : 'sbxq',
								label : '申报详细',
								icon : 'wydk',
								url : '/xx/xxx/',
								funccode : '123213123',
								children : []
							}
				]
			};
			//我的申报
			//shenbaoMessage(data3);
			ydl.ajax(ydl.contexPath + shenbaoMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
				shenbaoMessage(data);
			}, {'ajaxContainer' : $('.shenbao-message')});
			
			/*我的预约模拟接口*/
			var data4 = {
				ywsj : {
								text:'这是您的具体预约内容。',
				},
				menu : [
							{
								id : 'yyxq',
								label : '预约详细',
								icon : 'wydk',
								url : '/xx/xxx/',
								funccode : '123213123',
								children : []
							}
				]
			};
			//我的预约
			//yuyueMessage(data4);
			ydl.ajax(ydl.contexPath + yuyueMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
                yuyueMessage(data);
			}, {'ajaxContainer' : $('.yuyue-message')});
	  
			/*凭证打印模拟接口*/
			data5 = {
				menu : [
							{
									id : 'wycxid1',
									label : '缴存明细',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'wycxid2',
									label : '单位明细账',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							}
					]
			};
			//凭证打印
			//dayinMessage(data5);
			ydl.ajax(ydl.contexPath + dayinMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
				dayinMessage(data);
			}, {'ajaxContainer' : $('.pingzheng-message')});
	  
			
			/*公共业务模拟接口*/
			data6 = {
				menu : [
							{
									id : 'xtgg',
									label : '系统公告',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'xxck',
									label : '消息查看',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							}
					]
			};
			//公共业务
			//gonggongMessage(data6);
			ydl.ajax(ydl.contexPath + gonggongMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
				gonggongMessage(data);
			}, {'ajaxContainer' : $('.gonggong-message')});
			
			
			/*我的贷款模拟接口*/
			data7 = {
				menu : [
							{
									id : 'dkss',
									label : '贷款试算',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							},
							{
									id : 'dksq',
									label : '贷款申请',
									icon : 'wydk',
									url : '/xx/xxx/',
									funccode : '123213123',
									children : []
							}
					]
			};
			//我的贷款
			//daikuanMessage(data7);
			ydl.ajax(ydl.contexPath + daikuanMessageUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
				daikuanMessage(data);
			}, {'ajaxContainer' : $('.chaxun-message')});
			
			
			var data8 = {
					ywsj : [
						{
							date : '2019年03月09日',
							time : '19:30',
							text : '具体操作的菜单名',
								},
								{
							date : '2019年03月09日',
							time : '19:30',
							text : '具体操作的菜单名',
								}
						],
						menu : [
								{
										id : 'ckgd',
										label : '查看更多',
										url : '/xx/xxx/',
										funccode : '123213123',
										children : []
								}
						]
				};		
				//操作记录
				//operationRecord(data8);
				ydl.ajax(ydl.contexPath + operationRecordUrl, {'poolkey' : poolSelect._POOLKEY}, function(data){
					operationRecord(data);
				}, {silent : true});
			
  });


//生成个人账户基本信息
function personInfo(data){
	//显示
	$(".person-state").html(data.ywsj.zhzt.text);
	if(data.ywsj.zhzt.text == "正常"){
		
	}else{
		$(".person-state").css({"background":"#ef5467"})
	}
	var html ='<li>'+ data.ywsj.zhye.label +'</li>'
			  +'<li class="person-eye"></li>'
			  +'<li><span class="person-num">**.**</span><em>元</em></li>'
			  +'<li>'+ data.ywsj.jzny.label +'：</li>'
			  +'<li>'+ data.ywsj.jzny.value +'</li>'
	$('.huijiao-message-con #grsyInfoCon').append(html);
	
	//通过点击眼睛图标控制数字显示隐藏
	  var eyeState = true;
	  //var personNum = $(".person-num").html();
	  $(".person-eye").click(function(){
		  if(eyeState){
			  $(this).addClass("person-eye-close")
			  //var newpersonNum = personNum.replace(/[0-9]/g,'*');
			  //$(".person-num").html(newpersonNum);
			  //'+ data.ywsj.zhye.value +'
			  $(".person-num").html(data.ywsj.zhye.value)
			  eyeState = false;
		  }else{
			  $(this).removeClass("person-eye-close")
			  //$(".person-num").html(personNum);
			  $(".person-num").html("**.**");
			  eyeState = true;
		  } 
	  })
	
	//菜单
	var menuHtml = '';
	$.each(data.menu, function(k, v){
		menuHtml += '<a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '"><span class="ydico-ish ydico-ish-' + v.icon + '"></span>' + v.label + '</a>';
	});
	$('#carouselMenu').append(menuHtml);
	//点击我要提取按钮效果
	var menuShow = true;
	$("#carouselMenu a").eq(0).click(function(){
		if(menuShow){
			$(this).css({"background":"#1554d5"})
			$(".huijiao-nei").animate({top:-50},'300');
			
			menuShow = false;
		}else{
			$(this).css({"background":"#2b69e9"})
			$(".huijiao-nei").animate({top:0},'300');
			
			menuShow = true;
		}	
	})
	
	//我要提取按钮悬浮菜单
	setButtonMenu('grsyInfoFooter', data.menu[0].children);
	
	//底部菜单
	var htmlfoot = '';
	$.each(data.aqsz, function(k, v){
		htmlfoot += '<li><a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '">' + v.label + '</a></li>';
	});
	$('.huijiao-message-foot ul').append(htmlfoot);
	
	
}

//生成您可能要办理
function banliMessage(data){
	var html = '<ul>';
	$.each(data.menu.slice(0,5), function(k, v){
		var labelClass = ''; 
		if(v.label.length > 7 && v.label.length <= 14) labelClass = 'double-line';
		if(v.label.length > 14) labelClass = 'multi-line';
		html += '<li><a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '"><span class="ydico-ish ydico-ish-' + v.icon + ' color-' + (k + 1) + '"></span><p class="' + labelClass + '" title="' + v.label + '">' + v.label + '</p></a></li>';
	});
	html += '</ul>';
	$('.banli-message').append(html);
}	

//生成我的申报
function shenbaoMessage(data){
	var $shenbaoMessage = $('.shenbao-message');
	
	//根据sbh是否为空判断有无内容
	if(data.ywsj.sbh ==""){
		$(".shenbao-message").find('p').remove();
		$(".shenbao-message").append("<div class='zanwu'><div class='zanwu-img'></div><div class='zanwu-word'>暂无申报</div></div>");
	}else{
		$(".shenbao-message .zanwu").remove();
		$(".shenbao-message").append('<p></p>');
		$shenbaoMessage.find('> p').html(data.ywsj.text);
	}
	
	$shenbaoMessage.append('<a id="' + data.menu[0].id + '" href="' + getUrl(data.menu[0].url) + '" data-menuid="' + data.menu[0].funccode + '"><em>' + data.menu[0].label + '</em> <em class="glyphicon glyphicon-menu-right right-arrow"></em></a>');
	
	
}

//生成我的预约
function yuyueMessage(data){
	var $yuyueMessage = $('.yuyue-message');
	
	//根据yyh是否为空判断有无内容
	if(data.ywsj.yyh ==""){
		$(".yuyue-message").find('p').remove();
		$(".yuyue-message").append("<div class='zanwu'><div class='zanwu-img'></div><div class='zanwu-word'>暂无预约</div></div>");
	}else{
		$(".yuyue-message .zanwu").remove();
		$(".yuyue-message").append('<p></p>');
		$yuyueMessage.find('> p').text(data.ywsj.text);
	}
	
	$yuyueMessage.append('<a id="' + data.menu[0].id + '" href="' + getUrl(data.menu[0].url) + '" data-menuid="' + data.menu[0].funccode + '"><em>' + data.menu[0].label + '</em> <em class="glyphicon glyphicon-menu-right right-arrow"></em></a>');
}
  
  
//生成凭证打印
function dayinMessage(data){
	var html = '';
	$.each(data.menu, function(k, v){
		html += '<li><a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '">' + v.label + '</a></li>';
	});
	$('.pingzheng-message ul').append(html);
}

//生成公共业务
function gonggongMessage(data){
	var html = '';
	$.each(data.menu, function(k, v){
		html += '<li><a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '">' + v.label + '</a></li>';
	});
	$('.gonggong-message ul').append(html);
}

//生成我的贷款
function daikuanMessage(data){
	var html = '';
	$.each(data.menu, function(k, v){
		html += '<li><a href="' + getUrl(v.url) + '" id="' + v.id + '" data-menuid="' + v.funccode + '">' + v.label + '</a></li>';
	});
	$('.chaxun-message ul').append(html);
}
  
//生成操作记录
function operationRecord(data){
	var $pageWrap = $('#page_wrap');
	$(".operation-record").click(function(){
	  var height = $(".container-fluid").height();
	  var sheight = height + 122;
	  
	  var html = '<div class="operation-record-shadow hidden"><div class="operation-record-content"><div class="operation-record-content-head"><span class="img-clock"></span><span class="operation-record-word">操作记录</span></div><ul class="operation-record-list">';

		$.each(data.ywsj, function(k, v){
			html += '<li><span class="operation-record-date bold">' + v.date + '</span><span class="operation-record-time bold">' + v.time + '</span><span class="operation-record-axis"></span><span class="operation-record-pointer">◆</span><span class="operation-record-con ">' + v.text + '</span></li>';
		});

		html += '</ul><div class="operation-record-content-foot"><a href="' + getUrl(data.menu[0].url) + '" id="' + data.menu[0].id + '" data-menuid="' + data.menu[0].funccode + '"><span class="operation-record-content-more">' + data.menu[0].label + '<span class="glyphicon glyphicon-menu-right"></span></a></div><div class="operation-record-content-up"><span class="glyphicon glyphicon-menu-up"></span></div></div></div>';
		$pageWrap.find('.operation-record-shadow').remove();
		$pageWrap.append(html);
		
		$('.operation-record-shadow').height(sheight);
	  $('.operation-record-shadow').removeClass("hidden");
	  $('.operation-record-content').css({height:0});
	  $('.operation-record-content').animate({height:400},'300');
  });
  $pageWrap.on("click", ".operation-record-content-up", function(){
	  setTimeout(function(){
		  $('.operation-record-shadow').addClass("hidden");
	  },400)	  
	  $('.operation-record-content').css({height:400});
	  $('.operation-record-content').animate({height:0},'300');
  });
}
//页面按钮悬浮显示的标签
function setButtonMenu(id, data){
	var html = '';
	$.each(data, function(k, v){
		html += '<li><a class="drawing-out-menu" id="' + v.id + '" href="' + getUrl(v.url) + '" data-menuid="' + v.funccode + '" title="' + v.label + '"><span class="ydico-ish ydico-ish-' + v.icon + '"></span></a></li>';
	});
	$('#' + id).prepend(html);
}
  
//页面url处理
function getUrl(url){
	if(!url || url.length == 0) return 'javascript:void(0);';
		else return ydl.contexPath + url;
	}
  
	//生成首页用户信息HTML
  function userContentHtml(data) {
	  return '<div class="col col-sm-12 home-user-name">' + (data.name || '') + '</div>' +
		  $.map(data.info || [], function (d) {
			  return '<div class="col col-md-' + d.cols + '"><label>' + d.label + '：</label><span>' + d.value + '</span></div>';
		  }).join('');
  }	
	
	
  