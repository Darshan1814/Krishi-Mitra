/* global use, db */
// MongoDB Playground for KrishiBandhu Database

const database = 'krishibandhu';

// Create and use the database
use(database);

// Create collections for the project
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('coldstorages');

// Insert sample user data
db.users.insertMany([
  {
    name: 'Ramesh Patil',
    email: 'ramesh@example.com',
    password: '$2a$12$hashedpassword',
    role: 'farmer',
    phone: '+91 98765 43210',
    location: 'Nashik, Maharashtra',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sunita Sharma', 
    email: 'sunita@example.com',
    password: '$2a$12$hashedpassword',
    role: 'vendor',
    phone: '+91 87654 32109',
    location: 'Pune, Maharashtra',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample product data
db.products.insertMany([
  {
    name: 'Organic Tomatoes',
    price: 45,
    category: 'Vegetables',
    seller: 'Ramesh Patil',
    sellerId: ObjectId(),
    location: 'Nashik, Maharashtra',
    image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400',
    quantity: 100,
    unit: 'kg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Fresh Onions',
    price: 25,
    category: 'Vegetables', 
    seller: 'Sunita Sharma',
    sellerId: ObjectId(),
    location: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    quantity: 200,
    unit: 'kg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Show all collections
show collections;

// Show sample data
db.users.find().pretty();
db.products.find().pretty();