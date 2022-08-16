import GetLocation from 'react-native-get-location'
import MapViewDirections from 'react-native-maps-directions';
 import React,{useState,useEffect} from 'react';
import MapView, { PROVIDER_GOOGLE ,Marker,Callout} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,TouchableOpacity, Pressable } from 'react-native';
import {Colors} from './../Colors/Colors.js';
import { HStack,VStack,Modal,Button } from 'native-base';

export default function RoutedMap({shipmentData,from,navigation}) {

  let [region,setRegion]=useState()
  const [modalData,setModalData] = useState({})
  // setting current location points
  var [departLati,setDepartLati] = useState( from.latitude)
  var [departLongi,setDepartLongi] = useState(from.longitude)
  const [showModal,setShowModal] = useState(false);
  const firstOrigin = {latitude: departLati, longitude: departLongi };
const firstDestination = {latitude: shipmentData[0].latitude, longitude: shipmentData[0].longitude };
const GOOGLE_MAPS_APIKEY = 'AIzaSyDhX60syaCg5jYirejPmeWfLHubpa2kPXo';
region={
  latitude:  from.latitude,
  longitude: from.longitude ,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
}
    const onRegionChange=(reg)=> {
      setRegion(reg);
    }

    useEffect(()=>{
      // setInterval to get position after every 5 seconds
      setInterval(()=>{
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
      })
      .then(location => {
        departLati=location.latitude
        departLongi=location.longitude
        setDepartLati(departLati);
        setDepartLongi(departLongi);
     })
      .catch(error => {
          const { code, message } = error;
          if(message=="Location not available"){
              Alert.alert('Please open your mobile location and try again.')
              navigation.navigate('Dashboard')
          }  
      })
      },5000)
    },[])

    const handleModal=(data)=>{
      setModalData(data)
      setShowModal(true)
    }

    return (
      <>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Header>Point Details: </Modal.Header>
          <Modal.Body style={{backgroundColor:Colors[modalData.count-1]}}>
            <VStack space={3} style={{marginTop:-20}}>
              {/* <HStack alignItems="center" justifyContent="space-between"> */}
                <Text fontWeight="medium" style={{color:Colors[modalData.count-1]}}>User {modalData.count}</Text>
                <Text fontWeight="medium" style={{color:'#fff'}}>{modalData.type == 'from' ? 'Its a Recieving Point' : 'Its a dropoff Point'}</Text>
                <Text fontWeight="medium" style={{color:'#fff'}}>shipmentStatus: {'\n' + modalData.shipmentStatus}</Text>
                <Text fontWeight="medium" style={{color:'#fff'}}>packageStatus: {modalData.packageStatus=='dropped_off' ? `\nYou Dropped Your Parcel but Shipper Have not confirmed it yet` : modalData.packageStatus}</Text>
                <Text fontWeight="medium" style={{color:'#fff'}}>Package Id: {modalData.packageId}</Text>
                <Text fontWeight="medium" style={{color:'#fff'}}>shipment Id: {modalData.shipmentId}</Text>
              {/* </HStack> */}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal(false)
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

    <View style={styles.container}>

<MapView initialRegion={region}
       style={styles.map}
       zoomEnabled={true}
       zoomControlEnabled={true}
       zoomTapEnabled={true}
       scrollEnabled={true}
       rotateEnabled={true}
       loadingEnabled={true}
       >
                    <Marker
                    coordinate={firstOrigin}
                    pinColor='gray'
                    >
                      <Callout>
                        <Text style={{fontSize:12}}>You are Here</Text>
                      </Callout>
                      </Marker>
                    <Marker
                    coordinate={firstDestination}
                     pinColor={Colors[shipmentData[0].count-1]}
                    >
                    <Callout onPress={()=>handleModal(shipmentData[0])}>
                      <Pressable>
                      <TouchableOpacity>
                      <Text>User {shipmentData[0].count}</Text>
                      </TouchableOpacity>
                      </Pressable>
                    </Callout>
                    </Marker>
  <MapViewDirections
    origin={firstOrigin}
    destination={firstDestination}
    apikey={GOOGLE_MAPS_APIKEY}
    strokeWidth={3}
    strokeColor={Colors[shipmentData[0].count-1]}
    onReady={result=>{
      // console.log(result.distance+'km')
      // console.log(result.duration+'min')
    }}
/>
    {
      shipmentData.map((v,i)=>{
        if(i<shipmentData.length-1){
          var origin={
            latitude: shipmentData[i].latitude, longitude: shipmentData[i].longitude 
          }
          var destination={
            latitude: shipmentData[i+1].latitude, longitude: shipmentData[i+1].longitude 
          }
          return(
            <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor={Colors[shipmentData[i+1].count-1]}
            strokeWidth={3}
            onReady={result=>{
              // console.log(result.distance+'km')
              // console.log(result.duration+'min')
            }}
        />
          )
        }
      })
    }
    
    {
      shipmentData.map((v,i)=>{
        if(i<shipmentData.length-1){
          var mark={
            latitude: shipmentData[i+1].latitude, longitude: shipmentData[i+1].longitude 
          }
          return(

            <Marker
            coordinate={mark}
            pinColor={Colors[shipmentData[i+1].count-1]}
            >
            <Callout onPress={()=>handleModal(shipmentData[i+1])}>
            <Pressable>
            <TouchableOpacity>
              <Text>User {shipmentData[i+1].count}</Text>
            </TouchableOpacity>
            </Pressable>
            </Callout>
            </Marker>
                      )
        }
      })
    }
</MapView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width:'90%',
    height:350,
    marginTop:10
  },
});