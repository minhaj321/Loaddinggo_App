import React,{useState,useEffect} from 'react'
import StatusBadge from '../Components/StatusBadges/StatusBadge'
import { Container,Button ,Stack,Flex} from 'native-base';
import {ScrollView,StyleSheet,View} from 'react-native';
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import TripRoutedMap from './../Components/MapsLocations/TripRouteMap'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const AvailableTripDetails = ({tripData}) => {

    const [trip,setTrip] = useState({})
    const [vehicle,setVehicle] = useState({})
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);

    useEffect(()=>{
        fetching();
    },[])
//fetching data
    const fetching=async()=>{
        setErrorShow(false)
        try{
        setTrip(tripData)
        var {data} = await axios.post(`${Root.production}/vehicle/getVehicleById`,{
            vehicleId : tripData.vehicleId
        })
        if(data.status==200){
            setVehicle(data.message)
        }else{
        setErrorShow(true);
        setError(data.message)

        }
}
catch(err){
    setErrorShow(true);
    setError(err.message)}
    }

    return (
        <ScrollView>
        <Text style={styles.heading}>Trip Details</Text>
        {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Fetching Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }

            <View style={{flexDirection:'row',alignItems:'center',marginLeft:20,marginTop:10}} >
            <Text>Status: </Text><StatusBadge tag='Open' />
            </View>  
            <View style={styles.container}>
                <Heading size="md" style={styles.subheading}>
                Carrier Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    CarrierId : {trip.accountId}
                    </Text>
                </Container>
                
                <Heading size="md" style={styles.subheading}>
                Trip Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    Trip Id : {trip._id}
                    </Text>
                    <Text>
                    From : {trip.departureCity}
                    </Text>
                    <Text>
                    To : {trip.destinationCity}
                    </Text>
                    <Text>
                    Departure : {trip.departureAddress}
                    </Text>
                    <Text>
                    Destination : {trip.destinationAddress}
                    </Text>
                    <Text>
                    Departure Date : {trip.departureDate}
                    </Text>
                    <Text>
                    Departure Time : {trip.departureTime}
                    </Text>
                </Container>
               
                <Heading size="md" style={styles.subheading}>
                Vehicle Details
                </Heading>
                <Container style={styles.data}>
                    <Text>
                    Vehicle Id : {vehicle._id}
                    </Text>
                    <Text>
                    Manufacturer : {vehicle.manufacturer}
                    </Text>                    
                    <Text>
                    Model : {vehicle.model}
                    </Text>
                    <Text>
                    Year : {vehicle.year}
                    </Text>
                    <Text>
                    Number Plate : {vehicle.licensePlate}
                    </Text>
                </Container>
                {(trip?.departureLattitude) &&
                    <TripRoutedMap
                    departurelati={trip?.departureLattitude}
                    departurelongi={trip?.departureLongitude}
                    destinationlati={trip?.destinationLattitude}
                    destinationlongi={trip?.destinationLongitude}
                    />
    }

            </View> 
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        fontWeight:'bold'
    },
    container:{
        marginLeft:'5%'
    },
    subheading:{
        marginTop:10
    },
    data:{
        marginTop:10,
        backgroundColor:'lightgray',
        padding:8,
        borderRadius:20,
        marginBottom:10        
    },
})

export default AvailableTripDetails
