import React,{useEffect,useState} from 'react'
import {ScrollView,StyleSheet,View,Alert} from 'react-native';
import AuctionCard from '../Components/Cards/AuctionCard';
import axios from 'axios';
import { Cities } from '../Components/Cities/Cities';
import {Button,Flex,HStack,VStack,Select,CheckIcon} from 'native-base'
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';
import {io} from "socket.io-client";
import GetLocation from 'react-native-get-location'


const AvailableAuctions = () => {

    const socket = io('https://stg-dakiyah.herokuapp.com');
    const [showFilter,setShowFilter] = useState(false);
    const [from,setFrom] = useState('');
    const [to,setTo] = useState('');
    let [allAuctions,setAllAuctions] = useState([]);
    let [auctions,setAuctions] = useState([]);
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const user = useSelector(state=>state.user);
    var [departureLattitude, setDepartureLatitude] = useState(0);
    var [departureLongitude, setDepartureLongitude] = useState(0);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    const [cond,setCond] = useState(false);
    
//  fetching of all auction
    useEffect(()=>{
      socket.on('FetchAuctions',(data)=>{
      allAuctions=data
      setAllAuctions(data);
      handleDataFilter('All')
      })
      dispatch(setUpdation())

      // getting location
      setInterval(()=>{
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
      })
      .then(location => {
        departureLattitude=location.latitude;
        departureLongitude=location.longitude;
        setDepartureLatitude(departureLattitude);
        setDepartureLongitude(departureLongitude);
        setCond(true)
      })
      .catch(error => {
          const { code, message } = error;
          if(message=="Location not available"){
              setCond(false)
          }
  
      })
      },13000)
    },[])
    
  // fetching of auctions on updation in auction database
    useEffect(()=>{
        fectching();
        handleDataFilter('All')
    },[updation])

    // getting auctions
    const fectching=async()=>{
      setErrorShow(false)
        try{
        var {data} = await axios.get(`${Root.production}/auction/getAllAuctions`);
        if(data.status===200){
          allAuctions=data.message.auctions
          auctions=data.message.auctions
            setAllAuctions(data.message.auctions);
            setAuctions(data.message.auctions)
            auctions = [];
            auctions.push(
              allAuctions.filter((val) => {
                var check = (val.status == 'Open' && val.accountId != user.account._id);
                if (check) {
                  return val;
                }
              })
            );
            setAuctions(auctions[0]);
        }else{
      setErrorShow(false)
      setError(data.message)
        }
    }
    catch(err){
      setErrorShow(false)
      setError(err.message)

    }
    }

    const handleDataFilter = async(val)=>{
      // start for checking 'open' option
        if(val=='All'){
    auctions = [];
      auctions.push(
        allAuctions.filter((val) => {
          var check = (val.status == 'Open' && val.accountId != user.account._id);
          if (check) {
            return val;
          }
        })
      );
      setAuctions(auctions[0]);
      }
    // start for checking 'pending' option
      else if(val=='Pending'){
      auctions = [];
      auctions.push(
        allAuctions.filter((val) => {
          // var check = val.status=='On Hold'
          var check = (val.status === 'On Hold' && val.choosenCarrierId == user?.account?._id);
          if (check) {
            return val;
          }
        })
      );  
      setAuctions(auctions[0]);
      }
        }   
    
