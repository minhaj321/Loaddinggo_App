import React, { useState } from 'react'
import { View, StyleSheet} from 'react-native'
import { Headline , TextInput, Button} from 'react-native-paper'
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'

const EnterEmailForForgetPassword = ({navigation}) => {

    let [email , setEmail] = useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);

// submit method
    const handleEmailSubmit =async () =>{
        setErrorShow(false);
        try{

        setErrorShow(false)
        if(email===''){
            setErrorShow(true);
            setError('Please enter your email first')
        }else{
            var {data} =await axios.post(`${Root.production}/user/forgetPasswordMobile`,{email});
            if(data.status==200){
                navigation.navigate('ResetPassword',{
                    code1 : data.message
                })
            }else if(data.status==404){
                setErrorShow(true);
                setError(data.message)
            }
            else{
                setErrorShow(true);
                setError(data.message)
            }
        }
    }catch(err){
        setErrorShow(true);
        setError(err.message)
    }

    }

    return (
        <View style={styles.emailVerificationForForgetPasswordPage} >
            <Headline>Enter your email address</Headline>
            <Text>We need to verify that this is really you.</Text>
           {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:10,borderRadius:5,width:300}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Sending Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }            
            <View style={{alignItems:'center'}}  >
                <TextInput label='Email' mode='outlined' style={styles.input} value={email} onChangeText={(text) => setEmail(text) } left={<TextInput.Icon name='account-circle-outline' />} />
                <Button mode='contained'  style={styles.submitBtn} onPress={handleEmailSubmit} >Send Email</Button>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    emailVerificationForForgetPasswordPage:{
        alignItems:'center',
        backgroundColor:'white',
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    },
    para:{
        width:250,
        textAlign:'center'
    },
    submitBtn:{
        width:300,
        margin:5
    },
    input:{
        width:300,
        margin:5
    },
})

export default EnterEmailForForgetPassword
