import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
//import { userLoginReducer, userRegisterReducer, userDataReducer } from './Reducers/userReducer';
import { usersReducer } from './Reducers/userReducer';
import { usersListReducer } from './Reducers/userListReducer';
import { materialsReducer } from './Reducers/materialsReducer';
import { productsReducer } from './Reducers/productsReducer';
import { shipmentsReducer } from './Reducers/shipmentsReducer';
import { customersReducer } from './Reducers/customersReducer';
import { warehouseReducer } from './Reducers/warehouseReducer';
import { nonStandartWorksReducer } from './Reducers/nonStandartWorksReducer';
import { countryReducer } from './Reducers/countryReducer'
import { orderReducer } from './Reducers/orderReducer'
import { bonusReducer } from './Reducers/bonusReducer';
import { currencyReducer } from './Reducers/currencyReducer'
import { servicesReducer } from './Reducers/servicesReducer'
import { weeklyWorkScheduleReducer } from './Reducers/WeeklyWorkScheduleReducer'
import {userTypesReducer} from './Reducers/userTypesReducer'
import {salesChannelsReducer} from './Reducers/salesChannelsReducer'

const allReducers = combineReducers({
    usersReducer,
    usersListReducer,
    materialsReducer,
    productsReducer,
    shipmentsReducer,
    customersReducer,
    warehouseReducer,
    nonStandartWorksReducer,
    countryReducer,
    orderReducer,
    bonusReducer,
    currencyReducer,
    servicesReducer,
    weeklyWorkScheduleReducer,
    userTypesReducer,
    salesChannelsReducer
});


const userInfoFromStorage = localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : null;
const initialState = {
    usersReducer: { currentUser: userInfoFromStorage },
}

const middleware = [thunk];

const store = createStore(allReducers, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;