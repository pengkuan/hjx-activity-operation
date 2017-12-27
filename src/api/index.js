import * as http from './http'

export default {
/**
 * @公用数据
 */
    get_login_user_info(params) {return http.fetch('authority_center','get_login_user_info', params)}, //获取用户权限
    
    get_province_list(params) {return http.fetch('address','get_province_list', params)},//获取省份
    get_city_list(params) {return http.fetch('address','get_city_list', params)},//获取城市
    get_category_list(params) {return http.fetch('product_center','get_category_list', params)},//获取产品
    get_category_products(params) {return http.fetch('product_center','get_category_products', params)},//获取机型
    get_channel_list(params) {return http.fetch('channel_org','get_channel_list', params)},//获取渠道
    get_channel_store_list(params) {return http.fetch('channel_org','get_channel_store_list', params)},//获取门店
/**
 * @随机红包
 * @定向定额红包
 */
    search_activity_info_list(params) {return http.fetch('operation_center','search_activity_info_list', params)},//获取活动列表
    add_activity_info(params) {return http.fetch('operation_center','add_activity_info', params)}, //新增活动
    update_activity_info(params) {return http.fetch('operation_center','update_activity_info', params)}, //编辑活动
    search_activity_detail(params) {return http.fetch('operation_center','search_activity_detail', params)}, //获取活动详情
    update_activity_valid(params) {return http.fetch('operation_center','update_activity_valid', params)}, //设置活动状态
    change_activity_level(params) {return http.fetch('operation_center','change_activity_level', params)}, //调整优先级
/**
 * @发放记录
 */
    search_grant_record(params) {return http.fetch('operation_center','search_grant_record', params)},//获取发放记录列表
/**
 * @设置红包有效期
 */
    get_valid_time(params) {return http.fetch('operation_center','get_valid_time', params)},//获取红包有效时间
    update_valid_time(params) {return http.fetch('operation_center','update_valid_time', params)},//设置红包有效时间

}