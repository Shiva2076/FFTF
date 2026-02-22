'use client';
import { api } from '@/constants';
import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';
import { checkMarketTrendSubscription } from '@/utils/utilsfuntions';
import { useDispatch,useSelector } from 'react-redux';
import { setCredentials } from '@/app/slices/authSlice';
import { RootState } from "@/app/store";

interface PayPalSubscriptionButtonProps {
  clientId: string;
  planId: string;
  onSubscribeSuccess: () => void; // ✅ NEW
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  clientId,
  planId,
  onSubscribeSuccess
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {

    if (!clientId || !planId) {
      logger.error('[PayPal] ❌ Missing clientId or planId');
      return;
    }

    const renderButton = () => {

      if (!window.paypal) {
        return;
      }

      if (!buttonRef.current) {
        return;
      }

      try {
        const buttons = window.paypal.Buttons({
          createSubscription: (data: any, actions: any) => {
            logger.info('[PayPal] 🔁 Creating subscription...');
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: async (data: any) => {
            logger.info('[PayPal] ✅ Subscription approved:', data);
            try {
              const productId = 'PROD-7J8311225Y800614T';
              logger.info('[PayPal] 🔁 Sending subscription to backend...');
              const subresponse = await api.post('/api/payments/completesubscription', {
                subscription_id: data.subscriptionID,
                product_id: productId,
              });
              const resData = subresponse.data;
              logger.info('[PayPal] ✅ Subscription sent to backend:', subresponse.data);
              logger.info('[PayPal] ✅ Subscription completed:', subresponse.data);
              const markettrendsubscription = checkMarketTrendSubscription(resData?.usersubscriptions || []);
              const updatedUserInfo = {
                user_id: resData?.new_subscription?.user_id || '',
                markettrendsubscribed: markettrendsubscription,
                username: userInfo?.username || '',
                email: userInfo?.email || '',
                role: userInfo?.role || '',
                verified: userInfo?.verified ?? false, 
              };
              dispatch(setCredentials(updatedUserInfo));
              onSubscribeSuccess();
            } catch (err: any) {
              logger.error('[PayPal] ❌ Error during subscription API call:', err);
              alert('An error occurred while completing your subscription. Please contact support.');
            }
          },
          onError: (err: any) => {
            logger.error('[PayPal] ❌ onError fired:', err);
          },
        });
        if (!buttons.isEligible()) {
          return;
        }
        buttons.render(buttonRef.current).then(() => {
          logger.info('[PayPal] ✅ Button rendered successfully');
        }).catch((err: any) => {
          logger.error('[PayPal] ❌ Error during render:', err);
        });
      } catch (err: any) {
        logger.error('[PayPal] ❌ Unhandled exception during button render:', err);
      }
    };

    const loadScript = () => {
      if (window.paypal) {
        logger.info('[PayPal] ✅ SDK already loaded');
        renderButton();
        return;
      }

      logger.info('[PayPal] ⬇️ Loading PayPal SDK...');
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
      script.async = true;

      script.onload = () => {
        logger.info('[PayPal] ✅ SDK loaded successfully');
        renderButton();
      };

      script.onerror = (err) => {
        logger.error('[PayPal] ❌ SDK failed to load:', err);
      };

      document.body.appendChild(script);
    };

    loadScript();
  }, [clientId, planId]);

  return <div ref={buttonRef} />;
};

export default PayPalSubscriptionButton;
