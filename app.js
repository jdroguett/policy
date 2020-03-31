var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send("<ul><li><a href=/cost /> /cost</a></li>  <li><a href=/copayment />/copayment</a></li> </ul>");
});

/**
Api costo de la empresa
**/
app.get('/cost', (req, res) => {
  getData( data => {
    if (data == null) {
      res.send("Unable to connect to policy API");
      return
    }
    
    result = {
      cost: calculate(data)
    };
    res.send(JSON.stringify(result));
  });
});

/**
Api copago de cada trabajador
**/
app.get('/copayment', (req, res) => {
  getData( data => {
    if (data == null) {
      res.send("Unable to connect to policy API");
      return
    }

    let copagoList = calculateCopayment(data);
    res.send(JSON.stringify(copagoList));

  });
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


/**
Obtiene los datos de la api del detalle de la póliza
**/
function getData(process) {
  const https = require('https');

  https.get('https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let result = JSON.parse(data);
      process(result);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    process(null);
  });
}


/**
Calcula la póliza de seguro de la empresa;
**/
function calculate(data) {
  let workers = data.policy.workers;
  let hasDentalCare = data.policy.has_dental_care;
  let companyPercentage = data.policy.company_percentage;

  let total = workers.reduce( (sum, worker) => sum + getMonto(worker, hasDentalCare), 0);

  return Math.round( ( (total * companyPercentage/100.0) + Number.EPSILON ) * 10000 ) / 10000;
}

/**
Calcula el copago de los trabajadores;
**/
function calculateCopayment(data) {
  let workers = data.policy.workers;
  let hasDentalCare = data.policy.has_dental_care;
  let companyPercentage = data.policy.company_percentage;

  return workers.map( worker => {
    let copayment = getMonto(worker, hasDentalCare) * (100 - companyPercentage) / 100.0;
    return {
      age: worker.age,
      childs: worker.childs,
      copayment: Math.round( ( copayment + Number.EPSILON ) * 10000 ) / 10000
    };
  });
}


/**
Retorna el monto de acuerdo a las condiciones de la póliza
**/
function getMonto(worker, hasDentalCare) {
  if(worker.age <= 65) {
    if (worker.childs == 0 ){
      return 0.279 + (hasDentalCare ? 0.12 : 0);
    } else if (worker.childs == 1){
      return 0.4396 + (hasDentalCare ? 0.1950 : 0);
    } else {
      return 0.5599 + (hasDentalCare ? 0.2480 : 0);
    }
  }
  return 0;
}

exports.calculate = calculate;
exports.calculateCopayment = calculateCopayment;