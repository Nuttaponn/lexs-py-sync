import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, timer, of, merge, Subscription, Subscriber, catchError, mergeMap } from 'rxjs';
import { Configuration } from '../api-client/configuration';
import { StompOptions, STOMP_OPTIONS } from './stomp-options';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { Versions } from '@stomp/stompjs';
import { Platform } from '@angular/cdk/platform';
import SockJS from 'sockjs-client';

export interface Frame<T> {
  type: 'CONNECTED' | 'MESSAGE' | 'ERROR';
  data?: T;
  e?: any;
}

export class RxStompService extends RxStomp {}

@Injectable({
  providedIn: 'root',
})
export class StompClient {
  private disconnectSignal = new Subject();
  private subscription = 0;
  private webSocketUrl;
  private topicUrl;
  private rxStompService!: RxStompService;

  constructor(
    private configuration: Configuration,
    @Inject(STOMP_OPTIONS) stompOptions: StompOptions,
    public platform: Platform
  ) {
    stompOptions = StompOptions.applyDefault(stompOptions);
    this.webSocketUrl = stompOptions.webSocketUrl;
    this.topicUrl = stompOptions.topicUrl;
  }

  private ensureConnection() {
    // already connect, exit
    if (this.rxStompService && this.rxStompService.connected()) {
      return Promise.resolve();
    }

    console.log('Connecting StompJS...');
    // create new stomp
    console.log('Web socket URL: ' + this.configuration.basePath + this.webSocketUrl);
    const stompConfig: RxStompConfig = Object.assign(
      {},
      {
        debug: (e: any) => console.log(e),
        stompVersions: new Versions(['1.0', '1.1']),
        reconnectDelay: 1,
        heartbeatIncoming: 5,
        heartbeatOutgoing: 5,
        webSocketFactory: () => {
          if (this.platform.SAFARI) {
            return new WebSocket('wss://' + this.configuration.basePath?.replace('https://', '') + this.webSocketUrl);
          }
          return new SockJS(this.configuration.basePath + this.webSocketUrl);
        },
      },
      {
        connectHeaders: {
          Authorization: this.configuration.lookupCredential('token') || '',
        },
      }
    );

    this.rxStompService = new RxStompService();
    this.rxStompService.stompClient.webSocketFactory;
    //this.rxStompService.stompClient.
    this.rxStompService.configure(stompConfig);
    return new Promise((ok, ko) => {
      try {
        this.rxStompService.activate();
        ok(null);
      } catch (e) {
        console.log(e);
        this.rxStompService.deactivate();
        this.disconnectSignal.next(e);
        ko();
      }
    });
  }

  private subscribe<T>(topic: string, ob: Subscriber<Frame<T>>) {
    // subscribe rxjs
    console.log('Enter listening...', ob);
    this.subscription++;
    let stompSub: Subscription;
    const disconnectSub = this.disconnectSignal.subscribe(e => ob.error(e));

    // connect to topic
    this.ensureConnection()
      .then(() => {
        stompSub = this.rxStompService
          .watch(this.topicUrl + topic, { Authorization: this.configuration.lookupCredential('token') || '' })
          .subscribe(v => {
            console.log(v);
            ob.next({ type: 'MESSAGE', data: JSON.parse(v.body) });
          });
        ob.next({ type: 'CONNECTED' });
      })
      .catch(e => ob.error(e));

    // unsubscribe rxjs
    return () => {
      console.log('Exit listening...');
      disconnectSub.unsubscribe();

      if (stompSub) {
        stompSub.unsubscribe();
      }
      this.subscription--;
      if (this.subscription <= 0 && this.rxStompService) {
        console.log('Disconnect StompJS...');
        this.rxStompService.deactivate();
      }
    };
  }

  listen<T>(topic: string): Observable<Frame<T>> {
    // subscribe
    // on error, wait and loop
    return new Observable<Frame<T>>(ob => this.subscribe(topic, ob)).pipe(
      catchError(e => merge(of<Frame<T>>({ type: 'ERROR', e }), timer(5000).pipe(mergeMap(_ => this.listen<T>(topic)))))
    );
  }
}
