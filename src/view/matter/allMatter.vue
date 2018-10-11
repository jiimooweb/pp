<template>
    <div>
        <matterSearch @listenToparent='returnMatterSearch' :status='status' :index='index' ref="matterSearch"></matterSearch>
        <i-table style="min-width:1200px;" :columns="receivedColumn" :data="receivedData"></i-table>
        <Page style="margin-top:20px;" :total="total" :page-size='20' @on-change='changePage' />
    </div>
</template>

<script>
import matterSearch from "@/components/matterSearch";
import axios from "@/libs/api.request";
export default {
    components: { matterSearch },
    data() {
        return {
            status: 1,
            index: 1,
            total: 1,
            receivedColumn: [
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
                        return h(
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
                                        this.$router.push({
                                            path: "/matter/allMatterDefalt"
                                        });
                                    }
                                }
                            },
                            "进入"
                        );
                    }
                }
            ],
            receivedData: []
        };
    },
    methods: {
        //matterSearch组件事件
        returnMatterSearch(res) {
            this.receivedData = res.data;
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
        changePage(index) {
            this.index = index;
            this.$refs.matterSearch.submitSearch();
        },
        //getItem
        getDocs() {
            this.$refs.matterSearch.submitSearch();
        }
    },
    mounted() {
        this.getDocs();
    }
};
</script>

<style>
</style>