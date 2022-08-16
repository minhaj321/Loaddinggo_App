import React,{useState} from 'react'
import {View,StyleSheet,TouchableOpacity} from 'react-native';
import { Flex,HStack,VStack ,Center,Input,Select,CheckIcon,Radio,Button,Modal,Pressable} from 'native-base';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import axios from 'axios';
import {Root} from './../Config/root';
import * as ImagePicker from 'react-native-image-picker'
import FeatherIcon from 'react-native-vector-icons/dist/Feather'
import {ShipmentTypes,AuctionDuration,Cities} from './../Components/Cities/Cities';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import Map from '../Components/MapsLocations/map';
import Location from '../Components/MapsLocations/location';
import {Text,Heading} from 'native-base'
import storage from '@react-native-firebase/storage';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const CreateAuction = ({navigation}) => {

const [durationTime,setDurationTime]=useState(0)
const [startingBid,setStartingBid]=useState('')
const [fragile, setFragile] = useState(true)
const [shipmentType,setShipmentType]=useState('')
const [height,setHeight]=useState('')
const [weight,setWeight]=useState('')
const [width,setWidth]=useState('')
const [packageWorth,setPackageWorth]=useState('')
let [photo, setPhoto] = useState('')
let [photoName, setPhotoName] = useState('')
const [pickupCity,setPickupCity]=useState('')
const [dropOffCity,setDropOffCity]=useState('')
let [isDatePickerVisible, setDatePickerVisibility] = useState(false);
let [pickUpDate, setPickUpDate] = useState('')
let [dropOffDate, setDropOffDate] = useState('')
let [dateType, setDateType] = useState('')
let [isTimePickerVisible, setTimePickerVisibility] = useState(false)
let [pickUpTime, setPickUpTime] = useState('')
let [dropOffTime, setDropOffTime] = useState('')
let [pickUpAddress, setPickUpAddress] = useState('')
let [dropOffAddress, setDropOffAddress] = useState('')
let [contactName, setContactName] = useState('')
let [contactNumber, setContactNumber] = useState('')
let [pickupLattitude,setPickUpLattitude] = useState(0);
let [pickupLongitude,setPickUpLongitude] = useState(0);
let [dropOffLattitude,setDropOffLattitude] = useState(0);
let [dropOffLongitude,setDropOffLongitude] = useState(0);
const [showModal, setShowModal] = useState(false)
const [showModal2, setShowModal2] = useState(false)
const [locationType,setLocationType]=useState('')
let [error,setError] = useState('');
let [errorShow,setErrorShow] = useState(false);
const [step,setStep] = useState(0);
const user = useSelector(state=>state.user)
const userId = user?.account?._id;
const updation = useSelector(state=>state.updation)
const dispatch = useDispatch();


const handleStep = (val)=>{
  setStep(val);
  setErrorShow(false)
}

// function to handle modal
const handleLocationModal =(type)=>{
    setLocationType(type)
    setShowModal(true)
  }
  // function to show date picker
const showDatePicker = (type) => {
    setDateType(type)
    setDatePickerVisibility(true);
};
  // function to hide date picker
const hideDatePicker = () => {
    setDatePickerVisibility(false);
};
// function to set date
const handleConfirm = (date) => {
    if(dateType==='pickup'){
        setPickUpDate(date)
    }else if(dateType==='dropoff'){
        setDropOffDate(date)
    }
    hideDatePicker();
};
  // function to show time picker
const showTimePicker = (type) => {
    setDateType(type)
    setTimePickerVisibility(true);
};
  // function to hide time picker
const hideTimePicker = () => {
    setTimePickerVisibility(false);
};
// function to set time
const handleTimeConfirm = (time) => {
    if(dateType==='pickup'){
        setPickUpTime(time)
    }else if(dateType==='dropoff'){
        setDropOffTime(time)
    }
    hideTimePicker();
};
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
const   defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
    }
  };

// function to submit 
  const handleSubmit =async()=>{
    if(durationTime===0 || startingBid===''){
      setErrorShow(true)
      setError('Please fill form completely.')
    }
    else{
      try{
      await storage().ref(`packageImages/${userId}/${shipmentType}/${width+packageWorth}`).putFile(photo);
        await  storage().ref(`packageImages/${userId}/${shipmentType}`).child(width+packageWorth)
        .getDownloadURL().then(async (uri)=>{
      var send={
        accountId:userId,
        auctionDuration:durationTime,
        startingBid:Number(startingBid),
        pickupDate:pickUpDate,
        pickupTime:pickUpTime,
        pickupAddress:pickUpAddress,
        pickupCity:pickupCity,
        dropOffDate:dropOffDate,
        dropOffTime:dropOffTime,
        destinationAddress:dropOffAddress,
        dropOffContactName:contactName,
        dropOffContactNumber:contactNumber,
        pickupLattitude:pickupLattitude,
        pickupLongitude:pickupLongitude,
        dropOffLattitude:dropOffLattitude,
        dropOffLongitude:dropOffLongitude,
        destinationCity:dropOffCity,
        packageWidth:Number(width),
        packageHeight:Number(height),
        packageWeight:Number(weight),
        packageType:shipmentType,
        packageWorth:Number(packageWorth),
        fragile:fragile,
        packageImageUrl:uri,
      }
      try{
      var {data} = await axios.post(`${Root.production}/auction/createAuction`,
        send
      )
      if(data.status==200){
        dispatch(setUpdation())
        navigation.navigate('AvailableTrips')
      }else{
        setErrorShow(true)
        setError(data.message)
      }
    }
catch(err){
  setErrorShow(true)
  setError(err.message)
}
})
}catch(err){
  setErrorShow(true)
  setError(err.message)
}
    }
    }
    // functiom for validation of stepper to 2
