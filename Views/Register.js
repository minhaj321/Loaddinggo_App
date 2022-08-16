import React, { useState } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { Button, Headline , TextInput,ActivityIndicator,Colors} from 'react-native-paper'
import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin';
import {LoginButton, AccessToken } from 'react-native-fbsdk';
import {Root} from '../Config/root'
import {Heading,Button as Btn,Image} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const Register = ({navigation}) => {

    let [username , setUserName] = useState('')
    let [email , setEmail] = useState('')
    let [password , setPassword] = useState('')
    let [confirmPassword , setConfirmPassword] = useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const [disabled , setDisabled] = useState(false)

      // signUp method using email
      const handleSignUp =async () =>{
      setDisabled(true)
      setErrorShow(false);
        try {
          var divider1 = email.split("@");
              if(username==='' || email=== '' || password ===''){
              setErrorShow(true);
              setError('Please fill form completely.')
          }
          else if(divider1[0].length<1 || divider1[1]=='' || divider1[1].split('.')[0]=='' || divider1[1].split('.')[1]=='' || divider1[1].split('.')[0]==undefined || divider1[1].split('.')[1]==undefined){
            setErrorShow(true);
            setError('Please correct your email format.')
        }else if(password.length <8){
              setErrorShow(true);
              setError('Your Password should have atleast 8 characters.')
          }else if(password !==confirmPassword){
            setErrorShow(true);
            setError('Your Password & Confirm Password should be same.')
        }else{
            let {data} = await axios.post(`${Root.production}/user/register` , {email , password,username})
            if(data.status==200){
              navigation.navigate('BuildProfile',{id:data.message.id})
            }else if(data.status==409){
              setError(data.mesaage)
              setErrorShow(true);
            }
            else{
              setError(data.message)
              setErrorShow(true);
            }
          } 
        }
        catch (error) {
          setErrorShow(true);
          setError('Please fill form correctly.')
          }

      setDisabled(false)
    }

    // google configuration
    GoogleSignin.configure({
      webClientId: '780700793736-oudg9cns1jn3foim60bg54aefabrla89.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess:true
  });

    // signup method using google
      const signUpWithGoogle = async () => {
        setErrorShow(false);
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
        const {data} = await axios.post(`${Root.production}/user/register` , {email:userInfo.user.email , 
          password:userInfo.user.id,username:userInfo.user.name})
        if(data.status==200){
          navigation.navigate('BuildProfile',{id:data.message.id})
        }else if(data.status==409){
          setError(data.mesaage)
          setErrorShow(true);
        }
        else{
          setError(data.message)
          setErrorShow(true);
        }

        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
        console.log('in progress')
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('not available')

            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };
  

    return (
        <View style={styles.registerPage} >
            <Headline style={styles.header} >Welcome</Headline>
            <Text style={styles.header} >To begin, sign up with an option below</Text>
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120'}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Registration Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }

            <View style={{alignItems:'center'}}  >
                <TextInput label='Username' mode='outlined' style={styles.input} value={username} onChangeText={(text) => setUserName(text) } left={<TextInput.Icon name='account-circle-outline' />} />
                <TextInput label='Email' mode='outlined' style={styles.input} value={email} onChangeText={(text) => setEmail(text) } left={<TextInput.Icon name='email-outline' />} />
                <TextInput label='Password' mode='outlined' style={styles.input} secureTextEntry value={password} onChangeText={(text) => setPassword(text)} left={<TextInput.Icon name='lock-outline' />} />
                <TextInput label='Re-enter Password' mode='outlined' style={styles.input} secureTextEntry value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} left={<TextInput.Icon name='lock-outline' />} />
                {
                disabled ? (<ActivityIndicator animating={true} color={Colors.black} />) : (
                  <Button mode='contained' onPress={handleSignUp} style={styles.loginBtn} >Sign Up</Button>
                  )
            }
            </View>
            
            <View style={styles.orSection} >
                <View style={styles.hr} ></View>
                <Text style={{color:'black'}} > OR </Text>
                <View style={styles.hr} ></View>
            </View>
            <View style={styles.socialBtns} >
            {/* <GoogleSigninButton
  style={{ width: 250, height: 48 }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Light}
  onPress={()=>signUpWithGoogle()}
  //   disabled={this.state.isSigninInProgress}
/>  */}
<Btn onPress={()=>signUpWithGoogle()} leftIcon={<AntDesign name='google' size={20} style={{marginLeft:-25}} />} style={{backgroundColor:'#fff'}}   shadow={3}>
  <Text style={{color:'gray',fontWeight:'bold',alignContent:'flex-end',marginLeft:30}}>Sign up with Google</Text>
  </Btn>  
  <View style={{height:5}}></View>
<LoginButton
            style={{width:250,height:35,backgroundColor:"blue"}}
            readPermissions={["user_friends", "email"]}
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
                onPress={() => navigation.navigate('Login')}
            >
                Already a member? Log In
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    registerPage:{
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

export default Register
