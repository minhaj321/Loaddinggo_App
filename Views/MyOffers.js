import React,{useState,useEffect} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import {Button,Flex,HStack,VStack,Select,CheckIcon,Text} from 'native-base'
import Shipment from '../Components/Cards/Shipment';
import { Cities } from '../Components/Cities/Cities';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Heading} from 'native-base'
import {Root} from '../Config/root';
import { useSelector,useDispatch } from 'react-redux';
import { setUpdation } from '../Store/action';

const MyOffers = ({route}) => {

const {datalist,accountId} = route?.params;
const [showFilter,setShowFilter] = useState(false);
const [from,setFrom] = useState('');
const [to,setTo] = useState('');
var [shipments,setShipments] = useState([]);
var [myAllOffers,setMyAllOffers] = useState([]);
const [error,setError] = useState('')
const [errorShow,setErrorShow] = useState(false)
const user = useSelector(state=>state.user)
var [userId,setUserId] = useState(user?.account?._id)
const updation = useSelector(state=>state.updation)
const dispatch = useDispatch();


useEffect(()=>{
  dispatch(setUpdation())
},[])

useEffect(()=>{
fetching();
handleDataFilter('All')
},[datalist,accountId,updation])

// getting offers w.r.t user
const fetching=async()=>{
  setErrorShow(false);
  try{
    setMyAllOffers([]);
    if(datalist==null ||datalist==undefined){
      var {data} = await axios.post(`${Root.production}/trip/getShipmentOffersByCarrier`,{carrierId:accountId})
      if(data.status==200){
        myAllOffers=data.message
        setMyAllOffers(myAllOffers);
        shipments=myAllOffers;
        setShipments(shipments)
      }else{
  setError(data.message)
  setErrorShow(true)}
    }else{
        datalist.map(async(v,i)=>{
          var {data} = await axios.post(`${Root.production}/trip/getShipmentById`,{shipmentOfferId:v});
          if(data.status==200){
            if(data.message.status=='Pending'){
              myAllOffers=[...myAllOffers,data.message];
              setMyAllOffers(myAllOffers);
              shipments=myAllOffers;
              setShipments(shipments)
                      }
                      handleDataFilter('All')
          }else{
            setError(data.message)
            setErrorShow(true)
              }
      })
    }
 
    myAllOffers=myAllOffers.reverse()
    setMyAllOffers(myAllOffers);
}
catch(err){
setError(err.message)
setErrorShow(true)
}
userId=1
}

const handleDataFilter = (type)=>{
    // checking of 'all' option
  if(type!='All'){  
    shipments = [];
  shipments.push(
    myAllOffers.filter((val) => {
      var check = val.status === type;
      if (check) {
        return val;
      }
    })
  );
  shipments = shipments[0];
  setShipments(shipments);
  }
      // checking the status condition
      else{
    shipments=myAllOffers;
    setShipments(shipments)
  }
    }
// filter method as per cities
const filterData = () => {
        shipments = [];
        if (from !== "" && to === "") {
          // PUSH METHOD FOR FILTER FROM
          shipments.push(
            myAllOffers.filter((val) => {
              var check = val.pickupCity == from;
              if (check) {
                return val;
              }
            })
          );
          // END OF PUSH METHOD
          shipments = shipments[0];
          setShipments(shipments);
        }
    
        if (to !== "" && from === "") {
          // PUSH METHOD FOR FILTER TO
          shipments.push(
            myAllOffers.filter((val) => {
              var gotit = val.destinationCity == to;
              if (gotit) {
                return val;
              }
            })
          );
          // END OF PUSH METHOD
          shipments = shipments[0];
          setShipments(shipments);
        }
    
        if (to === "" && from === "") {
          shipments = myAllOffers;
          setShipments(shipments);
        }
        if (from !== "" && to !== "") {
          // PUSH METHOD FOR FILTER TO
          shipments.push(
            myAllOffers.filter((val) => {
              var gotit = val.destinationCity === to && val.pickupCity === from;
              if (gotit) {
                return val;
              }
            })
          );
          // END OF PUSH METHOD
          shipments = shipments[0];
          setShipments(shipments);
        }
    };

// method to toggle display of fiter box 
const toggleFilter =()=>{
    setTo('');
    setFrom('');
        setShowFilter(!showFilter)
}

// handle from and to city
const handleChange=(city,type)=>{
    if(type==='to'){
        setTo(city)
    }else if(type==='from'){
        setFrom(city)
    }
}

    return (
        <View>
            <Text style={styles.heading}>My Offers</Text>
                <Flex ml={250} mr={10}>
            <Button onPressIn={toggleFilter} size={'sm'}>
                Filter                
            </Button>
            </Flex>
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
            { (datalist==null ||datalist==undefined) &&
            <Button.Group
            style={styles.btn_group}
      colorScheme="blue"
      mx={{
        base: "auto",
        md: 0,
      }}
    >
      <Button onPress={()=>handleDataFilter('All')} size="sm" style={styles.button1}>All</Button>
      <Button onPress={()=>handleDataFilter('Active')} size="sm" style={styles.button}>Active</Button>
      <Button onPress={()=>handleDataFilter('Completed')} size="sm" style={styles.button}>Completed</Button>
      <Button onPress={()=>handleDataFilter('Waiting')} size="sm" style={styles.button}>Waiting</Button>
    </Button.Group>
            }
{
              shipments.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>There is no offer.</Text>
            }
      <ScrollView style={{marginBottom:170}}>
          {
            shipments &&
            shipments.reverse().map((v,i)=>{
                return(
                    <Shipment path="offerDetails" data={v}/>
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
        width:90,
        height:40,
        marginLeft:-12
    },
    btn_group:{
        marginTop:20,
        marginBottom:20
    }
})


export default MyOffers
