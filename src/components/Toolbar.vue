<template>
  <div class="design-toolbar">
    <div class="toolbar-header">
      <h3 class="toolbar-title">Design Tools</h3>
    </div>
    
    <div class="toolbar-section">
      <h4 class="section-title">Shapes</h4>
      <button 
        class="tool-button"
        @click="addRectangle"
      >
        <span class="tool-icon">◼</span> Rectangle
      </button>
      <button 
        class="tool-button"
        @click="addCircle"
      >
        <span class="tool-icon">⬤</span> Circle
      </button>
      <button 
        class="tool-button"
        @click="addTriangle"
      >
        <span class="tool-icon">▲</span> Triangle
      </button>
    </div>
    
    <div class="toolbar-section">
      <h4 class="section-title">Images</h4>
      <button 
        class="tool-button"
        @click="triggerImageUpload"
      >
        <span class="tool-icon">🖼️</span> Add Image
      </button>
      <input 
        type="file" 
        ref="imageInput"
        accept="image/*"
        @change="handleImageUpload"
        style="display: none"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits([
  'add-rectangle',
  'add-circle',
  'add-triangle',
  'add-image'
]);

const imageInput = ref(null);

const addRectangle = () => {
  emit('add-rectangle');
};

const addCircle = () => {
  emit('add-circle');
};

const addTriangle = () => {
  emit('add-triangle');
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    emit('add-image', event.target.result);
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.design-toolbar {
  padding: 15px;
  height: 100%;
}

.toolbar-header {
  margin-bottom: 20px;
}

.toolbar-title {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.toolbar-section {
  margin-bottom: 25px;
}

.section-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tool-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.tool-button:active {
  transform: translateY(0);
}

.tool-icon {
  margin-right: 8px;
  font-size: 16px;
}
</style>