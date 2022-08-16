import React,{useState} from 'react'
import {View,TouchableOpacity,StyleSheet} from 'react-native';
import {Cities,ShipmentTypes} from './../Components/Cities/Cities';
import { HStack,VStack ,Center,Heading,Input,Select,CheckIcon,Radio,Button,Modal,Pressable} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Root } from '../Config/root';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FeatherIcon from 'react-native-vector-icons/dist/Feather'
import Map from './../Components/MapsLocations/map';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Location from './../Components/MapsLocations/location';
import {Text} from 'native-base'

const CreateRequestForm = ({flag,handleFlag,tripData,navigation}) => {

    const user = useSelector(state=>state.user)
    const userId = user?.account?._id;  
    const [pickupAddress,setPickupAddress]=useState('')
    const [pickupCity,setPickupCity]=useState('')
    const [dropoffContactName,setDropoffContactName]=useState('')
    const [dropoffContactNumber,setDropoffContactNumber]=useState('')
    const [dropoffAddress,setDropoffAddress]=useState('')
    const [dropoffCity,setDropoffCity]=useState('')
    const [height,setHeight]=useState('')
    const [width,setWidth]=useState('')
    const [pickupDate, setpickupDate] = useState('')
    const [weight,setWeight]=useState('')
    const [fragile,setFragile]=useState(true)
    const [shipmentType,setShipmentType]=useState('')
    const [shipmentValue,setShipmentValue]=useState('')
    const [locationType,setLocationType]=useState('')
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    let [pickupLattitude,setPickUpLattitude] = useState(0);
    let [pickupLongitude,setPickUpLongitude] = useState(0);
    let [dropOffLattitude,setDropOffLattitude] = useState(0);
    let [dropOffLongitude,setDropOffLongitude] = useState(0);
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    
    // submit method for shipment request
    const handleSubmit= async()=>{
      if(dropOffLattitude===0 || dropOffLongitude===0 || pickupLattitude===0 || pickupLongitude===0){
        setErrorShow(true)
        setError('Please select your pickup and dropoff.')
      }
      else if(shipmentValue==='' || shipmentType==='' || weight==='' || width==='' ||
      height==='' ||  pickupDate==='' || pickupCity==='' || pickupAddress==='' ||
      dropoffContactName===0 || dropoffContactNumber==='' || dropoffCity==='' || dropoffAddress==='')
      {
        setErrorShow(true)
        setError('Please fill form completely')
      }
      else{
      setErrorShow(false);
      try{
      var send={
        fragile,
        packageWorth:shipmentValue,
        packageType:shipmentType,
        packageWeight:weight,
        packageWidth:width,
        packageHeight:height,
        dropOffLattitude,
        dropOffLongitude,
        pickupLattitude,
        pickupLongitude,
        pickupDate:pickupDate,
        pickupCity:pickupCity,
        pickupAddress:pickupAddress,
        dropOffContactName:dropoffContactName,
        dropOffContactNumber:dropoffContactNumber,
        destinationCity:dropoffCity,
        destinationAddress:dropoffAddress,
        carrierId:tripData.accountId,
        accountId:userId,
        tripId:tripData._id
      }    
      var {data} = await axios.post(`${Root.production}/trip/createShipmentRequest`,send)
      if(data.status==200){
        dispatch(setUpdation())
        navigation.navigate('AvailableTrips')
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
// communication with parent    
    const handleFunction =async()=>{
     await handleFlag()
     await handleSubmit()
    }

  if(flag){
    handleFunction()
  }
// function to hide date picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
};
// function to Set date
const handleConfirm = (date) => {
    setpickupDate(date)
    hideDatePicker();
};
// function to show date picker
const showDatePicker = () => {
  setDatePickerVisibility(true);
};
// function to set LOCATIon modal
const handleLocationModal =(type)=>{
  setLocationType(type)
  setShowModal(true)
}
// function to set coords of location
const handleLocations =(long,lati)=>{
    if(locationType=='pickUp' ){
        setPickUpLattitude(lati);
        setPickUpLongitude(long);
    }
    else if(locationType=='dropOff'){
        setDropOffLattitude(lati);
        setDropOffLongitude(long);
    }
}

    return (
        <ScrollView>
          {/* modal 1 */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
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
                <VStack style={styles.vStack}>
                        <Heading size="md" mt={7}>Pickup Details</Heading>
                        <Button size={'sm'} onPress={()=>handleLocationModal('pickUp')} colorScheme="info" style={{width:'90%'}}>Select PickUp</Button>
                        <Input style={styles.Input} variant="underlined" placeholder="PickUp Address" 
                        value={pickupAddress} onChangeText={txt=>setPickupAddress(txt)}
                        />
                        <View style={{maxWidth:'90%'}}>
                        <Select
            selectedValue={pickupCity}
        accessibilityLabel="PickUp City"
        variant="underlined"
        placeholder="PickUp City"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => setPickupCity(itemValue)}
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
                            <Text>{pickupDate ? (`${pickupDate}`) : ('Pickup Date')}</Text>
                            <FeatherIcon name='calendar' size={20} color="#000" />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <Heading size="md" mt={7}>DropOff Details</Heading>
                    <Button size={'sm'} onPress={()=>handleLocationModal('dropOff')} colorScheme="info"  style={{width:'90%'}}>Select DropOff</Button>
                    <Input style={styles.Input} variant="underlined" placeholder="DropOff Address"
            value={dropoffAddress} onChangeText={txt=>setDropoffAddress(txt)}
                    />
                    <Input style={styles.Input} variant="underlined" placeholder="DropOff Contact Name"
            value={dropoffContactName} onChangeText={txt=>setDropoffContactName(txt)}
            />
                    <Input style={styles.Input} variant="underlined" placeholder="DropOff Contact Number" 
            value={dropoffContactNumber} onChangeText={txt=>setDropoffContactNumber(txt)}
            />
                    <View style={{maxWidth:'90%'}}>
                    <Select
            selectedValue={dropoffCity}
        variant="underlined"
        accessibilityLabel="DropOff City"
        placeholder="DropOff City"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => setDropoffCity(itemValue)}
      >
          {
              Cities.map((v,i)=>(
                  <Select.Item key={i}  label={v} value={v} />
              ))
          }
      </Select>
      </View>
                </VStack>
                <VStack style={styles.vStack}>
                    <Heading size="md" mt={7}>Shipment Details</Heading>
                    <Heading size="xs" mt={3}>Shipment Size:</Heading>
                    <Input style={styles.Input} variant="underlined" placeholder="Height (cm)" 
            value={height} onChangeText={txt=>setHeight(txt)}
            />
                    <Input style={styles.Input} variant="underlined" placeholder="Width (cm)"
            value={width} onChangeText={txt=>setWidth(txt)}
            />
                    <Heading size="xs" mt={5}>Shipment Weight:</Heading>
                    <Input style={styles.Input} variant="underlined" placeholder="Weight (kg)"
            value={weight} onChangeText={txt=>setWeight(txt)}
            />
                    <Heading size="xs" mt={5}>Fragile:</Heading>
        <Radio.Group
      name="myRadioGroup"
      accessibilityLabel="favorite number"
      value={fragile}
      onChange={(nextValue) => {
        setFragile(nextValue)
      }}
    >
        <HStack>
      <Radio value={true} mt={1} mr={2}>
        Yes
      </Radio>
      <Radio value={false} mt={1}>
        No
      </Radio>
      </HStack>
    </Radio.Group>
                    <Heading size="xs" mt={5}>What best describe your shipment:</Heading>
                    <View
                    style={{width:'90%'}}
                    >
                    <Select
            selectedValue={shipmentType}
        variant="underlined"
        accessibilityLabel="Shipemnt Type"
        placeholder="Shipemnt Type"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => setShipmentType(itemValue)}
      >
          {
              ShipmentTypes.map((v,i)=>(
                  <Select.Item key={i}  label={v} value={v} />
              ))
          }
      </Select>
      </View>
      <Input style={styles.Input} variant="underlined" placeholder="Total Value of shipment" 
            value={shipmentValue} onChangeText={txt=>setShipmentValue(txt)}
            />
                    </VStack>
                    {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                  <MaterialIcons name="error" size={20} color="#F0625F"/>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    Erorr:{error}
                </Text>
              </View>
            }

        </ScrollView>
    )
}

const styles=StyleSheet.create({
    vStack:{
        marginLeft:'10%'
    },
        Input:{
            fontSize:13,
            paddingTop:15,
            width:'90%'
        },
      searchSection: {
          borderWidth: 1,
          borderRadius: 2,
          // backgroundColor: '#F8F9FB',
          borderTopWidth:0,
          borderLeftWidth:0,
          borderRightWidth:0,
          width: '90%',
          borderBottomColor:'lightgray'
          // marginLeft: 5,
          // padding: 5,
      }
    })

export default CreateRequestForm
