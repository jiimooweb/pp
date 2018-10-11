<template>
    <div style="background:#fff;padding:20px;min-width:800px;">
        <row>
            <i-col style="height:45px;" :md="{ span: 24 }" :lg="{ span: 22,offset:2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">事项内容</span>
            </i-col>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">拟稿人:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;line-height:42px;color:' + dataColor">农业服务中心</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">标题:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;border-bottom:1px solid #e7e7eb;line-height:42px;color:' + dataColor">{{defaltData.title}}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">发文编号:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;border-bottom:1px solid #e7e7eb;line-height:42px;color:' + dataColor">{{defaltData.doc_no}}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">紧急程度:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;line-height:42px;font-size:16px;height:42px;color:' + levelColor">{{ levelText }}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">备注:</span>
                    </i-col>
                    <i-col span='15'>
                        <div style="border:1px solid #e7e7eb;">
                            <p :style="'min-height:50px;padding:10px;font-size:14px;line-height:30px;color:'+dataColor">
                                {{defaltData.remark}}
                            </p>
                        </div>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" v-if='defaltData.file_name !== null' :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">附件:</span>
                    </i-col>
                    <i-col span='2'>
                        <Button style="margin-top:9px;" type="primary" @click="downloadFile">下载</Button>
                    </i-col>
                    <i-col span='18'>
                        <span style="line-height:46px;font-size:18px;margin-left:10px;">
                            <Icon type="ios-document-outline" size="20" style="margin-top:-6px;" /> {{defaltData.file_name}}
                        </span>
                    </i-col>
                </row>
            </i-col>
        </row>
        <Divider />
        <row>
            <i-col style="height:45px;" :md="{ span: 24 }" :lg="{ span: 22,offset:2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">处理楼层</span>
            </i-col>
            <i-col class="replypage" :md="{ span: 24 }" :lg="{ span: 20,offset:2 }" v-for="(item,index) in replyData" :key='index'>
                <span class="ptime">{{item.created_at}}</span>
                <span class="pname">{{item.member.name}}:</span>
                <div class="ppage">
                    <p class="pcontent">{{item.content}}</p>
                    <div class="creply" v-for='(citem,index1) in item.comment' :key='index1'>
                        <span class="ctime">{{item.created_at}}</span>
                        <span class="cname">{{citem.member.name}}:</span>
                        <p class="ccontent">{{citem.content}}</p>
                    </div>
                </div>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  data() {
    return {
        levelText:'',
        levelColor:'',
      dataColor: "red",
      defaltData: {},
      annotation: "",
      receivedColumn: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "部门",
          key: "department"
        }
      ],
      receivedData: [],
      replyData: []
    };
  },
  methods: {
    getReply() {
      axios
        .request({
          url: "/suggests?doc_id=" + localStorage.getItem("docsId"),
          method: "get"
        })
        .then(res => {
          this.replyData = [];
          var arr = [];
          for (var i in res.data) {
            this.replyData.push(res.data[i]);
          }
        });
    },
    getDocsDefalt() {
      axios
        .request({
          url: "docs/" + localStorage.getItem("docsId"),
          method: "get"
        })
        .then(res => {
          this.defaltData = res.data;
          if(this.defaltData.urgent_level === 0){
            this.levelText = '普通'
            this.levelColor = '#19be6b'
          }else if(this.defaltData.urgent_level === 1){
              this.levelText = '紧急'
            this.levelColor = '#ff9900'
          }else if(this.defaltData.urgent_level === 2){
              this.levelText = '特急'
            this.levelColor = '#ed4014'
          }else if(this.defaltData.urgent_level === 3){
              this.levelText = '特提'
            this.levelColor = '#17233d'
          }
        });
    },
    downloadFile() {
      window.open(this.defaltData.qiniu_url);
    }
  },
  mounted() {
    this.getDocsDefalt();
    this.getReply();
  }
};
</script>

<style>
.replypage:nth-child(2) {
  border-top: 1px solid #e7e7eb;
}
.ptime {
  float: right;
  text-align: right;
  margin-top: 40px;
  padding-right: 5%;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.pname {
  display: block;
  font-size: 16px;
  margin-top: 40px;
  margin-bottom: 10px;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.ppage {
  width: 100%;
  min-height: 20px;
  border-bottom: 1px solid #e7e7eb;
  padding-bottom: 80px;
}
.pcontent {
  padding: 20px 5%;
  font-size: 16px;
}
.creply {
  background: #f6f8f9;
  width: 90%;
  margin: 10px 5%;
  padding: 15px;
}
.ctime {
  float: right;
  display: block;
  width: 50%;
  text-align: right;
  padding-right: 1%;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.cname {
  display: block;
  width: 30%;
  font-size: 16px;
  margin-bottom: 10px;
  color: #aaa;
}
.ccontent {
  line-height: 30px;
  font-size: 16px;
}
</style>
