import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import generalReducers from "./reducers/generalReducers"

const middleware = [thunk]

const store = createStore(
    generalReducers,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store