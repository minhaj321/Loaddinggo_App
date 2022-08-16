import {Text,Alert} from 'react-native'
import { View,VStack,HStack,Center, Input, Button, Flex } from 'native-base'
import React,{useState,useEffect} from 'react'
import {io} from "socket.io-client";
import {Root} from './../Config/root';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch,useSelector} from 'react-redux';
import {setUpdation} from './../Store/action';

const Chat = ({route}) => {
    // connecting with socket.io
    const socket = io('https://stg-dakiyah.herokuapp.com');
    const user = useSelector(state=>state.user)
    const userId = user?.account?._id;
    const [msg,setMsg] = useState('')
    var [cond,setCond] = useState([]);
    var { id } = route.params;
    var [arr, setArr] = useState([]);
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);

    socket.emit('RoomJoin', { roomId: id });
    socket.on('getMessages', (data) => {
    arr = data.chats.reverse();
    setArr(arr);
    })
    useEffect(() => {
fetching();
}, [id])

// fetching of all messages 
const fetching = async()=>{
    setErrorShow(false);
try{
var {data} = await axios.post(`${Root.production}/chat/getChatById`,{
    chatId : id
})
if(data.status == 200){
    arr= data.message.chats.reverse();
    setArr(arr);
    setCond(true)
}else{
    setErrorShow(true)
    setError(data.message)
}
}catch(err){
    setErrorShow(true)
    setError(err.message)
}
}

// method to send message with socket.io
const handleSendMsg=()=>{
    if(msg===''){
        Alert.alert('Type message first')
    }else{
        socket.emit('sendMessage',{senderId:userId,message:msg})
        setMsg('')
    }
}

    return (
        <View>
            <Center>
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    CHatting Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }
            <HStack>
                <VStack>
                    <ScrollView style={{width:300,height:"70%",marginBottom:"7%",marginTop:'12%',borderColor:'lightgray',borderWidth:1,borderRadius:10}}>
                    {arr.length > 0 &&
                                    arr.map((data, index) => (
                                        <View key={index}>
                                   <Text
                                   style={data.senderId=='61672ae9bf29bb77c5c94059'? 
                                   {
                                       backgroundColor: '#203D88',
                                       color: '#fff',
                                       padding: 10,
                                       borderRadius:15,
                                       textAlign:'right',
                                       marginLeft: 10,
                                       marginTop:5,
                                       overflowWrap:'break-word',
                                    }
                                    :
                                    {
                                        color: '#203D88',
                                       backgroundColor: 'lightgray',
                                    padding: 10,
                                   textAlign:'left',
                                    borderRadius:15,
                                   marginTop:5,
                                   marginRight: 10,
                                    overflowWrap:'break-word',
                                    }
                                }
                                   >
                                       {data.message}
                                   </Text>
                                   </View>
                                   ))}

                    </ScrollView>
                    <View style={{width:300,height:"20%"}}>
                        <Flex direction="row">
                        <Input value={msg} onChangeText={txt=>setMsg(txt)} placeholder="Enter message here" variant="underlined" width={"80%"}/>
                        <Button onPress={handleSendMsg}>
                            Send
                        </Button>
                        </Flex>
                    </View>
                </VStack>
            </HStack>
            </Center>
        </View>
    )
}

export default Chat
