<template>
	<view class="home">
		<view class="lists">
			<template v-for="(item,index) in lists">
				<view class="list" @click="ckList(item)" v-if="lists.length>0" :key="index">
					<image class="img" :src="item.logo"></image>
					<view class="info">
						<text class="name">{{item.describe}}</text>
						<text class="tip">{{item.create_time}}</text>
					</view>
				</view>
			</template>
			<image :src="bgurl" mode="aspectFit" class="bgImg"></image>

			<!-- <view class="empty" v-if="lists.length==0">
				<image :src="bgurl" style="width:100%;height:100%"></image>
			</view> -->
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
		<view class="modal modalBottom" v-if="showBottom">
			<view class="mask" @click="hideModal"></view>
			<view class="content1">
				<view class="hd1">更多功能</view>
				<view class="bd1">
					<view class="bd_item" @click="toBill">
						<text class="iconfont icon-zhoubianhuodongtiyandianxinxi"
							style="margin-right:30rpx;font-size:50rpx;color:#23BF7A"></text>
						<text>我的订单</text>
					</view>
					<view class="bd_item" @click="tymd">
						<text class="iconfont icon-my_bill"
							style="margin-right:30rpx;font-size:50rpx;color:rgb(255, 145, 40)"></text>
						<text>体验门店</text>
					</view>
				</view>
				<view class="close1" @click="hideModal">
					X
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
				},
				showBottom: false,
				bgurl: ''
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
					token,
					bgurl
				} = getApp().globalData;
				this.bgurl = bgurl
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
					url: '/pages/storeDetail/index?sid=' + item.id
				})
			},
			toMore() {
				this.showBottom = true;
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
				this.showBottom = false
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
			},
			//点击我的订单
			toBill() {
				this.showBottom = false;
				uni.navigateTo({
					url: '/pages/myBill/index'
				})
			},
			//点击弹框体验门店
			tymd() {
				this.showBottom = false;
				uni.navigateTo({
					url: '/pages/storeDetail/index?isTY=1&sid=1'
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
		background-color: #F3F3FB;
		position: relative;
	}

	.lists .bgImg {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 0;
	}

	.lists .empty {
		height: 100%;
		width: 100%;
	}

	.list {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 5px;
		position: relative;
		z-index: 11;
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
		background-color: #F3F3FB;
	}

	.footer view {
		height: 100rpx;
		flex: 0 0 48%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		border-radius: 5px;
	}

	.toMore {
		background-color: #fff;
		color: #577BE7;
		border: 1px solid #577BE7;
	}

	.addStore {
		background-color: #2754E1;
		color: #fff;
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

	.modalBottom .content1 {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		border-radius: 10px 10px 0 0;
		padding-bottom: 40rpx;

	}

	.modalBottom .hd1 {
		padding: 30rpx;
		text-align: center;
		font-size: 40rpx;
		font-weight: 500;
	}

	.bd1 .bd_item {
		border-bottom: 1px solid #ddd;
		padding: 40rpx;
		display: flex;
		align-items: center;
		font-size: 40rpx
	}

	.close1 {
		position: absolute;
		right: 30rpx;
		top: 30rpx;

	}
</style>
