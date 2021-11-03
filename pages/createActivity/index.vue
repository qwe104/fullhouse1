<template>
	<view class="activity">
		<view class="infos">
			<view class="required">
				<view class="title">必填信息</view>
				<view class="item">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>活动名称</text>
					</view>
					<view>
						<input class="right input" type="text" v-model="form.act_name" placeholder="用于区分不同的活动">
					</view>
				</view>
				<!-- <view class="item">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>券类型</text>
					</view>
					<view>
				<radio-group>
					<label style="display: flex;align-items:center;font-size:32rpx">
						<view>
							<radio :value="1" :checked="true" />
						</view>
						<view>自定义券</view>
					</label>
				</radio-group>
			</view>
		</view>
		-->
				<view class="item">
					<text>优惠券</text>
					<radio-group @change="changeShowCard" style="display: flex; align-items: center;">
						<label style="display: flex;align-items:center;font-size:32rpx;margin-right:30rpx">
							<view>
								<radio :value="1" color="#5F90F8" :checked="showCard==1" />
							</view>
							<view>显示</view>
						</label>
						<label style="display: flex;align-items:center;font-size:32rpx">
							<view>
								<radio :value="0" color="#5F90F8" :checked="showCard==0" />
							</view>
							<view>不显示</view>
						</label>
					</radio-group>
				</view>
				<view class="item" v-if="showCard==1">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>券名称</text>
					</view>
					<view>
						<input class="right input" type="text" v-model="form.card_name" placeholder="抖音活动页面展示">
					</view>
				</view>
				<view class="item" v-if="showCard==1">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>有效期截止时间</text>
					</view>
					<view class="right_picker">
						<!-- :end="endDate" -->
						<picker mode="date" style="flex:1;text-align: right;" :value="form.last_time" :start="startDate"
							@change="bindChange">
							<view class="pickerInput" :class="{select:!form.last_time}">
								{{form.last_time? form.last_time:'请选择'}}
							</view>
						</picker>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="item" v-if="showCard==1">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>单人领取上限</text>
					</view>
					<view class="right_picker">
						<picker mode="selector" style="flex:1;text-align: right;" :value="lingquInd" :range="lingquRang"
							@change="bindChange1">
							<view class="pickerInput">{{lingquRang[lingquInd]}}</view>
						</picker>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<!-- <view class="item">
					<view class="label">
						<text class="tipIcon">*</text>
						<text>单条视频转发上限</text>
					</view>
					<view class="right_picker">
						<picker mode="selector" style="flex:1;text-align: right;" :value="shareInd" :range="shareRang"
							@change="bindChange2">
							<view class="pickerInput">{{shareRang[shareInd]}}</view>
						</picker>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view> -->
				<view class="videos">
					<view class="item">
						<view>
							视频片段
						</view>
						<!-- <view class="suggest" @click="openSuggest">
							拍摄建议 
						</view> -->
					</view>
					<view class="scenes">
						<view class="scene" v-for="(item,index) in form.videos" :key='index'>
							<view class="top">
								<view>场景{{index+1}}</view>
								<view @click="deleteScene(item,index)" style="color:#D19798">
									<text class="iconfont icon-delete"></text>
									删除整组
								</view>
							</view>
							<view class="videoBox">
								<htzImageUpload :max="19" :disabled="form.mv100[0]" v-model="form.videos[index]"
									mediaType="video" :chooseNum="1" :sourceType="['album']" :compress="false"
									:quality="80"
									:formData="{actid:actid,openid:logInfo.openid,userid:logInfo.userid,token:logInfo.token,sid:sid}"
									:remove="true" @uploadSuccess="uploadSuccess(arguments)" @imgDelete="Delete"
									@uploadFail="uploadFail"
									action="https://dc.bilalipay.com/douyin/web/create_douyin_activity_uploads.php"
									style="width:100%" :pInd="index">
								</htzImageUpload>
							</view>
						</view>
					</view>
					<view class="addScene" @click="addScene">
						<text class="iconfont icon-tianjia" style="margin-right:10rpx;"></text>
						添加一组场景
					</view>
				</view>

				<view class="allVideo">
					<view style="margin-bottom:40rpx;">
						<text class="title">视频成品</text>
						<text class="tip">视频片段和视频成品二选一</text>
					</view>
					<htzImageUpload :max="1" :disabled="hasVideo" :value="form.mv100" mediaType="video" :chooseNum="1"
						:sourceType="['album']" :compress="false" :quality="80" :name="'mv100'"
						:formData="{actid:actid,openid:logInfo.openid,userid:logInfo.userid,token:logInfo.token,sid:sid}"
						:remove="true" @uploadSuccess="uploadSuccess1(arguments)" @imgDelete="Delete1"
						@uploadFail="uploadFail1"
						action="https://dc.bilalipay.com/douyin/web/create_douyin_activity_uploads.php"
						style="width:100%;">
					</htzImageUpload>
				</view>
			</view>
			<view class="notRequired">
				<view class="title">非必填</view>
				<view class="poi">
					<view class="poi_top">
						<text>POI</text>
						<radio-group @change="radioChange" style="display: flex; align-items: center;">
							<label style="display: flex;align-items:center;font-size:32rpx;margin-right:30rpx">
								<view>
									<radio :value="1" color="#5F90F8" :checked="form.poi_status==1" />
								</view>
								<view>显示</view>
							</label>
							<label style="display: flex;align-items:center;font-size:32rpx">
								<view>
									<radio :value="0" color="#5F90F8" :checked="form.poi_status==0" />
								</view>
								<view>不显示</view>
							</label>
						</radio-group>
					</view>
					<view @click="toGD" class="address" v-if="form.poi_status==1">
						<text :class="{select:!form.poi_address}">{{form.poi_address?form.poi_address:'请选择'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="videoTit">
					<view class="videoTit_top">
						<text style="font-size:32rpx;font-weight: 600;">视频标题</text>
						<text style="color:#E4B2B6;font-size:25rpx;">添加多个标题时，每次随机分配一个标题</text>
					</view>
					<view class="inputs">
						<input type="text" class="input" v-model="form.mv_title" placeholder="如带标签可用#分割">
						<!-- <text class="iconfont icon-delete"></text> -->
					</view>
				</view>
				<view class="activityTips">
					<view class="tip_top">活动说明</view>
					<textarea placeholder="请输入" v-model="form.active_desribe" />
				</view>

			</view>
		</view>
		<view class="save" @click="save">{{isTY?'返回':'保存'}}</view>
	</view>
</template>

<script>
	import {
		request
	} from '@/api/request.js'
	import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue'
	import {
		toast
	} from '@/util/util.js'
	export default {
		data() {
			return {
				sid: '',
				isTY: '',
				actid: '',
				showCard: 1,
				// '不限领取',
				lingquRang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
				lingquInd: 0,
				// shareRang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
				// shareInd: 0,
				logInfo: {
					openid: '',
					userid: '',
					token: '',
				},
				form: {
					act_name: '',
					card_name: '',
					last_time: '',
					lingqu_num: 1,
					// share_num: 1,
					poi_status: 1,
					poi_address: '',
					poi_id: '',
					mv_title: '',
					active_desribe: '',
					videos: [
						['', '', '', '', ''],
						['', '', '', '', '']
					],
					mv100: [''],
				},
				hasVideo: false,
			}
		},
		onLoad(options) {
			this.isTY = options.isTY || '';
			if (options.actid != 0) {
				uni.setNavigationBarTitle({
					title: '编辑活动'
				})
			}
			if (options.item) {
				let item = JSON.parse(options.item);
				if (item.act_name) {
					this.showCard = 1;
				} else {
					this.showCard = 0;
				}
				let form = {
					act_name: item.act_name,
					card_name: item.card_name,
					last_time: item.last_time,
					lingqu_num: item.lingqu_num,
					// share_num: item.share_num,
					poi_status: item.poi_status,
					poi_address: item.poi_address,
					poi_id: item.poi_id,
					mv_title: item.mv_title,
					active_desribe: item.active_desribe,
					mv100: [item.mv100],
				}
				this.lingquInd = this.lingquRang.indexOf(item.lingqu_num * 1);
				// this.shareInd = this.shareRang.indexOf(item.share_num * 1);
				// if (this.shareInd == -1) {
				// 	this.shareInd = 0
				// }
				let keys = Object.keys(item);
				let nums = []
				keys.forEach(v => {
					if (v.indexOf('mv') == -1) {
						return
					}
					let num = v.slice(2);
					if (num == 100 || isNaN(num)) {
						return
					}
					nums.push(num * 1)
				})

				nums.sort(function(a, b) {
					return a - b;
				});
				// console.log(nums)
				var result = [];
				for (var i = 0, len = nums.length; i < len; i += 5) {
					result.push(nums.slice(i, i + 5));
				};
				// console.log(result);
				let videos = [];
				result.forEach(v => {
					let video = [];
					v.forEach((a) => {
						video.push(item['mv' + a])
					})
					videos.push(video);
				});
				form.videos = videos;
				// console.log(videos);
				this.form = form;
			}

			this.sid = options.sid;
			this.actid = options.actid;

			let {
				openid,
				userid,
				token
			} = getApp().globalData;
			this.logInfo.openid = openid;
			this.logInfo.userid = userid;
			this.logInfo.token = token;
		},
		components: {
			htzImageUpload
		},
		methods: {
			uploadSuccess(res) { //上传成功
				let data = JSON.parse(res[0].data.replace(/\ufeff/g, ''));
				let item = res[1];
				let pInd = res[2];
				if (data.code == 200) {
					let ind = item.indexOf('');
					this.$set(item, ind, data.file_url)
					// console.log(pInd)
					this.form.videos.splice(pInd, 1, item);
					// console.log(this.form.videos)
				}
			},
			Delete(e) {
				// console.log('ceshiImgDelete', e)
				let del_mv = e.del.slice(e.del.lastIndexOf('/') + 1).split('.')[0];
				let {
					openid,
					userid,
					token
				} = getApp().globalData;
				request('del_douyin_activity_uploads.php', {
					openid,
					userid,
					token,
					actid: this.actid,
					sid: this.sid,
					del_mv,
				}).then(res => {
					toast(res.msg);
					this.hasVideo = !this.isEmpty(this.form.videos);
				})

			},
			uploadFail(err) { //上传失败
				console.log('err', err)
			},
			uploadSuccess1(res) { //上传成功
				let data = JSON.parse(res[0].data.replace(/\ufeff/g, ''));
				if (data.code == 200) {
					this.$set(this.form.mv100, 0, data.file_url)
				}
			},
			Delete1(e) {
				// console.log('ceshiImgDelete', e)
				let del_mv = e.del.slice(e.del.lastIndexOf('/') + 1).split('.')[0];
				let {
					openid,
					userid,
					token
				} = getApp().globalData;
				request('del_douyin_activity_uploads.php', {
					openid,
					userid,
					token,
					actid: this.actid,
					sid: this.sid,
					del_mv,
				}).then(res => {
					toast(res.msg);
					this.$set(this.form.mv100, 0, '')
				})
			},
			uploadFail1(err) { //上传失败
				console.log('err', err)
			},
			//打开拍摄建议
			openSuggest() {

			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year;
					month = month;
					day = day;
				} else if (type === 'end') {
					year = year + 2;
					console.log(year);
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//监听pick改变
			bindChange(e) {
				this.form.last_time = e.detail.value;
			},
			bindChange1(e) {
				let {
					value
				} = e.detail;
				this.lingquInd = value;
				this.form.lingqu_num = this.lingquRang[value];
			},
			bindChange2(e) {
				let {
					value
				} = e.detail;
				this.shareInd = value;
				this.form.share_num = this.shareRang[value];
			},
			//添加一组场景
			addScene() {
				if (this.form.videos.length == 5) {
					toast('最多添加5个场景');
					return;
				}
				this.form.videos.push(['', '', '', '', '']);
			},
			//删除场景
			deleteScene(item, index) {
				this.form.videos.splice(index, 1)
			},
			radioChange(e) {
				this.form.poi_status = e.detail.value;
			},
			//是否显示优惠券
			changeShowCard(e) {
				this.showCard = e.detail.value;
			},

			//跳转到poi地址
			toGD() {
				uni.navigateTo({
					url: '/pages/POI/index'
				})
			},
			//点击保存
			save() {
				if (this.isTY) {
					uni.navigateBack();
					return;
				}
				let {
					openid,
					userid,
					token
				} = getApp().globalData;
				let {
					act_name,
					card_name,
					last_time,
					lingqu_num,
					// share_num,
					videos,
					poi_status,
					poi_address,
					poi_id,
					mv_title,
					active_desribe,
					mv100
				} = this.form;
				if (act_name == "") {
					toast("请输入活动名称")
				} else if (card_name == ""&&this.showCard) {
					toast("请输入券名称")
				} else if (last_time == ""&&this.showCard) {
					toast("请选择截止时间")
				} else if (lingqu_num== ""&&this.showCard) {
					toast("请选择单人领取上限")
				}else if (this.isEmpty(videos) && mv100[0] == '') {
					toast('请上传视频')
				} else {
					let data = {};
					let mv = [];
					videos.forEach((v) => {
						v.forEach(a => {
							mv.push(a)
						})
					})
					let mvNames = [];
					mv.forEach(a => {
						if (a) {
							let ind = a.lastIndexOf('/');
							mvNames.push(a.slice(ind + 1).split('.')[0]);
						}
					})
					let mvStr = mvNames.join(',');
					data.mv = mvStr;
					data.mv100 = mv100[0] ? mv100[0].slice(mv100[0].lastIndexOf('/') + 1).split('.')[0] : '';
					data.act_name = act_name;
					data.card_name = this.shwoCard?card_name:'';
					data.last_time = this.shwoCard?last_time:'';
					data.lingqu_num =this.shwoCard? lingqu_num:'';
					// data.share_num = share_num;
					data.poi_status = poi_status;
					data.poi_address = poi_address;
					data.poi_id = poi_id;
					data.mv_title = mv_title;
					data.active_desribe = active_desribe;
					data.openid = openid;
					data.userid = userid;
					data.token = token;
					data.actid = this.actid;
					data.sid = this.sid;
					request("create_douyin_activity.php", data).then(res => {
						toast(res.msg)
						if (res.code == 200) {
							uni.navigateTo({
								url: '/pages/activityList/index?sid=' + this.sid
							})
						}
					})
				};
			},
			isEmpty(arr) {
				let isEmpty = true;
				arr.forEach(v => {
					v.forEach(a => {
						if (a) {
							isEmpty = false;
						}
					})
				})
				return isEmpty
			}
		},
		computed: {
			startDate() {
				//限制开始时间;
				//也可以直接限定为当天日期 var date= new Date(); return date
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
		},
		watch: {
			'form.videos': {
				deep: true,
				immediate: true,
				handler(val) {
					console.log(val)
					this.hasVideo = !this.isEmpty(val);
				}
			}
		}
	}
</script>

<style scoped>
	.activity {
		height: 100vh;
		background-color: #FAFAFF;
	}

	.infos {
		height: calc(100vh - 80rpx);
		box-sizing: border-box;
		padding: 20rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.required {
		margin-bottom: 8px;
	}

	.required,
	.notRequired {
		background-color: #fff;
		border-radius: 5px;
		padding: 0 5px;
	}

	.title {
		line-height: 80rpx;
		height: 80rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.item {
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.item .label {
		display: flex;
		align-items: center;
		font-size: 32rpx;
	}

	.tipIcon {
		color: red;
		margin-right: 15rpx;
	}

	.item .right {
		flex: 1;
	}

	.item .input {
		text-align: right;
		font-size: 32rpx;
	}

	.item .select {
		font-size: 32rpx;
		color: #CBCBCB;
		margin-right: 30rpx;
	}

	.scene {
		background-color: #F7F8FF;
		border-radius: 5px;
		padding: 5px;
	}

	.scene .top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}

	.scene .videoBox {
		display: flex;
		justify-content: space-between;
	}

	.scene .video {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0 0 19%;
		background-color: #fff;
		border-radius: 4rpx;
	}

	.suggest {
		border: 1px solid;
		color: #DFCEA0;
		font-size: 32rpx;
		border-radius: 32rpx;
		padding: 10rpx 15rpx;
	}

	.addScene {
		width: 240rpx;
		margin: 20rpx auto 40rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #4882FF;
		border-radius: 35rpx;
		padding: 15rpx 25rpx;
	}

	.allVideo .title {
		font-size: 32rpx;
		font-weight: 600;
		margin-right: 15rpx;
		line-height: 1;
		height: auto;
	}

	.allVideo .tip {
		font-size: 24rpx;
		color: #aaa;

	}

	.poi {
		margin-bottom: 40rpx;
	}

	.poi_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.address {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.videoTit_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.videoTit .inputs {
		position: relative;
	}

	.videoTit .input {
		background-color: #F8F8F8;
		padding: 30rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		border-radius: 16rpx;
	}

	.videoTit .inputs .iconfont {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
	}

	.activityTips {
		margin-top: 50rpx;
	}

	.tip_top {
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
	}

	.activityTips textarea {
		background-color: #fff;
	}

	.save {
		background-color: #5084FF;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #fff;
	}

	.address .select {
		font-size: 32rpx;
		color: #D3D3D3
	}

	.right_picker {
		align-items: center;
		display: flex;
		flex: 1;
		justify-content: flex-end;
	}
</style>
