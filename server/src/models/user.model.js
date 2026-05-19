const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Already unique, but explicit index for faster lookups
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
      index: true, // Index for role-based queries
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true, // Index for verification status queries
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    aiCredits: {
      type: Number,
      default: 5,
    },
    verificationToken: {
      type: String,
      index: true, // Index for email verification lookups
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
        resumeOriginalName: { type: String },
      },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
    jobRecommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    jobAlerts: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly"],
        default: "daily",
      },
      lastSentAt: {
        type: Date,
      },
      savedFilters: [
        {
          name: { type: String, trim: true },
          keywords: [{ type: String, trim: true }],
          location: { type: String, trim: true },
          jobType: { type: String, trim: true },
          minSalary: { type: Number },
          maxSalary: { type: Number },
          experienceLevel: { type: Number },
          companyIds: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Company",
            },
          ],
          limit: {
            type: Number,
            default: 5,
            min: 1,
            max: 20,
          },
        },
      ],
    },
    searchHistory: [
      {
        type: String,
      },
    ],
    savedSearches: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        keywords: [{ type: String, trim: true }],
        location: { type: String, trim: true },
        jobType: { type: String, trim: true },
        minSalary: { type: Number },
        maxSalary: { type: Number },
        experienceLevel: { type: Number },
        companyIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
          },
        ],
        limit: {
          type: Number,
          default: 10,
          min: 1,
          max: 50,
        },
        alertEnabled: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    quickTemplates: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        coverLetter: {
          type: String,
          trim: true,
        },
        resumeId: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
