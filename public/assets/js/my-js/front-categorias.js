// alert('hola mundo del front de categorias'); 

//vamos a crear funciones para comunicarnos con el back - API - END POINT
//creamos la funcion
let idEliminarCategoria=0;
let idActualizarCategoria=0; 

function getURL(){
    let URL =window.location.protocol + '//' + window.location.hostname
    if (window.location.port)
        URL+=':'+window.location.port 
    return URL; 
}

function agregarCategoria() {
    const descripcion= document.getElementById('descripcionCategoriaAgregar').value ; 
    const observaciones= document.getElementById('observacionCategoriaAgregar').value ; 

    const URL=getURL() +"/categorias/api"; 

    $.ajax({
        method: 'POST',
        url: URL,
        data: {
          descripcion: descripcion,
          observaciones: observaciones
        },
        success: function(result) {
          if (result.estado==1) {
            //agregamos a la tabla 
            //mandamos llamar categoria
            const categoria=result.categoria; 

            let tabla= $('#tabla-categorias').DataTable();  
            let Botones = generarBotones(categoria); 
           

            let nuevoRenglon =tabla.row.add([categoria.descripcion,Botones]).node();
            $(nuevoRenglon).attr('id', 'renglon_'+categoria.id);
            $(nuevoRenglon).find('td').addClass('table-td');
            tabla.draw(false);  

            document.getElementById('descripcionCategoriaAgregar').value=''; 
            document.getElementById('observacionCategoriaAgregar').value='';

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Categoria agregada!',
                showConfirmButton: false,
                timer: 1500
              })

          } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Categoria NO agregada!',
                showConfirmButton: false,
                timer: 1500
              })
          }
        }
      });
}

function listaCategoriasFront(){
    let URL=getURL()+'/categorias/api'

    $.ajax({
        method:'GET',
        url: URL,
        data: {},
        success: function( result ) {
            let estado=result.estado;
            let mensaje=result.mensaje; 
            if (estado==1) {
                let categorias=result.categorias;
                let tabla= $('#tabla-categorias').DataTable(); 
                
                categorias.forEach(categoria => {
                    let Botones = generarBotones(categoria); 
                    //tabla.row.add([categoria.descripcion,Botones]).node.id='registro_'+categoria.id;
                    let nuevoRenglon =tabla.row.add([categoria.descripcion,Botones]).node();
                    $(nuevoRenglon).attr('id', 'renglon_'+categoria.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw(false);          
                });
            
            } else {
                alert(mensaje); 
            }
          
        }
      });
}

function muestraUnaCateoriaFront(id){
    let URL=getURL()+'/categorias/api/' +id;

    $.ajax({
        method:'GET',
        url: URL,
        data: {},
        success: function( result ) {
            if (result.estado==1) {
                //mostrar la categoria en la ventana 
                let categoria=result.categoria; 

                document.getElementById('descripcionCategoriaVisualizar').value=categoria.descripcion;
                document.getElementById('observacionesCategoriaVisualizar').value=categoria.observaciones;

            } else {
                //mostrar mensaje de error
                alert(result.mensaje);
            } 
        }
      });
}

function eliminarCategoriaById(){ 

    let URL=getURL()+"/categorias/api/"+idEliminarCategoria;
        $.ajax({
    method:'DELETE',
    url: URL,
    data: {},
    success: function( result ) {
        if (result.estado==1) {
            let tabla= $('#tabla-categorias').DataTable(); 
            tabla.row('#renglon_'+idEliminarCategoria).remove().draw(); 

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Categoria eliminada!',
                showConfirmButton: false,
                timer: 1500
              })

        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Categoria NO eliminada!',
                showConfirmButton: false,
                timer: 1500
              })
        }
    }
    });
}

function actualizarCategoriaById() {
    
    let URL=getURL()+"/categorias/api/"+idActualizarCategoria;
    let descripcionCategoria=document.getElementById('descripcionCategoriaActualizar').value; 
    let observacionesCategoria=document.getElementById('observacionesCategoriaActualizar').value; 

    $.ajax({
        method: 'PUT', 
        url: URL,
        data: {
            descripcion: descripcionCategoria,
            observaciones: observacionesCategoria
        },
        success: function( result ) {
         if (result.estado==1) {
            let tabla= $('#tabla-categorias').DataTable(); 
            let renglonTemporal=tabla.row('#renglon_'+idActualizarCategoria).data();
            renglonTemporal[0]=descripcionCategoria; 
            tabla.row('#renglon_'+idActualizarCategoria).data(renglonTemporal).draw()

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Categoria actualizada!',
                showConfirmButton: false,
                timer: 1500
              })
         } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Categoria NO actualizada!',
                showConfirmButton: false,
                timer: 1500
              })
         }
        }
      });
}


function generarBotones(categoria){
    let Botones='<div class="flex space-x-3 rtl:space-x-reverse">'
    Botones+='<button onclick="muestraUnaCateoriaFront('+categoria.id+')" class="action-btn" type="button" data-bs-toggle="modal" data-bs-target="#viewModal">'
    Botones+='  <iconify-icon icon="heroicons:eye"></iconify-icon>'
    Botones+='</button>'

    Botones+='<button onclick="identificaIdActualizar('+categoria.id+');" class="action-btn" type="button" data-bs-toggle="modal" data-bs-target="#updateModal">'
    Botones+='  <iconify-icon icon="heroicons:pencil-square"></iconify-icon>'
    Botones+='</button>'

    Botones+='<button onclick="identificaIdEliminar('+categoria.id+');" class="action-btn" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal">'
    Botones+='  <iconify-icon icon="heroicons:trash"></iconify-icon>'
    Botones+='</button>'
    Botones+=' </div>'; 

    return Botones; 
}

function identificaIdEliminar(id){
    idEliminarCategoria=id; 
}

function identificaIdActualizar(id) {
    idActualizarCategoria=id; 
    let URL=getURL()+"/categorias/api/"+idActualizarCategoria;

    $.ajax({
        method: 'GET', 
        url: URL,
        data: {},
        success: function( result ) {
         if (result.estado==1) {
            let categoria=result.categoria; 
            document.getElementById('descripcionCategoriaActualizar').value=categoria.descripcion; 
            document.getElementById('observacionesCategoriaActualizar').value=categoria.observaciones; 
            
         } else {
            alert(result.mensaje);
         }
        }
      });
}



//la mandamos llamar 
listaCategoriasFront(); 


