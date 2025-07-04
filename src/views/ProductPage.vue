<template>
  <div class="product-page">
    <h1 class="title">Choose Your Product</h1>

    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img
          :src="getImageUrl(product.image)"
          alt="Product Image"
          class="product-image"
        />
        <button class="customize-btn" @click="customizeProduct(product.id)">
          Customize
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import products from '@/data/products.json'

const router = useRouter()

const getImageUrl = (filename) => `/images/${filename}` 

// const getImageUrl = (filename) => {
//   return new URL(`../assets/${filename}`, import.meta.url).href
// }


const customizeProduct = (productId) => {
  const product = products.find(p => p.id === productId)
  if (product) {
    router.push({
      name: 'DesignStudio',
      query: {
        id: product.id,
        image: product.image
      }
    })
  }
}

</script>

<style scoped>
.product-page {
  padding: 30px;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: sans-serif;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 15px;
}

.customize-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.customize-btn:hover {
  background-color: #0056b3;
}
</style>
