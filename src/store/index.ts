import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

// Import RTK Query APIs
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { usersApi } from './api/usersApi';
import { rolesApi } from './api/rolesApi';
import { permissionsApi } from './api/permissionsApi';
import { policiesApi } from './api/policiesApi';
import { authorizationApi } from './api/authorizationApi';
import { equipmentsApi } from './api/equipmentsApi';
import { warehousesApi } from './api/warehousesApi';
import { assignmentsApi } from './api/assignmentsApi';
import { auditsApi } from './api/auditsApi';
import { maintenancesApi } from './api/maintenancesApi';
import { liquidationsApi } from './api/liquidationsApi';

export const store = configureStore({
  reducer: {
    // Slices
    auth: authReducer,
    ui: uiReducer,
    
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [policiesApi.reducerPath]: policiesApi.reducer,
    [authorizationApi.reducerPath]: authorizationApi.reducer,
    [equipmentsApi.reducerPath]: equipmentsApi.reducer,
    [warehousesApi.reducerPath]: warehousesApi.reducer,
    [assignmentsApi.reducerPath]: assignmentsApi.reducer,
    [auditsApi.reducerPath]: auditsApi.reducer,
    [maintenancesApi.reducerPath]: maintenancesApi.reducer,
    [liquidationsApi.reducerPath]: liquidationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(usersApi.middleware)
      .concat(rolesApi.middleware)
      .concat(permissionsApi.middleware)
      .concat(policiesApi.middleware)
      .concat(authorizationApi.middleware)
      .concat(equipmentsApi.middleware)
      .concat(warehousesApi.middleware)
      .concat(assignmentsApi.middleware)
      .concat(auditsApi.middleware)
      .concat(maintenancesApi.middleware)
      .concat(liquidationsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
