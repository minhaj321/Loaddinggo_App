
// import React,{useState,useEffect} from 'react'
// import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
// import {Cities,ShipmentTypes} from './../Cities/Cities';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { HStack,VStack ,Center,Heading,Input,Select,Button,Modal,CheckIcon,Radio,Pressable} from 'native-base';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { ScrollView } from 'react-native-gesture-handler';
// import Location from './../MapsLocations/location';
// import Map from './../MapsLocations/map';

// const StepOne = ({step1,sendData}) => {

//     const [pickupCity,setPickupCity]=useState('')
//     const [dropOffCity,setDropOffCity]=useState('')
//     let [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     let [pickUpDate, setPickUpDate] = useState('')
//     let [dropOffDate, setDropOffDate] = useState('')
//     let [dateType, setDateType] = useState('')
//     let [isTimePickerVisible, setTimePickerVisibility] = useState(false)
//     let [pickUpTime, setPickUpTime] = useState('')
//     let [dropOffTime, setDropOffTime] = useState('')
//     let [pickUpAddress, setPickUpAddress] = useState('')
//     let [dropOffAddress, setDropOffAddress] = useState('')
//     let [contactName, setContactName] = useState('')
//     let [contactNumber, setContactNumber] = useState('')
//     let [pickupLattitude,setPickUpLattitude] = useState(0);
//     let [pickupLongitude,setPickUpLongitude] = useState(0);
//     let [dropOffLattitude,setDropOffLattitude] = useState(0);
//     let [dropOffLongitude,setDropOffLongitude] = useState(0);
//     const [showModal, setShowModal] = useState(false)
//     const [showModal2, setShowModal2] = useState(false)
//     const [locationType,setLocationType]=useState('')

//     const handleLocationModal =(type)=>{
//         setLocationType(type)
//         setShowModal(true)
//       }
//     const showDatePicker = (type) => {
//         setDateType(type)
//         setDatePickerVisibility(true);
//     };
//     const hideDatePicker = () => {
//         setDatePickerVisibility(false);
//     };
//     const handleConfirm = (date) => {
//         if(dateType==='pickup'){
//             setPickUpDate(date)
//         }else if(dateType==='dropoff'){
//             setDropOffDate(date)
//         }
//         hideDatePicker();
//     };
//     const showTimePicker = (type) => {
//         setDateType(type)
//         setTimePickerVisibility(true);
//     };
//     const hideTimePicker = () => {
//         setTimePickerVisibility(false);
//     };
//     const handleTimeConfirm = (time) => {
//         if(dateType==='pickup'){
//             setPickUpTime(time)
//         }else if(dateType==='dropoff'){
//             setDropOffTime(time)
//         }
//         hideTimePicker();
//     };
//     useEffect(() => {
        
//         if(step1){
//                 var obj={
//                     pickupCity,
//                     dropOffCity,
//                     pickUpDate,
//                     dropOffDate,
//                     pickUpTime,
//                     dropOffTime,
//                     pickUpAddress,
//                     dropOffAddress,
//                     contactName,
//                     contactNumber,
//                     pickupLattitude,
//                     pickupLongitude,
//                     dropOffLattitude,
//                     dropOffLongitude
//                 }
//         console.log('data==>',obj)
//             sendData(obj,false)
//         }
//         return () => {
//         }
//     }, [step1])

