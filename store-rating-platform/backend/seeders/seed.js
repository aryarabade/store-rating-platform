const { sequelize, User } = require('../src/models');
const { hashPassword } = require('../src/utils/hashPassword');

async function seedAdmin() {
  try {
    const adminEmail = 'admin@platform.com';
    const adminPassword = 'Admin@1234';

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (existing) {
      console.log('✅ Admin user already exists:');
      console.log(`   email: ${existing.email}`);
      console.log(`   password: ${adminPassword}`);
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);

    await User.create({
      name: 'System Administrator',
      email: adminEmail,
      address: 'Head Office',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created:');
    console.log(`   email: ${adminEmail}`);
    console.log(`   password: ${adminPassword}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
