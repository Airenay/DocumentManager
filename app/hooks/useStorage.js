//
// React hook to provide persistent application storage
// saved into localStorage and accessible globally by application
//
import { createContext, useReducer, useContext } from 'react'
import config from '../conf/config'

// Actions
const SET_PAGE_SIZE = 'SET_PAGE_SIZE'
const SET_PGP_KEYS = 'SET_PGP_KEYS'

const RELOAD_STORAGE = 'RELOAD_STORAGE'

const key = `${config.storageKey}:state`
const defaults = config.storageDefaults
const storageArea = (typeof window !== 'undefined') ? localStorage : null

// Save to storage
const saveStorage = object => {
  try {
    storageArea.setItem(key, JSON.stringify(object))
  } catch {
    // Ignore errors
  }
  return object
}

// Load from storage
const loadStorage = defaults => {
  try {
    if (typeof window !== 'undefined') {
      const storage = storageArea.getItem(key)
      if (storage) return JSON.parse(storage)
    }
  } catch {
    // Ignore errors
  }
  return saveStorage(defaults)
}

// Define a reducer for updating the context
const storageReducer = (storage, action) => {
  switch (action.type) {
    case SET_PAGE_SIZE:
      return saveStorage({...storage, pageSize: action.payload});
    case SET_PGP_KEYS:
      return saveStorage({...storage, pgpKeys: action.payload});
    case RELOAD_STORAGE:
      return loadStorage(storage)
    default:
      return storage;
  }
}

// Component to provide the context to its children,
// This is used in _app.js file
const StorageContext = createContext();

const StorageProvider = ({ children }) => {
  const [storage, dispatch] = useReducer(
    storageReducer,
    defaults,
    loadStorage,
  );
  return (
    <StorageContext.Provider value={[storage, dispatch]}>
      {children}
    </StorageContext.Provider>
  );
};

// A hook that provides an API for updating the global state
const useStorage = () => {
  const [storage, dispatch] = useContext(StorageContext);

  // Actions for reducer
  const setPageSize = pageSize => { dispatch({ type: SET_PAGE_SIZE, payload: pageSize }) }
  const setPGPKeys = pgpKeys => { dispatch({ type: SET_PGP_KEYS, payload: pgpKeys }) }
  const reloadStorage = () => { dispatch({ type: RELOAD_STORAGE }) }

  // Provided methods and properties
  return {
    setPageSize,
    setPGPKeys,
    reloadStorage,
    storage,
  }
}

// Exports
export {
  StorageProvider,
  useStorage,
}
