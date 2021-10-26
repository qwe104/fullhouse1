<template>
	<view class="home">
		<view class="lists">
			<view class="list" @click="ckList(item)" v-for="(item,index) in lists" :key="index">
				<image class="img" :src="item.logo"></image>
				<view class="info">
					<text class="name">{{item.describe}}</text>
					<text class="tip">{{item.create_time}}</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="toMore" @click="toMore">更多功能</view>
			<view class="addStore" @click="addStore">添加商家</view>
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
						<view class="upload" @click="chooseImg" v-if="!storeInfo.logo"><text
								class="iconfont icon-shangchuanshipin"></text></view>
						<image @click="chooseImg" v-if="storeInfo.logo" :src="storeInfo.logo" class="logoImg"></image>
					</view>
				</view>
				<view class="fd">
					<!-- <view @click="hideModal">取消</view> -->
					<view @click="createStore" class="createStore"
						:class="{isActive:storeInfo.describe&&storeInfo.logo}">确认创建</view>
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
				lists: [],
				show: false,
				storeInfo: {
					logo: '',
					describe: ''
				}
			}
		},
		onLoad() {
			this.getLists()
		},
		methods: {
			async getLists() {
				await this.$onLaunched;
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('get_store_list.php', {
					userid,
					openid,
					token,
				}).then((res) => {
					if (res.code == 200) {
						this.lists = res.data
					} else {
						toast(res.msg)
					}
				})
			},
			ckList(item) {
				uni.navigateTo({
					url: '/pages/storeDetail/index?item=' + JSON.stringify(item)
				})
			},
			toMore() {

			},
			addStore() {
				this.show = true;
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
					uni.uploadFile({
						url: 'https://dc.bilalipay.com/douyin/web/create_storeinfo.php', //仅为示例，非真实的接口地址
						filePath: logo,
						name: 'logo',
						formData: {
							userid,
							openid,
							token,
							describe,
						},
						success: (res) => {
							let data = JSON.parse(res.data.replace(/\ufeff/g, ''))
							toast(data.msg)
							if (data.code == 200) {
								this.show = false;
								this.getLists()
							}
						}
					});
				}
				/* request({}).then(() => {

				}) */
			},
			hideModal() {
				this.show = false;
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
						console.log(JSON.stringify(res.tempFilePaths));
					}
				});
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
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}

	.list .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.info .name {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
		color: #000
	}

	.info .tip {
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
		flex: 0 0 48%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 32rpx;
		border-radius: 5px;
	}

	.toMore {
		background-color: #426FE7;
	}

	.addStore {
		background-color: #52B752;
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
