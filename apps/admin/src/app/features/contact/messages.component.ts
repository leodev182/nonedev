import { Component, inject, signal, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import type { ContactMessage } from '@portfolio/contracts'
import { ApiService } from '../../core/http/api.service'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  template: `
    <div class="page">
      <h1 class="page__title">Mensajes de contacto</h1>

      <table mat-table [dataSource]="messages()" class="mat-elevation-z1">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let m" [class.unread]="!m.read">{{ m.name }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let m">{{ m.email }}</td>
        </ng-container>

        <ng-container matColumnDef="message">
          <th mat-header-cell *matHeaderCellDef>Mensaje</th>
          <td mat-cell *matCellDef="let m" class="truncate">{{ m.message }}</td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let m">{{ m.createdAt | date:'dd MMM yyyy' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let m">
            @if (!m.read) {
              <button mat-icon-button (click)="markRead(m.id)" title="Marcar como leído">
                <mat-icon>mark_email_read</mat-icon>
              </button>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols" [class.unread-row]="!row.read"></tr>
      </table>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; }
    .page__title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
    table { width: 100%; }
    .truncate { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .unread-row { font-weight: 600; }
  `],
})
export class MessagesComponent implements OnInit {
  private readonly api = inject(ApiService)
  readonly messages = signal<ContactMessage[]>([])
  readonly cols = ['name', 'email', 'message', 'date', 'actions']

  ngOnInit() {
    this.api.getMessages().subscribe(res => {
      this.messages.set(res.data.data)
    })
  }

  markRead(id: string) {
    this.api.markRead(id).subscribe(() => {
      this.messages.update(msgs =>
        msgs.map(m => m.id === id ? { ...m, read: true } : m),
      )
    })
  }
}
