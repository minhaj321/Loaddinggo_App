import React , {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Headline } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Heading} from 'native-base';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

const EmailVerificationPage = ({route,navigation}) => {


    const {id}  = route.params;
    const [value, setValue] = useState('');
    let [error,setError] = useState('');
    let [errorShow,setErrorShow] = useState(false);
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

// method to submit email
    const handleCodeSubmit =async () =>{
      if(value===''){
      }else{
        setErrorShow(false);
      try{
          var send={
            emailCode:Number(value),
            accountId:id
          }
          const {data} = await axios.post(`${Root.production}/user/verify`,send);
          if(data.status===200){
            navigation.navigate(`dashboard-app`,{id:id})
          }
          else{
            setError(data.message);
            setErrorShow(true)
          }
        }
        catch(err){
          setError(err.message);
          setErrorShow(true)
        }

      }
    }

    return (
       <View style={styles.verificationPage} >
           <Headline style={styles.header} >Verify your email address</Headline>
           <Text style={styles.para} >We've sent a 4 digit code to your email address. Please enter it below.</Text>
           <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
            {
              errorShow &&
              <View style={{backgroundColor:'#FDEDED',paddingHorizontal:10,paddingVertical:5,borderRadius:5,marginLeft:'10%',width:'80%'}}>
                <Heading size="sm" style={{borderRadius:4,padding:5,color:'#5F2120',marginLeft:10}}>
                    <MaterialIcons name="error" size={20} color="#F0625F"/>
                    Verification Error
                </Heading>
                 <Text style={{padding:5,color:'#5F2120',marginLeft:40}}>
                    {error}
                </Text>
              </View>
            }      
      <Button mode='contained' style={styles.submitBtn} onPress={handleCodeSubmit} >Submit</Button>
       </View>
    )
}


const styles = StyleSheet.create({
    verificationPage:{
        alignItems:'center',
        backgroundColor:'white',
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    },
    para:{
        width:250,
        textAlign:'center'
    },
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
      margin:5
    },
    focusCell: {
      borderColor: '#000',
    },
    submitBtn:{
        width:250,
        marginTop:15
    }
})

export default EmailVerificationPage
