<template>
    <div>
        <div style="overflow:hidden;">
            <a-button-group style="float: right;margin: 15px 0;">
                <a-button @click="setValue('')">
                    <a-icon type="sync" /> 恢复默认推荐
                </a-button>
                <a-button>
                    <a-icon type="" @click="genQr" /> 生成二维码
                </a-button>
                <a-button>
                    <a-icon type="qrcode" @click="scan" /> 扫码输入
                </a-button>
            </a-button-group>
        </div>

        <a-alert
            type="info"
            style="margin:0 0 15px;"
        >
            <div slot="description">
                <p>在这里填写菜单配置json（鉴于json太反人类所以填js对象就行）</p>
                <p>[{name: 展示名, source: 源, icon: 展示图标（可选）, children: &lt;list&gt;子菜单}, ...]</p>
                <p>exp：[{name: '新闻', source: api, icon: '' children: []]</p>
            </div>
        </a-alert>
        <a-textarea v-model="categoryInput" style="font-size:12px;" placeholder="[]" :autosize="{ minRows: 10, maxRows: 999 }" />

        <div style="overflow:hidden;">
            <a-button-group style="float: right;margin: 15px 0;">
                <a-button @click="reset">
                    <a-icon type="frown-o" /> 填错了卧槽
                </a-button>
                <a-button type="primary" @click="checkSetting">
                    <a-icon type="coffee" /> 我填的是不可能有错的
                </a-button>
            </a-button-group>
        </div>

        <a-alert message="查看可用api" @click.native="showSupport = !showSupport" type="info" showIcon style="margin:0 0 15px;" />
        <a-collapse v-if="showSupport">
            <a-collapse-panel v-for="(data, site) in apis" :key="site" :header="site">
                <a-list
                    :dataSource="data.routes"
                >
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                </a-list>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script>
import {mapState} from 'vuex';

export default {
    data(){
        return {
            categoryInput: '',
            showSupport: false,
        };
    },
    computed: {
        ...mapState({
            apis: state => state.setting.apis,
            category: state => state.sidebar.configs.menus,
            mobileMode: state => state.mobileMode,
        }),
    },
    watch: {
        category(){
            this.reset();
        },
    },
    created(){},
    async mounted(){
        await this.$store.dispatch('setting/fetchList');
        this.reset();
    },
    methods: {
        reset(){
            this.categoryInput = JSON.stringify(this.category, null, 4);
        },
        setValue(value){
            this.$store.dispatch('sidebar/save', value);
            this.$notification.open({
                message: '设置成功',
                description: `6666666`,
                icon: <a-icon type="coffee" style="color: #40a9ff" />,
            });
        },
        genQr(){

        },
        checkSetting(){
            let value;
            let err;
            try{
                value = eval(this.categoryInput);
            }catch(e){
                err = e;
                window.console.error(e);
            }
            if(err || !Array.isArray(value)){
                return this.$notification.open({
                    message: '果然填错了啊',
                    description: err ? err.toString() : `is not array: ${value}`,
                    icon: <a-icon type="smile-circle" style="color: #f5222d" />,
                });
            }
            this.setValue(value);
        },
        scan(){

        },
    }
}
</script>
<style lang="scss" scoped>
</style>