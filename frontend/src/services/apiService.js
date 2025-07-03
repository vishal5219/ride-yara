import axios from 'axios';
import Cookies from 'js-cookie';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const API_GATEWAY = process.env.REACT_APP_API_GATEWAY_URL;

// Apollo Client setup for user-service GraphQL
const httpLink = createHttpLink({
  uri: `${API_GATEWAY}/api/users/graphql`,
});
const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// GraphQL mutations
export const registerUserGraphQL = async (data) => {
  const REGISTER_MUTATION = gql`
    mutation Register($name: String!, $email: String!, $password: String!, $role: String!, $phone: String!) {
      register(name: $name, email: $email, password: $password, role: $role, phone: $phone) {
        id
        name
        email
        role
        phone
      }
    }
  `;
  return apolloClient.mutate({
    mutation: REGISTER_MUTATION,
    variables: data,
  });
};

export const loginUserGraphQL = async (data) => {
  const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user { id name email role phone }
        token
      }
    }
  `;
  return apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: data,
  });
};

// Create a common axios instance
const apiClient = axios.create({
  baseURL: API_GATEWAY,
});

// Attach token from cookies to every request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Booking APIs
export const createBooking = (data) => apiClient.post('/api/bookings', data);
export const listBookings = () => apiClient.get('/api/bookings');

// Driver APIs
export const registerDriver = (data) => apiClient.post('/api/drivers/register', data);
export const loginDriver = (data) => apiClient.post('/api/drivers/login', data);

// User APIs
export const registerUser = (data) => apiClient.post('/api/users/register', data);
export const loginUser = (data) => apiClient.post('/api/users/login', data);

// Payment APIs
export const initiatePayment = (data) => apiClient.post('/api/payments/initiate', data);
export const verifyPayment = (data) => apiClient.post('/api/payments/verify', data);
export const refundPayment = (data) => apiClient.post('/api/payments/refund', data);

// Notification APIs
export const getNotifications = () => apiClient.get('/api/notifications');
export const markNotificationRead = (id) => apiClient.post(`/api/notifications/${id}/read`);

export default apiClient; 