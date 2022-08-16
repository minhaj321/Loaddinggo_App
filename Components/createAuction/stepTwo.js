// import React,{useState,useEffect} from 'react'
// import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
// import { HStack,VStack ,Center,Heading,Input,Select,CheckIcon,Radio} from 'native-base';
// import FeatherIcon from 'react-native-vector-icons/dist/Feather'
// import * as ImagePicker from 'react-native-image-picker'
// import {ShipmentTypes} from './../Cities/Cities';

// const stepTwo = ({step2,sendData}) => {

//     const [value, setValue] = useState(true)
//     const [shipmentType,setShipmentType]=useState('')
//     const [height,setHeight]=useState('')
//     const [weight,setWeight]=useState('')
//     const [width,setWidth]=useState('')
//     const [packageWorth,setPackageWorth]=useState('')
//     let [photo, setPhoto] = useState(null)
//     let [photoName, setPhotoName] = useState('')

//     useEffect(() => {
        
//         return () => {
//             if(step2){
//                 var obj={
//                     fragile:value,
//                     shipmentType,
//                     height,
//                     weight,
//                     width,
//                     packageWorth,
//                     photo,
//                     photoName
//                 }
//                 console.log('second step==>',obj)
//                 sendData(obj,false)
//             }
//         }
//     }, [step2])    


//     return (
//         <View>
//         <VStack style={styles.vStack}>
//             <Heading size="md" mt={7}>Package Details</Heading>
//             <Heading size="xs" mt={3}>Shipment Size:</Heading>
//             <Input style={styles.Input} variant="underlined" value={height} 
//             onChangeText={txt=>setHeight(txt)}
//             placeholder="Height (cm)" />
//             <Input style={styles.Input} variant="underlined" value={width} 
//             onChangeText={txt=>setWidth(txt)}
//             placeholder="Width (cm)" />
//             <Heading size="xs" mt={5}>Shipment Weight:</Heading>
//             <Input style={styles.Input} variant="underlined" value={weight}
//             onChangeText={txt=>setWeight(txt)}
//             placeholder="Weight (kg)" />
//             <Heading size="xs" mt={5}>Fragile:</Heading>
//             <Radio.Group
// name="myRadioGroup"
// accessibilityLabel="favorite number"
// value={value}
// onChange={(nextValue) => {
// setValue(nextValue)
// }}
// >
// <HStack>
// <Radio value={true} mt={1} mr={2}>
// Yes
// </Radio>
// <Radio value={false} mt={1}>
// No
// </Radio>
// </HStack>
// </Radio.Group>
//             <Heading size="xs" mt={5}>What best describe your shipment:</Heading>
//             <View
//             style={{width:'90%'}}
//             >
//             <Select
//     selectedValue={shipmentType}
// variant="underlined"
// accessibilityLabel="Shipemnt Type"
// placeholder="Shipemnt Type"
// _selectedItem={{
//   bg: "teal.600",
//   endIcon: <CheckIcon size="5" />,
// }}
// mt={1}
// onValueChange={(itemValue) => setShipmentType(itemValue)}
// >
//   {
//       ShipmentTypes.map((v,i)=>(
//           <Select.Item key={i}  label={v} value={v} />
//       ))
//   }
// </Select>
// </View>
// <Input style={styles.Input} value={packageWorth}
// onChangeText={txt=>setPackageWorth(txt)}
// variant="underlined" placeholder="Total Value of shipment" />
// <View style={styles.uploadSection}>
//                         <View style={{flexDirection:'row',justifyContent:'space-between'}} >
//                         <Text>Shipment Picture</Text>
//                         <TouchableOpacity onPress={() => {
//                             ImagePicker.launchImageLibrary(
//                                 {
//                                     mediaType: 'photo',
//                                     includeBase64: false,
//                                     maxHeight: 200,
//                                     maxWidth: 200,
//                                 },
//                                 (response) => {
//                                     setPhoto(response?.assets[0].uri)
//                                     setPhotoName(response?.assets[0].fileName)
//                                 },
//                             )
//                         }} >
//                             <FeatherIcon style={styles.searchIcon} name='upload' size={20} color='#000' />
//                         </TouchableOpacity>
                       
//                         </View>
//                         <View>
//                         <Text>{photo === '' ? '' : photoName}</Text>
//                         </View>
//                     </View>
//             </VStack>
//         </View>
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
//         uploadSection: {
//             borderWidth: 1,
//             borderRadius: 2,
//             backgroundColor: '#F8F9FB',
//             width: "90%",
//         }
//     })


// export default stepTwo
