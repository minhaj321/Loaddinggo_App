import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import UserDashboard from './UserDashboard';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import AvailableListings from './AvailableAuctions';
import MyShipments from './MyShipments.js';
import shipmentDetails from './shipmentDetails.js';
import AvailableTrips from './AvailableTrips.js';
import CreateRequest from './CreateRequest.js';
import AuctionDetails from './AuctionDetails.js';
import CarrierAuctionDetails from './CarrierAuctionDetails.js';
import MyAuctions from './MyAuctions.js';
import TripDetails from './TripDetails.js';
import CreateAuction from './CreateAuction.js';
import AvailableAuctions from './AvailableAuctions.js';
import MyOffers from './MyOffers.js';
import vehicleDetails from './vehicleDetails.js';
import MyVehicles from './MyVehicles.js';
import MyTrips from './MyTrips.js';
import Chat from './Chat.js';
import OfferDetails from './offerDetails.js';
import CurrentShipment from './CurrentShipment.js';
import CreateRequestForm from './CreateRequestForm.js';
import CustomDrawer from '../Components/Drawer/CustomDrawer';
import CustomDrawerHeader from '../Components/Drawer/CustomDrawerHeader';

const Drawer = createDrawerNavigator();

const Dashboard = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{
            header: ({ navigation, route, options }) => {
                const title = getHeaderTitle(options, route.name);
                return (
                    <CustomDrawerHeader navigation={navigation} />
                    )
            }
        }} >
            <Drawer.Screen name="Dashboard" component={UserDashboard} />
            <Drawer.Screen name="my-shipments" component={MyShipments} />
            <Drawer.Screen name="MyTrips" component={MyTrips} />
            <Drawer.Screen name="CurrentShipment" component={CurrentShipment} />
            <Drawer.Screen name="AvailableAuctions" component={AvailableAuctions} />
            <Drawer.Screen name="MyOffers" component={MyOffers} />
            <Drawer.Screen name="Chat" component={Chat} />
            <Drawer.Screen name="MyAuctions" component={MyAuctions} />
            <Drawer.Screen name="CarrierAuctionDetails" component={CarrierAuctionDetails} />
            <Drawer.Screen name="MyVehicles" component={MyVehicles} />
            <Drawer.Screen name="vehicleDetails" component={vehicleDetails} />
            <Drawer.Screen name="AvailableTrips" component={AvailableTrips} />
            <Drawer.Screen name="edit-profile" component={EditProfile} />
            <Drawer.Screen name="CreateAuction" component={CreateAuction} />
            <Drawer.Screen name="RequestForm" component={CreateRequestForm} />
            <Drawer.Screen name="TripDetails" component={TripDetails} />
            <Drawer.Screen name="CreateRequest" component={CreateRequest} />
            <Drawer.Screen name="AuctionDetails" component={AuctionDetails} />
            <Drawer.Screen name="shipmentDetails" component={shipmentDetails} />
            <Drawer.Screen name="offerDetails" component={OfferDetails} />
            <Drawer.Screen name="Profile" component={UserProfile} />
            <Drawer.Screen name="Available Listings" component={AvailableListings} />
        </Drawer.Navigator>
    )
}

export default Dashboard
