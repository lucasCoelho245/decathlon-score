import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  public atletas: any[] = [];
  sistemaPontuacao: any = {};
  private dataService = inject(DataService);

  public ngOnInit(): void {
    this.dataService.getSistemaPontuacao().subscribe((data: any) => {
      this.sistemaPontuacao = data;

      this.dataService.getResultados().subscribe((resultados: any) => {
        this.atletas = resultados
          .map((atleta: any) => ({
            ...atleta,
            score: this.calcularPontuacao(atleta)
          }))
          .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

        this.atletas = this.ajustarPosicoes(this.atletas);
      });
    });
  }

  public calcularPontuacao(atleta: any): number {
    let total = 0;

    for (const evento in this.sistemaPontuacao) {
      if (this.sistemaPontuacao.hasOwnProperty(evento) && atleta.hasOwnProperty(evento)) {
        const { A, B, C } = this.sistemaPontuacao[evento];
        let P = atleta[evento];

        if (evento === "1500m" && typeof P === 'string') {
          const tempoRegex = /^(\d+):(\d+(\.\d+)?)$/;
          const match = P.match(tempoRegex);
          if (match) {
            const min = parseFloat(match[1]);
            const sec = parseFloat(match[2]);
            P = min * 60 + sec;
          } else {
            console.warn(`Erro ao converter tempo para ${evento}:`, P);
            continue;
          }
        }

        let pontos = 0;
        if (evento.includes('throw') || evento.includes('jump')) {
          pontos = Math.max(0, Math.floor(A * Math.pow(Math.max(P - B, 0), C)));
        } else {
          pontos = Math.max(0, Math.floor(A * Math.pow(Math.max(B - P, 0), C)));
        }

        total += pontos;
      } else {
        console.warn(`Evento ${evento} não encontrado para ${atleta.name}`);
      }
    }
    return total;
  }

  public ajustarPosicoes(atletas: any[]): any[] {
    let posicao = 1;
    return atletas.map((atleta, index, array) => {
      if (index > 0 && atleta.score === array[index - 1].score) {
        atleta.posicao = array[index - 1].posicao;
      } else {
        atleta.posicao = posicao;
      }
      posicao++;
      return atleta;
    });
  }

  public exportToCsv(): void {
    if (!this.atletas || this.atletas.length === 0) {
      console.warn("Nenhum dado disponível para exportação.");
      return;
    }

    const headers = [
      'Posição', 'Nome', 'Score', '100m', 'Long Jump', 'Shot Put', 'High Jump', '400m',
      '110m Hurdles', 'Discus Throw', 'Pole Vault', 'Javelin Throw', '1500m'
    ].join(';');

    const csvRows = this.atletas.map((atleta: any) =>
      [
        atleta.posicao,
        `"${atleta.name}"`,
        `${atleta.score} pts`,
        `${atleta['100m'] ?? '-'}`,
        `${atleta['long_jump'] ?? '-'}`,
        `${atleta['shot_put'] ?? '-'}`,
        `${atleta['high_jump'] ?? '-'}`,
        `${atleta['400m'] ?? '-'}`,
        `${atleta['110m_hurdles'] ?? '-'}`,
        `${atleta['discus_throw'] ?? '-'}`,
        `${atleta['pole_vault'] ?? '-'}`,
        `${atleta['javelin_throw'] ?? '-'}`,
        `${atleta['1500m'] ?? '-'}`
      ].join(';')
    );

    const csvString = [headers, ...csvRows].join('\n');

    const bom = "\ufeff";
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultados_decathlon.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
