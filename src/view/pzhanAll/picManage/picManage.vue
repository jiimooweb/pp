<template>
    <div>
        <Spin fix v-if="spinShow1"></Spin>
        <row>
            <i-col style="margin-bottom:20px;" span='13'>
                <i-button type="primary" @click='oNew()'>新增图片</i-button>
            </i-col>
            <i-col style="margin-bottom:20px;" span='4'>
                <Button type='warning' icon="ios-warning-outline" style="width:100%" @click="showStatus(true)">敏感状态</Button>
            </i-col>
            <i-col style="margin-bottom:20px;" span='4' offset='1'>
                <Button type='primary' icon="ios-warning-outline" style="width:100%" @click="showDisabled(true)">隐藏</Button>
            </i-col>
            <i-col span='24'>
                <matterSearch @listenToparent='returnMatterSearch' ref="matterSearch"></matterSearch>
            </i-col>
            <i-col span='24' style="margin-top:20px;">
                总图片数--<span style="color:red">{{total}}</span>--
            </i-col>
            <i-col span='24' style="margin-top:10px;">
                <i-table style="width:100%;min-width:600px;" :columns="picColumn" :data="picList"></i-table>
            </i-col>
            <i-col span='24' style="margin-top:20px;" offset='1'>
                <Page :total="total" :current.sync='currentPage' :page-size="per_page" @on-change='changePage' />
            </i-col>
        </row>
        <Modal v-model="newModal" :title="picModalTitle" :mask-closable="false" @on-ok="inputPic()" @on-cancel="oEdit()">
            <i-col style="margin-bottom:20px;">
                <i-button type="primary" @click='getOldData()' :disabled='hasOld'>上一次资料</i-button>
            </i-col>
            <row style="margin-bottom:20px;">
                <i-col>
                    标题
                </i-col>
                <i-col>
                    <Input v-model="picData.title" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    作者
                </i-col>
                <i-col>
                    <Input v-model="picData.author" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    ID
                </i-col>
                <i-col>
                    <Input v-model="picData.pic_id" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    点击
                </i-col>
                <i-col>
                    <Input v-model="picData.click" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    下载积分
                </i-col>
                <i-col>
                    <Input v-model="picData.point" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    敏感内容（雅蠛蝶）
                </i-col>
                <i-col>
                    <i-switch v-model="picData.status" :true-value='1' :false-value='0' />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    标签
                </i-col>
                <i-col>
                    <Select v-model="selectTags" filterable multiple>
                        <Option v-for="item in tagsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <!-- <Input v-model="tagsList" /> -->
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='10'>
                    <Input v-model="newTag" />
                </i-col>
                <i-col span='10' offset='1'>
                    <i-button type="primary" @click='oNewTag(true)'>新建标签</i-button>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    <Spin fix v-if="spinShow">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传中~~~</div>
                    </Spin>
                    <Upload style="margin-bottom:10px;" action="https://www.rdoorweb.com/pzhan/public/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img :src="picData.url" width="200px">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removePic()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;color:red;text-align:center;">是否删除图片</p><img width="100%" :src="deleteUrl">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="tagModal" title="新建标签" @on-ok="inputNewTag()" @on-cancel="oNewTag(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;text-align:center;">是否添加标签---<span style="color:red"> {{newTag}} </span>---</p>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="reviewModal" width='800px' title="预览大图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;height:700px;overflow-y:scroll;">
                    <img :src="reviewPic" width="100%">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="statusModal" title='重要' :footer-hide='true'>
            <div style="margin:0 auto;width:100%;display:block;overflow:hidden;">
                <Button type="success" style="width:45%;float:left;" long @click="changeStatus(0)">和平状态（已审核）</Button>
                <Button type="error" style="width:45%;float:right;" long @click="changeStatus(1)">战时状态（审核中）</Button>
            </div>
        </Modal>
        <Modal v-model="disabledModal" title='重要' :footer-hide='true'>
            <div style="margin:0 auto;width:100%;display:block;overflow:hidden;">
                <Button type="success" style="width:45%;float:left;" long @click="disabledA(0)">显示</Button>
                <Button type="error" style="width:45%;float:right;" long @click="disabledA(1)">隐藏</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import matterSearch from "@/components/matterSearch";
