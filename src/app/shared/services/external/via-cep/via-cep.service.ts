import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDTO } from '../../../../core';
import { firstValueFrom } from 'rxjs';

interface ViaCep {
  cep: string,
  logradouro: string,
  bairro: string,
  cidade: string,
  uf: string
  ibge: string
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  host = 'https://viacep.com.br/ws/${cep}/json/'

  constructor(
    private _http: HttpClient
  ) { }

  async findZipCode(zipCode: string): Promise<AddressDTO> {
    const url = this.host.replace('${cep}', zipCode)
    const viaCep = await firstValueFrom(this._http.get<ViaCep>(url))
    return {
      street: viaCep.logradouro,
      neighborhood: viaCep.bairro,
      city: { id: Number(viaCep.ibge), state: { id: Number(viaCep.ibge.substring(0,2)), abbreviation: viaCep.uf} }
    }
  }
}
