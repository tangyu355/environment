package com.xf.controller.gov;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xf.controller.ResultObj;
import com.xf.controller.WorkFlowController;
import com.xf.entity.Company;
import com.xf.entity.gov.CanyinNocert;
import com.xf.security.LoginManage;
import com.xf.security.Tools;
import com.xf.service.gov.CanyinNocertService;

@Scope("prototype")
@Controller
@RequestMapping(value = "/canyin/nocert")
public class CanyinNocertController {

	@Autowired
	private CanyinNocertService theService;
	@Autowired
	private LoginManage loginManage;
	@Autowired
	private ResultObj result;

	private CanyinNocert check_input(HttpServletRequest request) {
		CanyinNocert ret = new CanyinNocert();

		String s = new String();
		s = request.getParameter("id");
		if (s != null && Tools.isInteger(s)) ret.setId(Integer.parseInt(s));
		s = request.getParameter("accountid");
		if (s != null && Tools.isInteger(s)) ret.setAccountid(Integer.parseInt(s));
		ret.setFillTime(request.getParameter("fillTime"));
		s = request.getParameter("fillyear");
		if (s != null && Tools.isInteger(s)) ret.setFillyear(Integer.parseInt(s));
		s = request.getParameter("province");
		if (s != null && Tools.isInteger(s)) ret.setProvince(Integer.parseInt(s));
		s = request.getParameter("city");
		if (s != null && Tools.isInteger(s)) ret.setCity(Integer.parseInt(s));
		s = request.getParameter("town");
		if (s != null && Tools.isInteger(s)) ret.setTown(Integer.parseInt(s));
		s = request.getParameter("country");
		if (s != null && Tools.isInteger(s)) ret.setCountry(Integer.parseInt(s));
		s = request.getParameter("street");
		if (s != null && Tools.isInteger(s)) ret.setStreet(Integer.parseInt(s));
		ret.setShoptype(request.getParameter("shoptype"));
		ret.setShopaddr(request.getParameter("shopaddr"));
		ret.setName(request.getParameter("name"));
		ret.setIdnum(request.getParameter("idnum"));
		ret.setHomeaddr(request.getParameter("homeaddr"));
		ret.setTelephone(request.getParameter("telephone"));
		s = request.getParameter("incoming");
		if (s != null && Tools.isNumeric(s)) ret.setIncoming(Double.parseDouble(s));
		ret.setProductType(request.getParameter("productType"));
		ret.setDistrictId(request.getParameter("districtId"));
		ret.setRemark(request.getParameter("remark"));

		return ret;
	}

	// ==============================================================================

	int companyid;

	private HashMap<String, Object> check_account(HttpServletRequest request) {

		if (loginManage.isCompanyLogin(request)) {
			Company c = loginManage.getLoginCompany(request);
			companyid = c.getId();
		} else if (loginManage.isUserLogin(request)) {
			String s = new String();
			s = request.getParameter("accountid");
			if (s != null && Tools.isInteger(s)) companyid = Integer.parseInt(s);
			if (companyid <= 0)
				return result.setStatus(-2, "no company id.");
		} else {
			return result.setStatus(-1, "No login.");
		}

		return null;
	}

	// ==============================================================================

	@RequestMapping(value = "/years", method = RequestMethod.GET)
	@ResponseBody
	public Object getYears(HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			List<Integer> fillyear = theService.getYears(companyid);
			if (fillyear.isEmpty()) {
//				int curyear = configService.getLastYear();
//				fillyear.add(curyear);
			}
			result.put("data", fillyear);

		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "");
	}

	@RequestMapping(value = "/check", method = RequestMethod.POST)
	@ResponseBody
	public Object getCheck(HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			CanyinNocert input = check_input(request);
			if (input.getIdnum() == null)
				return result.setStatus(-3, "no data.");

			input.setAccountid(companyid);
			CanyinNocert search = theService.getByField(input);
			if (search != null && search.getId() > 0)
				result.put("id", search.getId());

		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "");
	}

	@RequestMapping(value = "/addup", method = RequestMethod.POST)
	@ResponseBody
	public Object addup(HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			CanyinNocert input = check_input(request);
			
			input.setAccountid(companyid);

			CanyinNocert search = null;
			if (input.getId() > 0) {
				search = theService.getById(input.getId());
			}

			Calendar cal = Calendar.getInstance();
			input.setFillTime(Tools.ToDateStr(cal));
			if (input.getStatus() < 1)
				input.setStatus(WorkFlowController.STATUS_FILL);
			if (search != null && search.getId() > 0) {
				theService.update(input);
			} else {				
				theService.add(input);
			}

			result.put("id", input.getId());

		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "ok");
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public Object getById(@PathVariable int id, HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			CanyinNocert search = theService.getById(id);
			if (null == search)
				return result.setStatus(-3, "No data.");

			result.put("data", search);

		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "");
	}

	@RequestMapping(value = "/get/{year}", method = RequestMethod.GET)
	@ResponseBody
	public Object getByYear(@PathVariable int year, HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			CanyinNocert input = new CanyinNocert();
			input.setFillyear(year);
			input.setAccountid(companyid);
			List<CanyinNocert> list = theService.getByYear(input);
			if (list != null)
				result.put("data", list);

		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "");
	}
	
	@RequestMapping(value = "/clear/{year}", method = RequestMethod.GET)
	@ResponseBody
	public Object clearData(@PathVariable int year, HttpServletRequest request) {
		try {
			HashMap<String, Object> ret = check_account(request);
			if (ret != null)
				return ret;

			CanyinNocert input = new CanyinNocert();
			input.setFillyear(year);
			input.setAccountid(companyid);
			theService.clearData(input);
		} catch (Exception e) {
			e.printStackTrace();
			return result.setStatus(-2, "exception");
		}

		return result.setStatus(0, "");
	}
}
