import React, { useState ,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {Heading} from 'native-base';
import {  StyleSheet, Text, View } from 'react-native'
import { Button, Headline , TextInput , Modal , ActivityIndicator , Colors } from 'react-native-paper'
import axios from 'axios'
import {Root} from '../Config/root'
import {setUserData} from '../Store/action';
import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin';
import {LoginButton, AccessToken,LoginManager } from 'react-native-fbsdk';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Login = ({navigation}) => {

    const dispatch =useDispatch();
    let [email , setEmail] = useState('')
    let [password , setPassword] = useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const [disabled , setDisabled] = useState(false)

    // google configuration
    GoogleSignin.configure({
      webClientId: '780700793736-oudg9cns1jn3foim60bg54aefabrla89.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess:true
    });

    // signin method using google
      const signIn = async () => {
        setErrorShow(false);
        setDisabled(true)
        try {
          const a=await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
        const {data} = await axios.post(`${Root.production}/user/login` , {email: userInfo.user.email , password:userInfo.user.id})
        if(data.status==200){
          if (data.message.account.verified == true) {
            dispatch(setUserData(data.message))
            navigation.navigate('dashboard-app')
            setPassword('')
          }
          else{
            navigation.navigate(`EmailVerification`,{
              id:data.message.account._id
            });
          }
        } else if (data.status == 403) {
          navigation.navigate('BuildProfile',{
            id:data.message.userId
          })
        } else{
          setError(data.message)
          setErrorShow(true);
        }

      } 
        catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      setDisabled(false)
      };

      // login method using email
    const handleLogin = async () =>{
      if(email!=='' || password!==''){
      setDisabled(true)
      setErrorShow(false);
        try {
            const {data} = await axios.post(`${Root.production}/user/login` , {email: email , password:password})
            if(data.status==200){
              if (data.message.account.verified == true) {
                dispatch(setUserData(data.message))
                navigation.navigate('dashboard-app')
                setPassword('')
              }
              else{
                navigation.navigate(`EmailVerification`,{
                  id:data.message.account._id
                });
              }
            } else if (data.status == 403) {
              navigation.navigate('BuildProfile',{
                id:data.userId
              })
            } else{
              setError(data.message)
              setErrorShow(true);
            }

            // setDisabled(false)
        } catch (error) {
          setError(error.message)
          setErrorShow(true);
        }
      setDisabled(false)
    }
    else{
      
    }
    }

      // login method using facebook
      const handleFirebaseFacebook= async()=>{
  
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
}

    return (
        <View style={styles.loginPage} >
            <Headline style={styles.header} >Welcome Back</Headline>
            <Text style={styles.header} >Please Log In To Continue</Text>
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120'}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Login Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
            <View style={{alignItems:'center'}}  >
                <TextInput label='Email' mode='outlined' style={styles.input} value={email} onChangeText={(text) => setEmail(text) } left={<TextInput.Icon name='email-outline' />}  />
                <TextInput label='Password'  mode='outlined' style={styles.input} secureTextEntry value={password} onChangeText={(text) => setPassword(text)} left={<TextInput.Icon name='lock-outline' />} />
                <Text
                onPress={() => navigation.navigate('EnterEmailForForgetPassword')}
                style={{color:'blue'}}>
                Forgot Password?
            </Text>
            {
                disabled ? (<ActivityIndicator animating={true} color={Colors.black} />) : (
                    <Button mode='contained' onPress={handleLogin} style={styles.loginBtn} > Log In</Button>
                )
            }
            </View>
            
            <View style={styles.orSection} >
                <View style={styles.hr} ></View>
                <Text style={{color:'black'}} > OR </Text>
                <View style={styles.hr} ></View>
            </View>
            <View style={styles.socialBtns} >
            <GoogleSigninButton
  style={{ width: 250, height: 48 }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Light}
  onPress={()=>signIn()}
/>   
<LoginButton
            style={{width:250,height:35,backgroundColor:"blue"}}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                  } else if (result.isCancelled) {
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => {}}/>
            </View>
            <Text
                style={{color:'blue'}}
                onPress={() => navigation.navigate('Register')}
            >
                New here? Register now.
            </Text>

        </View>
        
    )
}


const styles = StyleSheet.create({
    loginPage:{
        alignItems:'center',
        backgroundColor:'white',
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    },
    header:{
        color:'black',
    },
    inputSection:{
        justifyContent:'flex-start'
    },
    input:{
        width:300,
        margin:5
    },
    orSection:{
        flexDirection:'row',
        alignItems:'center',
        width:300
    },
    hr:{
        flex:1,
        height:1,
        backgroundColor:'black'
    },
    loginBtn:{
        width:300,
        margin:5
    }
})

export default Login
