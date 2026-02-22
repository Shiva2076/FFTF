import type { NextPage } from 'next';
import Image from 'next/image';
import BlurWrapper from '@/components/common/BlurWrapper';
interface GrowCycleTopCards {
  activeCyclesProfit?: any;
  harvestReadiness?: string;
  aiPredictedYield?: string;
  activeCropHealth?: string;
}
interface SnapshotSectionProps {
  growCycleTopCardsData?: GrowCycleTopCards;
  iot?: boolean;
  ai?: boolean;
}
const SnapshotSection: NextPage<SnapshotSectionProps> = ({ growCycleTopCardsData, iot = true, ai = true }) => {
  const snapshotData = [
    {
      title: 'Active Cycles Profit',
      value: typeof growCycleTopCardsData?.activeCyclesProfit === 'string' ? growCycleTopCardsData?.activeCyclesProfit : 'N/A',
      // value: "15 %",
      bgColor: '#008756',
      icon: 'apps/dashboard/activecyclesprofit.svg',
      iconSize: { width: 23, height: 24 },
      isBlurred: !iot, // IOT card
      messageType: 'iot' as const,
    },
    {
      title: 'Harvest Readiness',
      value: typeof growCycleTopCardsData?.harvestReadiness === 'string' ? growCycleTopCardsData?.harvestReadiness : 'N/A',
      bgColor: '#81b462',
      icon: 'apps/dashboard/harvestreadiness.svg',
      iconSize: { width: 24, height: 24 },
      isBlurred: !ai, // AI card
      messageType: 'ai' as const,
    },
    {
      title: 'AI Predicted Yield',
      // value:"7.76 kg",
      value: typeof growCycleTopCardsData?.aiPredictedYield === 'string' ? `~${growCycleTopCardsData.aiPredictedYield}` : 'N/A',
      bgColor: '#c8d04f',
      icon: 'apps/dashboard/aipredicatedyield.svg',
      iconSize: { width: 24, height: 23 },
      isBlurred: !ai, // AI card
      messageType: 'ai' as const,
    },
    {
      title: 'Active Crop Health',
      value: typeof growCycleTopCardsData?.activeCropHealth === 'string' ? growCycleTopCardsData?.activeCropHealth : 'N/A',
      bgColor: '#eea92b',
      icon: 'apps/dashboard/activecrophealth.svg',
      iconSize: { width: 20, height: 24 },
      isBlurred: !ai, // AI card
      messageType: 'ai' as const,
    },
  ];
  
  return (
    <div
    style={{
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: '1.5rem',
      textAlign: 'left',
      fontSize: '0.75rem',
      color: 'rgba(0, 18, 25, 0.6)',
      fontFamily: 'Poppins',
      flexWrap: 'wrap', // <-- Added for mobile responsiveness
    }}
    >
      {snapshotData.map((item, index) => (
        <div
          key={index}
          style={{
            flex: '1 1 200px', // <-- Added responsive card sizing
            borderRadius: '4px',
            backgroundColor: '#fff',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            {/* Text Section */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  letterSpacing: '1px',
                  lineHeight: '0%',
                  textTransform: 'uppercase',
                }}
              >
                {item.title}
              </div>
              <BlurWrapper isBlurred={item.isBlurred} messageType={item.messageType}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.25rem',
                      letterSpacing: '0.15px',
                      lineHeight: '160%',
                      fontWeight: '600',
                      color: 'rgba(0, 18, 25, 0.87)',
                    }}
                  >
                    {item.value}
                  </div>
                  {/* Icon Section */}
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '4px',
                      backgroundColor: item.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={`/${item.icon}`}
                      alt=""
                      width={item.iconSize.width}
                      height={item.iconSize.height}
                      style={{
                        width: 'auto',
                        maxHeight: '100%',
                      }}
                    />
                  </div>
                </div>
              </BlurWrapper>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SnapshotSection;