# Krishipay Admin Panel

A comprehensive admin panel for managing loan applications for farmers. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- **Authentication**: Phone number + OTP based login (admin users only)
- **Kanban Board**: Drag-and-drop interface for managing loan applications
- **Loan Management**: View detailed loan information and update status
- **Analytics Dashboard**: Comprehensive insights and statistics
- **Farmer-Focused Design**: Clean, modern UI with agricultural theme

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Drag & Drop**: react-beautiful-dnd
- **Icons**: Lucide React

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://ankiitladva_db_user:0ZUygvpFE5cTDpWI@krishipay.taedjoi.mongodb.net/
   JWT_SECRET=your-secret-key-change-in-production
   OTP_SECRET=your-otp-secret-key
   ```

3. **Seed Default Admin User**
   The app includes a default admin user:
   - **Name**: Yashvi Dhar
   - **Phone Number**: +918169025493

   To create this admin user, you can either:
   
   **Option 1: Use the API endpoint** (recommended)
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```
   
   **Option 2: Run the seed script**
   ```bash
   npx ts-node lib/seed-admin.ts
   ```
   
   **Option 3: Manual MongoDB insertion**
   ```javascript
   db.admins.insertOne({
     name: "Yashvi Dhar",
     phoneNumber: "+918169025493",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login
1. Enter your admin phone number
2. Click "Send OTP"
3. In development mode, the OTP will be logged to the console
4. Enter the OTP to login

### Kanban Board
- View all loan applications organized by status
- Drag and drop cards between columns to update loan status
- Click on any card to view full loan details
- Status options:
  - **Under Review**: Default status for new applications
  - **Approved**: Loans that have been approved
  - **Rejected**: Loans that have been rejected
  - **Needs More Information**: Loans requiring additional documentation

### Insights Dashboard
- View comprehensive analytics including:
  - Total loans, approvals, rejections
  - Monthly trends
  - Category breakdown
  - User statistics
  - Risk analysis and fraud prevention metrics

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/[id]` - Get loan by ID
- `PATCH /api/loans/[id]` - Update loan status

### Analytics
- `GET /api/analytics` - Get analytics data

## Database Schema

### Admin
- `name` (String, required)
- `phoneNumber` (String, unique, required)
- `createdAt` (Date)
- `updatedAt` (Date)

**Default Admin User:**
- Name: Yashvi Dhar
- Phone Number: +918169025493

### User
- `phoneNumber` (String, unique, required)
- `kycVerified` (Boolean)
- `voicePrintId` (String)
- `language` (String, default: 'hi')
- `createdAt` (Date)

### LoanApplication
- `userId` (ObjectId, ref: User)
- `loanCategory` (String)
- `status` (Enum: 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Needs More Information')
- `extractedData` (Object)
- `uploadedDocuments` (Array)
- `geoValuation` (Number)
- `voiceConsentRecording` (String)
- `matchedSchemeId` (ObjectId, ref: Scheme)
- `createdAt` (Date)
- `updatedAt` (Date)

### Scheme
- `title` (String)
- `description` (String)
- `benefits` (String)
- `loanType` (String)
- `eligibility` (String)
- `icon` (String)

## Development Notes

- OTP is currently logged to console in development mode
- In production, integrate with a proper SMS service (Twilio, AWS SNS, etc.)
- JWT tokens are stored in localStorage
- All API routes require authentication via Bearer token

## Production Deployment

1. Update environment variables with production values
2. Set up proper OTP service integration
3. Configure secure JWT secret
4. Enable HTTPS
5. Set up proper error logging and monitoring

## License

MIT

