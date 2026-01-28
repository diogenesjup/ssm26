class Models{
    
    // TESTAR A DISPONIBILIDADE DA API
    testeApi(){

    	      // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"testeapi",
                  data:{token:app.token}
              
              })
              request.done(function (dados) {            

                  console.log("%c VERIFICAÇÃO DE DISPONIBILIDADE DE API","background:#ff0000;color:#fff;");
                  console.log(dados);

                  // SALVAR NA MEMÓRIA AS CATEGORIAS
                  localStorage.setItem("herancaCategorias",JSON.stringify(dados.categorias));
                  localStorage.setItem("categoiasAtendimento",JSON.stringify(dados.categorias));

              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (apiAtiva)");
                   console.log(app.urlApi);
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }
    
    // PROC LOGIN
    procLogin(){
       
       event.preventDefault();

       $("#btnLoginEmailSenha").html("Carregando...");

       var loginUsuario = $("#loginUsuario").val();
       var loginSenha = $("#loginSenha").val();

            // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"login-api",
                  data:{token:app.token,tokenSms:app.tokenSms,loginUsuario:loginUsuario,loginSenha:loginSenha}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO LOGIN 2","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnLoginEmailSenha").html("Login");
                  
                  if(dados.sucesso=="200"){

                    console.log(dados);

                    var dadosUsuario = JSON.stringify(dados);
                     
                     //localStorage.setItem("dadosUsuario",dadosUsuario);
                     //app.login(dados.id,dados.email,dadosUsuario);

                     localStorage.setItem("dadosUsuario",dadosUsuario.dados);
                     
                    
                     localStorage.setItem("categoria1",dados.categoria);
                     localStorage.setItem("categoria2",dados.categoria_2);
                     
                     localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));

                     localStorage.setItem("nomeUsuario",dados.nome);

                     localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                     localStorage.setItem("emailUsuario",dados.email);
                     localStorage.setItem("celularUsuario",dados.celular);

                     app.login(dados.id_usuario,loginUsuario,dadosUsuario.dados);

                  
                  }else{

                     $(".form-control").val("");
                     aviso("Oops! Login ou senha não encontrados","Verifique os dados inseridos e tente novamente!");
                     
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // PROC LOGIN SMS
    procLoginSms(){
       
       event.preventDefault();

       $("#btnViewLogin").html("Carregando...");

       var loginUsuario = $("#loginUsuario").val();

	          // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"token-sms-login",
                  data:{token:app.token,tokenSms:app.tokenSms,loginUsuario:loginUsuario}
              
              })
              request.done(function (dados) {          

                  $("#btnViewLogin").html("Próximo");  

                  console.log("%c RETORNO DO LOGIN","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                  	 
                  	 //localStorage.setItem("dadosUsuario",dadosUsuario);
                  	 //app.login(dados.id,dados.email,dadosUsuario);

                     app.verificarCodigoSms();
                  
                  }else{
                     
                     //$(".form-control").val("");
                     //aviso("Oops! Login ou senha não encontrados","Verifique os dados inseridos e tente novamente!");
                     
                     // SE O CELULAR NAO ESTIVER CADASTRADO
                     // VAMOS DIRECIONAR O USUÁRIO PARA CONCLUIR O CADASTRO
                     
                     // SALVAR O CELULAR PARA O CADASTRO
                     localStorage.setItem("celularCadastro",loginUsuario);

                     app.cadastro();

                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // VERIFICAR O CÓDIGO SMS ENVIADO PELO USUÁRIO
    verificarCodigoSms(){

      event.preventDefault();

      $("#btnConfirmarCodigo").html("Processando...");

       var codigoSms = $("#codigoSms").val();

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"verificar-sms",
                  data:{token:app.token,codigoSms:codigoSms}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DA VERIFICACAO DO CODIGO DE SMS","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);

                  $("#btnConfirmarCodigo").html("Confirmar código");
                  
                  if(dados.sucesso=="200"){
                     
                     localStorage.setItem("dadosUsuario",dados.usuarios[0].data);

                     localStorage.setItem("categoria1",dados.categoria);
                     localStorage.setItem("categoria2",dados.categoria_2);
                     
                     localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));

                     localStorage.setItem("nomeUsuario",dados.nome);

                     localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                     localStorage.setItem("emailUsuario",dados.email);
                     localStorage.setItem("celularUsuario",dados.celular);

                     app.login(dados.id_usuario,dados.email,dados.usuarios[0].data);
                  
                  
                  }else{
                     
                     $(".form-control").val("");
                     aviso("Oops! Código incorreto","Verifique o código recebido e tente novamente. Se ainda tiver dificuldades, tente entrar com o e-mail e senha.");
                     
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (verificarCodigoSms)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }





    // PROC CADASTRO
    procCadastro(){

      event.preventDefault();

      $("#btnViewCadastro").html("Carregando...");
       
      var cadastroNome    = $("#cadastroNome").val();
      var cadastroEmail   = $("#cadastroEmail").val();
      var cadastroSenha   = $("#cadastroSenha").val();
      var cadastroCPF     = $("#cadastroCPF").val();
      var cadastroCelular = localStorage.getItem("celularCadastro");

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"cadastro-usuarios",
                  data:{token:app.token,cadastroCelular:cadastroCelular,cadastroNome:cadastroNome,cadastroEmail:cadastroEmail,cadastroSenha:cadastroSenha,cadastroCPF:cadastroCPF}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO CADASTRO","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnViewCadastro").html("Cadastrar");

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                      localStorage.setItem("dadosUsuario",dadosUsuario);
                      localStorage.setItem("nomeUsuario",dados.nome);
                      localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));
                      localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                      localStorage.setItem("emailUsuario",dados.email);
                      localStorage.setItem("celularUsuario",dados.celular);

                      localStorage.setItem("saldoPrestadorServico",dados.saldo_chaves);
  
                      // SE DEU TUDO CERTO, VAMOS LOGAR O USUÁRIO
                      app.login(dados.id,dados.email,dadosUsuario);

                      aviso("Bem vindo!","Seu cadastro foi realizado com sucesso, você já pode aproveitar as vantagens do nosso aplicativo.")
                       
                  
                  }else{
                     
                     aviso("Oops! Esse e-mail já está cadastrado na nossa plataforma","Verifique os dados inseridos e tente novamente! Caso tenha esquecido sua senha, clique no link \"Esqueci Senha\" na tela de login.");
                  
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procCadastro)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }


    procResetSenha(){

              event.preventDefault();

              $("#btnViewResetarSenha").html("Processando...");
               
              var resetEmail = $("#resetEmail").val();

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"reset-senha",
                  data:{token:app.token,resetEmail:resetEmail}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO RESET","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnViewResetarSenha").html("Resetar senha");

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                     app.viewLogin();
                     aviso("Deu certo! Senha resetada","Enviamos para o seu e-mails instruções sobre o reset de senha.");
                     $("#btnViewResetarSenha").html("Resetar senha");

                  }else{
                     
                     aviso("Oops! E-mail não encontrado","Seu e-mail não foi localizado na plataforma. Verique as informações inseridas e tente novamente.");
                  
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (ResetDeSenha)");
                   console.log(dados);
                   $("#btnViewResetarSenha").html("Resetar senha");
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX


    }






