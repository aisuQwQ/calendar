
let html='';
const weeks=['日', '月', '火', '水', '木', '金', '土'];
const eweeks=['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sta'];
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

function showCalendar(year, month)
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
    
    document.getElementById("calendar").innerHTML=html;
    decorateDate(startDate, endDate);

    //info削除
    document.getElementById('infoDate').innerHTML='';
    document.getElementById('infoHoliday').innerHTML='';

    //ボタン制御
    if(year==2050&&month==12)
        document.getElementById("next").setAttribute("disabled", true);
    else
        document.getElementById("next").removeAttribute("disabled");
    if(year==1970&&month==1)
        document.getElementById("prev").setAttribute("disabled", true);
    else
        document.getElementById("prev").removeAttribute("disabled");
}

function moveCalendar(e) //ボタン
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
    showCalendar(year,month);
}

function showInfo(e)
{
    if(e.target.nodeName!='TD') return; //対象が日付以外の時
    let id=e.target.id;
    if(id=='') return; //空白の時
    
    //infoDate
    let infoHtml='';
    let target=new Date(year, month-1, id);
    infoHtml+=year+"年"+month+"月"+id+"日"
    +"("+"<span id=infoDay>"+weeks[target.getDay()]+"</span>"+")";
    document.getElementById('infoDate').innerHTML=infoHtml;
    document.getElementById("infoDay").classList.add(eweeks[target.getDay()]);

    //infoHoliday
    if(!holiday_jp.isHoliday(target))
    {
        document.getElementById('infoHoliday').innerHTML='';
        return;
    }
    document.getElementById('infoDay').classList.add('holiday');
    let holidayName=holiday_jp.between(target, target)[0]['name']
    document.getElementById('infoHoliday').innerHTML=holidayName;
}

function initSelecter()
{
    let selecterHtml=''
    for(let i=1; i<=12; i++)
        selecterHtml+="<option value='"+i+"'>"+i+"月"+"</option>";
    document.getElementById('monthId').innerHTML=selecterHtml;
    selecterHtml=''
    for(let i=1970; i<=2050; i++)
        selecterHtml+="<option value='"+i+"'>"+i+"年"+"</option>";
    document.getElementById('yearId').innerHTML=selecterHtml;

    document.getElementById('monthId').options[thisMonth-1].selected=true;
    document.getElementById('yearId').options[thisYear-1970].selected=true;
}

function jumpCalendar()
{
    month=document.getElementById('monthId').value;
    year=document.getElementById('yearId').value;
    showCalendar(year, month);
}

document.getElementById("next").addEventListener("click", moveCalendar);
document.getElementById("prev").addEventListener("click", moveCalendar);
document.getElementById("jumpButton").addEventListener("click", jumpCalendar);
document.addEventListener("click", showInfo);

initSelecter()
showCalendar(thisYear, thisMonth);