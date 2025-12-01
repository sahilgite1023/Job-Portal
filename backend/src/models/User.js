import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], required: true },
  resumeUrl: { type: String },
  company: { type: String }, // for recruiters (optional)
  provider: { type: String, enum: ['local','google'], default: 'local' },
  googleId: { type: String, index: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  // Skip hashing if provider is google (password may be placeholder) or password unchanged
  if (this.provider === 'google' || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
