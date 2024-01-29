import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ApiService = {
  getCustomerAccount(user_id) {
    return http.get(`/account/${user_id}`);
  },
  getUser(user) {
    return http.post('/user',  user );
  },
  getAllCustomerAccounts() {
    return http.get(`/accounts`);
  },
  register(user){
    return http.post('/user/register',  user );
  },
  approveTransaction(transaction_id) {
    return http.get(`/transaction/approve/${transaction_id}`);
  },
  createTransaction(transaction) {
    return http.post('/transaction',transaction);
  }


};

export default ApiService;
