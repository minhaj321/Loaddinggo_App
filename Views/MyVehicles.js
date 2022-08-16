import React,{useState,useEffect} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import {Button,Flex,HStack,VStack,Text,Modal,Input} from 'native-base'
import Vehicle from '../Components/Cards/Vehicle';
import axios from 'axios';
import {Root} from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Heading} from 'native-base'
import { useSelector,useDispatch } from 'react-redux';
import { setUpdation } from '../Store/action';

const MyVehicles = () => {

var [vehiclesArray,setVehiclesArray] = useState([])
const [error,setError] = useState('')
const [licensePlate,setLicensePlate] = useState('')
const [color,setColor] = useState('')
const [manufacturer,setManufacturer] = useState('')
const [model,setModel] = useState('')
const [year,setYear] = useState('')
const [errorShow,setErrorShow] = useState(false)
const [showModal,setShowModal] = useState(false);
const [addShow,setAddShow] = useState(false);
const user = useSelector(state=>state.user);
const userId = user?.account?._id;
const updation = useSelector(state=>state.updation)
const dispatch = useDispatch();


useEffect(()=>{
  dispatch(setUpdation())
},[])

useEffect(()=>{
fetching();
},[userId,updation])

// fetching vehicles
const fetching=async()=>{
    setErrorShow(false);
    try{
      var {data} =  await axios.post(`${Root.production}/vehicle/getVehicleByUser`,{
        accountId : userId
      })
      if(data.status==200){
        setVehiclesArray(data.message)
      }
      else{
          setError(data.message)
          setErrorShow(true)
      }
  }
  catch(err){
  setError(err.message)
  setErrorShow(true)
  }
  
  }
  
  // add new vehicle method
const handleAddNew =async()=>{
  if(licensePlate==='' || color==='' || manufacturer==='' || model==='' ||
  year===''){
    setError('Please fill all fields.');
    setAddShow(true)
  }else{
    setAddShow(false);
    try{
  
      var {data} = await axios.post(`${Root.production}/vehicle/addVehicle`,{
        licensePlate,
          manufacturer,
          model,
          year,
          color,
          accountId : userId
        })
        if(data.status==200){
          setShowModal(false)
          dispatch(setUpdation())
      }
      else{
        setError(data.message)
        setAddShow(true)
      }
    }catch(err){
      setError(err.message)
      setAddShow(true)
    }

  }

}

    return (
        <View>
            <Text style={styles.heading}>My Vehicles</Text>
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
            <Flex ml={220} mr={10}>
            <Button colorScheme="blue" onPress={()=>setShowModal(true)} size={'sm'}>
                Add New                
            </Button>
            </Flex>
            
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>{`Add Vehicle`}</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
            {
              addShow &&
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

                      <Input style={styles.Input} value={licensePlate}
                      onChangeText={txt=>setLicensePlate(txt)}
                      variant="underlined" placeholder="licensePlate" />
                      <Input style={styles.Input} value={manufacturer}
                      onChangeText={txt=>setManufacturer(txt)}
                      variant="underlined" placeholder="manufacturer" />
                      <Input style={styles.Input} value={model}
                      onChangeText={txt=>setModel(txt)}
                      variant="underlined" placeholder="model" />
                      <Input style={styles.Input} value={year}
                      onChangeText={txt=>setYear(txt)}
                      variant="underlined" placeholder="year" />
                      <Input style={styles.Input} value={color}
                      onChangeText={txt=>setColor(txt)}
                      variant="underlined" placeholder="color" />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={handleAddNew}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <ScrollView style={{marginBottom:170}}>
      {
              vehiclesArray.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>You don't have any Vehicle.</Text>
            }
          {
            vehiclesArray &&
            vehiclesArray.reverse().map((v,i)=>{
                return(
                    <Vehicle data={v}/>
                )
            })  
          }
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        fontWeight:'bold'
    },
    button1:{
        width:70,
        height:40,
    },
    button:{
        width:70,
        height:40,
        marginLeft:-12
    },
    btn_group:{
        marginTop:20,
        marginBottom:20
    },
    parent:{
        fontSize:20,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        fontWeight:'bold'
    },
  vStack:{
      marginLeft:'10%'
  },
      Input:{
          fontSize:13,
          paddingTop:15,
          width:'90%'
      },
      uploadSection: {
          borderWidth: 1,
          borderRadius: 2,
          backgroundColor: '#F8F9FB',
          width: "90%",
      },
    })



export default MyVehicles
