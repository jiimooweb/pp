<template>
    <div>
        <matterSearch @listenToparent='returnMatterSearch' :status='status' :index='index' ref="matterSearch"></matterSearch>
        <i-table style="min-width:1000px;" :columns="receivedColumn" :data="receivedData"></i-table>
        <Page style="margin-top:20px;" :total="total" :page-size='20' @on-change='changePage' />
        <Modal v-model="recycleModal" title="确认结案" @on-ok="ok" @on-cancel="cancel">
            <p style="text-align:center;font-size:16px;">是否确认对 ‘
                <span style="color:red;">{{itemTitle}}</span>’ 进行结案</p>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import matterSearch from "@/components/matterSearch";
export default {
    components: { matterSearch },
    data() {
        return {
            index:1,
            status:0,
            recycleModal: false,
            itemTitle: "",
            itemId: "",
            total: 1,
            receivedColumn: [
                //   {
                //         title: "id",
                //         key: "id"
                //         //   width:'100px',
                //     },
                {
                    title: "发文编号",
                    key: "doc_no"
                    //   width:'100px',
                },
                {
                    title: "标题",
                    key: "title",
                    //   width:'500px',
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
                                }
                            },
                            params.row.title
                        );
                    }
                },
                {
                    title:'文件名称',
                    key:'file_name'
                },
                {
                    title: "紧急程度",
                    key: "urgent_level",
                    //   width:'100px',
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                attrs: {
                                    style:
                                        "color:" +
                                        this.getColor(params.row.urgent_level)
                                    // (params.row.urgent_level === 3
                                    //     ? "red;"
                                    //     : "green;")
                                }
                            },
                            this.getText(params.row.urgent_level)
                        );
                    }
                },
                {
                    title: "日期",
                    key: "created_at"
                    //   width:'100px'
                },
                {
                    title: "操作",
                    // width:'100px',
                    align: "center",
                    render: (h, params) => {
                        if(localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'Offcial_Admin'){
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        attrs: {
                                            style: "font-size:12px"
                                        },
                                        nativeOn: {
                                            click: () => {
                                                localStorage.setItem(
                                                    "docsId",
                                                    params.row.id
                                                );
                                                this.$router.push({
                                                    path:
                                                        "/matter/upcomingMatterDefalt"
                                                });
                                            }
                                        }
                                    },
                                    "进入"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "success",
                                            size: "small"
                                        },
                                        attrs: {
                                            style:
                                                "font-size:12px;margin-left:10px;"
                                        },
                                        nativeOn: {
                                            click: () => {
                                                this.itemTitle = params.row.title;
                                                this.itemId = params.row.id;
                                                this.recycleModal = true;
                                            }
                                        }
                                    },
                                    "设为已办"
                                )
                            ]);
                        }else{
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        attrs: {
                                            style: "font-size:12px"
                                        },
                                        nativeOn: {
                                            click: () => {
                                                localStorage.setItem(
                                                    "docsId",
                                                    params.row.id
                                                );
                                                this.$router.push({
                                                    path:
                                                        "/matter/upcomingMatterDefalt"
                                                });
                                            }
                                        }
                                    },
                                    "进入"
                                )
                            ]);
                        }
                        
                    }
                }
            ],
            receivedData: []
        };
    },
    methods: {
        //matterSearch组件事件
        returnMatterSearch(res) {
            this.receivedData = res.data
            this.total = parseInt(res.data.total);
        },

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
        ok() {
            axios
                .request({
                    url: "/docs/" + this.itemId + "/change",
                    method: "post",
                    data: {
                        status: 1
                    }
                })
                .then(res => {
                    this.getDocs();
                });
        },
        cancel() {},

        //
        changePage(index) {
            this.index = index
            this.$refs.matterSearch.submitSearch()
        },
        //getItem
        getDocs() {
            this.$refs.matterSearch.submitSearch()
        }
    },
    mounted() {
        this.getDocs();
    }
};
</script>

<style>
</style>