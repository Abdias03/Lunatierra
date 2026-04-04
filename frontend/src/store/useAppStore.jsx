import { createContext, useContext, useReducer } from 'react';

const initialState = {
  user: null,
  crops: [],
  progress: {
    xp: 0,
    streak: 0
  },
  selectedCrop: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CROPS':
      return { ...state, crops: action.payload };
    case 'ADD_CROP':
      return { ...state, crops: [...state.crops, action.payload] };
    case 'SET_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'SET_SELECTED_CROP':
      return { ...state, selectedCrop: action.payload };
    default:
      return state;
  }
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return context;
}