/**
*  ------------------------------------------------------------------------------------------------
*
*
*   EDITAR ACESSO USUARIO PERFIL LOGADO
*
*
*  ------------------------------------------------------------------------------------------------
*/
    editarPerfil(){

      var idUsuario = localStorage.getItem("idUsuario");

      let xhr = new XMLHttpRequest();
       
      /* CONFIGURAÇÕES */
      //xhr.open('GET', app.urlApi+'admin-editarPerfil.php');
      xhr.open('POST', app.urlApi+'editar-perfil',true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      var params = 'idUsuario='+idUsuario+"&token="+app.token;

      /*

        Então, quais são os estados possíveis de um requisição AJAX? Listaremos abaixo os estados:
        0: requisição ainda não iniciada
        1: conexão com o servidor estabelecida
        2: requisição recebida
        3: processando requisição
        4: requisição está concluída e a resposta está pronta
        O estado 4 é o que mais nos interessa, porque é nele que temos acesso à resposta enviada pelo servidor.

      */
      
      xhr.onreadystatechange = () => {
          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS RETORNADOS EDITAR PERFIL");
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);

                  if(dados.sucesso==200){

                    $(".placeholder").hide(0);
                    $(".form").fadeIn(500);
                    
                    $("#editarPerfilNome").val(dados.nome);
                    $("#editarPerfilEmail").val(dados.dados[0].user_email);
                    $("#editarPerfilCelular").val(dados.celular);
                    
                    // CARREGAR MASCARAS
                    app.helpers.carregarMascaras();

                  }else{
                    
                    aviso("Oops! Algo deu errado!","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos.");

                  }


            }else{
              
              console.log("SEM SUCESSO editarPerfil()");
              console.log(JSON.parse(xhr.responseText));

            }

          }
      };

      /* EXECUTA */
      xhr.send(params);


    }
    
    
    procEditarPerfil(){
        
        $("#btnEditar").html("Processando...");
        $(".form-control").attr("readonly","true");

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formEditarPerfil').formSerialize();
        var idUsuario = localStorage.getItem("idUsuario");
       
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'proc-editar-perfil',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&"+dados;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("OPERAÇÃO REALIZADA COM SUCESSO");
              console.log(JSON.parse(xhr.responseText));
              aviso("Deu certo!","As informações foram atualizadas.");

            }else{
              
              console.log("SEM SUCESSO procEditarPerfil()");
              console.log(JSON.parse(xhr.responseText));

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

      $("#btnEditar").html("Atualizar");
      $(".form-control").removeAttr("readonly");


    }

