<template>
    <div style="background:#fff;padding:20px;min-width:500px;">
        <row>
            <i-col style="height:45px;" :md="{ span: 5 }" :lg="{ span: 2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">收文人员</span>
            </i-col>
            <i-col style="height:45px;" :md="{ span: 2 }" :lg="{ span: 1 }">
                <org @listenToparent='getmenber' docId='0'></org>
            </i-col>
            <i-col :md="{ span: 24 }" :lg="{ span: 18 }">
                <i-table :columns="receivedColumn" :data="receivedData"></i-table>
            </i-col>
        </row>
        <Divider />
        <row>
            <i-col style="height:45px;" :md="{ span: 5 }" :lg="{ span: 2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">发文设置</span>
            </i-col>
            <i-col :md="{ span: 24 }" :lg="{ span: 18 }">
                <row style="margin-top:40px;margin-bottom:15px;display:block;overflow:hidden;">
                    <i-col span='4'>
                        <span style="font-size:15px;line-height:32px;">发文编号</span>
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="formDate.formNum" style="width: 100%"></Input>
                    </i-col>
                </row>
                <row style="margin-bottom:15px;display:block;overflow:hidden;">
                    <i-col span='4'>
                        <span style="font-size:15px;line-height:32px;">标题</span>
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="formDate.formTitle" style="width: 100%"></Input>
                    </i-col>
                </row>
                <row style="margin-bottom:15px;display:block;">
                    <i-col span='4'>
                        <span style="font-size:15px;line-height:32px;">紧急程度</span>
                    </i-col>
                    <i-col span='20'>
                        <i-select v-model="urgent" style="width:200px">
                            <i-option v-for="(item,index) in urgentList" :value="item.value" :key="index">{{ item.label }}</i-option>
                        </i-select>
                    </i-col>
                </row>
                <row style="margin-bottom:15px;display:block;overflow:hidden;">
                    <i-col span='4'>
                        <span style="font-size:15px;line-height:32px;">备注</span>
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="formDate.formRemark" type="textarea" :rows="8" style="width: 100%"></Input>
                    </i-col>
                </row>
            </i-col>
        </row>
        <Divider />
        <row>
            <i-col style="height:45px;" :md="{ span: 5 }" :lg="{ span: 2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">发文附件</span>
            </i-col>
            <i-col style="height:45px;" :md="{ span: 2 }" :lg="{ span: 1 }">
                <Upload ref='upload' :headers="headers" :before-upload="handleUpload" :show-upload-list='false' :on-success='successUpload' action="https://www.zshjnyoa.com/rdoor_oa/public/docs/upload">
                    <Button shape="circle" icon="md-add"></Button>
                </Upload>
                <!-- <input type="file"> -->
            </i-col>
            <i-col :md="{ span: 24 }" :lg="{ span: 18 }">
                <i-table :columns="fileColumn" :data="fileData"></i-table>
            </i-col>
        </row>
        <Divider />
        <row>
            <i-col span='12'>
                <!-- <Checkbox v-model="formDate.SMSNotice">短信通知</Checkbox> -->
            </i-col>
            <i-col span='24'>
                <Button style="margin:0 auto;display:block;" :max-size='5120' @click="matterSumit" type="primary">提交</Button>
            </i-col>
        </row>
    </div>
</template>   

