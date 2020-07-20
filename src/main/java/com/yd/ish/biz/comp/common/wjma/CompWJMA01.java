package com.yd.ish.biz.comp.common.wjma;

import java.util.Map;

import com.yd.svrplatform.comm_mdl.context.MainContext;
import com.yd.svrplatform.util.DataPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.yd.biz.comp.BaseComp;
import com.yd.biz.exception.TransSingleException;
import com.yd.svrplatform.comm_mdl.external.parse.XmlResHead;
import com.yd.svrplatform.comm_mdl.external.parse.XmlResObj;

/**
 * 名称：CompWJMA01.java
 * <p>功能：个人忘记密码用户信息验证 <br> 
 * @author 张洪超
 * @version 0.1	2018年04月20日      张洪超创建
 */
@Component("CompWJMA01")
public class CompWJMA01 extends BaseComp{

	private static final Logger logger = LoggerFactory.getLogger(CompWJMA01.class);
	private static final String REG_INTERFACE = "getGRZC";
	@Override
	public int execute() {

		/*入口参数赋值开始*/
//		String xingming=getString("xingming");//姓名
//		String zjlx=getString("zjlx");//证件类型
//		String zjhm=getString("zjhm");//证件号码
		/*入口参数赋值结束*/
		logger.info("[+]调用个人用户验证接口BSP-OAPI-500开始");
		//调用个人用户验证接口同时查询是否初始密码
		XmlResObj data =  super.sendExternal("BSP-OAPI-500");
		XmlResHead head = data.getHead();
	    //是否初始查询密码 0否1是
	    String isCscxmm="";
	    //是否初始交易密码
	    String isCsjymm="";
	    if (XmlResHead.TR_SUCCESS.equals(head.getParticular_code())){
	    	Map<String,Object> map = data.getBody();
	    	isCscxmm = map.get("isCscxmm").toString();
	    	isCsjymm = map.get("isCsjymm").toString();
	    	logger.info("[-]调用调用个人用户验证接口成功");
	    }else{
	    	logger.info("[-]调用调用个人用户验证接口失败");
	        throw new TransSingleException(head.getParticular_code(),head.getParticular_info());
	    }
    	/*出口参数赋值开始*/
		setOutParam("isCscxmm",isCscxmm);//是否初始查询密码
		setOutParam("isCsjymm",isCsjymm);//是否初始交易密码
    	/*出口参数赋值结束*/

    	return 0;
   }

}
