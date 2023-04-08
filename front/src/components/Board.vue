<template>
    <div class="board">
        <div v-for="i in 64" :key="i" class="bord" :class="Math.floor((i - 1)/8) % 2 === i % 2 ?'black':'white'">
        <!-- {{ (i)%8 }}-{{ Math.floor((i)/8) }} -->
        <!-- {{ ((i-1) -18 + 24)%8 }} -->
        <!-- {{ ((i-1) -14 + 24)%8 }} -->
        <!-- {{ ((i-1) + 14 + 24)%8 }} -->
        <!-- {{ ((i-1) + 18 + 24)%8 }}-{{ (i-1)%8 }}-{{ Math.floor((i-1)/8) }} -->
        <!-- {{ i-1 }} -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    return {}
  },
});
</script>

<style lang="scss">
.board{
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
}
.board .bord{
    position: relative;
}
.bord.black{
    color: #fff;
    // background: url('@/assets/blackarea.jpg');
}
// .bord.white{
//     background: url('@/assets/whitearea.jpg');
// }
</style>