<!-- src/components/WebSocketDialog.vue -->
 <template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="轨迹跟踪"
      width="600px"
      @open="onDialogOpen"
      @close="onDialogClose"
    >
      <div>
        <p>Socket 状态：{{ connected ? '🟢 已连接' : '🔴 未连接' }}</p>
        <el-input v-model="inputMsg" placeholder="输入消息" />
        <el-button type="primary" @click="sendMsg" style="margin-top: 10px">发送</el-button>
      </div>
      <div
        style="max-height: 200px; padding: 10px; margin-top: 20px; overflow-y: auto; background: #f0f0f0"
      >
        <div v-for="(msg, idx) in messages" :key="idx" style="color: red">{{ msg }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWebSocket } from '#/hooks/useWebSocket';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
}>();

const dialogVisible = ref(props.visible);

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
  },
);

watch(dialogVisible, (val) => {
  emit('update:visible', val);
});

const inputMsg = ref('');
const { connected, messages, connect, disconnect, sendMessage } = useWebSocket(
  'ws://localhost:3000',
);

function onDialogOpen() {
  connect();
}

function onDialogClose() {
  disconnect();
}

function sendMsg() {
  if (inputMsg.value.trim()) {
    sendMessage(inputMsg.value);
    inputMsg.value = '';
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 20px;
}
</style>
