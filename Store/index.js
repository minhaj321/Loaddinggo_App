// import { configureStore } from '@reduxjs/toolkit'
import {combineReducers,createStore} from 'redux'
import user from './reducer.js'

// const reducer = combineReducers({
//     user
// })

const store = createStore(user)

export default store;