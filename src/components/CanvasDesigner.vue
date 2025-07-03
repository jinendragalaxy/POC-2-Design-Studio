<template>
  <div>
    <h1 class="title">Design Studio</h1>
    <div class="canvas-wrapper">
      <canvas id="main-canvas" width="800" height="600"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { Canvas } from 'fabric'

export default {
  name: 'CanvasDesigner',
  setup() {
    onMounted(() => {
      const canvas = new Canvas('main-canvas', {
        backgroundColor: '#ffffff',
        selection: true,
      })

      window.fabricCanvas = canvas
      console.log('Canvas initialized:', canvas)
    })
  },
}
</script>

<style scoped>
.title {
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

canvas {
  border: 2px solid #000;
  background-color: #ffffff;
}
</style>
