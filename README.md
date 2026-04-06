
# NextHire Job Portal

## Overview
NextHire is a comprehensive job portal application that connects job seekers with employers. The platform allows recruiters to post job opportunities and manage applications, while job seekers can search for positions, apply to jobs, and receive personalized recommendations based on their profile.

## Live Demo
- [Frontend](https://nexthire.raorajan.pro/)
- [Backend](https://nexthireapi.raorajan.pro/)
- [API Documentation](https://nexthire.raorajan.pro/api-docs/)

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router v7
- **UI Components**: Radix UI, Tailwind CSS
- **HTTP Client**: Axios
- **Authentication**: Firebase
- **Notifications**: React Toastify, Sonner
- **Animation**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **File Upload**: Cloudinary, express-fileupload
- **Email Service**: Nodemailer
- **Documentation**: Swagger
- **AI Integration**: OpenAI, Google Generative AI

## Features
- **User Authentication**: Secure registration and login for both recruiters and job seekers
- **Job Management**: Post, search, filter, and apply for jobs
- **Company Profiles**: Create and manage company information
- **Application Tracking**: Monitor application status and updates
- **Email Notifications**: Receive alerts for job matches, application status changes
- **Advanced Filtering**: Filter jobs by salary, job type, and location
- **AI-Powered Recommendations**: Personalized job suggestions based on user profiles
- **Document Parsing**: Extract key information from user documents
- **Responsive Design**: Optimized for all device sizes

## Project Structure

### Backend Structure
```
server/
├─ src/
   ├─ config/
   │  └─ db.js
   ├─ models/
   │  ├─ application.model.js
   │  ├─ company.model.js
   │  ├─ job.model.js
   │  └─ user.model.js
   ├─ controllers/
   │  ├─ application.controller.js
   │  ├─ company.controller.js
   │  ├─ job.controller.js
   │  └─ user.controller.js
   ├─ routes/
   │  ├─ application.route.js
   │  ├─ company.route.js
   │  ├─ job.route.js
   │  └─ user.route.js
   ├─ services/
   │  └─ openai.services.js
   ├─ utils/
   │  ├─ errorHandler.js
   │  ├─ sendEmail.route.js
   │  └─ sendToken.route.js
   ├─ app.js
   └─ server.js
```

### Frontend Structure
```
client/
├─ public/
│  ├─ NexthireLogo.png
│  └─ other assets
├─ src/
   ├─ components/
   │  ├─ admin/
   │  ├─ auth/
   │  │  ├─ Login.jsx
   │  │  └─ Register.jsx
   │  ├─ shared/
   │  │  ├─ Navbar.jsx
   │  │  ├─ Footer.jsx
   │  │  └─ Loader.jsx
   │  └─ ui/
   │     └─ Modal.jsx
   ├─ lib/
   ├─ redux/
   │  ├─ store.js
   │  └─ slices/
   │     ├─ authSlice.js
   │     └─ jobSlice.js
   ├─ services/
   │  ├─ api.js
   │  └─ jobService.js
   └─ utils/
      ├─ constants.js
      └─ helpers.js
   ├─ App.jsx
   └─ main.jsx
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/Next_Hire_Job_Portal.git

# Navigate to server directory
cd Next_Hire_Job_Portal/server

# Install dependencies
npm install

# Create .env file with the following variables
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.vvtoxbl.mongodb.net/JobPortal?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
OPENAI_API_KEY=your_openai_api_key

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to client directory
cd Next_Hire_Job_Portal/client

# Install dependencies
npm install

# Create .env file with the following variables
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Start the development server
npm run dev
```

## API Endpoints

### User Management
- `POST /api/v1/user/register`: Register a new user
- `POST /api/v1/user/login`: Login a user
- `GET /api/v1/user/logout`: Logout a user
- `PUT /api/v1/user/profile/update`: Update user profile
- `GET /api/v1/user/search-history`: Get user's search history
- `DELETE /api/v1/user/search-history/clear`: Clear user's search history
- `GET /api/v1/user/recommended-jobs`: Get recommended jobs for the user
- `GET /api/v1/user/search`: Get search results based on query
- `POST /api/v1/user/verify-email`: Verify user email
- `POST /api/v1/user/read-content`: Extract key information from a user's documents

### Job Management
- `POST /api/v1/job/post`: Post a new job
- `GET /api/v1/job/get`: Get all jobs
- `GET /api/v1/job/getadminjobs`: Get admin jobs
- `GET /api/v1/job/get/:id`: Get job by ID
- `DELETE /api/v1/job/delete/:id`: Delete a job
- `GET /api/v1/job/:id/similar`: Get similar jobs

### Company Management
- `POST /api/v1/company/register`: Register a new company
- `GET /api/v1/company/get`: Get all companies
- `GET /api/v1/company/get/:id`: Get company by ID
- `GET /api/v1/company/getJob/:id`: Get jobs by company ID
- `PUT /api/v1/company/update/:id`: Update company information

### Application Management
- `POST /api/v1/application/apply/:jobId`: Apply for a job by job ID
- `GET /api/v1/application/get`: Get all applied jobs
- `GET /api/v1/application/:jobId/applicants`: Get applicants for a specific job by job ID
- `POST /api/v1/application/status/:applicationId/update`: Update the status of a job application by application ID

## UI Screenshots
![Screenshot (205)](https://github.com/user-attachments/assets/71f358da-95ae-4af7-9df7-062fad90473c)
![Screenshot (206)](https://github.com/user-attachments/assets/75ac03bb-b9cc-4b04-9852-1a34c7636dec)
![Screenshot (207)](https://github.com/user-attachments/assets/6a9bf5f1-a369-4b49-b654-9155aa1a847f)
![Screenshot (212)](https://github.com/user-attachments/assets/c8802014-cf65-48a6-9230-2b9e0e046290)
![Screenshot (213)](https://github.com/user-attachments/assets/e8af01bf-3e7c-4b99-a51e-0a7d31b4c3fe)
![Screenshot (214)](https://github.com/user-attachments/assets/b6fcbbd4-28be-4ac5-af97-620e6ec1bde8)
![Screenshot (215)](https://github.com/user-attachments/assets/45d36396-2865-49c1-ade0-ccf46f82b89e)
![Screenshot (208)](https://github.com/user-attachments/assets/e2c8e808-4c4d-4a03-9c0a-36fb95ceebda)
![Screenshot (209)](https://github.com/user-attachments/assets/d69cb69a-6bec-4788-9771-fe34a7eb692c)
![Screenshot (210)](https://github.com/user-attachments/assets/67a83de2-22e1-4944-9ba5-4291a1e21988)
![Screenshot (211)](https://github.com/user-attachments/assets/b19d0176-ba90-4f80-b031-30a948361550)

## Design Decisions & Assumptions

### Frontend
- Modern React with functional components and hooks
- Redux for centralized state management
- Responsive design with Tailwind CSS
- Component-based architecture for reusability
- Client-side form validation

### Backend
- RESTful API architecture
- JWT for secure authentication
- MongoDB for flexible document storage
- MVC pattern for code organization
- AI integration for enhanced user experience

## Future Enhancements
- Real-time notifications using WebSockets
- Advanced analytics dashboard for recruiters
- Resume builder for job seekers
- Interview scheduling system
- Mobile application



NEXT_HIRE_JOB_PORTAL
>client
 >.env
>server
 >.env
.env
