import {configureStore, combineReducers} from '@reduxjs/toolkit';

import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminSlice from './admin/adminSlice';
import merchantSlice from './merchant/merchantSlice';

const rootReducer = combineReducers({
    admin : adminSlice,
    merchant : merchantSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);