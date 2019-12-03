var coloum = 7
var index = 0
//图片列表加载
var table = new Vue({
    el:"#table-table",
    data:{
        itemss:[
            {items:[
                    {item:'http://222.186.36.75:8888/thumbnail/20191105/mmexport1572937867208.jpg'},
                    {item:"./image/dog.gif"},
                    {item:'http://222.186.36.75:8888/thumbnail/20191105/mmexport1572937867208.jpg'},
                    {item:"./image/dog.gif"},
                    {item:'http://222.186.36.75:8888/thumbnail/20191105/mmexport1572937867208.jpg'},
                    {item:"./image/dog.gif"},
                    {item:'http://222.186.36.75:8888/thumbnail/20191105/mmexport1572937867208.jpg'},
                ]}
        ]
    },
})

var more = new Vue({
    el:"#img-more",
    methods:{
        getMore:function (event) {
            index++
            //event.target.style.display = 'none'
            getImages(index)
        }
    }
})

function getImages(l) {
    $.ajax({
        type:"GET",
        dataType:"json",
        url:"http://222.186.36.75:8888/record/record/getAllRecordsDescLimit",
        data:{
            pagesize:28,
            limit:l
        },
        success:function (res) {
            dealData(res)
        },
        error:function (err) {
            console.log(err)
        }
    });
}

function addRecordATip(id,content) {
    var data = {"id":id,"content":content}
    $.ajax({
        type:"POST",
        dataType : "html",
        contentType:false,
        url:"http://222.186.36.75:8888/record/tip/addRecordATip",
        data:{
            data:JSON.stringify(data)
        },
        success:function (res) {
          //  alert("success")
        },
        error:function (err) {
            alert(JSON.stringify(err))
        }
    });
}

function getErrorImg(event){
    var img = event;
    var  src  =img.src;
    img.src =  src.replace("thumbnail","records")
    if(img.src.toLowerCase().endsWith("mp4")||img.src.toLowerCase().endsWith("avi")||img.src.toLowerCase().endsWith("wav")){
        img.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575267891806&di=7a7cc12e34cbf50c273ec2d43b6b5de2&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fa044ad345982b2b760aab57f37adcbef76099b50.jpg"
    }
    img.onerror = null
}

function onclickImg(event){
    $("#dialog-button-right")[0].setAttribute("item",event.dataset.item)
    $("#dialog-main")[0].style.display = "block"
}

function onclickDialog(event){
    switch (event.id) {
        case "dialog-button-left":

            break
        case "dialog-button-right":
            var item = JSON.parse(event.getAttribute("item"))
            addRecordATip(item.id,$(".dialog-input")[0].value)
            break
    }
    $("#dialog-main")[0].style.display = "none"
}


table.itemss = []
getImages(index)

function dealData(res) {
    var data = res.data;
    for(i=0;i<data.length;i++){
        var  s = data[i].netpath.substring("E:\\records\\".length,data[i].netpath.length).split("\\")
        var b = "http://222.186.36.75:8888/thumbnail"
        for(j=0;j<s.length;j++){
            if(s[j]==""){
                continue
            }
            b=b+"/"+s[j]
        }
        data[i].netpath = b;
    }
    var aaa=[]

    for(j=0;j<=data.length/coloum;j++){
        var aa = {items:[]}
        var y = j/coloum
        var x = j%coloum
        if(j<data.length/coloum){
            for(k=0;k<coloum;k++){
                var a ={item:"",msg:""};
                a.item = data[j*coloum+k].netpath
                a.id = data[j*coloum+k].id
                var s= a.item.split("/")
                if(s.length>3){
                    a.msg =s[s.length-2]+"/"+s[s.length-1].substring(0,5)
                }
            a.onerror = a.item.replace("thumbnail","records")
                aa.items.push(a)
            }
        }else{
            for(k=0;k<data.length%coloum;k++){
                var a ={item:"",msg:""};
                a.item = data[j*coloum+k].netpath
                a.id = data[j*coloum+k].id
                var s= a.item.split("/")
                if(s.length>3){
                    a.msg =s[s.length-2]+"/"+s[s.length-1].substring(0,5)
                }
                a.onerror = a.item.replace("thumbnail","records")
                aa.items.push(a)
            }
        }
        aaa.push(aa)
    }
    for(i=0;i<aaa.length;i++){
        if(aaa[i].items.length!=0){
            table.itemss.push(aaa[i])
        }
    }
    console.log(JSON.stringify(table.itemss))
}




