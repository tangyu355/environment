package com.xf.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.xf.entity.Company;
import com.xf.entity.Condition;

public interface ICompanyDao {
	// 添加方法
	public void add(Company company);

	// 删除方法
	public void delete(int id);

	// 修改
	public void update(Company company);

	// 根据id来查询全部
	public Company getById(int id);
	
	public Company getByName(String name);
	
	public Company getCode(String code);
	// 查询所有
	public List<Company> getAll(int city);
	public List<Company> getCityTown(Condition condition);
	
	public List<Company> getGov();
	
	public Company CName(int typeid);
	
	public void getGroupname(Company company);
	
	public Company getByContact(String contact);
	public List<Company> findCompany(int tradeid);
	public List<Company> getCompany(@Param("tradeid") int tradeid);
	
	public List<Company> getByCity(int cityid);
	public List<Company> getCompanyCount(int id);
	public List<Company> getByantistop(String antistop);
	public List<Company> getGovby(String name);
	public void updateRemark(int id);
	public List<Company> getProvince(int typeid);
}
