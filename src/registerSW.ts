import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to user asking to reload the app due to app update
    if (confirm('New content available, reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    // Show a ready to work offline to user
    console.log('App ready to work offline')
    
    // You can show a toast notification here
    const toast = document.createElement('div')
    toast.innerHTML = '🚀 App is ready to work offline!'
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `
    document.body.appendChild(toast)
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  },
  onRegisterError(error: any) {
    console.log('SW registration error', error)
  },
})

export { updateSW }