import React,{useEffect,useState} from 'react';
import Login from './Views/Login';
import { Provider as PaperProvider } from 'react-native-paper'
import {theme} from './Config/theme'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Views/Register';
import Dashboard from './Views/Dashboard';
import EmailVerificationPage from './Views/EmailVerificationPage';
import BuildProfile from './Views/BuildProfile';
import EnterEmailForForgetPassword from './Views/EnterEmailForForgetPassword';
import ResetPassword from './Views/ResetPassword';
import {LogBox } from 'react-native';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();



const Navigation = () => {
    var user1=useSelector(state=>state.user);
  var [user,setUser] = useState({})
  useEffect(()=>{
      setUser(user1)
  },[])

  return (
    <NavigationContainer> 
    <PaperProvider theme={theme} >  
    <Stack.Navigator screenOptions={{headerShown:false}} 
    // initialRouteName={'Login'} 
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name='ResetPassword' component={ResetPassword} />
        <Stack.Screen name="BuildProfile" component={BuildProfile} />
        <Stack.Screen name="EnterEmailForForgetPassword" component={EnterEmailForForgetPassword} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationPage} />
        <Stack.Screen name="dashboard-app" component={Dashboard} />
      </Stack.Navigator>
  </PaperProvider>
    </NavigationContainer>
  );
};


export default Navigation;
