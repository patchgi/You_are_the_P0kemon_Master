const request=require("request");
const fs=require("fs");
const client=require("cheerio-httpcli");
const URL=require("url");

const MAX_NUM=718;

var para={};
var src;
var savedir=__dirname+"/Box";
var result;
var imgList=new Array();



if(!fs.existsSync(savedir)){
	fs.mkdirSync(savedir);
}

function nf(_num){
	if(_num<10){
		return "00"+_num;
	}
	else if(_num<100){
		return "0"+_num;
	}
		return _num;
}
function fetchImgURL(targetURL,_idx){
	var urlList=new Array();
	var fileName=nf(_idx)+".png";
	var filePath="";
	client.fetch(targetURL,para,function(err,$,res){
		if(err){
			console.log(err);
			return;	
		}
		
		$("img").each(function(idx){
			src=$(this).attr("src");
			result=URL.resolve(targetURL,src);
			urlList.push(result);
		})

		filePath=savedir + "/" + fileName.replace(/[^a-zA-Z0-9\.]+/g, '_');
		request(urlList[2]).pipe(fs.createWriteStream(filePath));
	})
}

for(var i=1;i<=MAX_NUM;i++){
	var baseURL="http://www.pokemon.jp/zukan/detail/";
	fetchImgURL(baseURL+=nf(i)+".html",i);
	var progress=i/MAX_NUM*100;
	if(progress===100){
		console.log("You are the Pokemon Master!!");
	}
}

