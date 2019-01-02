<template>
    <div>
        <row>
            <i-col style="margin-bottom:20px;">
                <Button type='primary' icon="ios-warning-outline" @click="showDisabled(true)">隐藏</Button>
            </i-col>
            <i-col>
                <Page :total="total" :page-size='pageSize' @on-change='changePage' />
            </i-col>
            <i-col>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="commentsColumn" :data="commentsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="reviewModal" width='800px' title="预览图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;height:700px;overflow-y:scroll;">
                    <img :src="item.url" width="50%" style="float:left;" v-for="item in reviewPic">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removeCommunity()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;color:red;text-align:center;">是否删除此说说</p>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="statusModal" title='重要' :footer-hide='true'>
            <div style="margin:0 auto;width:100%;display:block;overflow:hidden;">
                <Button type="success" style="width:45%;float:left;" long @click="disabledA(0)">显示</Button>
                <Button type="error" style="width:45%;float:right;" long @click="disabledA(1)">隐藏</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            statusModal:false,
            total: 1,
            pageSize: 1,
            currentPage:1,
            reviewModal: false,
            deleteModal: false,
            currentId:'',
            commentsColumn: [
                {
                    title: "内容",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                }
                            },
                            params.row.content
                        );
                    }
                },
                {
                    title: "发出人",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                }
                            },
                            params.row.fan.nickname
                        );
                    }
                },
                {
                    title: "日期",
                    key: "created_at"
                },{
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
                    title: "查看图片",
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
                                            this.openReviewModal(true);
                                            this.reviewPic = params.row.photos;
                                        }
                                    }
                                },
                                "查看"
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
                                            this.openDelete(true);
                                            this.currentId = params.row.id;
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            commentsList: [],
            reviewPic: []
        };
    },
    methods: {
        showDisabled(i) {
            this.statusModal = i;
        },
        changeDisplay(id) {
            axios
                .request({
                    url: "socials/" + id + "/hidden",
                    method: "get"
                })
                .then(res => {
                    this.$Message.success("success");
                });
        },
        disabledA(i){
            axios
                .request({
                    url: "socials/hidden",
                    method: "post",
                    data: {
                        hidden: i
                    }
                })
                .then(res => {
                    this.showDisabled(false);
                    this.getSocials()
                    if (i === 1) {
                        this.$Message.error("已隐藏");
                    } else {
                        this.$Message.success("已显示");
                    }
                });
        },
        openDelete(i) {
            this.deleteModal = i;
        },
        changePage(index) {
            this.currentPage = index;
            this.getSocials();
        },
        openReviewModal(i) {
            this.reviewModal = i;
        },
        getSocials() {
            axios
                .request({
                    url: "socials/index?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total;
                    this.pageSize = res.data.per_page;
                    this.commentsList = res.data.data;
                    if(this.currentPage !== 1 && this.commentsList.length === 0){
                        this.currentPage--
                        this.getSocials()
                    }
                });
        },
        removeCommunity() {
            axios
                .request({
                    url: "socials/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getSocials();
                });
        }
    },
    mounted() {
        this.getSocials();
    }
};
</script>

<style scoped>
</style>