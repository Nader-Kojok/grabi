// Test authentication flow
const testEmail = 'test@grabi.com';
const testPassword = 'TestPassword123!';

console.log('🧪 Testing Grabi Authentication Flow');
console.log('=====================================');

// Test data
const testUser = {
  email: testEmail,
  password: testPassword,
  firstName: 'Test',
  lastName: 'User',
  phone: '+212600000000'
};

console.log('📝 Test User Data:');
console.log(JSON.stringify(testUser, null, 2));

console.log('\n✅ Test script created successfully!');
console.log('📋 Next steps:');
console.log('1. Open http://localhost:5173/register');
console.log('2. Register with the test credentials above');
console.log('3. Check browser console for debug logs');
console.log('4. Try logging in with the same credentials');
