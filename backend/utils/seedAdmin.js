const User = require('../models/User');

const adminUser = {
  name: 'Admin',
  phone: '9579160349',
  email: 'ayushgodse2006@gmail.com',
  isAdmin: true,
  addresses: [
    {
      label: 'Admin Office',
      fullAddress: 'Diwali Faral HQ',
      isDefault: true
    }
  ]
};

async function seedAdminIfNotExists() {
  try {
    const adminExists = await User.findOne({
      $or: [{ phone: adminUser.phone }, { email: adminUser.email }]
    });

    if (!adminExists) {
      const newAdmin = await User.create(adminUser);
      console.log(`👤 Admin user created - Phone: ${newAdmin.phone}, Email: ${newAdmin.email}`);
    } else {
      console.log(`ℹ️  Admin user already exists (${adminUser.phone})`);
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
}

module.exports = { seedAdminIfNotExists };
