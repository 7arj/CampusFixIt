# Campus FixIt 

A campus issue reporting system built with React Native and Node.js.

## Tech Stack
- **Frontend:** React Native (Expo)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT

## Setup Instructions
1. **Backend:**
   - `cd backend`
   - `npm install`
   - Create `.env` file with `MONGO_URI` and `JWT_SECRET`
   - `npm run dev`
2. **Frontend:**
   - `cd frontend`
   - `npm install`
   - Update IP address in `services/api.js`
   - `npx expo start`

## Features
- User Authentication (Student/Admin)
- Report Issues with Image Upload
- Track Issue Status