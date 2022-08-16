import React,{useState,useEffect} from 'react'
import {View} from 'native-base'
import { Root } from '../Config/root';
import axios from 'axios';
import Location from '../Components/MapsLocations/location';
import ActiveTimeline from './ActiveTimeline.js'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading,Modal,HStack,VStack,Button} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from './../Components/Colors/Colors.js';

const CurrentShipment = ({route,navigation}) => {

    const user = useSelector(state=>state.user)
    const userId = user?.account?._id;    
    var [shipmentsList, setShipmentsList] = useState([]);
    var [shipmentData, setShipmentData] = useState([]);
    var [departureLattitude, setDepartureLatitude] = useState(0);
    var [departureLongitude, setDepartureLongitude] = useState(0);
    var [cond, setCond] = useState(false);
    var [sortCond,setSortCond] =useState(false);
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)
    var [remainedArray,setRemainedArray] = useState([])
    var [shipmentsIdArray,setShipmentsIdArray] = useState([])
    var [newShipmentList,setNewShipmentList] = useState([]);

    useEffect(()=>{
        fetching();
    },[updation])

    // fetching shipments
    const fetching =async()=>{
      setErrorShow(false);
      try{

        setCond(false)
    var {data} = await axios.post(`${Root.production}/trip/getShipmentOffersByCarrier`,{
        carrierId : userId
    })
    if(data.status==200){
        // start
        shipmentData=[]
        var count=1;
        for (let i = 0; i < data.message.length; i++) {
            // completion of insertion
            // initialization of shipmentData setting
            if (data.message[i].status == "Active") {
              var shipmentsObj = await axios.post(
                `${Root.production}/trip/viewShipmentOfferDetails`,
                { shipmentOfferId: data.message[i]._id }
              );
              // inset in array
              shipmentsList.push(shipmentsObj.data.message);
              // pushing types
              await shipmentData.push({
                shipmentStatus: shipmentsObj.data.message.shipmentOffer.status,
                packageId: shipmentsObj.data.message.package._id,
                count:count,
                shipmentId: shipmentsObj.data.message.shipmentOffer._id,
                longitude: parseFloat(
                  shipmentsObj.data.message.shipmentOffer.pickupLongitude
                ),
                latitude: parseFloat(
                  shipmentsObj.data.message.shipmentOffer.pickupLattitude
                ),
                packageStatus: shipmentsObj.data.message.package.packageStatus,
                longDiff:
                  parseFloat(
                    shipmentsObj.data.message.shipmentOffer.pickupLongitude
                  ) - departureLongitude,
                latiDiff:
                  parseFloat(
                    shipmentsObj.data.message.shipmentOffer.pickupLattitude
                  ) - departureLattitude,
                type: "from",
              });
              await shipmentData.push({
                shipmentStatus: shipmentsObj.data.message.shipmentOffer.status,
                accountId: shipmentsObj.data.message.shipmentOffer.accountId,
                packageId: shipmentsObj.data.message.package._id,
                count:count,
                shipmentId: shipmentsObj.data.message.shipmentOffer._id,
                longitude: parseFloat(
                  shipmentsObj.data.message.shipmentOffer.dropOffLongitude
                ),
                latitude: parseFloat(
                  shipmentsObj.data.message.shipmentOffer.dropOffLattitude
                ),
                packageStatus: shipmentsObj.data.message.package.packageStatus,
                longDiff:
                  parseFloat(
                    shipmentsObj.data.message.shipmentOffer.dropOffLongitude
                  ) - departureLongitude,
                latiDiff:
                  parseFloat(
                    shipmentsObj.data.message.shipmentOffer.dropOffLattitude
                  ) - departureLattitude,
                type: "to",
              });
              count++;
            }
            // ending of shipmentData setting
          }
          if(sortCond ==false){
          if (shipmentData) {
            setSortCond(true);
            shipmentData.sort((a, b) => {
              if (a.longDiff < b.longDiff) {
                return -1;
              }
              if (a.longDiff > b.longDiff) {
                return 1;
              }
              if (a.latiDiff < b.latiDiff) {
                return -1;
              }
              if (a.latiDiff > b.latiDiff) {
                return 1;
              }
              return 0;
            });
            // begining of pickup and dropoff sorting
            for(let i=0;i<shipmentData.length;i++){
              if(shipmentData[i].type==='from'){
                newShipmentList.push(shipmentData[i]);
                // setNewShipmentList(newShipmentList);
                shipmentsIdArray.push(shipmentData[i].shipmentId)
                // setShipmentsIdArray(shipmentsArray)
              }
              else if(shipmentData[i].type==='to'){
                var indexIs= shipmentsIdArray.findIndex((val)=>val===shipmentData[i].shipmentId)
                if(indexIs!=-1){
                  newShipmentList.push(shipmentData[i]);
                  // setNewShipmentList(newShipmentList);
                  shipmentsIdArray.push(shipmentData[i].shipmentId)
                  // setShipmentsIdArray(shipmentsArray)
                }
                else{
                  remainedArray.push(shipmentData[i])
                  // setRemainedArray(remainedArray)
                }
              }
            }
            remainedArray.map((v,i)=>{
              newShipmentList.push(v);
            })
          }
        }

          
          setShipmentsList(shipmentsList);
          setShipmentData(shipmentData);
          setCond(true);
} else{
  setErrorShow(true)
  setError(data.message)
}
}
catch(err){
  setErrorShow(true)
  setError(err.message)
}
    }
    // function to handle coords
    const handleLocations =(long,lati)=>{
        departureLattitude=lati;
          departureLongitude=long;
          setDepartureLatitude(departureLattitude);
          setDepartureLongitude(departureLongitude);
  }

    return (
      <>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                  <Modal.Content maxWidth="350">
          <Modal.Header>Color Codes</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
        {Colors.map((v,i)=>(
          <HStack alignItems="center" justifyContent="space-between">
            <View style={{height:20,width:50,backgroundColor:v}}></View>
            <Text>{`Color For User ${i+1}`}</Text>
          </HStack>
              ))}

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

        <View>
                  {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:250}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Fetching Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
            
            <Text style={{fontSize:20,marginLeft:10,marginTop:10,fontWeight:'bold'}}>
                Current Shipments 
            </Text>
            <View style={{display:'flex',alignItems:'flex-end',marginRight:20}}>
              <AntDesign name="infocirlce" size={20}  onPress={()=>setShowModal(true)}/>
            </View>
            <Location handleLocations={handleLocations} handle={true} />
            {
              (departureLattitude!==0 && departureLongitude!==0) &&
            <ActiveTimeline
            navigation={navigation}
              shipmentData={newShipmentList}
              from={{
                longitude: departureLongitude,
                latitude: departureLattitude,
              }}
            />
            }
        </View>
        </>
    )
}

export default CurrentShipment
