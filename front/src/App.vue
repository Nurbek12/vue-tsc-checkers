<template>
  <div class="queue">
    <div class="stone" :class="queue">
      <i class="mdi mdi-camera-control"></i>
    </div>
    <div class="stone" :class="gamemode">
      <i v-if="gamemode" class="mdi mdi-account"></i>
      <i v-else class="mdi mdi-account-multiple"></i>
    </div>
  </div>
  <div class="checker-wrapper rotating">
    <!-- <Board /> -->
    <div class="game">
      <transition name="move">
        <Move :cs="cs" v-if="cs > 0" :style=" `--x: ${xy(cs).x}; --y: ${xy(cs).y};`"
          @move="(n) => move(cs + n)" @atack="atack" :class="moveClass" 
          :king="moveClass.includes('damkamove')" @moveD="moveD" :way="moveClass.includes('damkamove') ? createKingWay(cs) : {}" />
      </transition>
      <transition-group name="list" key="i" mode="out-in">
        <div class="stone-cont" v-for="(g, ind) in game" :key="'item-'+g.i" >
          <Stone v-if="['w', 'b'].includes(g.c!)" :c="g.c" @smove="setmovexy(ind)" :class="g.d&&'damka'">
          </Stone>
        </div>
      </transition-group>
    </div>
    <Start @start="startGame" v-if="!start" :rooms="rooms">
      <ul class="game-list">
        <li v-for="(r, i) in rooms" :key="i">
          {{ i+1 }}. {{ r.id }}
          <button @click="socketCommand.joinRoom(r.id)">join</button>
        </li>
      </ul>
    </Start>
  </div>
</template>
  
<script lang="ts">
import { defineComponent,  Ref, ref, reactive, computed } from "vue";
// import Board from "@/components/Board.vue";
import Stone from "./components/Stone.vue";
import Move from "@/components/Move.vue";
import Start from '@/components/Start.vue';
import fields from "@/fields"
import Socket from 'socket.io-client'

interface Field {
  c: string,
  i: number,
  d?: boolean | undefined
}

interface Game {
  black: string,
  white: string,
  id: string,
  name?: string
}

interface GameMode {
  myid: string,
  gameid: string
}

