const assert = require('assert');
const app = require('../app.js');
describe('Test para el cálculo de la póliza', () => {
 it('Cuando todos los trabajadores son mayores de 65 años debería retornar 0', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 66,
                          childs: 2
                          },
                          {
                          age: 70,
                          childs: 2
                          },
                        ],
                has_dental_care: true,
              company_percentage: 80
            }
          };
      assert.equal(app.calculate(data), 0);
    });

it('Cuando todos los trabajadores son menores o iguales a 65 años debería retornar 1.0228', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 65,
                          childs: 1
                          },
                          {
                          age: 50,
                          childs: 2
                          },
                          {
                          age: 25,
                          childs: 0
                          }
                        ],
                has_dental_care: false,
              company_percentage: 80
            }
          };
      assert.equal(app.calculate(data), 1.0228);
    });


it('Cuando algunos trabajadores son mayores de 65 años debería retornar 0.57488', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 50,
                          childs: 1
                          },
                          {
                          age: 68,
                          childs: 2
                          },
                          {
                          age: 25,
                          childs: 0
                          }
                        ],
                has_dental_care: false,
              company_percentage: 80
            }
          };
      assert.equal(app.calculate(data), 0.5749);
    });

it('Cuando tiene cobertura dental debería retornar 1.28905', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 50,
                          childs: 1
                          },
                          {
                          age: 65,
                          childs: 4
                          },
                          {
                          age: 25,
                          childs: 0
                          }
                        ],
                has_dental_care: true,
              company_percentage: 70
            }
          };
      assert.equal(app.calculate(data).toFixed(5), 1.2891);
    });

});


describe('Test para el cálculo del copago de cada trabajador', () => {
  it('Cuando el trabajador es mayores de 65 años el copago es 0', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 66,
                          childs: 2
                          },
                        ],
                has_dental_care: true,
                company_percentage: 80
            }
          };
      assert.deepEqual(app.calculateCopayment(data), [
                                                    {
                                                      age: 66,
                                                      childs: 2,
                                                      copayment: 0
                                                    }
                                                  ]);
  });

  it('Cuando el trabajador es menor de 65 años y tiene 2 o más hijos, el copago es 0.1680', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 50,
                          childs: 4
                          },
                        ],
                has_dental_care: false,
                company_percentage: 70
            }
          };
      assert.deepEqual(app.calculateCopayment(data), [
                                                    {
                                                      age: 50,
                                                      childs: 4,
                                                      copayment: 0.168
                                                    }
                                                  ]);
  });


  it('Cuando el trabajador es menor de 65 años,tiene 1 y cobertura dental , el copago es 0.2538', () => {
      let data = {
            policy: {
                workers: [
                          {
                          age: 50,
                          childs: 1
                          },
                        ],
                has_dental_care: true,
                company_percentage: 60
            }
          };
      assert.deepEqual(app.calculateCopayment(data), [
                                                    {
                                                      age: 50,
                                                      childs: 1,
                                                      copayment: 0.2538
                                                    }
                                                  ]);
  });


});