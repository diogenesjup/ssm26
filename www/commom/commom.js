

// Função para filtrar as categorias
function filtrarCategorias() {

   // Pegando os valores de categoria1 e categoria2 da localStorage
let categoria1 = localStorage.getItem('categoria1'); // Supondo que os valores estão salvos como string na localStorage
let categoria2 = localStorage.getItem('categoria2');


    let isChecked = document.getElementById('toggleSwitch').checked;

    // Seleciona todas as divs .caixa-destaque-servicos
    let divs = document.querySelectorAll('.caixa-destaque-servicos');

    // Se o switch estiver ativado
    if (isChecked) {
        divs.forEach(function(div) {
            let categoria = div.getAttribute('data-categoria');

            // Verifica se a categoria da div é igual a categoria1 ou categoria2
            if (categoria === categoria1 || categoria === categoria2) {
                div.style.display = 'block'; // Exibe a div
            } else {
                div.style.display = 'none'; // Oculta a div
            }
        });
    } else {
        // Se o switch estiver desativado, todas as divs ficam visíveis
        divs.forEach(function(div) {
            div.style.display = 'block'; // Exibe todas as divs
        });
    }
}

// Adiciona o evento ao switch para detectar quando ele for ativado/desativado
//document.getElementById('toggleSwitch').addEventListener('change', filtrarCategorias);



            // COMO FAZER A CHAMADA NO FORMULÁRIO onSubmit="return ajaxSubmit(this);"
            var ajaxSubmit = function(form) {
                // fetch where we want to submit the form to
                var url = $(form).attr('action');
                var flag = 9;

                var data = $(form).serializeArray();

                // setup the ajax request
                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    type:'POST'
                });

                swal("Obrigado!", 'Sua mensagem foi enviada com sucesso', "success");

                return false;
            }


            

          // SE O USUÁRIO FIZER UM GESTURE PARA A PARTE INFERIOR DA PÁGINA
          // VAMOS FECHAR A LAYER DO CARRO, CASO ELA ESTEJA ABERTA

          $("#swipeAviso").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-avisos .aviso").css("bottom","-300%");
                $(".modal-avisos").fadeOut(500);

              }

            }
          });
          
          $("#swipemeConfirmacao").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                $(".modal-confirmacao").fadeOut(500);

              }

            }
          });



            /* FUNÇÃO GERAL PARA EXIBIR OS AVISOS DO PÁGINA */
            function aviso(titulo,mensagem){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-avisos").fadeIn(100);

              $(".modal-avisos .aviso").css("bottom","0");


              // ALIMENTAR O HTML
              $(".modal-avisos .aviso h3").html(titulo);
              $(".modal-avisos .aviso p").html(mensagem+'<p style="padding-top:12px;padding-left:0px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
              
              //setTimeout("fecharAviso()",12000);


            }
            function fecharAviso(){
              
              $(".modal-avisos .aviso").css("bottom","-300%");
              $(".modal-avisos").fadeOut(500);

            }

            /* FUNÇÃO GERAL PARA EXIBIR CONFIRMAÇÕES DE AÇÕES */
            function confirmacao(titulo,mensagem,funcaoConfirmacao,textoConfirmacao){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-confirmacao").fadeIn(100);

              $(".modal-confirmacao .confirmacao").css("bottom","0");

              // ALIMENTAR O HTML
              $(".confirmacao h3").html(titulo);
              $(".confirmacao p").html(mensagem);

              $(".confirmacao #acaoConfirmacao").attr("onclick",funcaoConfirmacao+"; fecharConfirmacao();");
              if(textoConfirmacao!=""){
                $(".confirmacao #acaoConfirmacao").html(textoConfirmacao);
              }
              

            }
            function fecharConfirmacao(){

                 $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                 $(".modal-confirmacao").fadeOut(500);

            }







// FORMULARIO FLUTUANTE onclick="ativarFormularioFlutuante('','')"
function ativarFormularioFlutuante(campoParaPreenchimento,labelPreenchimento){

   $(".input-flutuante-acessibilidade").fadeIn(500);
   //$(".barra-navegacao").hide(0);

   $("#fieldInputFlutuante").val($(campoParaPreenchimento).val());

   localStorage.setItem("campoParaPreenchimento",campoParaPreenchimento);

   $("#fieldInputFlutuante").focus();
   $('.input-flutuante-acessibilidade label').html(labelPreenchimento);

}

function validarFormularioFlutuante(event){

    event.preventDefault();

    var fieldInputFlutuante = $("#fieldInputFlutuante").val();
    
    $(".input-flutuante-acessibilidade").fadeOut(500);
    //$(".barra-navegacao").show(0);

    $(localStorage.getItem("campoParaPreenchimento")).val(fieldInputFlutuante);

}

// GARANTIR O FECHAMENTO DO CAMPO QUANDO A TELA VOLTAR AO NORMAL

$(document).ready(function() {
  var _originalSize = $(window).width() + $(window).height()
  $(window).resize(function() {
    if ($(window).width() + $(window).height() == _originalSize) {
      console.log("keyboard active "+_originalSize);
      $(".input-flutuante-acessibilidade").fadeOut(500);
      //$(".barra-navegacao").show(0);
    }
  });
});

// ABRIR URL`s EXTERNAS`
function abrirUrl(url){

  cordova.InAppBrowser.open(url, '_blank', 'location=yes,hidden=no,hardwareback=no');

}




     // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS
     function uploadLocal(){

         console.log("ENTRAMOS!");
         //var files = $(this)[0].files;
         
         /* Efetua o Upload */
         $('.fileForm').ajaxForm({
          dataType:  'json',
          success:   processJson 
        
         }).submit();

     }
     function processJson(dados) { 
            // 'data' is the json object returned from the server 
            console.log("%c RETORNO SOBRE O ENVIO DAS IMAGENS (UPLOAD):","background:#ff0000;color:#fff;");
            console.log(dados); 
            
            if(dados.erros===null){
            
                console.log("NENHUM ERRO!");

            }else{
              
              $(".retorno-upload").html('<div class="alert alert-danger">'+dados.erros+'</div>');              

            }

            $('.fileForm').resetForm();

        }
      // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS



      // UPLOAD DE IMAGENS USANDO CAMERA ANDROID
      /* ######### FUNÇÕES USO DE CAMERA SELFIE #########  */
      var minhaImagem;
      var controleFotoEnviada = 1;
      var tipoArquivo = "nenhum";

      function initCameraSelfie(){ // CHAMAR ESSA FUNCAO PARA INICIALIZAR A CAMERA

               minhaImagem;
               controleFotoEnviada = 1;
               
               tipoArquivo = "camera";

               console.log("INICIANDO FUNÇÃO PARA INICIALIZAR A CAMERA SELFE");

              // SCRIPTS DA CAMERA                                 

                              controleFotoEnviada = 2;
                              console.log("CONTROLE FOTO ENVIADA ATUALIZADA");
                              
                              console.log("INICIALIZANDO A CAMERA");
                              $("#retornoMsgSelfie").html("inicializando a câmera para a selfie");
                              navigator.camera.getPicture(onSuccess2, onFail2, {
                                  quality: 50,
                                  destinationType: Camera.DestinationType.DATA_URL
                              });

                              function onSuccess2(imageData) {
                                  console.log("CAMERA INICIALIZADA COM SUCESSO");
                                  $("#retornoMsgSelfie").html("Imagem capturada com sucesso!");
                                  var image = document.getElementById('fotoDestinoSelfie');
                                  image.style.display = 'block';
                                  image.src = "data:image/jpeg;base64," + imageData;

                                  minhaImagem = imageData;

                                  //$(".perfil-banner .foto-perfil").css("background","url('data:image/jpeg;base64,"+imageData+"')");
                                  //$(".perfil-banner .foto-perfil").css("background-size","cover");
                                  //$(".perfil-banner .foto-perfil").css("background-position","center center");
                                  //localStorage.setItem("parametroFoto",1);

                                  $('.btn-action-foto').attr('onclick',"uploadMyImageSelfie()");

                              }

                              function onFail2(message) {
                                  console.log("CAMERA NÃO FUNCIONOU");
                                  $("#retornoMsgSelfie").html("Não possível obter a imagem da sua câmera, tente novamente. "+message);
                                  console.log('### MOTIVO FALHA DE ACESSO A CÂMERA: ' + message);
                              }                           

              document.addEventListener("deviceready", function () {  
              //alert("Phonegap");                                                                                        
              }, false); 

      }

      function uploadMyImageSelfie(){

                    console.log("INICIANDO FUNÇÃO PARA FAZER UPLOAD DA IMAGEM");
         
                                          if(controleFotoEnviada == 2){

                                                  $('.btn-action-foto').html("processando...");

                                                  var cadastroEmail = localStorage.getItem("idUsuario");
                                                  
                                                  $.ajax({
                                                    type: "POST",
                                                    url: app.urlApi+'upload-selfie-camera.php?idUsuario='+idUsuario,
                                                    data: { img_data:minhaImagem},
                                                    cache: false,
                                                    contentType: "application/x-www-form-urlencoded",
                                                    success: function (result) {
                                                      
                                                      $('#sendFileSelfie').html("ATUALIZAR IMAGEM");      
                                                      aviso("Foto de perfil atualizada com sucesso","Obrigado por manter o seu perfil atualizado!");
                                                      editarPerfil(); 

                                                      minhaImagem = "";
                                                      controleFotoEnviada = 1;
                                                      tipoArquivo = "nenhum";                                        

                                                    },
                                                    fail: function(result){
                                                      aviso("Oops! Algo deu errado, tente novamente",result);
                                                    }
                                                  });   

                                              }else{

                                                  aviso('Oops! Você não selecionou nenhuma imagem','Você não selecionou ou tirou nenhuma foto.');
                                                  $('.btn-action-foto').html("ATUALIZAR IMAGEM");

                                              }

}



function copiarCodigoPix(){

  // Cria um elemento textarea temporário
  var textArea = document.createElement("textarea");
            
  // Define o valor do textarea para o conteúdo do span
  textArea.value = document.querySelector('#codigoPix').value;
  
  // Adiciona o textarea ao DOM
  document.body.appendChild(textArea);
  
  // Seleciona o conteúdo do textarea
  textArea.select();
  
  // Copia o texto selecionado para a área de transferência
  document.execCommand('copy');
  
  // Remove o textarea do DOM
  document.body.removeChild(textArea);
  
  // (Opcional) Mostra uma mensagem para o usuário
  alert('Código copiado com sucesso!');

}



