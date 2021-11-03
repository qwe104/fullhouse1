<template>
	<view class="home">
		<view class="lists">
			<view class="list">
				<image class="img" :src="storeInfo.logo"></image>
				<view class="info">
					<text class="name">{{storeInfo.describe}}</text>
					<view class="tip" @click="edit" v-if="!isTY">
						<text class="iconfont icon-bianji" style="margin-right:5px"></text>编辑资料
					</view>
				</view>
			</view>
			<view class="bindInfo">
				<view class="bindTit">
					<text>系统绑定</text>
					<text class="iconfont icon-fresh" style="font-size:40rpx;color:#F40" @click="fresh"></text>
				</view>
				<view class="bindItem" v-if="storeInfo.is_bind==0">
					<text>绑定坐满系统</text>
					<view>
						<text class="btn-pay" @click='toPay'>支付开通</text>
						<text class="btn-sm" @click='saoma'>扫码绑定</text>
					</view>

				</view>
				<view class="bindItem" v-if="storeInfo.is_bind==1">
					<text>授权码</text>
					<text style="font-size:30rpx;">{{storeInfo.auth_code}}</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="toLook" @click="toLook">查看活动</view>
			<view class="toCreate" @click="toCreate" v-if="!isTY">创建活动</view>
		</view>
		<view class="modal" v-if="show">
			<view class="mask"></view>
			<view class="content">
				<view class="hd">商户信息</view>
				<view class="bd">
					<view class="inputGroup">
						<view class="label">简称</view>
						<input class="input" type="text" v-model="storeInfo.describe" />
					</view>
					<view class="logoBox">
						<view class="label">Logo</view>
						<view class="upload" @click="chooseImg" v-if="!storeInfo.logo">+</view>
						<image @click="chooseImg" v-if="storeInfo.logo" :src="storeInfo.logo" class="logoImg"></image>
					</view>
				</view>
				<view class="fd">
					<!-- <view @click="hideModal">取消</view> -->
					<view @click="createStore" class="createStore"
						:class="{isActive:storeInfo.describe&&storeInfo.logo}">确认修改</view>
				</view>
				<view class="close" @click="hideModal">
					<text class="iconfont icon-close"></text>
				</view>
			</view>
		</view>
		<view class="modal" v-if="showBind">
			<view class="mask"></view>
			<view class="content">
				<view class="hd">请输入授权码</view>
				<view class="bd">
					<view class="inputGroup">
						<!-- <view class="label">授权码</view> -->
						<input class="input" type="text" v-model="code" placeholder="授权码" />
						<text class="iconfont icon-saoma" style="font-size:60rpx;" @click="toSM"></text>
					</view>
				</view>
				<view class="fd">
					<!-- <view @click="hideModal">取消</view> -->
					<view @click="toBind" class="createStore" :class="{isActive:code}">绑定</view>
				</view>
				<view class="close" @click="hideModal">
					<text class="iconfont icon-close"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '@/api/request.js'
	import {
		toast
	} from '@/util/util.js'
	export default {
		data() {
			return {
				show: false,
				showBind: false,
				sid: {},
				isChoosed: false,
				code: '', //授权码
				isTY: '',
				storeInfo: {
					logo: '',
					describe: ''
				}
			}
		},
		onLoad(options) {
			this.sid = options.sid;
			this.isTY = options.isTY || ''
		},
		onShow() {
			this.getDetail();
		},
		methods: {
			getDetail() {
				let {
					userid,
					token,
					openid
				} = getApp().globalData;
				request('get_store_detail.php', {
					userid,
					openid,
					token,
					sid: this.sid
				}).then(res => {
					if (res.code == 200) {
						this.storeInfo = res
					} else {
						toast(res.msg)
					}

				})
			},
			toLook() {
				if (this.storeInfo.is_bind == 0) {
					toast('还未绑定系统,请先绑定');
					return
				}
				uni.navigateTo({
					url: '/pages/activityList/index?sid=' + this.sid + "&isTY=" + this.isTY
				})
			},
			toCreate() {
				if (this.storeInfo.is_bind == 0) {
					toast('还未绑定系统,请先绑定');
					return
				}
				uni.navigateTo({
					url: '/pages/createActivity/index?sid=' + this.sid + "&actid=0"
				})
			},
			edit() {
				this.show = true;
			},
			hideModal() {
				this.show = false;
				this.showBind = false
			},
			createStore() {
				let {
					describe,
					logo
				} = this.storeInfo;
				let {
					userid,
					token,
					openid
				} = getApp().globalData;
				if (describe == "") {
					toast("请输入简称");
				} else if (logo == "") {
					toast('请选择图片')
				} else {
					if (this.isChoosed) {
						uni.uploadFile({
							url: 'https://dc.bilalipay.com/douyin/web/edit_storeinfo.php',
							filePath: logo,
							name: 'logo',
							formData: {
								userid,
								openid,
								token,
								describe,
								id: this.sid
							},
							success: (res) => {
								let data = JSON.parse(res.data.replace(/\ufeff/g, ''))
								toast(data.msg)
								if (data.code == 200) {
									this.show = false;
									this.getDetail()
								}
							}
						});
					} else {
						request('edit_storeinfo.php', {
							userid,
							openid,
							token,
							describe,
							id: this.sid,
							logo: logo,
						}).then((res) => {
							toast(res.msg)
							if (res.code == 200) {
								this.show = false
								this.getDetail()
							}
						})

					}
				}
			},
			chooseImg() {
				var that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						const tempFilePaths = res.tempFilePaths;
						that.storeInfo.logo = tempFilePaths[0];
						that.isChoosed = true;
					}
				});
			},
			saoma() {
				this.showBind = true;
				this.code = "";
			},
			fresh() {
				this.getDetail();
			},
			//支付开通
			toPay() {
				var that = this;
				let {
					userid,
					token,
					openid,
					appid,
					money
				} = getApp().globalData;
				request('pay.php', {
					appid,
					userid,
					token,
					openid,
					sid: this.sid,
					money: money
				}).then(res => {
					if (res.code == 200) {
						wx.requestPayment({
							"timeStamp": res.prepay_info.timeStamp,
							"nonceStr": res.prepay_info.nonceStr,
							"package": res.prepay_info.package,
							"signType": res.prepay_info.signType,
							"paySign": res.prepay_info.paySign,
							"success": function(res) {
								that.getDetail()
							},
							"fail": function(res) {},
							"complete": function(res) {}
						})
					} else {
						toast(res.msg)
					}
				})
			},
			toSM() {
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						this.code = res.result;
					}
				});
			},
			// 绑定商户
			toBind() {
				let {
					userid,
					token,
					openid
				} = getApp().globalData;
				request('bind_store.php', {
					userid,
					token,
					openid,
					sid: this.sid,
					code: this.code
				}).then(res => {
					toast(res.msg);
					if (res.code == 200) {
						this.showBind = false;
						this.getDetail()
					}
				})
			}

		}
	}
