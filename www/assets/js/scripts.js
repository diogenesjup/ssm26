// --- CONFIGURAÇÕES GLOBAIS ---
const API_URL      = 'https://servidorseguro.cloud/ssm30/index.php';
let MY_DEVICE_ID   = localStorage.getItem('ssm_device_id');
let MY_DEVICE_NAME = localStorage.getItem('ssm_device_name');
let SEARCHED_USERS = JSON.parse(localStorage.getItem('ssm_searched_users') || '[]');
let NICKNAMES      = JSON.parse(localStorage.getItem('ssm_nicknames') || '{}');
let MY_TEMP_ID     = localStorage.getItem('ssm_temp_id');

// Identidade ativa: define se estou falando como "Eu mesmo" ou "Meu Secreto"
let myActiveIdentity = MY_DEVICE_ID; 

// --- VARIÁVEIS WEBRTC (CHAMADA) ---
let localStream = null;
let peerConnection = null;
let callPollInterval = null; // Polling específico para troca de sinais durante a chamada
let isCallActive = false;
let processedCandidates = []; // Evita duplicidade de ICE candidates

const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

// --- INICIALIZAÇÃO DE ID ---
if (!MY_DEVICE_ID) {
    MY_DEVICE_ID = 'SSM' + Math.floor(Math.random() * 9000 + 1000);
    localStorage.setItem('ssm_device_id', MY_DEVICE_ID);
}
if (!MY_DEVICE_NAME) {
    MY_DEVICE_NAME = 'Agente ' + MY_DEVICE_ID.substring(3);
    localStorage.setItem('ssm_device_name', MY_DEVICE_NAME);
}

document.getElementById('myIdDisplay').innerText = MY_DEVICE_ID;

// Variáveis de Controle de Chat
let currentChatPartnerId = null;
let chatPollingInterval = null; // Polling de mensagens do chat

// Referências DOM
const viewHome = document.getElementById('view-home');
const viewChat = document.getElementById('view-chat');
const chatBody = document.getElementById('chatBody');

// --- NAVEGAÇÃO E UX ---

function openChat(partnerId, identityToUse) {
    currentChatPartnerId = partnerId;
    myActiveIdentity = identityToUse || MY_DEVICE_ID; // Define quem SOU EU nesta conversa
    
    // Configura Header
    const nickDisplay = document.getElementById('chatNickDisplay');
    const nickname = NICKNAMES[partnerId] || "";
    
    // Se não tiver nickname, mostra o ID
    nickDisplay.innerText = nickname || partnerId;
    
    // Mostra status real
    const statusEl = document.getElementById('chatRealId');
    if(myActiveIdentity === MY_TEMP_ID) {
        statusEl.innerText = `Via seu Secreto: ${MY_TEMP_ID}`;
        statusEl.style.color = "#ff3b30"; // Destaque visual
    } else {
        statusEl.innerText = `ID Real: ${partnerId}`;
        statusEl.style.color = "#25d366";
    }

    document.getElementById('chatAvatar').src = `https://ui-avatars.com/api/?name=${partnerId}&background=ddd&color=000`;
    
    viewChat.classList.add('active');
    viewHome.classList.add('behind');
    
    loadMessages();
    startChatPolling();
}

function closeChat() {
    viewChat.classList.remove('active');
    viewHome.classList.remove('behind');
    currentChatPartnerId = null;
    stopChatPolling();
    refreshUsers(); // Atualiza a lista ao voltar
}

// --- EDIÇÃO DE NICKNAME ---

const nickEl = document.getElementById('chatNickDisplay');

// Salvar ao perder o foco (blur)
nickEl.addEventListener('blur', function() {
    saveNickname(this.innerText.trim());
});

// Salvar ao dar Enter
nickEl.addEventListener('keydown', function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        this.blur(); // Dispara o blur acima
    }
});

function saveNickname(newName) {
    if(!currentChatPartnerId) return;
    
    // Se o nome for diferente do ID e não for vazio, salva
    if(newName && newName !== currentChatPartnerId) {
        NICKNAMES[currentChatPartnerId] = newName;
    } else {
        // Se limpou o nome ou deixou igual ao ID, remove o apelido
        delete NICKNAMES[currentChatPartnerId];
        // Restaura o texto para o ID original se ficou vazio
        if(!newName) nickEl.innerText = currentChatPartnerId; 
    }
    localStorage.setItem('ssm_nicknames', JSON.stringify(NICKNAMES));
}

