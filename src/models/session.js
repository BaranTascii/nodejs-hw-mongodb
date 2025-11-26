import mongoose, { Schema } from 'mongoose'; // Mongoose import'unu 'model' yerine 'mongoose' olarak değiştirin

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
