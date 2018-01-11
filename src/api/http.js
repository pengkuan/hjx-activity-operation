import axios from 'axios'
import store from '@/store'
import config from '@/config'
import util from '@/util'
import originJsonp from 'jsonp'

let UserInfo = `user_id=${util.getQueryStringByName('user_id')};login_token=${util.getQueryStringByName('login_token')}; `
// axios 配置
// axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers['User-Info'] = UserInfo
// axios.defaults.withCredentials = true
axios.defaults.baseURL = config.BASE_URL

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
    if (res.status != 200) {
        return Promise.reject(res)
    }
    if(res.data._data._errCode == '900006'){
        Message({ message: res.data._data._errStr, type: 'warning' })
        window.location.href = `${config.POWER_CENTER_LOGIN}/login?system_id=${config.SYSTEM_HOME_ID}&jump_url=${config.RETURN_URL}`
        return
    }
    return res.data._data
}, (error) => {
    if (error.response) {
        // Message({ message: error.response.data._data._errStr, type: 'warning' })
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

/* jsonp接口开始 */ 
export function jsonp(_interface, params) { 
    let url = `${config.JSONP_URL}?type=jsonp`,
        token = store.getters['userInfo/loginToken'], 
        userid = store.getters['userInfo/userId'] ,
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
    if (config.IS_DEV) resParams._param.userid = '694' , resParams._param.token = 'a578664b01a26d11c11217c6f50159ab'
    // 合并参数 
    resParams._param = Object.assign({}, resParams._param, params) 
    // 拼接参数,注意jsonp不能直接字符串化json,后台解析不了   尝试递归方法??
    for (let i in resParams) { 
        for(let j in resParams[i] ) {
            if (typeof resParams[i][j] == 'object') {
                for (let k in resParams[i][j]) {
                    if (typeof resParams[i][j][k] == 'object') { 
                        for (let m in resParams[i][j][k]) {
                            url += `&${i}[${j}][${k}][${m}]=${resParams[i][j][k][m]}`
                        }
                    }else {
                        url += `&${i}[${j}][${k}]=${resParams[i][j][k]}`
                    }
                }
            } else {
                url += `&${i}[${j}]=${resParams[i][j]}` 
            } 
        }
    }  
    return new Promise((resolve, reject) => {
        originJsonp(url, {param: 'callback'}, (err, data) => {
            if (!err) {
                // 登录超时处理
                if (config.IS_NO_DEV) {
                    if (data._data._ret == '1' && data._data._errCode == '1001') { //无登录约定错误码1001
                        let host = encodeURIComponent(config.RETURN_URL) 
                        window.location.href = `${config.POWER_CENTER_LOGIN}/login?system_id=${config.SYSTEM_HOME_ID}&jump_url=${host}`
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