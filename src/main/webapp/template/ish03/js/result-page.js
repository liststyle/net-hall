function initPage(){var t=poolSelect._RESULT_PAGE_TYPE||"0";$("#resultInfo").find(".result-type").addClass("type_"+t);var n=poolSelect._RESULT_PAGE_TITLE||("0"===t?"业务办理完成！":"哎呀...出错了！");$("#resultInfo").find(".result-title").text(n),$("#resultInfo").find(".result-content").html(poolSelect._RESULT_PAGE_CONTENT||"");var e=$("#resultInfo").find(".result-buttons");e.append($("#pageFlowButtons").children()),/错误代码：TIMEOUT/.test(poolSelect._RESULT_PAGE_CONTENT)?e.html('<button type="button" id="b_flow_n" class="btn btn-success btn-sm end-button">重新登录</button>'):(0==e.children().length&&(""!=poolSelect._OPERID?$('<button type="button" id="b_flow_o" class="btn btn-success btn-sm end-button">返回首页</button>').appendTo(e):$('<button type="button" id="b_flow_n" class="btn btn-success btn-sm end-button">重新登录</button>').appendTo(e)),"0"!=t&&0==$("#b_flow_p").length&&$('<button type="button" id="b_flow_p" class="btn btn-default result-copy btn-sm end-button">复制到剪贴板</button>').appendTo(e)),e.find("button").addClass("btn-sm"),e.find("button.btn-primary").removeClass("btn-primary").addClass("btn-info"),$("body").on("click","#b_flow_n",function(){ydl.sessionData("pdPreTime",null),ydl.sessionData("plat_curplace",null),ydl.sessionData("plat_curmenuid",null),ydl.sessionData("msgDic",null),ydl.sessionData("pdPreCounts",null),ydl.sessionData("percnt",null),ydl.sessionData("plat_userdata",null),ydl.sessionData("syscnt",null),ydl.sessionData("menuDescMap",null),ydl.sessionData("sys_menu_"+poolSelect._OPERID,null),""!=poolSelect._OPERID&&void 0!=poolSelect._OPERID?top.location.href=ydl.contexPath+"/logout/"+poolSelect._OPERID:top.location.href=ydl.contexPath}),$("body").on("click","#b_flow_o",function(){location.href=ydl.contexPath+"/home"}),$("#b_flow_p").attr("data-clipboard-text",poolSelect._RESULT_PAGE_COPYINFO||$("#resultInfo").find(".result-title").text()+"\n"+$("#resultInfo").find(".result-content").text()),/MSIE 8/.test(navigator.userAgent)?$(".result-copy").click(function(){alert($(this).data("clipboard-text")+"\n\n请按Ctrl+C复制")}):$.getScript(ydl.contexPath+"/common/lib/js/clipboard.min.js",function(){new Clipboard(".result-copy").on("success",function(t){$(t.trigger).text("已复制到剪贴板")})});var l=5,o='<div class="link-empty">（无）</div>',s=$("#resultInfo").find(".result-links"),a=poolSelect._RESULT_PAGE_LINKS?$.isPlainObject(poolSelect._RESULT_PAGE_LINKS)?poolSelect._RESULT_PAGE_LINKS:JSON.parse(poolSelect._RESULT_PAGE_LINKS):{};if(a.recent&&a.recent.length||a.prev&&a.prev.length||a.next&&a.next.length){var u=function(t){var n=$.map(a[t]||[],function(t,n){return n<l?'<a class ="func-menu" data-funcid="'+t.funcid+'" href="'+ydl.contexPath+t.url+'">'+t.name+"</a>":null}),e=s.data("count")?s.data("count")+1:1;n.length||n.push(o),s.data("count",e).find(".result-"+t).removeClass("hidden").append(n.join(""))};for(var t in a)u(t);s.find(".result-link").removeClass("col-md-4").addClass("col-md-"+12/s.data("count")),s.find(".hidden").remove()}else s.hide()}