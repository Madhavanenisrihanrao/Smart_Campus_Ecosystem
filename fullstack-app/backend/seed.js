const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Item = require('./models/Item');
const Event = require('./models/Event');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

/**
 * Seed Data for Testing
 * Creates sample users, items, and events
 */
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Item.deleteMany();
    await Event.deleteMany();

    console.log('🗑️  Existing data deleted\n');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // Create Regular Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('✅ Regular users created');

    // Create Lost & Found Items
    await Item.create([
      {
        title: 'Lost iPhone 13',
        description: 'Black iPhone 13 Pro Max lost near library',
        category: 'lost',
        location: 'Main Library',
        contactInfo: 'john@example.com',
        status: 'open',
        user: user1._id,
      },
      {
        title: 'Found Wallet',
        description: 'Brown leather wallet found with some cash and ID cards',
        category: 'found',
        location: 'Cafeteria',
        contactInfo: 'jane@example.com',
        status: 'open',
        user: user2._id,
      },
      {
        title: 'Lost Backpack',
        description: 'Blue Nike backpack with laptop inside',
        category: 'lost',
        location: 'Building A',
        contactInfo: 'john@example.com',
        status: 'open',
        user: user1._id,
      },
    ]);

    console.log('✅ Lost & Found items created');

    // Create Events
    await Event.create([
      {
        title: 'Tech Conference 2025',
        description: 'Annual technology conference featuring latest innovations',
        date: new Date('2025-11-15'),
        time: '10:00 AM',
        location: 'Auditorium Hall',
        organizer: 'Tech Club',
        status: 'upcoming',
        createdBy: admin._id,
      },
      {
        title: 'Sports Day',
        description: 'Inter-department sports competition',
        date: new Date('2025-10-30'),
        time: '9:00 AM',
        location: 'Sports Ground',
        organizer: 'Sports Committee',
        status: 'upcoming',
        createdBy: admin._id,
      },
      {
        title: 'Cultural Fest',
        description: 'Annual cultural festival with music, dance, and drama',
        date: new Date('2025-12-20'),
        time: '6:00 PM',
        location: 'Main Campus',
        organizer: 'Cultural Committee',
        status: 'upcoming',
        createdBy: admin._id,
      },
    ]);

    console.log('✅ Events created\n');

    console.log('📋 Test Accounts:');
    console.log('==========================================');
    console.log('Admin Account:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('  Role: admin\n');
    console.log('User Account 1:');
    console.log('  Email: john@example.com');
    console.log('  Password: user123');
    console.log('  Role: user\n');
    console.log('User Account 2:');
    console.log('  Email: jane@example.com');
    console.log('  Password: user123');
    console.log('  Role: user\n');
    console.log('==========================================\n');
    console.log('✅ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
