import React,{useState,useEffect} from 'react'
import { Text,View,StyleSheet,ScrollView } from 'react-native'
import { Avatar } from 'react-native-paper';
import { Button } from 'native-base';
import {Center,Heading} from 'native-base'
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const UserProfile = ({navigation,route}) => {

    var {id} = route.params;
    const [userData,setUserData] = useState({})
    const [error,setError] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    const user = useSelector(state=>state.user);
    const userId = user?.account?._id;
    const updation = useSelector(state=>state.updation)

    
useEffect(()=>{
fetching();
},[id,updation])

// getting user info
const fetching=async()=>{
    setErrorShow(false)
        try{
        var {data} = await axios.post(`${Root.production}/user/getUserById`,{accountId:id})
        if(data.status==200){
            setUserData(data.message)
        }else{
            setError(data.message)
            setErrorShow(true)
        }
    }catch(err){
        setErrorShow(true)
        setError(err.message)}

}

    return (
        <ScrollView>
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Fetching Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }            
            <Text style={styles.heading}>My Profile</Text>
{
    (id==userId) &&
            <View>
            <Button 
            startIcon={<MaterialIcons name='edit' size={15} color='white' />}
             size={'sm'} style={{position:'absolute',right:30}} onPress={() => navigation.navigate('edit-profile')}>Edit</Button>
            </View>
        }

        <Center>
            <Avatar.Image style={styles.avatar} size={70} source={{uri:userData.profilePic}} />
            <Text style={{fontSize:18}}>{userData ? userData.firstName : 'MINHAJ'} {userData.lastName}</Text>
            <StarRating
            disabled={true}
            maxStars={5}
            starSize={25}
            fullStarColor='gold'
            halfStarColor='gold'
            rating={Number(userData.rating)}
      />
            </Center>
            <ScrollView>
        <View
            style={{width:'40%',height:'100%'}} >
                <Text style={styles.tags}>Gender:</Text>
                <Text style={styles.tags}>Phone Number:</Text>
                <Text style={styles.tags}>Date Of Birth:</Text>
                <Text style={styles.tags}>Street:</Text>
                <Text style={styles.tags}>Town:</Text>
                <Text style={styles.tags}>Province:</Text>
                <Text style={styles.tags}>City:</Text>
                <Text style={styles.tags}>Shipper Role:</Text>
                <Text style={styles.tags}>Carrier Role:</Text>
            </View>
            <View
            style={{width:'60%',height:'100%',position:'absolute',left:"50%"}}>
                <Text style={styles.data}>{userData.gender}</Text>
                <Text style={styles.data}>{userData.phoneNumber}</Text>
                <Text style={styles.data}>{userData.dateOfBirth}</Text>
                <Text style={styles.data}>{userData.street}</Text>
                <Text style={styles.data}>{userData.town}</Text>
                <Text style={styles.data}>{userData.province}</Text>
                <Text style={styles.data}>{userData.city}</Text>
                <Text style={userData.shipperRole ? {...styles.data,color:'green'} : {...styles.data,color:'red'} }>{userData.shipperRole ? 'Enabled' : 'Disabled '}</Text>
                <Text style={userData.carrierRole ? {...styles.data,color:'green'} : {...styles.data,color:'red'} }>{userData.carrierRole ? 'Enabled' : 'Disabled '}</Text>
            </View>
            </ScrollView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        height:'13%',
        marginBottom:-20
    },
    tags:{
        fontSize:15,
        paddingTop:15,
        paddingLeft:20,
        textDecorationColor:'black',
        // textDecorationLine:'underline'
    },
    data:{
        fontSize:15,
        paddingTop:15,
        paddingLeft:10,
        textDecorationColor:'black',
        // textDecorationLine:'underline'
    },
    avatar:{
        marginTop:20
    }
})

export default UserProfile
