<template>
    <div>
        <Spin fix v-if="spinShow"></Spin>
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
        <Modal width='850' v-model="newModal" :mask-closable="false" title="文章" @on-ok="inputNew()" @on-cancel="openNew(false)">
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
                    <Input type="textarea" v-model="newData.author" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    点击
                </i-col>
                <i-col>
                    <InputNumber :min="0" v-model="newData.click"></InputNumber>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    文本
                </i-col>
                <i-col>
                    <div ref="editor" style="text-align:left;width:820px;margin:0 auto;" v-model="newData.content"></div>
                </i-col>
                <i-col>
                    <i-button style="margin-top: 10px;" type="primary" @click='setHtml()'>设置内容</i-button>
                    <Input type="textarea" v-model="editorContent" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="deleteNew()" @on-cancel="openDelete(false)">
            是否删除<span style='color:red'>《{{this.currentTitle}}》</span>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import E from "wangeditor";
export default {
    data() {
        return {
            spinShow:false,
            currentPage: 1,
            per_page: 1,
            total: 1,

            newModal: false,
            newData: {
                title: "",
                author: "p站星选",
                click: 0,
                content: ""
            },

            deleteModal:false,
            contentHtml: "",
            editorContent: "",
            isNew: false,
            currentId: "",
            currentTitle: "",
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
                                            this.isNew = false;
                                            this.newData = {
                                                title: params.row.title,
                                                author: params.row.author,
                                                click: params.row.click
                                            };
                                            this.currentId = params.row.id;
                                            this.editorContent =
                                                params.row.content;
                                            this.setHtml();
                                            this.openNew(true);
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
                                            this.currentTitle = params.row.title
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
            newList: [],
            editor: {}
        };
    },
    components: {},
    methods: {
        changePage(index) {
            this.currentPage = index;
            this.getNew();
        },
        oNew() {
            this.isNew = true;
            this.editorContent = "";
            this.setHtml();
            this.newData = {
                title: "",
                author: "p站星选",
                click: 0,
                content: ""
            };
            this.openNew(true);
        },
        openNew(i) {
            this.newModal = i;
        },
        inputData() {},
        getNew() {
            this.spinShow = true
            axios
                .request({
                    url: "articles?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total;
                    this.per_page = res.data.per_page;
                    this.newList = res.data.data;
                    this.spinShow = false
                });
        },
        inputNew() {
            if(this.newData.title === ''){
                this.$Message.error('标题不能为空')
                return
            }
            this.spinShow = true
            axios
                .request({
                    url: this.isNew ? "articles" : "articles/" + this.currentId,
                    method: this.isNew ? "post" : "put",
                    data: {
                        title: this.newData.title,
                        author: this.newData.author,
                        click: this.newData.click,
                        content: this.editorContent
                    }
                })
                .then(res => {
                    this.$Message.success("提交成功");
                    this.getNew();
                });
        },
        openDelete(i){
            this.deleteModal = i
        },
        deleteNew() {
            this.spinShow = true
            axios
                .request({
                    url: "articles/" + this.currentId,
                    method: 'delete'
                })
                .then(res => {
                    this.$Message.success("删除成功");
                    this.getNew();
                });
        },
        setHtml() {
            this.editor.txt.html(this.editorContent);
        }
    },
    mounted() {
        //创建editer实例
        this.editor = new E(this.$refs.editor);
        this.editor.customConfig.onchange = html => {
            this.editorContent = html;
        };
        this.editor.customConfig.uploadImgShowBase64 = true;
        this.editor.create();

        this.getNew();
    }
};
</script>

<style>
</style>
