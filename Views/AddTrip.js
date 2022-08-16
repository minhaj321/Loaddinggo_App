import { View,Input ,Modal,VStack,HStack,Center,Button,Select,CheckIcon} from 'native-base'
import React,{useState,useEffect} from 'react'
import { TouchableOpacity,Pressable,StyleSheet} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Map from '../Components/MapsLocations/map';
import Location from '../Components/MapsLocations/location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Cities} from '../Components/Cities/Cities';
import FeatherIcon from 'react-native-vector-icons/dist/Feather'
import axios from 'axios';
import { Root } from '../Config/root';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const AddTrip = ({navigation}) => {

    const user = useSelector(state=>state.user)
    const userId = user.account._id;
    let [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [departureAddress,setDepartureAddress]=useState('');
    const [destinationAddress,setDestinationAddress]=useState('');
    const [locationType,setLocationType]=useState('')
    const [pricePerShipmentOrder,setPricePerShipmentOrder]=useState('');
    let [departureLattitude,setdepartureLattitude] = useState(0);
    let [departureLongitude,setdepartureLongitude] = useState(0);
    let [destinationLattitude,setdestinationLattitude] = useState(0);
    let [destinationLongitude,setdestinationLongitude] = useState(0);
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [departureCity,setdepartureCity]=useState('')
    const [destinationCity,setdestinationCity]=useState('')
    let [departureDate, setDepartureDate] = useState('')
    let [departTime, setDepartTime] = useState('')
    let [isTimePickerVisible, setTimePickerVisibility] = useState(false)
    let [vehiclesArray, setVehiclesArray] = useState([])
    let [vehicles, setVehicles] = useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
        
    useEffect(()=>{
      fectching();
    },[])

    // fetching vehicles to select
    const fectching = async()=>{
      setErrorShow(false);
      try{
      var { data } = await axios.post(`${Root.production}/vehicle/getVehicleByUser`, { accountId: userId })
    if (data.status == 200) {
      vehiclesArray = data.message;
      setVehiclesArray(vehiclesArray)
    }
    else {
      setErrorShow(true)
      setError(data.message)
    }
    
  }catch(err){
    setErrorShow(true)
    setError(err.message)
  }
}
// submit method
const handleSubmit =async()=>{
  if( departureLattitude===0 || departureLongitude===0|| destinationLattitude===0 || destinationLongitude===0){
    setErrorShow(true)
    setError('Please select your Departure and Destination.')
  }else if(departureAddress==='' || destinationAddress==='' || pricePerShipmentOrder==='' || destinationCity==='' ||
  departureCity==='' || vehicles==='' ||  departureDate==='' || departTime===''
  ){
    setErrorShow(true)
    setError('Please fill form completely')
  }
  else{
    var send = {
      departureAddress,
      destinationAddress,
      pricePerShipmentOrder,
      destinationCity,
      departureCity,
      vehicleId:vehicles,
      departureLattitude:departureLattitude+"",
      departureLongitude:departureLongitude+'',
      destinationLattitude:destinationLattitude+'',
      destinationLongitude:destinationLongitude+'',
      accountId:userId,
      departureDate,
      departureTime: departTime
    }
    setErrorShow(false);
    try{
      var {data} = await axios.post(`${Root.production}/trip/createTrip`,send);
      if(data.status==200){
        navigation.navigate('MyTrips');
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
}

// function to handle location
    const handleLocations =(long,lati)=>{
          if(locationType=='pickUp' ){
              setdepartureLattitude(lati);
              setdepartureLongitude(long);
          }
          else if(locationType=='dropOff'){
            setdestinationLattitude(lati);
              setdestinationLongitude(long);
          }
      }

      // function to handle modal for location
      const handleLocationModal =(type)=>{
        setLocationType(type)
        setShowModal(true)
      }
      // method to display date picker
    const showDatePicker = (type) => {
        setDatePickerVisibility(true);
    };
      // method to display time picker
    const showTimePicker = (type) => {
        setTimePickerVisibility(true);
    };
      // method to hide time picker
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
      // method to hide date picker
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
      // method to confirm time
    const handleTimeConfirm = (time) => {
      setDepartTime(time)
      hideTimePicker();
    };

      // method to confirm date
    const handleConfirm = (date) => {
      setDepartureDate(date)
      hideDatePicker();
  };


    return (
        <View style={{marginLeft:10}}>
                      {/* modal 1 */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>{`Select ${locationType}`}</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
              </HStack>
            </VStack>
            <Map handleLocations={handleLocations}/>
            <Center>
            <Text style={{marginTop:10}}>or</Text>
            <Pressable
            onPress={()=>setShowModal2(true)}
            >
            <Text
            style={{marginBottom:10,fontWeight:'bold'}}
            >Get My Current Location <MaterialIcons name="my-location" /></Text>
            </Pressable>
            </Center>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal2(false)
                setShowModal(false)
              }}
            >
              Confirm location
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
          {/* modal 2 */}
          <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>{`Select ${locationType}`}</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
              </HStack>
            </VStack>
              <Location handleLocations={handleLocations}/>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal2(false)
                setShowModal(false)
              }}
            >
              Confirm location
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
            <Heading size="sm" mt={4} mb={2}>From Details:</Heading>
            <Button size={'sm'} onPress={()=>handleLocationModal('pickUp')} colorScheme="info" style={{width:'90%'}}>Select PickUp</Button>
                      <Input style={styles.Input} value={departureAddress}
                      onChangeText={txt=>setDepartureAddress(txt)}
                      variant="underlined" placeholder="Departure Address" />
                        <View style={{maxWidth:'90%'}}>
                          <Select
              selectedValue={departureCity}
          accessibilityLabel="PickUp City"
          variant="underlined"
          placeholder="PickUp City"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setdepartureCity(itemValue)}
        >
            {
                Cities.map((v,i)=>(
                    <Select.Item key={i}  label={v} value={v} />
                ))
            }
        </Select>
        </View>
                      <View style={styles.searchSection} >
                          <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{departureDate ? (`${departureDate}`) : ('Departure Date')}</Text>
                              <FeatherIcon name='calendar' size={20} color="#000" />
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                          />
                      </View>
                      <View style={styles.searchSection} >
                          <TouchableOpacity onPress={showTimePicker} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{departTime ? (`${departTime}`) : ('departureTime')}</Text>
                              <FeatherIcon name='calendar' size={20} color="#000" />
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isTimePickerVisible}
                              mode="time"
                              onConfirm={handleTimeConfirm}
                              onCancel={hideTimePicker}
                          />
                      </View>
                      <Heading size="sm" mt={4} mb={2}>To Details:</Heading>
            <Button size={'sm'} onPress={()=>handleLocationModal('dropOff')} colorScheme="info" style={{width:'90%'}}>Select DropOff</Button>
                      <Input style={styles.Input} value={destinationAddress}
                      onChangeText={txt=>setDestinationAddress(txt)}
                      variant="underlined" placeholder="Destination Address" />
                        <View style={{maxWidth:'90%'}}>
                          <Select
              selectedValue={destinationCity}
          accessibilityLabel="PickUp City"
          variant="underlined"
          placeholder="Destination City"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setdestinationCity(itemValue)}
        >
            {
                Cities.map((v,i)=>(
                    <Select.Item key={i}  label={v} value={v} />
                ))
            }
        </Select>
        </View>
                      <View style={{maxWidth:'90%'}}>
                          <Select
              selectedValue={vehicles}
          accessibilityLabel="PickUp City"
          variant="underlined"
          placeholder="Select Vehicle"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setVehicles(itemValue)}
        >
            {
                vehiclesArray.map((v,i)=>(
                    <Select.Item key={i}  label={`${v.model}-${v.year}`} value={v._id} />
                ))
            }
        </Select>
        </View>
                      <Input style={styles.Input} value={pricePerShipmentOrder}
                      onChangeText={txt=>setPricePerShipmentOrder(txt)}
                      variant="underlined" placeholder="Price Per Shipment" />
              {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'5%',width:'80%'}}>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:10}}>
                  {`Error:${error}`}
                </Text>
              </View>
            }

        <Button size={'sm'} onPress={()=>handleSubmit()} colorScheme="success" style={{width:'90%',marginVertical:5}}>Add</Button>
        </View>
    )
}


const styles = StyleSheet.create({
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

export default AddTrip
