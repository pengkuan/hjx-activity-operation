import axios from 'axios'
import originJsonp from 'jsonp'
import config from '@/config/index.js'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'https://business.huishoubao.com/api/';

import { Message } from 'element-ui'
//POST传参序列化
axios.interceptors.request.use((config) => {
    // if(config.method  === 'post'){
    //     config.data = qs.stringify(config.data)
    // }
    return config
}, (error) => {
    return Promise.reject(error)
})

//返回状态判断
axios.interceptors.response.use((res) => {
    let _this = this
    if (res.status != 200) {
        return Promise.reject(res)
    }
    return res.data._data
}, (error) => {
    if (error.response) {
        Message({ message: error.response.data._data._errStr, type: 'warning' })
        switch (error.response.status) {
            case 403:

        }
    }
    return Promise.reject(error)
})

export function fetch(Interface,api,params) {
    var resParams = {    
        '_head': {   
            '_version': "0.01",  
            '_msgType': "request", 
            '_interface': api,
            '_remark': "",
            "_timestamps":String(new Date().getTime()).substr(0,11) 
        },
        _param: {}
    }
    resParams._param = params
    // for (var i in params) {
    //     console.log(i)
    //     resParams._params[i+'lllll'] = params[i]
    // }
    return new Promise((resolve, reject) => {
        axios.post(Interface, resParams)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function get_cookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]) 
    }   
    else {
        return null
    } 
}

/* jsonp接口开始 */ 
export function jsonp(_interface, params) { 
    let url = `${config.jsonpUrl}?type=jsonp`,
        token = get_cookie('useruuid'),
        userid = get_cookie('userid') ,
        timestamps = Math.floor(new Date().getTime()/1000) + ''

    let resParams = {     
        "_head": {        
            "_version": "0.01",
            "_msgType": "request",
            "_timestamps": timestamps,
            "_interface": _interface,
            "_remark": "",    
        },
        "_param": {           
            "userid": userid, 
            "token": token,   
        }
    }
    if (process.env.NODE_ENV != 'production') resParams._param.userid = '测试694'
    if (process.env.NODE_ENV != 'production') resParams._param.token = '3077a9e5c2c6ea2c21c57c5bd95ccb8e'
    // 合并参数 
    resParams._param = Object.assign({}, resParams._param, params) 
    // 拼接参数,注意jsonp不能直接字符串化json,后台解析不了
    for (let i in resParams) { 
        for(let j in resParams[i] ) {
            // console.log(j,resParams[i][j]) 
            url += `&${i}[${j}]=${resParams[i][j]}` 
        }
    }  
    // url = `${url}&head[version]=0.01&head[msgtype]=request&head[interface]=newSystem&head[remark]=&params[system]=test&params[number]=12345678`   
    return new Promise((resolve, reject) => {
        originJsonp(url, {param: 'callback'}, (err, data) => {
            if (!err) {
                // 登录超时处理
                if (process.env.NODE_ENV == 'production') {
                    if (data._data._ret == '1' && data._data._errCode == '1001') {
                        let host = encodeURIComponent(config.return_url)
                        window.location.href = config.power_center_login_page + '/login?system_id=' + config.system_home_id + '&jump_url=' + host
                    }
                } 
                resolve(data._data)
            } else {
                reject(err)
            }
        })
    })
}
/* jsonp接口结束 */