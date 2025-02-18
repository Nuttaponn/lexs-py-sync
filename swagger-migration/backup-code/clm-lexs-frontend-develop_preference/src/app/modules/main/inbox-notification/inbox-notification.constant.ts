// LAST UPDATED ON -24 JUL 2023- //

import { AuctionMenu as AUCTION_MENU } from '@app/modules/auction/auction.model';
import { TMode } from '@app/shared/models';

enum NT_CODE {
  NT00001 = 'NT00001',
  NT00002 = 'NT00002',
  NT03001 = 'NT03001',
  NT03002 = 'NT03002',
  NT04001 = 'NT04001',
  NT04002 = 'NT04002',
  NT04003 = 'NT04003',
  NT05001 = 'NT05001',
  NT05002 = 'NT05002',
  NT05003 = 'NT05003',
  NT05004 = 'NT05004',
  NT05006 = 'NT05006',
  NT41001 = 'NT41001',
  NT41002 = 'NT41002',
  NT41003 = 'NT41003',
  NT41004 = 'NT41004',
  NT06001 = 'NT06001',
  NT06002 = 'NT06002',
  NT06003 = 'NT06003',
  NT06004 = 'NT06004',
  NT06005 = 'NT06005',
  NT07002 = 'NT07002',
  NT07003 = 'NT07003',
  NT07004 = 'NT07004',
  NT07006 = 'NT07006',
  NT07007 = 'NT07007',
  NT07008 = 'NT07008',
  NT09002 = 'NT09002',
  NT09003 = 'NT09003',
  NT09004 = 'NT09004',
  NT09005 = 'NT09005',
  NT09006 = 'NT09006',
  NT09007 = 'NT09007',
  NT09008 = 'NT09008',
  NT09009 = 'NT09009',
  NT09010 = 'NT09010',
  NT09011 = 'NT09011',
  NT09012 = 'NT09012',
  NT09013 = 'NT09013',
  NT09014 = 'NT09014',
  NT10001 = 'NT10001',
  NT10002 = 'NT10002',
  NT10003 = 'NT10003',
  NT11001 = 'NT11001',
  NT11002 = 'NT11002',
  NT11003 = 'NT11003',
  NT12001 = 'NT12001',
  NT12002 = 'NT12002',
  NT12003 = 'NT12003',
  NT28001 = 'NT28001',
  NT28002 = 'NT28002',
  NT28003 = 'NT28003',
  NT29001 = 'NT29001',
  NT29002 = 'NT29002',
  NT29003 = 'NT29003',
  NT39001 = 'NT39001',
  NT39002 = 'NT39002',
  NT40001 = 'NT40001',
}

export const notificationMapper = new Map<string, string>([
  [NT_CODE.NT00001, '/main/lawsuit/detail'],
  [NT_CODE.NT00002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT03001, '/main/lawsuit/detail'],
  [NT_CODE.NT03002, '/main/lawsuit/detail'],
  [NT_CODE.NT04001, '/main/lawsuit/detail'],
  [NT_CODE.NT04002, '/main/lawsuit/detail'],
  [NT_CODE.NT04003, '/main/lawsuit/detail'],
  [NT_CODE.NT05001, '/main/lawsuit/detail'],
  [NT_CODE.NT05002, '/main/lawsuit/detail'],
  [NT_CODE.NT05003, '/main/lawsuit/detail'],
  [NT_CODE.NT05004, '/main/lawsuit/detail'],
  [NT_CODE.NT05006, '/main/lawsuit/detail'],
  [NT_CODE.NT41001, '/main/lawsuit/detail'],
  [NT_CODE.NT41002, '/main/lawsuit/detail'],
  [NT_CODE.NT41003, '/main/lawsuit/detail'],
  [NT_CODE.NT41004, '/main/lawsuit/detail'],
  [NT_CODE.NT06001, '/main/lawsuit/detail'],
  [NT_CODE.NT06002, '/main/lawsuit/detail'],
  [NT_CODE.NT06003, '/main/lawsuit/withdrawn-writ-execution'],
  [NT_CODE.NT06004, '/main/lawsuit/withdrawn-writ-execution'],
  [NT_CODE.NT06005, '/main/lawsuit/withdrawn-writ-execution'],
  [NT_CODE.NT07002, '/main/lawsuit/detail'],
  [NT_CODE.NT07003, '/main/lawsuit/detail'],
  [NT_CODE.NT07004, '/main/lawsuit/detail'],
  [NT_CODE.NT07006, '/main/lawsuit/detail'],
  [NT_CODE.NT07007, '/main/lawsuit/detail'],
  [NT_CODE.NT07008, '/main/lawsuit/deferment/defer/main'],
  [NT_CODE.NT09002, '/main/lawsuit/auction'], // TODO expected routing with params /main/lawsuit/auction?mode=VIEW&litigationId=LE2566040006&litigationCaseId=10208&ledId=27&auctionExpenseId=245&taskCode=R2E09-02-3B&requestMenu=VIEW_PAYMENT
  [NT_CODE.NT09003, '/main/lawsuit/auction/auction-detail'], // TODO WITH param litigationCaseId, litigationId, aucLedSeq, aucRef
  [NT_CODE.NT09004, '/main/lawsuit/auction/auction-detail'], // TODO WITH param litigationCaseId, litigationId, aucLedSeq, aucRef
  [NT_CODE.NT09005, '/main/lawsuit/auction/auction-appointment-date'], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT09006, '/main/lawsuit/auction/auction-appointment-date'], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT09007, '/main/lawsuit/auction/owner-transfer'], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT09008, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT09009, '/main/lawsuit/auction/owner-transfer'],
  [NT_CODE.NT09010, '/main/lawsuit/auction/owner-transfer'], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT09011, '/main/lawsuit/auction/auction-detail'],
  [NT_CODE.NT09012, '/main/lawsuit/auction/auction-detail'],
  [NT_CODE.NT09013, ''], // NO PATH
  [NT_CODE.NT09014, '/main/lawsuit/auction/owner-transfer'],
  [NT_CODE.NT10001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT10002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT10003, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT11001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT11002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT11003, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT12001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT12002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT12003, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT28001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT28002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT28003, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT29001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT29002, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT29003, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT39001, ''], // TODO WAIT FOR PATH CONFIRM
  [NT_CODE.NT39002, '/main/task'],
  [NT_CODE.NT40001, '/main/lawsuit'],
]);

