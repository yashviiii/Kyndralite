/**
 * Seed script to create default admin user
 * Run with: npx ts-node --project tsconfig.scripts.json lib/seed-admin.ts
 * Or use the API endpoint: POST /api/admin/seed
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ankiitladva_db_user:0ZUygvpFE5cTDpWI@krishipay.taedjoi.mongodb.net/';

// Define Admin schema inline for standalone script
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const defaultAdmin = {
      name: 'Yashvi Dhar',
      phoneNumber: '+918169025493',
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ phoneNumber: defaultAdmin.phoneNumber });
    
    if (existingAdmin) {
      console.log(`Admin with phone number ${defaultAdmin.phoneNumber} already exists.`);
      // Update name if different
      if (existingAdmin.name !== defaultAdmin.name) {
        existingAdmin.name = defaultAdmin.name;
        await existingAdmin.save();
        console.log(`Updated admin name to: ${defaultAdmin.name}`);
      }
    } else {
      // Create new admin
      const admin = new Admin(defaultAdmin);
      await admin.save();
      console.log(`Created default admin user: ${defaultAdmin.name} (${defaultAdmin.phoneNumber})`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

export default seedAdmin;

