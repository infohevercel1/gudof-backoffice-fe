import { createStore } from 'redux';
import reducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
var persistConfig = {
  key: 'react-jsonschema-formbuilder',
  storage,
  stateReconciler: hardSet,
  throttle: 15,
};

var { schema2tree } = require('./core');

var form = {
  schema: {
    title: 'Template Form',
    description: 'A simple form example.',
    type: 'object',
    required: ['manufacturer', 'model'],
    properties: {
      manufacturer: {
        type: 'string',
        title: 'Manufacturer',
      },
      model: {
        type: 'string',
        title: 'Model',
      },
      image: {
        type: 'string',
        title: 'Image Link',
      },
      price: {
        type: 'integer',
        title: 'Price',
      },
      description: {
        type: 'string',
        title: 'Description',
      },
     
    },
  },
  uiSchema: {
    manufacturer: {
      'ui:emptyValue': '',
    },
    model: {
      'ui:emptyValue': '',
    },
    image: {
      'ui:emptyvalue':'',
    },
    price: {
      'ui:emptyvalue':'',
    },
    description: {
      'ui:emptyvalue':'',
    },
    date: {
      'ui:widget': 'alt-datetime',
    },
   
  },
};

var initTree = schema2tree('root', form.schema, form.uiSchema);

var persistedReducer = persistReducer(persistConfig, reducer);

var store = createStore(persistedReducer, {
  tree: {
    past: [],
    present: initTree,
    future: [],
  },
});

var persistor = persistStore(store);

export { store, persistor };
export default { store, persistor };
