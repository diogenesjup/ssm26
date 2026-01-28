class App {

    constructor(appId, appName, appVersion, appOs, ambiente, token, tokenSms) {

        this.appId      = appId;
        this.appName    = appName;
        this.appVersion = appVersion;        
        this.appOs      = appOs;

        this.views   = new Views();
        this.sessao  = new Sessao();
        this.models  = new Models();
        this.helpers = new Helpers();

        this.nomeApp         = "SAVE SERVIÇO";
        this.linkApp         = "https://saveservico.com.br/";
        this.nomeMoeda       = "MOEDA";
        this.nomeMoedaPlural = "MOEDAS";

        if(ambiente=="HOMOLOGACAO"){
             
            this.urlDom = "https://saveservico.com.br/app/www/";
            this.urlApi = "https://saveservico.com.br/apiservicekeys/";
            this.urlCdn = "https://saveservico.com.br/cdn/";

        }
        if(ambiente=="PRODUCAO"){

            this.urlDom = "https://saveservico.com.br/app/www/";
            this.urlApi = "https://saveservico.com.br/apiservicekeys/";
            this.urlCdn = "https://saveservico.com.br/cdn/";

        }

        this.urlApiPagto = "https://saveservico.com.br/pay/";

        this.token = token;
        this.tokenSms = tokenSms;
        
    }
    
    getVersion() {

        return this.appVersion;
    }

    getOs(){

        return this.appOs;
    }
    
    initApp(elemento){

        this.views.viewPrincipal();

        // VERIFICAR SE A API ESTÁ OK
        this.models.testeApi();
        
        // VERIFICAR SE O USUÁRIO ESTÄ LOGADO
        this.sessao.verificarLogado();

    }

    inicio(){

        this.views.viewPrincipal();
        this.views.ativarMenuUm();

    }

    login(idUsuario,emailUusario,dadosUsuario){
   
        this.sessao.logarUsuario(idUsuario,emailUusario,dadosUsuario);
   
    }

    verificarCodigoSms(){

        this.views.viewCodigoSms();

    }

    procVerificarSms(){
        
       this.models.verificarCodigoSms(); 

    }
    
    procLoginSms(){

        this.models.procLoginSms();
   
    }

    procLogin(){

        this.models.procLogin();
   
    }
    
    procLogoff(){

        confirmacao("Tem certeza que deseja sair?","Você será desconectado...","app.logoff();","Sim, sair");
        
    }

    logoff(){
       
        localStorage.clear();
        
        // RECARREGAR AS CATEGORIAS E DADOS PADRÕES
        app.models.testeApi();
        app.viewLogin();

    }

    cadastro(){
        this.views.viewCadastro();
        this.views.desativarTodosMenus();
    }

    viewLoginEmailSenha(){
        this.views.viewLoginEmailSenha();
    }

    procCadastro(){
        this.models.procCadastro();
    }


    esqueciMinhaSenha(){
        this.views.viewEsqueciMinhaSenha();
        this.views.desativarTodosMenus();
    }

    procResetSenha(){
        this.models.procResetSenha();
    }

    

    selecaoPerfil(){

        event.preventDefault();

        var tipoPerfil = $('input[name=tipoPerfil]:checked').val();

        if(tipoPerfil=="cliente"){

            app.opcoesCarretamentoPerfilCliente();
            localStorage.setItem("selecaoPerfil","cliente");

        }else{

            var dadosCompletosUsuario = JSON.parse(localStorage.getItem("dadosCompletosUsuario"));

            if(dadosCompletosUsuario.categoria!=null || localStorage.getItem("categoria1")!=null){

                    this.views.viewPrincipalProfissional();
                    this.models.orcamentosDisponiveis();
                    localStorage.setItem("selecaoPerfil","profissional");

            }else{

                aviso("Qual categoria de serviço você atua?","Para visualizar os orçamentos disponíveis na nossa plataforma, você precisa informar qual categoria você atua. No próximo passo, você terá que informar esse dado.");
                this.views.selecionarMinhasCategorias();

            }

        }

    }

    induzirReInicio(){

        this.views.viewPrincipalProfissional();
                    this.models.orcamentosDisponiveis();

    }


    listagemNovaBlocada(){

          this.views.listagemNovaBlocada();

    }


    salvarMinhasCategorias(){

            var categoria1 = $("#categoria_1").val();
            var categoria2 = $("#categoria_2").val();

            console.log("ESSAS SÃO AS MINHAS CATEGORIAS:");
            console.log(categoria1);
            console.log(categoria2);

            localStorage.setItem("categoria1",categoria1);
            localStorage.setItem("categoria2",categoria2);

            this.models.salvarMinhasCategorias();

            this.views.viewPrincipalProfissional();
            this.models.orcamentosDisponiveis();

            localStorage.setItem("selecaoPerfil","profissional");

    }    
    opcoesCarretamentoPerfilCliente(){

        this.views.viewPrincipalCliente();
        this.models.categoriasAtendimento();

    }

    // PASSO 2 DO ATENDIMENTO
    novoAtendimentoPasso2(idCategoria,nomeCategoria){

        // DESCOBRIR SE A CATEGORIA TEM CATEGORIAS FILHAS, 
        var categorias = JSON.parse(localStorage.getItem("categoiasAtendimento"));


        $("#listaDeCategorias").html(`

            <li>
               <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso3(${idCategoria},'${nomeCategoria}')" title="${nomeCategoria}">
                  <b>${nomeCategoria}</b> <img src="assets/images/right.svg" alt="Ver mais">
               </a>
            </li>

            <li class="carregandoCategorias" style="text-align:left;font-size:13px;">
                <img src="assets/images/loading.gif" alt="Carregando" style="width:17px;margin-right:5px;float:none;" /> Carregando
            </li>

        `);

        var n = "";
        var entrei = 0;
        
        // VARRER AS CATEGORIAS
        for(var i = 0;i<categorias.categorias.length;i++){

             if(categorias.categorias[i].relacao.length>0){

                for(var j = 0;j<categorias.categorias[i].relacao.length;j++){

                    if(categorias.categorias[i].relacao[j]==idCategoria){

                        $("#fraseDeAbertura").fadeOut(1);

                        entrei = 1;

                        n = categorias.categorias[i];

                        $(".carregandoCategorias").remove();
                        $("#listaDeCategorias").append(`

                            <li>
                                <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso3(${n.id},'${n.titulo}')" title="${n.titulo}">
                                   ${n.titulo} <img src="assets/images/right.svg" alt="Ver mais">
                                </a>
                            </li>

                        `);

                    }

                }


             }// FINAL DO IF DO TAMANHO

        }// FINAL DO FOR

        app.views._content.append(`
                <p style="text-align:center;font-size:11px;padding-top:20px;">
                    <a href="javascript:void(0)" onclick="app.opcoesCarretamentoPerfilCliente();" title="VOLTAR AO INÍCNIO" style="color:#747474;text-decoration:none;">VOLTAR AO INÍCIO</a>
                </p>
        `);

        if(entrei==0){
            
            localStorage.setItem("tipoHistoricoCategoria","pai");
            app.novoAtendimentoPasso3(idCategoria,nomeCategoria);
        
        }


    }
    


    novoAtendimentoPasso3(idCategoria,nomeCategoria){

        localStorage.setItem("idCategoriaHistorico",idCategoria);
        localStorage.setItem("nomeCategoria",nomeCategoria);

        this.views.novoAtendimento(idCategoria,nomeCategoria);

    }

    enviarAtendimento(){

        $("#btnEnviarSolicitacao").html("enviando... aguarde");

        this.models.enviarAtendimento();

    }


/**
*  ------------------------------------------------------------------------------------------------
*
*
*   SOLICITAÇÕES DO CLIENTE
*
*
*  ------------------------------------------------------------------------------------------------
*/
minhasSolicitacoes(){

    this.views.minhasSolicitacoes();
    this.models.minhasSolicitacoes();

}
cancelarAnuncio(idAnuncio){
    
    confirmacao("Tem certeza que deseja cancelar essa solicitação?","Sua solicitação de orçamento será apagada e não receberá mais propostas dos profissionais.",`app.confirmarCancelamento(${idAnuncio})`,"Sim, remover");

}
confirmarCancelamento(idAnuncio){
   
    aviso("Processando...","Aguarde, estamos removendo a sua solicitação de orçamento.");
    console.log("REMOVER SOLICITAÇÃO: "+idAnuncio);

    this.models.removerSolicitacaoOrcamento(idAnuncio);

}

fecharAnuncio(idAnuncio){

    confirmacao("Tem certeza que deseja encerrar essa solicitação?","Sua solicitação de orçamento será encerrada e não receberá mais orçamentos.",`app.confirmarFechamento(${idAnuncio})`,"Sim, fechar");

}
confirmarFechamento(idAnuncio){

    aviso("Processando...","Aguarde, estamos fechando a sua solicitação de orçamento.");
    console.log("FECHANDO SOLICITAÇÃO: "+idAnuncio);

    this.models.fecharSolicitacaoOrcamento(idAnuncio);

}

    
/**
*  ------------------------------------------------------------------------------------------------
*
*
*   FILTRO TABELA GERAIS
*
*
*  ------------------------------------------------------------------------------------------------
*/
filtrotabela(){

                  var input, filter, ul, li, a, i;
                  
                  input = document.getElementById('filtroTabela');
                  filter = input.value.toUpperCase();
                  ul = document.getElementById("listaDeCategorias");

                  li = ul.getElementsByTagName('li');
                  var entrei = 0;

                   for (i = 0; i < li.length; i++) {
                      a = li[i];
                      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                          li[i].style.display = "";
                          entrei = 1;
                      } else {
                          li[i].style.display = "none";
                          
                      }
                  }

                  if($(input).val()==""){
                    $("#fraseDeAbertura").fadeIn(1);
                }else{
                    $("#fraseDeAbertura").fadeOut(1);
                }

                if(entrei==0){

                    $("#listaDeCategorias").append(`

                        <li class="semResultados" style="text-align:left;font-size:13px;">
                            Nenhum resultado encontrado
                        </li>

                    `);

                }else{

                    $(".semResultados").remove();

                }

     }



    viewPrincipalProfissional(){
      
      this.views.viewPrincipalProfissional();
      this.models.orcamentosDisponiveis();

    }



    servicosDesbloqueadosProfissional(){

        this.views.servicosDesbloqueadosProfissional();
        this.models.orcamentosDisponiveisDesbloqueados();

    }


    // ALERTAS E MENSAGENS DE AVISO DO USUÁRIO
    alertasProfissionais(){

        this.views.alertasProfissionais();

    }



    desbloqAnuncio(anuncio,valorAnuncio,categoria){

        var categoria1 = localStorage.getItem("categoria1");
        var categoria2 = localStorage.getItem("categoria2");
        console.log("ESSA É A CATEGORIA: "+categoria);

        if(categoria1==categoria  || categoria2==categoria){

        var saldoUsuario = localStorage.getItem("saldoPrestadorServico");
        
        // SALVAR DETALHE DO ANÚNCIO
        localStorage.setItem("anuncioHeranca",anuncio);

        if(saldoUsuario<valorAnuncio){
        
            confirmacao("Oops! Você não tem MOEDAS suficiêntes","Quer enviar um orçamento para esse cliente? Compre agora um pacote de MOEDAS para desbloquear essa e muitos outros anúncios!","app.comprarChaves()","Comprar");
        
        }else{

            confirmacao("Tem certeza que deseja desbloquear esse anúncio?",`Será debitado um valor de ${valorAnuncio} MOEDAS do seu saldo <b>${app.nomeApp}</b>`,`app.views.viewDetalheAnuncio(${anuncio},5)`,"Desbloquear");

        }

    }else{

          aviso("Oops! Você não pode atender a esse orçamento","Suas categorias de atendimento não permitem atender a esse tipo de orçamento. Para alterar as suas categorias de atendimento, envie um e-mail para <b>suporte@resolvaja.tec.br</b>");  

    }
        

    }

    resumoSaldoProfissional(){

        this.views.resumoSaldoProfissional();

    }


    comprarChaves(){
       
        this.views.viewComprarChaves();
        this.models.pacoteChaves();

    }

    selecaoPacoteCompra(){

        // SELECIONAR A OPÇÃO ESCOLHIDA
        var pacoteEscolhido = $('input[name=pacote]:checked', '#formPacoteSelecao').val();

        console.log("PACOTE ESCOLHIDO PELO USUÁRIO: "+pacoteEscolhido);

        $("#btnComprarSelecionado").html("Carregando....");

        // SELECIONAR O VALOR DE ACORDO COM A ESCOLHA
        this.models.selecaoPacoteDeChaves(pacoteEscolhido);

        // DIRECIONAR PARA A TELA DE COMPRA DO PACOTE
        //this.views.paginaDeCmopra();

        // CARREGAR O PRECO DO PACOTE ESCOLHIDO
        //this.models.paginaDeCompra();
        
        // DIRECIONAR PARA O DETALHE DO ORÇAMENTO (PROVISORIO)
        //this.views.viewDetalheAnuncio();

    }

    payBoleto(evemt){
         
         
         $("#btnPayBoleto").html("PROCESSANDO...");
         this.views.processandoPagamento();

         this.models.payBoleto();


  

    }

    payCartaoDeCredito(){
        
        $("#btnPayCartao").html("PROCESSANDO...");
        this.views.processandoPagamentoCartao();
        this.models.payCartaoDeCredito();

    }

    dadosBoleto(dados){
        
        this.views.dadosBoleto(dados);

    }


    /* CURSOS */
    cursos(){
       
       this.views.cursos();
       this.models.cursos();

    }

    filtrotabelaCursos(){

        var input, filter, ul, li, a, i;
                  
                  input = document.getElementById('buscaCursos');
                  filter = input.value.toUpperCase();
                  ul = document.getElementById("loopCursosLista");

                  li = ul.getElementsByTagName('li');

                  // Loop through all list items, and hide those who don't match the search query
                  for (i = 0; i < li.length; i++) {
                      a = li[i];
                      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                          li[i].style.display = "";
                      } else {
                          li[i].style.display = "none";
                      }
                  }

    }

    
    detalheCurso(idCurso){

      this.views.detalheCurso(idCurso);
      this.models.detalheCurso(idCurso);


    }

    iniciarCurso(){
       
       this.views.iniciarCurso();
       this.models.iniciarCurso();

    }

    nextAula(){

        this.views.nextAula();
        this.models.atualizarHistoricoAluno();

    }

    carregarProximaAula(){

         var oQueFazer = localStorage.getItem("aulaHasTeste");

         if(oQueFazer=="nao"){

            this.views.iniciarCurso();
            this.models.carregarProximaAula(); 

         }else{

            // DIRECIONAR O USUÁRIO PARA O TESTE
            this.views.detalheTeste();

         }

           

    }


    detalheTeste(idTeste){

        this.views.detalheTeste(idTeste);

    }


    corrigirTeste(){
         
         this.views.corrigirTeste();

         

    }





    /* INDIQUE E GANHE */
    indiqueEGanhe(){
         
         this.views.indiqueEGanhe();

    }


    configuracoes(){

        this.views.configuracoes();

    }
    

    configuracoesProfissionais(){

         this.views.configuracoes();

    }

    duvidasESuporte(){

        this.views.duvidasESuporte();
        this.models.duvidasESuporte();
    }


    /* ABRIR OU FECHAR O MENU CLIENTE */
    abrirFecharMenuCliente(){

      if($(".menu-adicional-cliente").hasClass("aberto")){
         
            $(".menu-adicional-cliente").removeClass("aberto");
        
      }else{

            $(".menu-adicional-cliente").addClass("aberto");
        
      }

    }

    /* ABRIR OU FECHAR O MENU PROFISSIONAL */
    abrirFecharMenuProfissional(){

      if($(".menu-adicional-profissional").hasClass("aberto")){
         
            $(".menu-adicional-profissional").removeClass("aberto");
        
      }else{

            $(".menu-adicional-profissional").addClass("aberto");
        
      }

    }


    finalizarServico(){
       
       aviso("Você realizou atendimento para esse cliente?","Apenas confirme o atendimento se você realizou o serviço orçado para esse cliente");

    }




