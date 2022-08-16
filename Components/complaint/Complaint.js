import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React,{useState} from 'react'
import {View,Text,Alert} from 'react-native';
import { Heading,Modal,Input,Button,Center,Select,CheckIcon ,TextArea,HStack} from 'native-base';
import {Root} from './../../Config/root';
import axios from 'axios';

const Complaint = ({navigation,shipperId,shipmentId,carrierId,packageId,chatRoomId}) => {

    const [modal,setModal] = useState(false);
    const openModal = ()=>setModal(true)
    const closeModal = ()=>setModal(false)
    const [complaintTitle,setComplaintTitle] = useState('')
    const [complaintDesc,setComplaintDesc] = useState('')
    const [errCond,setErrCond] = useState(false);
    const [errorText,setErrorText] = useState('')
 
    // sending complaint
    const handleComplaint = async()=>{
        setErrCond(false);
        try{
        var {data} = await axios.post(`${Root.production}/complaint/createComplaint`,{
            shipperId:shipperId,
            carrierId:carrierId,
            shipmentId:shipmentId,
            packageId:packageId,
            chatroomId:chatRoomId,
            complaintTitle:complaintTitle,
            complaintDescription:complaintDesc,
          })
          if(data.status===200){
            navigation.navigate(`Dashboard`)
          }
        else{
            setErrorText(data.message);
            setErrCond(true)
          }
        }catch(err){
            setErrorText(err.message)
            setErrCond(true)
    }}

    return (
        <>
      <Modal isOpen={modal} onClose={() => closeModal()} size="lg">
                  <Modal.Content maxWidth="350">
        <Modal.Header>
                <Heading size="md" fontWeight="medium">Create Complaint</Heading>
        </Modal.Header>
          <Modal.Body>
          {
              errCond &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,width:'90%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Sending Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {errorText._message}
                </Text>
              </View>
            }  
          <Heading size="xs" mt={5}>Complaint Type:</Heading>
              <View
              style={{width:'90%'}}
              >
              <Select
      selectedValue={complaintTitle}
  variant="underlined"
  accessibilityLabel="Shipemnt Type"
  placeholder="Shipemnt Type"
  _selectedItem={{
    bg: "teal.600",
    endIcon: <CheckIcon size="5" />,
  }}
  mt={1}
  onValueChange={(itemValue) => setComplaintTitle(itemValue)}
  >
    {
        ['Late Delivery','Early Delivery','Out of Track','Parcel has Stolen'].map((v,i)=>(
            <Select.Item key={i}  label={v} value={v} />
        ))
    }
  </Select>
  </View>
  <Heading size="xs" mt={5}>Complaint Description:</Heading>
  <TextArea
      h={20}
      placeholder="Text Area Placeholder"
      value={complaintDesc}
      onChangeText={(e) => {
    setComplaintDesc(e)
}}
      w={{
        base: "90%",
        md: "25%",
      }}
      mt={5}
      mb={5}
/>
<HStack>
<Button
            colorScheme="primary"
              flex="1"
              size={'sm'}
              mr={5}
              onPress={closeModal}
            >
              Close
            </Button>


                <Button
                size={'sm'}
            colorScheme="danger"
              flex="1"
              onPress={handleComplaint}
            >
              Complaint
            </Button>
</HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
            <View style={{position:'absolute',right:50}}>
            <Button size="sm" colorScheme="danger"
            onPress={openModal}
            >Complaint</Button>
            </View>
        </>
    )
}

export default Complaint
