'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
   uri:'mongodb+srv://user123:user123@clusterarc.qmiom.mongodb.net/test?retryWrites=true&w=majority'
  //  uri: 'mongodb+srv://user123:User@123@clusterarc.qmiom.mongodb.net/test'
  },

  seedDB: false
};