/**
*  ------------------------------------------------------------------------------------------------
*
*
*   EDITAR PERFIL USUARIO LOGADO
*
*
*  ------------------------------------------------------------------------------------------------
*/
    editarPerfil(){

       this.views.editarPerfil();
       this.models.editarPerfil();

    }
    procEditarPerfil(){
       
       this.models.procEditarPerfil();

    }




    view2(){
        this.views.view2();
        this.views.ativarMenuDois();
    }

    view3(){
        this.views.view3();
        this.views.ativarMenuTres();
    }

    viewLogin(){
        this.views.viewLogin();
        this.views.desativarTodosMenus();
    }

    viewUploadFoto(){
        this.views.viewUploadFoto();
        this.views.desativarTodosMenus();
    }

}


class Sessao{
    
	constructor(){
	      
	     this.logado = "nao-logado";
	     this.bdLogado = localStorage.getItem("bdLogado");
	     this.idUsuario = localStorage.getItem("idUsuario");
	     this.emailUsuario = localStorage.getItem("emailUsuario");
	     this.dadosUsuario = localStorage.getItem("dadosUsuario");

	}
    
    logarUsuario(idUsuario,emailUusario,dadosUsuario){
    	this.logado = "logado";
    	this.idUsuario = idUsuario;
    	this.dadosUsuario = dadosUsuario;
    	localStorage.setItem("bdLogado","logado");
        localStorage.setItem("idUsuario",this.idUsuario);
        
        // DIRECIONAR O USUÁRIO PARA O INÍCIO
    	app.inicio();
    }

    verificarLogado(){
      
	      if(this.bdLogado!="logado"){
	      	app.viewLogin();
	      	
	      }

    }

    deslogarUusario(){
    	this.logado = "nao-logado";
    	localStorage.setItem("bdLogado","nao-logado");
    	localStorage.clear();
    }

}