// --- COMUNICAÇÃO API (CORE) ---

async function apiCall(action, data = {}) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data })
        });
        return await response.json();
    } catch (e) {
        console.error("API Error:", e);
        return null; 
    }
}

// --- LISTAGEM DE USUÁRIOS ---

async function refreshUsers() {
    // Se estiver no chat, não atualiza a lista visual para não gastar recurso,
    // mas o polling de CHAMADA (checkIncomingCall) continua rodando separado.
    if (currentChatPartnerId) return; 

    // Garante que ambos os IDs estão registrados (ping)
    await apiCall('register', { deviceId: MY_DEVICE_ID, deviceName: MY_DEVICE_NAME });
    if (MY_TEMP_ID) {
        await apiCall('register', { deviceId: MY_TEMP_ID, deviceName: "Temp " + MY_TEMP_ID });
    }

    // Pede a lista enviando QUEM EU SOU (Array de IDs) para o PHP filtrar
    const myIdentities = [MY_DEVICE_ID];
    if(MY_TEMP_ID) myIdentities.push(MY_TEMP_ID);

    const res = await apiCall('list_users', { deviceIds: myIdentities });
    const listEl = document.getElementById('usersList');
    const filter = document.getElementById('searchFilter').value.toLowerCase();
    
    if (res && res.users) {
        let visibleUsers = res.users.filter(u => 
            SEARCHED_USERS.includes(u.id) || u.hasChat === true
        );

        if (filter) {
            visibleUsers = visibleUsers.filter(u => {
                const nick = (NICKNAMES[u.id] || "").toLowerCase();
                return u.id.toLowerCase().includes(filter) || nick.includes(filter);
            });
        }

        if (visibleUsers.length > 0) {
            let html = '';
            visibleUsers.forEach(u => {
                const nick = NICKNAMES[u.id] || "";
                const displayName = nick ? `${nick} <small>(${u.id})</small>` : u.id;
                
                let statusText = "";
                let badge = "";
                
                if (u.myIdentityInThisChat === MY_TEMP_ID) {
                    badge = `<span class="secret-badge">SECRETO</span>`;
                    statusText = `Falando com <b>${MY_TEMP_ID}</b>`;
                } else {
                    statusText = u.hasChat ? 'Conversa ativa' : 'Dispositivo localizado';
                }

                const identityToUse = u.myIdentityInThisChat || MY_DEVICE_ID;

                html += `
                <div class="chat-item" onclick="openChat('${u.id}', '${identityToUse}')">
                    <div class="avatar"><img src="https://ui-avatars.com/api/?name=${u.id}&background=ddd&color=000"></div>
                    <div class="chat-info">
                        <div class="chat-name">${displayName}</div>
                        <div class="chat-preview">${badge} ${statusText}</div>
                    </div>
                </div>`;
            });
            listEl.innerHTML = html;
        } else {
            listEl.innerHTML = '<div style="padding:20px; text-align:center; color:#999;">Nenhum dispositivo encontrado.</div>';
        }
    }
}

// --- MENSAGENS DO CHAT ---

function startChatPolling() {
    stopChatPolling();
    chatPollingInterval = setInterval(loadMessages, 3000);
}

function stopChatPolling() {
    if (chatPollingInterval) clearInterval(chatPollingInterval);
}

async function loadMessages() {
    if (!currentChatPartnerId) return;
    const res = await apiCall('get_messages', { myId: myActiveIdentity, otherId: currentChatPartnerId });
    
    let msgsHtml = `<div class="msg-system">🔒 Segurança ponta-a-ponta (${myActiveIdentity} ↔ ${currentChatPartnerId})</div>`;

    if (res && res.messages) {
        res.messages.forEach(msg => {
            let type = '';
            if (msg.type === 'msg-system') {
                type = 'msg-system';
            } else {
                type = (msg.sender === myActiveIdentity) ? 'msg-out' : 'msg-in';
            }
            
            let content = msg.isHtml ? msg.text : msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            msgsHtml += `<div class="message ${type}">${content}</div>`;
        });
    }
    
    // Verifica se o conteúdo mudou antes de atualizar para não piscar (opcional simples)
    // Aqui atualizamos sempre para garantir
    chatBody.innerHTML = msgsHtml;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text || !currentChatPartnerId) return;
    
    input.value = "";
    
    await apiCall('send_message', { 
        senderId: myActiveIdentity, 
        receiverId: currentChatPartnerId, 
        text: text 
    });
    
    loadMessages();
    chatBody.scrollTop = chatBody.scrollHeight;
}

