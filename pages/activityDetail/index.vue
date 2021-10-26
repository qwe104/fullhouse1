<template>
	<view class="detail">

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
				detail: [],
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
						this.detail = res.data
					} else {
						toast(res.msg)
					}
				})
			},

		}
	}
</script>

<style scoped>
	.detail {
		height: 100vh;
		background-color: #FAFAFF;
	}
</style>
