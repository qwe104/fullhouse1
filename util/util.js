//提示层
function toast(title, duration = 1000) {
	uni.showToast({
		title,
		duration,
		icon: 'none',
		mask: true,
	})
}

//loading层
function loading(title) {
	uni.showLoading({
		title,
		mask: true,
	})
}

//modal
function Modal(content, showCancel, confirmFn) {
	uni.showModal({
		title: "温馨提示",
		content,
		cancelText: '取消',
		confirmText: '确定',
		showCancel: showCancel ? showCancel : false,
		success: function(res) {
			if (res.confirm) {
				confirmFn && confirmFn()
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
}


export {
	toast,
	loading,
	Modal
}
