import {
	toast,
	loading,
	Modal
} from '@/util/util.js'
let baseUrl="https://dc.bilalipay.com/douyin/web/";
//封装请求
// noLoad true:不加载loading ;false :加载loading
function request(url, data, method, noLoad) {
	if (!noLoad) {
		loading('加载中')
	};
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			data: data,
			header: {
				'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
			},
			method: method ? method : 'post',
			// responseType: 'text',
			success: (res) => {
				if (/^5/.test(res.statusCode)) {
					Modal('服务器忙，请重试',false);
				}
				if (!noLoad) {
					uni.hideLoading({
						success() {}
					});
				}
				resolve(res.data)
			},
			fail: (err) => {
				if (!noLoad) {
					uni.hideLoading();
				};
				toast(err);
				reject(err);
			}
			/* complete: () => {
				uni.hideLoading()
			} */
		});
	})
}
export {
	request,
}
