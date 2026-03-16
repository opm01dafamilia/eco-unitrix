
UPDATE public.subscription_plans
SET kiwify_url = 'https://pay.kiwify.com.br/gLBLXaS',
    price_description = 'R$ 9,90 primeiro mês, depois R$ 19,90/mês'
WHERE app_key = 'fitpulse' AND billing_type = 'monthly';

UPDATE public.subscription_plans
SET kiwify_url = 'https://pay.kiwify.com.br/BDxFfhj',
    price_description = '12x R$ 15,20 ou R$ 147,00 à vista, depois R$ 197,00/ano'
WHERE app_key = 'fitpulse' AND billing_type = 'yearly';
