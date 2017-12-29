import {jsonp} from './http' 

export default { 
    // 广告位设置
    ad_adPositionList(params) {return jsonp('ad_adPositionList', params)}, 					//获取广告位列表接口 
    ad_getClient(params) {return jsonp('ad_getClient', params)}, 							//获取广告位的客户端列表
    ad_getAdPositionInfo(params) {return jsonp('ad_getAdPositionInfo', params)}, 			//获取广告位详情
    ad_editAdPosition(params) {return jsonp('ad_editAdPosition', params)}, 					//修改广告位
    ad_deleteAdPosition(params) {return jsonp('ad_deleteAdPosition', params)}, 	    		//删除广告位
    ad_addAdPositionDeadline(params) {return jsonp('ad_addAdPositionDeadline', params)}, 	//添加新广告位 - 阶段时间
    ad_addAdPositionPermanent(params) {return jsonp('ad_addAdPositionPermanent', params)}, 	//添加新广告位 - 永久开启

    // 广告列表
    ad_getAdList(params) {return jsonp('ad_getAdList', params)}, 							//广告列表
    ad_getAdPosition(params) {return jsonp('ad_getAdPosition', params)}, 					//广告位列表
    ad_addAdInfo(params) {return jsonp('ad_addAdInfo', params)},                            //添加广告
    ad_getChannel(params) {return jsonp('ad_getChannel', params)},                          //渠道列表
    ad_getStore(params) {return jsonp('ad_getStore', params)}, 						        //门店列表
} 