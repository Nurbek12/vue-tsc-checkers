<template>
    <div class="stone-wrapper">
      <div class="stone" @click="$emit('smove')" :class="c === 'b' ? 'black' : 'white'">
        <i class="mdi mdi-crown dnk"></i>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Stone',
    props: {
        c: String
    },
    setup(props){
        return props
    }
})
</script>

<style lang="scss">

.stone-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4 !important;
  transition: 0.2s;

  grid-column-start: var(--x);
  grid-column-end: calc(var(--x) + 1);
  grid-row-start: var(--y);
  grid-row-end: calc(var(--y) + 1);
  .dnk{
    display: none;
    font-size: 2.4rem;
  }
  &.damka .dnk{
    display: flex;
  }
  .stone:active {
    transform: scale(0.9);
  }
  .stone {
    position: absolute;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    border-radius: 50%;
    border: 1px solid #0005;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 10px 15px 20px #0005;
    // background-size: cover !important;
  }
  .stone.black {
    color: #eee;
    background: url("@/assets/blackarea.jpg");
    // background: url("@/assets/blackstone.jpg");
  }
  .stone.white {
    // background: url("@/assets/whitearea.jpg");
    color: #333 !important;
    background: url("@/assets/whitestone.jpg");
  }
}

</style>