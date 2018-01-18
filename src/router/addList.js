const hjxCustomer = resolve => require(['@/views/adList/hjxCustomer'], resolve) 
const hjxD = resolve => require(['@/views/adList/hjxD'], resolve) 
const hjxS = resolve => require(['@/views/adList/hjxS'], resolve) 
const commonDetail = resolve => require(['@/views/adList/commonDetail'], resolve)  
const commonAdd = resolve => require(['@/views/adList/commonAdd'], resolve)  
const commonEdit = resolve => require(['@/views/adList/commonEdit'], resolve)     

export default {
	hjxCustomer,
	hjxD,
	hjxS,
	commonDetail,
	commonAdd,
	commonEdit
}