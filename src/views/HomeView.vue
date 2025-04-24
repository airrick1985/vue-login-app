<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title class="text-h5">歡迎使用系統</v-card-title>
            <v-card-subtitle>您好，{{ username }}</v-card-subtitle>
            <v-card-text>
              <p>這是首頁，您已成功登入。</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="logout">登出</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { User } from '../types'
  
  export default defineComponent({
    name: 'HomeView',
    setup() {
      const router = useRouter()
      const username = ref('')
  
      onMounted(() => {
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr) as User
            username.value = user.name || '訪客'
          } else {
            username.value = '訪客'
          }
        } catch (error) {
          console.error('獲取用戶資料時發生錯誤:', error)
          username.value = '訪客'
        }
      })
  
      const logout = (): void => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        router.push('/')
      }
  
      return {
        username,
        logout
      }
    }
  })
  </script>