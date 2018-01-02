// 公共配置

export default { 
	system_id: '101', 
	system_home_id: '100', 
	power_center_login_page: 'http://api-amc.huishoubao.com.cn',
	return_url: 'https://mba.huanjixia.com/login', //登录后，后台跳转到home页面
	jsonpUrl: process.env.NODE_ENV == 'development' ? 'http://10.0.10.67:8080/index/index' : 'XXXXXXX',//本地开发环境(志鹏)、243测试环境
}