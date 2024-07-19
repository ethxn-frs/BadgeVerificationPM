Badge Verification API
This is a small API for verifying and transforming badge images, developed in Node.js and TypeScript. The application allows users to upload a badge (an avatar within a circle) and checks if the image meets specific criteria. Additionally, it can convert any uploaded image into the specified badge format.

Project Overview
This project was created as a technical exercise for PlayMakers, based on the following requirements:

Users can upload a badge image.
The image should be 512x512 pixels.
Only non-transparent pixels should be within a circle.
The colors in the badge should give a "happy" feeling.
Additionally, a parallel function should convert any given image (of any format) into the specified badge object.

Prerequisites
Make sure you have Node.js and npm installed on your machine.

Installation
Clone the repository and install the dependencies:

git clone <repository-url>
cd badgeverificationpm
npm install

You can run the application in different modes:

Development mode: This will start the server with nodemon for automatic restarts on file changes.

npm run dev
Production mode: This will compile the TypeScript code and start the server.

npm run start
Build only: This will compile the TypeScript code without starting the server.

npm run build
The application will run on port 3000.

Testing the API
You can use tools like Postman to test the endpoints. Sample images for testing are available in the data folder, covering various cases.
