<template>
    <div>
        <row style="margin:20px 0;">
            <i-col span='5'>
                <i-button style="margin-top: 10px;" type="primary" @click='oNew()'>新建</i-button>
            </i-col>
            <i-col span='24' style="margin-top:20px;" offset='1'>
                <Page :total="total" :current.sync='currentPage' :page-size="per_page" @on-change='changePage' />
            </i-col>
            <i-col span='24' style="margin-top:10px;">
                <i-table style="width:100%;min-width:600px;" :columns="newColumn" :data="newList"></i-table>
            </i-col>
            <i-col span='24' style="margin-top:20px;" offset='1'>
                <Page :total="total" :current.sync='currentPage' :page-size="per_page" @on-change='changePage' />
            </i-col>
        </row>
        <Modal style="width:500px;" v-model="newModal" title="文章" @on-ok="inputData()" @on-cancel="openNew()">
            <row style="margin-bottom:20px;">
                <i-col>
                    标题
                </i-col>
                <i-col>
                    <Input v-model="newData.title" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    作者
                </i-col>
                <i-col>
                    <Input type="textarea" v-model="newData.text" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    点击
                </i-col>
                <i-col>
                    <Input type="textarea" v-model="newData.click" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    文本
                </i-col>
                <i-col>
                    <i-editor v-model="newData.content"></i-editor>
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Editor from '_c/editor'
export default {
    data() {
        return {
            currentPage: 1,
            per_page: 1,
            total: 1,

            newModal: false,
            newData: {
                title: "",
                author: "p站星选",
                click: "",
                content: ""
            },
            isNew: false,
            currentId:'',
            currentTitle:'',
            newColumn: [
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "作者",
                    key: "author"
                },
                {
                    title: "点击",
                    key: "click"
                },
                {
                    title: "操作",
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
                                            this.isNew = true;
                                            this.newData = {
                                                title: params.row.title,
                                                author: params.row.author,
                                                click: params.row.click,
                                                content: params.row.content
                                            };
                                            this.openNew(i);
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
                                        click: () => {}
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            newList: []
        };
    },
    components: {},
    methods: {
        changePage() {},
        oNew() {
            this.isNew = true;
            this.newData = {
                title: "",
                author: "p站星选",
                click: "",
                content: ""
            };
            this.openNew(true);
        },
        openNew(i) {
            this.newModal = i;
        },
        inputData() {},
        getNew() {
            axios
                .request({
                    url: "articles",
                    method: "get"
                })
                .then(res => {
                    this.newList = res.data.data;
                });
        }
    },
    mounted() {
        this.getNew();
    }
};
</script>

<style>
</style>
