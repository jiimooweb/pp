<template>
    <div>
        <row>
            <i-col style="width:600px;height:300px; float:left;">
                <Carousel v-model="value" loop>
                    <CarouselItem v-for="item in defaultList">
                        <div class="demo-carousel" :style="'width:600px;height:300px;background:url('+item.image+') no-repeat center  '"></div>
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
        <Modal v-model="groundPic" title="编辑轮播组图片" @on-ok="" @on-cancel="openGroundPic(false)">
            <row>
                <i-col>
                    <Upload action="http://localhost:8000/qiniu/upload" :on-success='successUpload' :on-preview='previewUpload' :show-upload-list='true' :default-file-list="defaultList" :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
            </row>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="picData" title="图片信息" @on-ok="inputData()" @on-cancel="openPicData(false)">
            <row>
                <i-col>
                    跳转链接
                </i-col>
                <i-col>
                    <Input v-model="previewData.url"/>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    图片名称
                </i-col>
                <i-col>
                    <Input v-model="previewData.name"/>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    备注
                </i-col>
                <i-col>
                    <Input v-model="previewData.remake"/>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    是否显示
                </i-col>
                <i-col>
                    <i-switch v-model="previewData.display" :true-value='1' :false-value='0' @on-change="" />
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
                                        this.changeDisplay(params.row.id);
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
                                            this.getGroupPic(params.row.id);
                                            this.groupId = params.row.id;
                                            this.openGroundPic(true);
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
            newGroudName: "",

            groupId: "",
            groundPic: false,
            defaultList: [
                {
                    id:1,
                    display: 1,
                    group: 1,
                    name: "未命名",
                    image:
                        "http://p8r2g6z46.bkt.clouddn.com/20181013/7c18da85a30ae258c19b1a0a1d5e3c98.jpg",
                    remake: "未备注",
                    url: "www.rdoorweb.com"
                }
            ],
            previewData:'',
            picData:false
        };
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    },
    methods: {
        getLunboGround() {
            axios
                .request({
                    url: "swiper_groups",
                    method: "get"
                })
                .then(res => {
                    this.receivedData = res.data;
                });
        },
        openNewGround(i) {
            this.newGroundReview = i;
        },
        openGroundPic(i) {
            this.groundPic = i;
        },
        openPicData(i){
            this.openGroundPic(!i)
            this.picData = i;
        },
        //getGroupPic
        getGroupPic(id) {
            axios
                .request({
                    url: "swiper_groups/" + id,
                    method: "get"
                })
                .then(res => {
                    // this.defaultList = res.data;
                    // if (this.defaultList === null) {
                    //     this.defaultList = [];
                    // }
                    // this.defaultList = [];
                    console.log(res);
                });
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
                        display: 0,
                        name: this.newGroudName
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getLunboGround();
                });
        },
        ///changeDisplay
        changeDisplay(id) {
            axios
                .request({
                    url: "swiper_groups/" + id + "/change",
                    method: "get"
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getLunboGround();
                });
        },

        //successUpload
        successUpload(file) {
            this.inputGroup(file);
        },

        //提交groupPic
        // data
        // msg: "上传成功"
        // status: "success"
        // url: "http://p8r2g6z46.bkt.clouddn.com/20181013/7c18da85a30ae258c19b1a0a1d5e3c98.jpg"
        inputGroup(data) {
            this.defaultList.push({
                display: 1,
                group: this.groupId,
                name: "未命名",
                image: data.url,
                remake: "未备注",
                url: "www.rdoorweb.com"
            });
            axios
                .request({
                    url: "swiper_groups",
                    method: "post",
                    data: {
                        display: 1,
                        group: this.groupId,
                        name: "未命名",
                        image: data.url,
                        remake: "未备注",
                        url: "www.rdoorweb.com"
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getGroupPic(this.groupId);
                });
        },

        //clickPic
        previewUpload(file){
            this.previewData = file
            this.openPicData(true)
            console.log(file);
        },
        inputData(){
            axios
                .request({
                    url: "swipers/"+this.previewData.id,
                    method: "put",
                    data: this.previewData
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getGroupPic(this.groupId);
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