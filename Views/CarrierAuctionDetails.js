import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View,Alert} from 'react-native';
import StatusBadge from '../Components/StatusBadges/StatusBadge';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Image,
  Heading,
  Text,
  Container,
  Button,
  Center,
  Modal,
  Input,
  Select,
  CheckIcon,
  HStack
} from 'native-base';
import axios from 'axios';
import {Root} from '../Config/root';
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const CarrierAuctionDetails = ({route,navigation}) => {
  const {id} = route.params;
  const [auction, setAuction] = useState({});
  var [bidsList, setBidsList] = useState([]);
  const [auctionStatus, setauctionStatus] = useState('Open');
  var [openTill, setOpenTill] = useState();
  const [error, setError] = useState('');
  const [errorShow, setErrorShow] = useState(false);
  const user = useSelector(state=>state.user)
  const userId = user?.account?._id;
    const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  var [myBid,setMyBid] = useState('');
  var [latestBid,setLatestBid] = useState(0);
  var [myLatest,setMyLatest]=useState({}); 
  var [vehiclesArray, setVehiclesArray] = useState([])
  var [vehicle, setVehicle] = useState('');
  const updation = useSelector(state=>state.updation)
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(setUpdation())
  },[])

  useEffect(() => {
    fetching();
    vehicleFetching();
  }, [id,updation]);

 // fetching auction details  
  const fetching = async () => {
    setErrorShow(false);
    try{
      var {data} = await axios.post(`${Root.production}/auction/getAuctionById`, {
        auctionId: id,
      });
      if (data.status == 200) {
        // setting closing date of auction
        openTill = moment(data.message?.auctionData?.updatedAt, 'YYYY-MM-DD');
        openTill = openTill
        .add(data.message?.auctionData?.auctionDuration, 'days')
        .format('DD-MM-YYYY');
        setOpenTill(openTill);
        setAuction(data.message);
        bidsList = data.message.auctionData.bids;
        setBidsList(bidsList);
      setauctionStatus(auction?.auctionData?.status);
        // fetching latest bid
      setLatestBid(bidsList.length>0 ? bidsList[bidsList.length-1].response.bidAmount : 0);

      // check for update Bid
      if(data.message.auctionData.bids.length>0){
      myLatest = data.message.auctionData.bids.reverse().filter(val=>{
          return val
        })
      }
      setMyLatest(myLatest)
      // end of checking      

    } else {
      setError(data.message);
      setErrorShow(true);
    }
    var today = moment().format('DD-MM-YYYY');
    if (today > openTill) {
      // terminate auction of date exceeded
      var {data} = await axios.post(
        `${Root.production}/auction/terminateAuction`,
        {
          auctionId: id,
        },
        );
        if (data.status == 200) {
          setauctionStatus('Closed');
        } else {
          setError(data.message);
          setErrorShow(true);
        }
      }
    }catch(err){
      setErrorShow(true)
      setError(err.message)
    }
    };
    
    // function to fetch vehicles data
    const vehicleFetching=async()=>{
      setErrorShow(false);
      // fetch vehicles
    // var { data } = await axios.post(`${Root.production}/vehicle/getVehicleByUser`, { accountId: user.account._id })
    try{
      var { data } = await axios.post(`${Root.production}/vehicle/getVehicleByUser`, { accountId: userId })
      if (data.status == 200) {
        vehiclesArray = data.message;
        setVehiclesArray(vehiclesArray)
      }
      else {
        setErrorShow(true)
        setError(data.message)
        // alert(data.message)
      }
    }catch(err){
      setErrorShow(true)
      setError(err.message)
    }
  }

  // function to accept auction
  const handleAcceptAuction=async()=>{
    setErrorShow(false);
    try{
      var {data} =await axios.post(`${Root.production}/auction/acceptShipmentOffer`,{
        auctionId : id,
        shipmentId : auction.auctionData.shipmentOfferId
      })
      if(data.status==200){
        // navigatin.navigate('AvailableAuctions');
      dispatch(setUpdation())
    }
    else{
      setErrorShow(true)
      setError(data.message)
    }
  }catch(err){
    setErrorShow(true)
    setError(err.message)}
  }
