// 公共配置

export default { 
	ENV_MARK: process.env.NODE_ENV == 'production' ? '' : '您正在访问测试环境！', //环境标识
	SYSTEM_ID: '101', 
	SYSTEM_HOME_ID: '100', 
	POWER_CENTER_LOGIN: 'http://api-amc.huishoubao.com.cn',
	RETURN_URL: 'https://mba.huanjixia.com/login', //登录后，后台跳转到home页面
	JSONP_URL: process.env.NODE_ENV == 'development' ? 'http://10.0.10.67:8080/index/index' : 'XXXXXXX',//本地开发环境(志鹏)、243测试环境
}