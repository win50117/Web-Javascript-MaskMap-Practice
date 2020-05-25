//存放json資料
var data;
//顯示日期資料
function renderDay() {
    var date = new Date();
    var day = date.getDay();
    var chineseDay = judgeDayChinese(day);
    var thisDay = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    document.querySelector("h2 span").textContent = chineseDay;
    document.querySelector("h3").textContent = thisDay;

    //判斷奇數偶數，並顯示可以購買的民眾
    if (day % 2 == 1 && day !== 7) {
        document.querySelector(".odd").style.display = "block";
    } else if (day % 2 == 0 && day !== 7) {
        document.querySelector(".even").style.display = "block";
    } else {

    }
}

//將傳入的數字日期轉成中文
function judgeDayChinese(day) {
    switch (day) {
        case 1:
            return "一";
            break;
        case 2:
            return "二";
            break;
        case 3:
            return "三";
            break;
        case 4:
            return "四";
            break;
        case 5:
            return "五";
            break;
        case 6:
            return "六";
            break;
        case 7:
            return "日";
            break;
    }
}

function getDate() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json")
    xhr.send();
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText);
        //成功抓到資料後，渲染一次List
        renderList("臺北市");
    }
}

//顯示列表
function renderList(city) {
    var ary = data.features;
    var str = "";
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].properties.county == city) {
            str += "<li>" + ary[i].properties.name +
                "<span class='adult'>成人口罩：" + ary[i].properties.mask_adult +
                "</span><span class='child'>兒童口罩：" + ary[i].properties.mask_child + "</span>" + "</li>"
        }
    }
    document.querySelector(".list").innerHTML = str;
}

function inin() {
    renderDay();
    getDate();
}

inin();

//選單變換監聽事件
document.querySelector(".area").addEventListener("change", function (e) {
    renderList(e.target.value)
})

//設定一個地圖，把這地圖定位在#map，先定位setView座標，zoom定位13
var mymap = L.map('map').setView([25.0329712, 121.564763], 16);

//tileLayer你要用誰的圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);