// start of filter code
    const filterData = () => {
            auctions = [];
            if (from !== "" && to === "") {
              // PUSH METHOD FOR FILTER FROM
              auctions.push(
                allAuctions.filter((val) => {
                  var check = val.pickupCity == from;
                  if (check) {
                    return val;
                  }
                })
              );
              // END OF PUSH METHOD
              auctions = auctions[0];
              setAuctions(auctions);
            }
        
            if (to !== "" && from === "") {
              // PUSH METHOD FOR FILTER TO
              auctions.push(
                allAuctions.filter((val) => {
                  var gotit = val.destinationCity == to;
                  if (gotit) {
                    return val;
                  }
                })
              );
              // END OF PUSH METHOD
              auctions = auctions[0];
              setAuctions(auctions);
            }
        
            if (to === "" && from === "") {
              setAuctions(allAuctions);
            }
            if (from !== "" && to !== "") {
              // PUSH METHOD FOR FILTER TO
              auctions.push(
                allAuctions.filter((val) => {
                  var gotit = val.destinationCity === to && val.pickupCity === from;
                  if (gotit) {
                    return val;
                  }
                })
              );
              // END OF PUSH METHOD
              auctions = auctions[0];
              setAuctions(auctions);
            }
          };
        
          // funtion to toggle filter box
    const toggleFilter =()=>{
            setShowFilter(!showFilter)
    }
    
  // function for handle depart and dest city
    const handleChange=(city,type)=>{
        if(type==='to'){
            setTo(city)
        }else if(type==='from'){
            setFrom(city)
        }
    }
    
    return (
      <>
      {cond===false &&
      <>
      <Text style={{display:'flex',fontSize:20,marginTop:20,textAlign:'center'}}>Loading...</Text>
        <Text style={{display:'flex',color:'red',fontSize:15,marginTop:20,textAlign:'center'}}>Please open your mobile location and try again</Text>
        </>
      }
      {cond &&
      
        <View>
            <Text style={styles.heading}>Available Auctions</Text>
            <Flex ml={250} mr={10}>
            <Button onPressIn={toggleFilter} size={'sm'}>
                Filter                
            </Button>
            </Flex>
            {
                showFilter==true &&
            <Flex style={{backgroundColor:'lightgray',borderRadius:5}} h={55} mt={2} w={"80%"} ml={"10%"}>
                <HStack>
                    <VStack style={{width:'40%'}}>
                        <Text pl={2} mb={-3} mt={1}>From :</Text>
                        <View style={{maxWidth:'90%'}}>
                        <Select
            selectedValue={from}
        accessibilityLabel="From"
        variant="underlined"
        placeholder="From"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => handleChange(itemValue,'from')}
      >
          {
              Cities.map((v,i)=>(
                  <Select.Item key={i}  label={v} value={v} />
              ))
          }
      </Select>
      </View>

                        </VStack>
                    <VStack style={{width:'40%'}}>
                        <Text pl={2} mb={-3} mt={1}>To :</Text>
                        <View style={{maxWidth:'90%'}}>
                        <Select
            selectedValue={to}
        accessibilityLabel="To"
        variant="underlined"
        placeholder="To"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => handleChange(itemValue,'to')}
      >
          {
              Cities.map((v,i)=>(
                  <Select.Item key={i}  label={v} value={v} />
              ))
          }
      </Select>
      </View>
                        </VStack>
                    <VStack style={{width:'20%'}}>
                        <Button onPress={filterData} variant='subtle' bgColor='white' size="xs" mt={3} mr={1}>Search</Button>
                        </VStack>
                </HStack>
            </Flex>
            }
            <Button.Group
            style={styles.btn_group}
      colorScheme="blue"
      mx={{
        base: "auto",
        md: 0,
      }}
    >
      <Button onPress={()=>handleDataFilter('All')} size="xs" style={styles.button1}>All</Button>
      <Button onPress={()=>handleDataFilter('Pending')} size="xs" style={styles.button}>Pending</Button>
    </Button.Group>
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
            {
              auctions.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>There is no available auction.</Text>
            }
      <ScrollView style={{marginBottom:170}}>
      {auctions.map((val,i) => 
      { 
        if((Math.abs(parseFloat(val.pickupLattitude)-parseFloat(departureLattitude))<0.018) && 
        (Math.abs(parseFloat(val.pickupLongitude)-parseFloat(departureLongitude))<0.018) )
        {
        return(
            <View key={i}>
              <AuctionCard route="CarrierAuctionDetails" data={val}/>
            </View>
            )
        }
        }
        )}
        </ScrollView>
        </View>
        }
        </>

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
        width:80,
        height:40,
        marginLeft:-12
    },
    btn_group:{
        marginTop:20,
        marginBottom:20
    }
})

export default AvailableAuctions
