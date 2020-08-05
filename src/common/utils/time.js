function paddingZero (number) {
  return number > 9 ? number : '0' + number;
}

function format (time) {
  let diff = parseInt(Date.now()/1000 - time);
  let result = '';
  let day = 0;
  let hour = 0;
  let min = 0;
  let sec = 0;

  if (diff < 10) {
    result = '几秒前';
  } else if (diff < 60) {
    result = ` ${diff} 秒前`;
  } else if (diff < 3600) {
    min = parseInt(diff/60);
    sec = diff - min * 60;
    result = ` ${min} 分钟 ${paddingZero(sec)} 秒前`;
  } else if (diff < 86400) {
    hour = parseInt(diff/3600);
    min = parseInt((diff - hour * 3600)/60);
    sec = diff - hour * 3600 - min * 60;
    result = ` ${hour}小时 ${paddingZero(min)} 分钟 ${paddingZero(sec)} 秒前`;
  } else {
    day = parseInt(diff/86400);
    result = ` ${day} 天前`;
  }

  return result;
}

export default {
  format
};
