<template>
    <div class="top-nav">
        <a-menu mode="horizontal">
            <a-menu-item key="mail">
                <a-icon type="mail" />Navigation One
            </a-menu-item>
            <a-sub-menu>
                <span slot="title"><a-icon type="setting" />Navigation Three - Submenu</span>
                <a-menu-item-group title="Item 1">
                    <a-menu-item key="setting:1">Option 1</a-menu-item>
                    <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
                <a-menu-item-group title="Item 2">
                    <a-menu-item key="setting:3">Option 3</a-menu-item>
                    <a-menu-item key="setting:4">Option 4</a-menu-item>
                </a-menu-item-group>
            </a-sub-menu>
        </a-menu>
    </div>
</template>
<script>
export default {
    props: [
        'size'
    ],
    data(){
        return {};
    },
    created(){
    },
    mounted(){
        document.body.appendChild(this.$el);
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.top-nav{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    overflow: hidden;
}
</style>