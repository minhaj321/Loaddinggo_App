import MapViewDirections from 'react-native-maps-directions';
 import React,{useState} from 'react';
import MapView, { PROVIDER_GOOGLE ,Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,PermissionsAndroid, Button } from 'react-native';



export default function TripRoutedMap({departurelati,departurelongi,destinationlati,destinationlongi}) {
  let [region,setRegion]=useState()
// setting origin and destination
const origin = {latitude: parseFloat(departurelati), longitude: parseFloat(departurelongi) };
const destination = {latitude: parseFloat(destinationlati), longitude: parseFloat(destinationlongi) };

const GOOGLE_MAPS_APIKEY = 'AIzaSyDhX60syaCg5jYirejPmeWfLHubpa2kPXo';
region={
  latitude:   24.902092827540947,
  longitude: 67.11363069689169 ,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
}

    const onRegionChange=(reg)=> {
      setRegion(reg);
    }
    return (
    <View style={styles.container}>

<MapView initialRegion={region}
       style={styles.map}
       zoomEnabled={true}
       zoomControlEnabled={true}
       zoomTapEnabled={true}
       onMapReady={()=>console.log(region)}
       onMapLoaded={()=>console.log('so on')}
       scrollEnabled={true}
       rotateEnabled={true}
       loadingEnabled={true}
 
       >
                    <Marker
                    coordinate={origin}
                    />
                    <Marker
                    coordinate={destination}
                    />
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
    strokeWidth={3}
    onReady={result=>{
      console.log(result.distance+'km')
      console.log(result.duration+'min')
    }}
/>
</MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width:'80%',
    height:400,
  },
});