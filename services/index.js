const fetch = require('node-fetch');
const xml2json = require('xml2json');

const readFile = async (year) => {
  var data = '';
  var text = '';
  var yearExtension =
    year == 2007 || year == 2008 || year == 2009
      ? `${year}.xml`
      : `${year}.json`;

  const response = await fetch(
    `http://it.murdoch.edu.au/~S900432D/ict375/data/${yearExtension}`
  );
  if (yearExtension.includes('json')) data = await response.json();
  else if (yearExtension.includes('xml')) {
    text = await response.text();
    let temp = await xml2json.toJson(text);
    data = JSON.parse(temp);
  }

  return data;
};

// For testing
const processData = async (response, months, data1, data2) => {
  var totalWS = 0;
  var totalSR = 0;
  var count = 0;
  var index = 0;
  var currentMonth = months[0];
  let result = [];
  response.forEach((ele) => {
    const date = ele.date.split('/');
    if (parseInt(date[1]) == currentMonth) {
      if (data1 == 'ws') {
        if (ele.ws) {
          count += 1;
          totalWS += parseInt(ele.ws);
        }
      }

      if (data2 == 'sr') {
        if (ele.sr) totalSR += parseInt(ele.sr);
      }
    } else {
      let dateOfEle = parseInt(date[1]);
      if (
        (dateOfEle > months[0] && dateOfEle <= months[months.length - 1]) ||
        dateOfEle - 1 == months[months.length - 1]
      ) {
        let avgWS = count !== 0 ? (totalWS / count) * 3.6 : 0;
        let finalSR = totalSR / 1000;
        if (typeof currentMonth !== 'undefined')
          result.push(
            `${months[index]}/${avgWS.toFixed(2)}/${finalSR.toFixed(2)}`
          );
        index += 1;
        currentMonth = months[index];
        totalWS = 0;
        totalSR = 0;
        count = 0;
      }
    }
  });
  return result;
};

const determineMonths = async (sMonth, eMonth) => {
  let months = [];
  for (var i = 1; i <= 12; i++) {
    if (i >= sMonth && i <= eMonth) months.push(i);
  }
  return months;
};
module.exports = { readFile, processData, determineMonths };
