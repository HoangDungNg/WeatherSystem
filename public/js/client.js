$(document).ready(function () {
  var data1 = '';
  var data2 = '';
  function changeMonth() {
    var eMonth = parseInt($('#endMonth').find(':selected').val());
    var sMonth = parseInt($('#startMonth').find(':selected').val());
    if (sMonth > eMonth) {
      sMonth = eMonth;
      $(`#startMonth option[value='${sMonth}']`).prop('selected', true);
    }
  }

  function processData(data) {
    const monthsInWords = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let ws = $('#wsCheckbox').prop('checked') ? $('#wsCheckbox').val() : '';
    let sr = $('#srCheckbox').prop('checked') ? $('#srCheckbox').val() : '';
    var monthArray = [];
    var wsArray = [];
    var srArray = [];
    var year = $('#year').val();
    data.result.forEach((ele) => {
      let eleSplit = ele.split('/');
      monthArray.push(monthsInWords[parseInt(eleSplit[0]) - 1]);
      let wsTemp = parseFloat(eleSplit[1]);
      let srTemp = parseFloat(eleSplit[2]);
      if (ws == 'ws') wsArray.push(wsTemp);
      if (sr == 'sr') srArray.push(srTemp);
    });
    //alert(data.result);
    if ($('#outputFormat1').prop('checked'))
      createTable(monthArray, wsArray, srArray);
    if ($('#outputFormat2').prop('checked'))
      createChart(wsArray, srArray, monthArray, year);
  }

  function createTable(monthArray, wsArray, srArray) {
    var textMonth = '';
    var textWS = '';
    var textSR = '';
    monthArray.forEach((month) => {
      textMonth += `<th scope="col">${month}</th>\n`;
    });
    wsArray.forEach((ws) => {
      let wsTemp = ws == 0 ? `<td></td>\n` : `<td>${ws}</td>\n`;
      textWS += wsTemp;
    });
    srArray.forEach((sr) => {
      let srTemp = sr == 0 ? `<td></td>\n` : `<td>${sr}</td>\n`;
      textSR += srTemp;
    });
    if (wsArray.length !== 0 && srArray.length !== 0) {
      $('.tableResult').html(`<table class="table table-dark table-hover">
    <thead>
        <tr> 
            <th scope="col">Month</th>   
            ${textMonth}
        </tr>
    </thead>
        <tbody>
            <tr>
            <th scope="row">Average Wind Speed (km/h)</th>
            ${textWS}
            </tr>
            <tr>
            <th scope="row">Total Solar Radiation (kWh/m<sup>2</sup>)</th>
            ${textSR}
            </tr>
        </tbody>
    </table>`);
    } else if (wsArray.length !== 0 && srArray.length == 0) {
      $('.tableResult').html(`<table class="table table-dark table-hover">
        <thead>
            <tr> 
                <th scope="col">Month</th>   
                ${textMonth}
            </tr>
        </thead>
            <tbody>
                <tr>
                <th scope="row">Average Wind Speed (km/h)</th>
                ${textWS}
                </tr>
            </tbody>
        </table>`);
    } else if (wsArray.length == 0 && srArray.length !== 0) {
      $('.tableResult').html(`<table class="table table-dark table-hover">
        <thead>
            <tr> 
                <th scope="col">Month</th>   
                ${textMonth}
            </tr>
        </thead>
            <tbody>
                <tr>
                <th scope="row">Total Solar Radiation (kWh/m<sup>2</sup>)</th>
                ${textSR}
                </tr>
            </tbody>
        </table>`);
    }
  }

  function createChart(wsData, srData, monthArray, year) {
    let chartTitle = `Data from ${monthArray[0]} to ${
      monthArray[monthArray.length - 1]
    } in ${year}`;
    $('#cTitle').text(chartTitle);
    var ctx = document.getElementById('myChart').getContext('2d');
    if (wsData.length !== 0 && srData.length !== 0) {
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthArray,
          datasets: [
            {
              label: 'Wind Speed',
              yAxisID: 'Y',
              data: wsData,
              borderColor: 'rgb(204, 0, 102)',
              borderWidth: 1,
            },
            {
              label: 'Solar Radiation',
              yAxisID: 'X',
              data: srData,
              borderColor: 'rgb(0, 255, 0)',
              borderWidth: 1,
            },
          ],
        },

        options: {
          scales: {
            yAxes: [
              {
                id: 'Y',
                type: 'linear',
                position: 'left',
              },
              {
                id: 'X',
                type: 'linear',
                position: 'right',
              },
            ],
          },
        },
      });
    } else if (wsData.length !== 0 && srData.length == 0) {
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthArray,
          datasets: [
            {
              label: 'Wind Speed',
              data: wsData,
              borderColor: 'rgb(204, 0, 102)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    } else if (wsData.length == 0 && srData.length !== 0) {
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthArray,
          datasets: [
            {
              label: 'Solar Radiation',
              data: srData,
              borderColor: 'rgb(204, 0, 102)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
  }

  $('#endMonth').change(function () {
    changeMonth();
  });
  $('#startMonth').change(function () {
    changeMonth();
  });

  $('#submit-btn').click(function (e) {
    e.preventDefault();
    const msg = [];
    if (
      !$('#wsCheckbox').prop('checked') &&
      !$('#srCheckbox').prop('checked')
    ) {
      msg.push('<li>Please select data to be displayed</li>');
    }

    if ($('#year').val() == '') msg.push('<li>Please select year</li>');

    if (
      !$('#outputFormat1').prop('checked') &&
      !$('#outputFormat2').prop('checked')
    ) {
      msg.push('<li>Please select output format</li>');
    }
    if (msg.length == 0) {
      $('div.add1').html('');
      data1 = $('#wsCheckbox').prop('checked') ? $('#wsCheckbox').val() : '';
      data2 = $('#srCheckbox').prop('checked') ? $('#srCheckbox').val() : '';
      $.post(
        '/api',
        // Gather all data from the form and create a JSON object from it
        {
          startMonth: $('#startMonth').find(':selected').val(),
          endMonth: $('#endMonth').find(':selected').val(),
          year: $('#year').val(),
          data1,
          data2,
        },
        // Callback to be called with the data
        processData
      );
    } else {
      $('div.add1').html(
        `<div class="alert alert-danger" role="alert">
                <ul>${msg.join('\n')}</ul>
            </div>`
      );
    }
  });
});
