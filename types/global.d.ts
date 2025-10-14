import mongoose from 'mongoose'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'admin' | 'staff'
    } & DefaultSession['user']
  }

  interface User {
    role: 'admin' | 'staff'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'staff'
  }
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export type UserRole = 'admin' | 'staff'

export interface User {
  _id: string
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id: string
  id: string
  name: string
  category: string
  quantity: number
  price: number
  description?: string
  imageUrl?: string
  lowStockThreshold: number
  sku: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export {}