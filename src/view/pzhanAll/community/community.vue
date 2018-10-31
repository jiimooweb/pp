<template>
    <div>

    </div>
</template>

<script>
import axios from "@/libs/api.request";
    export default {
        data(){
            return{

            }
        },
        methods:{
            getSocials(){
                axios.request({
                    url:'socials',
                    method:'get'
                }).then(res=>{
                    console.log(res);
                    
                })
            }
        },
        mounted(){
            this.getSocials()
        }
    }
</script>

<style scoped>

</style>