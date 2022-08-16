import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, Surface,  Title } from 'react-native-paper';
import {Root} from './../Config/root'
import {Heading} from 'native-base';
import axios from 'axios';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const UserDashboard = () => {

    const user = useSelector(state=>state.user);
    const userId = user?.account?._id;
    const [activeShipments,setActiveShipments]  =useState(9)
    const [pendingShipments,setPendingShipments]  =useState(0)
    const [completeShipments,setCompleteShipments]  =useState(0)
    const [activeOrders,setActiveOrders]  =useState(0)
    const [pendingOrders,setPendingOrders]  =useState(0)
    const [completeOrders,setCompleteOrders]  =useState(0)
    const [pendingTrips,setPendingTrips]  =useState(0)
    const [cancelledTrips,setCancelledTrips]  =useState(0)
    const [closedTrips,setClosedTrips]  =useState(0)

    const updation = useSelector(state=>state.updation)
        
    useEffect(()=>{
        fetching();
    },[updation])

    const fetching = async()=>{
    // ACTIVEORDERS
    try{
    var {data} = await axios.post(`${Root.production}/trip/countCarrierActiveShipment`,{carrierId:userId})
    if(data.status==200){
      setActiveOrders(data.message)
    }
    // Active Shipments
    var {data} = await axios.post(`${Root.production}/trip/countShipperActiveShipment`,{accountId:userId})
    if(data.status==200){
      setActiveShipments(data.message)
    }
    // PENDING ORDERS
    var {data} = await axios.post(`${Root.production}/trip/countCarrierPendingShipment`,{carrierId:userId})
    if(data.status==200){
      setPendingOrders(data.message)
    }
    // PENDING shipments
    var {data} = await axios.post(`${Root.production}/trip/countCarrierShipperPendingShipment`,{accountId:userId})
    if(data.status==200){
      setPendingShipments(data.message)
    }
    // completed ORDERS
    var {data} = await axios.post(`${Root.production}/trip/countCarrierCompleteShipment`,{carrierId:userId})
    if(data.status==200){
      setCompleteOrders(data.message)
    }    
    // completed shipments
    var {data} = await axios.post(`${Root.production}/trip/countCarrierShipperCompleteShipment`,{accountId:userId})
    if(data.status==200){
      setCompleteShipments(data.message)
    }
    // active trips
    var {data} = await axios.post(`${Root.production}/trip/countCarrierActiveTrips`,{carrierId:userId})
    if(data.status==200){
      setPendingTrips(data.message)
    }
    // closed trips
    var {data} = await axios.post(`${Root.production}/trip/countCarrierClosedTrips`,{carrierId:userId})
    if(data.status==200){
      setClosedTrips(data.message)
    }   
    // cancel trips
    var {data} = await axios.post(`${Root.production}/trip/countCarrierCancelledTrips`,{carrierId:userId})
    if(data.status==200){
      setCancelledTrips(data.message)
    }
}
catch(err){
}}
 
const currentRole = useSelector(state => state.role)
 
    return (
 
            < ScrollView style={styles.shipperDashboardPage} >
            <View style={{flexDirection:'row' , alignItems:'center', justifyContent:'space-between'}} >
                <Headline style={{width:'90%',fontFamily:'cursive',fontSize:30,marginTop:20,fontWeight:'bold'}} >{`Welcome back, ${currentRole}`}</Headline>
            </View>
            <View>
                <Heading fontSize={20} color={'blue.500'} mt={4} mb={-7}>Offers as Carrier: </Heading>
            </View>
            <View style={styles.dashboardStats}  >
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black',textAlign:'center' ,paddingHorizontal:10}} >
                        Active Offers:
                    </Text>
                    <Text>{activeOrders}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center' ,paddingHorizontal:10}} >
                        Completed Offers:
                    </Text>
                    <Text>{completeOrders}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center' ,paddingHorizontal:10}} >
                        Pending Offers:
                    </Text>
                    <Text>{pendingOrders}</Text>
                </Surface>
            </View>
            <View>
                <Heading fontSize={20} color={'blue.500'} mt={4} mb={-7}>Shipments as Shipper: </Heading>
            </View>
            <View style={styles.dashboardStats}  >
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center' ,paddingHorizontal:10}} >
                        Active Shipments:
                    </Text>
                    <Text>{activeShipments}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center' ,paddingHorizontal:10}} >
                        Completed Shipments:
                    </Text>
                    <Text>{completeShipments}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center' ,paddingHorizontal:10}} >
                    Pending Shipments:
                    </Text>
                    <Text>{pendingShipments}</Text>
                </Surface>
            </View>
            <View>
                <Heading fontSize={20} color={'blue.500'} mt={4} mb={-7}>Trips as Carrier: </Heading>
            </View>
            <View style={styles.dashboardStats}  >
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center',paddingHorizontal:15 }} >
                        Active Trips:
                    </Text>
                    <Text>{pendingTrips}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center',paddingHorizontal:10 }} >
                        Cancelled Trips:
                    </Text>
                    <Text>{cancelledTrips}</Text>
                </Surface>
                <Surface style={styles.dashStatItem} >
                    <Text style={{ color: 'black' ,textAlign:'center',paddingHorizontal:10 }} >
                    Closed Trips:
                    </Text>
                    <Text>{closedTrips}</Text>
                </Surface>
            </View>

        </ScrollView>      
    )
}

const styles = StyleSheet.create({
    shipperDashboardPage: {
        width: '95%',
        alignSelf: 'center',
    },
    dashboardStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        width: '100%',
        alignSelf: 'center'
    },
    dashStatItem: {
        alignItems: 'center',
        height: 100,
        width: '32%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        textAlign: 'center',
        backgroundColor:'lightblue',
    }
})

export default UserDashboard
