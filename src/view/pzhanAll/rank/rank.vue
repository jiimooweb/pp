<template>
    <div style="min-width:1200px;">
        <row>
            <i-col span='3'>
                <DatePicker
                    type="date"
                    v-model="newDate"
                    value-format="yyyy-MM-dd"
                    format='yyyy-MM-dd'
                    @on-change='newDate=$event'
                    placeholder="选择日期"
                ></DatePicker>
            </i-col>
            <i-col
                style="margin-bottom:20px;"
                span='6'
            >
                <i-button
                    type="primary"
                    @click='indexNewDate()'
                >新建日期</i-button>
            </i-col>
        </row>
        <row>
            <i-col
                style="margin-bottom:20px;"
                span='4'
            >
                年
                <Select
                    v-model="year"
                    @on-change='getRankDay()'
                    style="width:200px"
                >
                    <Option
                        v-for="item in yearList"
                        :value="item.key"
                        :key="item.key"
                    >{{ item.key }}</Option>
                </Select>
            </i-col>
            <i-col
                style="margin-bottom:20px;"
                span='4'
            >
                月
                <Select
                    v-model="month"
                    @on-change='getRankDay()'
                    style="width:200px"
                >
                    <Option
                        v-for="(item,index) in 12"
                        :value="index"
                        :key="index"
                    >{{ index+1 }}</Option>
                </Select>
            </i-col>
        </row>
        <row>
            <i-col style="margin-bottom:20px;">
                日
                <RadioGroup
                    v-model="day"
                    type="button"
                    size="small"
                    @on-change='changeDay'
                >
                    <Radio
                        v-for="(item,index) in dateList"
                        :key='index'
                        :label="item.id"
                    >{{item.date.substring(8)}}</Radio>
                </RadioGroup>
            </i-col>
        </row>
        <row v-if="day !== ''">
            <i-button style="margin-top: 10px;" type="primary" @click='openSelect()'>选择图片</i-button>
            <i-col style="width:820px;overflow:hidden;float:left;">
                <div
                    :class="'picItem '+(index === activeRank?'active':'')"
                    v-for="(item, index) in rankData"
                    :key="index"
                    @click="selectPic(index)"
                >
                    <img :src="item.picture.url">
                </div>
            </i-col>
            <i-col style="width:200px;float:left;">
                <row style="height: 0;overflow:hidden;">
                    <i-col>
                        <Input ref="a0" v-model="itemData.in" />
                    </i-col>
                </row>
                <row>
                    <i-col>
                        名次
                    </i-col>
                    <i-col>
                        <Input ref="a1" v-model="itemData.ranking"/>
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        旧名次
                    </i-col>
                    <i-col>
                        <Input ref="a2" v-model="itemData.old_ranking" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        上升
                    </i-col>
                    <i-col>
                        <Input ref="a3" v-model="itemData.up" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        图片数量
                    </i-col>
                    <i-col>
                        <Input ref="a4" v-model="itemData.count" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        清晰度
                    </i-col>
                    <i-col>
                        <InputNumber v-model="itemData.definition"></InputNumber>
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        上层ID
                    </i-col>
                    <i-col>
                        <InputNumber v-model="itemData.sid"></InputNumber>
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        首次登场
                    </i-col>
                    <i-col>
                        <i-switch v-model="itemData.is_first" :true-value='1' :false-value='0' @on-change="" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        隐藏
                    </i-col>
                    <i-col>
                        <i-switch v-model="itemData.is_hidden" :true-value='1' :false-value='0' @on-change="" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-button type="primary" @click='inputData()'>保存</i-button>
                </row>
            </i-col>
        </row>
        <selectPic oneOrAll='1' :hasSelect='rankData' @listenToparent='returnSelectPic' ref="selectPicModal"></selectPic>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import selectPic from "@/components/selectPic";
export default {
    components: { selectPic },
    data() {
        return {
            newDate: "",
            yearList: [{ key: "2018" }, { key: "2019" }],
            dateList: [],
            rankData: [],
            activeRank: 0,
            itemData:{
                in:0,
                img_id:0,
                ranking:1,
                old_ranking:1,
                up:0,
                is_first:0,
                is_hidden:0,
                count:1,
                definition:0,
                sid:0
            },
            currentItem:1,
            year: "2018",
            month: 11,
            day: ""
        };
    },
    methods: {
        openSelect() {
            this.$refs.selectPicModal.openSelect(true);
        },
        //SelectPic组件事件
        returnSelectPic(res){
            this.rankData = res.selectList
        },
        selectPic(index){
            this.activeRank = index
        },
        changeDay(key) {
            this.getDayPic(key);
        },
        getDayPic(key) {
            axios
                .request({
                    url: "leaderDates/" + key,
                    method: "get"
                })
                .then(res => {
                    this.rankData = res.data.leaderboards;
                    this.rangNum = this.rankData.length
                    this.currentItem = 1
                    this.$refs['a'+ this.currentItem].focus()
                    document.onkeydown = (e) => {
                        
                        var key = window.event.keyCode;
                        console.log(key);
                        
                        //keycode → 39  ← 37
                        if (key == 39) {
                            //右 下一个
                            this.activeRank < this.rankData.length-1?(this.activeRank++):(this.activeRank = 0)
                        }else if (key == 37){
                            //左 上一个
                            this.activeRank > 0?(this.activeRank--):(this.activeRank = this.rankData.length-1)
                        }
                        if(key == 9){
                            if(this.currentItem<3){
                                this.currentItem ++
                            }else{
                                this.currentItem = 0
                            }
                            console.log(this.currentItem);
                            
                            this.$refs['a'+ this.currentItem].focus()
                        }
                        if(key == 13){
                            //保存
                        }
                    };
                });
        },
        indexNewDate() {
            if (this.newDate === "") {
                this.$Message.error("日期为空");
                return false;
            }
            axios
                .request({
                    url: "leaderDates",
                    method: "post",
                    data: {
                        date: this.newDate
                    }
                })
                .then(res => {
                    this.newDate = "";
                    this.$Message.success("新建成功");
                    this.getRankDay();
                });
        },
        getRankDay() {
            if (this.year !== "" && this.month !== "") {
                axios
                    .request({
                        url: "leaderDates/date",
                        method: "post",
                        data: {
                            year: this.year,
                            month: this.month + 1
                        }
                    })
                    .then(res => {
                        this.dateList = res.data;
                    });
            }
        }
    },
    mounted() {
        this.getRankDay();
        
    }
};
</script>

<style scoped>
.picItem {
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: 0.3s;
    float: left;
    border: 2px solid rgba(0, 0, 0, 0);
    margin-right: 5px;
}
.picItem.active {
    border: 2px solid red;
}
.picItem img {
    height: 100%;
    display: block;
    margin: 0 auto;
}
</style>