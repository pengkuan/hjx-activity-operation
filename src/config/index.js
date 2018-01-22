// 公共配置 
export default { 
	IS_DEV : process.env.NODE_ENV == 'development',
	IS_PRO : process.env.NODE_ENV == 'production',
	IS_TEST : process.env.NODE_ENV == 'test',
	IS_NO_DEV :  process.env.NODE_ENV == 'production' ||  process.env.NODE_ENV == 'test',
	BASE_URL : 'https://business.huishoubao.com/api/',
	ENV_MARK: process.env.NODE_ENV == 'production' ? '' : process.env.NODE_ENV == 'development' ? '您正在访问开发环境！' : '您正在访问测试环境！', //环境标识
	SYSTEM_ID: '101', 
	SYSTEM_HOME_ID: '100', 
	POWER_CENTER_LOGIN: 'http://api-amc.huishoubao.com.cn',
	RETURN_URL: 'https://mba.huanjixia.com/login', //登录后，后台跳转到home页面 
	JSONP_URL: process.env.NODE_ENV == 'development' ? 'https://dev-access.huanjixia.com/index/index' : process.env.NODE_ENV == 'production' ? 'https://access.huanjixia.com/index/index' : 'https://dev-access.huanjixia.com/index/index',//本地开发环境(志鹏)、243测试环境
	UPLOAD_URL: process.env.NODE_ENV == 'development' ? 'https://dev-access.huanjixia.com/index/index' : process.env.NODE_ENV == 'production' ? 'https://access.huanjixia.com/index/index' : 'https://dev-access.huanjixia.com/index/index',//本地开发环境(志鹏)、243测试环境
}