export const notificationMapperTabIndex = new Map<string, TabIndex>([
  [NT_CODE.NT00001, { tabIndex: 2, subIndex: 3, underSubIndex: 0 }],
  [NT_CODE.NT00002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT03001, { tabIndex: 4, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT03002, { tabIndex: 4, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT04001, { tabIndex: 2, subIndex: 4, underSubIndex: 0 }],
  [NT_CODE.NT04002, { tabIndex: 2, subIndex: 4, underSubIndex: 1 }],
  [NT_CODE.NT04003, { tabIndex: 2, subIndex: 4, underSubIndex: 1 }],
  [NT_CODE.NT05001, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT05002, { tabIndex: 2, subIndex: 5, underSubIndex: 1 }],
  [NT_CODE.NT05003, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT05004, { tabIndex: 2, subIndex: 5, underSubIndex: 1 }],
  [NT_CODE.NT05006, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT41001, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT41002, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT41003, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT41004, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT06001, { tabIndex: 2, subIndex: 5, underSubIndex: 0 }],
  [NT_CODE.NT06002, { tabIndex: 2, subIndex: 5, underSubIndex: 1 }],
  [NT_CODE.NT06003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT06004, { tabIndex: 2, subIndex: 5, underSubIndex: 1 }],
  [NT_CODE.NT06005, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT07002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT07003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT07004, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT07006, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  [NT_CODE.NT07007, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }],
  // [NT_CODE.NT07008, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // Edit Mode บันทึกชะลอบังคับคดี screen
  [NT_CODE.NT09002, { tabIndex: 2, subIndex: 6 }],
  [NT_CODE.NT09003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09004, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09005, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09006, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09007, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09008, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09009, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT09010, { tabIndex: 2, subIndex: 6, underSubIndex: 0 }],
  [NT_CODE.NT09011, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT10001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT10002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT10003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT11001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT11002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT11003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT12001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT12002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT12003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT28001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT28002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT28003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT29001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT29002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT29003, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT39001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT39002, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
  [NT_CODE.NT40001, { tabIndex: 0, subIndex: 0, underSubIndex: 0 }], // TODO WAIT FOR SUB TASK [INDEX] CONFIRM
]);

export const localParamsMapper = new Map<string, any>([
  [NT_CODE.NT09002, { auctionMenu: AUCTION_MENU.VIEW_PAYMENT }],
  [NT_CODE.NT09003, { auctionMenu: AUCTION_MENU.VIEW_CASHIER }],
  [NT_CODE.NT09004, { auctionMenu: AUCTION_MENU.VIEW_CASHIER }],
  [
    NT_CODE.NT09009,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_OWNERSHIP_TRNASFER,
    },
  ],
  [
    NT_CODE.NT09007,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_OWNERSHIP_TRNASFER_MAS,
    },
  ],
  [
    NT_CODE.NT09010,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_OWNERSHIP_TRNASFER,
    },
  ],
  [
    NT_CODE.NT09011,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_ACCOUNT,
    },
  ],
  [
    NT_CODE.NT09012,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_ACCOUNT,
    },
  ],
  [
    NT_CODE.NT09014,
    {
      mode: TMode.VIEW,
      auctionMenu: AUCTION_MENU.VIEW_OWNERSHIP_TRNASFER_DATE_TIME,
    },
  ],
]);
export interface TabIndex {
  tabIndex?: number;
  subIndex?: number;
  underSubIndex?: number;
}
