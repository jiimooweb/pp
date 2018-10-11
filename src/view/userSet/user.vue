<template>
	<div style="min-width:800px;">
		<row>
			<i-col span='24'>
				姓名
			</i-col>
			<i-col span='5'>
				<i-input style="margin-top:5px;margin-bottom:15px;" v-model="name"></i-input>
			</i-col>
		</row>
		<row>
			<i-col span='24'>
				手机号码
			</i-col>
			<i-col span='5'>
				<i-input style="margin-top:5px;margin-bottom:15px;" v-model="phone"></i-input>
			</i-col>
		</row>
		<!-- <row>
			<i-col span='24'>
				重置密码
			</i-col>
			<i-col span='5'>
				<i-input type='password' placeholder="此处留空则不修改密码" style="margin-top:5px;" v-model="password"></i-input>
			</i-col>
		</row> -->
		<!-- <Button type="primary" style="margin-top:20px;" @click="openModal">重置密码</Button> -->
		<Button type="primary" style="margin-top:20px;float:left;" @click="submitData">提交</Button>
		<a @click="openModal" style="margin-top:20px;margin-left:10px;color:#2d8cf0;line-height:32px;display:block;height:32px;width:50px;float:left;">重置密码</a>
		<Modal v-model="passwordModal" title="修改密码" @on-ok="ok" @on-cancel="cancel">
			<row>
				<i-col span='24' style="margin-top:10px;">
					原始密码
				</i-col>
				<i-col span='24'>
					<i-input type='password' style="margin-top:5px;" v-model="oldPassword"></i-input>
				</i-col>
			</row>
			<row>
				<i-col span='24' style="margin-top:10px;">
					新密码
				</i-col>
				<i-col span='24'>
					<i-input type='password' style="margin-top:5px;" v-model="newPassword"></i-input>
				</i-col>
			</row>
			<row>
				<i-col span='24' style="margin-top:10px;">
					重复密码
				</i-col>
				<i-col span='24'>
					<i-input type='password' style="margin-top:5px;" v-model="againPassword"></i-input>
				</i-col>
			</row>
			<div slot="footer">
				<row>
					<i-col span='3' offset='18'>
						<Button @click="cancel()">取消</Button>
					</i-col>
					<i-col span='3'>
						<Button type="primary" @click="ok()">确认</Button>
					</i-col>
				</row>
			</div>
		</Modal>
	</div>

</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            name: "",
            phone: "",

            passwordModal: false,
            oldPassword: "",
            newPassword: "",
            againPassword: ""
        };
    },
    mounted() {
        this.name = localStorage.getItem("name");
        this.phone = localStorage.getItem("phone");
    },
    methods: {
        openModal() {
            this.passwordModal = true;
        },
        ok() {
            if (this.oldPassword === "") {
                this.$Message.error("原密码不可为空");
                return false;
            } else if (this.newPassword === "") {
                this.$Message.error("新密码不可为空");
                return false;
            } else if (this.againPassword === "") {
                this.$Message.error("重复密码不可为空");
                return false;
            }

            if (this.newPassword.length < 6) {
                this.$Message.error("新密码长度不可小于6");
                return false;
            } else if (this.againPassword.length < 6) {
                this.$Message.error("重复密码长度不可小于6");
                return false;
            }
            if (this.newPassword == this.againPassword) {
                axios
                    .request({
                        url: "/menbers/update_password",
                        method: "post",
                        data: {
                            member: localStorage.getItem("memberId"),
                            password: this.newPassword,
                            oldpassword: this.oldPassword,
                            username: localStorage.getItem("userName")
                        }
                    })
                    .then(res => {
                        this.$Message.success("修改成功");
                        this.passwordModal = false;
                        this.oldPassword = "";
                        this.newPassword = "";
                        this.againPassword = "";
                    });
            } else {
                this.$Message.error("重复密码与新密码不匹配");
            }
        },
        cancel() {
            this.passwordModal = false;
        },
        getData() {
            (this.name = localStorage.getItem("userName")),
                (this.phone = localStorage.getItem("phone")),
                (this.password = "");
        },
        submitData() {
            // if(this.name = ){

            // }
            // if (this.password !== undefined && this.password.length < 6) {
            //     this.$Message.error("密码必须大于6位");
            //     return false;
            // }
            if (this.name === "" || this.phone === "") {
                this.$Message.error("姓名或手机不能为空");
                return false;
            }
            axios
                .request({
                    url: "/members/" + localStorage.getItem("memberId"),
                    method: "put",
                    data: {
                        name: this.name,
                        phone: this.phone
                    }
                })
                .then(res => {
                    // if (res.data.code === 1) {
                    //   this.$Message.error("账户名设置重复");
                    //   return false;
                    // }
                    this.$Message.success("修改成功");
                    localStorage.setItem("userName", this.name);
                    localStorage.setItem("phone", this.phone);
                });
        }
    }
};
</script>

<style>
</style>
