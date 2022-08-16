import React,{useEffect,useState} from 'react'
import {ScrollView,StyleSheet,View} from 'react-native';
import Trip from '../Components/Cards/Trip';
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text,Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const AvailableTrips = () => {

    const [allTrips,setAllTrips] = useState([]);
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const updation = useSelector(state=>state.updation)
    const dispatch = useDispatch();
    
    
    useEffect(()=>{
      dispatch(setUpdation())
    },[])
    
    useEffect(()=>{
        fectching();
    },[updation])

// fetching of data
    const fectching=async()=>{
      setErrorShow(false);
        try{
        var {data} = await axios.get(`${Root.production}/trip/getAllActiveTrips`);
        if(data.status===200){
            setAllTrips(data.message);
        }else{
            setErrorShow(true)
            setError(err.message)
        }
    }
    catch(err){
        setErrorShow(true)
        setError(err.message)
    }
    }

    return (
        <View>
            <Text style={styles.heading}>Available Trips</Text>
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
            {
              allTrips.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>There is no trips.</Text>
            }
      <ScrollView>
          {allTrips &&
          allTrips.reverse().map((v,i)=>{
              return(
                  <View key={i}>
                  <Trip route={'CreateRequest'} data={v}/>
                </View>
              )
          })}
        </ScrollView>
        </View>
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
    button1:{
        width:70,
        height:40,
    },
    button:{
        width:80,
        height:40,
        marginLeft:-12
    },
    btn_group:{
        marginTop:20,
        marginBottom:20
    }
})


export default AvailableTrips
