const socket = io('http://localhost:3000');

socket.on('Server-send-lux-data', (data) => {
    $('#light').html(`
        <span>${data}lux</span>
    `);
});

socket.on('Server-send-temp-data', (data) => {
    $('#temperature').html(`
        <span>${data}°C</span>
    `);
});

socket.on('Server-send-hum-data', (data) => {
    $('#humidity').html(`
        <span>${data}%</span>
    `);
});

$(document).ready(() => {
    //Control led 1
    $('.led1Btn').click(() =>{
        if($('.led1Btn').attr('data-click-state') == 0){
            $('.led1Btn').attr('data-click-state', 1);
            $('.led1Btn__left').css('background', 'transparent');
            $('.led1Btn__right').css('background', 'rgb(0, 230, 88)');
            $.ajax({
                url: 'http://localhost:3000/led1?ledState=1',
                type: 'post',
                success: () => {
                    console.log('Success')
                }
            });
        } else {
            $('.led1Btn').attr('data-click-state', 0);
            $('.led1Btn__left').css('background', 'rgb(255, 17, 17)');
            $('.led1Btn__right').css('background', 'transparent');
            $.ajax({
                url: 'http://localhost:3000/led1?ledState=0',
                type: 'post',
                success: () => {
                    console.log('Success')
                }
            });
        }
    });

    //Control led 2
    $('.led2Btn').click(() =>{
        if($('.led2Btn').attr('data-click-state') == 0){
            $('.led2Btn').attr('data-click-state', 1);
            $('.led2Btn__left').css('background', 'transparent');
            $('.led2Btn__right').css('background', 'rgb(0, 230, 88)');
            $.ajax({
                url: 'http://localhost:3000/led2?ledState=1',
                type: 'post',
                success: () => {
                    console.log('Success')
                }
            });
        } else {
            $('.led2Btn').attr('data-click-state', 0);
            $('.led2Btn__left').css('background', 'rgb(255, 17, 17)');
            $('.led2Btn__right').css('background', 'transparent');
            $.ajax({
                url: 'http://localhost:3000/led2?ledState=0',
                type: 'post',
                success: () => {
                    console.log('Success')
                }
            });
        }
    });

    // navigator
    $('#menu-log').click(()=>{
        $('.mainBody__deviceControl').css('display', 'none');
        $('.mainBody__chart').css('display', 'none');
        $('.mainBody__dashboard').css('display', 'none');
        $('.mainBody__log').css('display', 'block');

        $('#menu-dashboard').removeClass('menu-active');
        $('#menu-main').removeClass('menu-active');
        $('#menu-chart').removeClass('menu-active');
        $('#menu-log').addClass('menu-active');

        $('.header__title').html('');
        $('.header__title').html('<span>LOG</span>');
    });
    $('#menu-main').click(()=>{
        $('.mainBody__deviceControl').css('display', 'block');
        $('.mainBody__chart').css('display', 'none');
        $('.mainBody__dashboard').css('display', 'none');
        $('.mainBody__log').css('display', 'none');

        $('#menu-dashboard').removeClass('menu-active');
        $('#menu-main').addClass('menu-active');
        $('#menu-chart').removeClass('menu-active');
        $('#menu-log').removeClass('menu-active');

        $('.header__title').html('');
        $('.header__title').html('<span>MAIN</span>');
    });
    $('#menu-chart').click(()=>{
        $('.mainBody__deviceControl').css('display', 'none');
        $('.mainBody__chart').css('display', 'block');
        $('.mainBody__dashboard').css('display', 'none');
        $('.mainBody__log').css('display', 'none');

        $('#menu-dashboard').removeClass('menu-active');
        $('#menu-main').removeClass('menu-active');
        $('#menu-chart').addClass('menu-active');
        $('#menu-log').removeClass('menu-active');

        $('.header__title').html('');
        $('.header__title').html('<span>CHART</span>');
    });
    $('#menu-dashboard').click(()=>{
        $('.mainBody__deviceControl').css('display', 'none');
        $('.mainBody__chart').css('display', 'none');
        $('.mainBody__dashboard').css('display', 'block');
        $('.mainBody__log').css('display', 'none');

        $('#menu-dashboard').addClass('menu-active');
        $('#menu-main').removeClass('menu-active');
        $('#menu-chart').removeClass('menu-active');
        $('#menu-log').removeClass('menu-active');

        $('.header__title').html('');
        $('.header__title').html('<span>DASHBOARD</span>');
    });

    /*============= Render log data ==============*/ 
    $.ajax({
        url: 'http://localhost:3000/api/sensor',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: (data) => {
            console.log(data);
            let logs = data.data.slice(0, 10);
            $('#totalLogPage').text(data.pages);
            $('#currentLogPage').attr('value',1);
            $('.log__table tbody').html('');
            logs.forEach((log) => {
                $('.log__table tbody').append(`
                <tr>
                    <td>
                        <div class="log__table--deviceID log__table--component">
                            <span>${log.device.id}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--deviceName log__table--component">
                            <span>${log.device.name}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--ip log__table--component">
                            <span>${log.device.ip}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--sensor log__table--component">
                            <span>${log.id}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--ype log__table--component">
                            <span>${log.type}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--value log__table--component">
                            <span>${log.value}</span>
                        </div>
                    </td>
                    <td>
                        <div class="log__table--time log__table--component">
                            <span>${new Date(log.date_created).toLocaleString()}</span>
                        </div>
                    </td>
                </tr>
                `);
            });

            $('#currentLogPage').keypress((e) => {
                let keyCode = (e.keyCode ? e.keyCode : e.which);
                if (keyCode == '13') {
                    let newPage = $('#currentLogPage').val();
                    let perPage = 10;
                    let logs = data.data.slice((newPage-1)*perPage, newPage*perPage);
                    $('#totalLogPage').text(data.pages);
                    $('#currentLogPage').attr('value',newPage);
                    $('.log__table tbody').html('');
                    logs.forEach((log) => {
                        $('.log__table tbody').append(`
                        <tr>
                            <td>
                                <div class="log__table--deviceID log__table--component">
                                    <span>${log.device.id}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--deviceName log__table--component">
                                    <span>${log.device.name}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--ip log__table--component">
                                    <span>${log.device.ip}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--sensor log__table--component">
                                    <span>${log.id}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--ype log__table--component">
                                    <span>${log.type}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--value log__table--component">
                                    <span>${log.value}</span>
                                </div>
                            </td>
                            <td>
                                <div class="log__table--time log__table--component">
                                    <span>${new Date(log.date_created).toLocaleString()}</span>
                                </div>
                            </td>
                        </tr>
                        `);
                    });
                }
            });
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
            console.log(textStatus);
        }
    });

    $('.log__header--refresh').click(() => {
        $.ajax({
            url: 'http://localhost:3000/api/sensor',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: (data) => {
                console.log(data);
                let logs = data.data.slice(0, 10);
                $('#currentLogPage').val(1);
                $('#totalLogPage').text(data.pages);
                $('.log__table tbody').html('');
                logs.forEach((log) => {
                    $('.log__table tbody').append(`
                    <tr>
                        <td>
                            <div class="log__table--deviceID log__table--component">
                                <span>${log.device.id}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--deviceName log__table--component">
                                <span>${log.device.name}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--ip log__table--component">
                                <span>${log.device.ip}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--sensor log__table--component">
                                <span>${log.id}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--ype log__table--component">
                                <span>${log.type}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--value log__table--component">
                                <span>${log.value}</span>
                            </div>
                        </td>
                        <td>
                            <div class="log__table--time log__table--component">
                                <span>${new Date(log.date_created).toLocaleString()}</span>
                            </div>
                        </td>
                    </tr>
                    `);
                });
    
                $('#currentLogPage').keypress((e) => {
                    let keyCode = (e.keyCode ? e.keyCode : e.which);
                    if (keyCode == '13') {
                        let newPage = $('#currentLogPage').val();
                        let perPage = 10;
                        let logs = data.data.slice((newPage-1)*perPage, newPage*perPage);
                        $('#totalLogPage').text(data.pages);
                        $('#currentLogPage').attr('value',newPage);
                        $('.log__table tbody').html('');
                        logs.forEach((log) => {
                            $('.log__table tbody').append(`
                            <tr>
                                <td>
                                    <div class="log__table--deviceID log__table--component">
                                        <span>${log.device.id}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--deviceName log__table--component">
                                        <span>${log.device.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--ip log__table--component">
                                        <span>${log.device.ip}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--sensor log__table--component">
                                        <span>${log.id}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--ype log__table--component">
                                        <span>${log.type}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--value log__table--component">
                                        <span>${log.value}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="log__table--time log__table--component">
                                        <span>${new Date(log.date_created).toLocaleString()}</span>
                                    </div>
                                </td>
                            </tr>
                            `);
                        });
                    }
                });
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                console.log(textStatus);
            }
        });
    });

    /* ============ CHART ============== */
    $.ajax({
        url: 'http://localhost:3000/api/summary',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: (data) => {
            let humValues = data.data.humidity.slice(0,12);
            const humidityChart = new Chart("humidityChart", {
                type: "line",
                data: {
                    labels: ['', '', '', '', '', '', '', '', '', '', '', 'Now'],
                    datasets: [{
                        backgroundColor: 'rgb(169,247,255,0.62)',
                        borderColor: 'rgb(0 163 225 / 57%)',
                        data: humValues,
                        label: 'Humidity (%)'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Humidity data',
                    }
                }
            });

            let tempValue = data.data.temperature.slice(0,10);

            const temperatureChart = new Chart("temperatureChart", {
                type: "bar",
                data: {
                    labels: ['', '', '', '', '', '', '', '', '', 'Now'],
                    datasets: [{
                        backgroundColor: 'red',
                        data: tempValue,
                        label: 'Temperature (°C)',
                        backgroundColor: '#ffadb9',
                        borderColor: '#f7072b',
                        barThickness: 10,
                        borderWidth: 2,
                        borderRadius: 20,
                        borderSkipped: false,
                    }]
                },
                options: {
                    legend: {display: false},
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 45
                        }
                    },
                    title: {
                        display: true,
                        text: 'Temperatyre data',
                    }
                }
            });
        }
    });
});
