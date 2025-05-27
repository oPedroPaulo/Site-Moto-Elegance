$(document).ready(function(){
    $('#mobile-btn').on('click', function () {
       $('#mobile-menu').toggleClass('active');
       $('#mobile-btn').find('i').toggleClass('fa-x');
    });
});

const prices = {
    prata: { urbana: 80, trail: 100, bigtrail: 120, custom: 130, carenada: 140 },
    ouro: { urbana: 180, trail: 210, bigtrail: 220, custom: 240, carenada: 250 },
    rubi: { urbana: 230, trail: 250, bigtrail: 280, custom: 300, carenada: 330 },
    esmeralda: { urbana: 480, trail: 520, bigtrail: 550, custom: 580, carenada: 610 },
    diamante: { urbana: 360, trail: 380, bigtrail: 400, custom: 440, carenada: 450 }
};

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
    // Atualiza preço quando tipo de moto é alterado
    document.querySelectorAll('.moto-type-select').forEach(select => {
        select.addEventListener('change', function() {
            const service = this.dataset.service;
            const priceElement = document.getElementById(`${service}-price`);
            const motoType = this.value;
            priceElement.textContent = `R$${prices[service][motoType]},00`;
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
});

function adicionarCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    lista.innerHTML = '';

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.classList.add('btn-default');
        btnRemover.style.marginLeft = '10px';
        btnRemover.onclick = () => removerItem(index);

        li.appendChild(btnRemover);
        lista.appendChild(li);
    });

    document.getElementById('carrinho-total').textContent = `R$${total.toFixed(2)}`;
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
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá, gostaria de confirmar o seguinte pedido:%0A";

    carrinho.forEach(item => {
        mensagem += `- ${item.nome}: R$${item.preco.toFixed(2)}%0A`;
    });

    mensagem += `Total: R$${total.toFixed(2)}%0A`;

    // Número do WhatsApp com DDD e país - EDITE AQUI
    const numeroWhatsApp = "5534999366009";  // Exemplo: 55 + DDD + número

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    window.open(url, '_blank');
}

document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);

function adicionarCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    atualizarCarrinho();
    
    // Mostrar notificação
    const notification = document.getElementById('notification');
    const message = document.getElementById('notification-message');
    message.textContent = `${nome} adicionado ao carrinho!`;
    
    notification.classList.add('show');
    
    // Esconder a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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
