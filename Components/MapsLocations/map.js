import React,{useState} from 'react';
import {View,StyleSheet} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({handleLocations}) => {

  let [region,setRegion]=useState() 
  const [longitude, setLongitude] = useState(67.118610);
  const [latitude, setLatitude] = useState(24.931923);
  const origin = {latitude: 24.931923, longitude: 67.118610 };
region={
    latitude:  24.931923,
    longitude: 67.118610 ,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  }
    return (
        <View>
            <MapView initialRegion={region}
       style={styles.map}
       zoomEnabled={true}
       zoomControlEnabled={true}
       zoomTapEnabled={true}
       scrollEnabled={true}
       rotateEnabled={true}
      //  loadingEnabled={true}
       >
        <Marker
          coordinate={origin}
          draggable={true}
          onDragEnd={e=>{
            handleLocations(e.nativeEvent.coordinate.longitude,e.nativeEvent.coordinate.latitude)
            setLatitude(e.nativeEvent.coordinate.latitude);
            setLongitude(e.nativeEvent.coordinate.longitude);
                    }}
                    />
</MapView>
        </View>
    )
}

export default Map


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width:'100%',
      height:300,
    },
  });