// --- UPLOAD DE MÍDIA ---

function triggerMedia() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempMsg = document.createElement('div');
        tempMsg.className = 'msg-system';
        tempMsg.innerText = "Enviando imagem...";
        chatBody.appendChild(tempMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        const formData = new FormData();
        formData.append('action', 'upload_media'); 
        formData.append('image', file);

        try {
            const response = await fetch(API_URL, { 
                method: 'POST', 
                body: formData 
            });
            
            const res = await response.json();
            tempMsg.remove();

            if (res.status === 'success') {
                await apiCall('send_message', {
                    senderId: myActiveIdentity,
                    receiverId: currentChatPartnerId,
                    text: `<img src="${res.url}" class="chat-img" oncontextmenu="return false;">`,
                    isHtml: true
                });
                loadMessages();
            } else {
                alert("Erro no upload: " + (res.msg || "Erro desconhecido")); 
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão ao enviar imagem.");
            if(tempMsg) tempMsg.remove();
        }
    };
    input.click();
}

// --- LÓGICA WEBRTC (CHAMADAS DE VOZ) ---

// 1. Iniciar Chamada (Caller)
async function startCall() {
    if (!currentChatPartnerId) return;

    // Verificar permissões no Android/iOS via Cordova Plugin
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.permissions) {
        const perms = window.cordova.plugins.permissions;
        // Permissões necessárias: RECORD_AUDIO e MODIFY_AUDIO_SETTINGS
        const list = [perms.RECORD_AUDIO, perms.MODIFY_AUDIO_SETTINGS];
        
        perms.hasPermission(list, (status) => {
            if (!status.hasPermission) {
                perms.requestPermissions(list, proceedCall, () => alert("Permissão de microfone negada."));
            } else {
                proceedCall();
            }
        }, () => {
             // Fallback se der erro na checagem
             perms.requestPermissions(list, proceedCall, () => alert("Permissão de microfone negada."));
        });
    } else {
        // Navegador Web
        proceedCall();
    }
}

