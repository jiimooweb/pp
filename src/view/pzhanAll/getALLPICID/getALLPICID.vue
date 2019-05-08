<template>
    <div>

    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            idList:[]
        };
    },
    methods: {
        getId(){
            axios.request({
                // url:'sina/getID',
                url:'https://api.imjad.cn/pixiv/v1/?type=illust&id=73316785',
                method:'get'
            }).then(res=>{
                console.log(res);
                
            })
        }
    },
    mounted() {
        this.getId()
    }
};
</script>

<style lang='less'>
</style>
