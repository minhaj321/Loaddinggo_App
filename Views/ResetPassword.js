import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Headline} from 'react-native-paper';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text, Heading} from 'native-base';
import {Root} from './../Config/root';
import axios from 'axios';
import {Input} from 'native-base'

const CELL_COUNT = 4;

const ResetPassword = ({navigation,route}) => {
  let [error, setError] = useState('');
  let [errorShow, setErrorShow] = useState(false);
  const [password,setPassword]=useState('')
  const [resetPassword,setResetPassword]=useState('')
  const [value, setValue] = useState('');
  const {code1} = route.params;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

// code submit function
const handleCodeSubmit = async () => {
try{
    if(password!==resetPassword || password===''){
      setError('Your confirm password is different')
      setErrorShow(true)
    }
    else{
      var {data} = await axios.post(`${Root.production}/user/resetUserPasswordMobile`,{
        code:Number(value),password        
      });
      if(data.status==200){
        navigation.navigate('Login');
      }else{
        setError(data.message)
        setErrorShow(true)  
      }
    }
  }
catch(err){
  setError(err.message)
  setErrorShow(true)  
}
  };

  return (
    <View style={styles.verificationPage}>
      <Headline style={styles.header}>Reset Your Password</Headline>
      <Text style={styles.para}>
        We've sent a 4 digit code to your email address. Please enter it below.
      </Text>
      {errorShow && (
        <View
          style={{
            backgroundColor: '#FDEDED',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            width: '80%',
          }}>
          <Heading
            size="sm"
            style={{
              borderRadius: 4,
              padding: 5,
              color: '#5F2120',
              marginLeft: 10,
            }}>
            <MaterialIcons name="error" size={20} color="#F0625F" />
            Reset Password Error
          </Heading>
          <Text style={{padding: 5, color: '#5F2120', marginLeft: 40}}>
            {error}
          </Text>
        </View>
      )}
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
      <Input
      secureTextEntry={true}
        style={styles.Input}
        value={password}
        onChangeText={txt => setPassword(txt)}
        variant="underlined"
        placeholder="Enter Password"
      />
      <Input
      secureTextEntry={true}
        style={styles.Input}
        value={resetPassword}
        onChangeText={txt => setResetPassword(txt)}
        variant="underlined"
        placeholder="Confirm Password"
      />
      <Button
        mode="contained"
        style={styles.submitBtn}
        onPress={handleCodeSubmit}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  verificationPage: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  para: {
    width: 250,
    textAlign: 'center',
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
    margin: 5,
  },
  focusCell: {
    borderColor: '#000',
  },
  Input:{
    fontSize:13,
    paddingTop:15,
    width:'90%'
},
  submitBtn: {
    width: 250,
    marginTop: 15,
  },
});

export default ResetPassword;
