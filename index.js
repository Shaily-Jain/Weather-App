const fs = require("fs");
const http = require("http");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html" , "utf-8");
 
const replaceData = (tempData, apiData) => {
    let temperature = tempData.replace("{%tempval%}" , apiData.main.temp);
    temperature = temperature.replace("{%tempMin%}" , apiData.main.temp_min);
    temperature = temperature.replace("{%tempMax%}" , apiData.main.temp_max);
    temperature = temperature.replace("{%location%}" , apiData.name);
    temperature = temperature.replace("{%country%}" , apiData.sys.country);
    temperature = temperature.replace("{%tempStatus%}" , apiData.weather[0].main);

    return temperature;
};

const server = http.createServer((req,res) => {
    if(req.url == '/'){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=320e81d2cef8069022384a048b714333`)
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData);
            const realData = arrData.map((val) => replaceData(homeFile , val)).join("");
            res.write(realData);
        })
        .on("end" , (err) => {
            if(err) return console.error(err);
            res.end();
        })
    }
    else{
        res.end("No Data Found!!");
    }
});
server.listen('8080', () => {
    console.log('Api Called Successfully !!');
})