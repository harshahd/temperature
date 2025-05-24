        let locationBTN=document.getElementById("location-btn");
        let searchForm=document.getElementById("search-form");
        let locInfo=document.querySelector("#location-info");
const baseUrl="https://api.open-meteo.com/v1/forecast?";

const getGeo=async (lt, lg) => {
    const baseUrl="https://nominatim.openstreetmap.org/reverse?";
    const url=`${baseUrl}lat=${lt}&lon=${lg}&format=json`;
    try {
    const rsp=await fetch(url);
    const geoData=await rsp.json();
    return {name:geoData.display_name,latitude:lt,longitude:lg};
    }
    catch(e) {
        console.log(e);
        return null;
    }
}

const getGeoNames=async (city) => {
    const baseurl="https://geocoding-api.open-meteo.com/v1/search?";
    const url=`${baseurl}name=${city}&count=10&language=en&format=json`;
    try {
        const geoData=await fetch(url);
        const cityList=await geoData.json();
        return cityList.results.map((c,i) => {
            return {name:`${c.name}, ${c.admin1}, ${c.country}`,latitude:c.latitude,longitude:c.longitude};
        });
    }
    catch(e) {
        return null;
    }
}

        const getWhether=async (lt,lg) => {
const url=`${baseUrl}latitude=${lt}&longitude=${lg}&hourly=temperature_2m`;
// console.log(url);
try {
    const rsp=await fetch(url);
    if(rsp.status===200) {
        const data =await rsp.json();
        return data;
    }
    else
    return null;
}
catch(e) {
    console.log(e);
    // return null;
}
        };
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const search=document.getElementById("city-pin-search");
const locations=await getGeoNames(search.value);
updateLocationsList(locations);
        });
locationBTN.addEventListener('click', async (e) => {
        if(navigator.geolocation) {
        locationBTN.disabled=true;
        navigator.geolocation.getCurrentPosition(async (pos) => {
const lat=pos.coords.latitude;
const lng=pos.coords.longitude;
const geoData=await getGeo(lat,lng);
const dataList=[geoData];
// document.getElementById("location-info").textContent=geoData.name;
updateLocationsList(dataList);
// whetherData=await getWhether(lat,lng);
if(whetherData) {
//    alert(JSON.stringify(whetherData));
}
        }, (err) => {
            alert("Error getting your location");               
        });
    }
});


const updateLocationsList=(locations) => {
        let locDetails=document.getElementById("location-details");
    if(!locations && locDetails.querySelectorAll("ul").length==0) {
        locInfo.textContent="No results";
        return;
    }
    if(locDetails.querySelectorAll("ul").length==0)
    {
const locList=document.createElement("ul");
locList.style.listStyleType="none";
locations.forEach((loc,i) => {
let locLink=document.createElement("a");
locLink.href=`/display_whether?lat=${loc.latitude}&long=${loc.longitude}&hourly=temperature_2m`;
locLink.textContent=loc.name;
let locItem=document.createElement("li");
locItem.appendChild(locLink);
locList.appendChild(locItem);
});
locDetails.appendChild(locList);
locInfo.textContent=`Found ${locList.children.length} results`;
    }
    else {
        let locList=locDetails.querySelector("ul");
        if(!locations) {
            locDetails.removeChild(locList);
            locInfo.textContent="No results";
            return;
        }
        if(locList.children.length>locations.length) {
            Array.from(locList.children).forEach((locItem,i) => {
                if(i>=locations.length) {
                    locList.removeChild(locItem);
                }
                else {
let locLink=locItem.querySelector("a");
locLink.href=`/display_whether?lat=${locations[i].latitude}&long=${locations[i].longitude}&hourly=temperature_2m`;
locLink.textContent=locations[i].name;
                }
            });
        }
else if(locList.children.length<locations.length) {
    locations.forEach((loc,i) => {
        if(i>=locList.children.length) {
            let locLink=document.createElement("a");
locLink.href=`/display_whether?lat=${loc.latitude}&long=${loc.longitude}&hourly=temperature_2m`;
locLink.textContent=loc.name;
let locItem=document.createElement("li");
locItem.appendChild(locLink);
locList.appendChild(locItem);
        }
        else {
            let locLink=locList.children[i].querySelector("a");
            locLink.href=`/display_whether?lat=${loc.latitude}&long=${loc.longitude}&hourly=temperature_2m`;
locLink.textContent=loc.name;
        }
    });
}
else {
    Array.from(locList.children).forEach((locItem,i) => {
        let locLink=locItem.querySelector("a");
        locLink.href=`/display_whether?lat=${locations[i].latitude}&long=${locations[i].longitude}&hourly=temperature_2m`;
locLink.textContent=locations[i].name;
    })
}
locInfo.textContent=`Found ${locList.children.length} results`;
    }
};

