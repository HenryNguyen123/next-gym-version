import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

//send cookie up to server
instance.defaults.withCredentials= true
// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// // Add a request interceptor
// instance.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('JWT');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const getData = response
    return getData;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });


export default instance





// import axios from 'axios';

// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   withCredentials: true,
// });

// instance.interceptors.request.use(
//   (config) => {
//     // Chỉ đọc localStorage ở phía browser
//     if (typeof window !== 'undefined') {
//       const isLoginRequest = config.url?.includes('/auth/login');

//       if (!isLoginRequest) {
//         const token = localStorage.getItem('JWT');

//         if (token) {
//           config.headers.set('Authorization', `Bearer ${token}`);
//         }
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API error:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       data: error.response?.data,
//     });

//     return Promise.reject(error);
//   }
// );

// export default instance;
