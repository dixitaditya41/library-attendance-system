const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const institute = {
  MANIT: "MANIT",
  IIIT: "IIIT",
};

 const institute_enum = Object.values(institute);

const memberType = {
  Student: "Student",
  Faculty: "Faculty",
  Staff: "Staff",
};
 const memberType_enum = Object.values(memberType);

const programType = {
  UG: "UG",
  PG: "PG",
  PhD: "PhD",
};

const programType_enum = Object.values(programType);

const userSchema = new mongoose.Schema(
  {
    scholarId: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
      index: true,
    },

    name: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },

    branch: { type: String, required: true },

    password: {
      type: String,
      required: true,
      match: [/^[0-9]{4}$/, "Password must be exactly 4 digits"],
    },

    memberType: {
      type: String,
      enum: memberType_enum,
      required: true,
    },

    programType: {
      type: String,
      enum: programType_enum,
      required: function () {
        return this.memberType === "Student"; // Only required for students
      },
    },

    institute: {
      type: String,
      enum: institute_enum,
      required: true,
    },

    attendance: [
      {
        entryTime: { type: Date },
        exitTime: { type: Date },
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is changed

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}


const USER = mongoose.model("User", userSchema);

module.exports = USER;