async function proceedCall() {
    isCallActive = true;
    showCallScreen(currentChatPartnerId, "Chamando...", false);
    
    try {
        // Captura áudio
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (e) {
        alert("Erro ao acessar microfone: " + e.message);
        endCall();
        return;
    }

    createPeerConnection();
    // Adiciona tracks locais
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Cria Oferta SDP
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Envia sinal para o servidor
    const res = await apiCall('signal', {
        senderId: myActiveIdentity,
        receiverId: currentChatPartnerId,
        signalType: 'offer',
        data: offer
    });

    console.log("Sinal de oferta enviado:", res);

    // Inicia polling rápido para esperar resposta (Answer) e Candidatos ICE
    startSignalPolling();
}

// 2. Receber Chamada (Loop de Verificação)
async function checkIncomingCall() {
    // Se já estou atendendo ou chamando, não verifico novas ofertas, 
    // a menos que esteja no estado inicial de oferta esperando resposta.
    if (isCallActive && document.getElementById('callStatus').innerText !== 'Chamando...') return;

    const myIdentities = [MY_DEVICE_ID];
    if(MY_TEMP_ID) myIdentities.push(MY_TEMP_ID);

    const res = await apiCall('check_signal', { deviceIds: myIdentities });
    
    if (res && res.signal) {
        console.log("Sinal detectado:", res.signal);

        // Caso 1: Recebendo uma oferta nova (Alguém me ligando)
        if (res.signal.type === 'offer' && !isCallActive) {
            isCallActive = true;
            
            const callerId = res.signal.caller;
            // Configura o contexto para que, ao atender, eu use a identidade correta (Real ou Temp)
            currentChatPartnerId = callerId; 
            myActiveIdentity = res.signal.callee; 
            
            showCallScreen(callerId, "Recebendo chamada...", true);
            // Opcional: Tocar som de ringtone aqui
            // document.getElementById('ringtoneIn').play();
        }

        // Caso 2: Sou eu chamando, e o sinal é apenas para log (Answer é tratado no signalPolling)
        // Não fazemos nada aqui pois o startSignalPolling cuida da negociação ativa.
    }
}

// 3. Atender Chamada (Callee)
async function answerCall() {
    document.getElementById('btnAnswer').style.display = 'none'; 
    document.getElementById('callStatus').innerText = "Conectando...";
    // document.getElementById('ringtoneIn').pause();

    // Permissão de Mic
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (e) {
        alert("Erro mic: " + e.message); endCall(); return;
    }

    createPeerConnection();
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Busca a oferta remota novamente para garantir
    const res = await apiCall('check_signal', { deviceIds: [myActiveIdentity] });
    
    if(res && res.signal && res.signal.sdp) {
        // Define descrição remota
        await peerConnection.setRemoteDescription(new RTCSessionDescription(res.signal.sdp));
        
        // Cria resposta
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Envia Resposta
        await apiCall('signal', {
            senderId: myActiveIdentity,
            receiverId: currentChatPartnerId,
            signalType: 'answer',
            data: answer
        });

        // Começa a trocar candidatos de rede
        startSignalPolling();
    }
}

// 4. Encerrar Chamada
async function endCall() {
    isCallActive = false;
    stopSignalPolling();

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    // Avisa servidor para apagar arquivo
    if (currentChatPartnerId) {
        await apiCall('signal', {
            senderId: myActiveIdentity,
            receiverId: currentChatPartnerId,
            signalType: 'hangup'
        });
    }

    closeCallScreen();
}

// --- FUNÇÕES AUXILIARES WEBRTC ---

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(rtcConfig);

    // Quando encontrar um caminho de rede (ICE Candidate), envia para o servidor
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            apiCall('signal', {
                senderId: myActiveIdentity,
                receiverId: currentChatPartnerId,
                signalType: 'candidate',
                data: event.candidate
            });
        }
    };

    // Quando receber áudio remoto
    peerConnection.ontrack = (event) => {
        const remoteAudio = document.getElementById('remoteAudio');
        if (remoteAudio.srcObject !== event.streams[0]) {
            remoteAudio.srcObject = event.streams[0];
            document.getElementById('callStatus').innerText = "Chamada em andamento";
        }
    };

    // Monitora queda
    peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
            endCall();
        }
    };
}

// Loop de Sinalização (Só roda durante a chamada ativa)
function startSignalPolling() {
    if (callPollInterval) clearInterval(callPollInterval);
    
    // Roda a cada 1s para ser rápido
    callPollInterval = setInterval(async () => {
        if (!isCallActive) return;

        const res = await apiCall('check_signal', { deviceIds: [myActiveIdentity] });
        if (res && res.signal) {
            
            // SE EU SOU QUEM LIGOU: Esperando 'Answer'
            if (res.signal.type === 'answer' && peerConnection.signalingState === 'have-local-offer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(res.signal.answer_sdp));
            }

            // PARA AMBOS: Processando ICE Candidates
            if (res.signal.candidates) {
                res.signal.candidates.forEach(async (c) => {
                    // Só adiciona candidatos que vieram do OUTRO
                    if (c.sender !== myActiveIdentity) {
                        const candidateStr = JSON.stringify(c.candidate);
                        // Evita adicionar o mesmo candidato várias vezes
                        if (!processedCandidates.includes(candidateStr)) {
                            try {
                                await peerConnection.addIceCandidate(new RTCIceCandidate(c.candidate));
                                processedCandidates.push(candidateStr);
                            } catch(e) { console.log("ICE Error", e); }
                        }
                    }
                });
            }
        }
    }, 1000); 
}

function stopSignalPolling() {
    if (callPollInterval) clearInterval(callPollInterval);
    processedCandidates = [];
}

// --- UI DA CHAMADA ---

function showCallScreen(name, status, isIncoming) {
    const view = document.getElementById('view-call');
    const nick = NICKNAMES[name] || name;
    
    document.getElementById('callName').innerText = nick;
    document.getElementById('callStatus').innerText = status;
    document.getElementById('callAvatar').src = `https://ui-avatars.com/api/?name=${name}&background=ddd&color=000`;
    
    const btnAnswer = document.getElementById('btnAnswer');
    if (isIncoming) {
        btnAnswer.style.display = 'flex';
    } else {
        btnAnswer.style.display = 'none';
    }
    
    view.classList.add('active');
}

