<p align="center">
  <img src="https://i.ibb.co/41hYqVz/Krill-Logo.png  alt="drawing" width:"150";>
</p>
                                                                              
# KRILL - Discord bot
*@Krill* é um bot exclusivo do servidor [ThatSkyGameBrasil](https://is.gd/ThatSkyGameBrasil), no Discord. Este servidor foi criado com o objetivo de ajudar jogadores, falantes de português, de *Sky - Children of Light*, da empresa *ThatGameCompany*.
          
          
## COMANDOS

COMANDO                 | USO                               | EXEMPLO
:-------------          | :-------------------------------  | :--------------------------------
[!banir](#banir)        | !banir <@member>                  | !banir @Elder
[!del](#del)            | !del <quantiade>                  | !del 5
[!denuncia](#denuncia)  | !denuncia                         | !denuncia
[!desmutar](#mutar)     | !desmutar <@member>               | !desmutar @krab
[!enviarmsg](#enviarmsg)| !enviarmsg                        | !enviarmsg
[!enviarpv](#enviarpv)  | !enviarpv <@member> <mensagem>    | !enviarpv @StarKid I'm the boss
[!kping](#kping)        | !kping                            | !kping
[!mutar](#mutar)        | !mutar <@member>                  | !mutar @StarKid
[!privado](#privado)    | !privado                          | !privado


<a id="banir"/> 
## Banir
Este comando tem como função, banir membros do servidor. Membros banidos não poderão retornar desde que um Administrador do servidor intervenha.
<p align="center">
  <img src="https://media1.tenor.com/images/7129d4fbd2bd63ab987a768951ff44cb/tenor.gif" width:"150";>
</p>

### Previlégios
@Admin @Staff
### Uso
```
!banir <@usuario> <Motivo>
```
### Exemplo
```
!banir @StarKid Sou o novo rei do pedaço !
```


<a id="del"/> 
## Deletar mensagens
Este comando pode deletar a última mensagem enviada em uma sala de chat ou você pode especificar uma quantidade de mensagens a serem deletadas.
OBS:. O @Krill não pode deletar mensagens mais antigas do que 14 dias.

### Previlégios
@Admin @Staff @Moderador

### Uso
```
!del <quantidade>
```
### Exemplo
```
!del 5
```


<a id="denuncia"/> 
## Denunciar
Este comando cria uma sala privada em que apenas você e o bot possuem permissão para visualiza-la. Após você escrever sua denúncia, o @krill irá encaminhar sua mensagem **anonimamente** para a administração do servidor.
<p align="center">
  <img src="https://i.ibb.co/NmxFfSW/denuncia.png" width:"150";>
</p>

### Previlégios
Qualquer membro pode usar este comando.

### Uso
```
!denuncia
```



<a id="enviarmsg"/> 
## Enviar mensagem 
Este comando permite enviar uma mensagem usando o bot. Ao usar este comando, uma sala sera criada para que você possa fornecer todos os dados que o @Krill precisa para que sua mensagem seja editada com perfeição, tais como: Sala destinada, menções, título da mensagem, thumbnail, imagem, etc.

<p align="center">
  <img src="https://i.ibb.co/16b1XKz/enviarmsg.png" width:"150";>
</p>

### Previlégios
@Admin @Staff @Moderador

### Uso
```
!enviarmsg
```


<a id="enviarpv"/> 
## Enviar mensagem privada para membro
Este comando permite enviar uma mensagem privada usando o bot. Ao usar este comando, o @Krill fica encarregado de enviar uma mensagem para o membro mencionado.
OBS:. Se o membro não permitir mensagens privadas uma mensagem de erro será enviada à sala de Logs.

### Previlégios
@Admin @Staff @Moderador

### Uso
```
!enviarpv <@usuario> <mensagem>
```
### Exemplo
```
!enviarpv @StarKid I Krill u <3
```


<a id="kping"/> 
## Ping - Testando tempo de resposta do @KRILL`bot`
Como o esperado, retorna o tempo de resposta do bot (em ms).

### Previlégios
@Admin @Staff @Moderador

### Uso
```
!kping
```


<a id="mutar"/>
## Mutar / Desmutar membro do servidor
Este comando irá impedir que o membro-alvo fique impossibilitado de enviar mensagens no servidor com excessão ao canal dedicado à trativa de problemas.
O membro-alvo perderá todos os seus cargos e tags. Use este comando com moderação e sabedoria.
Desmutar o membro-alvo retira o cargo `Silenciado` do mesmo. Lembre-se de atribuir novas tags e cargos após usar este comando.

### Previlégios
@Admin @Staff

### Uso
```
!mutar <@usuario>
```
```
!desmutar <@usuario>
```

### Exemplo
```
!mutar @StarKid
```
```
!desmutar @Krab
```


<a id="privado" />
## Privado - Criar sala privada
Este comando cria uma sala de chat privada, exclusiva, com os administradores do servidor. 
Administradores podem usar o comando `!add` para adicionar pessoas à sala privada criada.
OBS:. O comando `!add`só é válido em canais criados a partir do comando `!privado`.

### Previlégios
@Admin @Staff @Moderador

### Uso
```
!privado
```
```
!add <@usuario>
```
### Exemplo
```
!privado
```
```
!add @Krab
```
