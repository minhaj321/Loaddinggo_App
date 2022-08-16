// import React,{useState} from 'react'
// import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
// import { HStack,VStack ,Center,Heading,Input,Select,CheckIcon,Radio} from 'native-base';
// import {AuctionDuration} from './../Cities/Cities';
// const stepTwo = ({step3,sendData}) => {

//     const [durationTime,setDurationTime]=useState('')
//     const [startingBid,setStartingBid]=useState('')
    
// useEffect(() => {
//     if(step3){
//         var obj={
//             startingBid,
//             durationTime
//         }
//         console.log('three==>',obj)
//         sendData(obj,true)
//     }
//     return () => {
//     }
// }, [step3])


    
//     return (
//         <View>
//         <VStack style={styles.vStack}>
//             <Heading size="md" mt={7}>Auction Details</Heading>
//             <Heading size="xs" mt={3}>Auction Duration :</Heading>
//             <View
//             style={{width:'90%'}}
//             >
//             <Select
//     selectedValue={durationTime}
// variant="underlined"
// accessibilityLabel="Auction Duration"
// placeholder="Auction Duration"
// _selectedItem={{
//   bg: "teal.600",
//   endIcon: <CheckIcon size="5" />,
// }}
// mt={1}
// onValueChange={(itemValue) => setDurationTime(itemValue)}
// >
//   {
//       AuctionDuration.map((v,i)=>(
//           <Select.Item key={i}  label={v.label} value={v.val} />
//       ))
//   }
// </Select>
// </View>

//             <Heading size="xs" mt={5}>Starting Amount:</Heading>
//             <Input style={styles.Input} 
//             value={startingBid}
//             onChangeText={txt=>setStartingBid(txt)}
//             variant="underlined" placeholder="Rs : (PKR)" />

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
