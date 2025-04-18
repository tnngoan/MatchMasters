// Script to seed pickleball judge profiles to MongoDB
import fetch from 'node-fetch';

console.log('Seeding pickleball judge profiles to MongoDB...');

// Function to seed profiles
async function seedPickleballProfiles() {
  try {
    const response = await fetch('http://localhost:3001/api/seed/profiles/pickleball', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Success!', data.message);
      console.log('Inserted profiles:', data.insertedProfiles);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Failed to connect to the server:', error.message);
    console.log('Make sure the server is running on http://localhost:3001');
  }
}

// Run the function
seedPickleballProfiles();