const mongoose = require('mongoose');

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

  attendance: [{
    entryTime: { type: Date }, 
    exitTime: { type: Date }    
  }]
},
{ timestamps: true });

const USER = mongoose.model('User', userSchema);

module.exports = USER;
