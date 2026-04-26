// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, 'Please provide a username'],
//         unique: true,
//         trim: true,
//         minlength: [3, 'Username must be atleast 3 characters long']
//     },

//     email: {
//         type: String, 
//         required: [true, 'Please provide an email'],
//         unique: true,
//         lowercase: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
//     }, 

//     password :{
//         type: String,
//         required :[true, 'Please provide a password'],
//         minlength: [6, 'Password must be atleast 6 characters long'],
//         select: false
//     },

//     profileImage: {
//         type: String,
//         default: null
//     }
// }, {
//     timestamps: true
// });


// //Hash password before saving
// userSchema.pre('save', async function() {
//     if(!this.isModified('password')) {
//         return ;
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

// });

// //Compare password method
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// export default User;

// His Code:
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//     enrolledCourses: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course'
//       }
//     ],
//   }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// export default User


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  clerkId: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    trim: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  imageUrl: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    enum: ["student", "educator"],
    default: "student"
  },

  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ]
},
{
  timestamps: true
}
);

const User = mongoose.model("User", userSchema);

export default User;