// handle fuction for reject offer on auction
  const handleRejecttAuction=async ()=>{
    setErrorShow(false);
    try{
      var {data} =await axios.post(`${Root.production}/auction/rejectShipmentOffer`,{
        auctionId : id,
        shipmentId : auction.auctionData.shipmentOfferId
      })
      if(data.status==200){
        navigation.navigate('AvailableAuctions');
      }
    else{
      setErrorShow(true)
      setError(data.message)
    }
  }catch(err){
    setErrorShow(true)
    setError(err.message)}
  }

    // handle function for popup of bid 
  const closePopUp=async()=>{
    setErrorShow(false);
    if(auction?.auctionData.bids.length==0 && Number(myBid) > auction.auctionData.startingBid){
      Alert.alert('Your bid should be less than or equal to starting bid.')
    }
   else if(auction.auctionData.bids.length>0 && Number(myBid) > latestBid-10){
    Alert.alert('Your bid should be atleast 10 Rs less than current bid.')
    }
    else if(vehicle==""){
      Alert.alert('Please Select Vehicle first');
    }
    else{
      try{
        var {data} = await axios.post(`${Root.production}/auction/createBid`,{
          bidAmount:myBid,
          auctionId:auction.auctionData._id,
          carrierId : userId,
          vehicleId:vehicle
        })
        if(data.status==200){
          handleClose();
          dispatch(setUpdation())
          // navigation.navigate('AvailableAuctions')

        }else{
          setErrorShow(true)
          setError(data.message)
        }
        handleClose(); 
      }catch(err){
        setErrorShow(true)
        setError(err.message)}
  }
  }

  return (
    <ScrollView style={styles.parent}>

      <Text style={styles.heading}>Auction Details</Text>
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
      <Text style={styles.heading1}>Auction Id # {id}</Text>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.Body>
              <Heading size='md'>Bid on it</Heading>
           <Text>
          Latest Bid :{auction ? latestBid+'Rs' : 'Loading'}
          </Text>
        <Text>
          Enter your bid here :
        </Text>
                          <Select
              selectedValue={vehicle}
          accessibilityLabel="Select Vehicle"
          variant="underlined"
          placeholder="Select Vehicle"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setVehicle(itemValue)}
        >
            {
                vehiclesArray.map((v,i)=>(
                    <Select.Item key={i}  label={`${v.model}-${v.year}`} value={v._id} />
                ))
            }
        </Select>
        
        <Input label='bid' variant="underlined" placeholder="Enter your Bid" value={myBid} onChangeText={(text) => setMyBid(text)} />
        
            <Button
            colorScheme="success"
              flex="1"
              onPress={()=>{
                if(Number(myBid)<1){
                  Alert.alert('Please enter your bid first')
                }else{
                  closePopUp()
                }
                }}
            >{myLatest.length>0 &&
              myLatest[0].response.bidAmount!=0 ? 'Update' : 'Bid'}
            </Button>
            </Modal.Body>
        </Modal.Content>
      </Modal>


      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 20,
          marginTop: 10,
        }}>
        <Text>Status: </Text>
        <StatusBadge tag={auction?.auctionData?.status} />
        {
          auction?.auctionData?.status==='Open' &&
        <Button colorScheme="info" onPress={()=>handleOpen()} style={{position:'absolute',right:80}}>
        {myLatest?.length>0 && myLatest[0]?.response?.bidAmount!=0 ? 'Update Bid' : 'Bid' }
        </Button>
        }
      </View>
        { auction?.auctionData?.choosenCarrierId &&
// (auction.auctionData.status === 'On Hold' && auction.auctionData.choosenCarrierId == user.account._id) &&
(auction?.auctionData?.status === 'On Hold' ) &&
        <HStack style={{marginLeft:100,marginTop:10}}>
        <Button style={{marginRight:10}} colorScheme="success" onPress={handleAcceptAuction}>Accept</Button>
        <Button colorScheme="danger" onPress={handleRejecttAuction}>Reject</Button>
        </HStack>
        }
      <View style={styles.container}>
        <Container style={styles.data}>
          <Text>
          Latest Bid :{auction ? latestBid+'Rs' : 'Loading'}
          </Text>
          {myLatest.length>0 &&
          <Text>
          Your bid :{myLatest?.length>0 && myLatest[0]?.response?.bidAmount}Rs
          </Text>
}
        </Container>

        <Heading size="md" style={styles.subheading}>
          PickUp Details
        </Heading>
        <Container style={styles.data}>
          <Text>
            City : {auction ? auction?.auctionData?.pickupCity : 'Loading...'}
          </Text>
          <Text>
            Address :{' '}
            {auction ? auction?.auctionData?.pickupAddress : 'Loading...'}
          </Text>
          <Text>
            Date : {auction ? auction?.auctionData?.pickupDate : 'Loading...'}
          </Text>
          <Text>
            Time : {auction ? auction?.auctionData?.pickupTime : 'Loading...'}
          </Text>
        </Container>

        <Heading size="md" style={styles.subheading}>
          Dropoff Details
        </Heading>
        <Container style={styles.data}>
          <Text>
            Contact Name :{' '}
            {auction ? auction?.auctionData?.dropOffContactName : 'Loading...'}
          </Text>
          <Text>
            Contact Number :{' '}
            {auction
              ? auction?.auctionData?.dropOffContactNumber
              : 'Loading...'}
          </Text>
          <Text>
            City :{' '}
            {auction ? auction?.auctionData?.destinationCity : 'Loading...'}
          </Text>
          <Text>
            Address :{' '}
            {auction ? auction?.auctionData?.destinationAddress : 'Loading...'}
          </Text>
          <Text>
            Date : {auction ? auction?.auctionData?.dropOffDate : 'Loading...'}
          </Text>
          <Text>
            Time : {auction ? auction?.auctionData?.dropOffTime : 'Loading...'}
          </Text>
        </Container>

        <Heading size="md" style={styles.subheading}>
          Package Details
        </Heading>
        <Container style={styles.data}>
          {
            (auction?.packageData?.packageImageUrl!=undefined) &&
            <Image
              source={{
                uri:auction?.packageData?.packageImageUrl,
              }}
              alt="Alternate Text"
              size="xl"
            />
          }
          <Text>
            Package Id : {auction ? auction?.packageData?._id : 'Loading...'}
          </Text>
          <Text>
            Size :{' '}
            {auction ? auction?.packageData?.packageHeight : 'Loading...'}cm X{' '}
            {auction ? auction?.packageData?.packageWidth : 'Loading...'}cm
          </Text>
          <Text>
            Weight :{' '}
            {auction ? auction?.packageData?.packageWeight : 'Loading...'}Kg
          </Text>
          <Text>
            Type : {auction ? auction?.packageData?.packageType : 'Loading...'}
          </Text>
        </Container>
        <Heading size="md" style={styles.subheading}>
          Auction Details
        </Heading>
        <Container style={styles.data}>
          <Text>
            Starting Bid :{' '}
            {auction ? auction?.auctionData?.startingBid : 'Loading...'}Rs
          </Text>
          <Text>Auction Open Till : {openTill}</Text>
        </Container>
        {auction?.auctionData?.pickupLattitude && (
          <TripRoutedMap
            departurelati={auction?.auctionData?.pickupLattitude}
            departurelongi={auction?.auctionData?.pickupLongitude}
            destinationlati={auction?.auctionData?.dropOffLattitude}
            destinationlongi={auction?.auctionData?.dropOffLongitude}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    paddingTop: 20,
    paddingLeft: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  heading1: {
    fontSize: 18,
    paddingTop: 20,
    paddingLeft: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    marginLeft: '5%',
    marginBottom: 10,
  },
  subheading: {
    marginTop: 10,
  },
  data: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 20,
  },
  bidsHeading: {
    width: 90,
    backgroundColor: 'lightgray',
    paddingHorizontal: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  bids: {
    width: 90,
    // height:40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
  },
  bidId: {
    width: 90,
    fontSize: 10,
  },
  bidBtn: {
    width: 90,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  parent:{
    width:'105%'
  }
});

export default CarrierAuctionDetails;
