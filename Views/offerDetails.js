import moment from 'moment'
import React,{useEffect,useState} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import StatusBadge from '../Components/StatusBadges/StatusBadge'
import { Flex,AlertDialog,Center,Heading,Text,Container,Button ,Stack,Modal,VStack,HStack,Image,Checkbox} from 'native-base';
import { Root } from '../Config/root';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap'
import { useSelector,useDispatch } from 'react-redux';
import { setUpdation } from '../Store/action';

const OfferDetails = ({route,navigation}) => {

    const user = useSelector(state=>state.user);
    const userId = user?.account?._id;
    var {id} = route.params;
    var [shipment,setShipment] = useState({});
    const [error,setError] = useState('')
    const [alertBody,setAlertBody] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    const [loading,setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    
    useEffect(()=>{
      dispatch(setUpdation())
    },[])
    
    useEffect(()=>{
      fetching();
    },[id,updation])

      // data fetching
    const fetching=async()=>{
      setErrorShow(false);
      try{
      var {data} =  await axios.post(`${Root.production}/trip/viewShipmentOfferDetails`,{
          shipmentOfferId : id
      })
      if(data.status==200){
          shipment=data.message
          setShipment(data.message)
          setLoading(false)
var get= data.message.shipmentOffer.createdAt;

let target = moment(get).format()

let newtarget = moment(target).add(15 , 'minutes').format();


let flag = moment(new Date()).isBefore(newtarget)


if( !flag   && data.message.shipmentOffer.status=='Pending'){
  const response= await axios.post(`${Root.production}/trip/expireShipmentOffer` , {shipmentOfferId: id })
  if(response.data.status==200){
  }
}
// end 

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
      // handle fuction to start offer
    const handleStartShipment=async()=>{
      setErrorShow(false);
      try{
        var {data} = await axios.post(`${Root.production}/trip/startSingleShipment`,{
          shipmentOfferId:id,
        })
        if(data.status==200){          
        dispatch(setUpdation())
      }else{
          setErrorShow(true)
          setError(data.message)

        }
      }catch(err){
        setErrorShow(true)
        setError(err.message)

      }

      }
      // handle fuction to accept offer
      const handleAcceptOffer = async ()=>{
        setErrorShow(false);
        try{
        var {data} = await axios.post(`${Root.production}/trip/acceptShipmentOffer`,{
          shipmentOfferId:id,
          carrierId:userId
        })
        if(data.status==200){
            setAlertBody('You have accepted this request');
            dispatch(setUpdation())
            setIsOpen(true)
        }else{
          setErrorShow(true)
          setError(data.message)}
      }catch(err){
        setErrorShow(true)
        setError(err.message)}
      }
      // handle fuction to reject offer
      const handleRejectOffer = async ()=>{
        setErrorShow(false);
        try{
        var {data} = await axios.post(`${Root.production}/trip/rejectShipmentOffer`,{
          shipmentOfferId:id,
        })
        if(data.status==200){
          dispatch(setUpdation())

        }else{
          setErrorShow(true)
          setError(data.message)}
      }catch(err){
        setErrorShow(true)
        setError(err.message)}

      }
      // close alert box
      const handleAlertClose=()=>{
          setIsOpen(false);
          navigation.navigate('Dashboard')
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
            <Text style={styles.heading}>Offer Details</Text>

            <View style={{flexDirection:'row',alignItems:'center',marginLeft:20,marginTop:10}} >
            <Text>Status: </Text><StatusBadge tag={shipment?.shipmentOffer?.status} />
            <Button size="sm" colorScheme="danger" style={{position:'absolute',right:40}}>Complaint</Button>
            </View>
            <Stack
          mb="0"
          mt="2.5"
          direction={{
            base: "row",
            // md: "row",
          }}
          space={2}
          mx={{
            base: "auto",
            md: "0",
          }}
        >
        {(shipment?.shipmentOffer?.status==='Pending') && (
            <Flex direction="row">
                <Button size="sm" colorScheme="success" onPress={()=>handleAcceptOffer()}>Accept</Button>
                <Button size="sm" ml={5} colorScheme="danger" onPress={()=>handleRejectOffer()}>Reject</Button>
                <Button size="sm"  ml={5} onPress={()=>handleRejectOffer()}>Shipper's Profile</Button>
            </Flex>
        )}
        {( shipment?.shipmentOffer?.status==='Waiting') && (
            <Button size="sm" colorScheme="success" onPress={()=>handleStartShipment()}>Start Shipment</Button>
        )}
        {
            (shipment?.shipmentOffer?.status === "Waiting" || shipment?.shipmentOffer?.status === "Active") &&
                <Button size="sm"
                onPress={()=>navigation.navigate('Chat',{
                    id:shipment.shipmentOffer.chatRoomId
                })}
                >Chat</Button>
        }
        {(shipment?.shipmentOffer?.status!=='Pending') && (
                <Button size="sm"
                style={(shipment?.shipmentOffer?.status!='Active' && shipment?.shipmentOffer?.status!='Waiting') ? {right:20} : {}}
                onPress={()=>navigation.navigate('Profile',{
                    id:shipment.shipmentOffer.accountId
                })}
                >Shipper's Profile</Button>
        )}
                </Stack>
            <View style={styles.container}>
            <Heading size="sm" style={styles.subheading}>
                Shipment Id # {shipment?.shipmentOffer?._id}
                </Heading>

                <Heading size="md" style={styles.subheading}>
                PickUp Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                        City : {loading ? <Text>Loading...</Text>  : shipment?.shipmentOffer?.pickupCity}
                    </Text>
                    <Text>
                        Address : {loading ? <Text>Loading...</Text>  : shipment?.shipmentOffer?.pickupAddress}
                    </Text>
                    <Text>
                        Date : {loading ? <Text>Loading...</Text>  : shipment?.shipmentOffer?.pickupDate}
                    </Text>
                </Container>
                
                <Heading size="md" style={styles.subheading}>
                DropOff Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    Contact Name :{loading ? <Text>Loading...</Text>  : 
              shipment?.shipmentOffer?.dropOffContactName
            }
                    </Text>
                    <Text>
                    Contact Number :{loading ? <Text>Loading...</Text>  : 
              shipment?.shipmentOffer?.dropOffContactNumber
            }
                    </Text>                    
                    <Text>
                    City : {loading ? <Text>Loading...</Text>  : shipment?.shipmentOffer?.destinationCity}
                    </Text>
                    <Text>
                    Address : {loading ? <Text>Loading...</Text>  : shipment?.shipmentOffer?.destinationAddress}
                    </Text>
                </Container>

                <Heading size="md" style={styles.subheading}>
                Package Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                        Package Id : {loading ? <Text>Loading...</Text>  : shipment?.package?._id}
                    </Text>
                    <Text>
                        Size : {loading ? <Text>Loading...</Text>  : shipment?.package?.packageHeight}cm X{" "}
            {loading ? <Text>Loading...</Text>  : shipment?.package?.packageWidth}cm
                    </Text>                    
                    <Text>
                        Weight : {loading ? <Text>Loading...</Text>  : shipment?.package?.packageWeight}Kg
                    </Text>
                    <Text>  
                        Type : {loading ? <Text>Loading...</Text>  : shipment?.package?.packageType}
                    </Text>
                </Container>
            </View>
            {(shipment?.shipmentOffer?.pickupLongitude) &&
                    <TripRoutedMap
                    departurelati={shipment?.shipmentOffer?.pickupLattitude}
                    departurelongi={shipment?.shipmentOffer?.pickupLongitude}
                    destinationlati={shipment?.shipmentOffer?.dropOffLattitude}
                    destinationlongi={shipment?.shipmentOffer?.dropOffLongitude}
                    />
    }

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
    }
})


export default OfferDetails
