import React, { useState } from 'react'
import {  StyleSheet, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Headline, TextInput, Button, Checkbox ,ActivityIndicator,Colors} from 'react-native-paper'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FeatherIcon from 'react-native-vector-icons/dist/Feather'
import PhoneInput from "react-native-phone-number-input";
import * as ImagePicker from 'react-native-image-picker'
import {Root} from '../Config/root'
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Provinces,Cities} from './../Components/Cities/Cities';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import {Text, Input,Image ,Modal,VStack,HStack,Center,Select,CheckIcon,Heading} from 'native-base'

const BuildProfile = ({route,navigation}) => {

    var {id} = route.params;
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [gender, setGender] = React.useState("Male");
    let [dateOfBirth, setdateOfBirth] = useState('')
    let [dateOfBirthFormt, setdateOfBirthFormat] = useState('')
    let [town, setTown] = useState('')
    let [street, setStreet] = useState('')
    let [city, setCity] = useState('')
    const [check,setCheck] = useState(false)
    const [showModal, setShowModal] = useState(false)
    let [province, setProvince] = useState('')
    let [phone, setPhone] = useState('')
    let [cnic, setCNIC] = useState('')
    let [photo, setPhoto] = useState('')
    let [photoName, setPhotoName] = useState('')
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const [disabled , setDisabled] = useState(false)
    const [disp , setDisp] = useState(false)
    const [uri,setUri] = useState('');

    let [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // function to set gender
    const handleGenderSelect = () => {
        if (gender === "Male") {
            setGender("Female")
        }
        else {
            setGender("Male")
        }
    }

    // function to show date picker
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    // function to hide date picker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    // function to set date
    const handleConfirm = (date) => {
        // date=date+""
        // setdateOfBirthFormat(date)
        var a=date+"";
        a=a.split(' ');
        setdateOfBirth(a[2]+'/'+a[1]+'/'+a[3])
        setdateOfBirthFormat(moment(date).format('YYYY MM DD'))
        hideDatePicker();
    };
    // function to check validation
    const handleProfileSubmit =async () => {
        setErrorShow(false);
        setDisabled(true)
        var newone = moment().subtract(18,'years').format('YYYY MM DD');
        try{
        if(photo===''){
        setErrorShow(true);
        setError('please select profile Picture first')
        }else if(firstName==='' || lastName==='' || gender==='' || dateOfBirth==='' || town==='' || 
        street==='' || city==='' || province==='' || phone==='' || cnic===''){
            setErrorShow(true);
            setError('please fill form completely')
            }
            else if(phone.length!=10 ){
                setErrorShow(true);
                setError('Your phone number should have 10 digits.')    
            }
            else if(cnic.length!=13 || isNaN(Number(cnic))){
                setErrorShow(true);
                setError('Your CNIC should have 13 digits.')    
            }
            else if(newone<dateOfBirthFormt){
                setErrorShow(true);
                setError('Your age should be 18 or greater.')    
            }
            else{
                setShowModal(true)
            }
    }
    catch(err){
        setErrorShow(true);
        setError(err.message)    
    }

        // navigation.navigate('dashboard-app')
        setDisabled(false)

    }
    // function to handle submission
    const handleTermsConditions = async()=>{
        try{
        var val={
            firstName,
            lastName,
            gender,
            dateOfBirth,
            town,
            street,
            city,
            province,
            phoneNumber:phone,
            cnic,
            userId:id,
            profilePic:uri,
            
        };
        var {data} = await axios.post(`${Root.production}/user/buildIndiviualAccount`,val)
        if(data.status==200){
            navigation.navigate('EmailVerification',{id:id})
        }else{
            setErrorShow(true);
            setError(data.message)
        }
}catch(err){
    setErrorShow(true);
    setError(err.message)
}
    }
    // function to handle image process with firebase
    const handleImageProcess=async(imageUrl)=>{
          setDisp(false)
          setErrorShow(false);
        try{
        await storage().ref(`/avatars/${id}`).putFile(imageUrl);
        await  storage().ref('/avatars').child(id)
      .getDownloadURL().then(async (imageuri)=>{
          setUri(imageuri)
          setDisp(true)
    })
}
catch(err){
    setErrorShow(true);
    setError(err.message)
}
    }

    return (
        <>
            {/* terms and conditions modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.Body>
              <Heading size='md'>Terms {'&'} Conditions</Heading>

          <HStack style={{marginTop:20}}>
        <Checkbox  value="red" colorScheme="red" size="sm" defaultIsChecked>
          UX Research
        </Checkbox>
            <Text> I accept all these terms and conditions</Text>
          </HStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
            disabled={!check}
            colorScheme="success"
            //   flex="1"
              onPress={handleTermsConditions}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
        <ScrollView>

        {/* page coding */}
            <View
                style={styles.buildProfilePage}
            >
                <Headline>Create your Profile</Headline>
                <Text>Make sure it's catchy</Text>
                <View style={styles.inputSection} >
                    <View
                        style={styles.oneLiner}
                    >
                        <TextInput label='First Name' style={styles.halfInput} mode='outlined' value={firstName} onChangeText={(text) => setFirstName(text)} />
                        <TextInput label='Last Name' style={styles.halfInput} mode='outlined' value={lastName} onChangeText={(text) => setLastName(text)} />
                    </View>
                    <View style={styles.checkboxOneLiner} >
                        <Text style={{ color: "black" }} >Gender:</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Text>Male</Text>
                            <Checkbox
                                color='#1a2387'
                                status={gender === "Male" ? 'checked' : 'unchecked'}
                                onPress={handleGenderSelect}
                            />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <Text>Female</Text>
                            <Checkbox
                                color='#1a2387'
                                status={gender === "Female" ? 'checked' : 'unchecked'}
                                onPress={handleGenderSelect}
                            />
                        </View>
                    </View>
                    <View style={styles.searchSection} >
                        <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' }} >
                            <Text>{dateOfBirth ? (`${dateOfBirth}`) : ('Date Of Birth')}</Text>
                            <FeatherIcon name='calendar' size={20} color="#000" />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <TextInput label='Town' style={styles.fullInput} mode='outlined' value={town} onChangeText={(text) => setTown(text)} />
                    <TextInput label='Street' style={styles.fullInput} mode='outlined' value={street} onChangeText={(text) => setStreet(text)} />
                    <View style={styles.selectInput}>
                    <Select
              selectedValue={city}
          accessibilityLabel="City"
          variant='unstyled'
          placeholder="City"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setCity(itemValue)}
        >
            {
                Cities.map((v,i)=>(
                    <Select.Item key={i}  label={v} value={v} />
                ))
            }
        </Select>
        </View>

                    {/* <TextInput label='Province' style={styles.fullInput} mode='outlined' value={province} onChangeText={(text) => setProvince(text)} /> */}
                    <View style={styles.selectInput}>
                    <Select
              selectedValue={province}
          accessibilityLabel="Province"
          variant='unstyled'
          placeholder="Province"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setProvince(itemValue)}
        >
            {
                Provinces.map((v,i)=>(
                    <Select.Item key={i}  label={v} value={v} />
                ))
            }
        </Select>
        </View>

                    <View style={{
                        borderWidth: 1,
                        borderRadius: 2,
                        height: 75,
                        width: 310,
                        marginBottom: 5,
                        marginTop: 5,
                        marginLeft: 5,
                    }} >
                        <PhoneInput
                            defaultValue={phone}
                            defaultCode="PK"
                            textInputStyle={{color:'black'}}
                            disableArrowIcon
                            flagButtonStyle={{width:50,marginRight:-5}}
                            onChangeText={(text) => {
                                setPhone(text);
                            }}
                        />
                    </View>
                    <TextInput label='CNIC' style={styles.fullInput} mode='outlined' value={cnic} onChangeText={(text) => setCNIC(text)} />
                    <View style={styles.uploadSection}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}} >
                        <Text>Profile Picture</Text>
                        <TouchableOpacity onPress={() => {
                            ImagePicker.launchImageLibrary(
                                {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    maxHeight: 200,
                                    maxWidth: 200,
                                },
                                (response) => {
                                    setPhoto(response.assets[0].uri)
                                    setPhotoName(response.assets[0].fileName)
                                    handleImageProcess(response.assets[0].uri)
                                },
                            )
                        }} >
                            <FeatherIcon style={styles.searchIcon} name='upload' size={20} color='#000' />
                        </TouchableOpacity>
                       
                        </View>
                        { disp &&
                        <View style={{alignItems:'center'}}>
                        <Image 
                        size={'lg'}
                        alt='selected image'
                        source={uri!='' ? {uri:uri} : {uri:''}}
                        />
                        </View>
}
                        {/* <Text>{uri === '' ? '' : photoName}</Text> */}
                        <View>
                        </View>
                    </View>
                        <View style={{marginLeft:10,marginTop:10,marginBottom:10}}>
                            <Text style={{color:'red'}}>ALL FIELDS ARE MANDATORY</Text>
                        </View>
                    {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'70%'}}>
                {/* <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>                    
                </Heading> */}
                 <Text style={{padding:5,color:'#5F2120',marginLeft:0}}>
                    {/* <MaterialIcons name="error" size={20} color="#F0625F"/> */}
                 Error: {error}
                </Text>
              </View>
            }
                    {
                disabled ? (<ActivityIndicator animating={true} color={Colors.black} />) : (
                    <Button mode='contained' style={styles.submitBtn} onPress={handleProfileSubmit} >Submit</Button>
                  )
            }
                </View>
            </View>
        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    buildProfilePage: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    header: {
        color: 'black',
    },
    inputSection: {
        justifyContent: 'center'
    },
    oneLiner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxOneLiner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 310,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: '#F8F9FB',
        height: 50,
        marginBottom: 10,
        marginTop: 10,
        padding: 5
    },
    fullInput: {
        width: 310,
        margin: 5,
    },
    selectInput:{
        width: 310,
        margin: 5,
        backgroundColor: '#F8F9FB',
        borderWidth: 1,
        borderRadius: 2,
        padding: 5,
    },
    halfInput: {
        width: 150,
        margin: 5
    },
    submitBtn: {
        width: 300,
        margin: 10,
        
    },
    searchSection: {
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: '#F8F9FB',
        width: 310,
        marginLeft: 5,
        padding: 5,
    },
    uploadSection: {
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: '#F8F9FB',
        width: 310,
        marginLeft: 5,
        padding: 5,
        flexDirection:'column',
        justifyContent:'space-between'
    }
})

export default BuildProfile
