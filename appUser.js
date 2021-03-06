//configuración personal de Firebase
firebase.initializeApp({
    apiKey: "AIzaSyD8j25MNXGICGabCjhv-4_mGA7qkNzKcsc",
    authDomain: "asdasdasdasd-9752c.firebaseapp.com",
    projectId: "asdasdasdasd-9752c"
});  
       
console.log("AppUser.js")
  
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
 
  function registrar(){
      var email = document.getElementById('email_register').value;
      var contrasena = document.getElementById('contrasena_register').value;
      var name = document.getElementById('name').value;

      firebase.auth().createUserWithEmailAndPassword(email, contrasena)
      .then(function(){
          verficar()
      })

      db.collection("users").add({
          name: name,
          email: email
      })
     
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          document.getElementById('email_register').value = '';
          document.getElementById('contrasena_register').value = '';

      })

      .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          // ...
        });

  }

  function verficar(){
      var user = firebase.auth().currentUser;  
      user.sendEmailVerification().then(function() {
        // Email sent.
        console.log('Enviando correo...');
        // location.reload(true);
 
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      }); 
  }


//Leer documentos
var tabla = document.getElementById('listarUsuario');
db.collection("users")
.onSnapshot((querySnapshot) => {
tabla.innerHTML = '';
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().email}`);
    tabla.innerHTML += `
    <tr>
  
    <td>${doc.data().name}</td>
    <td>${doc.data().email}</td>

    <td><button class="btn btn-danger" onclick="eliminaruser('${doc.id}')">Eliminar</button></td>
    <td><button class="btn btn-warning" onclick="editarUser('${doc.id}','${doc.data().name}')">Editar</button></td>
    <td><button class="btn pt btn-danger" onclick="reiniciarUserPassword('${doc.id}','${doc.data().email}')">Resetear Password</button></td>

    </tr>
    `
});
});

//borrar documentos
function eliminaruser(id){
    db.collection("users").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function editarUser(id,nombre){

    document.getElementById('name').value = nombre;
 
    var boton = document.getElementById('boton');
    boton.innerHTML = 'Terminar de Editar';


    $("#email_register").attr("disabled", true);
    $("#contrasena_register").attr("disabled", true);
   
    

  
    boton.onclick = function(){
        var washingtonRef = db.collection("users").doc(id);

        var nombre = document.getElementById('name').value; 



        return washingtonRef.update({
             name: nombre 
        })
        .then(function() {
            console.log("Document successfully updated!");
            boton.innerHTML = 'Guardar';
            document.getElementById('email_register').value = '';
            document.getElementById('name').value = '';
            document.getElementById('contrasena_register').value = '';
            
       
          
          
            $("#email_register").attr("disabled", false);
            $("#contrasena_register").attr("disabled", false);

           
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
    console.log("Editar")
}

function reiniciarUserPassword(id,email){
    
    var auth = firebase.auth();
 
    auth.sendPasswordResetEmail(email).then(function() {
       console.log("Enviando Correctamente "+email);
    }).catch(function(error) {
       console.log("Error al enviar");
    });
 
    console.log("Click en reinicar Password");
}

function observador(){
// .orderByChild("email").equalTo(user.email)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
              
            console.log('existe usuario activo '+user.email)
            var displayName = user.displayName;
            var email = user.email;
            document.getElementById("usuario").innerHTML = "Hola "+user.email;
            var URLactual = window.location;
         
            console.log('*****************');
            console.log(user.emailVerified)
            console.log('*****************');

            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
           // location.href ="http://localhost/SoatRicardo/Curso%20Firebase/APP_1/menu.html";
          // ...
        } else {
          // User is signed out.
          console.log('no existe usuario activo')
          document.getElementById("usuario").innerHTML = "Hola Anónimo";
          var URLactual = window.location.href;
          let url_condition = URLactual.substr(0,17);

          var url_redi_local = 'http://localhost/WebSoat/';
                                
          var url_redi_remote = 'https://juanvaldemar.github.io/WebSoat/';

           if(url_condition == "http://localhost/"){
              console.log("Test"); 
              location.href= url_redi_local;
            }else{
             console.log("Producción")
             location.href= url_redi_remote;
            }

          // ...
        }
      });
}
observador();

var maxHeight = 400;

$(function(){

    $(".dropdown > li").hover(function() {
    
         var $container = $(this),
             $list = $container.find("ul"),
             $anchor = $container.find("a"),
             height = $list.height() * 1.1,       // make sure there is enough room at the bottom
             multiplier = height / maxHeight;     // needs to move faster if list is taller
        
        // need to save height here so it can revert on mouseout            
        $container.data("origHeight", $container.height());
        
        // so it can retain it's rollover color all the while the dropdown is open
        $anchor.addClass("hover");
        
        // make sure dropdown appears directly below parent list item    
        $list
            .show()
            .css({
                paddingTop: $container.data("origHeight")
            });
        
        // don't do any animation if list shorter than max
        if (multiplier > 1) {
            $container
                .css({
                    height: maxHeight,
                    overflow: "hidden"
                })
                .mousemove(function(e) {
                    var offset = $container.offset();
                    var relativeY = ((e.pageY - offset.top) * multiplier) - ($container.data("origHeight") * multiplier);
                    if (relativeY > $container.data("origHeight")) {
                        $list.css("top", -relativeY + $container.data("origHeight"));
                    };
                });
        }
        
    }, function() {
    
        var $el = $(this);
        
        // put things back to normal
        $el
            .height($(this).data("origHeight"))
            .find("ul")
            .css({ top: 0 })
            .hide()
            .end()
            .find("a")
            .removeClass("hover");
    
    });  
    
});




