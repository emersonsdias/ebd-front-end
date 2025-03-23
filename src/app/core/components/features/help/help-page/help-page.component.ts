import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

interface HelpNode {
  value: string,
  children?: HelpNode[]
}

@Component({
  selector: 'app-help-page',
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {

  dataSource: HelpNode[] = this._buildDataSource()
  childrenAccessor = (node: HelpNode) => node.children ?? [];
  hasChild = (_: number, node: HelpNode) => !!node.children && node.children.length > 0;

  private _buildDataSource(): HelpNode[] {
    return [
      {
        value: 'Usuário', children: [
          {
            value: 'Como criar um novo usuário?', children: [
              {
                value: 'Ainda não sou usuário do sistema', children: [
                  { value: 'Se ainda não é usuário, é necessário entrar em contato com um administrador do sistema, e solicitar que seja criado um novo usuário.' }
                ]
              },
              {
                value: 'Sou um usuário administrador', children: [
                  { value: 'Acesse a opção \'Configurações\', e selecone \'Acesso administrativo\' ou \'Acesso professores\', clique em \'Adicionar...\', é possível um usuário ter ambos os perfis: administrador e professor.' }
                ]
              }
            ]
          },
        ]
      },
      {
        value: 'Senha', children: [
          {
            value: 'Esqueci minha senha', children: [
              { value: 'Para criar uma nova senha, basta pedir a um administrador do sistema criar uma nova senha.' }
            ]
          },
          {
            value: 'Quero alterar minha senha', children: [
              { value: 'Para alterar sua senha, acesse o menu \'Configurações\'>\'Dados da conta\', clique em \'Editar\', e selecione a opção \'Desejo alterar minha senha\', vai aparecer os campos para troca de senha, escolha a senha desejada, e preencha novamente no campo de confirmação, após isso, clique em \'Salvar\', será necessário refazer o login na aplicação.' }
            ]
          }

        ]
      },
      {
        value: 'Erros comuns', children: [
          {value: '401 - Erro de autenticação', children: [
            {value: 'Significa que não é possível validar o usuário e/ou senha. Pode ser que o e-mail ou senha estão inválidos, ou seu usuário foi inativado.'}
          ]},
          {value: '403 - Erro de permissão', children: [
            {value: 'Significa que está tentando acessar um recurso ao qual não possui o perfil adequado.'}
          ]},
          {value: '404 - Recurso não encontrado', children: [
            {value: 'Significa que você está tentando acessar algum recurso que não existe no banco de dados, como por exemplo um ID inexistente.'}
          ]},
          {value: '422 - Erro de validação', children: [
            {value: 'Significa que você está tentando enviar um formulário com dados inválidos de acordo com regras da aplicação no servidor, verifique a mensagem de erro para mais informações.'}
          ]}

        ]
      }
    ]
  }

}
