<template>
  <!-- Main container for the canvas -->
  <div class="canvas-container">

    <!-- Canvas element where the design will be drawn -->
    <canvas 
      id="main-canvas" 
      width="800" 
      height="600"
      class="design-canvas"
    ></canvas>

    <!-- Loader shown while image is loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading image...</p>
    </div>

    <!-- Error message if image fails to load -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryLoading">Retry</button>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import { fabric } from 'fabric';

//Props passed to this component
const props = defineProps({
  bgImage: String
});

// Emit used to send events to parent
const emit = defineEmits(['canvas-ready']);

const canvas = ref(null);
const loading = ref(false);
const error = ref(null);

onMounted(() => {
  initCanvas();  //Initializing the canvas
});

function initCanvas() {
  canvas.value = new fabric.Canvas('main-canvas', {
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    selectionColor: 'rgba(59, 130, 246, 0.3)',
    selectionBorderColor: '#3b82f6',
    selectionLineWidth: 2,
    controlsAboveOverlay: true
  });
  
  // Add grid overlay
  // addGridOverlay();
  
  
  emit('canvas-ready', canvas.value);     // Emit canvas instance to parent so it can use it
  
  if (props.bgImage) {
    loadImage(props.bgImage);
  }
}
//fucntion for grid overlay
// function addGridOverlay() {
//   const gridSize = 20;
//   const gridColor = 'rgba(0, 0, 0, 0.05)';
  
//   // Create a group for grid lines
//   const gridGroup = new fabric.Group([], {
//     selectable: false,
//     evented: false,
//     hoverCursor: 'default'
//   });

//   // Add vertical lines
//   for (let i = 0; i < canvas.value.width / gridSize; i++) {
//     const line = new fabric.Line([
//       i * gridSize, 0,
//       i * gridSize, canvas.value.height
//     ], {
//       stroke: gridColor,
//       strokeWidth: 1,
//       selectable: false,
//       evented: false
//     });
//     gridGroup.addWithUpdate(line);
//   }

//   // Add horizontal lines
//   for (let i = 0; i < canvas.value.height / gridSize; i++) {
//     const line = new fabric.Line([
//       0, i * gridSize,
//       canvas.value.width, i * gridSize
//     ], {
//       stroke: gridColor,
//       strokeWidth: 1,
//       selectable: false,
//       evented: false
//     });
//     gridGroup.addWithUpdate(line);
//   }

//   // Add the grid to canvas
//   canvas.value.add(gridGroup);
//   canvas.value.sendToBack(gridGroup);
//   canvas.value.requestRenderAll();
// }


// Load image from URL or path and add it to canvas
function loadImage(imagePath) {
  loading.value = true;
  error.value = null;

  const url = imagePath.startsWith('/') ? imagePath : `/images/${imagePath}`;

  fabric.Image.fromURL(url, (img) => {
    try {
      if (!img) throw new Error('Failed to load image');
      if (!canvas.value) throw new Error('Canvas not initialized');

      const padding = 20;
      const canvasWidth = canvas.value.getWidth() - padding * 2;
      const canvasHeight = canvas.value.getHeight() - padding * 2;
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      );
//Image properites
      img.set({
        left: padding + (canvasWidth - img.width * scale) / 2,
        top: padding + (canvasHeight - img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false
      });

      // Clear existing objects except the grid
      const objects = canvas.value.getObjects();
      objects.forEach(obj => {
        if (obj.type !== 'group' || !obj.getObjects().some(o => o.type === 'line')) {
          canvas.value.remove(obj);
        }
      });

      canvas.value.add(img);
      canvas.value.sendToBack(img);
      canvas.value.requestRenderAll();
    } catch (err) {
      error.value = `Error loading image: ${err.message}`;
      console.error('Image loading error:', err);
    } finally {
      loading.value = false;
    }
  }, {
    crossOrigin: 'anonymous',
    errorHandler: (err) => {
      error.value = `Failed to load image: ${err.message}`;
      loading.value = false;
      console.error('Image load error:', err);
    }
  });
}

function retryLoading() {
  if (props.bgImage) {
    loadImage(props.bgImage);
  }
}
// Watch for bgImage prop changes and reload image if updated
watch(() => props.bgImage, (newVal) => {
  if (newVal) {
    loadImage(newVal);
  }
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.design-canvas {
  display: block;
  background-color: white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
  color: #ef4444;
}

.error-message button {
  margin-top: 10px;
  padding: 5px 15px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message button:hover {
  background-color: #2563eb;
}
</style>