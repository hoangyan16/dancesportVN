const models                             = require('../../models');
const readXlsxFile                       = require("read-excel-file/node");
const fs                                 = require('fs');
const  xlstojson                         = require("xls-to-json-lc");
const  xlsxtojson                        = require("xlsx-to-json-lc");
const { response } = require('express');



// QUẢN LÝ RESOURCES
// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAll=async(tournament_id)=>{
    let condition= {deleted: false,is_image_4_logo_and_ads:false};
    if(tournament_id){
        condition= {deleted: false,is_image_4_logo_and_ads:false,tournament_id:tournament_id}
    }
    return models.resource.findAndCountAll({
        where:condition,
        order: [
            ['created_date', 'DESC']
        ],
        attributes:['id','title','url','tournament_id']
    });
};

// Lấy thông tin nội dung các cuộc thi đã được tạo bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
const limit= searchViewModel.limit;
const offset= searchViewModel.offset;
return models.resource.findAndCountAll({
    where:{deleted: false,is_image_4_logo_and_ads:false},
    order: [
      ['created_date', 'DESC']
  ],
  attributes:['id','title','url','tournament_id'],
    limit:limit,
    offset:offset
});
};

// Lấy thông tin bằng Id
exports.getbyId=async (Id)=>{
    return models.resource.findOne({where:{id:Id,is_image_4_logo_and_ads:false},attributes:['id','title','url','tournament_id']});
};


// Create 
exports.create= async(req,result,t)=>{
    const finalresult=[];
    if(req.body.files&&req.body.files.length>0){
        const options=[];
        for(var i=0; i<req.body.files.length;i++){
          options[i]={
            tournament_id: result.id,
            url: req.body.files[i].file_url,
            title: req.body.files[i].file_title,
            link: req.body.files[i].file_url_json
          };
          var url = await models.resource.create(options[i],t);
          finalresult.push(url);
        };
    }
    return finalresult;
};

// Create 
exports.update= async(req,result)=>{
    const finalresult=[];
    if(req.body.files&&req.body.files.length>0){
        const options=[];
        for(var i=0; i<req.body.files.length;i++){
          options[i]={
            tournament_id: result,
            url: req.body.files[i].file_url,
            title: req.body.files[i].file_title,
            link: req.body.files[i].file_url_json
          };
          var url = await models.resource.create(options[i]);
          finalresult.push(url);
        };
    }
    return finalresult;
};

// Upload Files
exports.uploadFiles= async(data)=>{
    const result=[];
    for(var i=0; i<data.files.length;i++){
        let namefile= data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-2]
        if(((  data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xlsx'&&namefile==='DsVDVTheoSK')
            ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xlsx'&&namefile==='DanhsachVDVTheoSuKien'))
            ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xls'&& namefile ==='DsVDVTheoSK')
            ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xls'&& namefile==='DanhsachVDVTheoSuKien')){
            let filename= data.files[i].filename.split('.')[0];
                    const url= encodeURI("/resources/files/resources/"+data.files[i].filename);
                    const urljson = encodeURI(`/resources/files/exceltojson/${filename}.json`);
                    let encoded= {url,urljson};
                    result.push(encoded);
            }else{
                let url=encodeURI("/resources/files/resources/"+data.files[i].filename);
                encoded= {url};
                result.push(encoded);
            }
        };
    return result
};
// Upload Files
exports.ConvertExcelFilesToJSON= async(data)=>{
    for(var i=0; i<data.files.length;i++){
        if(((  data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xlsx'&&namefile==='DsVDVTheoSK')
        ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xlsx'&&namefile==='DanhsachVDVTheoSuKien'))
        ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xls'&& namefile ==='DsVDVTheoSK')
        ||(data.files[i].originalname.split('.')[data.files[i].originalname.split('.').length-1]   === 'xls'&& namefile==='DanhsachVDVTheoSuKien')){
            let filename= data.files[i].filename.split('.')[0];
            let path =__basedir + "/resources/files/resources/" +data.files[i].filename;
            let pathtojson =`${__basedir}/resources/files/exceltojson/${filename}.json`;
                readXlsxFile(path).then((rows,columns) => {
                    rows.shift();
                    rows.shift();
                    rows.shift();
                    rows.shift();
                    let tutorials = [];
                    let eventsname=[];
                    let athletes=[];
                    rows.forEach((row) => {
                        let tutorial = {
                            no: row[0],
                            full_name_one: row[1],
                            full_name_two: row[2],
                            unit: row[3],
                            heat: row[4],
                        };
                        tutorials.push(tutorial);
                        });
                        tutorials.forEach((obj)=>{
                            let event={
                            name : obj.no,
                            };
                            let no= obj.no
                            let name1= obj.full_name_one;
                            let name2= obj.full_name_two;
                            let unit= obj.unit;
                            let heat= obj.heat;
                            if(no&&name1==null&&name2==null&&unit==null&&heat==null){
                            eventsname.push(event);
                            }
                        });
                        const events= eventsname.map(event=>{
                            let No= event.name.split(":")[0].split(" ")[1];
                            let time= event.name.split("Giờ: ")[1];
                            return {
                                id: Number(No),
                                name: event.name,
                                time: time,
                                athletes
                            };
                        })
                        tutorials.forEach((obj)=>{
                        let no= obj.no
                        let name1= obj.full_name_one;
                        let name2= obj.full_name_two;
                        let unit= obj.unit;
                        let heat= obj.heat;
                        if(heat||(no==null&&name1==null&&name2==null&unit==null&&heat==null)){
                        athletes.push(obj);
                        }
                    });
                    let athletesInEvents=[];
                    let athinevent=[]
                    for(var i=0; i<athletes.length;i++){
                        if(athletes[i].no==null&&athletes[i].full_name_one==null&&athletes[i].full_name_two==null&&athletes[i].heat==null&&athletes[i].unit==null) {
                        athletesInEvents.push(athinevent);
                        athinevent=[];
                        i+1;
                        }else{
                        athinevent.push(athletes[i]);
                        }
                    };
                    for(var i=0;i<events.length;i++){
                        events[i].athletes= athletesInEvents[i]
                        };  
                    fs.writeFileSync(pathtojson, JSON.stringify(events));
                });
            }
        }
};

// Xóa 
exports.delete= async(Id,options)=>{
        return models.resource.update(options,{where:{id:Id,deleted:0}});
};

// Xóa 
exports.destroy= async(Id)=>{
    return models.resource.destroy({where:{tournament_id:Id}});
};


// QUẢN LÝ IMAGES FOR BANNER,LOGO,ADs

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAllImages=async()=>{
    return models.resource.findAndCountAll({
        where:{deleted: false,is_image_4_logo_and_ads: true},
        order: [ ['created_date', 'DESC'] ],
        attributes:['id','title','link','url','type']
    });
};

// Lấy thông tin nội dung cuộc thi đã được tạo 
exports.getbyIdImage=async (Id)=>{
    return models.resource.findOne({where:{id:Id,is_image_4_logo_and_ads:true},attributes:['id','title','link','url','type']});
};


// Upload ImageUrl
exports.uploadImage= async(req)=>{
    var url="/resources/images/resources/"+req.file.filename;
    const encoded = encodeURI(url);
    return encoded
};

// Create URL
exports.createImage= async(data)=>{
    return  models.resource.create(data);
};

// Chỉnh sửa 
exports.updateImage= async(id,options)=>{
    return models.resource.update(options,{where:{id:id}});
};

// Xóa 
exports.deleteImage= async(Id,options)=>{
    return models.resource.update(options,{where:{id:Id,deleted:0}});
};