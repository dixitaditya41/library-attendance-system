const mongoose = require('mongoose');

const institute = 
{
   MANIT: "MANIT",
   IIIT: "IIIT",
}

const institute_enum = 
[
    institute.MANIT,
    institute.IIIT,
]

const memberType =
{
 Student :"Student",
 Faculty:"Faculty",
 Staff:"Staff",

}

const memberType_enum =
[
  memberType.Student,
  memberType.Faculty,
  memberType.Staff
]
const userSchema = new mongoose.Schema({

  scholarId: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/
   },
  
  name: { type: String, required: true },

  isAdmin: { type: Boolean, default: false },
  
  branch: { type: String, required: true },
  
  password: { 
    type: String, 
    required: true, 
    match: [/^[0-9]{4}$/, 'Password must be exactly 4 digits']//Regex 
  },
   
  memberType:{
     type:String,
     enum: Object.values(memberType_enum),
     required: true, 
  },
  institute:{
    type:String,
    enum:Object.values(institute_enum),
    required: true, 
    },
  attendance: [{
    entryTime: { type: Date }, 
    exitTime: { type: Date }    
  }]
},
{ timestamps: true });

const USER = mongoose.model('User', userSchema);

module.exports = USER;