/**
*  ------------------------------------------------------------------------------------------------
*
*
*   BUSCAR AS CATEGORIAS DE ATENDIMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
categoriasAtendimento(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'categorias-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("BUSCA DAS CATEGORIAS DE ATENDIMENTO");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              // SALVAR AS CATEGORIAS NA MEMORIA
              localStorage.setItem("categoiasAtendimento",JSON.stringify(dados));

              $("#listaDeCategorias").html(`

                  ${dados.categorias.map((n) => {

                      if(n.relacao.length==0){

                              return `
                                  
                                 <li>
                                     <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso2(${n.id},'${n.titulo}')" title="${n.titulo}">
                                      ${n.titulo} <img src="assets/images/right.svg" alt="Ver mais">
                                     </a>
                                  </li>

                              `
                       }

                       }).join('')}

              `);
              

            }else{
              
              console.log("SEM SUCESSO categoriasAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}


/**
*  ------------------------------------------------------------------------------------------------
*
*
*   ENVIAR O ATENDIMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
enviarAtendimento(){

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formularioNovoAtendimento').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");
        var nomeCompletoUsuario = localStorage.getItem("nomeCompletoUsuario");
        var emailUsuario = localStorage.getItem("emailUsuario");
        var celularUsuario = localStorage.getItem("celularUsuario");

        var nomeCategoriaAtendimento = localStorage.getItem("nomeCategoriaAtendimento");
        var idCategoriaAtendimento = localStorage.getItem("idCategoriaAtendimento");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'enviar-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     '&nomeCompletoUsuario='+nomeCompletoUsuario+ 
                     '&emailUsuario='+emailUsuario+ 
                     '&celularUsuario='+celularUsuario+ 
                     '&dados='+dados+ 
                     '&nomeCategoriaAtendimento='+nomeCategoriaAtendimento+ 
                     '&idCategoriaAtendimento='+idCategoriaAtendimento+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR ATENDIMENTO");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);
              aviso("Deu certo!","Você receberá em breve orçamentos vindos dos nossos parceiros!");
              app.opcoesCarretamentoPerfilCliente();

            }else{
              
              console.log("SEM SUCESSO enviarAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
             
              $("#btnEnviarSolicitacao").html("Enviar informações");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


/**
*  ------------------------------------------------------------------------------------------------
*
*
*   ORÇAMENTOS DISPONÍVEIS DENTRO DO APP (PROFISSIONAIS)
*
*
*  ------------------------------------------------------------------------------------------------
*/
orcamentosDisponiveis(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'orcamentos-abertos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ATENDIMENTOS EM ABERTO");
              console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              localStorage.setItem("saldoPrestadorServico",dados.saldo_usuario);

              $("#saldoAtualUsuarioHeader").html(dados.saldo_usuario);

              if(dados.saldo_usuario==""||dados.saldo_usuario==0||dados.saldo_usuario<0){

                  confirmacao(`Você está sem ${app.nomeMoedaPlural}`,`Para desbloquear e visualizar os orçamentos, você precisa ter comprado algum pacote de ${app.nomeMoedaPlural}. Deseja fazer isso agora?`,"app.comprarChaves()","Comprar agora");

              }

              console.log("COMECANDO A IMPRIMIR OS ORCAMENTOS NA TELA:");

              localStorage.setItem("orcamentosHeranca",JSON.stringify(dados.orcamentos));

              $("#listaDeOrcamentosDISABLED").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="nao"){

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos" data-categoria="${n.nome_categoria}">
                                   
                                     <div class="header-autor">

                                         <h3>
                                            <img src="assets/images/perfil.png" style="opacity:0.5;border-radius: 100%;" alt="Foto Perfil" />
                                            ${n.nome_do_cliente}
                                            <small>
                                               <p>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                               </p>
                                               Área de atendimento: ${n.regiao}
                                            </small>
                                         </h3>

                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>${n.descricao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},${n.nome_categoria});" title="DESBLOQUEAR" class="btn btn-primary">
                                              DESBLOQUEAR <span><img src="assets/images/simbolo.svg" /> ${n.valor_chaves_para_desbloqueio}</span>
                                          </a>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->


                              `

                          }


                       }).join('')}

              `);

              // LOOP CATEGORIAS
              var categs = JSON.parse(localStorage.getItem("herancaCategorias"));
              
              $("#loopDeCategoriasJobs").append(`

                      ${categs.map((c) => {

                          return `

                              <div 
                                  class="novo-listing-dashboard-job-option" 
                                  data-id="${c.id}" 
                                  data-nome="${c.titulo}" 
                                  onclick="app.listagemNovaBlocada();">
                                  ${c.titulo}
                              </div>
                          
                          `;

                      }).join('')}  
                
              `);

              // INSERIR OS ORÇAMENTOS
              $("#listaDeOrcamentos").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="nao"){

                              return `
                                  
                                      <!-- ORÇAMENTO -->
                                      <div 
                                        class="novo-listing-dashboard-job-card" 
                                        id="anuncio${n.id}" 
                                        data-categoria="${n.nome_categoria}"
                                      >
                                             <h3 class="novo-listing-dashboard-job-title">
                                                ${n.titulo_origin}
                                             </h3>
                                             <div class="novo-listing-dashboard-job-details">
                                                <!--
                                                <div class="novo-listing-dashboard-job-location">
                                                   <i class="fa-solid fa-location-dot novo-listing-dashboard-detail-icon"></i>
                                                </div>
                                                -->
                                                <div class="novo-listing-dashboard-job-type">
                                                   <i class="fa-regular fa-clock novo-listing-dashboard-detail-icon"></i>
                                                   ${n.titulo_origin}
                                                </div>
                                             </div>
                                             <p class="novo-listing-dashboard-job-description">
                                                ${n.descricao}<br>
                                                <b>Cliente:</b> ${n.nome_do_cliente}<br>
                                                <b>Requisitos:</b> ${n.requisitos}<br>
                                                <b>Área de atendimento:</b> ${n.regiao}
                                             </p>
                                             <button 
                                               class="novo-listing-dashboard-apply-button"
                                               onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},${n.nome_categoria});" 
                                             >
                                                 Desbloquear
                                              </button>
                                      </div>
                                      <!-- ORÇAMENTO -->

                              `
                          }

                       }).join('')}

              `);


              // INSERIR OS ORÇAMENTOS COM ORDEM ALEATÓRIA
              $("#listaDeOrcamentosRecentes").html(`
                  ${dados.orcamentos
                    // Primeiro, cria uma cópia do array para não modificar o original
                    .slice()
                    // Depois, embaralha o array usando o algoritmo Fisher-Yates
                    .sort(() => Math.random() - 0.5)
                    .map((n) => {
                      // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                      if(n.desblock=="nao"){
                        return `
                          <!-- ORÇAMENTO -->
                          <div 
                            class="novo-listing-dashboard-job-card" 
                            id="anuncio${n.id}" 
                            data-categoria="${n.nome_categoria}"
                          >
                            <h3 class="novo-listing-dashboard-job-title">
                              ${n.titulo_origin}
                            </h3>
                            <div class="novo-listing-dashboard-job-details">
                              <!--
                              <div class="novo-listing-dashboard-job-location">
                                <i class="fa-solid fa-location-dot novo-listing-dashboard-detail-icon"></i>
                                ${n.nome_do_cliente}
                              </div>
                              -->
                              <div class="novo-listing-dashboard-job-type">
                                <i class="fa-regular fa-clock novo-listing-dashboard-detail-icon"></i>
                                ${n.titulo_origin}
                              </div>
                            </div>
                            <p class="novo-listing-dashboard-job-description">
                              ${n.descricao}<br>
                              <b>Cliente:</b> ${n.nome_do_cliente}<br>
                              <b>Requisitos:</b> ${n.requisitos}<br>
                              <b>Área de atendimento:</b> ${n.regiao}
                            </p>
                            <button 
                              class="novo-listing-dashboard-apply-button"
                              onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},'${n.nome_categoria}');" 
                            >
                              Desbloquear
                            </button>
                          </div>
                          <!-- ORÇAMENTO -->
                        `
                      }
                      return ''; // Retorna string vazia para casos onde desblock != "nao"
                    })
                    .join('')}
              `);


              // INIT CARROSSEL
              $('.novo-listing-dashboard-best-matches-carousel').owlCarousel({
                  loop: true,
                  center: false,
                  margin: 12,
                  nav: false,
                  dots: false,
                  stagePadding: 0,
                  responsive: {
                      0: {
                          items: 1.5
                      }
                  }
              });
              
              // Initialize Categories carousel
              $('.novo-listing-dashboard-categories-carousel').owlCarousel({
                  loop: true,
                  center: false,
                  margin: 12,
                  nav: false,
                  dots: false,
                  stagePadding: 0,
                  responsive: {
                      0: {
                          items: 1.5
                      }
                  }
              });
              
              // Job type selection
              $('.novo-listing-dashboard-job-option').on('click', function() {
                  $('.novo-listing-dashboard-job-option').removeClass('active');
                  $(this).addClass('active');
              });
              

            }else{
              
              console.log("SEM SUCESSO orcamentosDisponiveis()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


// CARREGAR OS ORCAMENTOS QUE O PROFISSIONAL JÁ TEM DESBLOQUEADO
orcamentosDisponiveisDesbloqueados(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'orcamentos-abertos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ATENDIMENTOS DESBLOQUEADOS PELO PROFISSIONAL");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              localStorage.setItem("saldoPrestadorServico",dados.saldo_usuario);

              $("#saldoAtualUsuarioHeader").html(dados.saldo_usuario);

              console.log("COMECANDO A IMPRIMIR OS ORCAMENTOS NA TELA:");

              $("#listaDeOrcamentos").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="sim"){

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos">
                                   
                                     <div class="header-autor">

                                         <h3>
                                            <img src="assets/images/perfil.png" style="opacity:0.5;border-radius: 100%;" alt="Foto Perfil" />
                                            ${n.nome_do_cliente}
                                            <small>
                                               <p>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                               </p>
                                               Área de atendimento: ${n.regiao}
                                            </small>
                                         </h3>

                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>${n.descricao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                          <p>
                                             Você <b>já desbloqueou</b> esse orçamento!
                                          </p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick='app.views.viewDetalheAnuncio(${n.id},1)' title="VER DETALHES" style="text-align:center;" class="btn btn-primary">
                                              VER DETALHES
                                          </a>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->


                              `

                          }


                       }).join('')}

              `);

              

            }else{
              
              console.log("SEM SUCESSO orcamentosDisponiveisDesbloqueados()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



/**
*  ------------------------------------------------------------------------------------------------
*
*
*   DETALHE DE UM ATENDIMENTO EM ESPECIFICO
*
*
*  ------------------------------------------------------------------------------------------------
*/
carregarDetalheAtendimento(idAnuncio,acao){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var nomeCompletoUsuario = localStorage.getItem("nomeCompletoUsuario");
         
        xhr.open('POST', app.urlApi+'detalhe-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idanuncio="+idAnuncio+
                     "&nomeCompletoUsuario="+nomeCompletoUsuario+
                     "&acao="+acao;

        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DETALHE DO ATENDIMENTO:");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              $("#nomeCliente").html(`${dados.orcamentos[0].nome_do_cliente}`);
              $("#subTituloAnuncio").html(`${dados.orcamentos[0].quando}`);
              $("#descAnuncio").html(`Descrição: ${dados.orcamentos[0].descricao}`);
              $("#localAnuncio").html(`Local do atendimento: ${dados.orcamentos[0].regiao}`);
              $("#requisitosAnuncio").html(`Requisitos: ${dados.orcamentos[0].requisitos}`);
              $("#dataAnuncio").html(`${dados.orcamentos[0].data_criacao}`);
              $("#formaContaAnuncio").html(`Forma de contato: ${dados.orcamentos[0].forma_de_contato}`);
              $("#contatoTelefone").html(`${dados.orcamentos[0].celular}`);
              $("#contatoEmail").html(`${dados.orcamentos[0].e_mail}`);

              $(".body-autor h4").html(`${dados.orcamentos[0].titulo_origin}`);

              let celularLimpo = dados.orcamentos[0].celular.replace(/\D/g, '');

              $("#actionLigacao").attr("href",`tel:${celularLimpo}`);
              $("#actionWhatsApp").attr("href",`https://api.whatsapp.com/send?l=pt_BR&phone=55${celularLimpo}`);

            }else{
              
              console.log("SEM SUCESSO carregarDetalheAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}

/**
*  ------------------------------------------------------------------------------------------------
*
*
*   PAGAMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
pacoteChaves(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");

        let temp = 0;
        let resultado = 0;
        var checked = "checked";

        xhr.open('POST', app.urlApi+'pacotes-chaves',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("PACOTES DISPONÍVEIS PARA COMPRA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS PACOTES NA TELA:");

              $("#appendPacotes").html(`

                  ${dados.pacotes.map((n) => {

                              temp++;
                              if(temp>1){ checked = ""; }

                              resultado = n.valor_blr / 4;

                              return `
                                  
                                 <!-- PACOTE -->
                                 <div class="form-check">
                                    <input class="form-check-input" type="radio" name="pacote" id="pacote${temp}" value="${n.qtd_chaves}" ${checked}>
                                    <label class="form-check-label" for="pacote${temp}">
                                      <img src="assets/images/simbolo.svg" alt="Comprar ${n.qtd_chaves} Chaves" />  
                                      ${n.qtd_chaves} ${app.nomeMoedaPlural}
                                      <small>À vista por R$ ${n.valor_blr.replace(".",",")}<br>Validade de ${n.validade_dias} dias</small>
                                      <span>
                                        <d>ou em até 4X de</d>
                                        R$ ${resultado.toFixed(2).replace(".",",")}
                                      </span>
                                    </label>
                                 </div>
                                 <!-- PACOTE -->

                              `

                       }).join('')}

              `);
              

            }else{
              
              console.log("SEM SUCESSO pacoteChaves()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


selecaoPacoteDeChaves(pacoteEscolhido){


  // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");

        let temp = 0;
        let resultado = 0;
        var checked = "checked";

        xhr.open('POST', app.urlApi+'pacotes-chaves',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("BUSCANDO PACOTES DISPONÍVEIS PARA COMPRA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS PACOTES NA TELA:");

              app.views.paginaDeCmopra();

              for(let i = 0;i<dados.pacotes.length;i++){

                    if(pacoteEscolhido==dados.pacotes[i].qtd_chaves){

                        // SALVAR AS OPÇÕES ESCOLHIDAS PELO USUÁRIO 
                        localStorage.setItem("valorPagamento",dados.pacotes[i].valor_blr.replace(".",""));
                        localStorage.setItem("valorPagamentoOriginal",dados.pacotes[i].valor_blr);
                        localStorage.setItem("qtd_chaves",dados.pacotes[i].qtd_chaves);

                        var resultado = dados.pacotes[i].valor_blr / 4;
                        resultado = resultado.toFixed(2).replace(".",",");

                        $("#pacoteEscolhido").html(`

                                 <!-- PACOTE ESCOLHIDO -->
                                 <div class="form-check" style="margin-top: 23px;margin-bottom: 56px;">
                                    <input class="form-check-input" type="radio" name="pacote" id="pacote1" value="${pacoteEscolhido}" checked>
                                    <label class="form-check-label" for="pacote1">
                                      <img src="assets/images/simbolo.svg" alt="Comprar ${pacoteEscolhido} ${app.nomeMoedaPlural}" />  
                                      ${pacoteEscolhido} ${app.nomeMoedaPlural} 
                                      <small>À vista por R$ ${dados.pacotes[i].valor_blr.replace(".",",")}</small>
                                      <span>
                                        <d>ou em até 4X de</d>
                                        R$ ${resultado}
                                      </span>
                                    </label>
                                 </div>
                                 <!-- PACOTE -->

                        `);


                        window.setTimeout(function(){
                            console.log("Iniciando teste de parcelas");
                            console.log(dados.pacotes);
                            // CARREGANDO PARCELAS
                            var j = 1;

                            for(let k = 0;k<4;k++){

                                var divisao = dados.pacotes[i].valor_blr / j;
                                divisao = divisao.toFixed(2).replace(".",",");

                                console.log("DIVISAO: ");
                                console.log(divisao);

                                if(parseInt(divisao)>=5){

                                  console.log("IMPRMINDO VALORES...");

                                  $("#pagtoCCParcelas").append(`
                                      <option value="${j}">${j}x de R$ ${divisao}</option>
                                  `);

                                }

                                j++;

                            }// FINAL DO FOR DE PARCELAS

                            // CONTROLE DO VALOR MINIMO DE PARCELAS
                            if(parseInt(dados.pacotes[i].valor_blr)<=5){

                              $("#pagtoCCParcelas").append(`
                                      <option value="1">1x de R$ ${dados.pacotes[i].valor_blr}</option>
                                  `);

                            }

                          },3000);


                    }

              } // FINAL DO FOR
              

            }else{
              
              console.log("SEM SUCESSO selecaoPacoteDeChaves()");
              console.log(JSON.parse(xhr.responseText));
              
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
              
              $("#btnComprarSelecionado").html("COMPRAR SELECIONADO");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}




payBoleto(){
      
        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formPayBoleto').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");

        //var dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario"));

        var nome = localStorage.getItem("nomeCompletoUsuario");
        var celular = localStorage.getItem("celularUsuario");
        var email = localStorage.getItem("emailUsuario");
        var valorPagamento = localStorage.getItem("valorPagamento");
        var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
        var qtd_chaves = localStorage.getItem("qtd_chaves");

        console.log(nome);
        console.log(celular);
        console.log(email);
       
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'payboleto',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&tokenSms="+app.tokenSms+
                     "&"+dados+
                     "&nome="+nome+
                     "&celular="+celular+
                     "&email="+email+
                     "&valorPagamento="+valorPagamento+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO PAGAMENTO PIX: ");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);

              if(dados.sucesso==200){
                  app.views.dadosBoleto(dados.dados_boleto);

                  // SALVAR AS INFORMAÇÕES DA COMPRA DO USUÁRIO
                  app.models.salvarDadosCompraUsuario(dados.dados_boleto.customer,dados.dados_boleto.id);
                  
              }else{
                  aviso("Oops! Algo deu errado","Tente novamente dentro de alguns minutos. Essa é a mensagem de erro: "+dados.description);
                  app.viewPrincipalProfissional();
              }

              

            }else{
              
              console.log("SEM SUCESSO payBoleto()");
              console.log(xhr.responseText);

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

      $("#btnPayBoleto").html("PAGAR COM BOLETO");



}




payCartaoDeCredito(){

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formPayBoleto').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");

        //var dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario"));

        var nome = localStorage.getItem("nomeCompletoUsuario");
        var celular = localStorage.getItem("celularUsuario");
        var email = localStorage.getItem("emailUsuario");

        var pagtoCCNumero    = $("#pagtoCCNumero").val();
        pagtoCCNumero = pagtoCCNumero.replace("-","");

        var pagtoCCNome      = $("#pagtoCCNome").val();
        var pagtoCCNumeroCPF = $("#pagtoCCNumeroCPF").val();
        
        var pagtoCCValidade  = $("#pagtoCCValidade").val();
        pagtoCCValidade = pagtoCCValidade.split("/");

        var mesValidade = pagtoCCValidade[0];
        var anoValidade = pagtoCCValidade[1];

        var pagtoCCCvv       = $("#pagtoCCCvv").val();

        var valorPagamento = localStorage.getItem("valorPagamento");
        var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
        var qtd_chaves = localStorage.getItem("qtd_chaves");

        var pagtoCCParcelas = $("#pagtoCCParcelas").val();


        console.log(nome);
        console.log(celular);
        console.log(email);
        console.log(pagtoCCNumero);
        console.log(mesValidade);
        console.log(anoValidade);
        console.log(pagtoCCParcelas);
        console.log(app.tokenSms);

        
       
        // CONFIGURAÇÕES AJAX VANILLA
        
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'cartaodecredito',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&tokenSms="+app.tokenSms+
                     "&"+dados+
                     "&nome="+nome+
                     "&celular="+celular+
                     "&email="+email+
                     "&pagtoCCNumero="+pagtoCCNumero+
                     "&pagtoCCNome="+pagtoCCNome+
                     "&pagtoCCNumeroCPF="+pagtoCCNumeroCPF+
                     "&pagtoCCValidade="+pagtoCCValidade+
                     "&mesValidade="+mesValidade+
                     "&anoValidade="+anoValidade+
                     "&pagtoCCCvv="+pagtoCCCvv+
                     "&valorPagamento="+valorPagamento+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves+
                     "&pagtoCCParcelas="+pagtoCCParcelas;

        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO PAGAMENTO CARTAO");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);
              
              // DIRECIONAR PARA QUANDO O PAGAMENTO FOR CONFIRMADO 
              if(dados.sucesso==200 && dados.dados_cobranca_cc.status=="CONFIRMED"){

                  setTimeout(function(){ 
           
                     app.views.dadosCartao(dados.dados_cobranca_cc.invoiceUrl);
                     //app.models.atualizarSaldoCompra();

                     // SALVAR HISTÓRICO DE PAGAMENTO DO USUÁRIO
                     app.models.salvarDadosCompraUsuario(dados.dados_cobranca_cc.customer,dados.dados_cobranca_cc.id);

                  }, 3000);

              // DIRECIONAR PARA QUANDO O PAGAMENTO TIVER DADO PROBLEMA (NÃO AUTORIZADO OU PENDENTE)
              }else{

                setTimeout(function(){ 
           
                     app.views.dadosCartaoPendente(dados.erro);

                  }, 3000);

              }


            }else{
              
              console.log("SEM SUCESSO payCartaoDeCredito()");
              console.log(JSON.parse(xhr.responseText));

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      xhr.send(params);
      
}

// ATUALIZAR O SALDO DO USUÁRIO NA TELA DO APP
atualizarSaldoCompra(){
   
   var saldoAdicionado = localStorage.getItem("qtd_chaves");

   var antigoSaldo = localStorage.getItem("saldoPrestadorServico");

   var saldoAtual = antigoSaldo + saldoAdicionado;

   localStorage.setItem("saldoPrestadorServico",saldoAtual);

   $("#saldoAtualUsuarioHeader").html(saldoAtual);

}



salvarDadosCompraUsuario(customer,id){

      return;

     console.log("SALVAR OS DADOS DO ASAAS NO HISTÓRICO DE PEDIDOS DO CLIENTE");

     var idUsuario = localStorage.getItem("idUsuario");
     var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
     var qtd_chaves = localStorage.getItem("qtd_chaves");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'salvar-dados-compra-usuario',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves+
                     "&customer="+customer+
                     "&id="+id;

        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR INFOS PEDIDO E CLIENTE ASAAS");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

            }else{
              
              console.log("SEM SUCESSO salvarDadosCompraUsuario()");
              console.log(JSON.parse(xhr.responseText));

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      xhr.send(params);


}


duvidasESuporte(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'suporte-e-ajuda',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DE SUPORTE E AJUDA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS SUPORTES NA TELA:");

              $("#itensSuporte").html(`

                  ${dados.itens.map((n) => {

                              return `
                                  
                                 <div class="item-suporte-e-ajuda">
                                  <h3>${n.pergunta}</h3>
                                  <p>${n.resposta}</p>
                                 </div>

                              `

                       }).join('')}

              `);

            }else{
              
              console.log("SEM SUCESSO duvidasESuporte()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


// CARREGAR LISTA DE CURSOS
cursos(){
   
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'lista-cursos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS LISTA DE CURSOS");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS CURSOS NA TELA:");

              // ALIMENTAR OS CURSOS AINDA NAO COMPLETOS OU INICIADOS
              $("#loopCursosLista").html(`

                     ${dados.cursos.map((n) => {

                          if(n.status=="not-started"){

                              return `
                                  
                                 <li onclick="app.detalheCurso(${n.id})">
                                         ${n.titulo}
                                        <small>${n.resumo}</small>
                                 </li>

                              `

                          }

                       }).join('')}

              `);

              // ALIMENTAR OS CURSOS JÁ INICIADOS OU CONCLUIDOS PELO USUÁRIO
              $("#loopCursosListaEmAndamento").html(`

                     ${dados.cursos.map((n) => {

                          if(n.status=="started"){

                              return `
                                  
                                 <li onclick="app.detalheCurso(${n.id})">
                                         ${n.titulo}
                                        <small>${n.resumo}</small>
                                 </li>

                              `

                          }

                       }).join('')}

              `);




            }else{
              
              console.log("SEM SUCESSO cursos()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



// CARREGAR DETALHE DO CURSO
detalheCurso(idCurso){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'detalhe-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR DETALHES DO CURSO NA TELA:");

              // ALIMENTAR O HTML COM AS INFOS BASICAS DO CURSO
              $("#nomeDoCurso").html(`${dados.curso.titulo}`);
              $("#resumoCurso").html(`${dados.curso.resumo}`);
              $("#totAulasCurso").html(`${dados.aulas.length} aulas`);


              // VERIFICAR SE O USUÁRIO JÁ INICIOU O CURSO
              if(dados.curso.status=="started"){

                    // BARRA DE PROGRESSO (CASO O USUÁRIO JA TENHA INICIADO O CURSO)
                    $(".barra-de-progresso-caixa").html(`<span class="badge badge-success">Curso iniciado!</span>`);
                    /*
                    $(".barra-de-progresso-caixa").html(`

                        <div id="progressoCurso" class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">seu progresso: 25%</div>
                        </div>

                    `);
                    */

               }

              // SALVAR O CONTEUDO DO CURSO NA MEMÓRIA DO DISPOSITIVO
              localStorage.setItem("dadosCurso",JSON.stringify(dados));

              // ALIMENTAR O RESUMO DAS AULAS
              $("#listaDasAulasResumo").html(`

                      ${dados.aulas.map((n) => {

                              return `
                                  
                                 <li>
                                    <i class="fa fa-play-circle"></i> ${n.nome_da_aula}
                                    <small>${n.resumo_da_aula}</small>
                                 </li>

                              `
                      
                       }).join('')}

              `);

            }else{
              
              console.log("SEM SUCESSO detalheCurso()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



// DENTRO DO CURSO
iniciarCurso(){

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  console.log("ESSES SAO OS DADOS DO CURSO");
  console.log(dadosCurso);

  // SE O USUÁRIO AINDA NAO TIVER INICIADO O CURSO, VAMOS SALVAR ESSE START
  if(dadosCurso.curso.status=="not-started"){

    app.models.salvarInicioCurso(dadosCurso.curso.id);

  }
  
  // ALIMENTAR OS DETALHES DA AULA DO CURSO
  $("#voltarLinkDetalheCurso").attr("onclick",`app.detalheCurso(${dadosCurso.curso.id})`);
  $("#nomeDoCurso").html(`${dadosCurso.curso.titulo}`);
  $("#nomeDaAulaAtual").html(`${dadosCurso.aulas[0].nome_da_aula}`);

  // IFRAME DO VIDEO
  if(dadosCurso.aulas[0].video_da_aula != false && 
     dadosCurso.aulas[0].video_da_aula != "" && 
     dadosCurso.aulas[0].video_da_aula != null){

     $("#videoAula").html(`${dadosCurso.aulas[0].video_da_aula}`);
  
  }
  
  // CONTEUDO DA AULA  
  $("#conteudoEmSiDaAula").html(`${dadosCurso.aulas[0].conteudo_da_aula}`);

  localStorage.setItem("posicaoCurso",0);

  // MARCAR SE A AULA TEM TESTE
  if(dadosCurso.aulas[0].conteudo_teste!==null){
     localStorage.setItem("aulaHasTeste","sim");
  }else{
     localStorage.setItem("aulaHasTeste","nao");
  }



  // PERGUNTAR PARA O USUARIO SE ELE QUER CONTINUAR O CURSO DE ONDE PAROU OU SE VAI COMEÇAR DO ZERO
  try {
        if(dadosCurso.historico_cursos_usuario.length>0){
            confirmacao("Quer continuar o curso de onde você parou?","Você pode continuar o curso de onde parou, ou se preferir pode recomeça-lo.","app.carregarProximaAula();","Continuar");
        }
  }
  catch(err) {
    console.log("USUÁRIO NAO TEM HISTÓRICO SOBRE ESSE CURSO");
  }



}


carregarProximaAula(){

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  var posicao = localStorage.getItem("posicaoCurso");
  
  posicao = parseInt(posicao) + parseInt(1);

  localStorage.setItem("posicaoCurso",parseInt(posicao));

  console.log("ESSES SAO OS DADOS DO CURSO PARA A PROXIMA AULA");
  console.log(dadosCurso);

  console.log("ESSA É A POSIÇÃO");
  console.log(posicao);

  if(posicao==dadosCurso.aulas.length){
    app.detalheCurso();
    aviso("Parabéns! Curso concluído","Você concluíu 100% do curso! Continue se aperfeiçoando e aprendendo novos conteúdos!");
  }
  
  // ALIMENTAR OS DETALHES DA AULA DO CURSO
  $("#voltarLinkDetalheCurso").attr("onclick",`app.detalheCurso(${dadosCurso.curso.id})`);
  $("#nomeDoCurso").html(`${dadosCurso.curso.titulo}`);
  $("#nomeDaAulaAtual").html(`${dadosCurso.aulas[posicao].nome_da_aula}`);

  // IFRAME DO VIDEO
  if(dadosCurso.aulas[posicao].video_da_aula != false && 
     dadosCurso.aulas[posicao].video_da_aula != "" && 
     dadosCurso.aulas[posicao].video_da_aula != null){

     $("#videoAula").html(`${dadosCurso.aulas[posicao].video_da_aula}`);
  
  }else{
    $("#videoAula").html(` `);
  }
  
  // CONTEUDO DA AULA  
  $("#conteudoEmSiDaAula").html(`${dadosCurso.aulas[posicao].conteudo_da_aula}`);
  
  // MARCAR SE A AULA TEM TESTE
  if(dadosCurso.aulas[posicao].conteudo_teste!==null){

     localStorage.setItem("aulaHasTeste","sim");
  
  }else{
  
     localStorage.setItem("aulaHasTeste","nao");
  
  }


}


// SALVAR O INICIO DO CURSO
salvarInicioCurso(idCurso){
    
       // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var acao = "START CURSO";
         
        xhr.open('POST', app.urlApi+'historico-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso+
                     "&acao="+acao;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("HISTÓRICO DO USUARIO SALVO");

            }else{
              
              console.log("SEM SUCESSO salvarInicioCurso()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}

// ATUALIZAR O HISTÓRICO DO ALUNO
atualizarHistoricoAluno(){

  var posicaoCurso = localStorage.getItem("posicaoCurso");

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  console.log("ESSES SAO OS DADOS DO CURSO");
  console.log(dadosCurso);

  var idCurso = dadosCurso.curso.id;

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var acao = "UPDATE CURSO";
         
        xhr.open('POST', app.urlApi+'historico-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso+
                     "&posicao="+posicaoCurso+
                     "&acao="+acao;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("HISTÓRICO DO USUARIO ATUALIZADO");

            }else{
              
              console.log("SEM SUCESSO atualizarHistoricoAluno()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}


salvarMinhasCategorias(){

    var idUsuario  = localStorage.getItem("idUsuario");
    var categoria1 = localStorage.getItem("categoria1");
    var categoria2 = localStorage.getItem("categoria2");


        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'salvar-minhas-categorias',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&categoria1="+categoria1+
                     "&categoria2="+categoria2;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR MINHAS CATEGORIAS");
              console.log(JSON.parse(xhr.responseText));
              
            }else{
              
              console.log("SEM SUCESSO salvarMinhasCategorias()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


minhasSolicitacoes(){

        var idUsuario  = localStorage.getItem("idUsuario");
        var emailUsuario = localStorage.getItem("emailUsuario");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'minhas-solicitacoes',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     '&emailUsuario='+emailUsuario+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO MINHAS SOLICITACOES");
              console.log(JSON.parse(xhr.responseText));


              var dados = JSON.parse(xhr.responseText);

              $("#minhasSolicitacoesContainer").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO NAO DESBLOQUEADO
                          if(n.desblock=="nao"){

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos" data-categoria="${n.nome_categoria}">
                                   
                                     <div class="header-autor">
                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>Área de atendimento: ${n.regiao}</p>
                                          <p>${n.descricao}</p>
                                          <p>Data: ${n.data_criacao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                          <p>Desbloqueado por algum profissional?<br> <b>Não</b></p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick="app.cancelarAnuncio(${n.id});" title="CANCELAR" class="btn btn-warning">
                                              CANCELAR SERVIÇO <i class="fa fa-ban"></i>
                                          </a>
                                          <p class="apoio-servico">
                                            Caso precise editar alguma informação, você precisa criar uma nova solicitação de atendimento
                                          </p>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->

                              `

                          }


                          // ORCAMENTO DESDESBLOQUEADO
                          if(n.desblock=="sim"){

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos" data-categoria="${n.nome_categoria}">
                                   
                                     <div class="header-autor">
                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>Área de atendimento: ${n.regiao}</p>
                                          <p>${n.descricao}</p>
                                          <p>Data: ${n.data_criacao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                          <p>Desbloqueado por algum profissional?<br> <b style="color:#4CAF50">Sim</b></p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick="app.fecharAnuncio(${n.id});" title="FECHAR SERVIÇO" class="btn btn-warning">
                                              FECHAR SERVIÇO
                                          </a>
                                          <p class="apoio-servico">
                                            Caso já tenha sido atendido ou não precise mais de novos orçamentos, o botão acima irá indicar aos profissionais que vocë não precisa mais do atendimento.
                                          </p>
                                          <p class="apoio-servico">
                                            Caso precise editar alguma informação, você precisa criar uma nova solicitação de atendimento
                                          </p>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->

                              `

                          }


                       }).join('')}

              `);


              
            }else{
              
              console.log("SEM SUCESSO minhasSolicitacoes()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);
  

}

removerSolicitacaoOrcamento(idAnuncio){

  // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'remover-anuncio',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idAnuncio='+idAnuncio+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO REMOVER ANUNCIO");
              console.log(JSON.parse(xhr.responseText));

              fecharAviso();
              aviso("Deu certo!","Sua solicitação foi removida com sucesso! Aproveite e publique novos orçamentos para continuar contando com os profissionais da nossa plataforma!");
              
            }else{
              
              console.log("SEM SUCESSO removerSolicitacaoOrcamento()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);



}

fecharSolicitacaoOrcamento(idAnuncio){
  
         // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'fechar-anuncio',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idAnuncio='+idAnuncio+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO FECHAR ANUNCIO");
              console.log(JSON.parse(xhr.responseText));

              fecharAviso();
              aviso("Deu certo!","Sua solicitação foi fechada com sucesso! Aproveite e publique novos orçamentos para continuar contando com os profissionais da nossa plataforma!");
              
            }else{
              
              console.log("SEM SUCESSO fecharSolicitacaoOrcamento()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



}