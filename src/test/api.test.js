const fetch = require('node-fetch');

// Test over API

// Helper
const fetchData = async (endpoint, options = {}) => {
  try {
    const defaultOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await fetch(endpoint, { ...defaultOptions, ...options })
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      const error = new Error();

      error.message = {
        status: res.status || "00",
        statusText: res.statusText || "Error",
        ...data
      }

      throw error;

    }
  } catch (error) {
    throw error;
  }
}

// util datas

const testData = {
  credentials: {
    email: "dominicantri@dgmail.com",
    password: "carlo1992"
  },
  token: null,
}

// tests

test('user was authenticated', async () => {
  const data = await fetchData('http://localhost:3001/login', {
    method: 'POST',
    body: JSON.stringify(testData.credentials)
  })

  testData.token = data.token;

  expect(data.message).toBe("User authenticated correctly")
})

test('user token obtained', () => {
  expect(testData.token).toBeTruthy()
})

test(`user's credentials incorrect`, async () => {
  expect.assertions(1);

  try {
    await fetchData('http://localhost:3001/login', {
      method: 'POST',
      body: JSON.stringify(testData.credentials)
    });

  } catch ({ message }) {
    expect(!!(message.errors.email || message.errors.password)).toBe(true)
  }
})

test('get into tasks', async () => {
  const data = await fetchData('http://localhost:3001/tasks');
  expect(data.tasks).toBeDefined();
})

test('get into users *** needed token ***', async () => {
  const data = await fetchData('http://localhost:3001/users', {
    headers: {
      "Authorization": `Bearer ${testData.token}`
    }
  });

  expect(data.users).toBeDefined();
})

test(`get any existed user's tasks *** needed token ***`, async () => {
  const data = await fetchData(`http://localhost:3001/users/618562c9776575edfed4dfc2/tasks`, {
    headers: {
      "Authorization": `Bearer ${testData.token}`
    }
  });

  expect(data.tasks.tasks).toBeDefined();
})