import {gecutButton, icon} from '@gecut/components';
import IranianBanks from '@gecut/kartbook-banks-data';
import {GecutState, gecutContext, map} from '@gecut/lit-helper';
import debounce from '@gecut/utilities/debounce.js';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {until} from 'lit/directives/until.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {plansContext} from '../../contexts/plans.js';
import {sbm} from '../../utilities/sbm.js';
import {$CardRenderer} from '../components/card.js';
import {router} from '../router/index.js';
import {resolvePath} from '../router/resolver.js';

import SolarCard2LineDuotone from '~icons/solar/card-2-line-duotone';
import SolarEarthLineDuotone from '~icons/solar/earth-line-duotone';
import SolarUndoLeftLineDuotone from '~icons/solar/undo-left-line-duotone';
import SvgSpinnersRingResize from '~icons/svg-spinners/ring-resize';

import type {CardData, OrderData} from '@gecut/kartbook-types';
import type {ArrayValues, PartialDeep} from '@gecut/types';

export function $CreateCardPage() {
  const slides = ['cardNumber', 'preview', 'slug', 'plan'] as const;
  const createCardSlides = new GecutState<ArrayValues<typeof slides>>('create-card.slides', 'cardNumber');
  const createCardLoading = new GecutState<boolean>('create-card.loading', false);
  const createCardMemory = new GecutState<PartialDeep<CardData>>('create-card.memory', {});

  const $OnFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const state = (createCardSlides.value ??= 'cardNumber');
    const form = (event.currentTarget || event.target) as HTMLFormElement;
    const data = new FormData(form);

    switch (state) {
      case 'cardNumber':
        const cardNumber1 = data.get('cardNumber1')?.toString();
        const cardNumber2 = data.get('cardNumber2')?.toString();
        const cardNumber3 = data.get('cardNumber3')?.toString();
        const cardNumber4 = data.get('cardNumber4')?.toString();

        if (cardNumber1 && cardNumber2 && cardNumber3 && cardNumber4) {
          const cardNumber = [cardNumber1, cardNumber2, cardNumber3, cardNumber4];

          createCardLoading.value = true;

          client.card.cardNumberExist
            .mutate({cardNumber})
            .then((exist) => {
              if (exist) {
                sbm.notify({
                  message: 'شماره کارت وارد شده وجود دارد.',
                  close: true,
                });

                throw new Error('card number exist');
              }

              return client.card.authorize.mutate({cardNumber});
            })
            .then((validatedCard) => {
              createCardMemory.value = {
                ...createCardMemory.value,

                cardNumber: validatedCard.cardNumber,
                iban: validatedCard.iban,
                ownerName: validatedCard.ownerName,
              };

              createCardSlides.value = 'preview';
            })
            .finally(() => (createCardLoading.value = false));
        }

        break;
      case 'slug':
        const slug = data.get('slug')?.toString();

        if (slug) {
          createCardMemory.value = {
            ...createCardMemory.value,

            slug,
          };

          createCardSlides.value = 'plan';
        }

        break;
      case 'plan':
        const card = createCardMemory.value;

        if (card && card.cardNumber && card.iban && card.slug && card.subscription?._id && card.ownerName) {
          const order: OrderData = await client.order.create.mutate({
            cardNumber: card.cardNumber,
            iban: card.iban,
            ownerName: card.ownerName,
            planId: card.subscription._id,
            slug: card.slug,
          });

          if (order.trackId) {
            window.open('https://gateway.zibal.ir/start/' + order.trackId, '_self');
          }
        }

        break;
      case 'preview':
        const confirm = Boolean(data.get('confirm')?.toString());

        if (confirm) {
          createCardSlides.value = 'slug';
        }
        else {
          sbm.notify({
            message: 'اطلاعات کارت را مطالعه و تایید کنید.',
            close: true,
          });
        }

        break;
    }

    return false;
  };

  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <form class="flex-1 flex flex-col justify-center gap-4 min-h-52 *:animate-fadeInSlide" @submit=${$OnFormSubmit}>
        ${createCardSlides.hydrate((state) =>
          stateManager(
            {
              cardNumber: () => html`
                <div class="flex flex-col gap-4 items-center justify-center">
                  <div class="text-primary [&>.gecut-icon]:text-[6rem]">${icon({svg: SolarCard2LineDuotone})}</div>
                </div>
                <div class="w-full text-center text-bodyMedium text-onSurfaceVariant">
                  شماره کارت 16 رقمی خود را وارد کنید.
                </div>
                <div class="flex w-full gap-4" dir="ltr">
                  <label class="gecut-input">
                    <input
                      type="text"
                      inputmode="numeric"
                      class="card-number"
                      .value=${createCardMemory.value?.cardNumber?.[0] ?? ''}
                      name="cardNumber1"
                      pattern="^[0-9]{4}$"
                      maxlength="4"
                      required
                    />
                  </label>
                  <label class="gecut-input">
                    <input
                      type="text"
                      inputmode="numeric"
                      class="card-number"
                      .value=${createCardMemory.value?.cardNumber?.[1] ?? ''}
                      name="cardNumber2"
                      pattern="^[0-9]{4}$"
                      maxlength="4"
                      required
                    />
                  </label>
                  <label class="gecut-input">
                    <input
                      type="text"
                      inputmode="numeric"
                      class="card-number"
                      .value=${createCardMemory.value?.cardNumber?.[2] ?? ''}
                      name="cardNumber3"
                      pattern="^[0-9]{4}$"
                      maxlength="4"
                      required
                    />
                  </label>
                  <label class="gecut-input">
                    <input
                      type="text"
                      inputmode="numeric"
                      class="card-number"
                      .value=${createCardMemory.value?.cardNumber?.[3] ?? ''}
                      name="cardNumber4"
                      pattern="^[0-9]{4}$"
                      maxlength="4"
                      required
                    />
                  </label>
                </div>
              `,
              preview: () => html`
                ${createCardMemory.hydrate(
                  (card) =>
                    html`${until(
                      when(card.cardNumber, () =>
                        IranianBanks.getInfo(card.cardNumber!).then((bank) =>
                          $CardRenderer(card.cardNumber!, card.iban ?? '', card.ownerName ?? '', bank),
                        ),
                      ),
                    )}`,
                )}

                <label class="px-4 flex gap-2">
                  <input type="checkbox" name="confirm" />

                  <span>اطلاعات فوق صحیح و آن را تایید میکنم.</span>
                </label>
              `,
              slug: () => {
                const slugOptions = new GecutState<{
                  value: null | string;
                  isExists: boolean;
                  loading: boolean;
                }>('slug.options', {
                  value: null,
                  isExists: false,
                  loading: false,
                });

                const onSlugInput = debounce((event: InputEvent) => {
                  const input = event.target as HTMLInputElement;

                  if (input.validity.patternMismatch === true) return;

                  slugOptions.value = {
                    loading: true,
                    value: input.value,
                    isExists: slugOptions.value?.isExists ?? false,
                  };

                  client.card.slugExist.mutate({slug: input.value}).then((exist) => {
                    slugOptions.value = {
                      loading: false,
                      isExists: exist,
                      value: slugOptions.value?.value ?? null,
                    };

                    if (exist) {
                      return input.setCustomValidity('Slug is exists');
                    }

                    return input.setCustomValidity('');
                  });
                }, 1024);

                return html`
                  <div class="flex flex-col gap-4 items-center justify-center">
                    <div class="text-primary [&>.gecut-icon]:text-[6rem]">${icon({svg: SolarEarthLineDuotone})}</div>
                  </div>

                  <div class="flex flex-col w-full">
                    <div class="w-full text-center text-bodyMedium text-onSurfaceVariant">
                      دامنه مورد نظر خود را وارد نمایید.
                    </div>
                    <div class="w-full text-center text-bodySmall text-onSurfaceVariant">
                      از دامنه جهت اشتراک گذاری کارت آنلاین استفاده خواهد شد.
                    </div>
                  </div>

                  <label class="gecut-input">
                    <input
                      type="text"
                      .value=${createCardMemory.value?.slug ?? ''}
                      name="slug"
                      pattern="^[a-z][a-z0-9]{3,16}$"
                      @input=${onSlugInput}
                      required
                    />

                    ${slugOptions.hydrate(({loading}) =>
                      when(
                        loading,
                        () => html`
                          <div class="loading">
                            ${icon({
                              svg: SvgSpinnersRingResize,
                            })}
                          </div>
                        `,
                      ),
                    )}
                  </label>

                  ${slugOptions.hydrate(({isExists, value}) =>
                    when(
                      isExists,
                      () => html`<span class="text-error">دامنه فوق موجود نمی باشد، دامنه دیگری انتخاب نمایید</span>`,
                      () => html`<span class="text-primary" dir="ltr">k32.ir/${value}</span>`,
                    ),
                  )}
                `;
              },
              plan: () => html`
                <h1 class="text-bodyLarge text-center">پلن اشتراک خود را انتخاب کنید</h1>
                <div class="flex flex-col gap-4">
                  ${gecutContext(plansContext, (plans) =>
                    map(
                      null,
                      plans,
                      (plan) => html`
                        <label
                          class="w-full h-24 group rounded-lg ring ring-transparent has-[:checked]:ring-primary
                                 relative overflow-hidden bg-surface"
                        >
                          <div class="absolute z-[1] inset-0 opacity-20 bg-surfaceVariant"></div>

                          ${when(
                            plan.patternUrl,
                            () => html`
                              <div
                                class="absolute z-[2] inset-0 opacity-10 bg-cover"
                                style="background-image:url('${plan.patternUrl ?? ''}');"
                              ></div>
                            `,
                          )}

                          <div class="w-full h-full flex gap-4 p-4 items-center absolute z-[3] inset-0">
                            <input
                              type="radio"
                              name="plan"
                              .value=${plan.name}
                              class="hidden"
                              @change=${() => {
                                createCardMemory.value = {
                                  ...createCardMemory.value,

                                  subscription: plan,
                                };
                              }}
                            />

                            <div class="size-5 rounded-full bg-surfaceVariant flex items-center justify-center">
                              <div class="size-3 rounded-full bg-transparent group-has-[:checked]:bg-primary"></div>
                            </div>

                            <div class="text-onSurface text-labelMedium grow">
                              ${unsafeHTML(plan.htmlTitle || plan.name)}
                            </div>

                            ${when(
                              plan.isPremium,
                              () => html`
                                <span class="text-onSurfaceVariant text-labelSmall group-has-[:checked]:text-primary">
                                  کد اختصاصی
                                </span>
                              `,
                              () => html`
                                <span class="text-onSurfaceVariant text-labelSmall group-has-[:checked]:text-primary">
                                  ${plan.price.toLocaleString('fa-IR')} ریال
                                </span>
                              `,
                            )}
                          </div>
                        </label>
                      `,
                    ),
                  )}
                </div>

                <div class="flex flex-col gap-4 pt-4 text-bodyMedium text-onSurfaceVariant *:animate-fadeIn">
                  ${createCardMemory.hydrate((card) =>
                    when(
                      card.subscription?.isPremium === true,
                      () => html`
                        <div class="flex w-full gap-4 [&>*:first-child]:grow [&>*:last-child]:px-3">
                          <label class="gecut-input">
                            <input
                              type="text"
                              name="discount"
                              pattern="^[a-Z0-9]{6}$"
                              maxlength="6"
                              placeholder="کد اختصاصی"
                            />
                          </label>
                          ${gecutButton({
                            type: 'filled',
                            label: 'فعال سازی',
                          })}
                        </div>
                        <div class="flex w-full justify-between items-center">
                          <span>هزینه اشتراک</span>
                          <span>${(0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                        <div class="flex w-full justify-between items-center">
                          <span>تخفیف</span>
                          <span>${(0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                        <div class="flex w-full justify-between items-center text-onSurface">
                          <span>جمع کل</span>
                          <span>${(0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                      `,
                      () => html`
                        <div class="flex w-full gap-4 [&>*:first-child]:grow [&>*:last-child]:px-3">
                          <label class="gecut-input">
                            <input
                              type="text"
                              name="discount"
                              pattern="^[a-Z0-9]{6}$"
                              maxlength="6"
                              placeholder="کد تخفیف"
                            />
                          </label>
                          ${gecutButton({
                            type: 'filledTonal',
                            label: 'اعمال',
                          })}
                        </div>
                        <div class="flex w-full justify-between items-center">
                          <span>هزینه اشتراک</span>
                          <span>${(card.subscription?.price || 0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                        <div class="flex w-full justify-between items-center">
                          <span>تخفیف</span>
                          <span>${(0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                        <div class="flex w-full justify-between items-center text-onSurface">
                          <span>جمع کل</span>
                          <span>${(card.subscription?.price || 0).toLocaleString('fa-IR')} ریال</span>
                        </div>
                      `,
                    ),
                  )}
                </div>
              `,
            },
            state,
          ),
        )}
        ${createCardLoading.hydrate(
          (loading) => html`
            <div class="flex gap-4 [&>*:first-child]:grow [&>*:last-child]:px-3">
              ${gecutButton({
                type: 'filled',
                htmlType: 'submit',
                label: 'ادامه',
                loading,
              })}
              ${gecutButton({
                type: 'filledTonal',
                htmlType: 'button',
                trailingIcon: {
                  svg: SolarUndoLeftLineDuotone,
                },
                disabled: loading,
                events: {
                  click: () => {
                    const currentIndex = slides.indexOf(createCardSlides.value ?? 'cardNumber');

                    if (currentIndex > 0) {
                      createCardSlides.value = slides[currentIndex - 1];
                    }
 else {
                      router.navigate(resolvePath('cards'));
                    }
                  },
                },
              })}
            </div>
          `,
        )}
      </form>
    </main>
  `;
}