</script>

<style scoped>
	.home {
		height: 100vh;
	}

	.lists {
		height: calc(100vh - 160rpx);
		padding: 30rpx;
		box-sizing: border-box;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		background-color: #F7F7FF;
	}

	.list {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 5px;
	}

	.list+.list {
		margin-top: 10px;
	}

	.list .img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 5px;
		margin-right: 30rpx;
	}

	.list .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bindInfo {
		margin-top: 30rpx;
		padding: 30rpx;
		border-radius: 5px;
		background-color: #fff;
	}

	.bindInfo .bindTit {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		padding-bottom: 30rpx;
		font-weight: 600;
	}

	.bindItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
	}

	.btn-sm {
		padding: 5px 10px;
		border-radius: 35rpx;
		background-color: #EEFBF6;
		color: #6DB08F;
	}

	.btn-pay {
		padding: 5px 10px;
		border-radius: 35rpx;
		background-color: #52B752;
		color: #fff;
		margin-right: 5px;
	}

	.info .name {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
		color: #000
	}

	.info .tip {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #B0B0B0
	}

	.footer {
		height: 160rpx;
		display: flex;
		padding: 30rpx;
		box-sizing: border-box;
		justify-content: space-between;
		background-color: #F7F7FF;
	}

	.footer view {
		height: 100rpx;
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 32rpx;
		border-radius: 5px;
	}

	.toLook {
		background-color: #426FE7;
	}

	.toCreate {
		background-color: #52B752;
		margin-left: 30rpx;
	}

	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99
	}

	.modal .mask {
		positon: absolute;
		height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, .5);
	}

	.modal .content {
		width: 70%;
		position: absolute;
		top: 40%;
		left: 50%;
		z-index: 999;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 5px;
		/* overflow: hidden; */
		padding: 40rpx;
	}

	.content .hd {
		text-align: center;
		margin-bottom: 60rpx;
	}

	.content .bd {}

	.content .fd {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.fd view {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.inputGroup {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.inputGroup .label {
		margin-right: 40rpx;
	}

	.inputGroup .input {
		height: 80rpx;
		background-color: #F7F7FF;
		flex: 1;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 5px;
	}

	.logoBox {
		display: flex;
		align-items: center;
	}

	.logoBox .label {
		margin-right: 40rpx;
	}

	.logoBox .upload {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		border: 1px solid #ddd;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 60rpx;
		font-weight: 600;
		color: #ddd;
	}

	.logoBox .logoImg {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		border: 1px solid #ddd;
	}

	.close {
		color: #fff;
		position: absolute;
		bottom: -85rpx;
		left: 50%;
		z-index: 999;
		transform: translateX(-50%);
	}

	.icon-close {
		font-size: 80rpx;
	}

	.createStore {
		background-color: #D2D2D2;
		color: #fff;
		border-radius: 8px;
		height: 100rpx;
	}

	.isActive {
		background-color: #426FE7;
		color: #fff;
	}
</style>