const handleFirstStep=()=>{
  if(dropOffLattitude===0 || dropOffLongitude===0 || pickupLattitude===0 || pickupLongitude===0){
    setErrorShow(true)
    setError('Please Select your pickup and dropOff.')
  }else if(pickUpDate==='' || pickUpTime==='' || pickUpAddress==='' || pickupCity==='' || 
  dropOffDate==='' || dropOffTime==='' || dropOffAddress==='' || contactName==='' || 
  contactNumber==='' || dropOffCity===''){
    setErrorShow(true)
    setError('First fill all fields of this form completely.')
  }else{
    handleStep(1)
  }
}
    // functiom for validation of stepper to 3
const handleSecondStep=()=>{
  if(photo==''){
    setErrorShow(true)
    setError('Please Upload your shipment image.')
  }
  else if( width==='' || height==='' || weight==='' || shipmentType==='' || packageWorth===''){
    setErrorShow(true)
    setError('Fill all fields of this form completely.')
  }else{
    handleStep(2)
  }
}

    return (
        <ScrollView style={styles.parent}>
        <ProgressSteps activeStep={step}>
          <ProgressStep
            removeBtnRow
            label={"Pickup & DropOff Details"}
            scrollViewProps={defaultScrollViewProps}
          >
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
                          <Heading size="xs" mt={2}>PickUp Date:</Heading>
                          <TouchableOpacity onPress={()=>showDatePicker('pickup')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{pickUpDate ? (`${pickUpDate}`) : 'Select'}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                          />
                          <Heading size="xs" mt={2}>PickUp Time:</Heading>
                          <TouchableOpacity onPress={()=>showTimePicker('pickup')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{pickUpTime ? (`${pickUpTime}`) : 'Select'}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isTimePickerVisible}
                              mode="time"
                              onConfirm={handleTimeConfirm}
                              onCancel={hideTimePicker}
                          />                        
                          <Input style={styles.Input} vlaue={pickUpAddress}
                          onChangeText={txt=>setPickUpAddress(txt)}
                          variant="underlined" placeholder="PickUp Address" />
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
                      <Heading size="md" mt={7}>DropOff Details</Heading>
                      <Button size={'sm'} onPress={()=>handleLocationModal('dropOff')} colorScheme="info"  style={{width:'90%'}}>Select DropOff</Button>
  
                      <Heading size="xs" mt={2}>DropOff Date:</Heading>
                      <TouchableOpacity onPress={()=>showDatePicker('dropoff')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{dropOffDate ? (`${dropOffDate}`) : 'Select'}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                          />
                          <Heading size="xs" mt={2}>DropOff Time:</Heading>
                          <TouchableOpacity onPress={()=>showTimePicker('dropoff')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                              <Text>{dropOffTime ? (`${dropOffTime}`) : 'Select'}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                              isVisible={isTimePickerVisible}
                              mode="time"
                              onConfirm={handleTimeConfirm}
                              onCancel={hideTimePicker}
                          />        
                      <Input style={styles.Input} value={dropOffAddress}
                      onChangeText={txt=>setDropOffAddress(txt)}
                      variant="underlined" placeholder="DropOff Address" />
                      <Input style={styles.Input} value={contactName}
                      onChangeText={txt=>setContactName(txt)}
                      variant="underlined" placeholder="DropOff Contact Name" />
                      <Input style={styles.Input} value={contactNumber}
                      onChangeText={txt=>setContactNumber(txt)}
                      variant="underlined" placeholder="DropOff Contact Number" />
                      <View style={{maxWidth:'90%'}}>
                          <Select
              selectedValue={dropOffCity}
          accessibilityLabel="DropOff City"
          variant="underlined"
          placeholder="DropOff City"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setDropOffCity(itemValue)}
        >
            {
                Cities.map((v,i)=>(
                    <Select.Item key={i}  label={v} value={v} />
                ))
            }
        </Select>
        </View>
                  </VStack>
                  {
                errorShow &&
                <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                      <MaterialIcons name="error" size={20} color="#F0625F"/>
                   <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                      {error}
                  </Text>
                </View>
              }
                  <Flex flexDirection={'row-reverse'}>
          <Button mr={4} mt={4} mb={10} size={'md'} onPress={()=>handleFirstStep()} variant={'subtle'} colorScheme="primary" style={{fontWeight:'bold',width:'20%'}}>Next</Button>
                  </Flex>
          </ScrollView>

          </ProgressStep>
{/* step # 02 */}
          <ProgressStep
            removeBtnRow
            label="Package Details"
            scrollViewProps={defaultScrollViewProps}
          >
          <VStack style={styles.vStack}>
              <Heading size="md" mt={7}>Package Details</Heading>
              <Heading size="xs" mt={3}>Shipment Size:</Heading>
              <Input style={styles.Input} variant="underlined" value={height} 
              onChangeText={txt=>setHeight(txt)}
              placeholder="Height (cm)" />
              <Input style={styles.Input} variant="underlined" value={width} 
              onChangeText={txt=>setWidth(txt)}
              placeholder="Width (cm)" />
              <Heading size="xs" mt={5}>Shipment Weight:</Heading>
              <Input style={styles.Input} variant="underlined" value={weight}
              onChangeText={txt=>setWeight(txt)}
              placeholder="Weight (kg)" />
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
  <Input style={styles.Input} value={packageWorth}
  onChangeText={txt=>setPackageWorth(txt)}
  variant="underlined" placeholder="Total Value of shipment" />
  <View style={styles.uploadSection}>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}} >
                          <Text>Shipment Picture</Text>
                          <TouchableOpacity onPress={() => {
                              ImagePicker.launchImageLibrary(
                                  {
                                      mediaType: 'photo',
                                      includeBase64: false,
                                      maxHeight: 200,
                                      maxWidth: 200,
                                  },
                                  (response) => {
                                      setPhoto(response?.assets[0].uri)
                                      setPhotoName(response?.assets[0].fileName)
                                  },
                              )
                          }} >
                              <FeatherIcon style={styles.searchIcon} name='upload' size={20} color='#000' />
                          </TouchableOpacity>
                         
                          </View>
                          <View>
                          <Text>{photo === '' ? '' : photoName}</Text>
                          </View>
                      </View>
              </VStack>
              {
                errorShow &&
                <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                      <MaterialIcons name="error" size={20} color="#F0625F"/>
                   <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                      {error}
                  </Text>
                </View>
              }
              <HStack>
                  <VStack w={'50%'}>
          <Button ml={4} mt={4} mb={10} size={'md'} onPress={()=>handleStep(0)} variant={'subtle'} colorScheme="dark" style={{fontWeight:'bold',width:'60%'}}>Back</Button>
          </VStack>
          <VStack w={'50%'} flexDirection={'row-reverse'}>
          <Button mr={4} mt={4} mb={10} size={'md'} onPress={()=>handleSecondStep()} variant={'subtle'} colorScheme="primary" style={{fontWeight:'bold',width:'60%'}}>Next</Button>
                  </VStack>
                  </HStack>

          </ProgressStep>

{/* step # 3 */}
          <ProgressStep
            removeBtnRow
            label="Auction Details"
            onSubmit={handleSubmit}
            scrollViewProps={defaultScrollViewProps}
          >
          <VStack style={styles.vStack}>
            <Heading size="md" mt={7}>Auction Details</Heading>
            <Heading size="xs" mt={3}>Auction Duration :</Heading>
            <View
            style={{width:'90%'}}
            >
            <Select
    selectedValue={durationTime}
variant="underlined"
accessibilityLabel="Auction Duration"
placeholder="Auction Duration"
_selectedItem={{
  bg: "teal.600",
  endIcon: <CheckIcon size="5" />,
}}
mt={1}
onValueChange={(itemValue) => setDurationTime(itemValue)}>
  {
      AuctionDuration.map((v,i)=>(
          <Select.Item key={i}  label={v.label} value={v.val} />
      ))
  }
</Select>
</View>
            <Heading size="xs" mt={5}>Starting Amount:</Heading>
            <Input style={styles.Input} 
            value={startingBid}
            onChangeText={txt=>setStartingBid(txt)}
            variant="underlined" placeholder="Rs : (PKR)" />

            </VStack>
            {
                errorShow &&
                <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                      <MaterialIcons name="error" size={20} color="#F0625F"/>
                   <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                      {error}
                  </Text>
                </View>
              }
              <HStack>
                  <VStack w={'50%'}>
          <Button ml={4} mt={4} mb={10} size={'md'} onPress={()=>handleStep(1)} variant={'subtle'} colorScheme="dark" style={{fontWeight:'bold',width:'60%'}}>Back</Button>
          </VStack>
          <VStack w={'50%'} flexDirection={'row-reverse'}>
          <Button mr={4} mt={4} mb={10} size={'md'} onPress={()=>handleSubmit()} variant={'subtle'} colorScheme="success" style={{fontWeight:'bold',width:'60%'}}>Submit</Button>
                  </VStack>
                  </HStack>

          </ProgressStep>

        </ProgressSteps>
  
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    parent:{
        fontSize:20,
        paddingTop:20,
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



export default CreateAuction

