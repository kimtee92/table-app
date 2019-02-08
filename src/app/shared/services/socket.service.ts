import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../model/guest';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080/';
// const SERVER_URL = 'https://prototype-uts-backend.herokuapp.com/';

@Injectable()
export class SocketService {
    private socket;

    constructor(private http: HttpClient) {}

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public register = (guest: Guest) => {
        this.socket.emit('guest', guest);
    }

    public onRegister(): Observable<Guest> {
        return new Observable<Guest>(observer => {
            this.socket.on('guest', (data: Guest) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public getAll() {
        return this.http.get(SERVER_URL + 'all');
    }
}
