VisionCL Backend API
This is a RESTful API built with Node.js, Express, and PostgreSQL for medical case management and image processing.

🛠 Prerequisites
Node.js (v16+)

PostgreSQL instance running locally or remotely.

🚀 Setup Instructions
Clone & Install: Extract the ZIP and run npm install to populate node_modules.

Environment: Create a .env file in the root. You must define the following variables for the server to initialize:

DB_USER / DB_PASSWORD / DB_HOST / DB_PORT

JWT_SECRET (Required for authentication middleware)

Database Schema: Initialize your PostgreSQL instance with tables for images and medical_records. Ensure image_id in medical_records uses ON DELETE CASCADE.

Launch: Run node app.js.

🤖 AI Integration Logic
The backend is architected to support asynchronous AI diagnosis:

Storage: Images are stored in /uploads. The absolute path is recorded in the images table.

Update Flow: After the AI model processes a file from the /uploads directory, send the result back to the API.

Endpoint: PUT /api/medical/update-case/:id

Payload:

JSON
{
  "diagnosis": "AI_Generated_Analysis_Result"
}
Security: All medical routes are protected via JWT. Include Authorization: Bearer <token> in all requests.