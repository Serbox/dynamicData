//esta variable se usa para saber si esta inicializada 
let dataTable;
//y esta para inicializarla
let dataTableInitialized = false;

//opciones de la tabla
const dataTableOptions = {
    lengthMenu:[1,2,3,10],//se usa para configurar hasta cuantos datos puede mostrar
    //scrollX:"2000px", //se usa para colocarle un escrol a la tabla en posicion de X igualmente si se necesita para Y
    columnDefs:[ // de esta manera es como puedo editar algunos estilos nativos de la libreria por los que quiero remplazar
        {className:"centered",targets:[0,1,2,3,4,5,6]}, //aqui tomara los cambios de la calse centered y la estoy llamando en el archivo style.css y se aplicara en las posiciones del 0 al 4
        {orderable:false,targets:[5,6]}, //se utiliza para que las comunas no se puedan ordenar en este caso solo las comunas 6 y 7 en las posiciones 5 y 6
        {width:"5%",targets:[0]}, // para editar el ancho
        {searchable:false,targets:[1]} //se utiliza para que en la barra de busqueda limite la busqueda en una sola columna
    ],
    pageLength:3, //se usa para mostrar un numero de datos en la tabla
    destroy:true, //para que se destruya la tabla
    language:{ //configuracion para cambia el idioma de la tabla las palabras que estan entre "_variable_"  son variables que utiliza la libreria 
        lengthMenu:"Mostrar _MENU_ registros por pagina",
        zeroRecords:"Ningun usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningun usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar: ",
        loadingRecords: "Cargando ... ",
      
    }
};

//creamos la fincion para que se ejev
const initDataTable = async()=>{
    if (dataTableInitialized) {
        dataTable.destroy();
    
    }

    //esta funcion ejecutara listUser
    await listUser();
    //JQuery y llamo a metodo DataTable esto para pasarle parametros de configuracion de la funcion dataTableOptions
    dataTable=$("#datatable_users").DataTable(dataTableOptions);
    dataTableInitialized=true;
};
//Creo la funcion que va a leer los usuarios
const listUser=async()=>{
    try{
        //creo una variable para que con el metodo fetch nativo de js la lea
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        //lo leo como .JSON
        const users = await response.json();

        //Se inicializa la variable que va a pasar los datos de js a html
        let content = '';
        //con esta variable voy a escribir en el HTML
        let datausers=document.getElementById('tableBody_users');
        //con este foech puedo recorrer y traer cualquier comuna de la API
        users.forEach((user,index) => {
            content+=`
            <tr>
            <td>${index+1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.address.city}</td>
            <td>${user.company.name}</td>
            <td><i class="fa-solid fa-check" style="color:green;"></i></td>
            <td>
                <button class="btn btn-sm btn-primary"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
            </td>
  


            </tr>`
            //escribo el contenido del resultado que me genero el foreach y lo paso al HTML por medio del Id
            datausers.innerHTML=content;
        });
        

        

    }catch(ex){
        //genera una alerta del error que se presente
        alert(ex);
    }
};

document.getElementById('exportToExcelBtn').addEventListener('click', async () => {
    try {
        console.log('Iniciando la generación del archivo Excel...');
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();

        const workbook = XLSX.utils.book_new();
        const data = users.map((user,index)=>({
            Index: index + 1,
            Name: user.name,
            Email: user.email,
            City: user.address.city,
            Company: user.company.name
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
        XLSX.writeFile(workbook, 'Usuarios.xlsx');

        console.log('Archivo Excel generado exitosamente');
        alert('Archivo Excel generado exitosamente');
    } catch (ex) {
        console.error('Error al generar el archivo Excel:', ex);
        alert('Error al generar el archivo Excel');
    }
});





//aqui es donde se va a correr
window.addEventListener("load",async()=>{
    await initDataTable();
});