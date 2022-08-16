import React, { useState } from 'react'
import { StyleSheet, Text, View,Alert } from 'react-native'
import { Switch } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType,setUserData } from '../../Store/action.js'
import axios from 'axios';
import { Root } from './../../Config/root'
import { Input ,Modal,VStack,HStack,Center,Button,Select,CheckIcon,Heading} from 'native-base'
import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin';

const CustomDrawerHeader = ({ navigation }) => {

    const dispatch = useDispatch()
    
    const currentRole = useSelector(state => state.role)
    const user = useSelector(state=>state.user);
    const userId = user?.account?._id;
    const [showModal, setShowModal] = useState(false)
    
    GoogleSignin.configure({
      webClientId: '780700793736-oudg9cns1jn3foim60bg54aefabrla89.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // accountName: 'Loadinggo', // [Android] specifies an account name on the device that should be used
      // androidClientId:'1080341009220-eejsurl9tu4bhm6vr40jsp2pcg09ljdc.apps.googleusercontent.com'
  });



    const handleRoleChange = async () => {
        if (currentRole === "Carrier") {
            dispatch(setUserType("Shipper"))
        navigation.navigate('Dashboard') 

        } else {
            var {data} = await axios.post(`${Root.production}/user/findorCreateCarrierRole`,{accountId:userId});
            if(data.status==200){
                dispatch(setUserType("Carrier"))
                navigation.navigate('Dashboard') 
            }
          else if(data.status==405){
            Alert.alert(data.message)
          }else if(data.status==201){
            Alert.alert(data.message)
          }else if(data.status==500){
            Alert.alert(data.message)
          }
        }
    }

    const handleLogout = async()=>{
        dispatch(setUserData({}))
        dispatch(setUserType('Shipper'))
          const isSignedIn = await GoogleSignin.isSignedIn();
          if(isSignedIn){
            try{
              await GoogleSignin.signOut();
            }catch(err){
              console.log(err.message,'===< signout error')
            }
            }
        navigation.navigate('Login') 
    }

    return (
        <View style={styles.customHeader} >
                      {/* modal 1 */}
                      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Body>
            <Center>
            <Heading style={{fontSize:20,marginTop:10,marginBottom:20}}>Confirm logout</Heading>
            </Center>
            <Button colorScheme='success'
            onPress={handleLogout}
            >Logout</Button>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

            <View style={{ flexDirection: 'row' }} >
                <Icon name='menu' size={35} color='white' onPress={() => navigation.openDrawer()} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                <Text style={{ color: 'white' }} >Shipper</Text>
                <Switch color='#ffffff' value={currentRole === "Shipper" ? false : true} onValueChange={handleRoleChange} />
                <Text style={{ color: 'white' }} >Carrier</Text>
            </View>
           <Button style={{backgroundColor:'white',height:33}}>
               <Text style={{color:'black',fontSize:11}} 
               onPress={()=>setShowModal(true)}
               >
                Logout
                </Text>              
           </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    customHeader: {
        height: 50,
        backgroundColor: '#1A2387',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    headerTitle: {
        color: 'white'
    }
})

export default CustomDrawerHeader
