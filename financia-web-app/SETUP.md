# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Access the Application
Open your browser and navigate to: `http://localhost:4200`

## 🔧 Backend Configuration

Make sure your backend microservices are running on:
- **IAM Service**: `http://localhost:8010/iam-service/api/v1/users`
- **Customer Service**: `http://localhost:8010/customer-service/api/v1/clients`
- **Product Service**: `http://localhost:8010/product-service/api/v1/products`

## 📋 Features Available

### Authentication
- Sign Up: `/auth/sign-up`
- Sign In: `/auth/sign-in`

### Main Application (Protected Routes)
- Dashboard: `/dashboard`
- Clients: `/clients`
- Create Client: `/clients/create`
- Products: `/products`

## 🎯 Test Flow

1. **Register a new account** at `/auth/sign-up`
2. **Sign in** with your credentials
3. **Create clients** using the client management
4. **Add products** and associate them with clients
5. **Navigate** between sections using the sidebar

## 🛠️ Development Commands

```bash
npm start          # Development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # Code linting
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (< 768px)

## 🔒 Security Features

- JWT token authentication
- Route guards for protected pages
- Form validations
- Error handling and user feedback

## 🎨 UI Components

All components use Angular Material:
- Forms with validation
- Data tables
- Modal dialogs
- Navigation drawer
- Snackbar notifications
- Loading spinners

Enjoy using the Financia Web App! 🎉