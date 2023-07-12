
let html='';
const weeks=['日', '月', '火', '水', '木', '金', '土'];
const eweeks=['Sun', 'Mon', 'Tue', 'Wen', 'Thi', 'Fri', 'Sta'];
const date=new Date();
const thisYear=date.getFullYear();
const thisMonth=date.getMonth()+1;
let year=thisYear;
let month=thisMonth;

function decorateDate(startDate, endDate)
{
    //当日判定
    if(year==thisYear&&month==thisMonth)
        document.getElementById(date.getDate()).classList.add('today')
    //祝日判定
    let holidayList=holiday_jp.between(startDate, endDate);
    for(let i=0; i<holidayList.length; ++i)
        document.getElementById(holidayList[i].date.getDate()).classList.add('holiday');
}

function showCalender(year, month)
{
    html="";
    html+="<h1>"+year+"/"+month+"</h1><br>";
    document.getElementById("head").innerHTML=html;
    html="";

    const startDate=new Date(year,month-1,1);
    const endDate=new Date(year,month,0);
    
    const today=date.getDate();
    const startDay=startDate.getDay();
    const maxDate=endDate.getDate();
    
    let count=1;
    
    html+="<table border=\"1\">"; //カレンダー本体
    html+="<tr>";
    for(let i=0; i<7; ++i) //曜日
        html+="<th>"+weeks[i]+"</th>";
    html+="</tr>";
    
    html+="<tr>";
    for(let i=0; i<startDay; ++i) //オフセット
        html+="<td></td>";
    while(count<=maxDate)
    {
        html+="<td";
        html+=" id="+String(count);
        html+=">"+ count++ +"</td>";
        
        if((count+startDay-1)%7==0)
            html+="</tr><tr>";
    }
    while((count++ +startDay-1)%7!=0)
        html+="<td></td>";
    html+="</tr>";
    html+="</table>";
    
    document.getElementById("calender").innerHTML=html;
    decorateDate(startDate, endDate);
}

function moveCalender(e) //ボタン
{
    if(e.target.id=="next") //来月
    {
        month++;
        if(month>12)
        {
            month=1;
            year++;
        }
    }
    if(e.target.id=="prev") //先月
    {
        month--;
        if(month<1)
        {
            month=12;
            year--;
        }
    }
    showCalender(year,month);
}

function showInfo(e)
{
    if(e.target.nodeName!='TD') return;
    let id=e.target.id;
    if(id=='') return;
    
    let infoHtml='';
    let target=new Date(year, month-1, id);
    infoHtml+=year+"年"+month+"月"+id+"日"
    +"("+"<span id=infoDay>"+weeks[target.getDay()]+"</span>"+")";
    document.getElementById('infoDate').innerHTML=infoHtml;
    document.getElementById("infoDay").classList.add(eweeks[target.getDay()]);
    if(!holiday_jp.isHoliday(target))
    {
        document.getElementById('infoHoliday').innerHTML='';
        return;
    }
    document.getElementById('infoDay').classList.add('holiday');
    let holidayName=holiday_jp.between(target, target)[0]['name']
    document.getElementById('infoHoliday').innerHTML=holidayName;
    console.log(holidayName);
    
}

document.getElementById("next").addEventListener("click", moveCalender);
document.getElementById("prev").addEventListener("click", moveCalender);
document.addEventListener("click", showInfo);


showCalender(thisYear, thisMonth);