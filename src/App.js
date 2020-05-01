import React, { useEffect } from 'react';
import './App.css';
import { Provider } from "react-redux";
import store from './store/store';
import AppRouter from './routers/AppRouter';

import { loadUser } from './actions/authActions'


const App = () => {

  useEffect(function () {
    store.dispatch(loadUser())
  })

  return (

    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;



