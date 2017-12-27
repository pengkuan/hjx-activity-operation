import axios from 'axios'
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
