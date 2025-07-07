<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>Properties</h3>
      <p v-if="!activeObject">Select an object to edit properties</p>
    </div>

    <div v-if="activeObject" class="properties-form">
      <!-- Common Properties -->
      <div class="property-group">
        <h4>Basic Properties</h4>
        <div class="property-row">
          <label>Left Position</label>
          <input type="number" v-model.number="activeObject.left" @input="updateObject">
        </div>
        <div class="property-row">
          <label>Top Position</label>
          <input type="number" v-model.number="activeObject.top" @input="updateObject">
        </div>
        <div class="property-row">
          <label>Angle</label>
          <input type="number" v-model.number="activeObject.angle" @input="updateObject" min="0" max="360">
        </div>
        <div class="property-row">
          <label>Opacity</label>
          <input type="range" v-model.number="activeObject.opacity" @input="updateObject" min="0" max="1" step="0.1">
          <span>{{ (activeObject.opacity * 100).toFixed(0) }}%</span>
        </div>
      </div>

      <!-- Shape-specific Properties -->
      <div v-if="isShape" class="property-group">
        <h4>Shape Properties</h4>
        <div class="property-row">
          <label>Fill Color</label>
          <input type="color" v-model="fillColor" @input="updateFillColor">
        </div>
        <div class="property-row">
          <label>Stroke Color</label>
          <input type="color" v-model="strokeColor" @input="updateStrokeColor">
        </div>
        <div class="property-row">
          <label>Stroke Width</label>
          <input type="number" v-model.number="activeObject.strokeWidth" @input="updateObject" min="0" max="10">
        </div>

        <!-- Rectangle Properties -->
        <div v-if="activeObject.type === 'rect'" class="property-row">
          <label>Width</label>
          <input type="number" v-model.number="activeObject.width" @input="updateObject" min="1">
        </div>
        <div v-if="activeObject.type === 'rect'" class="property-row">
          <label>Height</label>
          <input type="number" v-model.number="activeObject.height" @input="updateObject" min="1">
        </div>
        <div v-if="activeObject.type === 'rect'" class="property-row">
          <label>Corner Radius</label>
          <input type="number" v-model.number="activeObject.rx" @input="updateObject" min="0">
        </div>

        <!-- Circle Properties -->
        <div v-if="activeObject.type === 'circle'" class="property-row">
          <label>Radius</label>
          <input type="number" v-model.number="activeObject.radius" @input="updateObject" min="1">
        </div>

        <!-- Triangle Properties -->
        <div v-if="activeObject.type === 'triangle'" class="property-row">
          <label>Width</label>
          <input type="number" v-model.number="activeObject.width" @input="updateObject" min="1">
        </div>
        <div v-if="activeObject.type === 'triangle'" class="property-row">
          <label>Height</label>
          <input type="number" v-model.number="activeObject.height" @input="updateObject" min="1">
        </div>
      </div>

      <!-- Image-specific Properties -->
      <div v-if="activeObject.type === 'image'" class="property-group">
        <h4>Image Properties</h4>
        <div class="property-row">
          <label>Scale X</label>
          <input type="number" v-model.number="activeObject.scaleX" @input="updateObject" step="0.1" min="0.1">
        </div>
        <div class="property-row">
          <label>Scale Y</label>
          <input type="number" v-model.number="activeObject.scaleY" @input="updateObject" step="0.1" min="0.1">
        </div>
      </div>

      <!-- Shadow Properties -->
      <div class="property-group">
        <h4>Shadow</h4>
        <div class="property-row">
          <label>Shadow Color</label>
          <input type="color" v-model="shadowColorHex" @input="updateShadow">
        </div>
        <div class="property-row">
          <label>Shadow Opacity</label>
          <input type="range" v-model.number="shadowOpacity" @input="updateShadow" min="0" max="1" step="0.1">
          <span>{{ (shadowOpacity * 100).toFixed(0) }}%</span>
        </div>
        <div class="property-row">
          <label>Shadow Blur</label>
          <input type="number" v-model.number="shadowBlur" @input="updateShadow" min="0" max="50">
        </div>
        <div class="property-row">
          <label>Offset X</label>
          <input type="number" v-model.number="shadowOffsetX" @input="updateShadow" min="-50" max="50">
        </div>
        <div class="property-row">
          <label>Offset Y</label>
          <input type="number" v-model.number="shadowOffsetY" @input="updateShadow" min="-50" max="50">
        </div>
      </div>

      <button class="remove-btn" @click="removeObject">Remove Object</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  canvas: {
    type: Object,
    default: null
  }
});

