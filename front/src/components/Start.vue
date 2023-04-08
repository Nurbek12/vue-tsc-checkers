<template>
  <div class="start">
    <div class="modal">
      <h1 class="title">Онлайн шашки</h1>
      <slot></slot>
      <div class="btn-wrapper">
        <button @click="$emit('start',true)">Create Online</button>
        <button @click="$emit('start',false)">Начать игру</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

interface Game {
  black?: string;
  white?: string;
  id: string;
  name?: string;
}

export default defineComponent({
  props: {
    rooms: Array
  },
  setup() {
    return {}
  },
});
</script>

<style lang="scss">
.start {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #121212aa;
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    position: relative;
    width: 400px;
    // height: 500px;
    background: linear-gradient(76deg, #1c4b0b,#52c234);
    // background: linear-gradient(76deg, #ff0f7b, #f89b29);
    border-radius: 10px;
    box-shadow: 5px 15px 25px rgba(0, 0, 0, 0.4);
    padding: 20px;
    .title{
        text-align: center;
        color: #eee;
        margin-bottom: 10px;
    }
    .game-list {
      width: 100%;
      height: 350px;
      background: #160638da;
      border-radius: 4px;
      overflow: auto;
      padding: 5px 10px;
      box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.4);
      li{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        margin: 5px 0;
        padding: 5px 10px;
        border-radius: 6px;
        background: linear-gradient(26deg, #1b3f0d,#52c234);
        font-size: .9rem;
        transition: .3s;
        color: #efefef;
        &:active{
            transform: scale(.98);
        }
        button{
            background: #160638da;
            padding: 3px 12px;
            color: #efefef;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
        }
      }
    }
    .btn-wrapper{
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        button{
            padding: 9px 13px;
            cursor: pointer;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            background: #160638da;
            transition: .3s;
            box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
            color: #efefef;
            user-select: none;
            width: 100%;
            &:active{
                transform: scale(.95);
                box-shadow: 3px 5px 25px rgba(0, 0, 0, 0.2);
            }
        }
    }
  }
}
::-webkit-scrollbar {
  width: 8px;
  background: none;
}
::-webkit-scrollbar-thumb {
  background: #fff7;
  border-radius: 5px;
}
</style>