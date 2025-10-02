const htmlUtils = {
    encodeURI : function(contents: any, encoding: string|undefined = undefined) {
        return encodeURIComponent(contents);
        // const encodingTmp = typeof encoding == 'undefined' || encoding == '' ? 'UTF-8' : encoding;
        // return encodeURIComponent(contents, encodingTmp);
    },
    encodingCheck: function(contents: any) {
        const regCheck = /^A-Za-z0-9]$/;
        return regCheck.test(contents);
    },
    tempQS: '',
    // jsonToQS: function(param: any) {
    //     htmlUtils.tempQS = '';
    //     jsonToQSTemp(param);
    //     return htmlUtils.tempQS;
    // }
    jsonToQS: (params: object, pageable: {page:number, size:number, orders: {property:string, direction:string}[]} | undefined = undefined) => {
        htmlUtils.tempQS = '';

        let qs = '';
        if (pageable != undefined) {
            if (pageable.page != undefined) {
                qs += `page=${pageable.page}`;
            } else {
                qs += 'page=1';
            }
            if (pageable.size != undefined) {
                qs += `&size=${pageable.size}`;
            } else {
                qs += `&size=10`;
            }
            if (pageable.orders != undefined && pageable.orders.length > 0) {
                pageable.orders.forEach(order => {
                if (order.property != undefined && order.direction != undefined) {
                    qs += `&sort=${order.property},${order.direction}`;
                }
            });
            }
        }

        if (params != undefined) {
            if (qs.length > 0) {
                qs += '&';
            }

            jsonToQSTemp(params);
            qs += htmlUtils.tempQS;
        }

        console.log(qs);
        return encodeURI(qs);
    }
}

function jsonToQSTemp(param: any, keyString: string|undefined = undefined) {
    if (typeof param == 'object') {
        if (Array.isArray(param)) {
            for (let i = 0; i < param.length; i++) {
                if (typeof param[i] == 'object') {
                    jsonToQSTemp(param[i], keyString + '[' + i + ']');
                } else {
                    if (typeof keyString != 'undefined' && keyString != '') {
                        jsonToQSTemp(param[i], keyString + '[' + i + ']');
                    }
                }
            }
        } else {
            for (const key in param) {
                if (typeof param[key] == 'object') {
                    if (Array.isArray(param[key])) {
                        jsonToQSTemp(param[key], key);
                    } else {
                        jsonToQSTemp(param[key]);
                    }
                } else {
                    if (typeof keyString != 'undefined' && keyString != '') {
                        jsonToQSTemp(param[key], keyString + '.' + key);
                    } else {
                        jsonToQSTemp(param[key], key);
                    }
                }
            }
        }

    } else {
        if (htmlUtils.tempQS != '') {
            htmlUtils.tempQS += '&';
        }
        if (!htmlUtils.encodingCheck(param)) {
            param = htmlUtils.encodeURI(param);
        }
        htmlUtils.tempQS += keyString + '=' + param;
    }
}



export default htmlUtils;