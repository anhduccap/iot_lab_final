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
});
