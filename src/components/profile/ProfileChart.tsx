'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

type Leg = {
  _id: string;
  firstname: string;
  lastname: string;
  legId: string;
  amount: number;
  tokens: number;
};

interface LegData {
  tokens: string | number;
  amount: string | number;
}

interface PieChartProps {
  data: Leg | Leg[];
  powerLeg: LegData;
  otherLegsInfo: LegData;
  height?: number | string;
}

// Dynamically import Highcharts with no SSR
const HighchartsReact = dynamic(
  () => import('highcharts-react-official').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="text-white">Loading chart...</div>
  }
);

// Function to generate distinct colors
const generateDistinctColors = (count: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360;
    const saturation = 70 + Math.random() * 30; // 70-100%
    const lightness = 50 + Math.random() * 10; // 50-60%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
};

const ProfileChart: React.FC<PieChartProps> = ({ 
  data, 
  powerLeg, 
  otherLegsInfo, 
  height = '100%',
}) => {
  const [Highcharts, setHighcharts] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: { type: 'pie' }
  });
  

  useEffect(() => {
    // Load Highcharts and modules only on client side
    const loadHighcharts = async () => {
      try {
        const hc = await import('highcharts');
        await import('highcharts/highcharts-3d');
        await import('highcharts/modules/exporting');
        await import('highcharts/modules/accessibility');
        
        setHighcharts(hc.default);
        
        // Safely merge both legs arrays
        const allLegs: Leg[] = Array.isArray(data) ? data : data ? [data] : [];
        const colors = generateDistinctColors(allLegs.length);
        
        setChartOptions({
          chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0,
              depth: 60,
              viewDistance: 25
            }
          },
          title: {
            text: '',
            style: { color: '#fff' }
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.2f} USDT</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 30,
              innerSize: '0%',
              dataLabels: {
                enabled: true, // Disable labels if too many items
                format: '<b>{point.name}</b><br>{point.y:.2f} USDT',
                style: {
                  color: 'white',
                  fontSize: '11px',
                  textOutline: 'none',
                  fontWeight: 'normal'
                },
                distance: 20,
                connectorColor: 'rgba(255,255,255,0.5)',
                connectorWidth: 1,
                connectorPadding: 5,
                softConnector: false
              }
            }
          },
          series: [{
            name: "Staking",
            type: "pie",
            data: allLegs.map((leg, index) => ({
              name: `${leg.firstname} ${leg.lastname}`,
              y: leg.amount ?? 0,
              color: colors[index],
            })),
          }],
          exporting: { enabled: false },
          navigation: { buttonOptions: { enabled: false } },
          credits: { enabled: false },
          legend: {
            enabled: allLegs.length > 10, // Show legend if too many items
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemStyle: { color: '#fff' }
          }
        });
      } catch (error) {
        console.error('Error loading Highcharts:', error);
      }
    };

    loadHighcharts();
  }, [data]);

  if (!Highcharts) {
    return <div className="text-white">Initializing chart...</div>;
  }

  return (
    <div className="rounded-full w-full">
      {/* Chart Section */}
      <div style={{ height }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </div>

      {/* Stats Section */}
      <div className="w-full">
        {/* Power Leg Stats */}
        <div className="flex items-center justify-between py-4 border-b border-dashed border-white/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src="/images/layrexlogo.png"
                width={24}
                height={24}
                alt="Token Icon"
                priority
              />
            </div>
            <div className="text-sm text-[#fff] font-medium">
              Power Leg Total Staking
            </div>
          </div>
          <div>
            <div className="text-right text-2xl text-[#ffc428] font-bold">
              {powerLeg?.tokens?.toString() || "0"}
            </div>
            <div className="text-right text-sm text-[#ffc428] font-semibold">
              ${powerLeg?.amount?.toString() || "0"}
            </div>
          </div>
        </div>

        {/* Other Legs Stats */}
        <div className="flex items-center justify-between py-4 border-b border-white/30 ">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src="/images/layrexlogo.png"
                width={24}
                height={24}
                alt="Token Icon"
                priority
              />
            </div>
            <div className="text-sm text-[#fff] font-medium">
              Other Legs Total Staking
            </div>
          </div>
          <div>
            <div className="text-right text-2xl text-[#ffc428] font-bold">
              {otherLegsInfo?.tokens?.toString() || "0"}
            </div>
            <div className="text-right text-sm text-[#ffc428] font-semibold">
              ${otherLegsInfo?.amount?.toString() || "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileChart;