<template>
    <div>
        <Spin fix v-if="spinShow"></Spin>
        <row>
            <i-col span='4' style="line-height:30px;">
                活动封面
            </i-col>
            <i-col span='4'>
                <Upload style="margin-bottom:10px;" ref="upload" action="http://up-z2.qiniup.com" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :data="postData" :headers="headers">
                    <Button icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
            </i-col>
            <i-col span='24' style="display:block;margin:0 auto;">
                <img :src="image" width="100%">
            </i-col>
        </row>
    </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            image: "",
            postData: {
                token: "",
                file_name: "",
                key: ""
            },
            formData: "",
            spinShow:false,
        };
    },
    methods: {
        successUpload(file) {
            console.log(file);
            this.$Loading.finish()
            this.spinShow = false
        },
        successUpload1(file){
            console.log(file);
            
        },
        beforeUpload(file) {
            this.postData.file_name = file.name;
            this.postData.key = file.name;
            this.$Loading.start()
            this.spinShow = true
            axios
                .request({
                    url: "qiniu/token",
                    method: "post",
                    data: {
                        file_name: file.name
                    }
                })
                .then(res => {
                    this.postData.token = res;
                    this.$refs.upload.post(file)
                });
            return false;
        },
        getToken(name) {}
    },
    mounted() {},
    computed: {
        headers() {
            return {
                token: this.token
            };
        }
    }
};
</script>

<style scoped>
</style>