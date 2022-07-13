import axios from 'axios'

export class HttpUtils {
    get = async function (url: string, data?: object) {
        let body = null
        await new Promise((resolve, reject) => {
            axios.get(url, data).then(res => {
                body = res.data
                resolve(body)
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        })
        return body;
    }
    post = async (url: string, data?: object) => {
        let body = null
        await new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(res => {
                    body = res.data
                    resolve(body)
                })
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
        return body
    }
}