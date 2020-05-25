//存放json資料
var data;

// 1. 定義 marker 顏色， 把這一段放在 getData() 前面
var mask;
// 2. 我們取出綠、 橘、 紅三個顏色來代表口罩數量的不同狀態
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    // 3. 只要更改上面這一段的 green.png 成專案裡提供的顏色如： red.png， 就可以更改 marker 的顏色
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


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
        addMarker();
        addCountyList()
    }
}

//顯示列表、地圖藥局標示
function renderList(city, town) {
    var ary = data.features;
    var str = "";

    for (var i = 0; i < ary.length; i++) {
        var pharmacyName = ary[i].properties.name; //藥局名稱     
        var maskAdult = ary[i].properties.mask_adult; //成人口罩數量
        var maskChild = ary[i].properties.mask_child; //兒童口罩數量
        if (ary[i].properties.county == city) {
            str += "<li>" + pharmacyName +
                "<br><span class='adult'>成人口罩：" + maskAdult +
                "</span><span class='child'>兒童口罩：" + maskChild + "</span>" + "</li>";
        }
    }
    document.querySelector(".list").innerHTML = str;
}

function addMarker() {
    //新增圖層，這圖曾專門放icon群組
    var markers = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 18
    }).addTo(mymap);

    var ary = data.features;
    for (var i = 0; i < ary.length; i++) {
        var pharmacyName = ary[i].properties.name; //藥局名稱        
        var maskAdult = ary[i].properties.mask_adult; //成人口罩數量
        var maskChild = ary[i].properties.mask_child; //兒童口罩數量
        var lat = ary[i].geometry.coordinates[1]; //經度
        var lng = ary[i].geometry.coordinates[0]; //緯度       

        //加上一個marker，並設定他的座標，同時將這座標放入對應的地圖裡。
        //bindPopup針對這個marker，加上HTML內容進去
        //openPopup預設要把他開啟
        if (maskAdult == 0 || maskChild == 0) {
            mask = redIcon;
        } else if (maskAdult < 100 || maskChild < 100) {
            mask = orangeIcon;
        } else {
            mask = greenIcon;
        }
        //使用彙整標示點套件markers.addLayer，在該圖層上，加上各個marker
        markers.addLayer(L.marker([lat, lng], {
                icon: mask
            })
            .bindPopup("<h1>" + pharmacyName + "</h1><p>成人口罩：" + maskAdult + "<br>兒童口罩：" + maskChild + "</p>")
            .openPopup());
    }
    mymap.addLayer(markers); //彙整套件使用，放在標示後
}

function inin() {
    renderDay();
    getDate();
}

inin();

//設定一個地圖，把這地圖定位在#map，先定位setView座標，zoom定位13
var mymap = L.map('map').setView([25.0329712, 121.564763], 16);

//tileLayer你要用誰的圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

//縣市選單變換監聽事件
document.querySelector(".selectCounty").addEventListener("change", addTownList)
document.querySelector(".selectTown").addEventListener("change", function () {
    console.log(selectCity.value + ":" + e.target.value)

})

//縣市選單
var countySelector = document.querySelector('.selectCounty');
var townSelector = document.querySelector('.selectTown');

function addCountyList() {
    var allCounty = [];
    for (var i = 0; i < data.features.length; i++) {
        var countyName = data.features[i].properties.county;
        //和陣列內不重複的才放進陣列並添加到下拉選單
        if (allCounty.indexOf(countyName) == -1 && countyName !== '') {
            allCounty.push(countyName);
            countySelector.options.add(new Option(countyName, countyName));
        }
    }
}

//點擊縣市選單觸發事件，加入鄉鎮選單
function addTownList(e) {
    var allTown = [];
    //鄉鎮區選單清空。
    townSelector.options.length = 0;
    for (var i = 0; i < data.features.length; i++) {
        var TownName = data.features[i].properties.town;
        //和陣列內不重複的才放進陣列並添加到下拉選單
        if (e.target.value == data.features[i].properties.county) {
            if (allTown.indexOf(TownName) == -1 && TownName !== '') {
                allTown.push(TownName);
                townSelector.options.add(new Option(TownName, TownName));
            }
        }
    }
    renderList(e.target.value, townSelector.value)
}