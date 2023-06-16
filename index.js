import { getEmplFrom, abRmnSal, getEmployees } from './lib/employees.js';


// Invoke the getEmplFrom function with callbacks and sort order

getEmplFrom(abRmnSal); // Displays salaries
getEmplFrom(getEmployees); // Default order
getEmplFrom(getEmployees, "asc"); // For ascending order
getEmplFrom(getEmployees, "desc"); // For descending order