$(document).ready(function(){
    $('#mobile-btn').on('click', function () {
       $('#mobile-menu').toggleClass('active');
       $('#mobile-btn').find('i').toggleClass('fa-x');
    });
    
    // Configuração do carrinho flutuante
    document.getElementById('toggle-carrinho').addEventListener('click', function() {
        document.getElementById('carrinho-conteudo').classList.toggle('show');
    });
});

// Versão garantida que funciona
document.addEventListener('DOMContentLoaded', function() {
    // Seleção segura com IDs
    const aviso = document.getElementById('avisoPrecos');
    const fecharBtn = document.getElementById('fecharAvisoBtn');
    
    // Mostrar aviso (remove se quiser usar localStorage)
    aviso.style.display = 'block';
    
    // Função para fechar
    function fecharAviso() {
        aviso.style.display = 'none';
        // Opcional: usar localStorage para persistência
        // localStorage.setItem('avisoFechado', 'true');
    }
    
    // Evento de clique
    fecharBtn.addEventListener('click', fecharAviso);
    
    // Opcional: Verificar localStorage ao carregar
    // if(localStorage.getItem('avisoFechado')) {
    //    fecharAviso();
    // }
});

const prices = {
    prata: { urbana: 89.90, trail: 109.90, bigtrail: 119.90, custom: 129.90, carenada: 139.90 },
    ouro: { urbana: 189.90, trail: 219.90, bigtrail: 229.90, custom: 249.90, carenada: 249.90 },
    diamante: { urbana: 389.90, trail: 419.90, bigtrail: 459.90, custom: 499.90 },
    esmeralda: { urbana: 459.90, trail: 549.90, bigtrail: 569.90, custom: 579.90, carenada: 579.90 },
    manutencao: { urbana: 109.90, trail: 129.90, bigtrail: 139.90, custom: 149.90, carenada: 159.90 }
};

function formatarMoeda(valor) {
    return `R$${valor.toFixed(2).replace('.', ',')}`;
}

const motoTypeNames = {
    urbana: "Moto Urbana",
    trail: "Moto Trail",
    bigtrail: "Moto Big Trail",
    custom: "Moto Custom",
    carenada: "Moto Carenada"
};

const carrinho = [];
let total = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.moto-type-select').forEach(select => {
    select.addEventListener('change', function() {
        const service = this.dataset.service;
        const priceElement = document.getElementById(`${service}-price`);
        const motoType = this.value;
        const priceValue = prices[service][motoType];
        priceElement.textContent = `R$${priceValue.toFixed(2).replace('.', ',')}`;
    });
});

    // Listener global para todos os botões "Adicionar ao carrinho"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            const buttonPrice = this.dataset.price;

            let serviceName = '';
            let price = 0;

            if (buttonPrice) {
                // Serviço adicional
                serviceName = this.closest('.servico-adicional-card').querySelector('.servico-title').textContent;
                price = parseFloat(buttonPrice);
            } else {
                // Serviço principal
                const selectElement = document.querySelector(`.moto-type-select[data-service="${service}"]`);
                const motoType = selectElement.value;
                price = prices[service][motoType];
                const motoTypeName = motoTypeNames[motoType];
                serviceName = `Lavagem ${service.toUpperCase()} - ${motoTypeName}`;
            }

            adicionarCarrinho(serviceName, price);
        });
    });

    document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);
});

function adicionarCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    atualizarCarrinho();
    
    // Mostrar notificação
    const notification = document.getElementById('notification');
    const message = document.getElementById('notification-message');
    message.textContent = `${nome} adicionado ao carrinho!`;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    lista.innerHTML = '';
    
    document.getElementById('carrinho-contador').textContent = carrinho.length;

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.nome}</span>
            <span>${formatarMoeda(item.preco)}</span>
        `;

        const btnRemover = document.createElement('button');
        btnRemover.innerHTML = '<i class="fas fa-trash"></i>';
        btnRemover.classList.add('btn-remover');
        btnRemover.onclick = (e) => {
            e.stopPropagation();
            removerItem(index);
        };

        li.appendChild(btnRemover);
        lista.appendChild(li);
    });

    document.getElementById('carrinho-total').textContent = formatarMoeda(total);
    
    if (carrinho.length > 0) {
        document.getElementById('carrinho-conteudo').classList.add('show');
    }
}

function removerItem(index) {
    total -= carrinho[index].preco;
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function limparCarrinho() {
    carrinho.length = 0;
    total = 0;
    atualizarCarrinho();
    
    // Mostrar notificação
    const notification = document.getElementById('notification');
    const message = document.getElementById('notification-message');
    message.textContent = 'Carrinho limpo com sucesso!';
    
    notification.classList.add('show');
    
    // Esconder a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá, gostaria de confirmar o seguinte pedido:%0A";

    carrinho.forEach(item => {
        mensagem += `- ${item.nome}: ${formatarMoeda(item.preco)}%0A`;
    });

    mensagem += `Total: ${formatarMoeda(total)}%0A`;

    const numeroWhatsApp = "553492452707";
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    window.open(url, '_blank');
}

// Adicione este estilo para o botão de remover
const style = document.createElement('style');
style.textContent = `
    .btn-remover {
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
    }
    .btn-remover:hover {
        color: #cc0000;
    }
`;
document.head.appendChild(style);