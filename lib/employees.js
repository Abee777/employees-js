var domain = "src/fake-server";
var arrSalary = [];

export function getEmplFrom(callback, sortOrder) {
  return new Promise((resolve, reject) => {
    var employeesXhr = new XMLHttpRequest();
    employeesXhr.open('GET', domain + "/employees.json");
    employeesXhr.onload = function () {
      if (this.status == 200) {
        resolve(JSON.parse(this.responseText));
        // console.log(this.responseText);
      } else {
        reject("There was an Error!");
      }
    };
    employeesXhr.send();
  })
    .then((employeesResponse) => {
      // console.log(employeesResponse);
      return new Promise((resolve, reject) => {
        var salariesXhr = new XMLHttpRequest();
        salariesXhr.open('GET', domain + "/salaries.json");
        salariesXhr.onload = function () {
          if (this.status == 200) {
            var salariesResponse = JSON.parse(this.responseText);
            // console.log(salariesResponse);
            var combinedData = combineData(employeesResponse, salariesResponse);
            // console.log(combinedData);
            resolve(combinedData);
          } else {
            reject("There was an Error!");
          }
        };
        salariesXhr.send();
      });
    })
    .then((combinedData) => {
      if (sortOrder === "asc") {
        combinedData.sort((a, b) => {
          var salaryA = a.salary !== null ? parseInt(a.salary) : Number.NEGATIVE_INFINITY;
          var salaryB = b.salary !== null ? parseInt(b.salary) : Number.NEGATIVE_INFINITY;
          return salaryA - salaryB;
        });
      } else if (sortOrder === "desc") {
        combinedData.sort((a, b) => {
          var salaryA = a.salary !== null ? parseInt(a.salary) : Number.POSITIVE_INFINITY;
          var salaryB = b.salary !== null ? parseInt(b.salary) : Number.POSITIVE_INFINITY;
          return salaryB - salaryA;
        });
      }
      callback(combinedData, sortOrder); // Invoke callback function with combined data and sortOrder
      return combinedData; // Return the combined data as resolved value
    })
    .catch((error) => {
      console.error("Promise rejected:", error);
    });
};

// function that combines data inside the promise chain
function combineData(employees, salaries) {
  return employees.map((employee) => {
    var salaryData = salaries.find((salary) => salary.employeeId === employee.id);
    var salary = salaryData ? salaryData.salary : null;
    return {
      id: employee.id,
      name: employee.name,
      salary: salary
    };
  });
};

//  Callback function for displaying salaries
export function abRmnSal(sal) {
  // console.log("Combined Data func:", sal);
  arrSalary = sal.map((item) => item.salary == null ? "no salary" : item.salary);
  console.log("Salaries: ", arrSalary.join(', '));
  return arrSalary
};

export function getEmployees(combinedData, sortOrder) {
  let message;
  if (sortOrder === "asc") {
    message = "Sorted Data by ascending salary";
  } else if (sortOrder === "desc") {
    message = "Sorted Data by descending salary";
  } else {
    message = "Data by default";
  }
  console.log(message, combinedData);
  return combinedData;
}