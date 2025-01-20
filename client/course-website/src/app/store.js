import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/apis/authApi";

export const appStore = configureStore({

    //slices
    reducer: rootReducer,
    //This makes sure that the store can handle both normal Redux behavior and the extra features provided by authApi, like managing API calls, caching, and syncing data automatically.
    middleware: (defaultMiddleware) => defaultMiddleware().concat(authApi.middleware)

});

const initializeApp= async()=>{
        await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}

initializeApp();