export default defineComponent({
  name: "App",
  setup() {
    const io = Socket('/')
    // const queue: Ref<string> = ref(Math.random()*1 > 0.5 ? 'w' : 'b');
    const queue: Ref<string> = ref('w');
    const gamemode: Ref<string | null> = ref('w');
    const gamename: GameMode = reactive({
      gameid: '',
      myid: ''
    });
    const start: Ref<boolean> = ref(false)
    const rooms: Game[] = reactive([])
    const cs: Ref<number> = ref(-1);
    const game = reactive<Field[]>(fields);
    const move = (i: number, ac?: boolean) => {
      if(gamemode.value !== null){
        socketCommand.movePiece(i, cs.value, ac!);
        cs.value = -1;
      }else{
        [game[i], game[cs.value]] = [game[cs.value], game[i]]
        if(!ac) changeQueue()
        checkDamka(i);
      }
    }
    const setmovexy = (i: number) => {
      if(queue.value !== game[i].c || (gamemode.value && gamemode.value != queue.value)) return
      if (cs.value === i) cs.value = -1;
      else cs.value = i;
    }
    const checkAtack = computed(() => {
      return [-9,-7,7,9].map((check, index) => {        
        if(
          !( cs.value%8 === 6 && (cs.value + 2*check + 24)%8 === 0 ) && 
          !( cs.value%8 === 1 && (cs.value + 2*check + 24)%8 === 7 ) &&
          !['v','n'].includes(game[cs.value]?.c) &&
          !['v','n'].includes(game[cs.value + check]?.c) &&
          ['v','n'].includes(game[cs.value + 2*check]?.c) &&
          (game[cs.value].c !== game[cs.value + check]?.c)) 
          return `h${index+1}`
        else return
      })
    })
    const checkFunc = (i: number, q: number) => 
      [-9,-7,7,9].map((check: number) => {        
        if(
          !((i + 2*check + 24)%8 === 0 && i%8 === 6 ) &&
          !((i + 2*check + 24)%8 === 7 && i%8 === 1 ) &&
          !['v', 'n'].includes(game[i + check]?.c) &&
          ['v', 'n'].includes(game[i + 2*check]?.c) &&
          game[q].c !== game[i + check]?.c)
          return true
        else return false
      }).includes(true)
    const atack = (p: number) => {
      if(gamemode.value !== null){
        socketCommand.atackPiece(cs.value, p);
      }else{
        game[cs.value + p/2].c = 'v'
        move(cs.value + p, checkFunc(cs.value + p, cs.value))
      }
      cs.value = -1;
    }
    const changeQueue = () => queue.value = queue.value === 'w' ? 'b' : 'w';
    const xy = (n: number) => {
      let x = n % 8;
      let y = Math.floor(n/8)
      return { x, y }
    }

    // damka
    const checkDamka = (i: number) => {
      if(
        game[i].c === 'b' && i < 8 ||
        game[i].c === 'w' && i > 55
      ) 
        game[i].d = true
    }
    const createKingWay = (v: number): { xarr: number[], yarr: number[]} => {
      const xarr: number[] = []
      const yarr: number[] = []
      let xtcomplete = false;
      let xbcomplete = false;
      let ytcomplete = false;
      let ybcomplete = false;
      for(let j = 1, i = -1; j <=8; j++, i--){
        if(
          v + j*7 > 64 ||
          game[v + j*7]?.c === queue.value ||
          (![v, 'v','n'].includes(game[v + j*7]?.c)&&
          game[v + j*7]?.c === game[v + (j+1)*7]?.c)
        ) xbcomplete = true
        if(!xbcomplete && game[v + j*7]?.c === 'v')
          xarr.unshift(j*7)
        
        if(
          v + i*7 < 0 ||
          game[v + i*7]?.c === queue.value ||
          (![queue.value, 'v','n'].includes(game[v + i*7]?.c)&&
          game[v + i*7]?.c === game[v + (i+1)*7]?.c)
        ) xtcomplete = true
        if(!xtcomplete && game[v + i*7]?.c === 'v')
          xarr.push(i*7)


        // y

        if(
          v + j*9 > 64 ||
          game[v + j*9]?.c === queue.value ||
          (![queue.value, 'v','n'].includes(game[v + j*9]?.c)&&
          game[v + j*9]?.c === game[v + (j+1)*9]?.c)
        ) ybcomplete = true
        if(!ybcomplete && game[v + j*9]?.c === 'v')
          yarr.unshift(j*9)
        
        if(
          v + i*9 < 0 ||
          game[v + i*9]?.c === queue.value ||
          (![v, 'v','n'].includes(game[v + i*9]?.c)&&
          game[v + i*9]?.c === game[v + (i+1)*9]?.c)
        ) ytcomplete = true
        if(!ytcomplete && game[v + i*9]?.c === 'v')
          yarr.push(i*9)
      }
      
      return { xarr, yarr }
    }
    const checkAtackForKing = (a: number) => {
      const q = queue.value === 'w' ? 'b' : 'w';
      for(let i=1, j=-1; i<=8;i++,j--){
        if(
          !((a + 7*i + 24)%8 === 0 && a%8 === 6 ) &&
          !((a + 7*i + 24)%8 === 7 && a%8 === 1 ) &&
          game[a + 7*i]?.c === q &&
          game[a + 7*(i+1)]?.c === 'v'
        ) return true
        if( 
          !((a + 7*j + 24)%8 === 0 && a%8 === 6 ) &&
          !((a + 7*j + 24)%8 === 7 && a%8 === 1 ) &&
          game[a + 7*j]?.c === q &&
          game[a + 7*(j-1)]?.c === 'v'
        ) return true
        if(
          !((a + 9*i + 24)%8 === 0 && a%8 === 6 ) &&
          !((a + 9*i + 24)%8 === 7 && a%8 === 1 ) &&
          game[a + 9*i]?.c === q &&
          game[a + 9*(i+1)]?.c === 'v'
        ) return true
        if( 
          !((a + 9*j + 24)%8 === 0 && a%8 === 6 ) &&
          !((a + 9*j + 24)%8 === 7 && a%8 === 1 ) &&
          game[a + 9*j]?.c === q &&
          game[a + 9*(j-1)]?.c === 'v'
        ) return true
      }
      // console.log(false);
      return false 
    }
    const checkKilled = (a: number, b: number): boolean => {
      const k: number = Math.abs(b) % 7 === 0 ? 7 : 9;
      const p: number = Math.floor(b / k)
      const m: number = b>0?1:-1;
      let l = false;
      
      for(let i=1;i<Math.abs(p);i++){
        if(!['v','n'].includes(game[a+i*k*m].c) && game[a+i*k*m].c !== queue.value) {
          game[a+i*k*m].c = 'v'
          l = true;
        }
      }
      return l
    }
    const moveD = (i: number) => {
      if(gamemode.value !== null){
        socketCommand.moveKing(i, cs.value);
      }else{
        [game[cs.value+i], game[cs.value]] = [game[cs.value], game[cs.value+i]]
        
        const killed = checkKilled(cs.value, i);
        const haskill = !checkAtackForKing(cs.value+i)
        if(!killed || (killed && haskill)) changeQueue()
      }
      cs.value = -1;
    }

    
    class socketCommand {
      static movePiece = (i: number, c: number, a: boolean) => io.emit('move', i, c, gamename.gameid, a)
      static atackPiece = (i: number, c: number) => io.emit('atack', i, c, gamename.gameid)
      static moveKing = (i: number, c: number) => io.emit('move-d', i, c, gamename.gameid)
      
      static moveDSocket = (i: number, c: number) => {
        [game[c+i], game[c]] = [game[c], game[c+i]]
        const killed = checkKilled(c, i);
        const haskill = !checkAtackForKing(c+i)
        if(!killed || (killed && haskill)) changeQueue()
      }
      static moveS = (i: number, c: number, a?: boolean) => {
        [game[i], game[c]] = [game[c], game[i]]
        if(!a) changeQueue()
        checkDamka(i);
      }
      static atackS = (c: number, p: number) => {
        game[c + p/2].c = 'v'
        this.moveS(c + p, c, checkFunc(c + p, c))
      }

      static joinRoom = (id: string) => {
        io.emit('join-room', id)
        start.value = true
      }
    }
    const startGame = (online: boolean) => {
      start.value = true
      if(online){
        io.emit('create-room')
      }else{
        gamemode.value = null;
      }
    }
    const moveClass = computed(() => {
      return [xy(cs.value).x === 0 && 
        'xm', xy(cs.value).y === 0 && 
        'ym', ...checkAtack.value, `que-${queue.value}`,
        game[cs.value]?.d && 'damkamove']
    })
    
    
    io
      .on('send-room', (data: Game[]) => {
        rooms.length = 0
        rooms.push(...data)
      })
      .on('get-created-room', (data: Game) => {
        gamename.gameid = data.id
        if(gamename.myid === data.black) gamemode.value = 'b'
        if(gamename.myid === data.white) gamemode.value = 'w'
      })
      .on('send-my-id', (id: string) => gamename.myid = id)
      .on('movement', (i: number, p: number, a: boolean) => socketCommand.moveS(i, p, a))
      .on('movement-d', (i: number, p: number) => socketCommand.moveDSocket(i, p))
      .on('atacked', (i: number, p: number) => socketCommand.atackS(i, p))

    return { game, move, setmovexy, queue, moveD,
        cs, xy, checkAtack, atack, 
        moveClass, createKingWay, socketCommand,
        start, startGame, rooms, gamemode};
  },
  components: {
    // Board,
    Stone,
    Move,
    Start,
  }
});
</script>
  
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
  -webkit-tap-highlight-color: transparent;
}
body {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(35deg, #1b3f0d,#52c234);
}
.checker-wrapper {
  position: relative;
  width: 600px;
  height: 600px;
  background: url('@/assets/checker-board-15716251.jpg');
  background-size: cover;
  box-shadow: 0 0 25px rgb(19, 21, 23);
  overflow: hidden;
  z-index: 2;
}

.game {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
}

.move-enter-active,
.move-leave-active {
  transition: all 0.2s ease;
}

.move-enter-from,
.move-leave-to {
  opacity: 0;
}

.list-move {
  transition: 0.3s;
}

.xm{
  transform: translateX(-75px);
}
.ym{
  transform: translateY(-75px);
}
.queue{
  position: absolute;
  top: 0;
  left: 0;
  // background: #083f11;
  // border-bottom-right-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
  .stone{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    box-shadow: 0 5px 15px rgba(11, 18, 34, 0.814);
    &.b {
      color: #eee;
      background: url("@/assets/blackarea.jpg");
    }
    &.w {
      color: #333;
      background: url("@/assets/whitestone.jpg");
    }
  }
}
</style>