<script>
import axios from "@/libs/api.request";
import org from "@/components/orgselect";
import Cookies from "js-cookie";
export default {
    components: { org },
    data() {
        return {
            formDate: {
                formNum: "",
                formTitle: "",
                formRemark: "",
                SMSNotice: true
            },
            urgent: "",
            urgentList: [
                {
                    value: "0",
                    label: "普通"
                },
                {
                    value: "1",
                    label: "紧急"
                },
                {
                    value: "2",
                    label: "特急"
                },
                {
                    value: "3",
                    label: "特提"
                }
            ],
            receivedColumn: [
                {
                    title: "姓名",
                    key: "name"
                },
                {
                    title: "部门",
                    key: "depName"
                    // render: (h, params) => {
                    //     return h(
                    //         "span",
                    //         {
                    //             attrs: {
                    //                 style:
                    //                     "color:" +
                    //                     this.getColor(params.row.dep_id)
                    //             }
                    //         },
                    //         this.getText(params.row.dep_id)
                    //     );
                    // }
                }
            ],
            receivedData: [],
            fileList: [],
            fileData: [],
            fileColumn: [
                {
                    title: "文件名",
                    key: "name"
                },
                {
                    title: "大小",
                    key: "size",
                    render: (h, params) => {
                        return h("span", [
                            h(
                                "strong",
                                Math.ceil(params.row.size / 1024) + " kb"
                            )
                        ]);
                    }
                }
                // {
                //     title: "进度",
                //     key: "schedule",
                //     render: (h, params) => {
                //         return h("Progress", {
                //             props: {
                //                 percent: params.row.schedule
                //             }
                //         });
                //     }
                // }
            ]
        };
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
                // token: localStorage.getItem('token')
            };
        }
    },
    methods: {
        getText(t) {
            let text = "";
            if (t === 0) {
                text = "普通";
            } else if (t === 1) {
                text = "紧急";
            } else if (t === 2) {
                text = "特急";
            } else if (t === 3) {
                text = "特提";
            }
            return text;
        },
        getColor(t) {
            let color = "";
            if (t === 0) {
                color = "#19be6b";
            } else if (t === 1) {
                color = "#ff9900";
            } else if (t === 2) {
                color = "#ed4014";
            } else if (t === 3) {
                color = "#17233d";
            }
            return color;
        },
        handleUpload(file) {
            this.file = file;
            this.fileList = [];
            this.fileList.push(this.file);
            this.fileData = []
            this.fileData.push({
                name: this.fileList[0].name,
                size: this.fileList[0].size
            });
            return false;
        },
        successUpload(file) {
            this.inputData(file.data);
        },
        inputData(data) {
            let menberL = [];
            for (let i = 0; i < this.receivedData.length; i++) {
                menberL.push(this.receivedData[i].id);
            }
            axios
                .request({
                    url: "/docs",
                    method: "post",
                    data: {
                        docs: {
                            doc_no: this.formDate.formNum,
                            urgent_level: this.urgent,
                            title: this.formDate.formTitle,
                            remark: this.formDate.formRemark,
                            file_name: data.fileName,
                            url: data.file_url,
                            qiniu_url: data.qiniuUrl
                        },
                        members: menberL
                    }
                })
                .then(res => {
                    this.$Spin.hide();
                    this.$router.push({path:'/matter/upcomingMatter'})
                    let navL = JSON.parse(localStorage.getItem('tagNaveList')) 
                    for(let i=0;i<navL.length;i++){
                        if(navL[i].name === 'newMatter'){
                            navL.splice(i,1)
                        }
                    }
                    this.setTagNavList(navL);
                });
        },
        upload() {
            //上传
            let item = this.fileList[0];
            this.$refs.upload.post(item);
        },
        getmenber: function(data) {
            this.receivedData = data;
        },
        //提交事项
        matterSumit() {
            
            if (!(this.receivedData.length > 0)) {
                this.$Message.error("收文人员至少要有一位");
                return false
            } else if (this.formDate.formNum === "") {
                this.$Message.error("发文编号不能为空");
                return false
            } else if (this.urgent === "") {
                this.$Message.error("紧急程度不能为空");
                return false
            } else if (this.formDate.formTitle === "") {
                this.$Message.error("标题不能为空");
                return false
            }

            this.$Spin.show();
            if (this.fileList.length > 0) {
                this.upload();
            } else {
                let data = {
                        fileName: "",
                        file_url: "",
                        qiniuUrl: ""
                };
                this.inputData(data);
            }
        }
    }
};
</script>

<style>
</style>
