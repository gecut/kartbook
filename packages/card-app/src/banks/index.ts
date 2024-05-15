import ansar from './ansar.png?inline';
import ayandeh from './ayandeh.png?inline';
import bankMarkazi from './bank-markazi.png?inline';
import blu from './blu.png?inline';
import caspian from './caspian.png?inline';
import dey from './dey.png?inline';
import eghtesadNovin from './eghtesad-novin.png?inline';
import futurebank from './futurebank.png?inline';
import gardeshgari from './gardeshgari.png?inline';
import ghavamin from './ghavamin.png?inline';
import hekmat from './hekmat.png?inline';
import iranEurope from './iran-europe.png?inline';
import iranVenezuela from './iran-venezuela.png?inline';
import iranZamin from './iran-zamin.png?inline';
import karafarin from './karafarin.png?inline';
import keshavarzi from './keshavarzi.png?inline';
import khavarMianeh from './khavar-mianeh.png?inline';
import kosar from './kosar.png?inline';
import maskan from './maskan.png?inline';
import mehrEghtesad from './mehr-eghtesad.png?inline';
import mehrIran from './mehr-iran.png?inline';
import melall from './melall.png?inline';
import mellat from './mellat.png?inline';
import melli from './melli.png?inline';
import noor from './noor.png?inline';
import parsian from './parsian.png?inline';
import pasargad from './pasargad.png?inline';
import post from './post.png?inline';
import refah from './refah.png?inline';
import resalat from './resalat.png?inline';
import saderat from './saderat.png?inline';
import saman from './saman.png?inline';
import sanatMadan from './sanat-madan.png?inline';
import sarmayeh from './sarmayeh.png?inline';
import sepah from './sepah.png?inline';
import shahr from './shahr.png?inline';
import sina from './sina.png?inline';
import tejarat from './tejarat.png?inline';

const banksLogo = {
  ansar,
  caspian,
  gardeshgari,
  iranEurope,
  keshavarzi,
  mehrEghtesad,
  melli,
  post,
  saman,
  shahr,
  ayandeh,
  dey,
  ghavamin,
  iranVenezuela,
  khavarMianeh,
  mehrIran,
  noor,
  refah,
  sanatMadan,
  sina,
  bankMarkazi,
  eghtesadNovin,
  hekmat,
  iranZamin,
  kosar,
  melall,
  parsian,
  resalat,
  sarmayeh,
  tejarat,
  blu,
  futurebank,
  karafarin,
  maskan,
  mellat,
  pasargad,
  saderat,
  sepah,
} as const;

const banksBINs: Record<`${number}`, keyof typeof banksLogo> = {
  '502938': 'dey',
  '627412': 'eghtesadNovin',
  '505416': 'gardeshgari',
  '639599': 'ghavamin',
  '627488': 'karafarin',
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
};

export type BankInfo = null | {bin: `${number}`; bankName: keyof typeof banksLogo; bankLogo: string};

export function getBankInfo(cardNumber: [string, string, string, string]): BankInfo {
  try {
    const bin: `${number}` = (cardNumber[0].toString() + cardNumber[1].toString().slice(0, 2)) as `${number}`;
    const bankName = banksBINs[bin];
    const bankLogo = banksLogo[bankName];

    return {bin, bankName, bankLogo};
  }
  catch (error) {
    console.error(error);

    return null;
  }
}
