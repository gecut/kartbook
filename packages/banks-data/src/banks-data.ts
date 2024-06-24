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

export type RGBColor = {red: number; green: number; blue: number};
export type Info = {
  id: (typeof banksIdList)[number] | null;
  logo: string;
  color: RGBColor | null;
  image: HTMLImageElement | null;
};

export const cdnConfig = {
  base: 'https://k32-cdn.darkube.app/',
  path: 'banks/logos/',
};

export default class IranianBanks {
  constructor(cardNumber: [string, string, string, string]) {
    this.number = cardNumber;
    this.id = IranianBanks._$getIdByCardNumber(cardNumber);

    if (this.id) {
      this.logo = cdnConfig.base + cdnConfig.path + this.id + '.png';
    }
    else {
      this.logo = cdnConfig.base + 'logo.png';
    }
  }

  readonly id: (typeof banksIdList)[number] | null;
  readonly number: [string, string, string, string];
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
    cardNumber: [string, string, string, string],
  ): (typeof banksIdList)[number] | null {
    const bin: `${number}` = (cardNumber[0].toString() + cardNumber[1].toString().slice(0, 2)) as `${number}`;

    return banksBinList[bin] ?? null;
  }

  static async getInfo(cardNumber: [string, string, string, string]): Promise<Info> {
    const bank = new IranianBanks(cardNumber);

    return {
      id: bank.id,
      logo: bank.logo,
      color: await bank.color,
      image: bank.image ?? null,
    };
  }
}
