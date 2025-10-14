# 🚀 Inventory Management System

A modern, full-stack inventory management system built with Next.js, featuring AI-powered insights, real-time analytics, and comprehensive product management capabilities.

![Inventory Management System](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication**: JWT-based authentication with NextAuth.js
- **Role-Based Access**: Admin and Staff roles with different permissions
- **Session Management**: Secure session handling and automatic logout
- **Password Security**: Bcrypt hashing for password protection

### 🏠 Dashboard & Analytics
- **Real-time Dashboard**: Live inventory statistics and metrics
- **Interactive Charts**: Visual representation of inventory data
- **Quick Actions**: Fast access to common operations
- **Recent Activity**: Track latest product additions and changes

### 📦 Product Management (CRUD)
- **Add Products**: Comprehensive product creation with validation
- **Edit Products**: Update product details with real-time preview
- **Delete Products**: Safe product removal with confirmation
- **Search & Filter**: Advanced filtering by category, price, and stock
- **SKU Management**: Automatic SKU generation and validation
- **Image Upload**: Cloudinary integration for product images

### 🤖 AI Integration
- **Smart Descriptions**: AI-powered product description generation
- **Inventory Insights**: Intelligent analytics and recommendations
- **Report Generation**: Automated report creation with AI insights
- **Stock Predictions**: AI-driven stock level recommendations

### 📊 Reports & Analytics
- **Comprehensive Reports**: Detailed inventory and sales analytics
- **Low Stock Alerts**: Automatic notifications for low inventory
- **Category Analysis**: Performance metrics by product category
- **Export Functionality**: PDF export for reports and data
- **AI-Enhanced Insights**: Machine learning-powered recommendations

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark/Light Mode**: Theme switching with system preference detection
- **Professional Layout**: Clean, modern design with intuitive navigation
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and state management
- **React Hook Form**: Form handling and validation
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **NextAuth.js**: Authentication and session management
- **Bcrypt**: Password hashing and security

### AI & Cloud Services
- **Google Gemini AI**: Product descriptions and insights
- **Cloudinary**: Image storage and optimization
- **Vercel**: Deployment and hosting

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Cloudinary account (for image uploads)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/inventory-management-system.git
   cd inventory-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/inventory-management

   # NextAuth
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Gemini AI
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
inventory-management-system/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── products/             # Product CRUD operations
│   │   └── dashboard/            # Dashboard statistics
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard
│   ├── products/                 # Product management pages
│   ├── reports/                  # Analytics and reports
│   ├── settings/                 # User settings
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # Context providers
├── components/                   # Reusable UI components
│   └── ui/                       # UI components
├── lib/                          # Utility libraries
│   ├── models/                   # Database models
│   ├── api.ts                    # API client functions
│   └── mongodb.ts                # Database connection
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Database Setup
The system uses MongoDB with Mongoose for data modeling. Key collections:
- **Users**: Authentication and user management
- **Products**: Inventory items with full CRUD operations

### Authentication
NextAuth.js handles authentication with:
- Credentials provider for email/password login
- JWT strategy for session management
- Role-based access control

### AI Integration
Google Gemini AI provides:
- Product description generation
- Inventory insights and recommendations
- Automated report generation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (handled by NextAuth)

### Products
- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

## 🎯 Key Features Walkthrough

### Dashboard
- Real-time inventory statistics
- Recent product additions
- Quick action buttons
- Low stock alerts

### Product Management
- Comprehensive product forms
- Image upload with Cloudinary
- AI-powered description generation
- Advanced search and filtering

### Reports & Analytics
- Category distribution charts
- Top performing products
- Low stock alerts table
- AI-generated insights
- PDF export functionality

### Settings
- User profile management
- Notification preferences
- System configuration
- Security settings

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Role-Based Access**: Admin and staff permission levels

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker
```bash
# Build the Docker image
docker build -t inventory-management .

# Run the container
docker run -p 3000:3000 inventory-management
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Google for the Gemini AI API
- Cloudinary for image management services

## 📞 Support

For support, email support@yourcompany.com or join our Slack channel.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**