<template>
	<view class="lists">
		<view class="list" v-for="(item,index) in lists" :key="index">
			<view class="top">
				<view>
					<view class="name">{{item.act_name}}</view>
					<view class="tip">{{item.active_desribe}}</view>
				</view>
				<view class="toDetail" @click="toDetail(item)">查看数据详情</view>
			</view>
			<view class="middle">
				<view>
					<text class="num">{{item.send_num}}</text>
					<text class="tip">发布次数</text>
				</view>
				<view>
					<text class="num">{{item.dianzan_num}}</text>
					<text class="tip">点赞量</text>
				</view>
				<view>
					<text class="num">{{item.show_num}}</text>
					<text class="tip">浏览量</text>
				</view>
			</view>
			<view class="bottom">
				<view @click="downLoadcode(item)">
					<text class="iconfont icon-erweima"></text>
					<text class="tip">下载二维码</text>
				</view>
				<view @click="edit(item)">
					<text class="iconfont icon-bianji"></text>
					<text class="tip">编辑活动</text>
				</view>
				<view @click="delAct(item)">
					<text class="iconfont icon-delete"></text>
					<text class="tip">删除</text>
				</view>
			</view>
		</view>
		<view class="emptyBox" v-if="lists.length==0">
			暂无数据
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
				sid: '',
				is_TY:'',
			}
		},
		onLoad(options) {
			this.sid = options.sid;
			this.is_TY=options.is_TY||''
			// this.getLists();
		},
		onShow() {
			this.getLists()
		},
		methods: {
			getLists() {
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('get_activity.php', {
					userid,
					openid,
					token,
					sid: this.sid
				}).then((res) => {
					if (res.code == 200) {
						this.lists = res.data
					} else {
						toast(res.msg)
					}
				})
			},
			//下载二维码
			downLoadcode(item) {
				//获取相册授权
				wx.showLoading({
					title: '保存中...'
				})
				wx.downloadFile({
					url: item.qrcode_url,
					success: function(res) {
						//图片保存到本地
						wx.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(data) {
								wx.hideLoading()
								wx.showToast({
									title: '保存成功',
									icon: 'success',
									duration: 2000
								})
							},
							fail: function(err) {
								console.log(err);
								if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err
									.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
									console.log("当初用户拒绝，再次发起授权")
									wx.showModal({
										title: '提示',
										content: '需要您授权保存相册',
										showCancel: false,
										success: modalSuccess => {
											wx.openSetting({
												success(settingdata) {
													console.log("settingdata",
														settingdata)
													if (settingdata
														.authSetting[
															'scope.writePhotosAlbum'
														]) {
														wx.showModal({
															title: '提示',
															content: '获取权限成功,再次点击图片即可保存',
															showCancel: false,
														})
													} else {
														wx.showModal({
															title: '提示',
															content: '获取权限失败，将无法保存到相册哦~',
															showCancel: false,
														})
													}
												},
												fail(failData) {
													console.log("failData",
														failData)
												},
												complete(finishData) {
													console.log("finishData",
														finishData)
												}
											})
										}
									})
								}
							},
							complete(res) {
								console.log(res);
								wx.hideLoading()
							}
						})
					}
				})
			},
			//编辑活动
			edit(item) {
				uni.navigateTo({
					url: '/pages/createActivity/index?actid=' + item.id + '&sid=' + this.sid + '&item=' + JSON
						.stringify(item)+"&is_TY"+this.is_TY
				})
			},
			//删除活动
			delAct(item) {
				var that = this;
				uni.showModal({
					title: '温馨提示',
					content: '确定删除活动？',
					success: function(res) {
						if (res.confirm) {
							let {
								userid,
								openid,
								token
							} = getApp().globalData;
							request('del_douyin_activity.php', {
								userid,
								openid,
								token,
								sid:that.sid,
								actid: item.id
							}).then((res) => {
								toast(res.msg)
								if (res.code == 200) {
									that.getLists()
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//跳转到数据详情
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/activityDetail/index?actid=' + item.id
				})
			}
		},
	}
</script>

<style scoped>
	.lists {
		height: 100vh;
		background-color: #FAFAFF;
		padding: 30rpx;
		box-sizing: border-box;
		line-height: 1;
	}

	.list {
		border-radius: 8px;
		background-color: #fff;
	}

	.list .top {
		padding: 15rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top .name {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.top .tip {
		font-size: 24rpx;
		color: #ACACAC;
	}

	.list .toDetail {
		padding: 8rpx 15rpx;
		border: 1px solid #D6D5D9;
		border-radius: 35rpx;
		font-size: 24rpx;
		color: #9BB7E1;
		background-color: #F2F9FF;
	}

	.list .middle {
		padding: 15rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FAFBFF;
	}

	.middle .num {
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.middle .tip {
		font-size: 24rpx;
		color: #ACACAC;
	}

	.middle>view,
	.bottom>view {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.bottom>view {
		flex: 0 0 33.33%;
	}

	.bottom {
		padding: 15rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.bottom .iconfont {
		font-size: 40rpx;
		margin-bottom: 15rpx;
	}

	.icon-delete {
		font-size: 45rpx !important;
	}

	.bottom .tip {
		font-size: 28rpx;
		color: #ACACAC;
	}

	.list+.list {
		margin-top: 20rpx;
	}

	.emptyBox {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #ddd;
	}
</style>
