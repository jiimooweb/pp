<template>
    <div style="min-width:1200px;">
        <Spin fix v-if="spinShow"></Spin>
        <row>
            <i-col span='3'>
                <DatePicker type="date" v-model="newDate" value-format="yyyy-MM-dd" format='yyyy-MM-dd' @on-change='newDate=$event'
                    placeholder="选择日期"></DatePicker>
            </i-col>
            <i-col style="margin-bottom:20px;" span='6'>
                <i-button type="primary" @click='indexNewDate()'>新建日期</i-button>
            </i-col>
        </row>
        <row>
            <i-col style="margin-bottom:20px;" span='4'>
                年
                <Select v-model="year" @on-change='getRankDay()' style="width:200px">
                    <Option v-for="item in yearList" :value="item.key" :key="item.key">{{ item.key }}</Option>
                </Select>
            </i-col>
            <i-col style="margin-bottom:20px;" span='4'>
                月
                <Select v-model="month" @on-change='getRankDay()' style="width:200px">
                    <Option v-for="(item,index) in 12" :value="index" :key="index">{{ index+1 }}</Option>
                </Select>
            </i-col>
        </row>
        <row>
            <i-col style="margin-bottom:20px;">
                日
                <RadioGroup v-model="day" type="button" size="small" @on-change='changeDay'>
                    <Radio v-for="(item,index) in dateList" :key='index' :label="item.id">{{item.date.substring(8)}}</Radio>
                </RadioGroup>
            </i-col>
        </row>
        <row v-if="day !== ''">
            <i-col style="margin-bottom:10px;">
                <i-button style="margin-top: 10px;" type="primary" @click='openSelect()'>新增图片</i-button>
                <Button style="margin-top: 10px;" type="primary" shape="circle" icon="ios-refresh" @click="getDayPic()"></Button>
            </i-col>
            <i-col style="width:840px;overflow:hidden;float:left;overflow-y:scroll;height:500px;" id="scrollDiv">
                <div :class="'picItem '+(index === activeRank?'active':'')" v-for="(item, index) in rankData" :key="index"
                    @click="selectPic(index)">
                    <img :src="item.picture.url + '?imageMogr2/auto-orient/thumbnail/!20p/blur/1x0/quality/75|imageslim'">
                </div>
            </i-col>
            <i-col style="width:200px;float:left;margin-left:50px;" v-if="this.rankData.length>0">
                <row>
                    <i-col>
                        {{itemData.id}}
                    </i-col>
                </row>
                <row style="height: 0;overflow:hidden;">
                    <i-col>
                        <Input ref="a0" v-model="ain" />
                    </i-col>
                </row>
                <row>
                    <i-col>
                        名次
                    </i-col>
                    <i-col>
                        <Input ref="a1" v-model="itemData.ranking" />
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
                <!-- <row style="margin-top:5px;">
                    <i-col>
                        上升
                    </i-col>
                    <i-col>
                        <Input ref="a4" v-model="itemData.up" />
                    </i-col>
                </row> -->
                <row style="margin-top:5px;">
                    <i-col>
                        图片数量
                    </i-col>
                    <i-col>
                        <Input ref="a3" v-model="itemData.count" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        清晰度
                    </i-col>
                    <i-col>
                        <Input ref="a4" v-model="itemData.definition" />
                    </i-col>
                </row>
                <row style="margin-top:5px;">
                    <i-col>
                        上层ID
                    </i-col>
                    <i-col>
                        <Input ref="a5" v-model="itemData.sid" />
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
        <selectPic :oneOrAll='1' :hasSelect='rankReset' @listenToparent='returnSelectPic' ref="selectPicModal"></selectPic>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import selectPic from "@/components/selectPic";