const activeObject = ref(null);
const fillColor = ref('#3b82f6');
const strokeColor = ref('#1e40af');
const shadowColorHex = ref('#000000');
const shadowOpacity = ref(0.1);
const shadowBlur = ref(5);
const shadowOffsetX = ref(5);
const shadowOffsetY = ref(5);

// Check if the object is a shape (rect, circle, triangle)
const isShape = computed(() => {
  return activeObject.value && 
    ['rect', 'circle', 'triangle'].includes(activeObject.value.type);
});

// Watch for canvas updates and bind selection events
watch(() => props.canvas, (newCanvas) => {
  if (newCanvas) {
    newCanvas.on('selection:created', (e) => {
      if (e.selected?.length === 1) {
        updateActiveObject(e.selected[0]);
      }
    });
    
    newCanvas.on('selection:updated', (e) => {
      if (e.selected?.length === 1) {
        updateActiveObject(e.selected[0]);
      }
    });
    
    newCanvas.on('selection:cleared', () => {
      activeObject.value = null;
    });
  }
});

function updateActiveObject(obj) {
  activeObject.value = obj;
  
  // Update color values
  if (obj.fill) {
    fillColor.value = convertToHex(obj.fill);
  }
  if (obj.stroke) {
    strokeColor.value = convertToHex(obj.stroke);
  }
  
  // Update shadow values
  if (obj.shadow) {
    shadowColorHex.value = convertToHex(obj.shadow.color);
    shadowOpacity.value = getAlphaFromColor(obj.shadow.color) || 0.1;
    shadowBlur.value = obj.shadow.blur || 5;
    shadowOffsetX.value = obj.shadow.offsetX || 5;
    shadowOffsetY.value = obj.shadow.offsetY || 5;
  }
}

function convertToHex(color) {
  if (!color) return '#000000';
  if (color.startsWith('#')) return color;
  
  // Handle rgba() format
  if (color.startsWith('rgba(')) {
    const parts = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (parts) {
      const r = parseInt(parts[1]).toString(16).padStart(2, '0');
      const g = parseInt(parts[2]).toString(16).padStart(2, '0');
      const b = parseInt(parts[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  
  // Default fallback
  return '#000000';
}

function getAlphaFromColor(color) {
  if (color.startsWith('rgba(')) {
    const parts = color.match(/rgba\(.*,\s*([\d.]+)\)/);
    if (parts) return parseFloat(parts[1]);
  }
  return 1;
}

function updateObject() {
  if (props.canvas && activeObject.value) {
    activeObject.value.setCoords();
    props.canvas.requestRenderAll();
  }
}

function updateFillColor() {
  if (activeObject.value) {
    activeObject.value.set('fill', fillColor.value);
    updateObject();
  }
}

function updateStrokeColor() {
  if (activeObject.value) {
    activeObject.value.set('stroke', strokeColor.value);
    updateObject();
  }
}

function updateShadow() {
  if (activeObject.value) {
    const shadowColor = hexToRgba(shadowColorHex.value, shadowOpacity.value);
    activeObject.value.set({
      shadow: new fabric.Shadow({
        color: shadowColor,
        blur: shadowBlur.value,
        offsetX: shadowOffsetX.value,
        offsetY: shadowOffsetY.value
      })
    });
    updateObject();
  }
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function removeObject() {
  if (props.canvas && activeObject.value) {
    props.canvas.remove(activeObject.value);
    props.canvas.requestRenderAll();
    activeObject.value = null;
  }
}
</script>

<style scoped>
/* ... (keep your existing styles) ... */
</style>
<style scoped>
.properties-panel {
  width: 280px;
  height: 100%;
  background-color: #ffffff;
  border-left: 1px solid #e1e5eb;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
}

.panel-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e1e5eb;
}

.panel-header h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #1e293b;
}

.panel-header p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.property-group {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e1e5eb;
}

.property-group h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #334155;
}

.property-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.property-row label {
  width: 100px;
  font-size: 13px;
  color: #475569;
}

.property-row input[type="number"],
.property-row input[type="text"],
.property-row select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 13px;
}

.property-row input[type="color"] {
  width: 30px;
  height: 30px;
  padding: 2px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.property-row input[type="range"] {
  flex: 1;
  margin-right: 8px;
}

.property-row span {
  font-size: 12px;
  color: #64748b;
  min-width: 30px;
}

.remove-btn {
  width: 100%;
  padding: 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
}

.remove-btn:hover {
  background-color: #dc2626;
}
</style>