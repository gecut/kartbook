import {gecutButton, icon} from '@gecut/components';
import IranianBanks from '@gecut/kartbook-banks-data';
import {GecutState, map} from '@gecut/lit-helper';
import {arrayUtils} from '@gecut/utilities/data-types/array.js';
import debounce from '@gecut/utilities/debounce.js';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {until} from 'lit/directives/until.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {plansContext} from '../../contexts/plans.js';
import {lower, upper} from '../../utilities/input.js';
import {sbm} from '../../utilities/sbm.js';
import {$CardRenderer} from '../components/card.js';
import {router} from '../router/index.js';
import {resolvePath} from '../router/resolver.js';

import SolarCard2LineDuotone from '~icons/solar/card-2-line-duotone';
import SolarEarthLineDuotone from '~icons/solar/earth-line-duotone';
import SolarUndoLeftLineDuotone from '~icons/solar/undo-left-line-duotone';
import SvgSpinnersRingResize from '~icons/svg-spinners/ring-resize';

import type {CardData, DiscountData, OrderData, PlanData} from '@gecut/kartbook-types';
import type {ArrayValues, PartialDeep} from '@gecut/types';

type CreateCardMemory = {card: PartialDeep<CardData>; discount: DiscountData | null};

export function $CreateCardPage() {
  const slides = ['cardNumber', 'preview', 'slug', 'plan'] as const;
  const createCardSlides = new GecutState<ArrayValues<typeof slides>>('create-card.slides', 'cardNumber');
  const createCardLoading = new GecutState<boolean>('create-card.loading', false);

  const createCardMemory = new GecutState<CreateCardMemory>('create-card.memory', {
    card: {},
    discount: null,
  });

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
          const cardNumber = [cardNumber1, cardNumber2, cardNumber3, cardNumber4].join('');

          createCardLoading.value = true;

          client.card.cardNumberExist
            .mutate({cardNumber})
            .then((exist) => {
              if (exist) {
                sbm.notify({
                  message: 'شماره کارتی که وارد کردید قبلاً ثبت شده است.',
                  close: true,
                });

                throw new Error('card number exist');
              }

              return client.card.authorize.mutate({cardNumber});
            })
            .then((validatedCard) => {
              createCardMemory.value!.card.cardNumber = validatedCard.cardNumber;
              createCardMemory.value!.card.iban = validatedCard.iban;
              createCardMemory.value!.card.ownerName = validatedCard.ownerName;

              createCardSlides.value = 'preview';
            })
            .finally(() => (createCardLoading.value = false));
        }

        break;
      case 'slug':
        const slug = data.get('slug')?.toString();

        if (slug) {
          createCardMemory.value!.card.slug = slug;
          createCardSlides.value = 'plan';
        }

        break;
      case 'plan':
        const memory = createCardMemory.value;

        if (
          memory &&
          memory.card &&
          memory.card.cardNumber &&
          memory.card.iban &&
          memory.card.slug &&
          memory.card.subscription?._id &&
          memory.card.ownerName
        ) {
          const order: OrderData = await client.order.create.mutate({
            cardNumber: memory.card.cardNumber,
            iban: memory.card.iban,
            ownerName: memory.card.ownerName,
            planId: memory.card.subscription._id,
            slug: memory.card.slug,
            discountCode: memory.discount?.code ?? undefined,
          });

          if (order.status === 1) {
            router.navigate(
              resolvePath('cards/create/callback', {
                trackId: String(order.trackId),
                orderId: order._id,
              }),
            );
          }
          else if (order.trackId) {
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
            message: ' لطفا اطلاعات کارت را با دقت بررسی کرده و در صورت تایید، عملیات را ادامه دهید.',
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
              cardNumber: () => _$CardNumberSlide(createCardMemory.value),
              preview: () => _$PreviewSlide(createCardMemory.value),
              slug: () => _$SlugSlide(createCardMemory.value),
              plan: () => html`
                ${_$PlansList(plansContext.value ?? [], (plan) => {
                  createCardMemory.value!.card.subscription = plan;

                  if (createCardMemory.value!.discount != null) {
                    createCardMemory.value!.discount = null;

                    sbm.notify({
                      message: 'درصورت تعویض پلن اشتراک تخفیف حذف خواهد شد',
                      close: true,
                    });
                  }

                  createCardMemory.value! = createCardMemory.value!;
                })}

                <div class="flex flex-col gap-4 pt-4 text-bodyMedium text-onSurfaceVariant *:animate-fadeIn">
                  ${createCardMemory.hydrate((memory) =>
                    when(
                      memory.card.subscription?.isPremium === true,
                      () => _$PremiumOrder(memory),
                      () =>
                        _$NormalOrder(memory, (discount) => {
                          createCardMemory.value!.discount = discount;

                          if (createCardMemory.value) {
                            createCardMemory.value = createCardMemory.value;
                          }
                        }),
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

function _$CardNumberSlide(memory: CreateCardMemory | undefined) {
  const inputsAutoFocus = (index: number) =>
    debounce((event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      if (value.length >= 4) {
        const nextInput = document.querySelector<HTMLInputElement>(`#card-number-input-${index + 1}`);

        if (nextInput) nextInput.focus();
      }
      else if (value.length <= 0) {
        const previousInput = document.querySelector<HTMLInputElement>(`#card-number-input-${index - 1}`);

        if (previousInput) previousInput.focus();
      }
    }, 'AnimationFrame');

  // const x = ['', '', '', ''];

  return html`
    <div class="flex flex-col gap-4 items-center justify-center">
      <div class="text-primary [&>.gecut-icon]:text-[6rem]">${icon({svg: SolarCard2LineDuotone})}</div>
    </div>
    <div class="w-full text-center text-bodyMedium text-onSurfaceVariant">شماره کارت 16 رقمی خود را وارد کنید.</div>
    <div class="flex w-full gap-4" dir="ltr">
      ${map(
        null,
        arrayUtils.range(4),
        (i) => html`
          <label class="gecut-input !shrink">
            <input
              id="card-number-input-${i}"
              type="text"
              inputmode="numeric"
              class="card-number"
              name="cardNumber${i}"
              pattern="^[0-9]{4}$"
              maxlength="4"
              required
              .value=${memory?.card.cardNumber?.[i - 1] ?? ''}
              @keyup=${inputsAutoFocus(i)}
            />
          </label>
        `,
      )}
    </div>
  `;
}
function _$PreviewSlide(memory: CreateCardMemory | undefined) {
  const card = memory!.card;

  return html`
    ${until(
      when(card.cardNumber, () =>
        IranianBanks.getInfo(card.cardNumber!).then((bank) =>
          $CardRenderer(
            card.cardNumber!,
            card.iban ?? '',
            card.ownerName ?? '',
            bank,
            () =>
              html`<img
                src="https://cdn.k32.ir/mask.pattern.webp"
                class="absolute inset-0 w-full h-full z-above object-cover opacity-50"
              />`,
          ),
        ),
      ),
      html`<h2 class="text-onSurfaceVariant text-titleLarge text-center mb-4">در حال دانلود...</h2>`,
    )}

    <label class="px-4 flex gap-2">
      <input type="checkbox" name="confirm" />

      <span>اطلاعات فوق صحیح و آن را تایید میکنم.</span>
    </label>
  `;
}
function _$SlugSlide(memory: CreateCardMemory | undefined) {
  const slugOptions = new GecutState<{
    value: null | string;
    isExists: boolean;
    patternMismatch: boolean;
    loading: boolean;
  }>('slug.options', {
    value: memory?.card?.slug || null,
    isExists: false,
    patternMismatch: false,
    loading: false,
  });

  const onSlugInput = debounce((event: InputEvent) => {
    lower(event);

    const input = event.target as HTMLInputElement;

    if (input.validity.patternMismatch === true) {
      slugOptions.value = {
        value: memory?.card?.slug || null,
        isExists: slugOptions.value?.isExists ?? false,

        loading: false,
        patternMismatch: true,
      };

      return;
    }

    slugOptions.value = {
      loading: true,
      value: input.value,
      patternMismatch: false,
      isExists: slugOptions.value?.isExists ?? false,
    };

    client.card.slugExist.mutate({slug: input.value}).then((exist) => {
      slugOptions.value = {
        loading: false,
        isExists: exist,
        patternMismatch: false,
        value: slugOptions.value?.value ?? null,
      };

      if (exist) {
        return input.setCustomValidity('Slug is exists');
      }

      return input.setCustomValidity('');
    });
  }, 'IdleCallback');

  return html`
    <div class="flex flex-col gap-4 items-center justify-center">
      <div class="text-primary [&>.gecut-icon]:text-[6rem]">${icon({svg: SolarEarthLineDuotone})}</div>
    </div>

    <div class="flex flex-col w-full">
      <div class="w-full text-center text-bodyMedium text-onSurfaceVariant">دامنه مورد نظر خود را وارد نمایید.</div>
      <div class="w-full text-center text-bodySmall text-onSurfaceVariant">
        از دامنه جهت اشتراک گذاری کارت آنلاین استفاده خواهد شد.
      </div>
    </div>

    <label class="gecut-input">
      <input
        type="text"
        .value=${memory?.card?.slug ?? ''}
        name="slug"
        pattern="^[a-z0-9]{3,16}$"
        @input=${onSlugInput}
        required
      />

      ${slugOptions.hydrate(
        ({loading}) => html`
          <div class="loading ${loading ? 'opacity-1' : 'opacity-0'}">
            ${icon({
              svg: SvgSpinnersRingResize,
            })}
          </div>
        `,
      )}
    </label>

    ${slugOptions.hydrate(({patternMismatch, loading, isExists, value}) => [
      when(patternMismatch || (value?.trim().length ?? 0) == 0, () => [
        html`
          <ul class="*:text-error">
            <li>لطفا حداقل ۴ کاراکتر وارد کنید.</li>
            <li>تنها حروف انگلیسی یا اعداد مجاز هستند.</li>
            <li>حداکثر طول نام کاربری ۱۶ کاراکتر است.</li>
          </ul>
        `,
      ]),
      when(isExists, () => html`<span class="text-error">دامنه فوق موجود نمی باشد، دامنه دیگری انتخاب نمایید</span>`),
      when(loading, () => html`<span class="text-surfaceVariant">در حال بررسی ..</span>`),
      when(
        !isExists && !patternMismatch && !loading && (value?.trim().length ?? 0) > 0,
        () => html`
          <div class="w-full flex justify-between">
            <span class="text-primary" dir="ltr">:دامنه شما</span>
            <span class="text-primary" dir="ltr">k32.ir/${value}</span>
          </div>
        `,
      ),
    ])}
  `;
}

