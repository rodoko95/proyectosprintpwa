const home=(req,res)=>{
    res.send ('Estamos en la ruta; localhost/home/');
};
const features=(req,res)=>{
    res.send ('Estamos en la ruta: localhost/home/features');
};

const plans=(req,res)=>{
    res.send ('Estamos en la ruta: localhost/home/plans');
};

const request=(req,res)=>{
    res.send ('Estamos en la ruta: localhost/home/request');
}

module.exports = {
    home,
    features,
    plans,
    request
}