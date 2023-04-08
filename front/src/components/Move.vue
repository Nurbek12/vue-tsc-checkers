<template>
    <div class="control" v-if="!king">
        <div class="dd" @click="$emit('move', -9)">
            <i class="mdi mdi-arrow-up-circle"></i>
        </div>
        <div class="dd" @click="$emit('move', -7)">
            <i class="mdi mdi-arrow-up-circle"></i>
        </div>
        <div class="dd" @click="$emit('move', 7)">
            <i class="mdi mdi-arrow-up-circle"></i>
        </div>
        <div class="dd" @click="$emit('move', 9)">
            <i class="mdi mdi-arrow-up-circle"></i>
        </div>

        <div class="dd-atack d1" @click="$emit('atack', -18)">
            <i class="mdi mdi-sword-cross"></i>
        </div>
        <div class="dd-atack d2" @click="$emit('atack', -14)">
            <i class="mdi mdi-sword-cross"></i>
        </div>
        <div class="dd-atack d3" @click="$emit('atack', 14)">
            <i class="mdi mdi-sword-cross"></i>
        </div>
        <div class="dd-atack d4" @click="$emit('atack', 18)">
            <i class="mdi mdi-sword-cross"></i>
        </div>
    </div>
    <div class="control" v-else>
        <div class="dm" v-for="y in yarr" :key="y" :style="`--ds: ${y/9}`" @click="$emit('moveD', y)">
            <i class="mdi mdi-crosshairs-gps"></i>
        </div>
        <div class="dm rb" v-for="x in xarr" :key="x" :style="`--ds: ${x/7}`" @click="$emit('moveD', x)">
            <i class="mdi mdi-crosshairs-gps"></i>
        </div>
    </div>
</template>

<script lang="ts" >
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Move",
  props: {
    king: Boolean,
    way: Object
  },
  setup(props) {
    const xarr = computed(() => props.way?.xarr)
    const yarr = computed(() => props.way?.yarr)
    return { xarr, yarr }
  },
});
</script>

<style lang="scss">
.control{
    position: absolute;
    width: calc(3*(600px / 8));
    height: calc(3*(600px / 8));
    background: transparent;
    transition: .1s;
    // overflow: hidden;
    display: flex;
    z-index: 1 !important;
    justify-content: center;
    align-items: center;

    grid-column-start: var(--x);
    grid-column-end: calc(var(--x) + 1);
    grid-row-start: var(--y);
    grid-row-end: calc(var(--y) + 1);
}


.dd,
.dd-atack,
.dm{
    position: absolute;
    overflow: hidden;
    width: 55px;

    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    font-size: 2.8rem;
    color: #bbb;

    transition: .2s;
}

.dm:not(.rb){
    top: calc(75px * var(--ds) + 85px);
    left: calc(75px * var(--ds) + 85px);
}
.dm.rb{
    left: calc(-75px * var(--ds) + 85px);
    bottom: calc(-75px * var(--ds) + 85px);
}

.dm{
    transform: rotate(45deg);
}

.dd-atack{
    display: none;
}

.dd:nth-child(1){
    top: 10px;
    left: 10px;
   transform: rotate(-45deg);
}
.dd:nth-child(2){
    top: 10px;
    right: 10px;
   transform: rotate(45deg);
}
.dd:nth-child(3){
    bottom: 10px;
    left: 10px;
   transform: rotate(-135deg);
}
.dd:nth-child(4){
   bottom: 10px;
   right: 10px;
   transform: rotate(135deg);
}

// .control.h1 .dd:nth-child(1),
// .control.h2 .dd:nth-child(2),
// .control.h3 .dd:nth-child(3),
// .control.h4 .dd:nth-child(4){
//     display: none;
// }

.control.h1 .dd,
.control.h2 .dd,
.control.h3 .dd,
.control.h4 .dd{
    display: none;
}

.control.que-b .dd:nth-child(3),
.control.que-b .dd:nth-child(4),
.control.que-w .dd:nth-child(1),
.control.que-w .dd:nth-child(2){
    display: none;
}

// .control.que-b.noway-a .dd:nth-child(3),
// .control.que-b.noway-b .dd:nth-child(4),
// .control.que-w.noway-a .dd:nth-child(1),
// .control.que-w.noway-b .dd:nth-child(2){
//     display: flex !important;
// }

.control.h1 .dd-atack.d1,
.control.h2 .dd-atack.d2,
.control.h3 .dd-atack.d3,
.control.h4 .dd-atack.d4{
    display: flex;
}

.dd-atack.d1{
    top: -65px;
    left: -65px;
   transform: rotate(-45deg);
}
.dd-atack.d2{
    top: -65px;
    right: -65px;
   transform: rotate(45deg);
}
.dd-atack.d3{
    bottom: -65px;
    left: -65px;
   transform: rotate(-135deg);
}
.dd-atack.d4{
   bottom: -65px;
   right: -65px;
   transform: rotate(135deg);
}

.dd:hover,
.control .dm:hover,
.dd-atack:hover{
    color: #ddd;
}
.dd:active,
.control .dm:active,
.dd-atack:active{
    color: #fff;
}
</style>