export default {
    components: { matterSearch },
    data() {
        return {
            spinShow1: false,
            spinShow: false,
            beforePic: "",

            isStatus: 0,
            statusModal: false,

            disabledModal:false,


            total: 1,
            per_page: 30,
            currentPage: 1,
            index: 1,
            reviewPic: "",

            newTag: "",
            tagModal: false,

            picModalTitle: "新增图片",
            newModal: false,
            isNewPic: true,
            isUpload: false,

            deleteModal: false,
            deleteUrl: "",

            reviewModal: false,
            tagTotal: 1,
            tag_per_page: 50,
            currentTagsPage: 1,
            selectTags: [],

            currentId: "",
            hasOld: false,
            picData: {
                pic_id: "",
                title: "",
                url: "",
                status: 0,
                author: "",
                click: "",
                point:5,
            },
            currentTags: [],
            tagsList: [
                {
                    label: "a1",
                    value: 1
                },
                {
                    label: "a2",
                    value: 2
                },
                {
                    label: "a3",
                    value: 3
                }
            ],

            picColumn: [
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "缩略图",
                    align: "center",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src:
                                        params.row.url +
                                        "?imageMogr2/auto-orient/thumbnail/x50/blur/1x0/quality/75",
                                    style:
                                        "height:50px;margin:0 auto;display:block;"
                                },
                                on: {
                                    click: () => {
                                        this.reviewPic = params.row.url;
                                        this.openreviewModal(true);
                                    }
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "作者",
                    width: 200,
                    align: "center",
                    key: "author"
                },
                {
                    title: "作品ID",
                    width: 100,
                    key: "pic_id"
                },
                {
                    title: "点赞",
                    width: 100,
                    key: "like_fans_count"
                },
                {
                    title: "收藏",
                    width: 100,
                    key: "collect_fans_count"
                },{
                    title: "下载",
                    width: 100,
                    key: "download_fans_count"
                },
                {
                    title: "浏览",
                    width: 100,
                    key: "click"
                },
                {
                    title: "隐藏",
                    width: 100,
                    render: (h, params) => {
                        var self = this;
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.hidden
                                },
                                nativeOn: {
                                    click: () => {
                                        this.changeDisplay(params.row.id);
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "编辑",
                    width: 200,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.isNewPic = false;
                                            this.selectTags = [];
                                            for (
                                                let i = 0;
                                                i < params.row.tags.length;
                                                i++
                                            ) {
                                                this.selectTags.push(
                                                    params.row.tags[i].id
                                                );
                                            }
                                            this.picData.id = params.row.pic_id;

                                            this.openNew(true);
                                            // this.picData = params.row;
                                            this.picData = {
                                                pic_id: params.row.pic_id,
                                                title: params.row.title,
                                                url: params.row.url,
                                                status: params.row.status,
                                                author: params.row.author,
                                                click: params.row.click,
                                                point:params.row.point,
                                            }
                                            this.currentId = params.row.id;
                                        }
                                    }
                                },
                                "修改"
                            ),
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.id;
                                            this.deleteUrl = params.row.url;
                                            this.openDelete(true);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            picList: [
                {
                    title: "",
                    url: "",
                    author: "admin",
                    like: "1",
                    collect: "2",
                    click: "123"
                }
            ]
        };
    },
    methods: {
        disabledA(i){
            axios
                .request({
                    url: "pictures/hidden",
                    method: "post",
                    data: {
                        hidden: i
                    }
                })
                .then(res => {
                    this.getPic();
                    this.showDisabled(false);
                    if (i === 1) {
                        this.$Message.error("已隐藏");
                    } else {
                        this.$Message.success("已显示");
                    }
                });
        },
        showStatus(i) {
            this.statusModal = i;
        },
        showDisabled(i) {
            this.disabledModal = i;
        },
        changeStatus(i) {
            this.spinShow1 = true;
            axios
                .request({
                    url: "pictures/status",
                    method: "post",
                    data: {
                        hidden: i
                    }
                })
                .then(res => {
                    this.getPic();
                    this.showStatus(false);
                    if (i === 1) {
                        this.$Message.error("已进入战时状态");
                    } else {
                        this.$Message.success("已解除战时状态");
                    }
                });
        },
        changeDisplay(id) {
            axios
                .request({
                    url: "pictures/" + id + "/hidden",
                    method: "get"
                })
                .then(res => {
                    this.$Message.success("success");
                });
        },
        //matterSearch组件事件
        returnMatterSearch(res) {
            this.spinShow1 = false;
            this.picList = res.data.data;
            this.total = res.data.total;
            this.per_page = res.data.per_page;
            this.currentPage = res.data.current_page;
        },
        changePage(index) {
            this.$refs.matterSearch.submitSearch(index);
        },
        //open
        //新建图片窗口
        oNew() {
            this.isNewPic = true;
            this.verHasOld()
            this.openNew(true);
        },
        oEdit() {
            this.isNewPic = false;
            this.openNew(false);
        },
        // 新建tag窗口
        oNewTag(i) {
            if (this.newTag === "") {
                this.$Message.error("标签名不能为空");
                return;
            }
            this.tagModal = i;
        },

        //编辑图片窗口
        openNew(i) {
            if (this.isNewPic) {
                this.picModalTitle = "新增图片";
                this.picData = {
                    id: "",
                    title: "",
                    url: "",
                    status: 0,
                    author: "",
                    click: "0",
                    point:5,
                };
                this.selectTags = [];
                this.currentId = [];
            } else {
                this.picModalTitle = "编辑图片";
            }
            this.newModal = i;
            if (!this.newModal) {
                if (this.picData.url !== "" && this.isUpload) {
                    axios
                        .request({
                            url: "qiniu/delete",
                            method: "post",
                            data: {
                                url: this.picData.url
                            }
                        })
                        .then(res => {
                            this.isUpload = false;
                        });
                }
            }
        },
        openDelete(i) {
            this.deleteModal = i;
        },
        tagChangePage(index) {
            this.currentTagsPage = index;
        },
        openreviewModal(i) {
            this.reviewModal = i;
        },

        //上传新标签
        inputNewTag() {
            axios
                .request({
                    url: "tags",
                    method: "post",
                    data: {
                        name: this.newTag
                    }
                })
                .then(res => {
                    this.newTag = "";
                    this.$Message.success("success");
                    this.getTags();
                })
                .catch(res => {
                    this.$Message.error("失败或标签名重复");
                    this.getTags();
                });
        },

        //getPic
        getPic() {
            this.$refs.matterSearch.submitSearch();
            this.selectTags = [];
        },
        //successUpload
        successUpload(file) {
            this.spinShow = false;
            if (this.picData.url !== "") {
                axios.request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.picData.url
                    }
                });
            }
            this.picData.url = file.url;
            this.isUpload = true;
        },
        //beforeUpload
        beforeUpload(file) {
            this.spinShow = true;
        },
        getOldData() {
            this.picData.title = localStorage.getItem("title");
            this.picData.author = localStorage.getItem("author");
            this.picData.pic_id = localStorage.getItem("pic_id");
            this.selectTags = JSON.parse(localStorage.getItem("selectTags"));
        },
        //inputPic
        inputPic() {
            this.sortTags();
            this.spinShow1 = true;
            localStorage.setItem("title", this.picData.title);
            localStorage.setItem("author", this.picData.author);
            localStorage.setItem("pic_id", this.picData.pic_id);
            localStorage.setItem("selectTags", JSON.stringify(this.selectTags));
            if (this.isNewPic) {
                axios
                    .request({
                        url: "pictures",
                        method: "post",
                        data: {
                            picture: {
                                pic_id: this.picData.pic_id,
                                title: this.picData.title,
                                url: this.picData.url,
                                status: this.picData.status,
                                author: this.picData.author,
                                click: this.picData.click,
                                point:this.picData.point
                            },
                            tags: this.selectTags
                        }
                    })
                    .then(res => {
                        this.getPic();
                        this.isUpload = false;
                        this.$Message.success("success");
                    })
                    .catch(err => {
                        this.$Message.error("图库内已有重复ID");
                        this.isUpload = false;
                        this.spinShow1 = false;
                        axios.request({
                            url: "qiniu/delete",
                            method: "post",
                            data: {
                                url: this.picData.url
                            }
                        });
                    });
            } else {
                axios
                    .request({
                        url: "pictures/" + this.currentId,
                        method: "put",
                        data: {
                            picture: {
                                pic_id: this.picData.pic_id,
                                title: this.picData.title,
                                url: this.picData.url,
                                status: this.picData.status,
                                author: this.picData.author,
                                click: this.picData.click,
                                point:this.picData.point
                            },
                            tags: this.selectTags
                        }
                    })
                    .then(res => {
                        this.getPic();
                        this.isUpload = false;
                        this.$Message.success("success");
                    });
            }
        },

        //removePic
        removePic() {
            axios
                .request({
                    url: "pictures/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getPic();
                    this.isUpload = false;
                    this.$Message.success("success");
                });
        },

        //getTag
        getTags() {
            axios
                .request({
                    url: "tags/all",
                    method: "get"
                })
                .then(res => {
                    this.tagsList = [];
                    for (let i = 0; i < res.data.length; i++) {
                        this.tagsList.push({
                            label: res.data[i].name,
                            value: res.data[i].id
                        });
                    }
                    this.tagsList.reverse();
                });
        },
        //整理tag
        sortTags() {
            // console.log(this.selectTags);

            // this.currentTags =
            return;
        },
        verHasOld() {
            if (localStorage.getItem("title") !== "") {
                this.hasOld = false;
            }else{
                this.hasOld = true;
            }
        }
    },
    mounted() {
        this.getPic();
        this.getTags();
        this.verHasOld();
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    }
};
</script>

<style scoped>
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>