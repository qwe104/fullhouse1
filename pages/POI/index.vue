<template>
	<view class="addr">
		<input class="input" v-model="address" @input="getVal" type="text" placeholder="城市及店名用空格分隔,如: 南京 麦当劳">
		<view class="lists">
			<view class="list" v-for="(item,index) in lists" :key="index" @click="back(item)">{{
				item.name
			}}</view>
			<view class="empty" v-if="!lists||lists.length==0">暂无数据</view>
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
				address: '',
				lists: [],
				dy_poi_id: '',
			}
		},
		onLoad() {
			// this.getLists(this.address);
		},
		methods: {
			getVal(e) {
				if (e.detail.value == "") {
					this.lists = [];
					return;
				}
				this.getLists(e.detail.value)
			},
			getLists(address) {
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('get_gaodei_poilist.php', {
					userid,
					openid,
					token,
					address
				}).then(res => {
					if (res.code == 200) {
						this.lists = res.poi_list
					} else {
						toast(res.msg);
					}
				})
			},
			//获取抖音poi_id
			async getPoiId(gaodei_poi_id) {
				let {
					userid,
					openid,
					token
				} = getApp().globalData;
				request('get_douyin_poi.php', {
					userid,
					openid,
					token,
					gaodei_poi_id
				}).then(res => {
					if (res.code == 200) {
						this.dy_poi_id = res.poi_id;
						return res.poi_id;
					} else {
						toast(res.msg);
					}
				})
			},
			async back(item) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.form.poi_address = item.name; //修改上一页data里面的tagIndex 参数值
				// let dy_poi_id = await this.getPoiId();
				// prevPage.$vm.form.poi_id = dy_poi_id ? this.dy_poi_id : ''; //修改上一页data里面的tagIndex 参数值
				prevPage.$vm.form.poi_id = item.id; //修改上一页data里面的tagIndex 参数值
				uni.navigateBack();

			}
		}
	}
</script>

<style scoped>
	.addr {
		height: 100vh;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.addr .input {
		height: 88rpx;
		padding:0 15rpx;
		border-radius: 8px;
		background-color: #F6F7F7;
		fonts-size: 24rpx;
	}

	.lists {
		height: calc(100vh - 128rpx);
		overflow: auto;
	}
	.empty{
		height:100%;
		align-items:center;
		justify-content: center;
		display: flex;
		font-size:32rpx;
		color:#ddd
	}

	.list {
		border-bottom: 1px solid #ddd;
		padding: 30rpx;
		font-size: 28rpx;
	}
</style>
