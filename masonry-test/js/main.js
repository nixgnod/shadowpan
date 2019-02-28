//全局转匿名函数并执行
;(function(){
  masonry('masonry','box');
  menuH = document.getElementById('menu');
  docH = document.getElementById('masonry').scrollHeight;
  menuH.style.height = docH + 'px';
  //console.log(docH);
})();
function masonry(parent,child){
  var cparent = document.getElementById(parent);
  var ocbox = getbyclass(cparent,child);
  var ocboxw = ocbox[1].offsetWidth;  //关键词.offsetWidth获取盒子的宽度
  //关键词document.documentElement.clientWidth获取浏览器最大宽度 / 盒子宽度 = 最多列数并取整;
  var cols = Math.floor(cparent.offsetWidth / ocboxw - 1);
  //关键词.style.cssText设置main的css属性 宽度= 盒子宽度 * 列数 并居中;
  //cparent.style.cssText = 'width:' + ocboxw * cols + 'px; margin: 0 auto;';
  //console.log(cparent);
  var harr = [];
  for(i=0;i<ocbox.length;i++){
    if(i<cols){
      harr.push(ocbox[i].offsetHeight);
      //console.log(harr);
    }else if(i==3){
      harr[i] = ocbox[0].offsetHeight;
      ocbox[i].style.position = 'absolute';
      ocbox[i].style.top = ocbox[0].offsetHeight + 'px';
      ocbox[i].style.left = ocbox[1].offsetLeft - ocboxw + 'px';
      harr[i] += ocbox[i].offsetHeight;
      //console.log(ocbox[i].offsetHeight);
    }else{
      //关键词 Math.min.apply求第一行最矮图片高度，为第二列做定位，apply改变数组参数
      var colmh = Math.min.apply(null,harr);
      //关键词 index获取getminH中的最小值和索引为第几张图片
      var index = getminH(harr,colmh);
      //第二行图片的位置插入到第一行最矮图片下方;
      ocbox[i].style.position = 'absolute';
      ocbox[i].style.top = colmh + 'px';
      //ocbox[i].style.left = ocboxw * index + 'px';
      ocbox[i].style.left = ocbox[index].offsetLeft + 'px';
      //第二行图片插入到第一行下后，改变数组中的值，为每列高度
      harr[index] += ocbox[i].offsetHeight;
      //console.log(ocbox[index].offsetLeft);
    }
    //console.log(harr);
  }
  //console.log(cmainw);
}

//根据class获取元素
function getbyclass(cparent,child){
  var cArr = new Array();
    otags = cparent.getElementsByTagName('*');  //关键词.getElementsByTagName()获取名字为''的标签*为全部名称
    for(i=0;i<otags.length;i++){
      if(otags[i].className == child){  //关键词.className抓取class为box的元素
        cArr.push(otags[i]);  //关键词.push(Array)把遍历数据放入数组
      }
    }
    return cArr;  //return 数据出口
}

function getminH(mArr,mVal){
  for(var i in mArr){
    //抓取索引i 数组中[i]==mVal的第几个索引
    if(mArr[i]==mVal){
      return i;
    }
  }
}
