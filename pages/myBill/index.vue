<template>
	<view class="lists">
		<view class="list"  v-for="(item,index) in lists" :key="index">
			<view class="top">
				<text>{{item.out_trade_no}}</text>
				<text>已支付</text>
			</view>
			<view class="content">
				<view class="item">
					<text class="name">商 &nbsp;&nbsp;户 : </text>
					<text class="value">{{item.storename}}</text>
				</view>
				<view class="item">
					<text class="name">时  &nbsp;&nbsp;间 : </text>
					<text class="value">{{item.create_time}}</text>
				</view>
				<view class="item">
					<text class="name">授权码 : </text>
					<text class="value">{{item.auth_code}}</text>
				</view>
				<view class="price">￥ {{item.order_price}}</view>
			</view>
		</view>
		<view class="empty" v-if='lists.length==0'>暂无数据</view>
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
				lists: []
			}
		},
		onLoad() {
			this.getLists()
		},
		methods: {
			getLists() {
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('getOrder.php', {
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
		}
	}
</script>

<style scoped>
	.lists {
		height: 100vh;
		background-color: #F7F7FF;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.list {
		border-radius: 20rpx;
		background: #fff;
	}

	.list .top {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #426FE7;
		color: #fff;
		font-size: 30rpx;
		padding:0 30rpx;
		border-radius: 20rpx 20rpx 0 0;
	}
	.list .content{
		position: relative;
		padding:30rpx;
		font-size:28rpx;
	}
	.content .item +.item{
		margin-top:15rpx;
	}
	.content .price{
		position:absolute;
		right:30rpx;
		top:50%;
		transform:translateX(-50%);
		color:#F40;
		font-size:30rpx;
	}
	.content .name{
		margin-right:10rpx;
	}

	.list+.list {
		margin-top: 30rpx;
	}

	.empty {
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 32rpx;
		color: #DDDDDD;
	}
</style>
