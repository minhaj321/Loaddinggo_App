import React,{useEffect,useState} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import StatusBadge from '../Components/StatusBadges/StatusBadge'
import { Alert,AlertDialog,Center,Heading,Text,Container,Button ,Stack,Modal,VStack,HStack,Image,Checkbox} from 'native-base';
import StarRating from 'react-native-star-rating';
import { Root } from '../Config/root';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap'
import moment from 'moment'
import Complaint from './../Components/complaint/Complaint';
import { useSelector,useDispatch } from 'react-redux';
import { setUpdation } from '../Store/action';

const shipmentDetails = ({route,navigation}) => {

    var {id} = route.params;
    var [shipment,setShipment] = useState({});
    const [error,setError] = useState('')
    const [alertBody,setAlertBody] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    const [check,setCheck] = useState(false)
    const [loading,setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [showModal3, setShowModal3] = useState(false)
    const [showModal4, setShowModal4] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(2.5)
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    
    
    useEffect(()=>{
      dispatch(setUpdation())
    },[])
    
    const onClose = () => setIsOpen(false)

    useEffect(()=>{
      fetching();
    },[id,updation])

    // getting offer details
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
// date checking begin
var get= data.message.shipmentOffer.createdAt;
// var target = moment().format('LT');

let target = moment(get).format()

let newtarget = moment(target).add(15 , 'minutes').format();


let flag = moment(new Date()).isBefore(newtarget)


if( !flag   && data.message.shipmentOffer.status=='Pending'){
  const response= await axios.post(`${Root.production}/trip/expireShipmentOffer` , {shipmentOfferId: id })
  if(response.data.status==200){
    // window.location.reload();
    console.log("pending shipment has been expired");
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
  // method to handle terms and cond
    const handleTermsConditions = async() => {
      setErrorShow(false);
        // api will be called
        try{
        var {data} = await axios.post(`${Root.production}/trip/verifyShipment`,{
          shipmentOfferId:shipment.shipmentOffer._id
        })
        if(data.status==200){
            setShowModal2(false);
            setShowModal(false);
            setAlertBody('Pickup confirmed');
            dispatch(setUpdation())
            setIsOpen(true)
      }
      else{
        setErrorShow(true)
        setError(data.message)}   } 
        catch(err){
          setErrorShow(true)
          setError(err.message)}
      };
  // method to confirm dropoff
      const handleConfirmDropoff = async() => {
        setErrorShow(false);
        try{
        var {data} = await axios.post(`${Root.production}/trip/confirmDropOff`,{
          shipmentOfferId : shipment.shipmentOffer._id
        })
        if(data.status==200){
          setShowModal3(false);
          setShowModal4(true)
          setAlertBody('Your shipment has been confirmed as delivered.')
          dispatch(setUpdation())
          setIsOpen(true)
        }
      else{
        setErrorShow(true)
        setError(data.message)}   } 
        catch(err){
          setErrorShow(true)
          setError(err.message)}
      };
  // method to handle rating
      const handleRating = async() => {
        setErrorShow(false);
        try{
        var {data} = await axios.post(`${Root.production}/trip/giveRating`,{
          rating:rating,
          accountId:shipment.shipmentOffer.carrierId
        })
        if(data.status==200){
          alert(feedback);
          setAlertBody('Thank you for your feedback.')
          dispatch(setUpdation())
          setIsOpen(true)
          setShowModal4(false);
        }
      else{
        setErrorShow(true)
        setError(data.message)}   } 
        catch(err){
          setErrorShow(true)
          setError(err.message)}

      };
// close alert
      const handleAlertClose = ()=>{
          navigation.navigate('my-shipments',{id:shipment.shipmentOffer.accountId})
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
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Header>Confirm Pickup</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Verify Your Shipment Pickup</Text>
                {/* <Text color="blueGray.400">$298.77</Text> */}
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
              {
shipment!={} &&
          <Image
          style={{width:'100%',height:250}}
      source={{
        uri: `${shipment?.shipmentOffer?.verificationImage}`,
      }}
      alt="There is no image till yet"
      size="xl"
      />
    }
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal2(true)
              }}
            >
              Verify
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.Body>
              <Heading size='md'>Terms {'&'} Conditions</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            quod, itaque temporibus eius aliquid ab ex fugit vitae dolorum
            hic aperiam, maxime asperiores iure pariatur rem. Sint,
            repellat animi! Odio.
          </Text>
          <HStack style={{marginTop:20}}>
          <Checkbox value={check} onChange={()=>setCheck(!check)} />
              <Text> I accept all these terms and conditions</Text>
          </HStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
            disabled={!check}
            colorScheme="success"
              flex="1"
              onPress={handleTermsConditions}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal3} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Header>Confirm DropOff</Modal.Header>
          <Modal.Body>
              <Center>
                <Text fontWeight="medium">Do you confirm delivery of your shipment ?</Text>
                <HStack>
            <Button
            colorScheme="secondary"
              flex="1"
              onPress={() => {
                setShowModal3(false)
              }}
            >
              Cancel
            </Button>
            <Button
            colorScheme="success"
              flex="1"
              onPress={handleConfirmDropoff}
            >
              Yes
            </Button>
                </HStack>
              </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal4} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Body>
              <Center>
                <Text fontWeight="medium">Rate this Carrier</Text>
                <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            selectedStar={(v) => setRating(v)}
      />
            <Button
            colorScheme="success"
              flex="1"
              onPress={handleRating}
            >
              Rate
            </Button>
              </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>
            <Text style={styles.heading}>Shipment Details</Text>

            <View style={{flexDirection:'row',alignItems:'center',marginLeft:20,marginTop:10}} >
            <Text>Status: </Text><StatusBadge tag={shipment?.shipmentOffer?.status} />
            { (shipment?.package?.packageStatus != 'Expired' && shipment?.package?.packageStatus != 'Pending') &&
              <Complaint navigation={navigation}
              shipmentId={shipment.shipmentOffer!=null && shipment.shipmentOffer._id}
             carrierId={shipment.shipmentOffer!=null && shipment.shipmentOffer.carrierId} 
             packageId={shipment.package!=null && shipment.package._id} 
             chatRoomId={shipment.shipmentOffer!=null && shipment.shipmentOffer.chatRoomId} 
             shipperId={shipment.shipmentOffer!=null && shipment.shipmentOffer.accountId}
              />
            }
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
        {(shipment?.shipmentOffer?.verified && shipment?.shipmentOffer?.status==='Active' &&  shipment?.package?.packageStatus==='dropped_off') && (
                <Button size="sm" colorScheme="blue" onPress={()=>setShowModal3(true)}>Confirm DropOff</Button>
        )}
        {(!shipment?.shipmentOffer?.verified && shipment?.shipmentOffer?.status==='Active') && (
            <Button size="sm" colorScheme="blue" onPress={()=>setShowModal(true)}>Confirm Pickup</Button>
        )}
        {
            (shipment?.shipmentOffer?.status === "Waiting" || shipment?.shipmentOffer?.status === "Active") &&
                <Button size="sm" style={shipment?.shipmentOffer?.status=='Waiting' ? {marginLeft:100} : {}}>Chat</Button>
        }
                <Button size="sm"
                style={(shipment?.shipmentOffer?.status!='Active' && shipment?.shipmentOffer?.status!='Waiting') ? {position:'absolute',left:0} : {}
              }
              onPress={()=>navigation.navigate('Profile',{
                id:shipment.shipmentOffer.carrierId
            })}
                >Carrier Profile</Button>
                {/* <Button size="sm">asd</Button> */}
                </Stack>
            <View style={styles.container}>
            <Heading size="sm" style={styles.idHeading}>
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
    idHeading:{
      marginTop:40
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


export default shipmentDetails
