// hooks/useWebSocket.ts
import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

export function useWebSocket(url: string) {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);
  const messages = ref<string[]>([]);

  function connect() {
    if (socket.value) return;
    socket.value = io(url);
    socket.value.on('connect', () => (connected.value = true));
    socket.value.on('disconnect', () => (connected.value = false));
    socket.value.on('message', (msg) => messages.value.push(msg));
  }

  function disconnect() {
    socket.value?.disconnect();
    socket.value = null;
    connected.value = false;
  }

  function sendMessage(msg: string) {
    if (socket.value?.connected) {
      socket.value.emit('message', msg);
    }
  }

  onUnmounted(disconnect);

  return { connected, messages, connect, disconnect, sendMessage };
}
