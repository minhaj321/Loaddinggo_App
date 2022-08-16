import React,{useState,useEffect} from 'react'
import { Text,View,StyleSheet } from 'react-native'
import { Input, Heading,Button,Select ,CheckIcon} from "native-base"
import {Cities} from './../Components/Cities/Cities';
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Root} from './../Config/root';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';
            

const EditProfile = ({navigation}) => {

    const [firstName,setFirstName]=useState('')
    const [lastName,setLastName]=useState('')
    const [street,setStreet]=useState('')
    const [town,setTown]=useState('')
    const [city,setCity]=useState('')
    const [province,setProvince]=useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    var user=useSelector(state=>state.user);
    const userId = user?.account?._id

    useEffect(()=>{
        fetching()
    },[])

    // getting user data 
    const fetching = async()=>{
        var {data} = await axios.post(`${Root.production}/user/getUserById`,{accountId:userId})
        if(data.status==200){
            setFirstName(data.message.firstName)
            setLastName(data.message.lastName)
            setStreet(data.message.street)
            setTown(data.message.town)
            setProvince(data.message.province)
        }
    }
// edit profile method
    const handleEditProfile=async()=>{
      setErrorShow(false);
        try{
        setErrorShow(false)
        if(firstName ==='' || lastName==='' || street==='' || town==='' || city==='' || province===''){
            setError('Please fill all fields');
            setErrorShow(true)
        }else{
            var {data} = await axios.post(`${Root.production}/user/editProfile`,{
                firstName,
                lastName,
                street,
                town,
                city,
                province,
                accountId:userId
            })
            if(data.status==200){
                navigation.navigate('Profile');
            }
            else{
                setError(data.message);
                setErrorShow(true)
            }
        }
    }
    catch(err){
        setError(err.message);
        setErrorShow(true)

    }
    }

    return (
        <View>
            <Text style={styles.heading}>Edit Profile</Text>
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:250}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Edit Profile Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
        <View
            style={{marginTop:5,width:'40%',height:'100%'}} >
                <Text style={styles.tags}>First Name :</Text>
                <Text style={styles.tags}>Last Name :</Text>
                <Text style={styles.tags}>Street :</Text>
                <Text style={styles.tags}>Town :</Text>
                <Text style={styles.tags}>City :</Text>
                <Text style={styles.tags}>Province :</Text>
            </View>
            <View
            style={{width:'50%',height:'100%',position:'absolute',left:"45%",top:'12%'}}>
            <Input style={styles.Input} onChangeText={txt=>setFirstName(txt)} value={firstName} variant="underlined" placeholder="Minhaj" />
            <Input style={styles.Input} onChangeText={txt=>setLastName(txt)} value={lastName} variant="underlined" placeholder="Sohail" />
            <Input style={styles.Input} onChangeText={txt=>setStreet(txt)} value={street} variant="underlined" placeholder="312" />
            <Input style={styles.Input} onChangeText={txt=>setTown(txt)} value={town} variant="underlined" placeholder="Landhi" />
            <Select
            selectedValue={city}
        // minWidth="200"
        accessibilityLabel="Choose City"
        placeholder="Choose City"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        variant={'underlined'}
        mt={1}
        onValueChange={(itemValue) => setCity(itemValue)}
      >
          {
              Cities.map((v,i)=>(
                  <Select.Item key={i}  label={v} value={v} />
              ))
          }
      </Select>
            <Input style={styles.Input} onChangeText={txt=>setProvince(txt)} variant="underlined" placeholder="Sindh" />
            <View>
            <Button  style={styles.button} value={province} onPress={handleEditProfile} size="sm">Save Changes</Button>
            </View>
            </View>


        </View>
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
        fontSize:13,
        paddingTop:33,
        paddingLeft:20,
        textDecorationColor:'black',
    },
    Input:{
        fontSize:13,
        paddingTop:15,
    },
    button:{
        width:110,
        marginTop:30
    }
})

export default EditProfile
