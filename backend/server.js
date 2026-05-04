// import dotenv from 'dotenv';

// //loads variables from the .env file into process.env
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';


// import connectDB from './config/db.js'
// import errorHandler from './middleware/errorHandler.js'
// import authRoutes from './routes/authRoutes.js'
// import documentRoutes from './routes/documentRoutes.js'
// import flashcardRoutes from './routes/flashcardRoutes.js'
// import aiRoutes from './routes/aiRoutes.js'
// import quizRoutes from './routes/quizRoutes.js'
// import progressRoutes from './routes/progressRoutes.js'

// import { error } from 'console';


// //ES6 module __dirname alternative
// const __filename = fileURLToPath(import.meta.url);
// const __dirname=path.dirname(__filename);

// //iniatilise express
// const app = express();

// // Connect to mongodb
// connectDB();

// //middleware to handle cors
// app.use(
//     cors({
//         origin: "*",
//         methods: ["GET","POST", "PUT", "DELETE"],
//         allowedHeaders :["Content-Type", "Authorization"],
//         credentials: true
//     })
// );

// // parse json data
// app.use(express.json());
// // parse form data
// app.use(express.urlencoded({extened: true}));


// //Static folder for uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// //Routes

// app.use('/api/auth' , authRoutes)
// app.use('/api/documents', documentRoutes)
// app.use('/api/flashcards' , flashcardRoutes);
// app.use('/api/ai' , aiRoutes);
// app.use('/api/quizzes', quizRoutes);
// app.use('/api/progress', progressRoutes);


// app.use(errorHandler);

// //404 handler
// app.use((req,res)=>{
//     res.status(404).json({
//     success: false,
//     error: 'Route not found',
//     statusCode: 404

// })
// });


// //start server
// const PORT= process.env.PORT ||  8000;
// app.listen(PORT , () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// // If mongoDb isnt connected, then display error msg
// process.on('unhandledRejection', (err) => {
//     console.error(`Error: ${err.message}`);
//     process.exit(1);
// });


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { clerkMiddleware } from '@clerk/express'; // NEW

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './config/cloudinary.js';

/* NEW ROUTES */
// import courseRoutes from './routes/courseRoutes.js';
// import educatorRoutes from './routes/educatorRoutes.js';

/* Clerk webhook */
// import { clerkWebhooks } from './controllers/webhooks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Connect DB */
connectDB();
connectCloudinary();
import { v2 as cloudinary } from "cloudinary";
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

cloudinary.api.ping()
.then(result => console.log("PING:", result))
.catch(err => console.log("PING ERROR:", err));
// console.log("Cloudinary Connected");

/* CORS */
app.use(
  cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
  })
);

/* IMPORTANT:
 Clerk middleware before protected routes
*/


app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
/* Body parsing */
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

/* Static uploads */
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(clerkMiddleware());

/* ---------------- WEBHOOK ---------------- */
app.post('/clerk', express.json(), clerkWebhooks);


/* ---------------- EXISTING ROUTES ---------------- */

// app.use('/api/auth', authRoutes); 
// Later old login/signup can be phased out if using only Clerk

app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);


app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);


/* ---------------- NEW ROUTES ---------------- */

// app.use('/api/courses', courseRoutes);
// app.use('/api/educator', educatorRoutes);


/* Test route */
app.get('/',(req,res)=>{
  res.send("API Working");
});


/* Error handler */
app.use(errorHandler);


/* 404 */
app.use((req,res)=>{
  res.status(404).json({
    success:false,
    error:'Route not found',
    statusCode:404
  });
});


/* Server */
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
 console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
 );
});


process.on('unhandledRejection',(err)=>{
 console.error(`Error: ${err.message}`);
 process.exit(1);
});