import React,{useState,useEffect} from 'react'
import { View ,Button, HStack, ScrollView,VStack, Center,Modal} from 'native-base'
import RoutedMap from './../Components/MapsLocations/routedMap';
import { Alert, StyleSheet,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import FeatherIcon from 'react-native-vector-icons/dist/Feather'
import axios from 'axios';
import { Root } from '../Config/root';
import storage from '@react-native-firebase/storage';
import StarRating from 'react-native-star-rating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';
import { Colors } from '../Components/Colors/Colors';

const ActiveTimeline = ({shipmentData,from,navigation}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedback, setFeedback] = useState(2.5);
    const handleFeedbackOpen = () => setFeedbackOpen(true);
    const handleFeedbackClose = () => setFeedbackOpen(false);
    const [disable,setDisable] = useState(false);
    const [file,setFile]=useState('');
    const [photoName,setPhotoName]=useState('');
    const [currentPackage,setCurrentPackage]=useState('');
  var [listForRoute, setListForRoute] = useState([]);
    const [currentShipment,setCurrentShipment]=useState('');
    const [accountId,setAccountId] = useState('');
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    var [update,setUpdate] = useState(false)    

      for(let i=0;i<shipmentData.length;i++){
          if(shipmentData[i].type=='from'){
        if(shipmentData[i].packageStatus==='not_picked_up' || shipmentData[i].packageStatus==='NOT_PICKED_UP' ||
         shipmentData[i].packageStatus==='picked_up'){
            listForRoute.push(shipmentData[i])
          }
        }
       // end of if
        else if(shipmentData[i].type=='to'){
        if(shipmentData[i].packageStatus!=='dropped_off'){
                listForRoute.push(shipmentData[i])
        }
          } // end of else
      } // end of for loop
  
  // fuction to verify shipment
    const handleVerify =(packageId,shipmentId)=>{
      setCurrentPackage(packageId)
      setCurrentShipment(shipmentId)
      handleOpen();
    }
  // function to handle rating
    const handleRating =async()=>{
      setErrorShow(false);
      try {
        var {data} = await axios.post(`${Root.production}/trip/giveRating`,{
          rating:feedback,
          accountId:accountId
        })
        if(data.status==200){
          handleFeedbackClose();
          dispatch(setUpdation())
          Alert.alert("Rating Successfull")
        }else{
          setErrorShow(true)
          setError(data.message)
        }
        
      } catch (err) {
        setErrorShow(true)
        setError(err.message)
        
      }
    }
  // function to send data to check verification
    const handleCheckVerification= async()=>{
      setErrorShow(false);
      try{
      await storage().ref(`/verify/${currentPackage}`).putFile(file);
        await  storage().ref('/verify').child(currentPackage)
        .getDownloadURL().then(async (uri)=>{
          var {data} = await axios.post(`${Root.production}/trip/uploadShipmentVerificationImage`,{
            shipmentOfferId : currentShipment ,
            verificationImage : uri
          })
          if(data.status==200){
            dispatch(setUpdation())
            handleClose();
          }else{
            setErrorShow(true)
            setError(data.message)
          }
        })
      }
      catch(err){
        setErrorShow(true)
        setError(err.message)      
      }
    }
  // function to identify pickup
  const handlePickedUp = async (packageId)=>{
    setErrorShow(false);
    try {
      
          var {data}  = await axios.post(`${Root.production}/trip/pickupPackage`,{
            packageId: packageId
          })
          if(data.status==200){
            dispatch(setUpdation())
            Alert.alert('success in pickup')
          }
          else{
            setErrorShow(true)
            setError(data.message)}
      
    } catch (err) {
      setErrorShow(true)
      setError(err.message)
      
    }  
  }
  // function to identify dropoff
  const handleDropOff = async (shipmentId,accountId)=>{
    setErrorShow(false);
    try {
      var {data} = await axios.post(`${Root.production}/trip/dropOff`,{
        shipmentOfferId:shipmentId
      })
      if(data.status==200){
      dispatch(setUpdation())
      setAccountId(accountId)
        handleFeedbackOpen();
      }else{
        setErrorShow(true)
        setError(data.message)}
      
    } catch (err) {
      setErrorShow(true)
      setError(err.message)
      
    }

  }
// called after 1 second to ensure rendering of other dependent vairables 
  setTimeout(()=>{
    setDisable(true)
  },1000)
  // method to skip shipment
  const handleSkip = async(shipmentId)=>{
  var {data} = await axios.post(`${Root.production}/trip/cancelShipment`,{
    shipmentOfferId :shipmentId
  })
  if(data.status==200){
    dispatch(setUpdation())
  }}

    return (
        <View style={styles.container}>
          {/* modal for rating */}
        <Modal isOpen={feedbackOpen} onClose={() => handleFeedbackClose()}>
             <Modal.Content maxWidth="400px">
               <Modal.Header>Rate Shipper</Modal.Header>
               <Modal.Body>
               <StarRating
            maxStars={5}
            fullStarColor="yellow"
            rating={feedback}
            selectedStar={(rating) => setFeedback(rating)}
              />
               </Modal.Body>
               <Modal.Footer>
                     <Button onPress={handleRating}>Rate</Button>
               </Modal.Footer>
             </Modal.Content>
           </Modal>     

{/* modal for image verification */}
   <Modal isOpen={open} onClose={() => handleClose()}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Choose Image for verification</Modal.Header>
          <Modal.Body>
          <TouchableOpacity onPress={() => {
              ImagePicker.launchImageLibrary(
                  {
                      mediaType: 'photo',
                       includeBase64: true,
                      maxHeight: 200,
                      maxWidth: 200,
                  },
                  (response) => {
                      setFile(response.assets[0].uri)
                      setPhotoName(response.assets[0].fileName)
                  },
              )
          }} >
              <FeatherIcon style={styles.searchIcon} name='upload' size={20} color='#000' />
          </TouchableOpacity>
                        <View>
                        <Text>{photoName}</Text>
                        </View>
          <Modal.Footer>
                <Button onPress={handleCheckVerification}>Send</Button>
          </Modal.Footer>
          </Modal.Body>
        </Modal.Content>
      </Modal>       
          <Center>
          {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:250}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Login Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
            <ScrollView style={{height:150}}>
            { disable &&
              shipmentData.map((v,i)=>{
                console.log(v.packageStatus)
                if(v.type=='from'){
                    return(
                      <>
                      <View key={i}>
                        <Button style={(v.packageStatus=='NOT_PICKED_UP' || v.packageStatus=="not_picked_up")  ? 
                        { width:200,  marginTop:10,  backgroundColor:Colors[v.count-1]} : 
                        { width:200,  marginTop:10,  backgroundColor:'lightgray'}}
                        disabled={(v.packageStatus=='NOT_PICKED_UP' || v.packageStatus=="not_picked_up") ? false : true}
                        onPress={()=>handlePickedUp(v.packageId)}
                        >{`User ${v.count} Pick Up`}</Button>
                      </View>
                      <View key={i}>
                        <Button style={v.packageStatus =='picked_up'  ? 
                        { width:200,  marginTop:10,  backgroundColor:Colors[v.count-1]} : 
                        { width:200,  marginTop:10,  backgroundColor:'lightgray'}}
                        disabled={v.packageStatus =='picked_up' ? false : true}
                        onPress={()=>handleVerify(v.packageId,v.shipmentId)}
                        >{`User ${v.count} Image Verification`}</Button>
                        </View>
                        </>
                    )
                }
                else if(v.type=='to'){
                        return(
                          <View key={i}>
                        <Button style={v.packageStatus=='delivery_in_progress' ? 
                        { width:200,  marginTop:10,  backgroundColor:Colors[v.count-1]} : 
                        { width:200,  marginTop:10,  backgroundColor:'lightgray'}}
                        disabled={v.packageStatus=='delivery_in_progress' ? false : true}
                        onPress={()=>handleDropOff(v.shipmentId,v.accountId)}
                        >{`User ${v.count} Drop Off`}</Button>
                        </View>
                        )
                }
                })}
            </ScrollView>
            </Center>
            { listForRoute[0] &&
      <RoutedMap from={from} shipmentData={listForRoute}
      navigation={navigation}
      />
            }

        </View>
    )
}

const styles=StyleSheet.create({

pickup:{
  width:100,
  marginTop:10,
  backgroundColor:'green'
},
Verify:{
  width:100,
  marginTop:10,
  backgroundColor:'orange'
},
DropOff:{
  width:100,
  marginTop:10,
  backgroundColor:'green'
},
container:{
}
})

export default ActiveTimeline
