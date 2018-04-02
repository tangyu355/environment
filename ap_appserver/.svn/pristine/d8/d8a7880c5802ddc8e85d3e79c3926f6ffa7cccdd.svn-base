package com.xf.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xf.dao.ICompanyDao;
import com.xf.entity.Company;
import com.xf.entity.Condition;

@Service
public class CompanyService implements ICompanyDao {
	// 此类中调用IUserDao中所有方法
	@Autowired
	private ICompanyDao companyDao;

	public void add(Company company) {
		companyDao.add(company);
	}

	public void delete(int id) {
		companyDao.delete(id);
	}

	public void update(Company company) {
		companyDao.update(company);
	}

	public Company getById(int id) {
		return companyDao.getById(id);
	}

	public Company getByName(String name) {
		try {
			return companyDao.getByName(name);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	
	public List<Company> getAll(int city) {
		return companyDao.getAll(city);
	}

	public Company CName(int typeid) {
		// TODO Auto-generated method stub
		return companyDao.CName(typeid);
	}

	public void getGroupname(Company company) {
		// TODO Auto-generated method stub
		
	}

	public Company getCode(String code) {
		// TODO Auto-generated method stub
		return companyDao.getCode(code);
		
	}

	public List<Company> getGov() {
		return companyDao.getGov();
	}

	public Company getByContact(String contact) {
		try {
			Company com=companyDao.getByContact(contact);
			return com;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}

	public List<Company> findCompany(int tradeid) {
		return companyDao.findCompany(tradeid);
	}

	public List<Company> getByCity(int cityid) {

		try {
			return companyDao.getByCity(cityid);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public List<Company> getCityTown(Condition condition) {
		return companyDao.getCityTown(condition);
	}

	public List<Company> getCompany(int tradeid) {
		return companyDao.getCompany(tradeid);
	}

	public List<Company> getCompanyCount(int id) {
		return companyDao.getCompanyCount(id);
	}

	public List<Company> getByantistop(String antistop) {
		return companyDao.getByantistop(antistop);
	}

	public List<Company> getGovby(String name) {
		return companyDao.getGovby(name);
	}

	public void updateRemark(int id) {
		companyDao.updateRemark(id);
	}

	public List<Company> getProvince(int typeid) {
		return companyDao.getProvince(typeid);
	}
}
