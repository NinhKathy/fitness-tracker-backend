const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
  email: {
    name: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    email: String,
    contactNumber: String,
    password: String,
  }
});

//hash password before saving to DB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next ();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compares passwords
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = { User };