// const handleLocations =(long,lati)=>{
//     console.log('long==',long)
//     console.log('lati==',lati)  
//       if(locationType=='pickUp' ){
//           setPickUpLattitude(lati);
//           setPickUpLongitude(long);
//       }
//       else if(locationType=='dropOff'){
//           setDropOffLattitude(lati);
//           setDropOffLongitude(long);
//       }
//   }

  
//     return (
//         <ScrollView>
//         {/* modal 1 */}
//         <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
//                 <Modal.Content maxWidth="350">
//         <Modal.CloseButton />
//         <Modal.Header>{`Select ${locationType}`}</Modal.Header>
//         <Modal.Body>
//           <VStack space={3}>
//             <HStack alignItems="center" justifyContent="space-between">
//             </HStack>
//           </VStack>
//           <Map handleLocations={handleLocations}/>
//           <Center>
//           <Text style={{marginTop:10}}>or</Text>
//           <Pressable
//           onPress={()=>setShowModal2(true)}
//           >
//           <Text
//           style={{marginBottom:10,fontWeight:'bold'}}
//           >Get My Current Location <MaterialIcons name="my-location" /></Text>
//           </Pressable>
//           </Center>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             flex="1"
//             onPress={() => {
//               setShowModal2(false)
//               setShowModal(false)
//             }}
//           >
//             Confirm location
//           </Button>
//         </Modal.Footer>
//       </Modal.Content>
//     </Modal>
//         {/* modal 2 */}
//         <Modal isOpen={showModal2} onClose={() => setShowModal2(false)} size="lg">
//                 <Modal.Content maxWidth="350">
//         <Modal.CloseButton />
//         <Modal.Header>{`Select ${locationType}`}</Modal.Header>
//         <Modal.Body>
//           <VStack space={3}>
//             <HStack alignItems="center" justifyContent="space-between">
//             </HStack>
//           </VStack>
//             <Location handleLocations={handleLocations}/>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             flex="1"
//             onPress={() => {
//               setShowModal2(false)
//               setShowModal(false)
//             }}
//           >
//             Confirm location
//           </Button>
//         </Modal.Footer>
//       </Modal.Content>
//     </Modal>
//                 <VStack style={styles.vStack}>
//                         <Heading size="md" mt={7}>Pickup Details</Heading>
//                         <Button size={'sm'} onPress={()=>handleLocationModal('pickUp')} colorScheme="info" style={{width:'90%'}}>Select PickUp</Button>
//                         <Heading size="xs" mt={2}>PickUp Date:</Heading>
//                         <TouchableOpacity onPress={()=>showDatePicker('pickup')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
//                             <Text>{pickUpDate ? (`${pickUpDate}`) : 'Select'}</Text>
//                         </TouchableOpacity>
//                         <DateTimePickerModal
//                             isVisible={isDatePickerVisible}
//                             mode="date"
//                             onConfirm={handleConfirm}
//                             onCancel={hideDatePicker}
//                         />
//                         <Heading size="xs" mt={2}>PickUp Time:</Heading>
//                         <TouchableOpacity onPress={()=>showTimePicker('pickup')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
//                             <Text>{pickUpTime ? (`${pickUpTime}`) : 'Select'}</Text>
//                         </TouchableOpacity>
//                         <DateTimePickerModal
//                             isVisible={isTimePickerVisible}
//                             mode="time"
//                             onConfirm={handleTimeConfirm}
//                             onCancel={hideTimePicker}
//                         />                        
//                         <Input style={styles.Input} vlaue={pickUpAddress}
//                         onChangeText={txt=>setPickUpAddress(txt)}
//                         variant="underlined" placeholder="PickUp Address" />
//                         <View style={{maxWidth:'90%'}}>
//                         <Select
//             selectedValue={pickupCity}
//         accessibilityLabel="PickUp City"
//         variant="underlined"
//         placeholder="PickUp City"
//         _selectedItem={{
//           bg: "teal.600",
//           endIcon: <CheckIcon size="5" />,
//         }}
//         mt={1}
//         onValueChange={(itemValue) => setPickupCity(itemValue)}
//       >
//           {
//               Cities.map((v,i)=>(
//                   <Select.Item key={i}  label={v} value={v} />
//               ))
//           }
//       </Select>
//       </View>
//                     <Heading size="md" mt={7}>DropOff Details</Heading>
//                     <Button size={'sm'} onPress={()=>handleLocationModal('dropOff')} colorScheme="info"  style={{width:'90%'}}>Select DropOff</Button>

//                     <Heading size="xs" mt={2}>DropOff Date:</Heading>
//                     <TouchableOpacity onPress={()=>showDatePicker('dropoff')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
//                             <Text>{dropOffDate ? (`${dropOffDate}`) : 'Select'}</Text>
//                         </TouchableOpacity>
//                         <DateTimePickerModal
//                             isVisible={isDatePickerVisible}
//                             mode="date"
//                             onConfirm={handleConfirm}
//                             onCancel={hideDatePicker}
//                         />
//                         <Heading size="xs" mt={2}>DropOff Time:</Heading>
//                         <TouchableOpacity onPress={()=>showTimePicker('dropoff')} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
//                             <Text>{dropOffTime ? (`${dropOffTime}`) : 'Select'}</Text>
//                         </TouchableOpacity>
//                         <DateTimePickerModal
//                             isVisible={isTimePickerVisible}
//                             mode="time"
//                             onConfirm={handleTimeConfirm}
//                             onCancel={hideTimePicker}
//                         />        
//                     <Input style={styles.Input} value={dropOffAddress}
//                     onChangeText={txt=>setDropOffAddress(txt)}
//                     variant="underlined" placeholder="DropOff Address" />
//                     <Input style={styles.Input} value={contactName}
//                     onChangeText={txt=>setContactName(txt)}
//                     variant="underlined" placeholder="DropOff Contact Name" />
//                     <Input style={styles.Input} value={contactNumber}
//                     onChangeText={txt=>setContactNumber(txt)}
//                     variant="underlined" placeholder="DropOff Contact Number" />
//                     <View style={{maxWidth:'90%'}}>
//                         <Select
//             selectedValue={dropOffCity}
//         accessibilityLabel="DropOff City"
//         variant="underlined"
//         placeholder="DropOff City"
//         _selectedItem={{
//           bg: "teal.600",
//           endIcon: <CheckIcon size="5" />,
//         }}
//         mt={1}
//         onValueChange={(itemValue) => setDropOffCity(itemValue)}
//       >
//           {
//               Cities.map((v,i)=>(
//                   <Select.Item key={i}  label={v} value={v} />
//               ))
//           }
//       </Select>
//       </View>
//                 </VStack>
//         </ScrollView>
//     )
// }

// const styles=StyleSheet.create({
//     vStack:{
//         marginLeft:'10%'
//     },
//         Input:{
//             fontSize:13,
//             paddingTop:15,
//             width:'90%'
//         },
//     })

// export default StepOne
