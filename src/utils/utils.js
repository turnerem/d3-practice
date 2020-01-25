
exports.countsPerTimeUnit = (data) => {
  const countObj = {}
  data.forEach(elem => {
    let jsDate = new Date(elem.created_at);
    let mth = jsDate.getMonth() + 1;
    let yr = jsDate.getFullYear();
    let day = jsDate.getDate()
    console.log('\n\n', yr,  mth,  day)

    let mthChar = (mth < 10) ? '0' + mth : '' + mth;
    let dayChar = (day < 10) ? '0' + day : '' + day;
    let formattedDate = `${yr}-${mthChar}-${dayChar}`
    countObj.hasOwnProperty(formattedDate) ? countObj[formattedDate] ++ : countObj[formattedDate] = 1;
  })
  const dateArr = Object.keys(countObj).map(key => {
    
    return { date: key, count: countObj[key]}
    
  })
  return dateArr
}