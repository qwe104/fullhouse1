<template>
	<view class="detail">
		<view class="bg"></view>
		<view class="infos">
			<view class="top">
				<view class="nums">
					<view class="num">
						<view class="value">{{info.send_num?info.send_num:'--'}}</view>
						<view class="tip">发布次数</view>
					</view>
					<view class="num">
						<view class="value">{{info.dianzan_num?info.dianzan_num:'--'}}</view>
						<view class="tip">点赞量</view>
					</view>
					<view class="num">
						<view class="value">{{info.show_num?info.show_num:'--'}}</view>
						<view class="tip">浏览量</view>
					</view>
				</view>
				<view @click="toLook" class="look">查看点赞和浏览的详细数据</view>
			</view>
			<view class="lists">
				<template v-for="(item,index) in info.data">
					<view class="list" :key='index' v-if="info.data.length>0">
						<view class="nick">
							{{item.nickname}}
						</view>
						<view class="time">{{item.create_time}}</view>
					</view>
				</template>
				<view class="empty" v-if="info.data.length==0">暂无数据</view>
			</view>
		</view>
		<view class="modal" v-if="show">
			<view class="mask"></view>
			<view class="content">
				<view class="hd">温馨提示</view>
				<view class="bd">
					<view class="tip">
						尊敬的用户，根据抖音接口付费政策，每查询一次点赞量/浏览量，需向抖音支付<text class="red">0.005元</text>的查询费用。
					</view>
					<view class="tip">
						截止<text class="red">24小时前</text>，您的探店码活动待查询数据<text class="red">共2条</text>，如需查询详细数据，需支付<text
							class="red">0.01元</text>查询费用,请您知晓。
					</view>
				</view>
				<view class="fd">
					<view @click="hideModal">取消</view>
					<view @click="toPay" style="color:#7097DC">付款查看</view>
				</view>
				<view class="close" @click="hideModal">
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
				info: {
					send_num: 0,
					dianzan_num: 0,
					show_num: 0,
					data: []
				},
				actid: ''
			}
		},

		onLoad(options) {
			this.actid = options.actid;
			this.getDetail();
		},
		methods: {
			getDetail() {
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('get_activity_data.php', {
					userid,
					openid,
					token,
					actid: this.actid
				}).then((res) => {
					if (res.code == 200) {
						this.info = res
					} else {
						toast(res.msg)
					}
				})
			},
			toLook() {
				this.show = true
			},
			hideModal() {
				this.show = false
			}

		}
	}
</script>

<style scoped>
	.detail {
		height: 100vh;
		background-color: #F7F5FA;
		position: relative;
	}

	.bg {
		height: 200rpx;
		background-color: #2679F3;
	}

	.infos {
		position: absolute;
		top: 70rpx;
		left: 10px;
		right: 10px;
	}

	.top {
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
		padding: 10rpx;
	}

	.top .nums {
		display: flex;
	}

	.nums .num {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.num .value {
		margin-bottom: 20rpx;
		font-size: 30rpx;
		font-weight: bold
	}

	.nums .tip {
		font-size: 24rpx;
	}

	.top .look {
		width: 300rpx;
		padding: 5px 10px;
		border-radius: 30rpx;
		background-color: #FFF2EC;
		color: #EFC6B0;
		border: 1px solid #EFC6B0;
		font-size: 24rpx;
		margin: 20rpx auto;
	}

	.lists {
		height: calc(100vh - 366rpx);
		overflow: auto;
		background-color: #fff;

	}

	.lists .list {
		padding: 30rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #F3F3F1;
	}

	.nick {
		font-size: 24rpx;
	}

	.time {
		font-size: 24rpx;
		color: #D8D8D8
	}

	.empty {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #DDDDDD;
		font-size: 32rpx;
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
	}

	.content .hd {
		text-align: center;
		margin-bottom: 60rpx;
		padding-top: 40rpx
	}

	.content .bd {
		padding: 0 40rpx
	}

	.bd .tip {
		margin-bottom: 30rpx;
		font-size: 24rpx;
	}

	.tip .red {
		color: #DCA279;

	}

	.content .fd {

		display: flex;
		justify-content: space-between;
		border-top: 1px solid #ddd;
	}

	.fd view {
		padding: 30rpx;
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
	}

	.fd view:nth-of-type(1) {
		border-right: 1px solid #ddd
	}
</style>
