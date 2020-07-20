package com.yd.ish.biz.comp.dp;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.yd.biz.comp.BaseComp;
import com.yd.biz.exception.BatchExceptionBean;
import com.yd.biz.exception.TransBatchException;
import com.yd.ish.model.mybatis.DP077;
import com.yd.ish.service.mybatis.DP077Service;
import com.yd.ish.util.IshCheckUtil;
import com.yd.svrplatform.comm_mdl.param_config.ParamConfigImp;

/**
 * 名称：CompGRKH03
 * <p>
 * 功能：校验个人开户信息<br>
 * 
 * @brief 校验个人开户批量信息准确性
 * @author 柏慧敏
 * @version 0.1 2018年6月13日 柏慧敏创建
 * @note
 */
@Component("CompGRKH03")
public class CompGRKH03 extends BaseComp {

	private static final Logger logger = LoggerFactory.getLogger(CompGRKH03.class);
	@Autowired
	DP077Service dp077service;
	@Autowired
	ParamConfigImp paramconfigImp;

	@Override
	public int execute() {

		/* 入口参数赋值开始 */
		int instance = getInt("_IS");
		/* 入口参数赋值结束 */

		// 根据实例号查临时表，获取重复的人员信息列表
		List<BatchExceptionBean> errlist = new ArrayList<BatchExceptionBean>();
		BatchExceptionBean bean;
		DP077 dp077=new DP077();
		dp077.setInstance(instance);
		// 58-个人开户
		dp077.setDpbusitype("58");
		List<DP077> ryxxlist = dp077service.selectRepeatRyxx(dp077);

		// 重复的人员信息查询结果长度定义
		int ryxxlength = 0;
		if (ryxxlist != null) {
			ryxxlength = ryxxlist.size();
		}

		// 根据实例号查临时表，获取个人开户信息列表
		List<DP077> grkhlist = dp077service.selectByCause(dp077);
		// 个人开户信息查询结果长度定义
		int grkhlength = 0;
		if (grkhlist != null) {
			grkhlength = grkhlist.size();
		}

		// 定义数组记录有误的证件号码序号
		int[] zjhmjy = new int[grkhlength];
		// 证件号码错误信息
		String zjhmcwxx = "";
		String zjlx;
		String zjhm;
		int seqno;
		//循环人员信息列表，记录重复人员信息批量错误
		for (int i = 0; i < ryxxlength; i++) {
			// 证件类型
			zjlx = ryxxlist.get(i).getCertitype().toString();
			// 证件号码
			zjhm = ryxxlist.get(i).getCertinum().toString();
			// 序号
			seqno = ryxxlist.get(i).getSeqno();
			//若证件类型为身份证，校验身份证号是否正确
			if (paramconfigImp.getValByMask("bsp.pb.certitype", "01").equals(zjlx)) {
				//在zjhmjy数组中增加信息，记录当前已校验身份证号的序号
				zjhmjy[seqno - 1] = seqno;
				//调用方法校验身份证号码
				zjhmcwxx = IshCheckUtil.checkIdCard(zjhm);
				//返回证件号码错误信息不为空，记录批量错误信息：人员信息重复且证件号码有误
				if (!"".equals(zjhmcwxx)) {
					logger.info("证件号码为" + zjhm + "的人员信息重复且" + zjhmcwxx);
					// 若人员信息中已记录此序号的人员错误信息
					bean = new BatchExceptionBean(seqno, "zjhm", "", "人员信息重复," + zjhmcwxx, "0", "seqno", "grkhlist",
							seqno + "", "", "", "", "");
					errlist.add(bean);
				} else {
					//返回证件号码错误信息为空，记录批量错误信息：人员信息重复
					bean = new BatchExceptionBean(seqno, "zjhm", "", "人员信息重复", "0", "seqno", "grkhlist", seqno + "", "",
							"", "", "");
					errlist.add(bean);
					
				}
			} else {
				//若证件类型不为身份证，记录批量错误信息：人员信息重复
				logger.info("证件号码为" + zjhm + "的人员信息重复");
				bean = new BatchExceptionBean(seqno, "zjhm", "", "人员信息重复", "0", "seqno", "grkhlist", seqno + "", "", "",
						"", "");
				errlist.add(bean);
			}

		}
		//循环个人开户信息列表，校验证件号码正确性
		for (int i = 0; i < grkhlength; i++) {
			// 证件类型
			zjlx = grkhlist.get(i).getCertitype().toString();
			// 证件号码
			zjhm = grkhlist.get(i).getCertinum().toString();
			// 序号
			seqno = grkhlist.get(i).getSeqno();
			// 判断证件类型为身份证时， 证件号码是否符合规则
			if (paramconfigImp.getValByMask("bsp.pb.certitype", "01").equals(zjlx) && zjhmjy[i] != seqno) {
				//调用方法校验身份证号，返回身份证号错误信息
				zjhmcwxx = IshCheckUtil.checkIdCard(zjhm);
				//返回证件号码错误信息不为空，记录批量错误信息：证件号码有误
				if (!"".equals(zjhmcwxx)) {
					bean = new BatchExceptionBean(seqno, "zjhm", "", zjhmcwxx, "0", "seqno", "grkhlist", seqno + "", "",
							"", "", "");
					errlist.add(bean);
				}
			}
		}
		logger.info("[+]个人开户批量信息校验结束");
		// 抛出批量错误信息
		if (errlist != null && errlist.size() > 0) {
			TransBatchException e = new TransBatchException(errlist, "0");
			e.commit();
			throw e;
		}

		/* 出口参数赋值开始 */

		/* 出口参数赋值结束 */

		return 0;
	}

}