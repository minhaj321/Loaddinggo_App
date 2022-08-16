import React,{useState,useEffect} from 'react'
import {ScrollView,Text,StyleSheet,View} from 'react-native';
import AuctionCard from '../Components/Cards/AuctionCard';
import axios from 'axios';
import { Root } from '../Config/root';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Heading} from 'native-base'
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';


const MyAuctions = () => {

    const [auctions,setAuctions] = useState([]);
    const [error,setError] = useState('')
    const [errorShow,setErrorShow] = useState(false)
    const user = useSelector(state=>state.user)
    const userId = user?.account?._id;

    const updation = useSelector(state=>state.updation)
const dispatch = useDispatch();


useEffect(()=>{
  dispatch(setUpdation())
},[])


    useEffect(()=>{
        fetching();
    },[userId,updation])

// getting auctions w.r.t user
const fetching=async()=>{
        setErrorShow(false);
        try{
        var {data} =  await axios.post(`${Root.production}/auction/getAuctionByUser`,{
            accountId : userId
        })
        if(data.status==200){
            setAuctions(data.message)
        }
        else{
            setError(data.message)
            setErrorShow(true)
        }
    }
catch(err){
    setError(err.message)
    setErrorShow(true)
}
    }

    return (
        <View>        
            <Text style={styles.heading}>My Auctions</Text>
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
            {
              auctions.length==0 &&
              <Text style={{display:'flex',alignSelf:'center',marginTop:20}}>There is no auction.</Text>
            }
      <ScrollView>
          {auctions &&
          auctions.reverse().map((v,i)=>{
              return(
                  <View key={i}>
                  <AuctionCard route='AuctionDetails' data={v}/>
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


export default MyAuctions