export default {
    components: { selectPic },
    data() {
        return {
            spinShow:false,
            newDate: "",
            yearList: [{ key: "2018" }, { key: "2019" }, { key: "2020" }],
            dateList: [],
            rankData: [],
            rankReset:[],
            activeRank: 0,
            ain: 0,
            itemData: {
                id:0,
                img_id: 0,
                ranking: 1,
                old_ranking: 1,
                up: 0,
                is_first: 0,
                is_hidden: 1,
                count: 1,
                definition: 0,
                sid: 0
            },
            currentItem: 1,
            year: '',
            month: '',
            day: "",
            currentDayId:''
        };
    },
    methods: {
        openSelect() {
            this.rankReset = []
            this.$refs.selectPicModal.openSelect(true);
        },
        //SelectPic组件事件
        returnSelectPic(res) {
            this.rankReset = []
            for(let i=0;i<res.selectList.length;i++){
                this.rankReset.push(res.selectList[i].id)
            }
            //新增图片
            this.spinShow = true
            axios.request({
                url:'leaderboards',
                method:'post',
                data:{
                    ids:this.rankReset,
                    date_id: this.currentDayId
                }
            }).then(res=>{
                this.getDayPic()
            })
        },
        selectPic(index) {
            this.activeRank = index;
            this.itemData = this.rankData[index]
        },
        changeDay(key) {
            this.currentDayId = key
            this.getDayPic();
        },
        getDayPic() {
            this.spinShow = true
            axios
                .request({
                    url: "leaderDates/" + this.currentDayId,
                    method: "get"
                })
                .then(res => {
                    this.spinShow = false
                    this.rankData = res.data.leaderboards;
                    this.rangNum = this.rankData.length;
                    this.currentItem = 1;
                    
                    
                    if(this.rangNum === 0){
                        return
                    }
                    // this.$refs["a" + this.currentItem].focus();
                    // this.itemData = this.rankData[0]
                    document.onkeydown = e => {
                        var key = window.event.keyCode;
                        //keycode → 39  ← 37
                        if (key == 39) {
                            //右 下一个
                            this.activeRank < this.rankData.length - 1
                                ? this.activeRank++
                                : (this.activeRank = 0);
                                this.itemData = this.rankData[this.activeRank]
                                document.querySelector('#scrollDiv').scrollTop = Math.floor(this.activeRank/4) * 200
                                
                        } else if (key == 37) {
                            //左 上一个
                            this.activeRank > 0
                                ? this.activeRank--
                                : (this.activeRank = this.rankData.length - 1);
                                this.itemData = this.rankData[this.activeRank]
                                document.querySelector('#scrollDiv').scrollTop = Math.floor(this.activeRank/4) * 200
                        }
                        if (key == 9) {
                            this.$refs["a" + this.currentItem].focus();
                            if (this.currentItem < 4) {
                                this.currentItem++;
                            } else {
                                this.currentItem = 0;
                            }
                            
                        }
                        if (key == 13) {
                            this.spinShow = true
                            //保存
                            axios.request({
                                url:'leaderboards/'+this.itemData.id,
                                method:'put',
                                data:{
                                    ranking:this.itemData.ranking,
                                    old_ranking:this.itemData.old_ranking,
                                    up:this.itemData.up,
                                    count:this.itemData.count,
                                    definition:this.itemData.definition,
                                    sid:this.itemData.sid,
                                    is_first:this.itemData.is_first,
                                    is_hidden:this.itemData.is_hidden,
                                }
                            }).then(res=>{
                                this.spinShow = false
                                this.$Message.success('保存成功')
                                if(this.activeRank  < this.rankData.length - 1){
                                    this.activeRank++
                                }else{
                                    this.activeRank = 0
                                }
                                this.currentItem = 1
                                this.$refs["a" + this.currentItem].focus();
                                this.itemData = this.rankData[this.activeRank]
                                document.querySelector('#scrollDiv').scrollTop = Math.floor(this.activeRank/4) * 200
                            })
                        }
                    };
                });
        },
        inputData(){
            this.spinShow = true
                            //保存
                            axios.request({
                                url:'leaderboards/'+this.itemData.id,
                                method:'put',
                                data:{
                                    ranking:this.itemData.ranking,
                                    old_ranking:this.itemData.old_ranking,
                                    up:this.itemData.up,
                                    count:this.itemData.count,
                                    definition:this.itemData.definition,
                                    sid:this.itemData.sid,
                                    is_first:this.itemData.is_first,
                                    is_hidden:this.itemData.is_hidden,
                                }
                            }).then(res=>{
                                this.spinShow = false
                                this.$Message.success('保存成功')
                                if(this.activeRank  < this.rankData.length - 1){
                                    this.activeRank++
                                }else{
                                    this.activeRank = 0
                                }
                                this.currentItem = 1
                                this.$refs["a" + this.currentItem].focus();
                                this.itemData = this.rankData[this.activeRank]
                                document.querySelector('#scrollDiv').scrollTop = Math.floor(this.activeRank/4) * 200
                            })
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
        },
        setDate(){
            this.year = new Date().getFullYear() + ''
            this.month = new Date().getMonth()
        }
    },
    mounted() {
        this.setDate()
        this.getRankDay();
    },
    destroyed(){
        document.onkeydown = undefined
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