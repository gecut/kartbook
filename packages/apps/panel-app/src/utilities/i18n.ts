import {GecutI18N} from '@gecut/i18n';

export const i18n = new GecutI18N({
  sourceLanguage: {
    dir: 'ltr',
    formatters: {
      date: {},
      number: {},
      dateTime: {},
      time: {},
    },
    localName: 'English',
    name: 'en-US',
    translations: {
      one_years_ago: 'last year',
      one_months_ago: 'last month',
      one_days_ago: 'last day',
      one_hours_ago: 'last hour',
      one_minutes_ago: 'last minute',
      one_seconds_ago: 'last second',

      other_years_ago: '{0} years ago',
      other_months_ago: '{0} months ago',
      other_days_ago: '{0} days ago',
      other_hours_ago: '{0} hours ago',
      other_minutes_ago: '{0} minutes ago',
      other_seconds_ago: '{0} seconds ago',

      one_years: 'last year and',
      one_months: 'last month and',
      one_days: 'last day and',
      one_hours: 'last hour and',
      one_minutes: 'last minute and',
      one_seconds: 'last second and',

      other_years: '{0} years',
      other_months: '{0} months',
      other_days: '{0} days',
      other_hours: '{0} hours',
      other_minutes: '{0} minutes',
      other_seconds: '{0} seconds',

      and: 'and',

      just_now: 'Just Now',
    },
  },
  targetLanguages: [
    {
      dir: 'rtl',
      formatters: {
        date: {
          dateStyle: 'full',
          timeStyle: undefined,
        },
        number: {},
        dateTime: {
          dateStyle: 'full',
          timeStyle: 'full',
          timeZone: 'Asia/Tehran',
        },
        time: {
          timeStyle: 'full',
          timeZone: 'Asia/Tehran',
        },
      },
      localName: 'فارسی',
      name: 'fa-IR',
      translations: {
        one_years_ago: 'یک سال پیش',
        one_months_ago: 'یک ماه پیش',
        one_days_ago: 'یک روز پیش',
        one_hours_ago: 'یک ساعت پیش',
        one_minutes_ago: 'یک دقیقه پیش',
        one_seconds_ago: 'یک ثانیه پیش',

        other_years_ago: '{0} سال پیش',
        other_months_ago: '{0} ماه پیش',
        other_days_ago: '{0} روز پیش',
        other_hours_ago: '{0} ساعت پیش',
        other_minutes_ago: '{0} دقیقه پیش',
        other_seconds_ago: '{0} ثانیه پیش',

        one_years: 'یک سال',
        one_months: 'یک ماه',
        one_days: 'یک روز',
        one_hours: 'یک ساعت',
        one_minutes: 'یک دقیقه',
        one_seconds: 'یک ثانیه',

        other_years: '{0} سال',
        other_months: '{0} ماه',
        other_days: '{0} روز',
        other_hours: '{0} ساعت',
        other_minutes: '{0} دقیقه',
        other_seconds: '{0} ثانیه',

        and: 'و',

        just_now: 'همین الان',
      },
    },
  ],
});

i18n.setLocale('fa-IR');
