const initialState = {
    role:'Shipper',
    user:{},
    updation:0
}



 const user = (state=initialState,action)=>{
    switch (action.type) {
        case 'Shipper':
            return{
            ...state,
            role:'Shipper'
        };
        break;
        case 'Carrier':
            return{
                ...state,
                role:'Carrier'
            };
            break;
        case 'setUser':
            return{
                ...state,
                user:action.val
            };
        case 'Updation':
            return{
                ...state,
                updation:state.updation+1
            }        
        default:
            return{
                ...state
            }
            break;
    }
}

export default user;