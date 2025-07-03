<template>
  <div class="design-studio">
    <div class="left"><Toolbar /></div>
    <div class="center">
      <CanvasDesigner :bgImage="bgImage" />
    </div>
    <div class="right"><PropertiesPanel /></div>
  </div>
</template>

<script>
import Toolbar from '../components/Toolbar.vue'
import PropertiesPanel from '../components/PropertiesPanel.vue'
import CanvasDesigner from '../components/CanvasDesigner.vue'

export default {
  components: { Toolbar, PropertiesPanel, CanvasDesigner },
  computed: {
    bgImage() {
      // Directly use the image URL from route query
      return this.$route.query.image || '';
    }
  }
}
</script>
<style scoped>
.design-studio {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.left {
  width: 200px;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
}

.center {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.right {
  width: 250px;
  background-color: #f7f7f7;
  border-left: 1px solid #ccc;
}
</style>