function _$PlansList(plans: PlanData[], planChangeEvent: (plan: CardData['subscription']) => void) {
  return html`
    <h1 class="text-bodyLarge text-center">پلن اشتراک خود را انتخاب کنید</h1>
    <div class="flex flex-col gap-4">
      ${map(
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
                @change=${() => planChangeEvent(plan)}
              />

              <div class="size-5 rounded-full bg-surfaceVariant flex items-center justify-center">
                <div class="size-3 rounded-full bg-transparent group-has-[:checked]:bg-primary"></div>
              </div>

              <div class="text-onSurface text-labelMedium grow">${unsafeHTML(plan.htmlTitle || plan.name)}</div>

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
      )}
    </div>
  `;
}
function _$PremiumOrder(_memory: CreateCardMemory | undefined) {
  return html`
    <div class="flex w-full gap-4 [&>*:first-child]:grow [&>*:last-child]:px-3">
      <label class="gecut-input">
        <input type="text" name="discount" pattern="^[A-Z0-9]{6}$" maxlength="6" placeholder="کد اختصاصی" />
      </label>
      ${gecutButton({
        type: 'filled',
        htmlType: 'button',
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
  `;
}
function _$NormalOrder(
  memory: CreateCardMemory | undefined,
  discountChangeEvent: (discount: DiscountData | null) => void,
) {
  const subscriptionPrice = memory?.card?.subscription?.price || 0;
  const discountPercentage = Math.min(
    memory?.discount?.discountType === 'percentage' ? memory?.discount?.discount : -1,
    100,
  );
  const discountDecimal =
    discountPercentage > 0 ? subscriptionPrice * (discountPercentage / 100) : memory?.discount?.discount || 0;

  const total = subscriptionPrice - discountDecimal;

  return html`
    <div class="flex w-full gap-4 [&>*:first-child]:grow [&>.gecut-button]:px-3">
      <label class="gecut-input !shrink">
        <input
          type="text"
          name="discount"
          pattern="^[A-Z0-9]{6}$"
          maxlength="6"
          placeholder="کد تخفیف"
          id="discountInput"
          .value=${memory?.discount?.code || ''}
          ?disabled=${memory?.card.subscription == null}
          @input=${upper}
        />
      </label>

      ${when(memory?.discount != null, () =>
        gecutButton({
          type: 'outlined',
          htmlType: 'button',
          label: 'حذف',
          events: {
            click: () => {
              discountChangeEvent(null);
            },
          },
        }),
      )}
      ${when(memory?.discount == null, () =>
        gecutButton({
          type: 'filledTonal',
          htmlType: 'button',
          label: 'اعمال تخفیف',
          disabled: memory?.card.subscription == null,
          events: {
            click: async () => {
              const input = document.querySelector<HTMLInputElement>('#discountInput');
              if (input == null) return;

              const planId = memory?.card?.subscription?._id;
              if (planId == null) return;

              const discount = await client.order.discount.get.mutate({
                discountCode: input.value,
                planId,
              });

              if (discount) {
                discountChangeEvent(discount);
              }
            },
          },
        }),
      )}
    </div>

    <div class="flex w-full justify-between items-center">
      <span>هزینه اشتراک</span>
      <span>${subscriptionPrice.toLocaleString('fa-IR')} ریال</span>
    </div>
    <div class="flex w-full justify-between items-center">
      <span>تخفیف</span>
      <div>
        ${when(discountPercentage > 0, () => html`<span>(${discountPercentage.toLocaleString('fa-IR')}%)</span>`)}

        <span>${discountDecimal.toLocaleString('fa-IR')} ریال</span>
      </div>
    </div>

    <div class="flex w-full justify-between items-center text-onSurface">
      <span>جمع کل</span>
      <span>${total.toLocaleString('fa-IR')} ریال</span>
    </div>
  `;
}
