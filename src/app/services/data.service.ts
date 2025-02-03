import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getResultados(): Observable<any> {
    return this.http.get<any>('assets/resultados.json');
  }

  getSistemaPontuacao(): Observable<any> {
    return this.http.get<any>('assets/sistema_pontuacao.json');
  }
}
