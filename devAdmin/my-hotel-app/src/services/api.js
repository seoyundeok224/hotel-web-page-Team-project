// 간단한 API 모듈
const API_BASE_URL = 'http://localhost:8080/api'

const api = {
    get: async (url) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`)
            return await response.json()
        } catch (error) {
            console.error('API GET Error:', error)
            throw error
        }
    },

    post: async (url, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (error) {
            console.error('API POST Error:', error)
            throw error
        }
    },

    put: async (url, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (error) {
            console.error('API PUT Error:', error)
            throw error
        }
    },

    delete: async (url) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: 'DELETE'
            })
            return await response.json()
        } catch (error) {
            console.error('API DELETE Error:', error)
            throw error
        }
    }
}

export default api
