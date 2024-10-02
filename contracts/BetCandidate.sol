//SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

struct Bet {
    uint amount;
    uint candidate;
    uint timestamp;
    uint claimed;
}

struct Dispute {
    string candidate1;
    string candidate2;
    string image1;
    string image2;
    uint total1;
    uint total2;
    uint winner;
}

contract BetCandidate {
    
    Dispute public dispute;//public informa que a variável é acessada por qualquer um que chamar o contrato
    // address = datatype
    // Bet = objeto a ser procurado
    mapping(address => Bet) public allBets;
    address owner;     // quem colocou o contrato no ar
    uint fee = 10000; //%100 -> escala de 4 zeros     // taxa de comissao

    uint public netPrize; //prêmio líquido

    constructor (){
        
        owner = msg.sender;//quem disparou a mensagem de construção do contrato

        dispute = Dispute({
            candidate1: "Donald trump",
            candidate2: "Kamala Harrys",
            image1: "http://bit.ly/3zmSfiA",
            image2: "http://bit.ly/4gF4mYO",
            total1: 0,
            total2: 0,
            winner: 0
        });
    }

    //Funcionalidade de apostar
    //external indica que a função poderá ser chamada por um cliente
    //payable é um modificar que indica que só fará algo mediante à pagamento
    function bet(uint candidate) external payable { 
        require(candidate == 1 || candidate == 2, "Invalid Candidate"); // Retorna uma string se o input não for 1 ou 2
        require(msg.value > 0, "Invalid value"); //verifica se o valor de pgto enviado seja maior que 0
        require(dispute.winner == 0, "Dispute is closed"); //verifica se a aposta estiver aberta (winner == 0), caso contrário, retorna que está fechada

        //Usamos memory quando declaramos uma struct dentro da função, onde este será temprário
        Bet memory newBet;
        newBet.amount = msg.value;
        newBet.timestamp = block.timestamp; //block é a propriedade do bloco vigente, e timestamp é quando o bloco será salvo na blockchain
        newBet.candidate = candidate;
        
        //Crio um objeto com o endereço do apostador e armazeno a aposta neste endereço
        allBets[msg.sender] = newBet;

        //adiciona o montante ao total que corresponde à cada candidato
        if(candidate == 1)
            dispute.total1 += msg.value;
        else 
            dispute.total2 += msg.value;
    }

    //Finaliza a aposta
    function finish(uint winner)  external{
        require(msg.sender == owner, "Invalid account");
        require(winner == 1 || winner == 2, "Invalid Candidate");
        require(dispute.winner == 0, "Dispute Closed");
        
        dispute.winner = winner;
        uint grossPrize = dispute.total1 + dispute.total2;
        uint commission = (grossPrize * fee) / 1e4; //1e4 = escala de 4 zeros
        netPrize = grossPrize - commission;

        payable(owner).transfer(commission); // transfere pra carteira do owner
    }   

    function claim() external{
        Bet memory userBet = allBets[msg.sender];
        require(dispute.winner > 0 && dispute.winner == userBet.candidate && userBet.claimed == 0, "Invalid claim");
        uint winnerAmount = dispute.winner == 1 ? dispute.total1 : dispute.total2;
        uint ratio = (userBet.amount * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;
        //sempre obedecer a ordem abaixo:
        allBets[msg.sender].claimed = individualPrize;
        payable(msg.sender).transfer(individualPrize);
    }
}