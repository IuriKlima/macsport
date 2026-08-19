const http = require('http');

const runTests = async () => {
  const targetUrl = 'http://127.0.0.1:3000';
  
  const testCases = [
    { path: '/admin/login', host: 'localhost:3000', expected: 200, name: 'Valid host localhost' },
    { path: '/admin/login', host: '127.0.0.1:3000', expected: 200, name: 'Valid host 127.0.0.1' },
    { path: '/admin/login', host: 'meusite.com', expected: 404, name: 'Invalid host meusite.com' },
    { path: '/api/auth/login', host: 'fake-host.com', expected: 404, name: 'Invalid host on API auth route' },
    { path: '/api/upload', host: 'another-domain.net', expected: 404, name: 'Invalid host on API upload route' },
    { path: '/admin/signup', host: 'localhost:3000', expected: 404, name: 'Signup should return 404 even on localhost' },
    { path: '/admin/produtos', host: 'hacker.com', expected: 404, name: 'Protected admin route on invalid host' }
  ];

  console.log('Testing Admin Access Protection Middleware...');
  console.log('Assuming local server is running at', targetUrl, 'with NODE_ENV=development and ENABLE_LOCAL_ADMIN=true\n');

  for (const tc of testCases) {
    try {
      const response = await fetch(`${targetUrl}${tc.path}`, {
        headers: {
          'Host': tc.host,
          'Authorization': 'Bearer FAKE_TOKEN'
        },
        redirect: 'manual' // so we can see 3xx if any
      });
      
      const status = response.status;
      const pass = status === tc.expected || (tc.expected === 200 && status === 307); // 307 redirect to /admin is also acceptable for /admin/login if session is valid or missing, actually /admin/login with no session is 200.
      
      console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name}`);
      console.log(`  -> GET ${tc.path} with Host: ${tc.host}`);
      console.log(`  -> Expected: ${tc.expected}, Got: ${status}\n`);
    } catch (e) {
      console.log(`[FAIL] ${tc.name} - Connection error: ${e.message}\n`);
    }
  }
};

runTests();
