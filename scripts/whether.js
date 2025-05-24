const whetherDetails=document.getElementById("whether-details");
const whetherInfo=document.getElementById("whether-info");
const detailedHeadingEle=document.getElementById("details-heading");

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


const getWhether=async (lt,lg) => {
    const baseUrl="https://api.open-meteo.com/v1/forecast?";
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

let queries=new URLSearchParams(window.location.search);
        const lat=queries.get("lat");
        const long=queries.get("long");
            const hourly=queries.get("hourly");
        (async () => {
            const geoData=await getGeo(lat,long);
            detailedHeadingEle.textContent+=` for ${geoData.name}`;
        const whetherData=await getWhether(lat,long);
                // alert(whetherData.timezone);
                if(hourly) {
updateEachDayWhether([whetherData.hourly['time'], whetherData.hourly[hourly]]);
                }
})();

const formatApiDatetime=(dt) => {
        const date = new Date(dt);
let hours = date.getHours();
let minutes = date.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
const time_in_12_hour = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

// Get day name
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const day_name = dayNames[date.getDay()];

// Format date to "Month Day, Year"
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formatted_date = date.toLocaleDateString(undefined, options);
return day_name+", "+formatted_date;
}


const formTable=(cols) => {
    if(cols.length>0) {
        let tableEle=document.createElement("table");
let captionEle=document.createElement("caption");
captionEle.textContent="Whether information";
tableEle.appendChild(captionEle);
let allCols=cols.map((col) => col.length);
const rows=Math.max(...allCols);
const columns=cols.length;
// console.log(columns);
let tBodyEle=document.createElement("tbody");
for(let i=0;i<rows;i++) {
    let rowEle=document.createElement("tr");
    if(i==0) {
        let theadEle=document.createElement("thead");
        let trEle=document.createElement("tr");
        let th1=document.createElement("th");
        let th2=document.createElement("th");
        th1.textContent="Time";
        th1.scope="col";
        th2.textContent="Temperature (2m)";
        th2.scope="col";
        trEle.appendChild(th1);
        trEle.appendChild(th2);
        theadEle.appendChild(trEle);
tableEle.appendChild(theadEle);
    }
    cols.forEach((col,nm) => {
        let dataEle=document.createElement("td");
        if(nm==0) {
        const date = new Date(col[i]);
let hours = date.getHours();
let minutes = date.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
const time_in_12_hour = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
dataEle.scope="row";
dataEle.textContent=time_in_12_hour;
        }
        else
        dataEle.textContent=col[i];
        rowEle.appendChild(dataEle);
        tBodyEle.appendChild(rowEle);
    });
}
// whetherDetails.appendChild(tableEle);
tableEle.appendChild(tBodyEle);
return tableEle;
    }
    else
    return null;
};

const updateEachDayWhether=(cols) => {
let hours=24;
let allCols=cols.map((col) => col.length);
const rows=Math.max(...allCols);
const columns=cols.length;
while(hours<rows) {
let someRows=cols.map((col,i) => col.slice(hours-24,hours));
const dateStr=formatApiDatetime(someRows[0][0]);
const tableEle=formTable(someRows);
tableEle.caption.textContent+=` for ${dateStr}`;
let whetherHeadingEle=document.createElement("h2");
whetherHeadingEle.textContent=dateStr;
whetherDetails.appendChild(whetherHeadingEle);
whetherDetails.appendChild(tableEle);
hours+=24;
}
};

