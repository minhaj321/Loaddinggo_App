import React from 'react'
import { StyleSheet, View , Text, TouchableOpacity } from 'react-native'
import { Title } from 'react-native-paper'

const Bid = () => {
    return (
        <TouchableOpacity  >
        <View style={styles.bidCard} >
            <Text>BID</Text>
            <Title>Bid #skslkflks</Title>
            <Text>Carrier ID: skdflsf</Text>
            <Text>Cost: $$$</Text>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    bidCard:{
        borderWidth:1,
        width:'90%',
        alignSelf:'center',
        borderRadius:5,
        padding:10,
        backgroundColor:'white',
        borderColor:'#F1F1F1',
        marginTop:10,
        marginTop:5,
    },
})

export default Bid
