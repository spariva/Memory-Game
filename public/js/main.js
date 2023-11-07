let contenedor = document.getElementById("contenedorCartas");



let imagen1 = null;
let parrafo = document.getElementById("parrafo");

function pillarCarta(img){

    if(img.classList.contains("cartaBack")){

        if(imagen1 === null){
            imagen1 = img;
            img.classList.remove("cartaBack");
    
        }else{
    
            if(imagen1.src === img.src && imagen1.id != img.id){
                img.classList.remove("cartaBack");
                // parrafo.innerHTML="¡Pareja encontrada!"
                
                alert("Pareja encontrada");
                return imagen1 = null;
            }else{
                img.classList.add("cartaBack");
                imagen1.classList.add("cartaBack");
                alert("Vuelve a empezar");
                return imagen1 = null;
            }
        }
    }else{
        alert("No puedes elegir una carta de una pareja ya descubierta.")
    }
}