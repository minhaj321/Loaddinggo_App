import React,{useEffect,useState} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import StatusBadge from '../Components/StatusBadges/StatusBadge'
import { AlertDialog,Center,Heading,Text,Container,Button ,Stack,Modal,VStack,HStack,Image,Checkbox} from 'native-base';
import { Root } from '../Config/root';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const VehicleDetails = ({route,navigation}) => {

    var {id} = route.params;
    var [vehicle,setVehicle] =useState({});
    const [error,setError] = useState('')
    const [alertBody,setAlertBody] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(()=>{
        fetching();
    },[id])

    // fetching vehivle details
    const fetching=async()=>{
      setErrorShow(false);
      try{
          console.log('id==>',id)
        var {data} = await axios.post(`${Root.production}/vehicle/getVehicleById`,{vehicleId:id});
      if(data.status==200){
          setVehicle(data.message)
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
    // close alert box
    const handleAlertClose = ()=>{
        // navigation.navigate('my-shipments',{id:shipment.shipmentOffer.accountId})
    }
    // function to delete vehicle
    const ConfirmDeletion =async () =>{
      setErrorShow(false);
      try{
        const {data} = await axios.post(`${Root.production}/vehicle/deleteVehicle`,{vehicleId:id})
        if(data.status==200){
          console.warn('deleted')
        }else{
          setErrorShow(true)
          setError(data.message)}
        }catch(err){
          setErrorShow(true)
          setError(err.message)}
        }

    return (
        <ScrollView style={styles.parent}>

<AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.Body>
              <Center>
            {alertBody}
              <Button colorScheme="success" onPress={handleAlertClose}>
                Close
              </Button>
              </Center>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Header>Confirm Pickup</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Do you want to delete ?</Text>
                {/* <Text color="blueGray.400">$298.77</Text> */}
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={ConfirmDeletion}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
            <Text style={styles.heading}>Shipment Details</Text>
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
            <View style={{flexDirection:'row',alignItems:'center',marginLeft:20,marginTop:10}} >
            <Text>Status: </Text><StatusBadge tag={vehicle?.status} />
            <Button size="sm" colorScheme="danger" style={{position:'absolute',right:40}}
            onPress={()=>setShowModal(true)}
            >Delete</Button>
            </View>
            <View style={styles.container}>

                <Heading size="md" style={styles.subheading}>
                Vehicle Details
                </Heading>
                <Container style={styles.data}>
                    <Text style={styles.text}>Number Plate :{vehicle?.licensePlate}</Text>
                    <Text style={styles.text}>Manufacturer :{vehicle?.manufacturer}</Text>
                    <Text style={styles.text}>Model :{vehicle?.model}</Text>
                    <Text style={styles.text}>Model Year :{vehicle?.year}</Text>
                    <Text style={styles.text}>Color :{vehicle?.color}</Text>
                </Container>
            </View>
        </ScrollView>
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
    container:{
        marginLeft:'5%'
    },
    subheading:{
        marginTop:10
    },
    data:{
        marginTop:10,
        backgroundColor:'lightgray',
        padding:8,
        borderRadius:20        
    },
    parent:{
        marginBottom:20
    },
    text:{
        marginVertical:10,
        paddingHorizontal:4,
    }
})


export default VehicleDetails
