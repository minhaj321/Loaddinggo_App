import React,{useEffect,useState} from 'react'
import {View,Text,Alert} from 'react-native';
import GetLocation from 'react-native-get-location'

const Location = ({handleLocations,handle}) => {

    const [longitude,setLongitude] = useState(0)
    const [latitude,setLatitude] = useState(0)
    const [msg,setMsg] = useState('')
    
// fetching current location    
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
    handleLocations(location.longitude,location.latitude)
    // Alert.alert('We get your current location.')
    })
    .catch(error => {
        const { code, message } = error;
        // console.warn(code, message);
        if(message=="Location not available"){
            Alert.alert('Please open your mobile location and try again.')
            // setMsg()
        }

    })

    return (
        <View>
                {
                    handle!==true &&
            <Text>
                        {msg}
        </Text>
                }
        </View>
    )
}

export default Location
