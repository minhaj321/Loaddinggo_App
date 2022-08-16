import React from 'react'
import { StyleSheet, View , Text, TouchableOpacity } from 'react-native'
import { Title } from 'react-native-paper'
import StatusBadge from '../StatusBadges/StatusBadge'
import { Link } from '@react-navigation/native';

const Vehicle = ({data}) => {
    return (
        <TouchableOpacity>
        <View style={styles.vehicleCard} >
            <Title>Vehicle # {data._id}</Title>
            <Text>Manufacturer : {data.manufacturer}</Text>
            <Text>Model: {data.model}</Text>
            <Text> Model Year : {data.year} </Text>
            <View style={{flexDirection:'row',alignItems:'center'}} >
            <Text>Status: </Text><StatusBadge tag={data.status} />
            </View>
                <Link to={{ screen: 'vehicleDetails', params: { id:data._id  } }}>
                View Details &gt;&gt;
                </Link>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    vehicleCard:{
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

export default Vehicle
