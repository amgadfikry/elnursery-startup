// Create variables that hold env variables for database connection
const { DATABASE_HOST } = process.env;

// Export the database configuration object
export const databaseConfig = {
  // Define the URI for the database connection
  uri: `mongodb://${DATABASE_HOST}/elnursery?replicaSet=demo`,
};
