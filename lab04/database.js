var util = require('util');
var ee = require('events');

var db_data =[
    {id:653643, name: 'Иванов И.И.', bday:'2000-01-01'},
    {id:265433, name: 'Петров П.П.', bday:'2000-01-03'},
    {id:973052, name: 'Сидоренко С.А.', bday:'2003-12-03'},
    {id:964295, name: 'Павлов П.И.', bday:'2000-01-04'},
    {id:659742, name: 'Семенов С.М.', bday:'2000-01-12'},
    {id:657641, name: 'Иванов И.И.', bday:'2000-01-01'},
    {id:778209, name: 'Петровский К.П.', bday:'2000-08-02'},
    {id:887653, name: 'Сикорский С.Р.', bday:'2007-01-03'},
    {id:264267, name: 'Павловский Е.И.', bday:'2000-07-04'},
    {id:103367, name: 'Слепакова А.И.', bday:'2000-11-05'}
];

function DB(){
    this.select = ()=>{return db_data;};
    this.insert = (r)=>{db_data.push(r);};
    this.update = (r)=>{
        var index = db_data.findIndex(function(item, i){
            return item.id == r.id;
        });
        if(index!=-1){
            db_data[index].name = r.name;
            db_data[index].dbay = r.dbay;
            return db_data[index];
        }
        else
            return 'not found';
    }
    this.delete = (id)=>{
        var index = db_data.findIndex(function(item, i){
            return item.id == id;
        });
        if(index!=-1)
            return db_data.splice(index, 1);
        else
            return 'not found';
    }
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;