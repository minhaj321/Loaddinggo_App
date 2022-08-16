import React,{useState,useEffect} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import {Button,Flex,HStack,VStack,Text,Modal,Heading} from 'native-base'
import Trip from '../Components/Cards/Trip';
import axios from 'axios';
import {Root} from '../Config/root';
import AddTrip from './AddTrip.js'
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const MyTrips = ({navigation}) => {

var [trips,setTrips] = useState([])
var [display,setDisplay] = useState([])
const [error,setError] = useState('')
const [errorShow,setErrorShow] = useState(false)
const [showModal,setShowModal] = useState(false);
const user = useSelector(state=>state.user);
const userId = user?.account?._id;
const updation = useSelector(state=>state.updation)
const dispatch = useDispatch();


useEffect(()=>{
  dispatch(setUpdation())
},[])

useEffect(()=>{
fetching();
handleDataFilter('All')
},[updation])

// getting all trips by carrier
const fetching=async()=>{
  setErrorShow(false);
    try{
    var {data} = await axios.post(`${Root.production}/trip/getTripByCarrier`,{
      carrierId : userId
    });

    if(data.status==200){
      trips=data.message
      display=data.message
        setTrips(data.message)
        setDisplay(data.message)
        if(data.message.length===0){
          setErrorShow(true)
          setError('You have no trip')
        }
      }
      else{
          setErrorShow(true)
          setError(data.message)
        }
  }
  catch(err){
  setError(err.message)
  setErrorShow(true)
  }}
  
  const handleDataFilter = (val)=>{
    // checking of 'all' option
    if(val!='All'){
  display = [];
  display.push(
    trips.filter((v) => {
      var check = v.status === val;
      if (check) {
        return v;
      }
    })
  );
  display = display[0];
  setDisplay(display);
  }
      // checking the status condition
      else{
    display=trips;
    setDisplay(display)
  }
    }
  
  return (
        <View>
            <Text style={styles.heading}>My Trips</Text>

            <Flex ml={220} mr={10}>
            <Button colorScheme="blue" onPress={()=>setShowModal(true)} size={'sm'}>
                Add New                
            </Button>
            </Flex>
            
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>{`Add Trip`}</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
                <AddTrip navigation={navigation}/>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Button.Group
            style={styles.btn_group}
      colorScheme="blue"
      mx={{
        base: "auto",
        md: 0,
      }}
    >
      <Button onPress={()=>handleDataFilter('All')} size="sm" style={styles.button1}>All</Button>
      <Button onPress={()=>handleDataFilter('Open')} size="sm" style={styles.button}>Open</Button>
      <Button onPress={()=>handleDataFilter('Close')} size="sm" style={styles.button}>Closed</Button>
      <Button onPress={()=>handleDataFilter('Cancel')} size="sm" style={styles.button}>Cancelled</Button>
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
              display.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>There is no trip.</Text>
            }
      <ScrollView style={{marginBottom:170}}>
          {
            display &&
            display.reverse().map((v,i)=>{
                return(
                  <View>
                    <Trip route={'TripDetails'} data={v}/>
                  </View>
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



export default MyTrips