function closeCallScreen() {
    document.getElementById('view-call').classList.remove('active');
    // document.getElementById('ringtoneOut').pause();
}

// --- MODAL ---

const modalOverlay = document.getElementById('modalOverlay');
const modalCard = document.getElementById('modalCard');

function openModal() {
    modalCard.innerHTML = `
        <div class="modal-header">Opções do Agente</div>
        <div class="modal-option" onclick="actionLocate()">Localizar dispositivo</div>
        <div class="modal-option" onclick="actionTempUser()">Criar usuário temporário</div>
        <div class="modal-option" onclick="actionClearMem()">Apagar Conversa Atual</div>
        <div class="modal-option cancel" onclick="closeModalDirect()">Cancelar</div>`;
    modalOverlay.classList.add('open');
}

function closeModalDirect() { modalOverlay.classList.remove('open'); }
function closeModal(event) { if (event.target === modalOverlay) closeModalDirect(); }

function actionLocate() {
    modalCard.innerHTML = `
        <div class="modal-header">Localizar Dispositivo</div>
        <div style="padding:15px;">
            <input type="text" id="searchDeviceId" placeholder="Ex: SSM6652" class="chat-input" style="width:100%; margin-bottom:10px;">
            <div id="searchStatus" style="font-size:12px; text-align:center; color:#888;"></div>
        </div>
        <div class="modal-option" onclick="performSearch()">Conectar</div>
        <div class="modal-option cancel" onclick="closeModalDirect()">Cancelar</div>`;
}

async function performSearch() {
    const id = document.getElementById('searchDeviceId').value.trim().toUpperCase();
    const status = document.getElementById('searchStatus');
    if(!id) return;
    
    if(id === MY_DEVICE_ID || id === MY_TEMP_ID) {
        status.innerText = "Você não pode se conectar a si mesmo.";
        return;
    }

    status.innerText = "Buscando...";
    const res = await apiCall('find_user', { searchId: id });
    
    if(res && res.status === 'found') {
        if(!SEARCHED_USERS.includes(id)) {
            SEARCHED_USERS.push(id);
            localStorage.setItem('ssm_searched_users', JSON.stringify(SEARCHED_USERS));
        }
        status.innerText = "Localizado!";
        setTimeout(() => { 
            closeModalDirect(); 
            refreshUsers(); 
            openChat(id, MY_DEVICE_ID); 
        }, 800);
    } else {
        status.innerText = "ID não encontrado.";
    }
}

async function actionTempUser() {
    if (MY_TEMP_ID) await apiCall('delete_temp_user', { deviceId: MY_TEMP_ID });
    
    const randomNum = Math.floor(Math.random() * 9000 + 1000);
    MY_TEMP_ID = `SSMT${randomNum}`;
    localStorage.setItem('ssm_temp_id', MY_TEMP_ID);
    
    modalCard.innerHTML = `
        <div class="modal-header">Usuário Temporário</div>
        <div class="qr-container"><div id="qrcode"></div><div class="result-text">${MY_TEMP_ID}</div></div>
        <div class="modal-option cancel" onclick="closeModalDirect()">Fechar</div>`;
    
    new QRCode(document.getElementById("qrcode"), { text: MY_TEMP_ID, width: 150, height: 150 });
}

async function actionClearMem() {
    if (!currentChatPartnerId) return closeModalDirect();
    if(confirm("Isso apagará o histórico no servidor para AMBOS. Confirmar?")) {
        await apiCall('clear_chat', { myId: myActiveIdentity, otherId: currentChatPartnerId });
        loadMessages();
        closeModalDirect();
    }
}

// --- INICIALIZAÇÃO E EVENTOS GLOBAIS ---

document.getElementById('messageInput').addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// 1. Atualiza lista de usuários (a cada 5s)
setInterval(refreshUsers, 5000);

// 2. Verifica Chamadas (a cada 1.5s - roda independente do chat estar aberto ou fechado)
setInterval(checkIncomingCall, 1500);

// Inicia imediatamente
refreshUsers();