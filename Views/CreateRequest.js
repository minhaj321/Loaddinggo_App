import React,{useState,useEffect} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import AvailableTripDetails from './AvailableTripDetails';
import CreateRequestForm from './CreateRequestForm';
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const CreateRequest = ({route,navigation}) => {

  var {id} = route.params;
  const [flag,setFlag] = useState(false);
  const [cond,setCond] = useState(false)
  const [tripData,setTripData] = useState({})
  let [error,setError] = useState('');
  let [errorShow,setErrorShow] = useState(false);
  const updation = useSelector(state=>state.updation)
  const dispatch = useDispatch();
const   defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
    }
  };
  
   const onNextStep = () => {
        // console.log('called next step');
      };
        
   const   onPrevStep = () => {
        // console.log('called previous step');
      };
    
      // method to submit form
   const   onSubmitStep = () => {
     setFlag(true)
  };

  const handleFlag=()=>{
    setFlag(false)
  }

useEffect(()=>{
fetching();
},[id])

//fetching data of trip
const fetching = async()=>{
  setErrorShow(false);
  try{
  var {data} = await axios.post(`${Root.production}/trip/getTripById`,{
    tripId:id
})
if(data.status==200){
  setTripData(data.message);
  setCond(true)
}else{
  setErrorShow(true)
  setError(data.message)
}
}
catch(err){
  setErrorShow(true)
  setError(err.message)
}
}

    return (
        <ScrollView style={styles.parent}>
                  {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Request Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
          {
            cond &&
        <ProgressSteps>
          <ProgressStep
            label="Trip Details"
            onNext={onNextStep}
            onPrevious={onPrevStep}
            scrollViewProps={defaultScrollViewProps}
          >
                <AvailableTripDetails tripData={tripData}/>
          </ProgressStep>
          <ProgressStep
            label="Create Request"
            onSubmit={onSubmitStep}
            onPrevious={onPrevStep}
            scrollViewProps={defaultScrollViewProps}
          >
              <CreateRequestForm flag={flag} handleFlag={handleFlag} tripData={tripData} navigation={navigation}/>
          </ProgressStep>

        </ProgressSteps>
          }  
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    parent:{
        fontSize:20,
        paddingTop:20,
        paddingLeft:20,
        color:'black',
        fontWeight:'bold'
    },
})
export default CreateRequest
