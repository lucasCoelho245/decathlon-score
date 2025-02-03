import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // OBRIGATÓRIO no Angular 18 para tornar o serviço acessível globalmente
})
export class DataService {
  constructor(private http: HttpClient) {}

  getResultados(): Observable<any> {
    return this.http.get<any>('assets/resultados.json'); // Força tipagem explícita
  }

  getSistemaPontuacao(): Observable<any> {
    return this.http.get<any>('assets/sistema_pontuacao.json'); // Força tipagem explícita
  }
}
