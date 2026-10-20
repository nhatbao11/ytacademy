import express from 'express'
import cors from 'cors'
import { ENV } from './config/env'
import routes from './routes'

export const createApp = (): express.Application => {
  const app = express()

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Cho phép các request không có origin (ví dụ curl, mobile app) hoặc nằm trong danh sách CLIENT_URLS
        if (!origin || ENV.CLIENT_URLS.includes(origin) || ENV.NODE_ENV === 'development') {
          callback(null, true)
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`))
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // Body parsers
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Mount API V1 routes
  app.use('/api/v1', routes)

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại trên hệ thống API của YT Academy.`,
    })
  })

  return app
}
