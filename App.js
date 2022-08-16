import React from 'react';
import Navigation from "./Navigation";
import {Provider} from 'react-redux';
import store from './Store/index'
import {
  NativeBaseProvider,
} from "native-base"


const App = () => {

  return (
    <NativeBaseProvider>
    <Provider store={store}>
    <Navigation/>
    </Provider>
    </NativeBaseProvider>
  );
};


export default App;
