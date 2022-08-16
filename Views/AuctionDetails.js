import React,{useState,useEffect} from 'react'
import {Alert,ScrollView,StyleSheet,View} from 'react-native';
import StatusBadge from '../Components/StatusBadges/StatusBadge'
import moment from 'moment';
import {Container,Button ,Modal} from 'native-base';
import axios from 'axios';
import {Root} from '../Config/root';
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const AuctionDetails = ({route}) => {

    const {id} = route.params;
    const [auction,setAuction] = useState({});
    const [bidsList,setBidsList] = useState([]);
    const [auctionStatus,setauctionStatus] = useState('Open');
    var [openTill,setOpenTill]=useState(); 
    const [error,setError] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    var [open,setOpen] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();


useEffect(()=>{
  dispatch(setUpdation())
},[])

    useEffect(()=>{
        fetching();
    },[id,updation])
    
    // fetching method
    const fetching=async()=>{
      setErrorShow(false);
        try{
      // fetching auction by id 

        var {data} = await axios.post(`${Root.production}/auction/getAuctionById`,{auctionId:id})
        if(data.status==200){
        // setting closing date of auction
          openTill = moment(data.message?.auctionData?.updatedAt,'YYYY-MM-DD');      
          openTill = openTill.add(data.message?.auctionData?.auctionDuration,'days').format('DD-MM-YYYY');
          setOpenTill(openTill)
          console.log('yes karo')
            setAuction(data.message);
            bidsList=data.message.auctionData.bids;
            console.log(bidsList.length)
          setBidsList(bidsList);
          setauctionStatus(auction?.auctionData?.status)
        }else{
            setError(data.message)
            setErrorShow(true)
        }
    }catch(err){
        setError(err.message)
        setErrorShow(true)
    }
        var today=moment().format('DD-MM-YYYY');
        if(today>openTill){
        try{
          var {data} = await axios.post(`${Root.production}/auction/terminateAuction`,{
            auctionId : id
          })
          if(data.status==200){
          setauctionStatus('Closed');
          }
          else{
            setError(data.message)
            setErrorShow(true)
          }
        }catch(err){
            setError(err.message)
            setErrorShow(true)
        }
        }
    }
    // close auction method
      const closeAuction=async()=>{
      setErrorShow(false);
          try{
              var {data} = await axios.post(`${Root.production}/auction/terminateAuction`,{
                auctionId : id
              })
              if(data.status==200){
        dispatch(setUpdation())
        setauctionStatus('Closed');
                setOpen(false);
              }
              else{
                  setErrorShow(true)
                  setError(data.message)
              }
          }catch(err){
            setErrorShow(true)
            setError(err.message)
        }
      }
  
    // method to choose any bid    
      const handleChooseBid=async(auctionId,bidId)=>{
      setErrorShow(false);
          try{
        var {data} = await axios.post(`${Root.production}/auction/chooseBid`,{auctionId,bidId})
        if(data.status==200){
          setauctionStatus('On Hold');     
        //   navigation.navigate('MyAuctions')
        dispatch(setUpdation())
        }
        else{
            setErrorShow(true)
            setError(data.message)
        }
    }catch(err){
      setErrorShow(true)
      setError(err.message)
  }
      }

    return (
        <ScrollView style={styles.parent}>

<Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.Body>
              <Heading size='md'>Terms {'&'} Close Auction</Heading>
          <Text>
            Do you really want to close this auction ? 
          </Text>
            <Button
            colorScheme="success"
              flex="1"
              onPress={closeAuction}
            >
              Yes
            </Button>
            </Modal.Body>
        </Modal.Content>
      </Modal>

            <Text style={styles.heading}>Auction Details</Text>
            {
              (errorShow && error!='"bidsList" is read-only') &&
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

            <View style={{flexDirection:'row',alignItems:'center',marginLeft:20,marginTop:10}} >
            <Text>Status: </Text><StatusBadge tag={auction?.auctionData?.status} />
            {
                auction?.auctionData?.status==='Open' &&
            <Button size="sm" colorScheme="danger" style={{position:'absolute',right:40}}
                  onPress={()=>setOpen(true)}
            >Close Auction</Button>
        }
            </View>  
            <View style={styles.container}>
                <Heading size="md" style={styles.subheading}>
                Current Winner
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    CarrierId : {auction?.auctionData?.bids[auction?.auctionData?.bids?.length-1] ? auction?.auctionData?.bids[auction?.auctionData?.bids.length-1].response.carrierId : 'No bid yet'}
                    </Text>
                    <Text>
                    Bid : {auction?.auctionData?.bids[auction?.auctionData?.bids?.length-1] ? auction?.auctionData?.bids[auction?.auctionData?.bids.length-1].response.bidAmount+'Rs' : 'No bid yet'}
                    </Text>
                </Container>
                
                <Heading size="md" style={styles.subheading}>
                PickUp Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    City : {auction ? auction?.auctionData?.pickupCity : 'Loading...'}
                    </Text>   
                    <Text>
                    Address : {auction ? auction?.auctionData?.pickupAddress : 'Loading...'}
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
                    Contact Name : {auction ? auction?.auctionData?.dropOffContactName : 'Loading...'}
                    </Text>  
                    <Text>
                    Contact Number : {auction ? auction?.auctionData?.dropOffContactNumber : 'Loading...'}
                    </Text>  
                    <Text>
                    City : {auction ? auction?.auctionData?.destinationCity : 'Loading...'}
                    </Text>   
                    <Text>
                    Address : {auction ? auction?.auctionData?.destinationAddress : 'Loading...'}
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
                    <Text>
                    Package Id : {auction ? auction?.packageData?._id : 'Loading...'}
                    </Text>
                    <Text>
                    Size : {auction ? auction?.packageData?.packageHeight : 'Loading...'}cm X {auction ? auction?.packageData?.packageWidth : 'Loading...'}cm
                    </Text>                    
                    <Text>
                    Weight  : {auction ? auction?.packageData?.packageWeight : 'Loading...'}Kg
                    </Text>
                    <Text>
                    Type  : {auction ? auction?.packageData?.packageType : 'Loading...'}
                    </Text>
                </Container>
                <Heading size="md" style={styles.subheading}>
                Auction Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    Starting Bid : {auction ? auction?.auctionData?.startingBid : 'Loading...'}Rs
                    </Text>
                    <Text>
                    Auction Open Till  : {openTill}
                    </Text>
                </Container>
                {(auction?.auctionData?.pickupLattitude) &&
                    <TripRoutedMap
                    departurelati={auction?.auctionData?.pickupLattitude}
                    departurelongi={auction?.auctionData?.pickupLongitude}
                    destinationlati={auction?.auctionData?.dropOffLattitude}
                    destinationlongi={auction?.auctionData?.dropOffLongitude}
                    />

                }
                <Container>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <Text style={styles.bidsHeading}>Carrier Id</Text>
                        <Text style={styles.bidsHeading}>Bid</Text>
                        <Text style={styles.bidsHeading}>Choose</Text>
                    </View>
                    {auction?.auctionData?.bids &&
                auction?.auctionData?.bids?.reverse().map((val,index)=>{
                    console.log('val==>',val)
                    return(
                    <View style={{flexDirection:'row',borderColor:'black',borderWidth:1}}>
                        <Text style={styles.bidId}>{val.response.carrierId}</Text>
                        <Text style={styles.bids}>{val.response.bidAmount}</Text>
                        <Text style={styles.bidBtn}>
                            {
                auction?.auctionData?.status==='Open' &&
                            <Button size="sm" colorScheme="success" style={{height:30}}
                        onPress={()=>handleChooseBid(val.response.auctionId,val.response._id)}
                        >Select</Button>
                    }
                        </Text>
                    </View>
                                        )
                                    })
                                }  
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
    heading1:{
        fontSize:18,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        fontWeight:'bold'
    },
    container:{
        marginLeft:'5%',
        marginBottom:10
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
    bidsHeading:{
        width:90,
        backgroundColor:'lightgray',
        paddingHorizontal:10,
        borderColor:'black',
        borderWidth:1
    },
    bids:{
        width:90,
        // height:40,
        paddingHorizontal:10,
        paddingVertical:5,
        textAlign:'center'
    },
    bidId:{
        width:90,
        fontSize:10
    },
    bidBtn:{
        width:90,
        marginTop:10,
        paddingHorizontal:10,
    }
})


export default AuctionDetails
