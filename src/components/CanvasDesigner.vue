<template>
  <canvas id="main-canvas" width="1000" height="700"></canvas>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { fabric } from 'fabric'

const props = defineProps({
  bgImage: {
    type: String,
    default: ''
  }
})

let canvas = null

function addImageToCanvas(url) {
  console.log('Trying to load image from:', url)

  fabric.Image.fromURL(url, (img) => {
    if (!img) {
      console.error('Failed to load image from Fabric:', url)
      return
    }

    if (!canvas) {
      console.error('Canvas not initialized')
      return
    }
    const padding = 20;
    const canvasWidth = canvas.getWidth() - padding * 2
    const canvasHeight = canvas.getHeight() - padding * 2
    const imgWidth = img.width
    const imgHeight = img.height

    const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)

    img.set({
      left: (canvasWidth - imgWidth * scale) / 2 + 20,  
      top: (canvasHeight - imgHeight * scale) / 2 + 40,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false
    })

    canvas.clear()
    canvas.add(img)
    canvas.sendToBack(img)
    canvas.requestRenderAll()

    console.log('Image successfully added to canvas')
  }, { crossOrigin: 'anonymous' })
}

watch(
  () => props.bgImage,
  (newVal) => {
    if (newVal) {
      const url = `/images/${newVal}`
      addImageToCanvas(url)
    } else {
      console.warn('No bgImage provided')
    }
  },
  { immediate: true }
)

onMounted(() => {
  console.log('Initializing canvas...')
  canvas = new fabric.Canvas('main-canvas')
  canvas.backgroundColor = 'lightgray'
  canvas.requestRenderAll()
})
</script>

<style scoped>
canvas {
  border: 2px solid #999;
  display: block;
  margin: 2rem auto;
  background: #f9f9f9;
}
</style>
