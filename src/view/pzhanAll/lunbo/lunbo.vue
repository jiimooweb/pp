<template>
    <div>
        <row>
            <i-col style="width:600px;height:300px; float:left;">
                <Carousel v-model="value" loop>
                    <CarouselItem v-for="item in lunboList">
                        <div class="demo-carousel" :style="'width:600px;height:300px;background:'+item.pic">{{item.id}}</div>
                    </CarouselItem>
                </Carousel>
            </i-col>
            <i-col style="width:600px; float:left;margin-left:20px;">
                <i-button @click="openNewGround(true)">新增</i-button>
                <i-table style="width:500px;" :columns="receivedColumn" :data="receivedData"></i-table>
            </i-col>
        </row>
        <Modal v-model="newGroundReview" :title="reviewTitle" @on-ok="newLunboGround" @on-cancel="openNewGround(false)">
            <row>
                <i-col>
                    swiperGround名字
                </i-col>
                <i-col>
                    <Input v-model="newGroudName" style="width: 300px" />
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            value: 0,
            receivedColumn: [
                {
                    title: "轮播组启用",
                    // key:'display'
                    render: (h, params) => {
                        var self = this;
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.display
                                },  
                                nativeOn: {
                                    click: () => {
                                        console.log(1);
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "轮播组名",
                    key: "name"
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
                                            this.isNew = false;
                                            this.openNew(true);
                                            this.editTagId = params.row.id;
                                            this.newTagName = params.row.name;
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
                                            this.removeId = params.row.id;
                                            this.removeName = params.row.name;
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
            receivedData: [],
            reviewTitle: "新增组",
            lunboList: [],

            groundIsNew: true,
            newGroundReview: false,
            newGroudName: ""
        };
    },
    methods: {
        getLunboGround() {
            axios
                .request({
                    url: "swiper_groups",
                    method: "get"
                })
                .then(res => {
                    console.log(res);

                    this.receivedData = res.data;
                });
        },
        openNewGround(i) {
            this.newGroundReview = i;
        },
        //newLunboGround
        newLunboGround() {
            if (this.newGroudName === "") {
                this.$Message.error("轮播组名不能为空");
                return;
            }
            axios
                .request({
                    url: "swiper_groups",
                    method: "post",
                    data: {
                        display:0,
                        name: this.newGroudName
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getLunboGround();
                });
        }
    },
    mounted() {
        this.getLunboGround();
    }
};
</script>

<style scoped>
</style>