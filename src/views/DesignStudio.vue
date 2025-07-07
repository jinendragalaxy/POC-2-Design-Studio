<template>
  <!-- Main Container -->
  <div class="design-studio">
     <!-- Left panel for tools -->
    <div class="left">
      <Toolbar 
        @add-rectangle="handleAddRectangle"
        @add-circle="handleAddCircle"
        @add-triangle="handleAddTriangle"
        @add-image="handleAddImage"
      />
    </div>
    <!-- Center panel with canvas -->
    <div class="center">
      <div class="canvas-header">
        <h2>Customize Your Design</h2>
        <p>Add elements using the toolbar on the left</p>
      </div>
       <!-- The canvas designer component -->
      <div class="canvas-wrapper">
        <CanvasDesigner 
          :bgImage="bgImage" 
          @canvas-ready="handleCanvasReady"
        /> <!-- triggers when canvas is initialized -->
      </div>
    </div>
       <!-- Right panel to show and edit selected object properties -->
    <div class="right">
      <PropertiesPanel :canvas="canvas" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Toolbar from '../components/Toolbar.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue';
import CanvasDesigner from '../components/CanvasDesigner.vue';
import { fabric } from 'fabric';

//Get the current route
const route = useRoute();

// Compute the background image from the query params
const bgImage = computed(() => route.query.image || '');

//Storing canvas Instance
const canvas = ref(null);

const handleCanvasReady = (canvasInstance) => {
  canvas.value = canvasInstance;
  
  // Add event listeners for property panel updates
  canvas.value.on('selection:created', (e) => {
    if (e.selected && e.selected.length === 1) {
      // Single object selected
      canvas.value.fire('object:selected', e.selected[0]);
    }
  });
   // Event: when an object is selected
  canvas.value.on('selection:updated', (e) => {
    if (e.selected && e.selected.length === 1) {
      // Single object selected
      canvas.value.fire('object:selected', e.selected[0]);
    }
  });
  
  canvas.value.on('selection:cleared', () => {
    canvas.value.fire('object:deselected');
  });
  
  canvas.value.on('object:modified', (e) => {
    if (e.target) {
      canvas.value.fire('object:modified', e.target);
    }
  });
};


//Add Rectangle
const handleAddRectangle = () => {
  if (!canvas.value) return;
  
  const rect = new fabric.Rect({
    width: 100,
    height: 80,
    fill: '#3b82f6',
    left: 50,
    top: 50,
    selectable: true,
    stroke: '#1e40af',
    strokeWidth: 2,
    rx: 5,
    ry: 5,
    shadow: new fabric.Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 5,
      offsetX: 5,
      offsetY: 5
    })
  });
  canvas.value.add(rect);
  canvas.value.setActiveObject(rect);
  canvas.value.requestRenderAll();
};

//Add Circle
const handleAddCircle = () => {
  if (!canvas.value) return;
  
  const circle = new fabric.Circle({
    radius: 40,
    fill: '#10b981',
    left: 50,
    top: 50,
    selectable: true,
    stroke: '#047857',
    strokeWidth: 2,
    shadow: new fabric.Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 5,
      offsetX: 5,
      offsetY: 5
    })
  });
  canvas.value.add(circle);
  canvas.value.setActiveObject(circle);
  canvas.value.requestRenderAll();
};

//Add Triangle
const handleAddTriangle = () => {
  if (!canvas.value) return;
  
  const triangle = new fabric.Triangle({
    width: 80,
    height: 80,
    fill: '#f59e0b',
    left: 50,
    top: 50,
    selectable: true,
    stroke: '#b45309',
    strokeWidth: 2,
    shadow: new fabric.Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 5,
      offsetX: 5,
      offsetY: 5
    })
  });
  canvas.value.add(triangle);
  canvas.value.setActiveObject(triangle);
  canvas.value.requestRenderAll();
};

//Add Images
const handleAddImage = (imageData) => {
  if (!canvas.value) return;
  
  fabric.Image.fromURL(imageData, (img) => {
    img.set({
      left: 50,
      top: 50,
      scaleX: 0.5,
      scaleY: 0.5,
      selectable: true,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.1)',
        blur: 5,
        offsetX: 5,
        offsetY: 5
      }),
      borderColor: '#3b82f6',
      cornerColor: '#3b82f6',
      cornerSize: 10,
      transparentCorners: false
    });
    canvas.value.add(img);
    canvas.value.setActiveObject(img);
    canvas.value.requestRenderAll();
  });
};
</script>

<style scoped>
.design-studio {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.left {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e1e5eb;
  overflow-y: auto;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

.canvas-header {
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e1e5eb;
}

.canvas-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 24px;
}

.canvas-header p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 14px;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
}

.right {
  width: 280px;
  background-color: #ffffff;
  border-left: 1px solid #e1e5eb;
  overflow-y: auto;
}
</style>