<script>
	import {
		request
	} from '@/api/request.js'
	import {
		toast
	} from '@/util/util.js'
	export default {
		globalData: {
			appid: 'wx76362771373d113a',
			openid: '',
			token: '',
			userid: ''
		},
		onLaunch: function() {
			console.log('App Launch')
			uni.login({
				provider: 'weixin',
				success: (res) => {
					console.log(res);
					request('get_user_login.php', {
						appid:this.globalData.appid,
						js_code: res.code
					}).then((res1) => {
						if (res1.code == 200) {
							this.globalData.openid = res1.openid;
							this.globalData.token = res1.token;
							this.globalData.userid = res1.userid;
							this.$isResolve()
						} else {
							toast(res1.msg)
						}
					})
				},
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './static/iconfont.css'
</style>
