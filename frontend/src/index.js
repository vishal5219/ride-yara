import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';

const queryClient = new QueryClient();
const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_API_GATEWAY_URL + '/user',
  cache: new InMemoryCache(),
});
const muiTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <MuiThemeProvider theme={muiTheme}>
      <AntdConfigProvider>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </ApolloProvider>
      </AntdConfigProvider>
    </MuiThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
