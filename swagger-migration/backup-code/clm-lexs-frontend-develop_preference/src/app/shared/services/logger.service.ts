import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export let debugLevel = environment.debugLevel;
const noop = (): any => undefined;

@Injectable()
export class LoggerService {
  isAppRunningInDebug() {
    if (debugLevel >= LogLevel.Debug) {
      const styling = `color: black; background-color: #fcf6bd; padding: 4px;font-weight: 100;font-family: Courier;font-size: 12px;`;
      let msg = 'Beware! App is running in debug mode but in Production debug mode must be disabled.';
      console.warn(`%c%s`, styling, msg);
    }
  }

  get logAPIRequest() {
    let color = `background-color: #0466c8; color: white;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c [⚡API⚡][REQUEST] `, color);
    } else {
      return noop;
    }
  }

  get logResolverStart() {
    let color = `background-color: black; color: #7DF9FF;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c 💡 [⚡RESOLVER⚡][START...] `, color);
    } else {
      return noop;
    }
  }

  get logResolverProcess() {
    let color = `background-color: black; color: #7DF9FF;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c 🕝 [⚡RESOLVER⚡][PROCESS...] `, color);
    } else {
      return noop;
    }
  }

  get logResolverEnd() {
    let color = `background-color: black; color: #7DF9FF;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c ✅ [⚡RESOLVER⚡][END] `, color);
    } else {
      return noop;
    }
  }

  get logAPIResponse() {
    let color = `background-color: #0466c8; color: white;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c [⚡API⚡][RESPONSE] `, color);
    } else {
      return noop;
    }
  }

  get debug() {
    let color = `background-color: #fcf6bd; color: black;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Debug)) {
      return console.info.bind(console, `%c [DEBUG] `, color);
    } else {
      return noop;
    }
  }

  get info() {
    let color = `background-color: #dfe7fd; color: black;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Info)) {
      return console.info.bind(console, `%c [INFO] `, color);
    } else {
      return noop;
    }
  }

  get warn() {
    let color = `background-color: #ffcb77; color: black;`;
    if (this.isAllowedLevel(LogLevel.Warn)) {
      return console.info.bind(console, `%c [WARN] `, color);
    } else {
      return noop;
    }
  }

  get error() {
    let color = `background-color: #ff758f; color: white;`;
    if (this.isAllowedLevel(LogLevel.Error)) {
      return console.info.bind(console, `%c ❌ [ERROR] `, color);
    } else {
      return noop;
    }
  }

  get navigation() {
    let color = `background-color: #77ffeb; color: black;`;
    if (environment.inspect && this.isAllowedLevel(LogLevel.Warn)) {
      return console.info.bind(console, `%c [ ➡️ NAVIGATION ➡️ ] `, color);
    } else {
      return noop;
    }
  }

  get catchError() {
    let color = `background-color: #ff758f; color: white;`;
    if (this.isAllowedLevel(LogLevel.Error)) {
      return console.info.bind(console, `%c ❌ [CATCH ERROR] `, color);
    } else {
      return noop;
    }
  }

  get fatal() {
    let color = `background-color: #e63946; color: white;`;
    if (this.isAllowedLevel(LogLevel.Fatal)) {
      return console.info.bind(console, `%c [FATAL]`, color, '🔥🔥🔥');
    } else {
      return noop;
    }
  }

  createGroup(groupName: string) {
    console.group(`%c ${groupName} `, `background-color: #38b000; color: #FFFF;`);
  }
  closeGroup() {
    console.groupEnd();
  }

  private isAllowedLevel(level: LogLevel): boolean {
    let ret: boolean = false;
    if ((debugLevel >= level && debugLevel !== LogLevel.Off) || debugLevel === LogLevel.All) {
      ret = true;
    }
    return ret;
  }
}
export enum LogLevel {
  All = 6,
  Debug = 5,
  Info = 4,
  Warn = 3,
  Error = 2,
  Fatal = 1,
  Off = 0,
}
