<template>
    <div style="min-width:1100px;margin-bottom:20px;">
        <row>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        发文编号:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="sdoc_no"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        发文标题:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="stitle"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        文件标题:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="ftitle"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        紧急程度:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <Select v-model="sleve" style="width:200px">
                            <Option v-for="item in urgentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </i-col>
                </row>
            </i-col>
            <i-col span='2' offset='1'>
                <i-button type='primary' @click="submitSearch()">搜索</i-button>
            </i-col>
        </row>

    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    props:['status','index'],
    data(){
        return {
            sdoc_no:'',
            stitle:'',
            sleve:'',
            ftitle:'',
            urgentList: [
                {
                    value: "0",
                    label: "普通"
                },
                {
                    value: "1",
                    label: "紧急"
                },
                {
                    value: "2",
                    label: "特急"
                },
                {
                    value: "3",
                    label: "特提"
                }
            ],
        }
    },
    methods:{
        submitSearch(){
            axios.request({
                url:"/docs?page=" + this.index+ "&status="+ this.status +"&doc_no="+ this.sdoc_no + "&title=" + this.stitle + "&level=" + this.sleve + "&file_name=" + this.ftitle,
                method:'get',
            }).then(res=>{
                this.$emit("listenToparent", res.data);
            })
        }
    }   
};
</script>

<style>
</style>