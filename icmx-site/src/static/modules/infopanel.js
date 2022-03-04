function postLicInfo(data){
    var licdata = data['results']['data']
    console.log(licdata)
    for (var key in licdata){
        console.log(key)
        console.log(licdata[key])
    }
}

export { postLicInfo }