export const banksIdList = [
  'ansar',
  'caspian',
  'gardeshgari',
  'iran-europe',
  'keshavarzi',
  'mehr-eghtesad',
  'melli',
  'post',
  'saman',
  'shahr',
  'ayandeh',
  'dey',
  'ghavamin',
  'iran-venezuela',
  'khavar-mianeh',
  'mehrIran',
  'noor',
  'refah',
  'sanat-madan',
  'sina',
  'bank-markazi',
  'eghtesad-novin',
  'hekmat',
  'iran-zamin',
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

type BanksBinListType = Record<
  `${number}`,
  (typeof banksIdList)[number] | Record<`${number}`, (typeof banksIdList)[number]>
>;

export const banksBinList: BanksBinListType = {
  '502938': 'dey',
  '627412': 'eghtesad-novin',
  '505416': 'gardeshgari',
  '639599': 'ghavamin',
  '627488': 'karafarin',
  '585947': 'khavar-mianeh',
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
  '621986': {
    '10': 'saman',
    '19': 'blu',
  },
  '627961': 'sanat-madan',
  '639607': 'sarmayeh',
  '589210': 'sepah',
  '504706': 'shahr',
  '639346': 'sina',
  '627353': 'tejarat',
} as const;

export type RGBColor = {red: number; green: number; blue: number};
export type Info = {
  id: (typeof banksIdList)[number] | null;
  logo: string;
  color: RGBColor | null;
  image: HTMLImageElement | null;
};

export const cdnConfig = {
  base: 'https://cdn.k32.ir/',
  path: 'banks/logos/',
};

export default class IranianBanks {
  constructor(cardNumber: string) {
    this.number = cardNumber;
    this.id = IranianBanks._$getIdByCardNumber(cardNumber);

    if (this.id) {
      this.logo = cdnConfig.base + cdnConfig.path + this.id + '.png';
    }
    else {
      this.logo = cdnConfig.base + 'logo.png';
    }
  }

  private static infoCache = new Map<string, Info>();

  readonly id: (typeof banksIdList)[number] | null;
  readonly number: string;
  readonly logo: string;

  image?: HTMLImageElement;

  get color() {
    return new Promise<RGBColor | null>(async (resolve) => {
      try {
        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        this.image.alt = this.id ?? '';
        this.image.src = this.logo;

        this.image.addEventListener('load', () => {
          const canvas = document.createElement('canvas');
          canvas.width = this.image!.width;
          canvas.height = this.image!.height;

          const context = canvas.getContext('2d');

          if (context) {
            context.drawImage(this.image!, 0, 0);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }

            const avgR = Math.round(r / count);
            const avgG = Math.round(g / count);
            const avgB = Math.round(b / count);

            resolve({red: avgR, green: avgG, blue: avgB});

            canvas.remove();
          }
          else {
            resolve(null);
          }
        });

        this.image.addEventListener('error', () => {
          throw new Error('load image failed');
        });
      }
      catch (error) {
        console.error('IranianBanks.color', error);

        resolve(null);
      }
    });
  }

  private static _$getIdByCardNumber(
    cardNumber: string,
  ): (typeof banksIdList)[number] | null {
    const bin: `${number}` = (cardNumber.slice(0, 6)) as `${number}`;
    const result = banksBinList[bin];

    if (typeof result === 'string') return result;

    const subBin: `${number}` = cardNumber.slice(6, 8) as `${number}`;

    return result[subBin] ?? null;
  }

  static async getInfo(cardNumber: string): Promise<Info> {
    const cacheId = cardNumber;
    const cache = this.infoCache.get(cacheId);

    if (cache != null) return cache;

    const bank = new IranianBanks(cardNumber);

    const info = {
      id: bank.id,
      logo: bank.logo,
      color: await bank.color,
      image: bank.image ?? null,
    };

    this.infoCache.set(cacheId, info);

    return info;
  }
}
