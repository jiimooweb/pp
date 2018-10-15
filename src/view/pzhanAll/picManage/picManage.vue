<template>
    <div>
        <row>
            <i-col>
                <i-button type="primary" @click='openNew(true)'>新增图片</i-button>
            </i-col>
            <i-col style="margin-top:10px;">
                <i-table style="width:100%;min-width:600px;" :columns="picColumn" :data="picList"></i-table>
            </i-col>
            <i-col style="margin-top:20px;">
                <Page :total="total" :page-size="per_page" :on-change='changePage()' />
            </i-col>
        </row>
        <Modal v-model="newModal" :title="picModalTitle" @on-ok="inputPic()" @on-cancel="openNew(false)">
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
                    <Input v-model="picData.id" />
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
                    图片
                </i-col>
                <i-col>
                    <Upload action="http://localhost:8000/qiniu/upload" :on-success='successUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img :src="picData.url" width="200px">
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
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removePic()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;color:red;text-align:center;">是否删除图片</p><img width="100%" :src="deleteUrl">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="reviewModal" title="预览大图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;">
                    <img :src="reviewPic" width="100%">
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            total: 1,
            per_page: 30,
            currentPage: 1,

            reviewPic:'',


            picModalTitle: "新增图片",
            newModal: false,
            isNewPic: true,
            isUpload: false,

            deleteModal:false,
            deleteUrl:'',

            reviewModal:false,
            tagTotal: 1,
            tag_per_page: 50,
            currentTagsPage:1,
            selectTags:[],

            currentId: "",
            picData: {
                id: "",
                title: "",
                url: "",
                author: "",
                click: ""
            },
            currentTags: [],
            tagsList: [
                {
                    label:'a1',
                    value:1
                },
                {
                    label:'a2',
                    value:2
                },
                {
                    label:'a3',
                    value:3
                }
            ],

            picColumn: [
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "缩略图",
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src: params.row.url+'?imageMogr2/auto-orient/thumbnail/x50/blur/1x0/quality/75',
                                    style: "width:50px;height:50px;"
                                },
                                on:{
                                    click: () => {
                                        this.reviewPic = params.row.url
                                        this.openreviewModal(true)
                                    }
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "作者",
                    key: "author"
                },
                {
                    title: "id",
                    key: "pic_id"
                },
                {
                    title: "点赞",
                    key: "like"
                },
                {
                    title: "收藏",
                    key: "collect"
                },
                {
                    title: "浏览",
                    key: "click"
                },
                {
                    title: "编辑",
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
                                            this.selectTags = []
                                            for(let i=0;i<params.row.tags.length;i++){
                                                this.selectTags.push(params.row.tags[i].id)
                                            }
                                            console.log(this.selectTags);
                                            
                                            this.openNew(true);
                                            this.picData = params.row;
                                            this.currentId = params.row.id
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
                                            this.currentId = params.row.id
                                            this.deleteUrl = params.row.url
                                            this.openDelete(true)
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
        //open

        openNew(i) {
            if (this.isNewPic) {
                this.picModalTitle = "新增图片";
                this.picData = {
                    id: "",
                    title: "",
                    url: "",
                    author: "",
                    click: ""
                };
                this.currentId = [];
            } else {
                this.picModalTitle = "编辑图片";
            }
            this.newModal = i;
            if (!this.newModal) {
                if (this.picData.url !== "" && this.isUpload) {
                    axios
                        .request({
                            url: "pictures/delete",
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
        openDelete(i){
            this.deleteModal = i
        },
        changePage(index) {
            this.currentPage = index;
        },
        tagChangePage(index){
            this.currentTagsPage = index;
        },
        openreviewModal(i){
            this.reviewModal = i
        },
        //getPic
        getPic() {
            axios
                .request({
                    url: "pictures?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    // console.log(res.data);
                    this.picList = res.data.data;
                    this.selectTags = []
                });
        },
        //successUpload
        successUpload(file) {
            if (this.picData.url !== "") {
                axios.request({
                    url: "pictures/delete",
                    method: "post",
                    data: {
                        url: this.picData.url
                    }
                });
            }
            this.picData.url = file.url;
            this.isUpload = true;
        },

        //inputPic
        inputPic() {
            this.sortTags()
            if (this.isNewPic) {
                axios
                    .request({
                        url: "pictures",
                        method: "post",
                        data: {
                            picture: {
                                pic_id: this.picData.id,
                                title: this.picData.title,
                                url: this.picData.url,
                                author: this.picData.author,
                                click: this.picData.click
                            },
                            tags: this.selectTags
                        }
                    })
                    .then(res => {
                        this.getPic();
                        this.isUpload = false
                        this.$Message.success("success");
                    });
            } else {
                axios
                    .request({
                        url: "pictures/" + this.currentId,
                        method: "put",
                        data: {
                            picture: {
                                pic_id: this.picData.id,
                                title: this.picData.title,
                                url: this.picData.url,
                                author: this.picData.author,
                                click: this.picData.click
                            },
                            tags: this.selectTags
                        }
                    })
                    .then(res => {
                        this.getPic();
                        this.isUpload = false
                        this.$Message.success("success");
                    });
            }
        },

        //removePic
        removePic(){
            axios
                    .request({
                        url: "pictures/"+this.currentId,
                        method: "delete"
                    })
                    .then(res => {
                        this.getPic();
                        this.isUpload = false
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
                        this.tagsList = []
                        for(let i=0;i<res.data.length;i++){
                            this.tagsList.push({
                                label:res.data[i].name,
                                value:res.data[i].id
                            })
                        }
                    });
        },
        //整理tag
        sortTags(){
            console.log(this.selectTags);
            
            // this.currentTags = 
            return
        }
    },
    mounted() {
        this.getPic();
        this.getTags()
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
</style>