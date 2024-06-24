export const banksIdList = [
  'ansar',
  'caspian',
  'gardeshgari',
  'iranEurope',
  'keshavarzi',
  'mehrEghtesad',
  'melli',
  'post',
  'saman',
  'shahr',
  'ayandeh',
  'dey',
  'ghavamin',
  'iranVenezuela',
  'khavarMianeh',
  'mehrIran',
  'noor',
  'refah',
  'sanatMadan',
  'sina',
  'bankMarkazi',
  'eghtesadNovin',
  'hekmat',
  'iranZamin',
  'kosar',
  'melall',
  'parsian',
  'resalat',
  'sarmayeh',
  'tejarat',
  'blu',
  'futurebank',
  'karafarin',
  'maskan',
  'mellat',
  'pasargad',
  'saderat',
  'sepah',
] as const;

export const banksBinList: Record<`${number}`, (typeof banksIdList)[number]> = {
  '502938': 'dey',
  '627412': 'eghtesadNovin',
  '505416': 'gardeshgari',
  '639599': 'ghavamin',
  '627488': 'karafarin',
  '585947': 'khavarMianeh',
  '603770': 'keshavarzi',
  '628023': 'maskan',
  '606256': 'melall',
  '610433': 'mellat',
  '603799': 'melli',
  '507677': 'noor',
  '622106': 'parsian',
  '502229': 'pasargad',
  '627760': 'post',
  '589463': 'refah',
  '603769': 'saderat',
  '621986': 'saman',
  '627961': 'sanatMadan',
  '639607': 'sarmayeh',
  '589210': 'sepah',
  '504706': 'shahr',
  '639346': 'sina',
  '627353': 'tejarat',
} as const;

export default class IranianBanks {
  constructor(cardNumber: [string, string, string, string]) {
    this.number = cardNumber;
    this.id = IranianBanks._$getIdByCardNumber(cardNumber);
  }

  readonly id: (typeof banksIdList)[number];
  readonly number: [string, string, string, string];

  private static _$getIdByCardNumber(cardNumber: [string, string, string, string]): (typeof banksIdList)[number] {
    const bin: `${number}` = (cardNumber[0].toString() + cardNumber[1].toString().slice(0, 2)) as `${number}`;

    return banksBinList[bin];
  }
}
